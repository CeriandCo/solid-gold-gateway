import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  classifyHref,
  classifyRedirect,
  classifyRoutePath,
  isPlaceholderHref,
  normalizeInternal,
  parseFullPaths,
  relSafety,
  technicalVerdict,
} from "./analyze";

const SRC = "http://localhost:8080/learn/how-to-buy-gold-safely";
const ORIGINS = ["http://localhost:8080", "https://solid-gold-gateway.lovable.app"];

describe("route inventory", () => {
  it("classifies every route in the generated route tree (fails loudly on new route shapes)", () => {
    const paths = parseFullPaths(readFileSync("src/routeTree.gen.ts", "utf8"));
    expect(paths.length).toBeGreaterThan(20);
    for (const p of paths) expect(["public-static", "public-dynamic", "internal", "layout-alias"]).toContain(classifyRoutePath(p));
    expect(classifyRoutePath("/admin/posts/$postId")).toBe("internal");
    expect(classifyRoutePath("/api/public/stripe-webhook")).toBe("internal");
    expect(classifyRoutePath("/aurum/notes/$slug")).toBe("public-dynamic");
    expect(classifyRoutePath("/learn/")).toBe("layout-alias");
    expect(classifyRoutePath("/")).toBe("public-static");
    // The only dynamic public routes are the two editorial detail routes.
    expect(paths.filter((p) => classifyRoutePath(p) === "public-dynamic").sort()).toEqual(["/aurum/briefs/$slug", "/aurum/notes/$slug"]);
  });
});

describe("normalisation", () => {
  it("drops trailing slash, sorts query, keeps query, decodes unreserved only", () => {
    const n = normalizeInternal(new URL("http://x/learn/?b=2&a=1#Top"));
    expect(n).toEqual({ path: "/learn", query: "?a=1&b=2", key: "/learn?a=1&b=2", fragment: "Top" });
    expect(normalizeInternal(new URL("http://x/%61bc%2F")).path).toBe("/abc%2F");
    expect(normalizeInternal(new URL("http://x/")).path).toBe("/");
  });
});

describe("classification", () => {
  const c = (raw: string | null, has = true) => classifyHref(raw, has, SRC, ORIGINS);
  it("internal page, relative and root-relative", () => {
    expect(c("/learn").category).toBe("internal-page");
    expect(c("gifting-gold-guide").destinationKey).toBe("/learn/gifting-gold-guide");
    expect(c("/aurum/notes?page=2").destinationKey).toBe("/aurum/notes?page=2");
  });
  it("same-origin absolute and production absolute are first-party, not external", () => {
    expect(c("http://localhost:8080/vault").category).toBe("internal-page");
    const prod = c("https://solid-gold-gateway.lovable.app/vault");
    expect(prod.category).toBe("internal-page");
    expect(prod.host).toBe("solid-gold-gateway.lovable.app");
  });
  it("fragments", () => {
    expect(c("#subscribe")).toMatchObject({ category: "same-page-fragment", fragment: "subscribe", destinationKey: "/learn/how-to-buy-gold-safely" });
    expect(c("/aurum#subscribe")).toMatchObject({ category: "internal-fragment", fragment: "subscribe", destinationKey: "/aurum" });
  });
  it("external, mailto, tel, dev host", () => {
    expect(c("https://x.com/sqootpure")).toMatchObject({ category: "external", destinationKey: "https://x.com/sqootpure" });
    expect(c("mailto:hello@sqootpure.com").category).toBe("mailto");
    expect(c("tel:+1 (555) 010-0000").normalized).toBe("tel:+15550100000");
    expect(c("http://127.0.0.1:3000/x").devHost).toBe(true);
    expect(c("https://id-preview--abc.lovable.app/").devHost).toBe(true);
  });
  it("placeholders", () => {
    expect(isPlaceholderHref("#", true).placeholder).toBe(true);
    expect(isPlaceholderHref("", true).placeholder).toBe(true);
    expect(isPlaceholderHref("   ", true).placeholder).toBe(true);
    expect(isPlaceholderHref(null, false).reason).toBe("missing href");
    expect(isPlaceholderHref("javascript:void(0)", true).placeholder).toBe(true);
    expect(isPlaceholderHref("javascript:;", true).placeholder).toBe(true);
    expect(isPlaceholderHref("https://example.com/x", true).placeholder).toBe(true);
    expect(isPlaceholderHref("https://YOUR_URL", true).placeholder).toBe(true);
    expect(isPlaceholderHref("/learn", true).placeholder).toBe(false);
    expect(isPlaceholderHref("#subscribe", true).placeholder).toBe(false);
  });
});

describe("rel / target", () => {
  it("noreferrer implies noopener; missing rel on _blank is unsafe", () => {
    expect(relSafety("_blank", "noopener noreferrer").safe).toBe(true);
    expect(relSafety("_blank", "noreferrer").noopener).toBe(true);
    expect(relSafety("_blank", null).safe).toBe(false);
    expect(relSafety(null, null)).toMatchObject({ newTab: false, safe: true });
  });
});

describe("redirects", () => {
  const h = (url: string, status: number | string) => ({ url, status });
  it("classifies chains", () => {
    expect(classifyRedirect([h("http://x/a", 200)])).toBe("direct");
    expect(classifyRedirect([h("http://x/learn/", 307), h("http://x/learn", 200)])).toBe("canonical-redirect");
    expect(classifyRedirect([h("http://x/aurum", 307), h("http://x/aurum?range=1Y", 200)])).toBe("canonical-redirect");
    expect(classifyRedirect([h("http://x/old", 301), h("http://x/", 200)])).toBe("unexpected-redirect");
    expect(classifyRedirect([h("http://x/a?note=z", 307), h("http://x/a", 200)])).toBe("unexpected-redirect");
    expect(classifyRedirect([h("http://x/a", 404)])).toBe("not-found");
    expect(classifyRedirect([h("http://x/a", 302), h("http://x/a", "LOOP")])).toBe("loop");
  });
});

describe("technical verdicts", () => {
  const cl = (raw: string) => classifyHref(raw, true, SRC, ORIGINS);
  it("maps evidence to severity", () => {
    expect(technicalVerdict({ classified: cl("#"), relSafe: true }).severity).toBe("BROKEN");
    expect(technicalVerdict({ classified: cl("/x"), redirect: "not-found", relSafe: true }).severity).toBe("BROKEN");
    expect(technicalVerdict({ classified: cl("/aurum#nope"), redirect: "direct", fragmentExists: false, relSafe: true }).severity).toBe("BROKEN");
    expect(technicalVerdict({ classified: cl("/old"), redirect: "unexpected-redirect", relSafe: true }).severity).toBe("SUSPICIOUS");
    expect(technicalVerdict({ classified: cl("https://x.com/a"), relSafe: false }).severity).toBe("SUSPICIOUS");
    expect(technicalVerdict({ classified: cl("https://x.com/a"), relSafe: true }).severity).toBe("EXTERNAL TO VERIFY");
    expect(technicalVerdict({ classified: cl("/learn"), redirect: "direct", relSafe: true }).severity).toBe("NEEDS SEMANTIC REVIEW");
  });
});
