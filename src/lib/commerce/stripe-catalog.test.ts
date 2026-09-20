import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { restoreCommerceSettings, snapshotCommerceSettings } from "./settings-fixture";

import {
  catalogStatus,
  keyMode,
  lookupKeyFor,
  syncStripeCatalog,
  type CatalogPrice,
  type CatalogStripeClient,
} from "./stripe-catalog.server";
import { buildGiftCardSessionParams } from "./session-params";

const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

// The suite runs against the real project database: keep the operator's row and put it back.
const SETTINGS_SNAPSHOT = await snapshotCommerceSettings();

const CURRENCY = "usd";
const PRODUCT = { id: "prod_sqoot_gift", active: true, metadata: { purpose: "sqoot_gift_card" } };

type Denomination = { id: string; amount_cents: number };

async function activeDenominations(): Promise<Denomination[]> {
  const { data } = await supabaseAdmin
    .from("gift_card_denominations")
    .select("id, amount_cents")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  return (data ?? []) as Denomination[];
}

async function mappedTestPriceIds(): Promise<(string | null)[]> {
  const { data } = await supabaseAdmin
    .from("gift_card_denominations")
    .select("stripe_price_id_test")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  return (data ?? []).map((row) => row.stripe_price_id_test);
}

async function clearMapping() {
  await supabaseAdmin.rpc("gift_card_set_stripe_prices", { _mode: "test", _map: {} });
  await supabaseAdmin.rpc("gift_card_set_stripe_prices", { _mode: "live", _map: {} });
}

function goodPrice(amountCents: number, overrides: Partial<CatalogPrice> = {}): CatalogPrice {
  return {
    id: `price_test_${amountCents}`,
    lookup_key: lookupKeyFor(CURRENCY, amountCents),
    unit_amount: amountCents,
    currency: CURRENCY,
    type: "one_time",
    active: true,
    livemode: false,
    product: PRODUCT,
    ...overrides,
  };
}

function fakeStripe(prices: CatalogPrice[]): CatalogStripeClient {
  return {
    prices: {
      list: async ({ lookup_keys }) => ({
        data: prices.filter((price) => lookup_keys.includes(price.lookup_key ?? "")),
      }),
    },
  };
}

async function syncWith(prices: CatalogPrice[]) {
  return syncStripeCatalog({ mode: "test", stripe: fakeStripe(prices) });
}

beforeEach(async () => {
  await supabaseAdmin.from("commerce_settings").update({ currency: CURRENCY }).eq("id", true);
  await clearMapping();
});

afterAll(async () => {
  await clearMapping();
  await supabaseAdmin.from("commerce_alerts").delete().eq("kind", "catalog_sync");
  await restoreCommerceSettings(SETTINGS_SNAPSHOT);
});

describe("keyMode", () => {
  it("reads the mode from the key prefix without exposing the key", () => {
    const original = process.env["STRIPE_SECRET_KEY"];
    delete process.env["STRIPE_SECRET_KEY"];
    expect(keyMode()).toBe("unset");
    process.env["STRIPE_SECRET_KEY"] = "sk_test_x";
    expect(keyMode()).toBe("test");
    process.env["STRIPE_SECRET_KEY"] = "rk_test_x";
    expect(keyMode()).toBe("test");
    process.env["STRIPE_SECRET_KEY"] = "sk_live_x";
    expect(keyMode()).toBe("live");
    process.env["STRIPE_SECRET_KEY"] = "whatever";
    expect(keyMode()).toBe("unset");
    if (original === undefined) delete process.env["STRIPE_SECRET_KEY"];
    else process.env["STRIPE_SECRET_KEY"] = original;
  });
});

describe("syncStripeCatalog", () => {
  it("maps every denomination when all prices check out", async () => {
    const denominations = await activeDenominations();
    const result = await syncWith(denominations.map((d) => goodPrice(d.amount_cents)));

    expect(result.ok).toBe(true);
    expect(result.mapped).toBe(denominations.length);
    expect(result.expected).toBe(denominations.length);
    expect(result.productId).toBe(PRODUCT.id);
    expect(result.problems).toEqual([]);

    const stored = await mappedTestPriceIds();
    expect(stored.filter(Boolean)).toHaveLength(denominations.length);

    const status = await catalogStatus({ mode: "test" });
    expect(status.ready).toBe(true);
    expect(status.mapped).toBe(denominations.length);
    expect(status.currency).toBe(CURRENCY);
    expect(status.lastSync?.severity).toBe("info");
  });

  const failures: Array<{
    name: string;
    code: string;
    build: (denominations: Denomination[]) => CatalogPrice[];
  }> = [
    {
      name: "a price with the wrong amount",
      code: "amount_mismatch",
      build: (d) =>
        d.map((row, index) =>
          index === 0
            ? goodPrice(row.amount_cents, { unit_amount: row.amount_cents + 100 })
            : goodPrice(row.amount_cents),
        ),
    },
    {
      name: "a price in another currency",
      code: "currency_mismatch",
      build: (d) =>
        d.map((row, index) =>
          index === 1
            ? goodPrice(row.amount_cents, { currency: "eur" })
            : goodPrice(row.amount_cents),
        ),
    },
    {
      name: "a recurring price",
      code: "not_one_time",
      build: (d) =>
        d.map((row, index) =>
          index === 2
            ? goodPrice(row.amount_cents, { type: "recurring", recurring: { interval: "month" } })
            : goodPrice(row.amount_cents),
        ),
    },
    {
      name: "prices spread over more than one product",
      code: "multiple_products",
      build: (d) =>
        d.map((row, index) =>
          index === 3
            ? goodPrice(row.amount_cents, {
                product: { id: "prod_other", active: true, metadata: { purpose: "sqoot_gift_card" } },
              })
            : goodPrice(row.amount_cents),
        ),
    },
    {
      name: "a product without the purpose marker",
      code: "product_purpose",
      build: (d) =>
        d.map((row, index) =>
          index === 4
            ? goodPrice(row.amount_cents, {
                product: { id: PRODUCT.id, active: true, metadata: {} },
              })
            : goodPrice(row.amount_cents),
        ),
    },
    {
      name: "a live price while the key is a sandbox key",
      code: "livemode_mismatch",
      build: (d) =>
        d.map((row, index) =>
          index === 0 ? goodPrice(row.amount_cents, { livemode: true }) : goodPrice(row.amount_cents),
        ),
    },
    {
      name: "an inactive product",
      code: "product_inactive",
      build: (d) =>
        d.map((row, index) =>
          index === 1
            ? goodPrice(row.amount_cents, {
                product: { id: PRODUCT.id, active: false, metadata: { purpose: "sqoot_gift_card" } },
              })
            : goodPrice(row.amount_cents),
        ),
    },
    {
      name: "a missing lookup key",
      code: "missing_price",
      build: (d) => d.slice(1).map((row) => goodPrice(row.amount_cents)),
    },
    {
      name: "two prices sharing one lookup key",
      code: "duplicate_price",
      build: (d) => [
        ...d.map((row) => goodPrice(row.amount_cents)),
        goodPrice(d[0]!.amount_cents, { id: "price_test_duplicate" }),
      ],
    },
  ];

  for (const scenario of failures) {
    it(`writes nothing for ${scenario.name}`, async () => {
      const denominations = await activeDenominations();
      const result = await syncWith(scenario.build(denominations));

      expect(result.ok).toBe(false);
      expect(result.mapped).toBe(0);
      expect(result.problems.map((problem) => problem.code)).toContain(scenario.code);

      const stored = await mappedTestPriceIds();
      expect(stored.every((value) => value === null)).toBe(true);
      expect((await catalogStatus({ mode: "test" })).ready).toBe(false);
    });
  }

  it("refuses without a currency, and writes nothing", async () => {
    await supabaseAdmin.from("commerce_settings").update({ currency: null }).eq("id", true);
    const result = await syncWith([]);
    expect(result.ok).toBe(false);
    expect(result.problems.map((p) => p.code)).toEqual(["no_currency"]);
    expect((await mappedTestPriceIds()).every((value) => value === null)).toBe(true);
  });

  it("refuses without a Stripe key", async () => {
    const original = process.env["STRIPE_SECRET_KEY"];
    delete process.env["STRIPE_SECRET_KEY"];
    const result = await syncStripeCatalog();
    if (original !== undefined) process.env["STRIPE_SECRET_KEY"] = original;
    expect(result.ok).toBe(false);
    expect(result.problems.map((p) => p.code)).toEqual(["no_key"]);
  });
});

describe("session params", () => {
  it("reference the mapped Stripe price id and never an ad-hoc amount", () => {
    const params = buildGiftCardSessionParams(
      { id: "11111111-1111-4111-8111-111111111111", amountCents: 25000 },
      { id: "22222222-2222-4222-8222-222222222222", amountCents: 25000, priceId: "price_test_25000" },
      { currency: CURRENCY },
      "https://tests.sqoot.invalid",
    );
    const item = params.line_items?.[0];
    expect(item?.price).toBe("price_test_25000");
    expect(item?.quantity).toBe(1);
    expect(item?.price_data).toBeUndefined();
    expect(JSON.stringify(params)).not.toContain("price_data");
  });
});
