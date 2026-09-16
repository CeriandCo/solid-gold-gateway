import {
  buildHistoryState,
  RANGE_DAYS,
  readMaxAgeSeconds,
  resolvePriceState,
  validateGoldPrice,
  validateHistoryPoints,
  type AurumRange,
  type HistoryState,
  type PriceSource,
  type PriceState,
} from "./price-state";
import {
  buildDemoSeries,
  DEMO_CHANGE_AMOUNT,
  DEMO_CHANGE_PCT,
  DEMO_DERIVED,
  DEMO_FACTS,
  DEMO_SPOT_USD,
} from "./price-fixture";

export type PriceDerived = {
  changeAmount: number;
  high24h: number;
  low24h: number;
  previousClose: number;
};

export type PriceFacts = {
  monthToDate: { value: number; referenceDate: string };
  yearToDate: { value: number; referenceDate: string };
  high52Week: { value: number; date: string };
  low52Week: { value: number; date: string };
};

export type PriceSnapshot = {
  state: PriceState;
  /** null until the server derives and validates these; the UI must hide them. */
  derived: PriceDerived | null;
  facts: PriceFacts | null;
};

export type PriceAdapter = {
  source: PriceSource;
  fetchPrice: (now: Date) => Promise<PriceSnapshot>;
  fetchHistory: (range: AurumRange, now: Date) => Promise<HistoryState>;
};

const API_BASE =
  (import.meta.env["VITE_AURUM_PRICE_API_URL"] as string | undefined) ??
  "https://bdmtdwmwrnsrajgicxsp.supabase.co/functions/v1";

const REQUEST_TIMEOUT_MS = 12_000;

async function getJson(path: string): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { accept: "application/json" },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function toDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

export const realPriceAdapter: PriceAdapter = {
  source: "live",
  async fetchPrice(now) {
    const maxAgeSeconds = readMaxAgeSeconds();
    let payload: unknown;
    try {
      payload = await getJson("/get-gold-price");
    } catch (error) {
      console.error("[aurum] price request failed", error);
      return { state: { status: "unavailable", source: "live", reason: "network" }, derived: null, facts: null };
    }

    const validated = validateGoldPrice(payload, now);
    const state = resolvePriceState(validated, { now, maxAgeSeconds, source: "live" });
    // The feed returns no 24h high/low, previous close or absolute change.
    // Nothing is invented here: the UI hides those elements while this is null.
    return { state, derived: null, facts: null };
  },
  async fetchHistory(range, now) {
    const from = new Date(now.getTime() - RANGE_DAYS[range] * 86_400_000);
    let payload: unknown;
    try {
      payload = await getJson(`/get-history?from=${toDateOnly(from)}&to=${toDateOnly(now)}`);
    } catch (error) {
      console.error("[aurum] history request failed", error);
      return { status: "unavailable", reason: "network" };
    }

    const points = validateHistoryPoints(payload);
    if (!points) return { status: "unavailable", reason: "invalid" };

    const windowed = points.filter((point) => point.date >= toDateOnly(from));
    if (windowed.length === 0) return { status: "unavailable", reason: "no-data" };
    return buildHistoryState(windowed, now, "live");
  },
};

export const demoPriceAdapter: PriceAdapter = {
  source: "demo",
  async fetchPrice(now) {
    const maxAgeSeconds = readMaxAgeSeconds();
    const state = resolvePriceState(
      { spot: DEMO_SPOT_USD, changePct: DEMO_CHANGE_PCT, fetchedAt: now },
      { now, maxAgeSeconds, source: "demo" },
    );
    return {
      state,
      derived: {
        changeAmount: DEMO_CHANGE_AMOUNT,
        high24h: DEMO_DERIVED.high24h,
        low24h: DEMO_DERIVED.low24h,
        previousClose: DEMO_DERIVED.previousClose,
      },
      facts: DEMO_FACTS,
    };
  },
  async fetchHistory(range, now) {
    return buildHistoryState(buildDemoSeries(RANGE_DAYS[range], now), now, "demo");
  },
};

/**
 * Demo mode is opt-in, off by default, and ignored in production builds.
 */
export function selectPriceAdapter(): PriceAdapter {
  const flag = import.meta.env["VITE_AURUM_DEMO_PRICE"];
  const enabled = flag === "true" || flag === "1";
  if (!enabled) return realPriceAdapter;
  if (import.meta.env.PROD) {
    console.error("[aurum] VITE_AURUM_DEMO_PRICE is set in a production build and was ignored.");
    return realPriceAdapter;
  }
  return demoPriceAdapter;
}
