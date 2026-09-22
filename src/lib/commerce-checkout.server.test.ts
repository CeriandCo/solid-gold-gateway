import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

const headers: Record<string, string | undefined> = {};

vi.mock("@tanstack/react-start/server", () => ({
  getRequestHeader: (name: string) => headers[name.toLowerCase()],
}));

const { runGiftCardCheckout, runGiftCardCheckoutStatus } = await import(
  "./commerce-checkout.server"
);
const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
const { ACKNOWLEDGEMENT_VERSION, acknowledgementRecordText } = await import(
  "./commerce/acknowledgement"
);
const { restoreCommerceSettings, snapshotCommerceSettings } = await import(
  "./commerce/settings-fixture"
);
const { peppered } = await import("./commerce.server");
const { purgeTrackedOrders, trackTestOrder } = await import("./commerce/test-orders");

// Real database: remember the operator's settings and restore them verbatim.
const SETTINGS_SNAPSHOT = await snapshotCommerceSettings();

const ORIGIN = "https://tests.sqoot.invalid";
const uuid = () => crypto.randomUUID();

/** Task C-9: every checkout call must carry the purchase acknowledgement. */
const ack = { acknowledged: true as const, termsVersion: ACKNOWLEDGEMENT_VERSION };

/** Every salted IP bucket this run touched, so teardown deletes only its own rows. */
const usedIpHashes = new Set<string>();

async function useClientIp(ip: string) {
  headers["cf-connecting-ip"] = ip;
  usedIpHashes.add(await peppered(ip));
}

type SettingsPatch = {
  checkout_enabled?: boolean;
  currency?: string | null;
  allowed_origins?: string[];
};

async function setSettings(patch: SettingsPatch) {
  await supabaseAdmin.from("commerce_settings").update(patch).eq("id", true);
}

async function denominations() {
  const { data } = await supabaseAdmin
    .from("gift_card_denominations")
    .select("id, amount_cents")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

/** Counts only this test's own orders, so parallel test files cannot interfere. */
async function orderCount(attemptId?: string) {
  let query = supabaseAdmin.from("gift_card_orders").select("id", { count: "exact", head: true });
  query = attemptId ? query.eq("attempt_id", attemptId) : query.eq("client_ip_hash", "none");
  const { count } = await query;
  return count ?? 0;
}

/** Binds every active denomination to a placeholder sandbox price id. */
async function mapPrices(on: boolean) {
  const list = await denominations();
  const map = on
    ? Object.fromEntries(list.map((row) => [row.id, `price_test_fake_${row.amount_cents}`]))
    : {};
  await supabaseAdmin.rpc("gift_card_set_stripe_prices", { _mode: "test", _map: map });
}

beforeAll(async () => {
  await useClientIp(`test-${uuid()}`);
  headers["origin"] = ORIGIN;
  await mapPrices(true);
});

afterAll(async () => {
  delete process.env["STRIPE_SECRET_KEY"];
  await mapPrices(false);
  // Only this run's own rows: never a blanket delete on a shared database.
  const { data: ownOrders } = await supabaseAdmin
    .from("gift_card_orders")
    .select("id")
    .in("client_ip_hash", [...usedIpHashes]);
  for (const row of ownOrders ?? []) trackTestOrder(row.id);
  await purgeTrackedOrders();
  if (usedIpHashes.size > 0) {
    await supabaseAdmin.from("checkout_attempts").delete().in("ip_hash", [...usedIpHashes]);
  }
  await restoreCommerceSettings(SETTINGS_SNAPSHOT);
});


describe("gift card checkout", () => {
  it("refuses while the kill switch is off", async () => {
    await setSettings({ checkout_enabled: false, currency: null, allowed_origins: [] });
    const [denom] = await denominations();
    const attemptId = uuid();
    const result = await runGiftCardCheckout({ denominationId: denom!.id, attemptId, ...ack });
    expect(result).toEqual({ ok: false, code: "unavailable" });
    expect(await orderCount(attemptId)).toBe(0);
  });

  it("refuses when enabled but no Stripe key is configured, writing no order", async () => {
    await setSettings({ checkout_enabled: true, currency: "usd", allowed_origins: [ORIGIN] });
    delete process.env["STRIPE_SECRET_KEY"];
    const [denom] = await denominations();
    const attemptId = uuid();
    const result = await runGiftCardCheckout({ denominationId: denom!.id, attemptId, ...ack });
    expect(result).toEqual({ ok: false, code: "unavailable" });
    expect(await orderCount(attemptId)).toBe(0);
  });

  it("rejects unexpected fields and malformed ids", async () => {
    const [denom] = await denominations();
    expect(
      await runGiftCardCheckout({
        denominationId: denom!.id,
        attemptId: uuid(),
        ...ack,
        amountCents: 1,
      }),
    ).toEqual({ ok: false, code: "invalid_request" });
    expect(
      await runGiftCardCheckout({ denominationId: "not-a-uuid", attemptId: uuid(), ...ack }),
    ).toEqual({ ok: false, code: "invalid_request" });
  });

  it("rejects an origin that is not on the allowlist", async () => {
    process.env["STRIPE_SECRET_KEY"] = "sk_test_placeholder_for_tests";
    headers["origin"] = "https://evil.example.com";
    const [denom] = await denominations();
    const result = await runGiftCardCheckout({
      denominationId: denom!.id,
      attemptId: uuid(),
      ...ack,
    });
    headers["origin"] = ORIGIN;
    expect(result).toEqual({ ok: false, code: "origin_not_allowed" });
  });

  it("binds an attempt id to its denomination", async () => {
    process.env["STRIPE_SECRET_KEY"] = "sk_test_placeholder_for_tests";
    const list = await denominations();
    const first = list[0]!;
    const second = list[1]!;
    const attemptId = uuid();

    // First use creates exactly one order. The placeholder key makes the Stripe
    // call fail, which is the point: the order exists without a session.
    expect(await orderCount(attemptId)).toBe(0);
    const initial = await runGiftCardCheckout({ denominationId: first.id, attemptId, ...ack });
    expect(initial).toEqual({ ok: false, code: "checkout_failed" });
    expect(await orderCount(attemptId)).toBe(1);

    const created = await supabaseAdmin
      .from("gift_card_orders")
      .select("id, amount_cents, denomination_id, status")
      .eq("attempt_id", attemptId)
      .single();
    expect(created.data?.denomination_id).toBe(first.id);
    expect(created.data?.amount_cents).toBe(first.amount_cents);

    // Replay with a DIFFERENT amount is refused outright.
    const swapped = await runGiftCardCheckout({ denominationId: second.id, attemptId, ...ack });
    expect(swapped).toEqual({ ok: false, code: "invalid_request" });
    const afterSwap = await supabaseAdmin
      .from("gift_card_orders")
      .select("id, amount_cents, denomination_id")
      .eq("attempt_id", attemptId)
      .single();
    expect(afterSwap.data?.denomination_id).toBe(first.id);
    expect(afterSwap.data?.amount_cents).toBe(first.amount_cents);
    expect(await orderCount(attemptId)).toBe(1);

    // Replay with the SAME amount reuses the same order, never a second one.
    const replay = await runGiftCardCheckout({ denominationId: first.id, attemptId, ...ack });
    expect(replay).toEqual({ ok: false, code: "checkout_failed" });
    const afterReplay = await supabaseAdmin
      .from("gift_card_orders")
      .select("id")
      .eq("attempt_id", attemptId)
      .single();
    expect(afterReplay.data?.id).toBe(created.data?.id);
    expect(await orderCount(attemptId)).toBe(1);
  }, 60000);

  it("rate limits checkout at the 11th attempt while status polls still work", async () => {
    process.env["STRIPE_SECRET_KEY"] = "sk_test_placeholder_for_tests";
    await useClientIp(`rate-${uuid()}`);
    headers["origin"] = "https://evil.example.com"; // stop before any write
    const [denom] = await denominations();

    const codes: string[] = [];
    for (let i = 0; i < 11; i += 1) {
      const result = await runGiftCardCheckout({
        denominationId: denom!.id,
        attemptId: uuid(),
        ...ack,
      });
      codes.push(result.ok ? "ok" : result.code);
    }
    headers["origin"] = ORIGIN;

    expect(codes.slice(0, 10).every((code) => code === "origin_not_allowed")).toBe(true);
    expect(codes[10]).toBe("rate_limited");

    // The status bucket is separate, so polling still answers.
    const status = await runGiftCardCheckoutStatus({ sessionId: "cs_test_unknownsession" });
    expect(status).toEqual({ status: "not_found" });
  }, 60000);

  it("returns not_found for a malformed session id and never leaks personal data", async () => {
    const result = await runGiftCardCheckoutStatus({ sessionId: "cs_bogus_1" });
    expect(result).toEqual({ status: "not_found" });
    expect(Object.keys(result)).toEqual(["status"]);
  });

  it("is unavailable, with no order written, when the Stripe catalog is not mapped", async () => {
    process.env["STRIPE_SECRET_KEY"] = "sk_test_placeholder_for_tests";
    await setSettings({ checkout_enabled: true, currency: "usd", allowed_origins: [ORIGIN] });
    await useClientIp(`unmapped-${uuid()}`);
    await mapPrices(false);

    const [denom] = await denominations();
    const attemptId = uuid();
    const result = await runGiftCardCheckout({ denominationId: denom!.id, attemptId, ...ack });
    await mapPrices(true);

    expect(result).toEqual({ ok: false, code: "unavailable" });
    expect(await orderCount(attemptId)).toBe(0);
  });

  // Task C-9: server-side enforcement of the purchase acknowledgement.
  it("rejects a purchase without the acknowledgement and writes no order", async () => {
    process.env["STRIPE_SECRET_KEY"] = "sk_test_placeholder_for_tests";
    await setSettings({ checkout_enabled: true, currency: "usd", allowed_origins: [ORIGIN] });
    await useClientIp(`ack-${uuid()}`);
    const [denom] = await denominations();

    const missing = uuid();
    expect(
      await runGiftCardCheckout({ denominationId: denom!.id, attemptId: missing }),
    ).toEqual({ ok: false, code: "invalid_request" });
    expect(await orderCount(missing)).toBe(0);

    const untickedId = uuid();
    expect(
      await runGiftCardCheckout({
        denominationId: denom!.id,
        attemptId: untickedId,
        acknowledged: false,
        termsVersion: ACKNOWLEDGEMENT_VERSION,
      }),
    ).toEqual({ ok: false, code: "invalid_request" });
    expect(await orderCount(untickedId)).toBe(0);

    const staleId = uuid();
    expect(
      await runGiftCardCheckout({
        denominationId: denom!.id,
        attemptId: staleId,
        acknowledged: true,
        termsVersion: "some-old-version",
      }),
    ).toEqual({ ok: false, code: "invalid_request" });
    expect(await orderCount(staleId)).toBe(0);
  });

  it("records the acknowledgement version, text and time on the order", async () => {
    process.env["STRIPE_SECRET_KEY"] = "sk_test_placeholder_for_tests";
    await setSettings({ checkout_enabled: true, currency: "usd", allowed_origins: [ORIGIN] });
    await useClientIp(`ack-record-${uuid()}`);
    const [denom] = await denominations();
    const attemptId = uuid();

    // The placeholder key makes Stripe fail, but the order row is written first.
    await runGiftCardCheckout({ denominationId: denom!.id, attemptId, ...ack });
    const row = await supabaseAdmin
      .from("gift_card_orders")
      .select("terms_version, acknowledged_text, acknowledged_at")
      .eq("attempt_id", attemptId)
      .single();
    expect(row.data?.terms_version).toBe(ACKNOWLEDGEMENT_VERSION);
    expect(row.data?.acknowledged_text).toBe(acknowledgementRecordText("gift_card"));
    expect(typeof row.data?.acknowledged_at).toBe("string");
  }, 60000);

});
