/**
 * AURUM price state contract.
 *
 * There is deliberately NO default or fallback spot price in this module.
 * Every state begins as `loading` and only becomes `live` after a response has
 * been validated and passed the configured freshness gate.
 */

export type PriceSource = "live" | "demo";

export type UnavailableReason = "network" | "invalid" | "no-threshold" | "no-data";

export type PriceState =
  | { status: "loading"; source: PriceSource }
  | {
      status: "live";
      source: PriceSource;
      spot: number;
      changePct: number;
      fetchedAt: Date;
      ageSeconds: number;
    }
  | {
      status: "stale";
      source: PriceSource;
      spot: number;
      changePct: number;
      fetchedAt: Date;
      ageSeconds: number;
    }
  | {
      status: "unavailable";
      source: PriceSource;
      reason: UnavailableReason;
      lastGoodAt?: Date;
    };

/** Shape observed from `get-gold-price`. Treated as untrusted input. */
export type RawGoldPrice = {
  spot_usd: unknown;
  change_pct: unknown;
  fetched_at: unknown;
};

export type ValidatedGoldPrice = {
  spot: number;
  changePct: number;
  fetchedAt: Date;
};

const MIN_SANE_SPOT = 100;
const MAX_SANE_SPOT = 100_000;
const FUTURE_TOLERANCE_MS = 5_000;

export function validateGoldPrice(payload: unknown, now: Date): ValidatedGoldPrice | null {
  if (!payload || typeof payload !== "object") return null;
  const raw = payload as RawGoldPrice;

  const spot = raw.spot_usd;
  const changePct = raw.change_pct;
  const fetchedAtRaw = raw.fetched_at;

  if (typeof spot !== "number" || !Number.isFinite(spot) || spot <= 0) return null;
  if (spot < MIN_SANE_SPOT || spot > MAX_SANE_SPOT) return null;
  if (typeof changePct !== "number" || !Number.isFinite(changePct)) return null;
  if (typeof fetchedAtRaw !== "string") return null;

  const parsed = Date.parse(fetchedAtRaw);
  if (!Number.isFinite(parsed)) return null;
  if (parsed > now.getTime() + FUTURE_TOLERANCE_MS) return null;

  return { spot, changePct, fetchedAt: new Date(parsed) };
}

/**
 * Maximum age, in seconds, that still counts as live.
 * Missing configuration is NOT defaulted: the caller must surface `no-threshold`.
 */
export function readMaxAgeSeconds(): number | null {
  const configured = import.meta.env["VITE_AURUM_PRICE_MAX_AGE_SECONDS"];
  if (typeof configured !== "string" || configured.trim() === "") return null;
  const value = Number(configured);
  if (!Number.isFinite(value) || value <= 0) return null;
  return value;
}

export function resolvePriceState(
  validated: ValidatedGoldPrice | null,
  options: { now: Date; maxAgeSeconds: number | null; source: PriceSource; lastGoodAt?: Date },
): PriceState {
  const { now, maxAgeSeconds, source, lastGoodAt } = options;

  if (maxAgeSeconds === null) {
    return { status: "unavailable", source, reason: "no-threshold", ...(lastGoodAt ? { lastGoodAt } : {}) };
  }
  if (!validated) {
    return { status: "unavailable", source, reason: "invalid", ...(lastGoodAt ? { lastGoodAt } : {}) };
  }

  const ageSeconds = Math.max(0, Math.round((now.getTime() - validated.fetchedAt.getTime()) / 1000));
  const base = {
    source,
    spot: validated.spot,
    changePct: validated.changePct,
    fetchedAt: validated.fetchedAt,
    ageSeconds,
  };

  return ageSeconds > maxAgeSeconds ? { status: "stale", ...base } : { status: "live", ...base };
}

/** True only when a price may be shown with a LIVE badge. */
export function isLive(state: PriceState): boolean {
  return state.status === "live" && state.source === "live";
}

/** The calculator may only compute against a fresh price. */
export function canCalculate(state: PriceState): boolean {
  return state.status === "live";
}

export type HistoryPoint = { date: string; close: number };

export type HistoryState =
  | { status: "loading" }
  | { status: "unavailable"; reason: UnavailableReason }
  | { status: "ready"; source: PriceSource; points: HistoryPoint[]; newestDate: string; outOfDate: boolean };

const OUT_OF_DATE_DAYS = 7;

export function validateHistoryPoints(payload: unknown): HistoryPoint[] | null {
  if (!payload || typeof payload !== "object") return null;
  const points = (payload as { points?: unknown }).points;
  if (!Array.isArray(points)) return null;

  const clean: HistoryPoint[] = [];
  for (const entry of points) {
    if (!entry || typeof entry !== "object") continue;
    const date = (entry as { d?: unknown }).d;
    const close = (entry as { p?: unknown }).p;
    if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    if (typeof close !== "number" || !Number.isFinite(close)) continue;
    if (close < MIN_SANE_SPOT || close > MAX_SANE_SPOT) continue;
    clean.push({ date, close });
  }
  if (clean.length === 0) return null;
  clean.sort((a, b) => a.date.localeCompare(b.date));
  return clean;
}

export function buildHistoryState(points: HistoryPoint[], now: Date, source: PriceSource): HistoryState {
  const newest = points.at(-1);
  if (!newest) return { status: "unavailable", reason: "no-data" };
  const ageDays = (now.getTime() - Date.parse(`${newest.date}T00:00:00Z`)) / 86_400_000;
  return {
    status: "ready",
    source,
    points,
    newestDate: newest.date,
    outOfDate: ageDays > OUT_OF_DATE_DAYS,
  };
}

export const RANGE_DAYS = { "30D": 30, "90D": 90, "1Y": 365, "5Y": 365 * 5 } as const;
export type AurumRange = keyof typeof RANGE_DAYS;

export function isAurumRange(value: unknown): value is AurumRange {
  return value === "30D" || value === "90D" || value === "1Y" || value === "5Y";
}
