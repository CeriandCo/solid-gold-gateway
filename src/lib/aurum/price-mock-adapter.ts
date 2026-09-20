/**
 * DEV-ONLY mock adapter. This module (and the fixture it imports) is loaded
 * exclusively through a dynamic import guarded by `import.meta.env.DEV`, so it
 * is dead code in a production build and never enters the shipped bundle.
 */

import {
  computeFacts,
  type HistoryPoint,
  type PriceData,
  type PriceState,
} from "./price-state";
import type { PriceAdapter } from "./price-adapters";
import { derivePriceChange } from "./price-change";
import {
  FIXTURE_AS_OF,
  FIXTURE_DAY_HIGH,
  FIXTURE_DAY_LOW,
  FIXTURE_NOW,
  FIXTURE_PREVIOUS_CLOSE,
  FIXTURE_SERIES,
  FIXTURE_SPOT,
} from "./price-fixture";

function buildMockData(): PriceData | null {
  const history: HistoryPoint[] = FIXTURE_SERIES.map((point) => ({
    date: new Date(`${point.date}T00:00:00.000Z`),
    close: point.close,
  }));
  const facts = computeFacts(history, FIXTURE_SPOT, FIXTURE_AS_OF);
  const provider = "mock:gold_spot";
  const change = derivePriceChange({
    price: FIXTURE_SPOT,
    baseline: FIXTURE_PREVIOUS_CLOSE,
    priceSource: provider,
    baselineSource: provider,
  });

  return {
    spot: FIXTURE_SPOT,
    changePct: change?.percent ?? null,
    changeAmount: change?.amount ?? null,
    asOf: FIXTURE_AS_OF,
    dayHigh: FIXTURE_DAY_HIGH,
    dayLow: FIXTURE_DAY_LOW,
    previousClose: FIXTURE_PREVIOUS_CLOSE,
    provider,
    previousCloseSource: provider,
    facts,
    history,
    historyStatus: "ready",
  };
}

export const mockPriceAdapter: PriceAdapter = {
  source: "mock",
  now: () => FIXTURE_NOW,
  async load() {
    const data = buildMockData();
    if (!data) return { status: "unavailable", reason: "no-data" } satisfies PriceState;
    return { status: "ready", source: "mock", data } satisfies PriceState;
  },
};
