/**
 * AURUM price state contract.
 *
 * One module owns price state for the whole /aurum route. There is deliberately
 * NO default or fallback spot price here: every number arrives through an
 * adapter, and every state starts as `loading`.
 */

export type PriceSource = "mock" | "live";

export type UnavailableReason = "network" | "invalid" | "no-data";

export type HistoryPoint = { date: Date; close: number };

export type PriceFacts = {
  monthToDatePct: number;
  monthToDateFrom: Date;
  yearToDatePct: number;
  yearToDateFrom: Date;
  high52: { price: number; date: Date };
  low52: { price: number; date: Date };
};

export type PriceData = {
  spot: number;
  changePct: number;
  changeAmount: number;
  asOf: Date;
  dayHigh: number;
  dayLow: number;
  previousClose: number;
  facts: PriceFacts;
  history: HistoryPoint[];
};

export type PriceState =
  | { status: "loading" }
  | { status: "ready"; source: PriceSource; data: PriceData }
  | { status: "stale"; source: PriceSource; data: PriceData; ageSeconds: number }
  | { status: "unavailable"; reason: UnavailableReason };

export const RANGE_DAYS = { "30D": 30, "90D": 90, "1Y": 365, "5Y": 365 * 5 } as const;
export type AurumRange = keyof typeof RANGE_DAYS;

export function isAurumRange(value: unknown): value is AurumRange {
  return value === "30D" || value === "90D" || value === "1Y" || value === "5Y";
}

export type ForcedPriceStatus = "loading" | "ready" | "stale" | "unavailable";

export function isForcedPriceStatus(value: unknown): value is ForcedPriceStatus {
  return value === "loading" || value === "ready" || value === "stale" || value === "unavailable";
}

/** A LIVE badge may only render for a real, fresh feed. */
export function isLive(state: PriceState): boolean {
  return state.status === "ready" && state.source === "live";
}

/** Mock data must always be labelled wherever a price appears. */
export function isMock(state: PriceState): boolean {
  return (state.status === "ready" || state.status === "stale") && state.source === "mock";
}

/** The calculator only computes against a current price. */
export function canCalculate(state: PriceState): boolean {
  return state.status === "ready";
}

export function priceData(state: PriceState): PriceData | null {
  return state.status === "ready" || state.status === "stale" ? state.data : null;
}

/** The slice of history a chart range actually needs. */
export function historyForRange(history: HistoryPoint[], range: AurumRange, now: Date): HistoryPoint[] {
  const cutoff = now.getTime() - RANGE_DAYS[range] * 86_400_000;
  return history.filter((point) => point.date.getTime() >= cutoff);
}

function closeOnOrBefore(history: HistoryPoint[], target: Date): HistoryPoint | null {
  let found: HistoryPoint | null = null;
  for (const point of history) {
    if (point.date.getTime() <= target.getTime()) found = point;
    else break;
  }
  return found;
}

/** The close recorded on an exact day, or null when the market was closed. */
export function closeOn(history: HistoryPoint[], date: Date): HistoryPoint | null {
  const key = date.toISOString().slice(0, 10);
  return history.find((point) => point.date.toISOString().slice(0, 10) === key) ?? null;
}

/**
 * Facts are derived from the series, never typed in alongside it.
 */
export function computeFacts(history: HistoryPoint[], spot: number, asOf: Date): PriceFacts | null {
  if (history.length === 0) return null;

  const monthStart = new Date(Date.UTC(asOf.getUTCFullYear(), asOf.getUTCMonth(), 1));
  const yearStart = new Date(Date.UTC(asOf.getUTCFullYear() - 1, 11, 31));
  const monthRef = closeOnOrBefore(history, monthStart);
  const yearRef = closeOnOrBefore(history, yearStart);
  if (!monthRef || !yearRef) return null;

  const cutoff = asOf.getTime() - 364 * 86_400_000;
  const window = history.filter((point) => point.date.getTime() >= cutoff);
  if (window.length === 0) return null;

  let high = window[0] as HistoryPoint;
  let low = window[0] as HistoryPoint;
  for (const point of window) {
    if (point.close > high.close) high = point;
    if (point.close < low.close) low = point;
  }

  return {
    monthToDatePct: ((spot - monthRef.close) / monthRef.close) * 100,
    monthToDateFrom: monthRef.date,
    yearToDatePct: ((spot - yearRef.close) / yearRef.close) * 100,
    yearToDateFrom: yearRef.date,
    high52: { price: high.close, date: high.date },
    low52: { price: low.close, date: low.date },
  };
}
