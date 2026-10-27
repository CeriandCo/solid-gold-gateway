import { describe, it, expect } from "vitest";
import { shouldLoadGA4 } from "./ga4";

describe("GA4 loading rules", () => {
  it("loads on trunk.gold and www.trunk.gold", () => {
    expect(shouldLoadGA4("trunk.gold", "/")).toBe(true);
    expect(shouldLoadGA4("www.trunk.gold", "/pricing")).toBe(true);
  });
  it("never loads on preview or localhost", () => {
    expect(shouldLoadGA4("id-preview--x.lovable.app", "/")).toBe(false);
    expect(shouldLoadGA4("solid-gold-gateway.lovable.app", "/")).toBe(false);
    expect(shouldLoadGA4("localhost", "/")).toBe(false);
  });
  it("never loads on /admin", () => {
    expect(shouldLoadGA4("trunk.gold", "/admin")).toBe(false);
    expect(shouldLoadGA4("trunk.gold", "/admin/posts")).toBe(false);
  });
});
