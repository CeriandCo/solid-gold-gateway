import { afterAll, describe, expect, it } from "vitest";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  buildGiftEmail,
  hashGiftCode,
  runDeliveryTick,
  verifyGiftCode,
  type EmailMessage,
  type EmailProvider,
} from "./gift-delivery.server";
import {
  CROCKFORD_ALPHABET,
  formatGiftCode,
  generateGiftCode,
  normaliseGiftCode,
} from "@/lib/commerce/gift-code";

const AMOUNT = 25_000;
const createdOrders: string[] = [];

function uuid() {
  return crypto.randomUUID();
}

/** Captures what would have been sent; never asserted against the database. */
function fakeProvider(
  behaviour: "ok" | "fail" = "ok",
): EmailProvider & { sentMessages: EmailMessage[] } {
  const sentMessages: EmailMessage[] = [];
  return {
    sentMessages,
    async send(message) {
      sentMessages.push(message);
      if (behaviour === "fail") return { ok: false, category: "provider_500" };
      return { ok: true, id: `msg_${uuid()}` };
    },
  };
}

async function createOrder(status = "paid", recipientEmail?: string) {
  const { data, error } = await supabaseAdmin
    .from("gift_card_orders")
    .insert({
      status,
      amount_cents: AMOUNT,
      currency: "usd",
      livemode: false,
      stripe_session_id: `cs_test_${uuid().replace(/-/g, "")}`,
      recipient_name: "Ada Lovelace",
      recipient_email: recipientEmail ?? `recipient-${uuid()}@example.com`,
      paid_at: new Date().toISOString(),
    })
    .select("id, recipient_email")
    .single();
  if (error) throw error;
  createdOrders.push(data.id);
  return data;
}

async function createCard(
  orderId: string,
  opts: { status?: string; holdUntil?: string | null; giftMessage?: string } = {},
) {
  if (opts.giftMessage) {
    await supabaseAdmin
      .from("gift_card_orders")
      .update({ gift_message: opts.giftMessage })
      .eq("id", orderId);
  }
  const { data, error } = await supabaseAdmin
    .from("gift_cards")
    .insert({
      order_id: orderId,
      status: opts.status ?? "pending",
      amount_cents: AMOUNT,
      balance_cents: AMOUNT,
      currency: "usd",
      hold_until:
        opts.holdUntil === undefined
          ? new Date(Date.now() - 60_000).toISOString()
          : opts.holdUntil,
      activated_at: (opts.status ?? "pending") === "active" ? new Date().toISOString() : null,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

async function readCard(cardId: string) {
  const { data, error } = await supabaseAdmin
    .from("gift_cards")
    .select("status, code_hash, code_last4, delivered_at, delivery_claimed_at")
    .eq("id", cardId)
    .single();
  if (error) throw error;
  return data;
}

async function attemptsFor(cardId: string) {
  const { data } = await supabaseAdmin
    .from("gift_card_delivery_attempts")
    .select("outcome, provider_message_id, error_category")
    .eq("gift_card_id", cardId)
    .order("attempted_at", { ascending: true });
  return data ?? [];
}

async function setSwitches(enabled: boolean, emailFrom: string | null) {
  const { error } = await supabaseAdmin
    .from("commerce_settings")
    .update({ delivery_enabled: enabled, email_from: emailFrom })
    .eq("id", true);
  if (error) throw error;
}

async function withDeliveryOn<T>(run: () => Promise<T>): Promise<T> {
  await setSwitches(true, "gifts@example.test");
  try {
    return await run();
  } finally {
    await setSwitches(false, null);
  }
}

afterAll(async () => {
  await setSwitches(false, null);
});

// 1 -------------------------------------------------------------------------
describe("activation after the hold", () => {
  it("activates a due pending card on a paid order", async () => {
    const order = await createOrder();
    const cardId = await createCard(order.id);
    const { data, error } = await supabaseAdmin.rpc("gift_card_activate_due");
    expect(error).toBeNull();
    expect(data ?? 0).toBeGreaterThanOrEqual(1);
    expect((await readCard(cardId)).status).toBe("active");
  });

  it("leaves a card whose hold has not expired", async () => {
    const order = await createOrder();
    const cardId = await createCard(order.id, {
      holdUntil: new Date(Date.now() + 3_600_000).toISOString(),
    });
    await supabaseAdmin.rpc("gift_card_activate_due");
    expect((await readCard(cardId)).status).toBe("pending");
  });

  it.each(["review", "disputed", "refunded"])(
    "leaves a due card when the order is %s",
    async (orderStatus) => {
      const order = await createOrder(orderStatus);
      const cardId = await createCard(order.id);
      await supabaseAdmin.rpc("gift_card_activate_due");
      expect((await readCard(cardId)).status).toBe("pending");
    },
  );

  it("activates exactly once under two concurrent runs", async () => {
    const order = await createOrder();
    const cardId = await createCard(order.id);
    await Promise.all([
      supabaseAdmin.rpc("gift_card_activate_due"),
      supabaseAdmin.rpc("gift_card_activate_due"),
    ]);
    expect((await readCard(cardId)).status).toBe("active");
    const { data: ledger } = await supabaseAdmin
      .from("gift_card_ledger")
      .select("entry_type")
      .eq("gift_card_id", cardId)
      .eq("entry_type", "activate");
    expect(ledger).toHaveLength(1);
  });
});

// 2 -------------------------------------------------------------------------
describe("delivery tick authentication", () => {
  async function callRoute(headers: Record<string, string>) {
    const { Route } = await import("@/routes/api/public/gift-card-delivery-tick");
    const handler = (
      Route.options as unknown as {
        server: { handlers: { POST: (ctx: { request: Request }) => Promise<Response> } };
      }
    ).server.handlers.POST;
    return handler({
      request: new Request("https://example.test/api/public/gift-card-delivery-tick", {
        method: "POST",
        headers,
      }),
    });
  }

  it("rejects a missing secret with 401 and touches nothing", async () => {
    const before = await supabaseAdmin
      .from("gift_card_delivery_attempts")
      .select("id", { count: "exact", head: true });
    const response = await callRoute({});
    const after = await supabaseAdmin
      .from("gift_card_delivery_attempts")
      .select("id", { count: "exact", head: true });
    expect(response.status).toBe(401);
    expect(after.count).toBe(before.count);
  });

  it("rejects a wrong secret with 401", async () => {
    const response = await callRoute({ "x-cron-secret": "not-the-secret" });
    expect(response.status).toBe(401);
  });
});

// 3 -------------------------------------------------------------------------
describe("delivery switches", () => {
  it("does nothing while delivery is disabled", async () => {
    const order = await createOrder();
    const cardId = await createCard(order.id, { status: "active" });
    await setSwitches(false, "gifts@example.test");
    const result = await runDeliveryTick({ provider: fakeProvider() });
    expect(result.outcome).toBe("awaiting_email_provider");
    expect((await readCard(cardId)).status).toBe("active");
    await setSwitches(false, null);
  });

  it("does nothing while email_from is null", async () => {
    await setSwitches(true, null);
    const result = await runDeliveryTick({ provider: fakeProvider() });
    expect(result.outcome).toBe("awaiting_email_provider");
    await setSwitches(false, null);
  });

  it("does nothing while no email provider key is configured", async () => {
    const saved = process.env["RESEND_API_KEY"];
    delete process.env["RESEND_API_KEY"];
    await setSwitches(true, "gifts@example.test");
    const result = await runDeliveryTick();
    expect(result.outcome).toBe("awaiting_email_provider");
    await setSwitches(false, null);
    if (saved) process.env["RESEND_API_KEY"] = saved;
  });
});

// 4 -------------------------------------------------------------------------
describe("delivery happy path", () => {
  it("delivers the card, stores only a hash, and sends exactly one email", async () => {
    const order = await createOrder();
    const cardId = await createCard(order.id, { status: "active" });
    const provider = fakeProvider();

    const result = await withDeliveryOn(() => runDeliveryTick({ provider }));

    expect(result.outcome).toBe("processed");
    const forThisCard = provider.sentMessages.filter((m) => m.to === order.recipient_email);
    expect(forThisCard).toHaveLength(1);
    const message = forThisCard[0]!;
    expect(message.from).toBe("gifts@example.test");
    expect(message.subject).toBe("You've received a SQOOT Pure Gift Card");

    const card = await readCard(cardId);
    expect(card.status).toBe("delivered");
    expect(card.delivered_at).not.toBeNull();
    expect(card.code_hash).toMatch(/^[0-9a-f]{64}$/);
    expect(card.code_last4).toMatch(/^[0-9A-Z]{4}$/);

    // The code the provider received must appear in no table, in any form.
    const dashed = /[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}/.exec(message.text)![0];
    const plain = normaliseGiftCode(dashed);
    const tables = [
      "gift_card_orders",
      "gift_cards",
      "gift_card_ledger",
      "gift_card_delivery_attempts",
      "commerce_alerts",
      "checkout_attempts",
      "stripe_events",
      "commerce_settings",
    ] as const;
    for (const table of tables) {
      const { data } = await supabaseAdmin.from(table).select("*");
      const dump = JSON.stringify(data ?? []).toUpperCase();
      expect(dump.includes(plain)).toBe(false);
      expect(dump.includes(dashed.toUpperCase())).toBe(false);
    }

    expect(await verifyGiftCode(dashed)).toMatchObject({
      found: true,
      status: "delivered",
      balanceCents: AMOUNT,
      currency: "usd",
    });
    const attempts = await attemptsFor(cardId);
    expect(attempts).toHaveLength(1);
    expect(attempts[0]!.outcome).toBe("sent");
    expect(attempts[0]!.provider_message_id).toBeTruthy();
  });
});

// 5 -------------------------------------------------------------------------
describe("provider failure", () => {
  it("keeps the card active, releases the lease and mints a different code next tick", async () => {
    const order = await createOrder();
    const cardId = await createCard(order.id, { status: "active" });
    const failing = fakeProvider("fail");

    await withDeliveryOn(() => runDeliveryTick({ provider: failing }));

    const afterFailure = await readCard(cardId);
    expect(afterFailure.status).toBe("active");
    expect(afterFailure.delivery_claimed_at).toBeNull();
    const firstHash = afterFailure.code_hash;
    const firstCode = /[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}/.exec(
      failing.sentMessages.find((m) => m.to === order.recipient_email)!.text,
    )![0];
    const attempts = await attemptsFor(cardId);
    expect(attempts[0]).toMatchObject({ outcome: "failed", error_category: "provider_500" });

    const succeeding = fakeProvider();
    await withDeliveryOn(() => runDeliveryTick({ provider: succeeding }));

    const afterRetry = await readCard(cardId);
    expect(afterRetry.status).toBe("delivered");
    expect(afterRetry.code_hash).not.toBe(firstHash);
    // The first code is dead: its hash is gone from the row.
    expect(await verifyGiftCode(firstCode)).toEqual({ found: false });
    const secondCode = /[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}/.exec(
      succeeding.sentMessages.find((m) => m.to === order.recipient_email)!.text,
    )![0];
    expect(secondCode).not.toBe(firstCode);
    expect((await verifyGiftCode(secondCode)).found).toBe(true);
  });
});

// 6 -------------------------------------------------------------------------
describe("concurrent ticks", () => {
  it("sends exactly one email per card", async () => {
    const order = await createOrder();
    const cardId = await createCard(order.id, { status: "active" });
    const a = fakeProvider();
    const b = fakeProvider();

    await withDeliveryOn(async () => {
      await Promise.all([runDeliveryTick({ provider: a }), runDeliveryTick({ provider: b })]);
    });

    const sentForCard = [...a.sentMessages, ...b.sentMessages].filter(
      (m) => m.to === order.recipient_email,
    );
    expect(sentForCard).toHaveLength(1);
    expect((await readCard(cardId)).status).toBe("delivered");
    const attempts = (await attemptsFor(cardId)).filter((x) => x.outcome === "sent");
    expect(attempts).toHaveLength(1);
  });
});

// 7 -------------------------------------------------------------------------
describe("HTML escaping", () => {
  it("escapes an injected gift message", async () => {
    const order = await createOrder();
    const cardId = await createCard(order.id, {
      status: "active",
      giftMessage: '<script>alert(1)</script><img src=x onerror=1>',
    });
    const provider = fakeProvider();
    await withDeliveryOn(() => runDeliveryTick({ provider }));

    const html = provider.sentMessages.find((m) => m.to === order.recipient_email)!.html;
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(provider.sentMessages.find((m) => m.to === order.recipient_email)!.text).toContain("<script>alert(1)</script>");
    expect((await readCard(cardId)).status).toBe("delivered");
  });

  it("escapes a recipient name directly in the builder", () => {
    const message = buildGiftEmail({
      to: "a@example.test",
      from: "gifts@example.test",
      recipientName: '"><script>x</script>',
      amountCents: AMOUNT,
      currency: "usd",
      giftMessage: null,
      code: generateGiftCode(),
    });
    expect(message.html).not.toContain("<script>x</script>");
    expect(message.html).toContain("&lt;script&gt;x&lt;/script&gt;");
  });
});

// 8 -------------------------------------------------------------------------
describe("code format and normalisation", () => {
  it("mints 16 Crockford characters", () => {
    for (let i = 0; i < 200; i++) {
      const code = generateGiftCode();
      expect(code).toHaveLength(16);
      expect([...code].every((c) => CROCKFORD_ALPHABET.includes(c))).toBe(true);
    }
    expect(formatGiftCode("ABCD1234EFGH5678")).toBe("ABCD-1234-EFGH-5678");
  });

  it("hashes the dashed, lower-case and confusable variants identically", async () => {
    const code = "ABCD1234EFGH5678";
    const canonical = await hashGiftCode(code);
    expect(await hashGiftCode("abcd-1234-efgh-5678")).toBe(canonical);
    expect(await hashGiftCode("abcd 1234 efgh 5678")).toBe(canonical);
    // O -> 0 and I/L -> 1
    expect(await hashGiftCode("ABCDI234EFGH5678")).toBe(canonical);
    expect(normaliseGiftCode("oOiIlL0123456789")).toBe("0011110123456789");
  });

  it("matches a delivered card through every variant and rejects a wrong code", async () => {
    const order = await createOrder();
    await createCard(order.id, { status: "active" });
    const provider = fakeProvider();
    await withDeliveryOn(() => runDeliveryTick({ provider }));
    const dashed = /[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}/.exec(
      provider.sentMessages.find((m) => m.to === order.recipient_email)!.text,
    )![0];

    expect((await verifyGiftCode(dashed)).found).toBe(true);
    expect((await verifyGiftCode(dashed.toLowerCase())).found).toBe(true);
    expect((await verifyGiftCode(normaliseGiftCode(dashed))).found).toBe(true);
    expect(
      (await verifyGiftCode(dashed.replace(/0/g, "O").replace(/1/g, "I").toLowerCase())).found,
    ).toBe(true);
    expect(await verifyGiftCode("ZZZZ-ZZZZ-ZZZZ-ZZZZ")).toEqual({ found: false });
    expect(await verifyGiftCode("too-short")).toEqual({ found: false });
  });
});

// 9 -------------------------------------------------------------------------
describe("redemption primitive exposure", () => {
  it("is not referenced by any route or client module", async () => {
    const { readdirSync, readFileSync, statSync } = await import("node:fs");
    const hits: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const full = `${dir}/${entry}`;
        if (statSync(full).isDirectory()) {
          walk(full);
          continue;
        }
        if (!/\.(ts|tsx)$/.test(entry)) continue;
        if (full.endsWith("gift-delivery.server.ts") || full.endsWith("gift-delivery.server.test.ts"))
          continue;
        if (readFileSync(full, "utf8").includes("verifyGiftCode")) hits.push(full);
      }
    };
    walk("src");
    expect(hits).toEqual([]);
  });
});
