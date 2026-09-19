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

const HANDLED_TYPES = new Set([
  "checkout.session.completed",
  "checkout.session.expired",
  "charge.refunded",
  "charge.dispute.created",
  "charge.dispute.closed",
]);

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

  const reasons: string[] = [];
  if (session.mode !== "payment") reasons.push("mode_mismatch");
  if (session.amount_total !== order.amount_cents) reasons.push("amount_mismatch");
  if (session.currency !== order.currency) reasons.push("currency_mismatch");
  if (session.livemode !== order.livemode) reasons.push("livemode_mismatch");

  const recipientName = cleanText(customFieldValue(session, "recipient_name"), 80);
  const recipientEmail = cleanEmail(customFieldValue(session, "recipient_email"));
  const giftMessage = cleanText(customFieldValue(session, "gift_message"), 255);
  if (recipientEmail === null) reasons.push("invalid_recipient_email");
  if (recipientName === null) reasons.push("invalid_recipient_name");

  const paymentIntent = session.payment_intent;
  const intentId =
    typeof paymentIntent === "string" ? paymentIntent : (paymentIntent?.id ?? null);
  const charge =
    typeof paymentIntent === "string"
      ? null
      : ((paymentIntent?.latest_charge ?? null) as Stripe.Charge | string | null);
  const card =
    charge && typeof charge !== "string"
      ? (charge.payment_method_details?.card ?? null)
      : null;
  const fingerprint = card?.fingerprint ?? null;

  const riskLevel =
    charge && typeof charge !== "string" ? (charge.outcome?.risk_level ?? null) : null;
  if (riskLevel === "elevated" || riskLevel === "highest") reasons.push("radar_elevated");
  if (card?.funding === "prepaid") reasons.push("prepaid_card");

  // `high_value`, `no_3ds_high_value` and the three velocity rules are decided
  // inside the settle function, where the thresholds live and the advisory
  // locks make the velocity counts race-safe.
  const threeDsOk = card?.three_d_secure?.result === "authenticated";

  const buyerEmail = session.customer_details?.email?.toLowerCase() ?? null;
  const fingerprintHash = fingerprint ? await peppered(fingerprint) : null;

  const settle = await supabaseAdmin.rpc("gift_card_order_settle", {
    _order_id: order.id,
    _event_id: event.id,
    _review_reasons: reasons,
    _three_ds_ok: threeDsOk,
    ...(intentId ? { _payment_intent_id: intentId } : {}),
    ...(recipientName ? { _recipient_name: recipientName } : {}),
    ...(recipientEmail ? { _recipient_email: recipientEmail } : {}),
    ...(giftMessage ? { _gift_message: giftMessage } : {}),
    ...(buyerEmail ? { _buyer_email: buyerEmail } : {}),
    ...(fingerprintHash ? { _card_fingerprint_hash: fingerprintHash } : {}),
  });

  if (settle.error) throw settle.error;
  const outcome = settle.data as { review?: boolean } | null;
  return { result: "processed", ...(outcome?.review ? { category: "needs_review" } : {}) };
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

type Handled = { result: "processed" | "ignored"; category?: string };

type OrderCard = {
  order: { id: string; status: string; amount_cents: number };
  card: { id: string; status: string; delivered_at: string | null } | null;
};

async function raiseAlert(
  severity: "info" | "warning" | "critical",
  kind: string,
  orderId: string | null,
  cardId: string | null,
  message: string,
) {
  await supabaseAdmin.from("commerce_alerts").insert({
    severity,
    kind,
    order_id: orderId,
    gift_card_id: cardId,
    message,
  });
}

/** Moves a card through the state machine; every move is a ledger entry. */
async function moveCard(
  cardId: string,
  entryType: "review" | "freeze" | "unfreeze" | "deliver" | "void",
  newStatus: string,
  eventId: string,
) {
  const { error } = await supabaseAdmin.rpc("gift_card_record", {
    _gift_card_id: cardId,
    _entry_type: entryType,
    _actor: "system:webhook",
    _amount_cents: 0,
    _new_status: newStatus,
    _reference: eventId,
  });
  if (error) throw error;
}

/** Charges and disputes carry our payment intent; that is how we find the order. */
async function findByPaymentIntent(intentId: string | null): Promise<OrderCard | null> {
  if (!intentId) return null;
  const orderResult = await supabaseAdmin
    .from("gift_card_orders")
    .select("id, status, amount_cents")
    .eq("stripe_payment_intent_id", intentId)
    .maybeSingle();
  const order = orderResult.data;
  if (!order) return null;

  const cardResult = await supabaseAdmin
    .from("gift_cards")
    .select("id, status, delivered_at")
    .eq("order_id", order.id)
    .maybeSingle();

  return { order, card: cardResult.data ?? null };
}

function purposeAllows(metadata: Stripe.Metadata | null | undefined): boolean {
  const purpose = metadata?.["purpose"];
  return purpose === undefined || purpose === "sqoot_gift_card";
}

function intentIdOf(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "id" in value) {
    return String((value as { id: string }).id);
  }
  return null;
}

async function handleRefund(event: Stripe.Event): Promise<Handled> {
  const charge = event.data.object as Stripe.Charge;
  if (!purposeAllows(charge.metadata)) return { result: "ignored", category: "not_gift_card" };

  const found = await findByPaymentIntent(intentIdOf(charge.payment_intent));
  if (!found) return { result: "ignored", category: "order_not_found" };
  const { order, card } = found;

  const full = (charge.amount_refunded ?? 0) >= (charge.amount ?? 0);

  await supabaseAdmin
    .from("gift_card_orders")
    .update({ status: full ? "refunded" : "review", updated_at: new Date().toISOString() })
    .eq("id", order.id);

  if (!card) return { result: "processed", category: full ? "refunded" : "partial_refund" };

  if (card.status === "redeemed") {
    await raiseAlert(
      "critical",
      "refund_after_redemption",
      order.id,
      card.id,
      "Refund received for a gift card that was already redeemed; the metal was released.",
    );
    return { result: "processed", category: "redeemed_refund" };
  }

  if (full) {
    if (card.status === "delivered") {
      // The state machine has no delivered -> void edge, so go through frozen.
      await moveCard(card.id, "freeze", "frozen", event.id);
      await moveCard(card.id, "void", "void", event.id);
    } else if (card.status === "pending" || card.status === "review" || card.status === "active") {
      await moveCard(card.id, "void", "void", event.id);
    }
    return { result: "processed", category: "refunded" };
  }

  if (card.status === "active" || card.status === "delivered") {
    await moveCard(card.id, "freeze", "frozen", event.id);
  } else if (card.status === "pending") {
    await moveCard(card.id, "review", "review", event.id);
  }
  await raiseAlert(
    "warning",
    "partial_refund",
    order.id,
    card.id,
    "Partial refund received; the gift card was held pending a human decision.",
  );
  return { result: "processed", category: "partial_refund" };
}

async function handleDisputeCreated(event: Stripe.Event): Promise<Handled> {
  const dispute = event.data.object as Stripe.Dispute;
  if (!purposeAllows(dispute.metadata)) return { result: "ignored", category: "not_gift_card" };

  const found = await findByPaymentIntent(intentIdOf(dispute.payment_intent));
  if (!found) return { result: "ignored", category: "order_not_found" };
  const { order, card } = found;

  await supabaseAdmin
    .from("gift_card_orders")
    .update({ status: "disputed", updated_at: new Date().toISOString() })
    .eq("id", order.id);

  if (card) {
    if (card.status === "redeemed") {
      await raiseAlert(
        "critical",
        "dispute_after_redemption",
        order.id,
        card.id,
        "Dispute opened on a gift card that was already redeemed; the metal was released.",
      );
    } else if (card.status === "pending") {
      await moveCard(card.id, "review", "review", event.id);
    } else if (card.status === "active" || card.status === "delivered") {
      await moveCard(card.id, "freeze", "frozen", event.id);
    }
  }

  await raiseAlert(
    "warning",
    "dispute_created",
    order.id,
    card?.id ?? null,
    "Dispute opened on a gift card payment.",
  );
  return { result: "processed", category: "dispute_created" };
}

async function handleDisputeClosed(event: Stripe.Event): Promise<Handled> {
  const dispute = event.data.object as Stripe.Dispute;
  if (!purposeAllows(dispute.metadata)) return { result: "ignored", category: "not_gift_card" };

  const found = await findByPaymentIntent(intentIdOf(dispute.payment_intent));
  if (!found) return { result: "ignored", category: "order_not_found" };
  const { order, card } = found;

  if (dispute.status === "won") {
    await supabaseAdmin
      .from("gift_card_orders")
      .update({ status: "paid", updated_at: new Date().toISOString() })
      .eq("id", order.id);

    // A frozen card returns to where it was; a card in review waits for a human.
    if (card && card.status === "frozen") {
      const restored = card.delivered_at ? "delivered" : "active";
      await moveCard(
        card.id,
        restored === "delivered" ? "deliver" : "unfreeze",
        restored,
        event.id,
      );
    }
    await raiseAlert(
      "info",
      "dispute_won",
      order.id,
      card?.id ?? null,
      "Dispute closed in our favour.",
    );
    return { result: "processed", category: "dispute_won" };
  }

  if (dispute.status === "lost") {
    if (card && ["pending", "review", "frozen"].includes(card.status)) {
      await moveCard(card.id, "void", "void", event.id);
    }
    await raiseAlert(
      "warning",
      "dispute_lost",
      order.id,
      card?.id ?? null,
      "Dispute lost; the gift card was voided.",
    );
    return { result: "processed", category: "dispute_lost" };
  }

  return { result: "ignored", category: "dispute_not_closed" };
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

    const handlers: Record<string, () => Promise<Handled>> = {
      "checkout.session.completed": () => handleCompleted(event, deps),
      "checkout.session.expired": () => handleExpired(event),
      "charge.refunded": () => handleRefund(event),
      "charge.dispute.created": () => handleDisputeCreated(event),
      "charge.dispute.closed": () => handleDisputeClosed(event),
    };
    const outcome = await handlers[event.type]!();


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
