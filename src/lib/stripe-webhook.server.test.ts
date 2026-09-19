import { afterAll, beforeAll, describe, expect, it } from "vitest";
import Stripe from "stripe";
import type { ProcessDeps } from "./stripe-webhook.server";
import { processStripeEvent } from "./stripe-webhook.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Throwaway values that exist only inside this test run.
const TEST_WEBHOOK_SECRET = "whsec_test_only_local_value_not_a_real_secret";
const TEST_KEY = "sk_test_placeholder_for_tests";

const stripe = new Stripe(TEST_KEY, { apiVersion: "2025-08-27.basil" });

const createdOrders: string[] = [];
const createdEvents: string[] = [];

const uuid = () => crypto.randomUUID();

async function createOrder(overrides: Record<string, unknown> = {}) {
  const sessionId = `cs_test_${uuid().replace(/-/g, "")}`;
  const { data, error } = await supabaseAdmin
    .from("gift_card_orders")
    .insert({
      status: "open",
      amount_cents: 25000,
      currency: "usd",
      livemode: false,
      stripe_session_id: sessionId,
      ...overrides,
    })
    .select("id, stripe_session_id")
    .single();
  if (error) throw error;
  createdOrders.push(data.id);
  return data;
}

type SessionOverrides = Partial<Record<string, unknown>>;

function fakeSession(
  sessionId: string,
  orderId: string,
  overrides: SessionOverrides = {},
): Stripe.Checkout.Session {
  return {
    id: sessionId,
    object: "checkout.session",
    mode: "payment",
    payment_status: "paid",
    amount_total: 25000,
    currency: "usd",
    livemode: false,
    client_reference_id: orderId,
    metadata: { order_id: orderId, purpose: "sqoot_gift_card" },
    customer_details: { email: "Buyer@Example.COM" },
    custom_fields: [
      { key: "recipient_name", text: { value: "  Ada\u0007 Lovelace  " } },
      { key: "recipient_email", text: { value: " Recipient@Example.COM " } },
      { key: "gift_message", text: { value: "Happy\u0000 birthday" } },
    ],
    payment_intent: {
      id: `pi_test_${uuid().replace(/-/g, "")}`,
      latest_charge: {
        payment_method_details: { card: { fingerprint: "fp_raw_secret_value" } },
      },
    },
    ...overrides,
  } as unknown as Stripe.Checkout.Session;
}

function makeEvent(
  type: string,
  session: Stripe.Checkout.Session,
  livemode = false,
): Stripe.Event {
  const id = `evt_test_${uuid().replace(/-/g, "")}`;
  createdEvents.push(id);
  return {
    id,
    object: "event",
    type,
    livemode,
    created: Math.floor(Date.now() / 1000),
    data: { object: session },
  } as unknown as Stripe.Event;
}

const depsFor = (session: Stripe.Checkout.Session): ProcessDeps => ({
  retrieveSession: async () => session,
});

async function cardFor(orderId: string) {
  const { data } = await supabaseAdmin
    .from("gift_cards")
    .select("id, status, amount_cents, balance_cents, hold_until")
    .eq("order_id", orderId)
    .maybeSingle();
  return data;
}

async function orderRow(orderId: string) {
  const { data } = await supabaseAdmin
    .from("gift_card_orders")
    .select(
      "status, paid_at, recipient_name, recipient_email, gift_message, buyer_email, card_fingerprint_hash, stripe_payment_intent_id",
    )
    .eq("id", orderId)
    .single();
  return data!;
}

beforeAll(() => {
  process.env["STRIPE_SECRET_KEY"] = TEST_KEY;
  process.env["STRIPE_WEBHOOK_SECRET"] = TEST_WEBHOOK_SECRET;
});

afterAll(async () => {
  delete process.env["STRIPE_SECRET_KEY"];
  delete process.env["STRIPE_WEBHOOK_SECRET"];
  if (createdEvents.length > 0) {
    await supabaseAdmin.from("stripe_events").delete().in("event_id", createdEvents);
  }
  // Ledger rows are append-only, so cards and orders are purged by the
  // verification cleanup step that runs with the trigger disabled.
});

describe("stripe webhook route guards", () => {
  const routeHandler = async (body: string, signature: string) => {
    const { Route } = await import("@/routes/api/public/stripe-webhook");
    const handler = (
      Route.options as unknown as {
        server: { handlers: { POST: (ctx: { request: Request }) => Promise<Response> } };
      }
    ).server.handlers.POST;
    return handler({
      request: new Request("https://example.test/api/public/stripe-webhook", {
        method: "POST",
        headers: { "stripe-signature": signature, "content-type": "application/json" },
        body,
      }),
    });
  };

  it("rejects a bad signature with 400 and writes nothing", async () => {
    const before = await supabaseAdmin
      .from("stripe_events")
      .select("event_id", { count: "exact", head: true });
    const response = await routeHandler(JSON.stringify({ id: "evt_fake" }), "t=1,v1=deadbeef");
    expect(response.status).toBe(400);
    const after = await supabaseAdmin
      .from("stripe_events")
      .select("event_id", { count: "exact", head: true });
    expect(after.count).toBe(before.count);
  });

  it("rejects a livemode mismatch with 400", async () => {
    const payload = JSON.stringify({
      id: `evt_test_${uuid().replace(/-/g, "")}`,
      object: "event",
      type: "checkout.session.completed",
      livemode: true,
      data: { object: { id: "cs_test_x", object: "checkout.session" } },
    });
    const signature = stripe.webhooks.generateTestHeaderString({
      payload,
      secret: TEST_WEBHOOK_SECRET,
    });
    const response = await routeHandler(payload, signature);
    expect(response.status).toBe(400);
  });

  it("accepts a correctly signed payload", async () => {
    const payload = JSON.stringify({
      id: `evt_test_${uuid().replace(/-/g, "")}`,
      object: "event",
      type: "customer.created",
      livemode: false,
      data: { object: { id: "cus_test_x", object: "customer" } },
    });
    createdEvents.push(JSON.parse(payload).id);
    const signature = stripe.webhooks.generateTestHeaderString({
      payload,
      secret: TEST_WEBHOOK_SECRET,
    });
    const response = await routeHandler(payload, signature);
    expect(response.status).toBe(200);
  });
});

describe("processStripeEvent", () => {
  it("ignores an unhandled event type", async () => {
    const order = await createOrder();
    const event = makeEvent(
      "payment_intent.succeeded",
      fakeSession(order.stripe_session_id!, order.id),
    );
    const outcome = await processStripeEvent(event, depsFor(fakeSession(order.stripe_session_id!, order.id)));
    expect(outcome).toMatchObject({ status: 200, result: "ignored", category: "unhandled_type" });
    const stored = await supabaseAdmin
      .from("stripe_events")
      .select("status")
      .eq("event_id", event.id)
      .single();
    expect(stored.data?.status).toBe("ignored");
  });

  it("settles a paid session: order paid, one pending card, sanitised fields", async () => {
    const order = await createOrder();
    const session = fakeSession(order.stripe_session_id!, order.id);
    const event = makeEvent("checkout.session.completed", session);

    const outcome = await processStripeEvent(event, depsFor(session));
    expect(outcome).toMatchObject({ status: 200, result: "processed" });

    const row = await orderRow(order.id);
    expect(row.status).toBe("paid");
    expect(row.paid_at).not.toBeNull();
    expect(row.recipient_name).toBe("Ada Lovelace");
    expect(row.recipient_email).toBe("recipient@example.com");
    expect(row.gift_message).toBe("Happy birthday");
    expect(row.buyer_email).toBe("buyer@example.com");
    expect(row.card_fingerprint_hash).toMatch(/^[0-9a-f]{64}$/);
    expect(row.card_fingerprint_hash).not.toContain("fp_raw");

    const card = await cardFor(order.id);
    expect(card?.status).toBe("pending");
    expect(card?.balance_cents).toBe(25000);
    const holdHours = (new Date(card!.hold_until!).getTime() - Date.now()) / 3_600_000;
    expect(holdHours).toBeGreaterThan(71.5);
    expect(holdHours).toBeLessThan(72.5);

    const ledger = await supabaseAdmin
      .from("gift_card_ledger")
      .select("entry_type, actor, reference")
      .eq("gift_card_id", card!.id);
    expect(ledger.data).toHaveLength(1);
    expect(ledger.data?.[0]).toMatchObject({ entry_type: "issue", actor: "system:webhook" });
  });

  it("is a no-op when the same event is delivered twice", async () => {
    const order = await createOrder();
    const session = fakeSession(order.stripe_session_id!, order.id);
    const event = makeEvent("checkout.session.completed", session);

    await processStripeEvent(event, depsFor(session));
    const second = await processStripeEvent(event, depsFor(session));
    expect(second).toMatchObject({ status: 200, result: "duplicate" });

    const cards = await supabaseAdmin
      .from("gift_cards")
      .select("id", { count: "exact" })
      .eq("order_id", order.id);
    expect(cards.count).toBe(1);
    const ledger = await supabaseAdmin
      .from("gift_card_ledger")
      .select("id", { count: "exact", head: true })
      .eq("gift_card_id", cards.data![0]!.id);
    expect(ledger.count).toBe(1);
  });

  it("issues only one card for two concurrent deliveries", async () => {
    const order = await createOrder();
    const session = fakeSession(order.stripe_session_id!, order.id);
    const event = makeEvent("checkout.session.completed", session);

    await Promise.all([
      processStripeEvent(event, depsFor(session)),
      processStripeEvent(event, depsFor(session)),
    ]);

    const cards = await supabaseAdmin
      .from("gift_cards")
      .select("id", { count: "exact" })
      .eq("order_id", order.id);
    expect(cards.count).toBe(1);
  });

  it("sends an amount mismatch to review", async () => {
    const order = await createOrder();
    const session = fakeSession(order.stripe_session_id!, order.id, { amount_total: 5000 });
    const event = makeEvent("checkout.session.completed", session);

    await processStripeEvent(event, depsFor(session));
    expect((await orderRow(order.id)).status).toBe("review");
    expect((await cardFor(order.id))?.status).toBe("review");
  });

  it("sends an invalid recipient email to review", async () => {
    const order = await createOrder();
    const session = fakeSession(order.stripe_session_id!, order.id, {
      custom_fields: [
        { key: "recipient_name", text: { value: "Ada" } },
        { key: "recipient_email", text: { value: "not-an-email" } },
      ],
    });
    const event = makeEvent("checkout.session.completed", session);

    await processStripeEvent(event, depsFor(session));
    expect((await orderRow(order.id)).status).toBe("review");
    expect((await cardFor(order.id))?.status).toBe("review");
  });

  it("issues nothing when the session is unpaid", async () => {
    const order = await createOrder();
    const session = fakeSession(order.stripe_session_id!, order.id, {
      payment_status: "unpaid",
    });
    const event = makeEvent("checkout.session.completed", session);

    const outcome = await processStripeEvent(event, depsFor(session));
    expect(outcome).toMatchObject({ result: "ignored", category: "not_paid" });
    expect(await cardFor(order.id)).toBeNull();
    expect((await orderRow(order.id)).status).toBe("open");
  });

  it("issues nothing when the client reference does not match", async () => {
    const order = await createOrder();
    const session = fakeSession(order.stripe_session_id!, order.id, {
      client_reference_id: uuid(),
    });
    const event = makeEvent("checkout.session.completed", session);

    const outcome = await processStripeEvent(event, depsFor(session));
    expect(outcome).toMatchObject({ result: "ignored", category: "order_reference_mismatch" });
    expect(await cardFor(order.id)).toBeNull();
  });

  it("expires an open order and leaves a paid one alone", async () => {
    const open = await createOrder();
    const openSession = fakeSession(open.stripe_session_id!, open.id);
    await processStripeEvent(
      makeEvent("checkout.session.expired", openSession),
      depsFor(openSession),
    );
    expect((await orderRow(open.id)).status).toBe("expired");

    const paid = await createOrder();
    const paidSession = fakeSession(paid.stripe_session_id!, paid.id);
    await processStripeEvent(
      makeEvent("checkout.session.completed", paidSession),
      depsFor(paidSession),
    );
    await processStripeEvent(
      makeEvent("checkout.session.expired", paidSession),
      depsFor(paidSession),
    );
    expect((await orderRow(paid.id)).status).toBe("paid");
  });
});
