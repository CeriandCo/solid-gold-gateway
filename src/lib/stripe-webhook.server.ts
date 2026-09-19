import type Stripe from "stripe";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { peppered } from "./commerce.server";

export type WebhookOutcome = {
  status: 200 | 500;
  result: "processed" | "ignored" | "failed" | "duplicate";
  category?: string;
};

export type ProcessDeps = {
  /** Injected so the handler can be tested with a fake Stripe client and no key. */
  retrieveSession: (sessionId: string) => Promise<Stripe.Checkout.Session>;
};

const HANDLED_TYPES = new Set(["checkout.session.completed", "checkout.session.expired"]);
const STALE_PROCESSING_MS = 5 * 60 * 1000;
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@.]+(\.[^\s@.]+)+$/;

// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

export function cleanText(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(CONTROL_CHARS, "").trim();
  if (cleaned.length === 0) return null;
  return cleaned.slice(0, max);
}

export function cleanEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(CONTROL_CHARS, "").trim().toLowerCase();
  if (cleaned.length === 0 || cleaned.length > 254) return null;
  return EMAIL_RE.test(cleaned) ? cleaned : null;
}

export function customFieldValue(
  session: Stripe.Checkout.Session,
  key: string,
): string | null {
  const field = session.custom_fields?.find((entry) => entry.key === key);
  return field?.text?.value ?? null;
}

/** Records the event and returns false when another delivery already owns it. */
async function claimEvent(event: Stripe.Event): Promise<boolean> {
  const insert = await supabaseAdmin
    .from("stripe_events")
    .insert({
      event_id: event.id,
      type: event.type,
      livemode: event.livemode,
      status: "processing",
    })
    .select("event_id");

  if (!insert.error && insert.data && insert.data.length > 0) return true;

  const existing = await supabaseAdmin
    .from("stripe_events")
    .select("status, received_at")
    .eq("event_id", event.id)
    .maybeSingle();

  const row = existing.data;
  if (!row) return false;
  if (row.status === "processed" || row.status === "ignored") return false;

  const stale =
    row.status === "failed" ||
    Date.now() - new Date(row.received_at).getTime() > STALE_PROCESSING_MS;
  if (!stale) return false;

  // Conditional take-over: only one delivery can win this update.
  const takeover = await supabaseAdmin
    .from("stripe_events")
    .update({ status: "processing", received_at: new Date().toISOString(), error: null })
    .eq("event_id", event.id)
    .eq("status", row.status)
    .select("event_id");

  return !takeover.error && (takeover.data?.length ?? 0) > 0;
}

async function finishEvent(
  eventId: string,
  status: "processed" | "ignored" | "failed",
  category?: string,
) {
  await supabaseAdmin
    .from("stripe_events")
    .update({
      status,
      processed_at: new Date().toISOString(),
      error: category ?? null,
    })
    .eq("event_id", eventId);
}

function sessionPurpose(session: Stripe.Checkout.Session): string | null {
  return session.metadata?.["purpose"] ?? null;
}

async function handleCompleted(
  event: Stripe.Event,
  deps: ProcessDeps,
): Promise<{ result: "processed" | "ignored"; category?: string }> {
  const payload = event.data.object as Stripe.Checkout.Session;

  // Never trust the payload: re-fetch the session from Stripe.
  const session = await deps.retrieveSession(payload.id);
  if (sessionPurpose(session) !== "sqoot_gift_card") {
    return { result: "ignored", category: "not_gift_card" };
  }

  const orderResult = await supabaseAdmin
    .from("gift_card_orders")
    .select("id, amount_cents, currency, livemode, status")
    .eq("stripe_session_id", session.id)
    .maybeSingle();
  const order = orderResult.data;
  if (!order) return { result: "ignored", category: "order_not_found" };

  if (
    session.client_reference_id !== order.id ||
    session.metadata?.["order_id"] !== order.id
  ) {
    return { result: "ignored", category: "order_reference_mismatch" };
  }

  if (session.payment_status !== "paid") {
    return { result: "ignored", category: "not_paid" };
  }

  const moneyOk =
    session.mode === "payment" &&
    session.amount_total === order.amount_cents &&
    session.currency === order.currency &&
    session.livemode === order.livemode;

  const recipientName = cleanText(customFieldValue(session, "recipient_name"), 80);
  const recipientEmail = cleanEmail(customFieldValue(session, "recipient_email"));
  const giftMessage = cleanText(customFieldValue(session, "gift_message"), 255);

  const needsReview = !moneyOk || recipientEmail === null || recipientName === null;

  const paymentIntent = session.payment_intent;
  const intentId =
    typeof paymentIntent === "string" ? paymentIntent : (paymentIntent?.id ?? null);
  const charge =
    typeof paymentIntent === "string"
      ? null
      : ((paymentIntent?.latest_charge ?? null) as Stripe.Charge | string | null);
  const fingerprint =
    charge && typeof charge !== "string"
      ? (charge.payment_method_details?.card?.fingerprint ?? null)
      : null;

  const buyerEmail = session.customer_details?.email?.toLowerCase() ?? null;
  const fingerprintHash = fingerprint ? await peppered(fingerprint) : null;

  const settle = await supabaseAdmin.rpc("gift_card_order_settle", {
    _order_id: order.id,
    _event_id: event.id,
    _needs_review: needsReview,
    ...(intentId ? { _payment_intent_id: intentId } : {}),
    ...(recipientName ? { _recipient_name: recipientName } : {}),
    ...(recipientEmail ? { _recipient_email: recipientEmail } : {}),
    ...(giftMessage ? { _gift_message: giftMessage } : {}),
    ...(buyerEmail ? { _buyer_email: buyerEmail } : {}),
    ...(fingerprintHash ? { _card_fingerprint_hash: fingerprintHash } : {}),
  });


  if (settle.error) throw settle.error;
  return { result: "processed", ...(needsReview ? { category: "needs_review" } : {}) };
}

async function handleExpired(
  event: Stripe.Event,
): Promise<{ result: "processed" | "ignored"; category?: string }> {
  const session = event.data.object as Stripe.Checkout.Session;
  if (sessionPurpose(session) !== "sqoot_gift_card") {
    return { result: "ignored", category: "not_gift_card" };
  }

  // `.eq('status','open')` is the guard: a paid order is never touched.
  await supabaseAdmin
    .from("gift_card_orders")
    .update({ status: "expired", updated_at: new Date().toISOString() })
    .eq("stripe_session_id", session.id)
    .eq("status", "open");

  return { result: "processed" };
}

/**
 * Handles one verified Stripe event exactly once.
 * Signature verification and mode checking happen in the route; by the time an
 * event reaches here it is authentic.
 */
export async function processStripeEvent(
  event: Stripe.Event,
  deps: ProcessDeps,
): Promise<WebhookOutcome> {
  const claimed = await claimEvent(event);
  if (!claimed) return { status: 200, result: "duplicate" };

  try {
    if (!HANDLED_TYPES.has(event.type)) {
      await finishEvent(event.id, "ignored", "unhandled_type");
      return { status: 200, result: "ignored", category: "unhandled_type" };
    }

    const outcome =
      event.type === "checkout.session.completed"
        ? await handleCompleted(event, deps)
        : await handleExpired(event);

    await finishEvent(
      event.id,
      outcome.result === "processed" ? "processed" : "ignored",
      outcome.category,
    );
    return { status: 200, result: outcome.result, ...(outcome.category ? { category: outcome.category } : {}) };
  } catch (error) {
    console.error("[stripe-webhook] processing failed", (error as Error)?.name ?? "error");
    await finishEvent(event.id, "failed", "processing_error");
    return { status: 500, result: "failed", category: "processing_error" };
  }
}
