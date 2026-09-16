/**
 * Adapters own where price data comes from. Components never fetch.
 * Moving to the real feed is a one-line change in `selectPriceAdapter`.
 */

import {
  computeFacts,
  type HistoryPoint,
  type PriceData,
  type PriceSource,
  type PriceState,
} from "./price-state";
import {
  FIXTURE_AS_OF,
  FIXTURE_CHANGE_AMOUNT,
  FIXTURE_CHANGE_PCT,
  FIXTURE_DAY_HIGH,
  FIXTURE_DAY_LOW,
  FIXTURE_NOW,
  FIXTURE_PREVIOUS_CLOSE,
  FIXTURE_SERIES,
  FIXTURE_SPOT,
} from "./price-fixture";

export type PriceAdapter = {
  source: PriceSource;
  /** The clock the adapter's data is expressed against. */
  now: () => Date;
  load: () => Promise<PriceState>;
};

function buildMockData(): PriceData | null {
  const history: HistoryPoint[] = FIXTURE_SERIES.map((point) => ({
    date: new Date(`${point.date}T00:00:00.000Z`),
    close: point.close,
  }));
  const facts = computeFacts(history, FIXTURE_SPOT, FIXTURE_AS_OF);
  if (!facts) return null;

  return {
    spot: FIXTURE_SPOT,
    changePct: FIXTURE_CHANGE_PCT,
    changeAmount: FIXTURE_CHANGE_AMOUNT,
    asOf: FIXTURE_AS_OF,
    dayHigh: FIXTURE_DAY_HIGH,
    dayLow: FIXTURE_DAY_LOW,
    previousClose: FIXTURE_PREVIOUS_CLOSE,
    facts,
    history,
  };
}

export const mockPriceAdapter: PriceAdapter = {
  source: "mock",
  now: () => FIXTURE_NOW,
  async load() {
    const data = buildMockData();
    if (!data) return { status: "unavailable", reason: "no-data" };
    return { status: "ready", source: "mock", data };
  },
};

/**
 * Mock data only for now. Connecting the real feed replaces this return value.
 */
export function selectPriceAdapter(): PriceAdapter {
  return mockPriceAdapter;
}
