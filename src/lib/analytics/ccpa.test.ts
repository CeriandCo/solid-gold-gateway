// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { isAdOptOut, setAdOptOut } from "./ccpa";

describe("CCPA opt-out", () => {
  beforeEach(() => {
    setAdOptOut(false);
    (window as unknown as { dataLayer: unknown[] }).dataLayer = [];
    Object.defineProperty(navigator, "globalPrivacyControl", { value: undefined, configurable: true });
  });

  it("saves trunk_ccpa_optout=1 and pushes ccpa_status", () => {
    setAdOptOut(true);
    expect(document.cookie).toContain("trunk_ccpa_optout=1");
    expect(isAdOptOut()).toBe(true);
    expect((window as unknown as { dataLayer: unknown[] }).dataLayer).toContainEqual({ event: "ccpa_status", ccpa_opt_out: true });
  });

  it("treats GPC as opted out", () => {
    Object.defineProperty(navigator, "globalPrivacyControl", { value: true, configurable: true });
    expect(isAdOptOut()).toBe(true);
  });
});
