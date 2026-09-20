/**
 * Server-only Stripe Product catalog binding.
 *
 * The gift card Checkout no longer sends an ad-hoc `price_data`; it sends a
 * Stripe price id that we have verified ourselves. This module performs that
 * verification and stores the mapping. It never logs, returns or accepts a
 * Stripe secret key — only the key's *prefix* is inspected, to decide whether
 * we are in sandbox or live mode.
 */
import { createStripeClient, getStripeSecretKey } from "../commerce.server";

export type StripeMode = "test" | "live" | "unset";

export type CatalogProblem = {
  code:
    | "no_currency"
    | "no_key"
    | "no_denominations"
    | "missing_price"
    | "duplicate_price"
    | "amount_mismatch"
    | "currency_mismatch"
    | "not_one_time"
    | "inactive_price"
    | "product_missing"
    | "product_inactive"
    | "product_purpose"
    | "multiple_products"
    | "livemode_mismatch"
    | "lookup_failed"
    | "write_failed";
  lookupKey?: string;
  detail?: string;
};

export type CatalogSyncResult = {
  ok: boolean;
  mode: StripeMode;
  currency: string | null;
  mapped: number;
  expected: number;
  productId?: string;
  problems: CatalogProblem[];
};

export type CatalogStatus = {
  mode: StripeMode;
  currency: string | null;
  mapped: number;
  expected: number;
  ready: boolean;
  productId?: string;
  lastSync?: { at: string; severity: string; message: string } | null;
};

/** Minimal shape of the Stripe objects we rely on, so tests can supply a fake. */
export type CatalogPrice = {
  id: string;
  lookup_key?: string | null;
  unit_amount?: number | null;
  currency?: string;
  type?: string;
  active?: boolean;
  livemode?: boolean;
  recurring?: unknown;
  product?:
    | string
    | {
        id: string;
        active?: boolean;
        deleted?: boolean;
        metadata?: Record<string, string> | null;
      };
};

export type CatalogStripeClient = {
  prices: {
    list(params: {
      lookup_keys: string[];
      expand: string[];
      active: boolean;
      limit: number;
    }): Promise<{ data: CatalogPrice[] }>;
  };
};

export type CatalogDeps = {
  stripe?: CatalogStripeClient;
  /** Overrides the mode derived from the secret key; used by tests only. */
  mode?: StripeMode;
};

/** 'test' | 'live' | 'unset', derived from the key prefix. The key itself never leaves this function. */
export function keyMode(): StripeMode {
  const key = getStripeSecretKey();
  if (!key) return "unset";
  if (key.startsWith("sk_test_") || key.startsWith("rk_test_")) return "test";
  if (key.startsWith("sk_live_") || key.startsWith("rk_live_")) return "live";
  return "unset";
}

export function lookupKeyFor(currency: string, amountCents: number): string {
  return `sqoot_gift_card_${currency}_${amountCents}`;
}

export function priceColumnFor(mode: Exclude<StripeMode, "unset">) {
  return mode === "test" ? ("stripe_price_id_test" as const) : ("stripe_price_id_live" as const);
}

type DenominationRow = {
  id: string;
  amount_cents: number;
  stripe_price_id_test: string | null;
  stripe_price_id_live: string | null;
};

async function loadContext() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [settings, denominations] = await Promise.all([
    supabaseAdmin.from("commerce_settings").select("currency").maybeSingle(),
    supabaseAdmin
      .from("gift_card_denominations")
      .select("id, amount_cents, stripe_price_id_test, stripe_price_id_live")
      .eq("active", true)
      .order("sort_order", { ascending: true }),
  ]);
  return {
    supabaseAdmin,
    currency: settings.data?.currency ?? null,
    denominations: (denominations.data ?? []) as DenominationRow[],
  };
}

/**
 * Pure validator: given the denominations and the prices Stripe returned,
 * decide whether the whole catalog is usable. Nothing is written unless every
 * single denomination passes every check.
 */
export function validateCatalog(
  mode: Exclude<StripeMode, "unset">,
  currency: string,
  denominations: Array<{ id: string; amount_cents: number }>,
  prices: CatalogPrice[],
): { map: Record<string, string>; productId?: string; problems: CatalogProblem[] } {
  const problems: CatalogProblem[] = [];
  const map: Record<string, string> = {};
  const productIds = new Set<string>();

  const byLookupKey = new Map<string, CatalogPrice[]>();
  for (const price of prices) {
    const key = price.lookup_key ?? "";
    if (!key) continue;
    const bucket = byLookupKey.get(key) ?? [];
    bucket.push(price);
    byLookupKey.set(key, bucket);
  }

  for (const denomination of denominations) {
    const lookupKey = lookupKeyFor(currency, denomination.amount_cents);
    const matches = byLookupKey.get(lookupKey) ?? [];

    if (matches.length === 0) {
      problems.push({ code: "missing_price", lookupKey });
      continue;
    }
    if (matches.length > 1) {
      problems.push({ code: "duplicate_price", lookupKey, detail: `${matches.length} prices` });
      continue;
    }

    const price = matches[0]!;
    let failed = false;
    const fail = (code: CatalogProblem["code"], detail?: string) => {
      failed = true;
      problems.push({ code, lookupKey, detail });
    };

    if (price.active !== true) fail("inactive_price");
    if (price.unit_amount !== denomination.amount_cents) fail("amount_mismatch");
    if (price.currency !== currency) fail("currency_mismatch");
    if (price.type !== "one_time" || price.recurring) fail("not_one_time");
    if (price.livemode !== (mode === "live")) fail("livemode_mismatch");

    const product = price.product;
    if (!product || typeof product === "string") {
      fail("product_missing");
    } else if (product.deleted === true || product.active !== true) {
      fail("product_inactive");
    } else if ((product.metadata?.["purpose"] ?? null) !== "sqoot_gift_card") {
      fail("product_purpose");
    } else {
      productIds.add(product.id);
    }

    if (!failed) map[denomination.id] = price.id;
  }

  if (productIds.size > 1) {
    problems.push({ code: "multiple_products", detail: `${productIds.size} products` });
  }

  const productId = productIds.size === 1 ? [...productIds][0] : undefined;
  return { map, productId, problems };
}

async function recordAlert(
  severity: "info" | "warning" | "critical",
  message: string,
): Promise<void> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin
    .from("commerce_alerts")
    .insert({ severity, kind: "catalog_sync", message: message.slice(0, 500) });
}

/**
 * Verifies the Stripe catalog and, only when every denomination checks out,
 * writes the price ids for the current mode in one transaction.
 */
export async function syncStripeCatalog(deps: CatalogDeps = {}): Promise<CatalogSyncResult> {
  const mode = deps.mode ?? keyMode();
  const { supabaseAdmin, currency, denominations } = await loadContext();
  const expected = denominations.length;

  const bail = async (problems: CatalogProblem[]): Promise<CatalogSyncResult> => {
    await recordAlert(
      "warning",
      `Catalog sync refused (${mode}): ${problems.map((p) => `${p.code}${p.lookupKey ? ` ${p.lookupKey}` : ""}`).join(", ")}`,
    );
    return { ok: false, mode, currency, mapped: 0, expected, problems };
  };

  if (mode === "unset") return bail([{ code: "no_key" }]);
  if (!currency) return bail([{ code: "no_currency" }]);
  if (expected === 0) return bail([{ code: "no_denominations" }]);

  let stripe = deps.stripe;
  if (!stripe) {
    const secretKey = getStripeSecretKey();
    if (!secretKey) return bail([{ code: "no_key" }]);
    stripe = createStripeClient(secretKey) as unknown as CatalogStripeClient;
  }

  const lookupKeys = denominations.map((row) => lookupKeyFor(currency, row.amount_cents));

  let prices: CatalogPrice[];
  try {
    const response = await stripe.prices.list({
      lookup_keys: lookupKeys,
      expand: ["data.product"],
      active: true,
      limit: 100,
    });
    prices = response.data ?? [];
  } catch {
    return bail([{ code: "lookup_failed" }]);
  }

  const { map, productId, problems } = validateCatalog(mode, currency, denominations, prices);
  if (problems.length > 0 || Object.keys(map).length !== expected || !productId) {
    return bail(problems.length > 0 ? problems : [{ code: "multiple_products" }]);
  }

  const { error } = await supabaseAdmin.rpc("gift_card_set_stripe_prices", {
    _mode: mode,
    _map: map,
  });
  if (error) {
    return bail([{ code: "write_failed" }]);
  }

  await recordAlert(
    "info",
    `Catalog sync ok (${mode}): ${expected} price(s) mapped to product ${productId}.`,
  );
  return { ok: true, mode, currency, mapped: expected, expected, productId, problems: [] };
}

/** Read-only view of the mapping. Makes no Stripe call. */
export async function catalogStatus(deps: CatalogDeps = {}): Promise<CatalogStatus> {
  const mode = deps.mode ?? keyMode();
  const { supabaseAdmin, currency, denominations } = await loadContext();
  const expected = denominations.length;

  if (mode === "unset") {
    return { mode, currency, mapped: 0, expected, ready: false, lastSync: null };
  }

  const column = priceColumnFor(mode);
  const mapped = denominations.filter((row) => row[column]).length;

  const alert = await supabaseAdmin
    .from("commerce_alerts")
    .select("created_at, severity, message")
    .eq("kind", "catalog_sync")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    mode,
    currency,
    mapped,
    expected,
    ready: expected > 0 && mapped === expected && currency !== null,
    lastSync: alert.data
      ? { at: alert.data.created_at, severity: alert.data.severity, message: alert.data.message }
      : null,
  };
}

/** The mapped price id for one denomination in the current mode, or null. */
export async function priceIdForDenomination(
  denominationId: string,
  mode: StripeMode,
): Promise<string | null> {
  if (mode === "unset") return null;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const column = priceColumnFor(mode);
  const { data } = await supabaseAdmin
    .from("gift_card_denominations")
    .select(column)
    .eq("id", denominationId)
    .maybeSingle();
  const row = data as Record<string, string | null> | null;
  return row?.[column] ?? null;
}
