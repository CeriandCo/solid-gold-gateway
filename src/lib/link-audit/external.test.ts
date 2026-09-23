import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { EXTERNAL_VERDICTS, PHASE4_REPLACED, isSafeNewTab, protocolIssue } from "./external";

const artifact = JSON.parse(readFileSync("docs/verification/t5-link-audit.json", "utf8"));
interface Occ { category: string; opensNewTab: boolean; rel: string | null; sourceRoute: string; normalizedTarget: string; rawTarget: string }
const occ: Occ[] = artifact.occurrences;
const ext = occ.filter((o) => o.category === "external");

describe("T5 Phase 4 external links", () => {
  it("isSafeNewTab requires noopener/noreferrer only for _blank", () => {
    expect(isSafeNewTab("_blank", null)).toBe(false);
    expect(isSafeNewTab("_blank", "noopener")).toBe(true);
    expect(isSafeNewTab("_blank", "noopener noreferrer")).toBe(true);
    expect(isSafeNewTab("_blank", "external")).toBe(false);
    expect(isSafeNewTab(null, null)).toBe(true);
  });

  it("every rendered new-tab anchor has opener protection (reverse-tabnabbing regression)", () => {
    const unsafe = occ.filter((o) => o.opensNewTab && !isSafeNewTab("_blank", o.rel));
    expect(unsafe.map((o) => `${o.sourceRoute} ${o.normalizedTarget}`)).toEqual([]);
  });

  it("project convention noopener noreferrer is preserved on every external _blank", () => {
    for (const o of ext.filter((x) => x.opensNewTab)) expect(o.rel).toBe("noopener noreferrer");
  });

  it("every rendered external URL has a reviewed Phase 4 verdict", () => {
    const missing = [...new Set(ext.map((o) => o.normalizedTarget))].filter((u) => !EXTERNAL_VERDICTS[u]);
    expect(missing).toEqual([]);
  });

  it("no external link uses http, protocol-relative, malformed or whitespace URLs", () => {
    expect(ext.map((o) => protocolIssue(o.rawTarget)).filter(Boolean)).toEqual([]);
    expect(protocolIssue("http://a.com")).toBe("plain http");
    expect(protocolIssue("//a.com")).toBe("protocol-relative");
    expect(protocolIssue(" https://a.com")).toBe("whitespace/control character");
  });

  it("replaced dead/stale URLs no longer render anywhere", () => {
    const rendered = new Set(ext.map((o) => o.normalizedTarget));
    for (const [old, { replacement }] of Object.entries(PHASE4_REPLACED)) {
      expect(rendered.has(old)).toBe(false);
      expect(rendered.has(replacement)).toBe(true);
    }
  });

  it("Goldhub fix stays on the official WGC portal, new tab, protected", () => {
    const g = ext.filter((o) => o.normalizedTarget === "https://www.gold.org/goldhub");
    expect(g.map((o) => [o.opensNewTab, o.rel])).toEqual([[true, "noopener noreferrer"]]);
    expect(EXTERNAL_VERDICTS["https://www.gold.org/goldhub"].verdict).toBe("REACHABLE");
  });

  it("Sign Up on Gold.org remains an unresolved placeholder (not invented)", () => {
    const s = occ.filter((o) => o.category === "placeholder");
    expect(s.map((o) => o.rawTarget)).toEqual(["#"]);
  });
});
