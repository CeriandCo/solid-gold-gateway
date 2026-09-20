/**
 * Adapters own where price data comes from. Components never fetch.
 *
 * PROVENANCE — READ BEFORE TOUCHING THE CHANGE FIGURES
 * ----------------------------------------------------
 * Day change is accepted only after the endpoint fields are independently
 * checked against a same-feed baseline here.
 */

import {
  computeFacts,
  type HistoryPoint,
  type PriceData,
  type PriceSource,
  type PriceState,
} from "./price-state";
import { derivePriceChange } from "./price-change";

export type PriceAdapter = {
  source: PriceSource;
  /** The clock the adapter's data is expressed against. */
  now: () => Date;
  load: () => Promise<PriceState>;
};

/** Relative paths only: the same code must work in preview and production. */
const PRICE_URL = "/api/public/get-gold-price";
const HISTORY_URL = "/api/public/get-history?range=5y";

type Freshness = "fresh" | "stale" | "unavailable";

function finitePositive(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function finiteOrZero(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function finiteOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

async function loadHistory(): Promise<{ points: HistoryPoint[]; status: "ready" | "unavailable" }> {
  try {
    const response = await fetch(HISTORY_URL, { headers: { accept: "application/json" } });
    if (!response.ok) return { points: [], status: "unavailable" };
    const body: unknown = await response.json();
    const points = (body as { points?: unknown })?.points;
    if (!Array.isArray(points)) return { points: [], status: "unavailable" };
    const parsed = points
      .map((point) => {
        const row = point as { date?: unknown; close?: unknown };
        const date = typeof row.date === "string" ? new Date(`${row.date}T00:00:00.000Z`) : null;
        const close = finiteOrNull(row.close);
        if (!date || Number.isNaN(date.getTime()) || close === null) return null;
        return { date, close } satisfies HistoryPoint;
      })
      .filter((point): point is HistoryPoint => point !== null)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    return { points: parsed, status: parsed.length > 0 ? "ready" : "unavailable" };
  } catch {
    return { points: [], status: "unavailable" };
  }
}

export function parseLivePricePayload(
  body: Record<string, unknown>,
  history: HistoryPoint[],
  historyStatus: "ready" | "unavailable",
): PriceState {
  const freshness = body["freshness"] as Freshness | undefined;
  if (freshness !== "fresh" && freshness !== "stale" && freshness !== "unavailable") {
    return { status: "unavailable", reason: "invalid" };
  }
  if (freshness === "unavailable") return { status: "unavailable", reason: "no-data" };

  const spot = body["price_usd"];
  if (!finitePositive(spot)) return { status: "unavailable", reason: "invalid" };

  const stamp = body["provider_timestamp"];
  const asOf = typeof stamp === "string" ? new Date(stamp) : null;
  if (!asOf || Number.isNaN(asOf.getTime())) return { status: "unavailable", reason: "invalid" };

  const provider = body["provider"];
  if (typeof provider !== "string" || provider.length === 0) return { status: "unavailable", reason: "invalid" };
  const previousClose = finiteOrNull(body["previous_close"]);
  const previousCloseSource = typeof body["previous_close_source"] === "string" ? body["previous_close_source"] : null;
  const change = derivePriceChange({
    price: spot,
    baseline: previousClose,
    priceSource: provider,
    baselineSource: previousCloseSource,
    suppliedAmount: body["change_amount"] ?? undefined,
    suppliedPercent: body["change_pct"] ?? undefined,
  });
  if (previousClose !== null && !change) console.error("[aurum-price] contradictory day-change payload; hiding change");

  const data: PriceData = {
    spot,
    changePct: change?.percent ?? null,
    changeAmount: change?.amount ?? null,
    asOf,
    dayHigh: finiteOrNull(body["day_high"]),
    dayLow: finiteOrNull(body["day_low"]),
    previousClose: change ? previousClose : null,
    provider,
    previousCloseSource: change ? previousCloseSource : null,
    facts: computeFacts(history, spot, asOf),
    history,
    historyStatus,
  };

  if (freshness === "stale") {
    const ageSeconds = Math.max(0, Math.round(finiteOrZero(body["age_seconds"])));
    return { status: "stale", source: "live", data, ageSeconds };
  }
  return { status: "ready", source: "live", data };
}

export const livePriceAdapter: PriceAdapter = {
  source: "live",
  now: () => new Date(),
  async load() {
    let body: Record<string, unknown>;
    let history: HistoryPoint[];
    let historyStatus: "ready" | "unavailable";

    try {
      const [priceResponse, historyPoints] = await Promise.all([
        fetch(PRICE_URL, { headers: { accept: "application/json" }, cache: "no-store" }),
        loadHistory(),
      ]);
      history = historyPoints.points;
      historyStatus = historyPoints.status;
      body = (await priceResponse.json()) as Record<string, unknown>;
    } catch {
      return { status: "unavailable", reason: "network" };
    }

    if (!body || typeof body !== "object") return { status: "unavailable", reason: "invalid" };

    return parseLivePricePayload(body, history, historyStatus);
  },
};

/**
 * Live feed by default. The fixture is reachable only in a dev build with an
 * explicit `?priceSource=mock` opt-in; the whole branch is dead code in
 * production, so the fixture never enters the shipped bundle.
 */
export function selectPriceAdapter(): PriceAdapter {
  if (import.meta.env.DEV && typeof window !== "undefined") {
    const requested = new URLSearchParams(window.location.search).get("priceSource");
    if (requested === "mock") {
      let mockNow: Date | null = null;
      return {
        source: "mock",
        now: () => mockNow ?? new Date(),
        async load() {
          const module = await import("./price-mock-adapter");
          mockNow = module.mockPriceAdapter.now();
          return module.mockPriceAdapter.load();
        },
      };
    }
  }
  return livePriceAdapter;
}
