/**
 * T5 link audit — pure classification / normalisation / verdict logic.
 *
 * No I/O. The rendered crawler (scripts/link-audit/crawl.py) gathers raw
 * evidence; scripts/link-audit/analyze.ts feeds it through these functions.
 * Everything here is unit-tested in analyze.test.ts.
 */

export const PRODUCTION_ORIGINS = ["https://solid-gold-gateway.lovable.app"] as const;

export type LinkCategory =
  | "internal-page"
  | "internal-fragment"
  | "same-page-fragment"
  | "external"
  | "mailto"
  | "tel"
  | "placeholder"
  | "programmatic"
  | "other-scheme";

export type Severity = "BROKEN" | "SUSPICIOUS" | "NEEDS SEMANTIC REVIEW" | "EXTERNAL TO VERIFY" | "OK";

export type HttpHop = { url: string; status: number | string; error?: string };

// ---------------------------------------------------------------- routes

export type RouteKind = "public-static" | "public-dynamic" | "internal" | "layout-alias";

/**
 * Classifies one full path from routeTree.gen.ts. Admin and API paths are
 * internal. Index routes ending in "/" are aliases of their non-slash path.
 * Paths with "$" are dynamic and must be expanded from content.
 */
export function classifyRoutePath(fullPath: string): RouteKind {
  if (fullPath === "/admin" || fullPath.startsWith("/admin/") || fullPath.startsWith("/api/")) return "internal";
  if (fullPath.includes("$")) return "public-dynamic";
  if (fullPath !== "/" && fullPath.endsWith("/")) return "layout-alias";
  return "public-static";
}

/** Extracts the keys of `interface FileRoutesByFullPath` from routeTree.gen.ts source. */
export function parseFullPaths(routeTreeSource: string): string[] {
  const m = routeTreeSource.match(/export interface FileRoutesByFullPath \{([\s\S]*?)\n\}/);
  if (!m) throw new Error("FileRoutesByFullPath not found in route tree");
  return [...(m[1] ?? "").matchAll(/^\s*'([^']+)'\s*:/gm)].map((x) => x[1] as string);
}

// ---------------------------------------------------------------- URLs

const PLACEHOLDER_HOSTS = /(^|\.)(example\.(com|org|net)|test|invalid|localhost|your-?domain\.[a-z]+|placeholder\.[a-z]+)$/i;
const PLACEHOLDER_TOKENS = /(YOUR_URL|TODO|TBD|FIXME|lorem|placeholder)/i;
const DEV_HOSTS = /(^localhost$|^127\.0\.0\.1$|^0\.0\.0\.0$|lovableproject\.com$|^id-preview--|^preview--|-dev\.lovable\.app$|staging|\.local$)/i;

export function isPlaceholderHref(raw: string | null, hasHref: boolean): { placeholder: boolean; reason?: string } {
  if (!hasHref) return { placeholder: true, reason: "missing href" };
  const v = (raw ?? "").trim();
  if (v === "") return { placeholder: true, reason: "empty href" };
  if (v === "#") return { placeholder: true, reason: 'href="#"' };
  if (/^javascript:/i.test(v)) return { placeholder: true, reason: "javascript: URL" };
  if (PLACEHOLDER_TOKENS.test(v)) return { placeholder: true, reason: "placeholder token in URL" };
  try {
    const u = new URL(v, "https://base.invalid/");
    if (u.hostname !== "base.invalid" && PLACEHOLDER_HOSTS.test(u.hostname) && !DEV_HOSTS.test(u.hostname))
      return { placeholder: true, reason: `placeholder host ${u.hostname}` };
  } catch {
    return { placeholder: true, reason: "unparseable URL" };
  }
  return { placeholder: false };
}

export function isDevelopmentHost(hostname: string): boolean {
  return DEV_HOSTS.test(hostname);
}

/**
 * Normalises a same-origin URL into the key used for destination grouping:
 * pathname (percent-decoding unreserved chars only, trailing slash removed
 * except root) + sorted query string. The query is KEPT because on this site
 * it selects content (e.g. /aurum/notes?page=2, /aurum?note=slug).
 */
export function normalizeInternal(url: URL): { path: string; query: string; key: string; fragment: string | null } {
  let path = url.pathname.replace(/%[0-9a-f]{2}/gi, (e) => {
    const c = String.fromCharCode(parseInt(e.slice(1), 16));
    return /[A-Za-z0-9\-._~]/.test(c) ? c : e.toUpperCase();
  });
  if (path.length > 1) path = path.replace(/\/+$/, "");
  const params = [...url.searchParams.entries()].sort(([a, av], [b, bv]) => (a === b ? av.localeCompare(bv) : a.localeCompare(b)));
  const query = params.length ? "?" + new URLSearchParams(params).toString() : "";
  const fragment = url.hash ? decodeURIComponent(url.hash.slice(1)) : null;
  return { path, query, key: path + query, fragment };
}

export type Classified = {
  category: LinkCategory;
  normalized: string | null;
  destinationKey: string | null;
  fragment: string | null;
  placeholderReason?: string | undefined;
  host?: string | undefined;
  devHost?: boolean | undefined;
};

/**
 * @param raw     the literal href attribute
 * @param hasHref whether the attribute exists at all
 * @param sourceUrl absolute URL of the page the link was rendered on
 * @param siteOrigins origins treated as first-party (crawl origin + production)
 */
export function classifyHref(raw: string | null, hasHref: boolean, sourceUrl: string, siteOrigins: string[]): Classified {
  const ph = isPlaceholderHref(raw, hasHref);
  if (ph.placeholder) return { category: "placeholder", normalized: null, destinationKey: null, fragment: null, placeholderReason: ph.reason };
  const v = (raw as string).trim();
  if (/^mailto:/i.test(v)) return { category: "mailto", normalized: v, destinationKey: v.toLowerCase(), fragment: null };
  if (/^tel:/i.test(v)) return { category: "tel", normalized: v.replace(/[\s()-]/g, ""), destinationKey: v.replace(/[\s()-]/g, ""), fragment: null };
  const url = new URL(v, sourceUrl);
  if (url.protocol !== "http:" && url.protocol !== "https:")
    return { category: "other-scheme", normalized: v, destinationKey: v, fragment: null };
  const src = new URL(sourceUrl);
  const firstParty = siteOrigins.includes(url.origin);
  if (!firstParty) {
    const devHost = isDevelopmentHost(url.hostname);
    const norm = url.origin.toLowerCase() + (url.pathname || "/") + url.search;
    return { category: "external", normalized: norm + url.hash, destinationKey: norm, fragment: url.hash ? url.hash.slice(1) : null, host: url.hostname, devHost };
  }
  const n = normalizeInternal(url);
  const srcN = normalizeInternal(src);
  const samePage = v.startsWith("#") || (n.key === srcN.key && n.fragment !== null && url.origin === src.origin && /^[?#]/.test(v));
  const productionAbsolute = url.origin !== src.origin;
  const category: LinkCategory = n.fragment !== null ? (samePage ? "same-page-fragment" : "internal-fragment") : "internal-page";
  return {
    category,
    normalized: n.key + (n.fragment !== null ? "#" + n.fragment : ""),
    destinationKey: n.key,
    fragment: n.fragment,
    host: productionAbsolute ? url.hostname : undefined,
  };
}

// ---------------------------------------------------------------- new tab

export function relSafety(target: string | null, rel: string | null): { newTab: boolean; noopener: boolean; noreferrer: boolean; safe: boolean } {
  const newTab = (target ?? "").trim().toLowerCase() === "_blank";
  const tokens = new Set((rel ?? "").toLowerCase().split(/\s+/).filter(Boolean));
  // noreferrer implies noopener per the HTML spec.
  const noopener = tokens.has("noopener") || tokens.has("noreferrer");
  return { newTab, noopener, noreferrer: tokens.has("noreferrer"), safe: !newTab || noopener };
}

// ---------------------------------------------------------------- redirects

export type RedirectClass = "direct" | "canonical-redirect" | "unexpected-redirect" | "loop" | "not-found" | "failure";

/**
 * Classifies an HTTP chain. A redirect is "canonical" only when the final URL
 * differs from the first by trailing slash or by added default search params on
 * the SAME path; anything else is flagged for review, never auto-accepted.
 */
export function classifyRedirect(chain: HttpHop[]): RedirectClass {
  if (!chain.length) return "failure";
  const last = chain[chain.length - 1]!;
  if (last.status === "LOOP" || last.status === "TOO_MANY_REDIRECTS") return "loop";
  if (typeof last.status !== "number") return "failure";
  if (last.status === 404 || last.status === 410) return "not-found";
  if (last.status >= 400) return "failure";
  if (chain.length === 1) return "direct";
  const a = new URL(chain[0]!.url);
  const b = new URL(last.url);
  const strip = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);
  if (a.origin !== b.origin || strip(a.pathname) !== strip(b.pathname)) return "unexpected-redirect";
  for (const [k, v] of a.searchParams) if (b.searchParams.get(k) !== v) return "unexpected-redirect";
  return "canonical-redirect";
}

// ---------------------------------------------------------------- verdicts

export type TechInput = {
  classified: Classified;
  redirect?: RedirectClass;
  fragmentExists?: boolean | null;
  relSafe: boolean;
  ariaDisabled?: boolean;
};

export function technicalVerdict(i: TechInput): { severity: Severity; reasons: string[] } {
  const reasons: string[] = [];
  const c = i.classified;
  if (c.category === "placeholder") {
    if (i.ariaDisabled) return { severity: "SUSPICIOUS", reasons: [`placeholder (${c.placeholderReason}) but aria-disabled`] };
    return { severity: "BROKEN", reasons: [`placeholder: ${c.placeholderReason}`] };
  }
  if (c.category === "other-scheme") return { severity: "SUSPICIOUS", reasons: ["unexpected URL scheme"] };
  if (c.category === "external") {
    if (c.devHost) return { severity: "SUSPICIOUS", reasons: [`development/staging host ${c.host}`] };
    if (!i.relSafe) reasons.push("target=_blank without noopener");
    return { severity: reasons.length ? "SUSPICIOUS" : "EXTERNAL TO VERIFY", reasons };
  }
  if (c.category === "mailto" || c.category === "tel") return { severity: "NEEDS SEMANTIC REVIEW", reasons: ["address must be confirmed by client"] };
  // internal
  if (i.redirect === "not-found") return { severity: "BROKEN", reasons: ["destination 404"] };
  if (i.redirect === "loop") return { severity: "BROKEN", reasons: ["redirect loop"] };
  if (i.redirect === "failure") return { severity: "BROKEN", reasons: ["destination failed"] };
  if (c.fragment !== null && c.fragment !== "" && i.fragmentExists === false) return { severity: "BROKEN", reasons: [`fragment #${c.fragment} not found on destination`] };
  if (i.redirect === "unexpected-redirect") return { severity: "SUSPICIOUS", reasons: ["unexpected redirect"] };
  if (c.host) reasons.push(`absolute URL to ${c.host} instead of relative path`);
  if (!i.relSafe) reasons.push("target=_blank without noopener");
  if (reasons.length) return { severity: "SUSPICIOUS", reasons };
  if (i.redirect === "canonical-redirect") reasons.push("canonical redirect (review)");
  return { severity: "NEEDS SEMANTIC REVIEW", reasons };
}
