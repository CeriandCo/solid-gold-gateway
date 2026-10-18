import { describe, expect, it } from "vitest";
import { PRICING } from "../config/pricing";

describe("starting gold purchase amount", () => {
  it("starts at $50", () => {
    expect(PRICING.vault.minimumPurchaseUsd).toBe(50);
  });
});
