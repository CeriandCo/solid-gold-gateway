import { describe, expect, it } from "vitest";
import { derivePriceChange } from "./price-change";

const SOURCE = "dillon_gage:DDB P";

describe("derivePriceChange", () => {
  it("derives one rising amount and percentage without early rounding", () => {
    expect(derivePriceChange({ price: 110, baseline: 100, priceSource: SOURCE, baselineSource: SOURCE }))
      .toEqual({ amount: 10, percent: 10 });
  });

  it("makes both values negative for a falling price", () => {
    const change = derivePriceChange({ price: 4380.4, baseline: 4424.9, priceSource: SOURCE, baselineSource: SOURCE });
    expect(change?.amount).toBeCloseTo(-44.5, 10);
    expect(change?.percent).toBeLessThan(0);
  });

  it("rejects a missing or zero baseline and a source mismatch", () => {
    expect(derivePriceChange({ price: 100, baseline: null, priceSource: SOURCE, baselineSource: SOURCE })).toBeNull();
    expect(derivePriceChange({ price: 100, baseline: 0, priceSource: SOURCE, baselineSource: SOURCE })).toBeNull();
    expect(derivePriceChange({ price: 100, baseline: 90, priceSource: SOURCE, baselineSource: "yahoo:GC=F" })).toBeNull();
  });

  it("rejects supplied derivatives that contradict the price and baseline", () => {
    expect(derivePriceChange({
      price: 4380.4,
      baseline: 4424.9,
      priceSource: SOURCE,
      baselineSource: SOURCE,
      suppliedAmount: 16.2,
      suppliedPercent: 0,
    })).toBeNull();
  });

  it("accepts supplied derivatives within the display rounding tolerance", () => {
    expect(derivePriceChange({
      price: 4380.4,
      baseline: 4424.9,
      priceSource: SOURCE,
      baselineSource: SOURCE,
      suppliedAmount: -44.5,
      suppliedPercent: -1.01,
    })).not.toBeNull();
  });
});
