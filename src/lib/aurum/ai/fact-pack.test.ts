import { describe, expect, it } from "vitest";

import {
  buildFactPack,
  dailyNoteSlug,
  dailyWindowKey,
  roundHalfAway,
  type FactPackInputs,
} from "./fact-pack";

const NOW = new Date("2026-09-22T12:00:00.000Z");

function inputs(overrides: Partial<FactPackInputs["spot"]> = {}): FactPackInputs {
  return {
    spot: {
      id: "spot-1",
      price: 3912.36,
      currency: "USD",
      unit: "oz",
      observed_at: "2026-09-22T11:30:00.000Z",
      high_24h: 3940.1,
      low_24h: 3880.22,
      previous_close: 3866.4,
      ...(overrides as Record<string, never>),
    },
    lastClose: {
      id: "close-1",
      price_date: "2026-09-21",
      close_price: 3866.4,
      currency: "USD",
      unit: "oz",
    },
  };
}

describe("rounding", () => {
  it("rounds money and percentages half away from zero", () => {
    expect(roundHalfAway(2.5, 0)).toBe(3);
    expect(roundHalfAway(-2.5, 0)).toBe(-3);
    expect(roundHalfAway(3912.3549, 2)).toBe(3912.35);
    expect(roundHalfAway(3912.3551, 2)).toBe(3912.36);
  });
});

describe("fact pack", () => {
  it("derives change amounts in code, never from the stored provider values", () => {
    const built = buildFactPack(inputs(), { windowKey: "daily:2026-09-22", now: NOW });
    expect(built.ok).toBe(true);
    if (!built.ok) return;
    const byId = Object.fromEntries(built.pack.facts.map((fact) => [fact.id, fact]));
    expect(byId["f_spot"]!.value).toBe(3912.36);
    expect(byId["f_change_abs"]!.value).toBe(45.96);
    expect(byId["f_change_pct"]!.value).toBe(1.19);
    expect(byId["f_change_pct"]!.direction).toBe("up");
    expect(byId["f_change_abs"]!.source.table).toBe("aurum_spot_prices");
    expect(byId["f_last_daily_close"]!.source.table).toBe("aurum_daily_closes");
  });

  it("marks a falling market as down", () => {
    const built = buildFactPack(inputs({ previous_close: 4000 } as never), {
      windowKey: "w",
      now: NOW,
    });
    if (!built.ok) throw new Error("expected a pack");
    const change = built.pack.facts.find((fact) => fact.id === "f_change_pct")!;
    expect(change.direction).toBe("down");
    expect(change.value).toBeLessThan(0);
  });

  it.each([
    ["no spot row", { spot: null }, "no_spot_row"],
    [
      "stale spot row",
      { spot: { ...inputs().spot!, observed_at: "2026-09-18T00:00:00.000Z" } },
      "stale_spot_row",
    ],
    ["no comparison point", { spot: { ...inputs().spot!, previous_close: null } }, "no_comparison_point"],
    ["wrong currency", { spot: { ...inputs().spot!, currency: "EUR" } }, "unsupported_currency_or_unit"],
    ["zero price", { spot: { ...inputs().spot!, price: 0 } }, "non_positive_values"],
  ])("refuses to build a pack: %s", (_label, patch, reason) => {
    const built = buildFactPack({ ...inputs(), ...(patch as object) } as FactPackInputs, {
      windowKey: "w",
      now: NOW,
    });
    expect(built).toEqual({ ok: false, reason });
  });
});

describe("window and slug", () => {
  it("are deterministic per UTC day", () => {
    expect(dailyWindowKey(NOW)).toBe("daily:2026-09-22");
    expect(dailyWindowKey(new Date("2026-09-22T23:59:59Z"))).toBe("daily:2026-09-22");
    expect(dailyNoteSlug(NOW)).toBe("aurum-daily-note-2026-09-22");
  });
});
