import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { selectPriceAdapter, type PriceAdapter, type PriceSnapshot } from "./price-adapters";
import type { AurumRange, HistoryState, PriceState } from "./price-state";

type AurumPriceContextValue = PriceSnapshot & {
  history: HistoryState;
  range: AurumRange;
  isDemo: boolean;
};

const AurumPriceContext = createContext<AurumPriceContextValue | null>(null);

const POLL_INTERVAL_MS = 60_000;
const BACKOFF_STEPS_MS = [60_000, 120_000, 240_000, 480_000];

const LOADING_SNAPSHOT: PriceSnapshot = {
  state: { status: "loading", source: "live" },
  derived: null,
  facts: null,
};

export function AurumPriceProvider({ range, children }: { range: AurumRange; children: ReactNode }) {
  const adapter = useMemo<PriceAdapter>(() => selectPriceAdapter(), []);
  const [snapshot, setSnapshot] = useState<PriceSnapshot>(() => ({
    ...LOADING_SNAPSHOT,
    state: { status: "loading", source: adapter.source },
  }));
  const [history, setHistory] = useState<HistoryState>({ status: "loading" });
  const lastGoodAt = useRef<Date | undefined>(undefined);
  const failures = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const schedule = (delay: number) => {
      if (cancelled) return;
      timer = setTimeout(run, delay);
    };

    async function run() {
      if (cancelled) return;
      if (typeof document !== "undefined" && document.visibilityState === "hidden") return;

      const next = await adapter.fetchPrice(new Date());
      if (cancelled) return;

      if (next.state.status === "live" || next.state.status === "stale") {
        lastGoodAt.current = next.state.fetchedAt;
        failures.current = 0;
      } else {
        failures.current += 1;
      }

      const withLastGood: PriceState =
        next.state.status === "unavailable" && lastGoodAt.current
          ? { ...next.state, lastGoodAt: lastGoodAt.current }
          : next.state;

      setSnapshot({ ...next, state: withLastGood });

      const backoff =
        failures.current > 0
          ? (BACKOFF_STEPS_MS[Math.min(failures.current - 1, BACKOFF_STEPS_MS.length - 1)] ?? POLL_INTERVAL_MS)
          : POLL_INTERVAL_MS;
      schedule(backoff);
    }

    const onVisibility = () => {
      if (document.visibilityState !== "visible") {
        if (timer) clearTimeout(timer);
        return;
      }
      void run();
    };

    void run();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [adapter]);

  useEffect(() => {
    let cancelled = false;
    setHistory({ status: "loading" });
    void adapter.fetchHistory(range, new Date()).then((next) => {
      if (!cancelled) setHistory(next);
    });
    return () => {
      cancelled = true;
    };
  }, [adapter, range]);

  const value = useMemo<AurumPriceContextValue>(
    () => ({ ...snapshot, history, range, isDemo: adapter.source === "demo" }),
    [snapshot, history, range, adapter.source],
  );

  return <AurumPriceContext.Provider value={value}>{children}</AurumPriceContext.Provider>;
}

export function useAurumPrice(): AurumPriceContextValue {
  const value = useContext(AurumPriceContext);
  if (!value) throw new Error("useAurumPrice must be used inside AurumPriceProvider");
  return value;
}
