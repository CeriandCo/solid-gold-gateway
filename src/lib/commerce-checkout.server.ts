import { z } from "zod";
import { getRequestHeader } from "@tanstack/react-start/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { createStripeClient, getStripeSecretKey, isLiveKey, peppered } from "./commerce.server";
import { buildGiftCardSessionParams } from "./commerce/session-params";
import type { CheckoutResult, CheckoutStatusResult } from "./commerce/types";

const uuid = z.string().uuid();

// `.strict()` — a payload carrying anything else (an amount, a currency) is
// rejected outright rather than silently ignored.
const checkoutInput = z.object({ denominationId: uuid, attemptId: uuid }).strict();

const sessionIdInput = z
  .object({ sessionId: z.string().regex(/^cs_(test|live)_[A-Za-z0-9]+$/) })
  .strict();

const RATE_SHORT_WINDOW_MS = 15 * 60 * 1000;
const RATE_SHORT_MAX = 10;
const RATE_DAY_WINDOW_MS = 24 * 60 * 60 * 1000;
const RATE_DAY_MAX = 30;

/**
 * Cloudflare sets CF-Connecting-IP at its own edge and overwrites whatever the
 * caller sent, so it cannot be spoofed the way an X-Forwarded-For chain can.
 * Requests arriving without it (local dev) share a single bucket.
 */
async function clientIpHash(): Promise<string> {
  const ip = getRequestHeader("cf-connecting-ip") ?? getRequestHeader("x-real-ip") ?? "unknown";
  return peppered(ip);
}

/** Records the attempt, then reports whether this caller is over either limit. */
async function recordAndCheckRate(ipHash: string): Promise<boolean> {
  await supabaseAdmin.from("checkout_attempts").insert({ ip_hash: ipHash });

  const now = Date.now();
  const [shortWindow, dayWindow] = await Promise.all([
    supabaseAdmin
      .from("checkout_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", new Date(now - RATE_SHORT_WINDOW_MS).toISOString()),
    supabaseAdmin
      .from("checkout_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", new Date(now - RATE_DAY_WINDOW_MS).toISOString()),
  ]);

  return (shortWindow.count ?? 0) > RATE_SHORT_MAX || (dayWindow.count ?? 0) > RATE_DAY_MAX;
}

/**
 * Hardened Stripe Checkout Session creation.
 * The browser sends only a denomination id and an attempt id; amount, currency
 * and redirect origin are all decided here, from the database.
 */
export async function runGiftCardCheckout(data: unknown): Promise<CheckoutResult> {
  const parsed = checkoutInput.safeParse(data);
  if (!parsed.success) return { ok: false, code: "invalid_request" };
  const { denominationId, attemptId } = parsed.data;

  // 1. Kill switch + configuration, before any write.
  const settings = await supabaseAdmin
    .from("commerce_settings")
    .select("checkout_enabled, currency, allowed_origins, max_card_cents")
    .maybeSingle();
  const row = settings.data;
  const secretKey = getStripeSecretKey();
  if (!row || !row.checkout_enabled || !row.currency || !secretKey) {
    return { ok: false, code: "unavailable" };
  }
  const currency = row.currency;

  // 2. Rate limit by salted IP hash.
  const ipHash = await clientIpHash();
  if (await recordAndCheckRate(ipHash)) return { ok: false, code: "rate_limited" };

  // 3. Origin allowlist — redirects are built only from the matched entry.
  const origin = getRequestHeader("origin") ?? "";
  const allowed = (row.allowed_origins ?? []).find((entry) => entry === origin);
  if (!allowed) return { ok: false, code: "origin_not_allowed" };

  // 4. Denomination — the single source of truth for the amount.
  const denomination = await supabaseAdmin
    .from("gift_card_denominations")
    .select("id, amount_cents")
    .eq("id", denominationId)
    .eq("active", true)
    .maybeSingle();
  const denom = denomination.data;
  if (!denom || denom.amount_cents > row.max_card_cents) {
    return { ok: false, code: "invalid_request" };
  }

  // 5. A repeated attempt id never creates a second session.
  const existing = await supabaseAdmin
    .from("gift_card_orders")
    .select("id, stripe_session_id")
    .eq("attempt_id", attemptId)
    .maybeSingle();
  if (existing.data?.stripe_session_id) {
    try {
      const stripe = createStripeClient(secretKey);
      const session = await stripe.checkout.sessions.retrieve(existing.data.stripe_session_id);
      if (session.url && new URL(session.url).host === "checkout.stripe.com") {
        return { ok: true, url: session.url };
      }
    } catch {
      return { ok: false, code: "checkout_failed" };
    }
    return { ok: false, code: "checkout_failed" };
  }

  // 6. Create the order, then the session with an idempotency key.
  let orderId = existing.data?.id ?? null;
  if (!orderId) {
    const inserted = await supabaseAdmin
      .from("gift_card_orders")
      .insert({
        status: "open",
        attempt_id: attemptId,
        denomination_id: denom.id,
        amount_cents: denom.amount_cents,
        currency,
        client_ip_hash: ipHash,
        livemode: isLiveKey(secretKey),
      })
      .select("id")
      .single();
    if (inserted.error || !inserted.data) return { ok: false, code: "checkout_failed" };
    orderId = inserted.data.id;
  }

  const failOrder = async () => {
    await supabaseAdmin.from("gift_card_orders").update({ status: "failed" }).eq("id", orderId!);
  };

  const params = buildGiftCardSessionParams(
    { id: orderId, amountCents: denom.amount_cents },
    { id: denom.id, amountCents: denom.amount_cents },
    { currency },
    allowed,
  );

  try {
    const stripe = createStripeClient(secretKey);
    const session = await stripe.checkout.sessions.create(params, {
      idempotencyKey: `gift-card-${attemptId}`,
    });
    if (!session.url || new URL(session.url).host !== "checkout.stripe.com") {
      await failOrder();
      return { ok: false, code: "checkout_failed" };
    }
    await supabaseAdmin
      .from("gift_card_orders")
      .update({ stripe_session_id: session.id })
      .eq("id", orderId);
    return { ok: true, url: session.url };
  } catch {
    await failOrder();
    return { ok: false, code: "checkout_failed" };
  }
}

/**
 * Buyer-facing status after the Stripe redirect. Reads our own records only —
 * the redirect is never treated as proof of payment — and returns no personal
 * data of any kind.
 */
export async function runGiftCardCheckoutStatus(data: unknown): Promise<CheckoutStatusResult> {
  const parsed = sessionIdInput.safeParse(data);
  if (!parsed.success) return { status: "not_found" };

  const ipHash = await clientIpHash();
  if (await recordAndCheckRate(ipHash)) return { status: "not_found" };

  const order = await supabaseAdmin
    .from("gift_card_orders")
    .select("status, amount_cents, currency")
    .eq("stripe_session_id", parsed.data.sessionId)
    .maybeSingle();

  const found = order.data;
  if (!found) return { status: "not_found" };

  const paid =
    found.status === "paid" || found.status === "review" || found.status === "disputed";
  if (!paid && found.status !== "open") return { status: "not_found" };

  return {
    status: paid ? "paid" : "confirming",
    amountCents: found.amount_cents,
    currency: found.currency,
  };
}
