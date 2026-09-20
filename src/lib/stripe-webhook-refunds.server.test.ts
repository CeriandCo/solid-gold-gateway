import { afterAll, describe, expect, it } from "vitest";
import type Stripe from "stripe";
import { processStripeEvent } from "./stripe-webhook.server";
import type { ProcessDeps } from "./stripe-webhook.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { purgeTrackedOrders, trackTestOrder } from "@/lib/commerce/test-orders";

const uuid = () => crypto.randomUUID();
const createdEvents: string[] = [];
const createdOrders: string[] = [];

const CLEAN_AMOUNT = 25_000; // under the 100_000 review threshold

type SessionOverrides = Record<string, unknown>;
type CardDetails = Record<string, unknown>;

async function createOrder(amountCents = CLEAN_AMOUNT) {
  const { data, error } = await supabaseAdmin
    .from("gift_card_orders")
    .insert({
      status: "open",
      amount_cents: amountCents,
      currency: "usd",
      livemode: false,
      stripe_session_id: `cs_test_${uuid().replace(/-/g, "")}`,
    })
    .select("id, stripe_session_id")
    .single();
  if (error) throw error;
  createdOrders.push(trackTestOrder(data.id));
  return data;
}

function session(
  sessionId: string,
  orderId: string,
  opts: {
    amount?: number;
    buyerEmail?: string;
    recipientEmail?: string;
    fingerprint?: string;
    card?: CardDetails;
    outcome?: Record<string, unknown>;
    intentId?: string;
    overrides?: SessionOverrides;
  } = {},
): Stripe.Checkout.Session {
  const amount = opts.amount ?? CLEAN_AMOUNT;
  return {
    id: sessionId,
    object: "checkout.session",
    mode: "payment",
    payment_status: "paid",
    amount_total: amount,
    currency: "usd",
    livemode: false,
    client_reference_id: orderId,
    metadata: { order_id: orderId, purpose: "sqoot_gift_card" },
    customer_details: { email: opts.buyerEmail ?? `buyer-${uuid()}@example.com` },
    custom_fields: [
      { key: "recipient_name", text: { value: "Ada Lovelace" } },
      {
        key: "recipient_email",
        text: { value: opts.recipientEmail ?? `recipient-${uuid()}@example.com` },
      },
    ],
    payment_intent: {
      id: opts.intentId ?? `pi_test_${uuid().replace(/-/g, "")}`,
      latest_charge: {
        outcome: opts.outcome ?? { risk_level: "normal" },
        payment_method_details: {
          card: {
            fingerprint: opts.fingerprint ?? `fp_${uuid()}`,
            funding: "credit",
            three_d_secure: { result: "authenticated" },
            ...(opts.card ?? {}),
          },
        },
      },
    },
    ...(opts.overrides ?? {}),
  } as unknown as Stripe.Checkout.Session;
}

function event(type: string, object: unknown): Stripe.Event {
  const id = `evt_test_${uuid().replace(/-/g, "")}`;
  createdEvents.push(id);
  return {
    id,
    object: "event",
    type,
    livemode: false,
    created: Math.floor(Date.now() / 1000),
    data: { object },
  } as unknown as Stripe.Event;
}

const deps = (s: Stripe.Checkout.Session): ProcessDeps => ({ retrieveSession: async () => s });

async function settle(opts: Parameters<typeof session>[2] = {}, amount = CLEAN_AMOUNT) {
  const order = await createOrder(amount);
  const s = session(order.stripe_session_id!, order.id, { ...opts, amount });
  await processStripeEvent(event("checkout.session.completed", s), deps(s));
  return { orderId: order.id, intentId: (s.payment_intent as { id: string }).id };
}

async function orderRow(orderId: string) {
  const { data } = await supabaseAdmin
    .from("gift_card_orders")
    .select("status, review_reasons, amount_cents")
    .eq("id", orderId)
    .single();
  return data!;
}

async function cardRow(orderId: string) {
  const { data } = await supabaseAdmin
    .from("gift_cards")
    .select("id, status, delivered_at, balance_cents, amount_cents")
    .eq("order_id", orderId)
    .maybeSingle();
  return data;
}

async function ledgerFor(cardId: string) {
  const { data } = await supabaseAdmin
    .from("gift_card_ledger")
    .select("entry_type, balance_after, actor, reference")
    .eq("gift_card_id", cardId)
    .order("id", { ascending: true });
  return data ?? [];
}

async function alertsFor(orderId: string) {
  const { data } = await supabaseAdmin
    .from("commerce_alerts")
    .select("severity, kind")
    .eq("order_id", orderId);
  return data ?? [];
}

/** Drives a card forward through the state machine for refund/dispute scenarios. */
async function setCardStatus(cardId: string, status: "active" | "delivered" | "redeemed") {
  const path: Array<[string, string]> =
    status === "active"
      ? [["activate", "active"]]
      : status === "delivered"
        ? [
            ["activate", "active"],
            ["deliver", "delivered"],
          ]
        : [
            ["activate", "active"],
            ["deliver", "delivered"],
            ["redeem", "redeemed"],
          ];
  for (const [entry, next] of path) {
    const { error } = await supabaseAdmin.rpc("gift_card_record", {
      _gift_card_id: cardId,
      _entry_type: entry,
      _actor: "system:test",
      _amount_cents: 0,
      _new_status: next,
      _reference: "test:setup",
    });
    if (error) throw error;
  }
}

function refundCharge(intentId: string, amount: number, refunded: number) {
  return {
    id: `ch_test_${uuid().replace(/-/g, "")}`,
    object: "charge",
    amount,
    amount_refunded: refunded,
    payment_intent: intentId,
    metadata: { purpose: "sqoot_gift_card" },
  };
}

function dispute(intentId: string, status: string) {
  return {
    id: `dp_test_${uuid().replace(/-/g, "")}`,
    object: "dispute",
    status,
    payment_intent: intentId,
    metadata: { purpose: "sqoot_gift_card" },
  };
}

afterAll(async () => {
  if (createdEvents.length > 0) {
    await supabaseAdmin.from("stripe_events").delete().in("event_id", createdEvents);
  }
  await purgeTrackedOrders();
});

describe("oversized bodies", () => {
  it("refuses a body over 256 KB with 413 and writes nothing", async () => {
    process.env["STRIPE_SECRET_KEY"] = "sk_test_placeholder_for_tests";
    process.env["STRIPE_WEBHOOK_SECRET"] = "whsec_test_only_local_value";
    const { Route } = await import("@/routes/api/public/stripe-webhook");
    const handler = (
      Route.options as unknown as {
        server: { handlers: { POST: (ctx: { request: Request }) => Promise<Response> } };
      }
    ).server.handlers.POST;

    const before = await supabaseAdmin
      .from("stripe_events")
      .select("event_id", { count: "exact", head: true });
    const response = await handler({
      request: new Request("https://example.test/api/public/stripe-webhook", {
        method: "POST",
        headers: { "stripe-signature": "t=1,v1=x", "content-type": "application/json" },
        body: "x".repeat(300 * 1024),
      }),
    });
    const after = await supabaseAdmin
      .from("stripe_events")
      .select("event_id", { count: "exact", head: true });

    delete process.env["STRIPE_SECRET_KEY"];
    delete process.env["STRIPE_WEBHOOK_SECRET"];
    expect(response.status).toBe(413);
    expect(after.count).toBe(before.count);
  });
});

describe("fraud review rules", () => {
  it("leaves a clean payment pending with no reasons", async () => {
    const { orderId } = await settle();
    const order = await orderRow(orderId);
    expect(order.status).toBe("paid");
    expect(order.review_reasons).toEqual([]);
    expect((await cardRow(orderId))?.status).toBe("pending");
  });

  it("flags an elevated risk level", async () => {
    const { orderId } = await settle({ outcome: { risk_level: "elevated" } });
    const order = await orderRow(orderId);
    expect(order.status).toBe("review");
    expect(order.review_reasons).toContain("radar_elevated");
    expect((await cardRow(orderId))?.status).toBe("review");
  });

  it("flags a prepaid card", async () => {
    const { orderId } = await settle({ card: { funding: "prepaid" } });
    expect((await orderRow(orderId)).review_reasons).toContain("prepaid_card");
  });

  it("flags a high value payment and a high value payment without 3DS", async () => {
    const plain = await settle({}, 100_000);
    const plainOrder = await orderRow(plain.orderId);
    expect(plainOrder.review_reasons).toContain("high_value");
    expect(plainOrder.review_reasons).not.toContain("no_3ds_high_value");

    const no3ds = await settle({ card: { three_d_secure: { result: "not_authenticated" } } }, 100_000);
    const no3dsOrder = await orderRow(no3ds.orderId);
    expect(no3dsOrder.review_reasons).toContain("high_value");
    expect(no3dsOrder.review_reasons).toContain("no_3ds_high_value");
  });

  it("flags the same card used past the daily limit", async () => {
    const fingerprint = `fp_shared_${uuid()}`;
    const first = await settle({ fingerprint }, 150_000);
    expect((await orderRow(first.orderId)).review_reasons).toContain("high_value");
    const second = await settle({ fingerprint }, 150_000);
    expect((await orderRow(second.orderId)).review_reasons).toContain("daily_limit_card");
  });

  it("flags one recipient funded by two different buyers", async () => {
    const recipientEmail = `shared-${uuid()}@example.com`;
    await settle({ recipientEmail, buyerEmail: `a-${uuid()}@example.com` }, 150_000);
    const second = await settle(
      { recipientEmail, buyerEmail: `b-${uuid()}@example.com` },
      150_000,
    );
    expect((await orderRow(second.orderId)).review_reasons).toContain("daily_limit_recipient");
  });

  it("keeps two concurrent settlements for one buyer under the limit race-safe", async () => {
    const buyerEmail = `race-${uuid()}@example.com`;
    const a = await createOrder(150_000);
    const b = await createOrder(150_000);
    const sa = session(a.stripe_session_id!, a.id, { amount: 150_000, buyerEmail });
    const sb = session(b.stripe_session_id!, b.id, { amount: 150_000, buyerEmail });

    await Promise.all([
      processStripeEvent(event("checkout.session.completed", sa), deps(sa)),
      processStripeEvent(event("checkout.session.completed", sb), deps(sb)),
    ]);

    const statuses = [
      (await orderRow(a.id)).review_reasons,
      (await orderRow(b.id)).review_reasons,
    ];
    const flagged = statuses.filter((reasons) => reasons.includes("daily_limit_email"));
    expect(flagged).toHaveLength(1);
  });
});

describe("refunds", () => {
  it("voids a pending card on a full refund", async () => {
    const { orderId, intentId } = await settle();
    const card = await cardRow(orderId);
    await processStripeEvent(
      event("charge.refunded", refundCharge(intentId, CLEAN_AMOUNT, CLEAN_AMOUNT)),
      deps(session("cs_x", orderId)),
    );
    expect((await orderRow(orderId)).status).toBe("refunded");
    expect((await cardRow(orderId))?.status).toBe("void");
    expect((await ledgerFor(card!.id)).map((e) => e.entry_type)).toEqual(["issue", "void"]);
  });

  it("voids an active card on a full refund", async () => {
    const { orderId, intentId } = await settle();
    const card = await cardRow(orderId);
    await setCardStatus(card!.id, "active");
    await processStripeEvent(
      event("charge.refunded", refundCharge(intentId, CLEAN_AMOUNT, CLEAN_AMOUNT)),
      deps(session("cs_x", orderId)),
    );
    expect((await cardRow(orderId))?.status).toBe("void");
  });

  it("voids a delivered card through frozen, as two ledger entries", async () => {
    const { orderId, intentId } = await settle();
    const card = await cardRow(orderId);
    await setCardStatus(card!.id, "delivered");
    await processStripeEvent(
      event("charge.refunded", refundCharge(intentId, CLEAN_AMOUNT, CLEAN_AMOUNT)),
      deps(session("cs_x", orderId)),
    );
    expect((await cardRow(orderId))?.status).toBe("void");
    const entries = (await ledgerFor(card!.id)).map((e) => e.entry_type);
    expect(entries.slice(-2)).toEqual(["freeze", "void"]);
  });

  it("freezes an active card and alerts on a partial refund", async () => {
    const { orderId, intentId } = await settle();
    const card = await cardRow(orderId);
    await setCardStatus(card!.id, "active");
    await processStripeEvent(
      event("charge.refunded", refundCharge(intentId, CLEAN_AMOUNT, 5_000)),
      deps(session("cs_x", orderId)),
    );
    expect((await orderRow(orderId)).status).toBe("review");
    expect((await cardRow(orderId))?.status).toBe("frozen");
    expect((await alertsFor(orderId)).some((a) => a.kind === "partial_refund")).toBe(true);
  });

  it("puts a pending card into review on a partial refund", async () => {
    const { orderId, intentId } = await settle();
    await processStripeEvent(
      event("charge.refunded", refundCharge(intentId, CLEAN_AMOUNT, 5_000)),
      deps(session("cs_x", orderId)),
    );
    expect((await cardRow(orderId))?.status).toBe("review");
  });

  it("raises a critical alert when a redeemed card is refunded", async () => {
    const { orderId, intentId } = await settle();
    const card = await cardRow(orderId);
    await setCardStatus(card!.id, "redeemed");
    await processStripeEvent(
      event("charge.refunded", refundCharge(intentId, CLEAN_AMOUNT, CLEAN_AMOUNT)),
      deps(session("cs_x", orderId)),
    );
    expect((await cardRow(orderId))?.status).toBe("redeemed");
    const alerts = await alertsFor(orderId);
    expect(alerts.some((a) => a.severity === "critical")).toBe(true);
  });

  it("is a no-op when the same refund event is replayed", async () => {
    const { orderId, intentId } = await settle();
    const card = await cardRow(orderId);
    const refundEvent = event("charge.refunded", refundCharge(intentId, CLEAN_AMOUNT, CLEAN_AMOUNT));
    await processStripeEvent(refundEvent, deps(session("cs_x", orderId)));
    const replay = await processStripeEvent(refundEvent, deps(session("cs_x", orderId)));
    expect(replay).toMatchObject({ result: "duplicate" });
    expect((await ledgerFor(card!.id)).map((e) => e.entry_type)).toEqual(["issue", "void"]);
  });
});

describe("disputes", () => {
  it("freezes an active card, then restores it when the dispute is won", async () => {
    const { orderId, intentId } = await settle();
    const card = await cardRow(orderId);
    await setCardStatus(card!.id, "active");

    await processStripeEvent(
      event("charge.dispute.created", dispute(intentId, "needs_response")),
      deps(session("cs_x", orderId)),
    );
    expect((await orderRow(orderId)).status).toBe("disputed");
    expect((await cardRow(orderId))?.status).toBe("frozen");

    await processStripeEvent(
      event("charge.dispute.closed", dispute(intentId, "won")),
      deps(session("cs_x", orderId)),
    );
    expect((await orderRow(orderId)).status).toBe("paid");
    expect((await cardRow(orderId))?.status).toBe("active");
    expect((await alertsFor(orderId)).some((a) => a.severity === "info")).toBe(true);
  });

  it("restores a delivered card to delivered when the dispute is won", async () => {
    const { orderId, intentId } = await settle();
    const card = await cardRow(orderId);
    await setCardStatus(card!.id, "delivered");
    await processStripeEvent(
      event("charge.dispute.created", dispute(intentId, "needs_response")),
      deps(session("cs_x", orderId)),
    );
    await processStripeEvent(
      event("charge.dispute.closed", dispute(intentId, "won")),
      deps(session("cs_x", orderId)),
    );
    expect((await cardRow(orderId))?.status).toBe("delivered");
  });

  it("keeps a card in review when a dispute is won", async () => {
    const { orderId, intentId } = await settle();
    await processStripeEvent(
      event("charge.dispute.created", dispute(intentId, "needs_response")),
      deps(session("cs_x", orderId)),
    );
    expect((await cardRow(orderId))?.status).toBe("review");
    await processStripeEvent(
      event("charge.dispute.closed", dispute(intentId, "won")),
      deps(session("cs_x", orderId)),
    );
    expect((await cardRow(orderId))?.status).toBe("review");
  });

  it("voids the card when a dispute is lost", async () => {
    const { orderId, intentId } = await settle();
    await processStripeEvent(
      event("charge.dispute.created", dispute(intentId, "needs_response")),
      deps(session("cs_x", orderId)),
    );
    await processStripeEvent(
      event("charge.dispute.closed", dispute(intentId, "lost")),
      deps(session("cs_x", orderId)),
    );
    expect((await orderRow(orderId)).status).toBe("disputed");
    expect((await cardRow(orderId))?.status).toBe("void");
    expect((await alertsFor(orderId)).some((a) => a.kind === "dispute_lost")).toBe(true);
  });

  it("raises a critical alert when a redeemed card is disputed", async () => {
    const { orderId, intentId } = await settle();
    const card = await cardRow(orderId);
    await setCardStatus(card!.id, "redeemed");
    await processStripeEvent(
      event("charge.dispute.created", dispute(intentId, "needs_response")),
      deps(session("cs_x", orderId)),
    );
    expect((await cardRow(orderId))?.status).toBe("redeemed");
    expect((await alertsFor(orderId)).some((a) => a.severity === "critical")).toBe(true);
  });
});

describe("ledger integrity", () => {
  it("stays append-only with a consistent running balance", async () => {
    const { orderId } = await settle();
    const card = await cardRow(orderId);
    const entries = await ledgerFor(card!.id);
    expect(entries[0]?.balance_after).toBe(CLEAN_AMOUNT);

    const update = await supabaseAdmin
      .from("gift_card_ledger")
      .update({ actor: "tamper" })
      .eq("gift_card_id", card!.id);
    expect(update.error?.message ?? "").toContain("append-only");

    const remove = await supabaseAdmin
      .from("gift_card_ledger")
      .delete()
      .eq("gift_card_id", card!.id);
    expect(remove.error?.message ?? "").toContain("append-only");

    for (const entry of await ledgerFor(card!.id)) {
      expect(entry.balance_after).toBe(CLEAN_AMOUNT);
      expect(entry.balance_after).toBeLessThanOrEqual(card!.amount_cents);
    }
  });
});
