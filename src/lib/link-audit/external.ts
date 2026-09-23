/**
 * T5 Phase 4 — external reachability verdicts + new-tab safety rule.
 *
 * Evidence comes from scripts/link-audit/external.py (HTTP chain + real
 * Chromium navigation; Firefox re-check for Akamai/X blocks). Verdicts are
 * judgements over that evidence and are kept here, not in the JSON, so a
 * changed or new external URL fails the regression test until reviewed.
 */

export type ExternalVerdict =
  | "REACHABLE"
  | "REACHABLE VIA REDIRECT"
  | "BROWSER-REACHABLE / AUTOMATED CHECK BLOCKED"
  | "AUTOMATED CHECK BLOCKED — BROWSER INCONCLUSIVE"
  | "TEMPORARILY UNAVAILABLE"
  | "DEAD"
  | "WRONG EXTERNAL DESTINATION"
  | "CLIENT / EDITORIAL DECISION";

export type RedirectClass = "NONE" | "HEALTHY" | "STALE SOURCE URL" | "SUSPICIOUS" | "WRONG";

export interface ExternalRecord {
  verdict: ExternalVerdict;
  redirect: RedirectClass;
  http: string;
  browser: string;
  finalUrl: string | null;
  identity: string;
  blocksT5: boolean;
}

const r = (
  verdict: ExternalVerdict,
  redirect: RedirectClass,
  http: string,
  browser: string,
  finalUrl: string | null,
  identity: string,
  blocksT5 = false,
): ExternalRecord => ({ verdict, redirect, http, browser, finalUrl, identity, blocksT5 });

export const EXTERNAL_VERDICTS: Record<string, ExternalRecord> = {
  "https://www.gold.org/goldhub": r("REACHABLE", "NONE", "200", "200, title “Goldhub | The Definitive Source for Gold Data and Insight”", null, "World Gold Council Goldhub (gold.org)"),
  "https://www.gold.org/goldhub/research/gold-demand-trends": r("REACHABLE", "NONE", "200", "200, “Gold Demand Trends | World Gold Council”", null, "WGC Gold Demand Trends"),
  "https://www.jewelersboard.com/were-legit": r("REACHABLE", "NONE", "200", "200, “We're Legit! | Jewelers Board of Trade”", null, "Jewelers Board of Trade"),
  "https://www.lbma.org.uk/good-delivery/gold-current-list": r("REACHABLE", "NONE", "200", "200, “Good Delivery Current List | LBMA” (site appends #- client-side)", null, "LBMA Good Delivery current list"),
  "https://www.lbma.org.uk/prices-and-data/lbma-precious-metal-prices": r("REACHABLE", "NONE", "200", "200, “LBMA Precious Metal Prices | LBMA”", null, "LBMA precious metal prices"),
  "https://www.lbma.org.uk/publications": r("REACHABLE", "NONE", "200", "200, “Publications | LBMA”", null, "LBMA publications"),
  "https://www.linkedin.com/company/sqootpure": r("REACHABLE", "NONE", "200, title “SQOOT | LinkedIn”", "200, “SQOOT | LinkedIn” behind cookie banner", null, "LinkedIn company page “SQOOT”"),
  "https://www.mint.ca/en/company/media-room": r("REACHABLE", "NONE", "200", "200, “Media Room | The Royal Canadian Mint”, lists “All news releases”", null, "Royal Canadian Mint news releases"),
  "https://www.ncbassoc.org/membership": r("REACHABLE", "NONE", "200", "200, “National Coin & Bullion Association”", null, "NCBA membership"),
  "https://www.nist.gov/publications/nist-handbook-44-specifications-tolerances-and-other-technical-requirements-weighing-18": r("REACHABLE", "NONE", "200", "200, NIST Handbook 44 (2026 Ed.) publication record", null, "NIST Handbook 44, 2026 edition"),
  "https://x.com/sqootpure": r("REACHABLE", "NONE", "200, title “SqootPure (@SqootPure) / X”", "Chromium 403 (blank); Firefox 200, profile “SqootPure @SqootPure — Real gold. Real ownership…”", null, "X profile @SqootPure"),
  "https://www.bis.org/statistics/": r("REACHABLE VIA REDIRECT", "HEALTHY", "301 → 200", "200, “Statistics | Bank for International Settlements”", "https://www.bis.org/statistics", "BIS statistics (trailing-slash canonicalisation)"),
  "https://www.gold.org/goldhub/data/monthly-central-bank-statistics": r("REACHABLE VIA REDIRECT", "HEALTHY", "301 → 200", "200, “Central Banks Gold Reserves by Country | World Gold Council”", "https://www.gold.org/goldhub/data/gold-reserves-by-country", "WGC central-bank gold data (publisher renamed page; same-dataset equivalence is editorial, href not changed)"),
  "https://www.gold.org/goldhub/research": r("REACHABLE VIA REDIRECT", "HEALTHY", "301 → 200", "200, “Gold Research Report Library | Goldhub”", "https://www.gold.org/goldhub/research/library", "WGC research library (citation precision already editorial)"),
  "https://www.lbma.org.uk/good-delivery": r("REACHABLE VIA REDIRECT", "HEALTHY", "302 → 200", "200, “About Good Delivery | LBMA”", "https://www.lbma.org.uk/good-delivery/about-good-delivery", "LBMA Good Delivery (temporary redirect to section landing)"),
  "https://www.lbma.org.uk/prices-and-data": r("REACHABLE VIA REDIRECT", "HEALTHY", "302 → 200", "200, “LBMA Precious Metal Prices | LBMA”", "https://www.lbma.org.uk/prices-and-data/lbma-precious-metal-prices", "LBMA prices & data (temporary redirect)"),
  "https://www.pamp.com/veriscan": r("REACHABLE VIA REDIRECT", "HEALTHY", "403 (Akamai)", "Chromium 403 Akamai “Access Denied”; Firefox 200 → /veriscan/ showing VERISCAN™ nav", "https://www.pamp.com/veriscan/", "PAMP Veriscan (trailing-slash canonicalisation)"),
  "https://data.imf.org/": r("BROWSER-REACHABLE / AUTOMATED CHECK BLOCKED", "HEALTHY", "403", "200 → data.imf.org/en, “Data Home”", "https://data.imf.org/en", "IMF data portal"),
  "https://www.facebook.com/profile.php?id=61586363577228": r("BROWSER-REACHABLE / AUTOMATED CHECK BLOCKED", "HEALTHY", "400", "200 → /people/Sqoot-Pure/61586363577228/, page “Sqoot Pure”, bio “A precious metals platform to buy + Store + Gift physical gold…”", "https://www.facebook.com/people/Sqoot-Pure/61586363577228/", "Facebook page “Sqoot Pure”"),
  "https://www.usmint.gov/news": r("BROWSER-REACHABLE / AUTOMATED CHECK BLOCKED", "NONE", "403 cf-mitigated: challenge", "200, “News | U.S. Mint”", null, "US Mint news (citation precision already editorial)"),
  "https://www.usmint.gov/about/production-sales-figures": r("AUTOMATED CHECK BLOCKED — BROWSER INCONCLUSIVE", "NONE", "403 cf-mitigated: challenge", "Chromium + Firefox: Cloudflare “Performing security verification” did not clear headless; same host /news loads in browser", null, "US Mint (host confirmed; page not observed)"),
  "https://www.instagram.com/sqootpure/": r("AUTOMATED CHECK BLOCKED — BROWSER INCONCLUSIVE", "HEALTHY", "302 → 429 login", "429, redirected to login wall with next=/sqootpure/ (no login attempted)", "https://www.instagram.com/accounts/login/?next=…/sqootpure/", "Instagram (platform correct; profile not observable without login)"),
  "https://www.pamp.com/news": r("CLIENT / EDITORIAL DECISION", "SUSPICIOUS", "403 (Akamai)", "Chromium 403; Firefox 200 but redirected to PAMP homepage — /news no longer a news page", "https://www.pamp.com/", "PAMP homepage, not a news/notice page; replacement needs editorial input", false),
  "https://sqootpure.com/": r("DEAD", "NONE", "3 attempts: TLS connection closed (DNS resolves); http:// → 403 “Request forbidden by administrative rules”", "ERR_CONNECTION_CLOSED (Chromium); http:// 403 in Chromium + Firefox", null, "Client-owned domain shown on /contact; not serving a site", true),
  "https://aurum.sqootpure.com/": r("DEAD", "NONE", "3 attempts: DNS name not resolved", "ERR_NAME_NOT_RESOLVED", null, "Client-owned subdomain shown on /contact; no DNS record", true),
};

/** Pre-fix URLs replaced in Phase 4 (kept for the report and the regression test). */
export const PHASE4_REPLACED: Record<string, { replacement: string; reason: string }> = {
  "https://www.mint.ca/en/discover/news": { replacement: "https://www.mint.ca/en/company/media-room", reason: "DEAD: HTTP 404 and browser 404; publisher's own news-release page is Media Room" },
  "https://www.nist.gov/pml/owm/nist-handbook-44": { replacement: "https://www.nist.gov/publications/nist-handbook-44-specifications-tolerances-and-other-technical-requirements-weighing-18", reason: "DEAD: HTTP 404, browser “Sorry, we cannot find that page”; NIST publication record for Handbook 44 2026 Ed. (citation dated 2026-01-01)" },
  "https://www.lbma.org.uk/prices-and-data/precious-metal-prices": { replacement: "https://www.lbma.org.uk/prices-and-data/lbma-precious-metal-prices", reason: "STALE SOURCE URL: permanent 301 to the same page (“LBMA Precious Metal Prices”)" },
};

/** Reverse-tabnabbing rule: a new-tab anchor must carry noopener (noreferrer implies it). */
export function isSafeNewTab(target: string | null | undefined, rel: string | null | undefined): boolean {
  if ((target ?? "").toLowerCase() !== "_blank") return true;
  const tokens = (rel ?? "").toLowerCase().split(/\s+/);
  return tokens.includes("noopener") || tokens.includes("noreferrer");
}

/** Protocol hygiene: absolute https, no whitespace/control chars, not protocol-relative. */
export function protocolIssue(raw: string): string | null {
  if (/[\s\u0000-\u001f]/.test(raw)) return "whitespace/control character";
  if (raw.startsWith("//")) return "protocol-relative";
  if (raw.startsWith("http://")) return "plain http";
  if (!/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}(\/|$|\?)/i.test(raw)) return "malformed";
  return null;
}
