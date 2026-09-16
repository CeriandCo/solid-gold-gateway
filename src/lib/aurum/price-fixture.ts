/**
 * MOCK FIXTURE — SAMPLE DATA, NOT REAL PRICES.
 *
 * This is the only file in the codebase that contains gold price numbers.
 * It is reachable exclusively through the mock adapter. Everything derived
 * (facts, 52 week extremes, calculator results) is computed from the series
 * below, never typed in twice.
 *
 * The series is generated from a fixed seed, so it is byte-identical on every
 * load and in every screenshot. No Math.random at render time.
 */

export const FIXTURE_AS_OF = new Date("2026-09-16T14:32:07.000Z");
/** The fixture's "now": the as-of stamp reads as 12 seconds ago. */
export const FIXTURE_NOW = new Date(FIXTURE_AS_OF.getTime() + 12_000);

export const FIXTURE_SPOT = 2063.48;
export const FIXTURE_PREVIOUS_CLOSE = 2038.16;
export const FIXTURE_CHANGE_AMOUNT = 25.32;
export const FIXTURE_CHANGE_PCT = 1.24;
export const FIXTURE_DAY_HIGH = 2071.1;
export const FIXTURE_DAY_LOW = 2038.94;

/** Anchor point the look-back calculator example relies on. */
export const FIXTURE_ANCHOR = { date: "2021-04-14", close: 1745.2 };

const SERIES_START = "2021-04-14";
const SERIES_END = "2026-09-16";

export type FixturePoint = { date: string; close: number };

function dayString(time: number) {
  return new Date(time).toISOString().slice(0, 10);
}

/** Deterministic linear congruential generator. */
function makeRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function buildSeries(): FixturePoint[] {
  const start = Date.parse(`${SERIES_START}T00:00:00Z`);
  const end = Date.parse(`${SERIES_END}T00:00:00Z`);
  const dates: string[] = [];
  for (let time = start; time <= end; time += 86_400_000) {
    const weekday = new Date(time).getUTCDay();
    if (weekday === 0 || weekday === 6) continue;
    dates.push(dayString(time));
  }

  const random = makeRandom(20260916);
  const walk: number[] = [];
  let wobble = 0;
  for (let index = 0; index < dates.length; index += 1) {
    wobble = wobble * 0.985 + (random() * 2 - 1) * 11;
    walk.push(wobble);
  }

  const last = dates.length - 1;
  const trendFrom = FIXTURE_ANCHOR.close;
  const trendTo = FIXTURE_SPOT;
  const tail = walk[last] ?? 0;

  const points: FixturePoint[] = dates.map((date, index) => {
    const progress = last === 0 ? 1 : index / last;
    const trend = trendFrom + (trendTo - trendFrom) * progress;
    const swing = Math.sin(progress * Math.PI * 1.7) * 96;
    const noise = (walk[index] ?? 0) - tail * progress;
    const close = trend + swing + noise;
    return { date, close: Math.round(close * 100) / 100 };
  });

  const first = points[0];
  if (first) first.close = FIXTURE_ANCHOR.close;
  const penultimate = points[last - 1];
  if (penultimate) penultimate.close = FIXTURE_PREVIOUS_CLOSE;
  const final = points[last];
  if (final) final.close = FIXTURE_SPOT;

  return points;
}

export const FIXTURE_SERIES: FixturePoint[] = buildSeries();
