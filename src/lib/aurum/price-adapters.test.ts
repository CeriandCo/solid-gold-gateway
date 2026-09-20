import { describe, expect, it, vi } from "vitest";
import { parseLivePricePayload } from "./price-adapters";

const base = {
  price_usd: 4380.4,
  change_amount: -44.5,
  change_pct: -1.005672444574,
  day_high: 4396.2,
  day_low: 4354.9,
  previous_close: 4424.9,
  previous_close_source: "dillon_gage:DDB P",
  provider: "dillon_gage:DDB P",
  provider_timestamp: "2026-09-20T15:00:03.000Z",
  age_seconds: 10,
  freshness: "fresh",
};

describe("parseLivePricePayload", () => {
  it("keeps a verified same-feed falling change", () => {
    const state = parseLivePricePayload(base, [], "unavailable");
    expect(state.status).toBe("ready");
    if (state.status !== "ready") return;
    expect(state.data.changeAmount).toBeCloseTo(-44.5, 10);
    expect(state.data.changePct).toBeLessThan(0);
    expect(state.data.provider).toBe(state.data.previousCloseSource);
  });

  it("keeps spot but hides contradictory change data", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const state = parseLivePricePayload({ ...base, change_amount: 16.2, change_pct: 0 }, [], "unavailable");
    expect(state.status).toBe("ready");
    if (state.status !== "ready") return;
    expect(state.data.spot).toBe(4380.4);
    expect(state.data.changeAmount).toBeNull();
    expect(state.data.changePct).toBeNull();
    expect(state.data.previousClose).toBeNull();
    expect(error).toHaveBeenCalledOnce();
    error.mockRestore();
  });

  it("hides change when the baseline source differs", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const state = parseLivePricePayload({ ...base, previous_close_source: "yahoo:GC=F" }, [], "unavailable");
    expect(state.status).toBe("ready");
    if (state.status !== "ready") return;
    expect(state.data.changeAmount).toBeNull();
    expect(state.data.previousCloseSource).toBeNull();
    error.mockRestore();
  });
});