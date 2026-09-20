import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const chrome = readFileSync(new URL("./site-chrome.tsx", import.meta.url), "utf8");
const route = readFileSync(new URL("../routes/aurum.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../styles.css", import.meta.url), "utf8");

describe("AURUM navigation", () => {
  it("places AURUM immediately before Learn in the shared navigation", () => {
    expect(chrome).toContain('["AURUM", "/aurum"],\n  ["Learn", "/learn"]');
    expect(chrome).toContain('activeOptions={{ exact: false }}');
  });

  it("removes the retired subheader and its offset contract", () => {
    expect(route).not.toContain("aurum-subheader");
    expect(styles).not.toContain("aurum-subheader");
    expect(styles).not.toContain("--aurum-subheader-height");
  });

  it("keeps floating destinations as native anchors without manual scrolling", () => {
    const floatingNav = readFileSync(new URL("./aurum-floating-nav.tsx", import.meta.url), "utf8");
    expect(floatingNav).toContain('href={`#${id}`}');
    expect(floatingNav).not.toContain("scrollIntoView");
    expect(floatingNav).not.toContain('addEventListener("scroll"');
  });
});