/**
 * Deterministic fact pack for AI-written AURUM Daily Notes.
 *
 * Everything the model is ever told comes from here, and every number it is
 * allowed to write is calculated here — never by the model. The only inputs are
 * two internal tables: aurum_spot_prices and aurum_daily_closes.
 *
 * Rounding rules (documented once, applied everywhere):
 *   - money   : 2 decimal places, half away from zero
 *   - percent : 2 decimal places, half away from zero
 * Allowed printed representations of a number are derived from the rounded
 * value only (see `allowedRenderings`), so a "creative" rounding fails
 * verification.
 */

export type FactMetric =
  | "spot_price"
  | "previous_close"
  | "change_absolute"
  | "change_percent"
  | "range_high_24h"
  | "range_low_24h"
  | "daily_close";

export type FactDirection = "up" | "down" | "flat" | "none";

export type Fact = {
  id: string;
  subject: "gold";
  metric: FactMetric;
  kind: "money" | "percent";
  value: number;
  unit: "troy ounce";
  currency: "USD";
  period: string;
  effectiveAt: string;
  direction: FactDirection;
  source: { table: string; rowId: string; column: string };
  derivation?: string;
};

export type FactPack = {
  windowKey: string;
  generatedAt: string;
  subject: "gold";
  currency: "USD";
  unit: "troy ounce";
  observedAt: string;
  facts: Fact[];
};

export type SpotRow = {
  id: string;
  price: number;
  currency: string;
  unit: string;
  observed_at: string;
  high_24h: number;
  low_24h: number;
  previous_close: number | null;
};

export type DailyCloseRow = {
  id: string;
  price_date: string;
  close_price: number;
  currency: string;
  unit: string;
};

export type FactPackInputs = {
  spot: SpotRow | null;
  lastClose: DailyCloseRow | null;
};

/** Half away from zero, so -1.005 -> -1.01 and 1.005 -> 1.01. */
export function roundHalfAway(value: number, digits: number): number {
  const factor = 10 ** digits;
  const scaled = value * factor;
  const rounded = Math.sign(scaled) * Math.round(Math.abs(scaled) + Number.EPSILON);
  return rounded / factor;
}

export const MONEY_DP = 2;
export const PERCENT_DP = 2;

/** How stale a spot observation may be and still support a Daily Note. */
export const MAX_SPOT_AGE_MS = 26 * 60 * 60 * 1000;

export type Insufficiency =
  | "no_spot_row"
  | "stale_spot_row"
  | "no_comparison_point"
  | "unsupported_currency_or_unit"
  | "non_positive_values";

export type BuildResult =
  | { ok: true; pack: FactPack }
  | { ok: false; reason: Insufficiency };

function direction(value: number): FactDirection {
  if (value > 0) return "up";
  if (value < 0) return "down";
  return "flat";
}

/**
 * Builds the fact pack, or explains why the database cannot support a Daily
 * Note right now. No filler is ever produced: an insufficient pack means the
 * model is not called at all.
 */
export function buildFactPack(
  inputs: FactPackInputs,
  options: { windowKey: string; now: Date },
): BuildResult {
  const spot = inputs.spot;
  if (!spot) return { ok: false, reason: "no_spot_row" };

  // The stored unit spelling is `troy_ounce` in this database; the other
  // spellings are accepted so a future writer cannot silently break the pack.
  if (
    spot.currency?.toUpperCase() !== "USD" ||
    !/^(oz|ozt|troy[ _]ounce)$/i.test(spot.unit ?? "")
  ) {
    return { ok: false, reason: "unsupported_currency_or_unit" };
  }

  const observed = Date.parse(spot.observed_at);
  if (!Number.isFinite(observed)) return { ok: false, reason: "no_spot_row" };
  if (options.now.getTime() - observed > MAX_SPOT_AGE_MS) {
    return { ok: false, reason: "stale_spot_row" };
  }

  const previousClose = spot.previous_close;
  if (previousClose === null || !Number.isFinite(previousClose)) {
    return { ok: false, reason: "no_comparison_point" };
  }
  if (!(spot.price > 0) || !(previousClose > 0) || !(spot.high_24h > 0) || !(spot.low_24h > 0)) {
    return { ok: false, reason: "non_positive_values" };
  }

  const price = roundHalfAway(spot.price, MONEY_DP);
  const prev = roundHalfAway(previousClose, MONEY_DP);
  const changeAbsolute = roundHalfAway(price - prev, MONEY_DP);
  const changePercent = roundHalfAway(((price - prev) / prev) * 100, PERCENT_DP);

  const facts: Fact[] = [
    {
      id: "f_spot",
      subject: "gold",
      metric: "spot_price",
      kind: "money",
      value: price,
      unit: "troy ounce",
      currency: "USD",
      period: "latest stored observation",
      effectiveAt: new Date(observed).toISOString(),
      direction: "none",
      source: { table: "aurum_spot_prices", rowId: spot.id, column: "price" },
    },
    {
      id: "f_prev_close",
      subject: "gold",
      metric: "previous_close",
      kind: "money",
      value: prev,
      unit: "troy ounce",
      currency: "USD",
      period: "previous close recorded with the latest observation",
      effectiveAt: new Date(observed).toISOString(),
      direction: "none",
      source: { table: "aurum_spot_prices", rowId: spot.id, column: "previous_close" },
    },
    {
      id: "f_change_abs",
      subject: "gold",
      metric: "change_absolute",
      kind: "money",
      value: changeAbsolute,
      unit: "troy ounce",
      currency: "USD",
      period: "since the previous close",
      effectiveAt: new Date(observed).toISOString(),
      direction: direction(changeAbsolute),
      source: { table: "aurum_spot_prices", rowId: spot.id, column: "price,previous_close" },
      derivation: "round(price - previous_close, 2)",
    },
    {
      id: "f_change_pct",
      subject: "gold",
      metric: "change_percent",
      kind: "percent",
      value: changePercent,
      unit: "troy ounce",
      currency: "USD",
      period: "since the previous close",
      effectiveAt: new Date(observed).toISOString(),
      direction: direction(changePercent),
      source: { table: "aurum_spot_prices", rowId: spot.id, column: "price,previous_close" },
      derivation: "round((price - previous_close) / previous_close * 100, 2)",
    },
    {
      id: "f_high_24h",
      subject: "gold",
      metric: "range_high_24h",
      kind: "money",
      value: roundHalfAway(spot.high_24h, MONEY_DP),
      unit: "troy ounce",
      currency: "USD",
      period: "stored trailing 24-hour range",
      effectiveAt: new Date(observed).toISOString(),
      direction: "none",
      source: { table: "aurum_spot_prices", rowId: spot.id, column: "high_24h" },
    },
    {
      id: "f_low_24h",
      subject: "gold",
      metric: "range_low_24h",
      kind: "money",
      value: roundHalfAway(spot.low_24h, MONEY_DP),
      unit: "troy ounce",
      currency: "USD",
      period: "stored trailing 24-hour range",
      effectiveAt: new Date(observed).toISOString(),
      direction: "none",
      source: { table: "aurum_spot_prices", rowId: spot.id, column: "low_24h" },
    },
  ];

  const close = inputs.lastClose;
  if (
    close &&
    close.currency?.toUpperCase() === "USD" &&
    Number.isFinite(close.close_price) &&
    close.close_price > 0
  ) {
    facts.push({
      id: "f_last_daily_close",
      subject: "gold",
      metric: "daily_close",
      kind: "money",
      value: roundHalfAway(close.close_price, MONEY_DP),
      unit: "troy ounce",
      currency: "USD",
      period: `stored daily close for ${close.price_date}`,
      effectiveAt: `${close.price_date}T00:00:00.000Z`,
      direction: "none",
      source: { table: "aurum_daily_closes", rowId: close.id, column: "close_price" },
    });
  }

  return {
    ok: true,
    pack: {
      windowKey: options.windowKey,
      generatedAt: options.now.toISOString(),
      subject: "gold",
      currency: "USD",
      unit: "troy ounce",
      observedAt: new Date(observed).toISOString(),
      facts,
    },
  };
}

/** Plain-decimal strings (no grouping, no symbols) a fact may legitimately print as. */
export function allowedRenderings(fact: Fact): string[] {
  const abs = Math.abs(fact.value);
  if (fact.kind === "percent") {
    return [abs.toFixed(2), abs.toFixed(1)];
  }
  return [abs.toFixed(2), abs.toFixed(0)];
}

/** The UTC generation window a Daily Note belongs to. One note per UTC day. */
export function dailyWindowKey(now: Date): string {
  return `daily:${now.toISOString().slice(0, 10)}`;
}

/** Deterministic slug; never taken from the model. */
export function dailyNoteSlug(now: Date): string {
  return `aurum-daily-note-${now.toISOString().slice(0, 10)}`;
}
