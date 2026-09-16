/**
 * DEMO FIXTURE — SAMPLE DATA, NOT REAL PRICES.
 *
 * This is the only file in the codebase that contains gold price numbers.
 * It is reachable exclusively through the demo adapter, which is off by default
 * and ignored in production builds. Delete this file when the real feed is fixed.
 */

export const DEMO_SPOT_USD = 2063.48;
export const DEMO_CHANGE_PCT = 1.24;
export const DEMO_CHANGE_AMOUNT = 25.32;

export const DEMO_DERIVED = {
  high24h: 2078.9,
  low24h: 2034.1,
  previousClose: 2038.16,
};

export const DEMO_FACTS = {
  monthToDate: { value: 3.1, referenceDate: "2026-09-01" },
  yearToDate: { value: 18.42, referenceDate: "2025-12-31" },
  high52Week: { value: 2214.6, date: "2026-04-14" },
  low52Week: { value: 1742.05, date: "2025-11-03" },
};

/** A plausible daily series so the chart has shape. Generated, not observed. */
export function buildDemoSeries(days: number, endDate: Date): Array<{ date: string; close: number }> {
  const points: Array<{ date: string; close: number }> = [];
  let value = DEMO_SPOT_USD * 0.86;
  for (let index = days; index >= 0; index -= 1) {
    const day = new Date(endDate.getTime() - index * 86_400_000);
    const weekday = day.getUTCDay();
    if (weekday === 0 || weekday === 6) continue;
    const drift = (DEMO_SPOT_USD - value) / (index + 8);
    const wobble = Math.sin(index / 6) * 7 + Math.cos(index / 2.5) * 3;
    value = value + drift + wobble * 0.4;
    points.push({ date: day.toISOString().slice(0, 10), close: Math.round(value * 100) / 100 });
  }
  const last = points.at(-1);
  if (last) last.close = DEMO_SPOT_USD;
  return points;
}
