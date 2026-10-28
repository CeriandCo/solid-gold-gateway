import { describe, expect, it } from "vitest";
import { getRemaining, launchConfig } from "./launch";

describe("launch countdown", () => {
  it("targets 21 November 2026 at midnight New York time", () => {
    expect(Date.parse(launchConfig.launchAt)).toBe(Date.UTC(2026, 10, 21, 5, 0, 0));
  });
  it("counts down from a known moment", () => {
    const now = Date.parse("2026-11-20T03:58:57Z");
    expect(getRemaining(now)).toEqual({ days: 1, hours: 1, minutes: 1, seconds: 3, done: false });
  });
  it("never goes negative after launch", () => {
    const r = getRemaining(Date.parse("2026-12-01T00:00:00Z"));
    expect(r).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, done: true });
  });
});
