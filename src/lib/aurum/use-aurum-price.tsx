import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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
  /** The clock the current data is expressed against; ticks for the live feed. */
  now: Date;
  showLiveBadge: boolean;
  showSampleChip: boolean;
  calculatorEnabled: boolean;
  historyFor: (range: AurumRange) => HistoryPoint[];
};

const AurumPriceContext = createContext<AurumPriceContextValue | null>(null);

/** Current price re-fetch cadence. */
const POLL_MS = 60_000;
/** Relative-time label refresh, so "x seconds ago" can never sit frozen. */
const TICK_MS = 30_000;

/** Reviewer preview: force a status in non-production builds only. */
function applyForcedStatus(state: PriceState, forced: ForcedPriceStatus | undefined): PriceState {
  if (!forced || import.meta.env.PROD) return state;
  if (forced === "loading") return { status: "loading" };
  if (forced === "unavailable") return { status: "unavailable", reason: "no-data" };

  const data = priceData(state);
  if (!data) return state;
  const source = state.status === "ready" || state.status === "stale" ? state.source : "live";
  if (forced === "stale") return { status: "stale", source, data, ageSeconds: 3_600 };
  return { status: "ready", source, data };
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
  const [now, setNow] = useState<Date>(() => adapter.now());
  const cancelled = useRef(false);

  const refresh = useCallback(async () => {
    try {
      const next = await adapter.load();
      if (cancelled.current) return;
      setState((current) => {
        // A failed poll must not wipe a good value: keep the last good data and
        // let the freshness state degrade instead.
        if (next.status === "unavailable") {
          const kept = priceData(current);
          if (kept) {
            const ageSeconds = Math.max(0, Math.round((adapter.now().getTime() - kept.asOf.getTime()) / 1000));
            return { status: "stale", source: adapter.source, data: kept, ageSeconds };
          }
        }
        return next;
      });
      setNow(adapter.now());
    } catch {
      if (!cancelled.current) {
        setState((current) => (priceData(current) ? current : { status: "unavailable", reason: "network" }));
      }
    }
  }, [adapter]);

  useEffect(() => {
    cancelled.current = false;
    /** Loading has a deadline: a permanent spinner is treated as unavailable. */
    const deadline = setTimeout(() => {
      if (!cancelled.current) {
        setState((current) => (current.status === "loading" ? { status: "unavailable", reason: "network" } : current));
      }
    }, 10_000);

    void refresh();

    let poll: ReturnType<typeof setInterval> | null = null;
    const startPolling = () => {
      if (poll === null) poll = setInterval(() => void refresh(), POLL_MS);
    };
    const stopPolling = () => {
      if (poll !== null) {
        clearInterval(poll);
        poll = null;
      }
    };
    startPolling();

    // The relative-time label recomputes on its own, not only on fetch.
    const tick = setInterval(() => setNow(adapter.now()), TICK_MS);

    // A backgrounded tab stops hitting the endpoint and refreshes once on return.
    const onVisibility = () => {
      if (document.visibilityState === "hidden") stopPolling();
      else {
        startPolling();
        void refresh();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled.current = true;
      clearTimeout(deadline);
      clearInterval(tick);
      stopPolling();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [adapter, refresh]);

  const value = useMemo<AurumPriceContextValue>(() => {
    const resolved = applyForcedStatus(state, forcedStatus);
    const data = priceData(resolved);
    return {
      state: resolved,
      data,
      now,
      showLiveBadge: isLive(resolved),
      showSampleChip: isMock(resolved),
      calculatorEnabled: canCalculate(resolved),
      historyFor: (range: AurumRange) => (data ? historyForRange(data.history, range, now) : []),
    };
  }, [state, forcedStatus, now]);

  return <AurumPriceContext.Provider value={value}>{children}</AurumPriceContext.Provider>;
}

export function useAurumPrice(): AurumPriceContextValue {
  const value = useContext(AurumPriceContext);
  if (!value) throw new Error("useAurumPrice must be used inside AurumPriceProvider");
  return value;
}
