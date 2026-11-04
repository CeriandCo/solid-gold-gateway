import { afterEach, describe, expect, it, vi } from "vitest";
import { shouldLoadMetricool } from "./metricool";

afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });

describe("Metricool loading rules", () => {
  it("loads only on the three production hosts", () => {
    for (const host of ["trunk.gold", "www.trunk.gold", "solid-gold-gateway.lovable.app"]) expect(shouldLoadMetricool(host, "/pricing")).toBe(true);
    for (const host of ["localhost", "id-preview--x.lovable.app", "trunk.gold.example.com"]) expect(shouldLoadMetricool(host, "/")).toBe(false);
  });
  it("excludes admin and its children, not similarly named public pages", () => {
    expect(shouldLoadMetricool("trunk.gold", "/admin")).toBe(false);
    expect(shouldLoadMetricool("trunk.gold", "/admin/posts")).toBe(false);
    expect(shouldLoadMetricool("trunk.gold", "/administrator-guide")).toBe(true);
  });
  it("loads once and tracks once per pathname, without a first-load duplicate", async () => {
    const script = { onload: () => {}, src: "", async: false };
    const appendChild = vi.fn();
    const t = vi.fn();
    const location = { hostname: "trunk.gold", pathname: "/" };
    vi.stubGlobal("window", { location, beTracker: { t } });
    vi.stubGlobal("localStorage", { getItem: () => null });
    vi.stubGlobal("document", { createElement: () => script, head: { appendChild } });
    const { initMetricool } = await import("./metricool");
    initMetricool(); initMetricool();
    expect(appendChild).toHaveBeenCalledTimes(1);
    expect(script.src).toBe("https://tracker.metricool.com/resources/be.js");
    script.onload(); initMetricool();
    expect(t).toHaveBeenCalledTimes(1);
    expect(t).toHaveBeenCalledWith({ hash: "d50f9e1e0e1d26d82d2786ce19a34567" });
    location.pathname = "/pricing"; initMetricool(); initMetricool();
    expect(t).toHaveBeenCalledTimes(2);
    location.pathname = "/admin"; initMetricool();
    expect(t).toHaveBeenCalledTimes(2);
    location.pathname = "/pricing"; initMetricool();
    expect(t).toHaveBeenCalledTimes(3);
  });
  it("skips internal browsers", async () => {
    vi.stubGlobal("window", { location: { hostname: "trunk.gold", pathname: "/" } });
    vi.stubGlobal("localStorage", { getItem: () => "1" });
    const createElement = vi.fn();
    vi.stubGlobal("document", { createElement });
    (await import("./metricool")).initMetricool();
    expect(createElement).not.toHaveBeenCalled();
  });
});