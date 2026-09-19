import { describe, expect, it } from "vitest";
import {
  calculateDeliveryEstimate,
  calculateVaultEstimate,
  formatMoney,
  formatWeight,
  roundMoney,
} from "./pricing-calculator";

describe("pricing calculator checks", () => {
  it("matches A: US$500 vault for two years", () => {
    const result = calculateVaultEstimate(500, 730);
    expect(formatWeight(result.ounces)).toBe("0.1366");
    expect(formatMoney(result.atSpot)).toBe("US$466.35");
    expect(formatMoney(result.premium)).toBe("US$18.65");
    expect(formatMoney(result.purchaseFee)).toBe("US$15.00");
    expect(result.storage.map((year) => formatMoney(year.amount))).toEqual(["US$0.00", "US$3.00"]);
    expect(result.storage[1]?.minimumApplied).toBe(true);
    expect(formatMoney(result.totalFees)).toBe("US$18.00");
  });

  it("matches B: US$500 delivery coin", () => {
    const result = calculateDeliveryEstimate(500, "coin");
    expect(result?.quantity).toBe(1);
    expect(result?.item.label).toBe("1/10 oz coin");
    expect(formatMoney(result?.atSpot ?? 0)).toBe("US$341.28");
    expect(formatMoney(result?.premium ?? 0)).toBe("US$23.89");
    expect(formatMoney(result?.total ?? 0)).toBe("US$365.17");
    expect(formatMoney(result?.remainder ?? 0)).toBe("US$134.83");
  });

  it("matches C: US$500 delivery bar", () => {
    const result = calculateDeliveryEstimate(500, "bar");
    expect(result?.quantity).toBe(1);
    expect(result?.item.label).toBe("2.5 g bar");
    expect(formatMoney(result?.atSpot ?? 0)).toBe("US$274.30");
    expect(formatMoney(result?.premium ?? 0)).toBe("US$21.95");
    expect(formatMoney(result?.total ?? 0)).toBe("US$296.25");
    expect(formatMoney(result?.remainder ?? 0)).toBe("US$203.75");
  });

  it("returns no delivery result below the cheapest item", () => {
    expect(calculateDeliveryEstimate(100, "coin")).toBeNull();
  });

  it("keeps displayed vault price lines additive", () => {
    const result = calculateVaultEstimate(500, 730);
    expect(result.atSpot + result.premium + result.purchaseFee).toBe(500);
  });

  it("keeps displayed multi-item delivery lines additive", () => {
    const result = calculateDeliveryEstimate(1_000, "coin");
    expect(result).not.toBeNull();
    expect(roundMoney((result?.atSpot ?? 0) + (result?.premium ?? 0))).toBe(result?.total);
  });
});