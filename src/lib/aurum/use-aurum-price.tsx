import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { selectPriceAdapter, type PriceAdapter } from "./price-adapters";
import {
  canCalculate,
  historyForRange,
  isLive,
  isMock,
  priceData,
  type AurumRange,
  type ForcedPriceStatus,
  type HistoryPoint,
  type PriceData,
  type PriceState,
} from "./price-state";

type AurumPriceContextValue = {
  state: PriceState;
  data: PriceData | null;
  /** The clock the current data is expressed against. */
  now: Date;
  showLiveBadge: boolean;
  showSampleChip: boolean;
  calculatorEnabled: boolean;
  historyFor: (range: AurumRange) => HistoryPoint[];
};

const AurumPriceContext = createContext<AurumPriceContextValue | null>(null);

/** Reviewer preview: force a status in non-production builds only. */
function applyForcedStatus(state: PriceState, forced: ForcedPriceStatus | undefined): PriceState {
  if (!forced || import.meta.env.PROD) return state;
  if (forced === "loading") return { status: "loading" };
  if (forced === "unavailable") return { status: "unavailable", reason: "no-data" };

  const data = priceData(state);
  if (!data) return state;
  if (forced === "stale") return { status: "stale", source: state.status === "ready" ? state.source : "mock", data, ageSeconds: 3_600 };
  return { status: "ready", source: "mock", data };
}

export function AurumPriceProvider({
  forcedStatus,
  children,
}: {
  forcedStatus?: ForcedPriceStatus | undefined;
  children: ReactNode;
}) {
  const adapter = useMemo<PriceAdapter>(() => selectPriceAdapter(), []);
  const [state, setState] = useState<PriceState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    void adapter.load().then((next) => {
      if (!cancelled) setState(next);
    });
    return () => {
      cancelled = true;
    };
  }, [adapter]);

  const value = useMemo<AurumPriceContextValue>(() => {
    const resolved = applyForcedStatus(state, forcedStatus);
    const data = priceData(resolved);
    const now = adapter.now();
    return {
      state: resolved,
      data,
      now,
      showLiveBadge: isLive(resolved),
      showSampleChip: isMock(resolved),
      calculatorEnabled: canCalculate(resolved),
      historyFor: (range: AurumRange) => (data ? historyForRange(data.history, range, now) : []),
    };
  }, [state, forcedStatus, adapter]);

  return <AurumPriceContext.Provider value={value}>{children}</AurumPriceContext.Provider>;
}

export function useAurumPrice(): AurumPriceContextValue {
  const value = useContext(AurumPriceContext);
  if (!value) throw new Error("useAurumPrice must be used inside AurumPriceProvider");
  return value;
}
