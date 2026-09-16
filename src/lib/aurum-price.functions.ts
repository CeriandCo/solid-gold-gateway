import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type AurumRange = "30D" | "90D" | "1Y" | "5Y";

type DailyClose = { date: string; close: number };

type SpotRecord = {
  price: number;
  currency: string;
  unit: string;
  observed_at: string;
  change_amount: number;
  change_percent: number;
  high_24h: number;
  low_24h: number;
  previous_close: number;
};

export type AurumPriceResponse = {
  checkedAt: string;
  priceState:
    | { status: "live"; price: number; changeAmount: number; changePercent: number; high24h: number; low24h: number; previousClose: number; observedAt: string }
    | { status: "unavailable"; reason: string; lastGoodAt: string | null };
  facts: {
    monthToDate: { value: number; referenceDate: string } | null;
    yearToDate: { value: number; referenceDate: string } | null;
    high52Week: { value: number; date: string } | null;
    low52Week: { value: number; date: string } | null;
  };
  series: DailyClose[];
};

const RANGE_DAYS: Record<AurumRange, number> = { "30D": 30, "90D": 90, "1Y": 365, "5Y": 365 * 5 };
const FRESHNESS_MS = 60_000;

function isRange(value: unknown): value is AurumRange {
  return value === "30D" || value === "90D" || value === "1Y" || value === "5Y";
}

function sanePrice(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 100 && value < 100_000;
}

export function assessSpotRecord(spot: SpotRecord | null, checkedAt: Date, readFailed = false): AurumPriceResponse["priceState"] {
  if (readFailed) return { status: "unavailable", reason: "The latest price could not be retrieved.", lastGoodAt: null };
  if (!spot) return { status: "unavailable", reason: "No current price has been recorded.", lastGoodAt: null };

  const observedTime = Date.parse(spot.observed_at);
  const validSpot =
    spot.currency === "USD" &&
    spot.unit === "troy_ounce" &&
    Number.isFinite(observedTime) &&
    sanePrice(spot.price) &&
    sanePrice(spot.high_24h) &&
    sanePrice(spot.low_24h) &&
    sanePrice(spot.previous_close) &&
    Number.isFinite(spot.change_amount) &&
    Number.isFinite(spot.change_percent);

  if (!validSpot) {
    return {
      status: "unavailable",
      reason: "The latest price record did not pass validation.",
      lastGoodAt: Number.isFinite(observedTime) ? spot.observed_at : null,
    };
  }
  if (checkedAt.getTime() - observedTime > FRESHNESS_MS || observedTime > checkedAt.getTime() + 5_000) {
    return {
      status: "unavailable",
      reason: observedTime > checkedAt.getTime() + 5_000 ? "The latest price has an invalid timestamp." : "The latest price is more than 60 seconds old.",
      lastGoodAt: spot.observed_at,
    };
  }
  return {
    status: "live",
    price: spot.price,
    changeAmount: spot.change_amount,
    changePercent: spot.change_percent,
    high24h: spot.high_24h,
    low24h: spot.low_24h,
    previousClose: spot.previous_close,
    observedAt: spot.observed_at,
  };
}

function percentChange(current: number, reference: number) {
  return ((current - reference) / reference) * 100;
}

function toDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

export const getAurumPriceData = createServerFn({ method: "GET" })
  .inputValidator((input: { range: AurumRange }) => {
    if (!isRange(input.range)) throw new Error("Invalid history range");
    return input;
  })
  .handler(async ({ data }): Promise<AurumPriceResponse> => {
    const checkedAt = new Date();
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const client = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });

    const fiveYearsAgo = new Date(checkedAt);
    fiveYearsAgo.setUTCFullYear(fiveYearsAgo.getUTCFullYear() - 5);
    fiveYearsAgo.setUTCDate(fiveYearsAgo.getUTCDate() - 2);

    const [spotResult, historyResult] = await Promise.all([
      client
        .from("aurum_spot_prices")
        .select("price,currency,unit,observed_at,change_amount,change_percent,high_24h,low_24h,previous_close")
        .order("observed_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      client
        .from("aurum_daily_closes")
        .select("price_date,close_price,currency,unit")
        .gte("price_date", toDateOnly(fiveYearsAgo))
        .order("price_date", { ascending: true }),
    ]);

    const spot = spotResult.data;
    const priceState = assessSpotRecord(spot, checkedAt, Boolean(spotResult.error));

    const history = historyResult.error
      ? []
      : (historyResult.data ?? [])
          .filter((row) => row.currency === "USD" && row.unit === "troy_ounce" && sanePrice(row.close_price))
          .map((row) => ({ date: row.price_date, close: row.close_price }));

    const latest = history.at(-1);
    const nowYear = checkedAt.getUTCFullYear();
    const monthStart = `${nowYear}-${String(checkedAt.getUTCMonth() + 1).padStart(2, "0")}-01`;
    const yearStart = `${nowYear}-01-01`;
    const monthReference = history.find((row) => row.date >= monthStart) ?? null;
    const priorYearRows = history.filter((row) => row.date < yearStart);
    const yearReference = priorYearRows.at(-1) ?? history.find((row) => row.date >= yearStart) ?? null;
    const yearAgo = new Date(checkedAt);
    yearAgo.setUTCFullYear(yearAgo.getUTCFullYear() - 1);
    const week52 = history.filter((row) => row.date >= toDateOnly(yearAgo));
    const high52 = week52.reduce<DailyClose | null>((best, row) => (!best || row.close > best.close ? row : best), null);
    const low52 = week52.reduce<DailyClose | null>((best, row) => (!best || row.close < best.close ? row : best), null);

    const rangeStart = new Date(checkedAt);
    rangeStart.setUTCDate(rangeStart.getUTCDate() - RANGE_DAYS[data.range]);

    return {
      checkedAt: checkedAt.toISOString(),
      priceState,
      facts: {
        monthToDate: latest && monthReference ? { value: percentChange(latest.close, monthReference.close), referenceDate: monthReference.date } : null,
        yearToDate: latest && yearReference ? { value: percentChange(latest.close, yearReference.close), referenceDate: yearReference.date } : null,
        high52Week: high52 ? { value: high52.close, date: high52.date } : null,
        low52Week: low52 ? { value: low52.close, date: low52.date } : null,
      },
      series: history.filter((row) => row.date >= toDateOnly(rangeStart)),
    };
  });