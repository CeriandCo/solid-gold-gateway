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
export type HistoryStatus = "ready" | "unavailable";

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
  /** Null when no settled daily close exists. Never used to derive the change. */
  previousClose: number | null;
  /** Null when stored history is missing or too short; the price still renders. */
  facts: PriceFacts | null;
  history: HistoryPoint[];
  historyStatus: HistoryStatus;
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

/** The calculator only computes against a current price and real history. */
export function canCalculate(state: PriceState): boolean {
  return state.status === "ready" && state.data.historyStatus === "ready" && state.data.history.length > 0 && state.data.facts !== null;
}

export function priceData(state: PriceState): PriceData | null {
  return state.status === "ready" || state.status === "stale" ? state.data : null;
}

/** The slice of history a chart range actually needs. */
export function historyForRange(history: HistoryPoint[], range: AurumRange, now: Date): HistoryPoint[] {
  const cutoff = now.getTime() - RANGE_DAYS[range] * 86_400_000;
  return history.filter((point) => point.date.getTime() >= cutoff);
}

export type HistoryBounds = { earliest: Date; latest: Date; count: number };

export function historyBounds(history: HistoryPoint[]): HistoryBounds | null {
  const earliest = history[0]?.date;
  const latest = history.at(-1)?.date;
  return earliest && latest ? { earliest, latest, count: history.length } : null;
}

export function isRollingFiveYearWindow(bounds: HistoryBounds): boolean {
  const expected = new Date(Date.UTC(
    bounds.latest.getUTCFullYear() - 5,
    bounds.latest.getUTCMonth(),
    bounds.latest.getUTCDate(),
  ));
  const gapDays = Math.abs(bounds.earliest.getTime() - expected.getTime()) / 86_400_000;
  return gapDays <= 4;
}

export function validateHistoryDate(
  raw: string,
  bounds: HistoryBounds | null,
  format: (date: Date) => string,
): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return "Enter a date in the format DD/MM/YYYY.";
  const requested = new Date(`${raw}T00:00:00.000Z`);
  if (Number.isNaN(requested.getTime())) return "Enter a date in the format DD/MM/YYYY.";
  if (!bounds) return null;
  if (requested.getTime() < bounds.earliest.getTime()) {
    return `We only hold daily closes from ${format(bounds.earliest)} onward. Try a later date.`;
  }
  if (requested.getTime() > bounds.latest.getTime()) {
    return `The most recent stored close is ${format(bounds.latest)}. Try an earlier date.`;
  }
  return null;
}

export function chartRangeHeading(range: AurumRange, points: HistoryPoint[]): string {
  const labels: Record<AurumRange, string> = {
    "30D": "Thirty days of daily closes",
    "90D": "Ninety days of daily closes",
    "1Y": "Twelve months of daily closes",
    "5Y": "Five years of daily closes",
  };
  const bounds = historyBounds(points);
  if (!bounds) return labels[range];
  const expectedDays = RANGE_DAYS[range];
  const actualDays = Math.round((bounds.latest.getTime() - bounds.earliest.getTime()) / 86_400_000);
  if (actualDays >= expectedDays - 4) return labels[range];
  return `Available daily closes from ${bounds.earliest.toLocaleDateString("en-GB", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" })}`;
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
