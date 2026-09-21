import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const chrome = readFileSync(new URL("./site-chrome.tsx", import.meta.url), "utf8");
const route = readFileSync(new URL("../routes/aurum.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../styles.css", import.meta.url), "utf8");
const price = readFileSync(new URL("./aurum-price-section.tsx", import.meta.url), "utf8");
const floatingNav = readFileSync(new URL("./aurum-floating-nav.tsx", import.meta.url), "utf8");
const panelScroll = readFileSync(new URL("../lib/aurum/use-nearest-panel-scroll.ts", import.meta.url), "utf8");

describe("AURUM navigation", () => {
  it("places AURUM immediately before Learn in the shared navigation", () => {
    expect(chrome).toContain('["Aurum", "/aurum"],\n  ["Learn", "/learn"]');
    expect(chrome).toContain('activeOptions={{ exact: false }}');
  });

  it("removes the retired subheader and its offset contract", () => {
    expect(route).not.toContain("aurum-subheader");
    expect(styles).not.toContain("aurum-subheader");
    expect(styles).not.toContain("--aurum-subheader-height");
  });

  it("keeps floating destinations as native anchors without manual scrolling", () => {
    expect(floatingNav).toContain('href={`#${id}`}');
    expect(floatingNav).not.toContain("scrollIntoView");
    expect(floatingNav).not.toContain('addEventListener("scroll"');
  });

  it("keeps in-place controls out of router and document scrolling", () => {
    // The range control records its state in the URL, so a router navigation is
    // allowed — but only one that cannot move the viewport.
    expect(route).not.toContain("history.replaceState");
    expect(route).toContain("resetScroll: false");
    expect(route).toContain("hashScrollIntoView: false");
    expect(route).toContain("replace: true");
    expect(route).not.toContain("scrollIntoView(");
    expect(price).not.toContain("scrollIntoView");

    expect(price).toContain("row.scrollLeft");
    expect(price).toContain("row.scrollWidth > row.clientWidth");
    expect(panelScroll.match(/scrollIntoView/g)).toHaveLength(1);
    expect(panelScroll).toContain('block: "nearest"');
    expect(panelScroll).not.toContain('block: "center"');
    expect(panelScroll).not.toContain('block: "start"');
    expect(floatingNav.match(/\.focus\(/g)).toHaveLength(3);
    expect(floatingNav.match(/preventScroll: true/g)).toHaveLength(3);
  });
});