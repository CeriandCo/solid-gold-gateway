import { afterEach, describe, expect, it, vi } from "vitest";
import { shouldLoadLinkedIn } from "./linkedin";

afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });

describe("LinkedIn loading rules", () => {
  it("loads only on the three production hosts", () => {
    for (const host of ["trunk.gold", "www.trunk.gold", "solid-gold-gateway.lovable.app"]) expect(shouldLoadLinkedIn(host, "/pricing")).toBe(true);
    for (const host of ["localhost", "id-preview--x.lovable.app", "trunk.gold.example.com"]) expect(shouldLoadLinkedIn(host, "/")).toBe(false);
  });
  it("excludes admin and its children, not similarly named public pages", () => {
    expect(shouldLoadLinkedIn("trunk.gold", "/admin")).toBe(false);
    expect(shouldLoadLinkedIn("trunk.gold", "/admin/posts")).toBe(false);
    expect(shouldLoadLinkedIn("trunk.gold", "/administrator-guide")).toBe(true);
  });
  it("loads once with the exact partner ID and queues conversions only when called", async () => {
    const w = { location: { hostname: "trunk.gold", pathname: "/" }, _linkedin_partner_id: "", _linkedin_data_partner_ids: [] as string[], lintrk: undefined as undefined | { (action: string, options: { conversion_id: number }): void; q?: unknown[][] } };
    const script = { src: "", async: false };
    const appendChild = vi.fn();
    vi.stubGlobal("window", w);
    vi.stubGlobal("localStorage", { getItem: () => null });
    vi.stubGlobal("document", { createElement: () => script, head: { appendChild } });
    const { initLinkedIn, trackLinkedInConversion } = await import("./linkedin");
    initLinkedIn(); initLinkedIn();
    expect(appendChild).toHaveBeenCalledTimes(1);
    expect(script.src).toBe("https://snap.licdn.com/li.lms-analytics/insight.min.js");
    expect(script.async).toBe(true);
    expect(w._linkedin_partner_id).toBe("559237849");
    expect(w._linkedin_data_partner_ids).toEqual(["559237849"]);
    expect(w.lintrk?.q).toEqual([]);
    trackLinkedInConversion(123);
    expect(w.lintrk?.q).toEqual([["track", { conversion_id: 123 }]]);
    w.location.pathname = "/admin"; trackLinkedInConversion(456);
    expect(w.lintrk?.q).toHaveLength(1);
  });
  it("skips internal browsers", async () => {
    vi.stubGlobal("window", { location: { hostname: "trunk.gold", pathname: "/" } });
    vi.stubGlobal("localStorage", { getItem: () => "1" });
    const createElement = vi.fn();
    vi.stubGlobal("document", { createElement });
    (await import("./linkedin")).initLinkedIn();
    expect(createElement).not.toHaveBeenCalled();
  });
});