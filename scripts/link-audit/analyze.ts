/**
 * T5 link audit — turns raw crawler evidence into the audit artifact.
 * Usage: bun scripts/link-audit/analyze.ts [/tmp/link-audit/raw.json] [docs/verification/t5-link-audit.json]
 */
import { readFileSync, writeFileSync } from "node:fs";
import {
  PRODUCTION_ORIGINS,
  classifyHref,
  classifyRedirect,
  relSafety,
  technicalVerdict,
  type HttpHop,
} from "../../src/lib/link-audit/analyze";

const [rawPath = "/tmp/link-audit/raw.json", outPath = "docs/verification/t5-link-audit.json"] = process.argv.slice(2);
const raw = JSON.parse(readFileSync(rawPath, "utf8"));
const base: string = raw.base;
const origins = [base, ...PRODUCTION_ORIGINS];

type Snap = { ok: boolean; title?: string; h1?: string; ids?: string[]; anchorNames?: string[]; links?: any[]; buttons?: any[]; finalUrl?: string; error?: string; pageErrors?: string[] };
const pages: { route: { path: string; source: string }; http: HttpHop[]; viewports: Record<string, Snap> }[] = raw.pages;

// Page identity + ids per path.
const pageByPath = new Map<string, { title: string | null; h1: string | null; ids: Set<string> }>();
for (const p of pages) {
  const ids = new Set<string>();
  for (const v of Object.values(p.viewports)) (v.ids ?? []).concat(v.anchorNames ?? []).forEach((i) => ids.add(i));
  const v = p.viewports["1440"];
  pageByPath.set(p.route.path, { title: v?.title ?? null, h1: v?.h1 ?? null, ids });
}
function destinationInfo(key: string) {
  const d = raw.destinations[base + key];
  const path = key.split("?")[0];
  const crawled = pageByPath.get(path);
  const ids = new Set<string>(crawled ? crawled.ids : d?.render?.ids ?? []);
  (d?.render?.anchorNames ?? []).forEach((i: string) => ids.add(i));
  return {
    chain: (d?.http ?? []) as HttpHop[],
    title: crawled?.title ?? d?.render?.title ?? null,
    h1: crawled?.h1 ?? d?.render?.h1 ?? null,
    ids,
  };
}

const occurrences: any[] = [];
const buttons: any[] = [];
for (const p of pages) {
  const sourceUrl = base + p.route.path;
  const merged = new Map<string, any>();
  for (const [vw, snap] of Object.entries(p.viewports)) {
    for (const l of snap.links ?? []) {
      const k = l.domPath + "|" + l.rawHref;
      const e = merged.get(k);
      if (e) { e.viewports.push(vw); e.visibleIn = e.visibleIn.concat(l.visible ? [vw] : []); continue; }
      merged.set(k, { ...l, viewports: [vw], visibleIn: l.visible ? [vw] : [] });
    }
    for (const b of snap.buttons ?? []) {
      if (b.ariaExpanded !== null || b.inForm) continue; // disclosure toggles and form submits are not navigation
      if (!buttons.some((x) => x.source === p.route.path && x.domPath === b.domPath))
        buttons.push({ source: p.route.path, text: b.text, surface: b.surface, context: b.context, domPath: b.domPath, viewport: vw });
    }
  }
  for (const l of merged.values()) {
    const classified = classifyHref(l.rawHref, l.hasHref, sourceUrl, origins);
    const rs = relSafety(l.target, l.rel);
    let dest: ReturnType<typeof destinationInfo> | null = null;
    let redirect: ReturnType<typeof classifyRedirect> | undefined;
    let fragmentExists: boolean | null = null;
    if (classified.destinationKey && classified.category.startsWith("internal") || classified.category === "same-page-fragment") {
      dest = destinationInfo(classified.destinationKey!);
      redirect = dest.chain.length ? classifyRedirect(dest.chain) : classified.category === "same-page-fragment" ? classifyRedirect(p.http) : "failure";
      if (classified.fragment !== null) fragmentExists = classified.fragment === "" ? null : dest.ids.has(classified.fragment);
    }
    const tv = technicalVerdict({ classified, redirect, fragmentExists, relSafe: rs.safe, ariaDisabled: l.ariaDisabled === "true" });
    occurrences.push({
      sourcePage: pageByPath.get(p.route.path)?.title ?? p.route.path,
      sourceRoute: p.route.path,
      linkText: l.text,
      rawTarget: l.rawHref,
      normalizedTarget: classified.normalized,
      destinationKey: classified.destinationKey,
      category: classified.category,
      status: dest ? (dest.chain.at(-1)?.status ?? null) : null,
      redirectClass: redirect ?? null,
      redirectChain: dest && dest.chain.length > 1 ? dest.chain : null,
      fragment: classified.fragment,
      fragmentExists,
      opensNewTab: rs.newTab,
      rel: l.rel,
      relSafe: rs.safe,
      destinationTitle: dest?.title ?? null,
      destinationH1: dest?.h1 ?? null,
      surface: l.surface,
      global: l.surface === "header" || l.surface === "footer" || l.surface.startsWith("nav:Primary") || l.surface.startsWith("nav:Mobile"),
      context: l.context,
      viewports: l.viewports,
      visibleIn: l.visibleIn,
      revealedBy: l.revealedBy,
      domPath: l.domPath,
      tag: l.tag,
      placeholderReason: classified.placeholderReason ?? null,
      technicalVerdict: tv.severity,
      technicalReasons: tv.reasons,
      semanticVerdict: "PENDING (Phase 3)",
      finalVerdict: tv.severity,
      suggestedFix: null,
      notes: null,
    });
  }
}

// Destination-level
const destinations: Record<string, any> = {};
for (const o of occurrences) {
  if (!o.destinationKey) continue;
  const d = (destinations[o.destinationKey] ??= { category: o.category === "same-page-fragment" || o.category.startsWith("internal") ? "internal" : o.category, occurrences: 0, status: o.status, redirectClass: o.redirectClass, title: o.destinationTitle });
  d.occurrences++;
}

// Route baseline + orphans
const inbound = new Map<string, number>();
for (const o of occurrences) if (o.destinationKey && o.category !== "same-page-fragment" && o.category.startsWith("internal")) {
  const path = o.destinationKey.split("?")[0];
  if (path !== o.sourceRoute) inbound.set(path, (inbound.get(path) ?? 0) + 1);
}
const routeBaseline = pages.map((p) => ({
  route: p.route.path,
  source: p.route.source,
  status: p.http.at(-1)?.status,
  redirect: classifyRedirect(p.http),
  chain: p.http.length > 1 ? p.http : null,
  title: p.viewports["1440"]?.title ?? null,
  h1: p.viewports["1440"]?.h1 ?? null,
  rendered: Object.values(p.viewports).every((v) => v.ok),
  pageErrors: Object.values(p.viewports).flatMap((v) => v.pageErrors ?? []),
  inboundLinks: inbound.get(p.route.path) ?? 0,
}));

const count = (f: (o: any) => boolean) => occurrences.filter(f).length;
const uniq = (f: (o: any) => boolean) => new Set(occurrences.filter(f).map((o) => o.destinationKey)).size;
const sev = (s: string) => count((o) => o.technicalVerdict === s);
const summary = {
  publicRoutes: pages.length,
  renderedRoutesAudited: routeBaseline.filter((r) => r.rendered).length,
  linkOccurrences: occurrences.length,
  uniqueInternalDestinations: uniq((o) => o.category.startsWith("internal") || o.category === "same-page-fragment"),
  internalPageOccurrences: count((o) => o.category === "internal-page"),
  internalFragmentOccurrences: count((o) => o.category === "internal-fragment"),
  samePageFragmentOccurrences: count((o) => o.category === "same-page-fragment"),
  externalOccurrences: count((o) => o.category === "external"),
  uniqueExternalDestinations: uniq((o) => o.category === "external"),
  mailto: count((o) => o.category === "mailto"),
  tel: count((o) => o.category === "tel"),
  placeholderCandidates: count((o) => o.category === "placeholder"),
  blankTargetOccurrences: count((o) => o.opensNewTab),
  blankWithoutNoopener: count((o) => o.opensNewTab && !o.relSafe),
  redirectOccurrences: count((o) => o.redirectChain),
  uniqueRedirectingDestinations: uniq((o) => !!o.redirectChain),
  technicalFailures: count((o) => ["not-found", "loop", "failure"].includes(o.redirectClass) || o.fragmentExists === false),
  orphanPublicRoutes: routeBaseline.filter((r) => r.inboundLinks === 0).length,
  nonAnchorButtons: buttons.length,
  severity: { BROKEN: sev("BROKEN"), SUSPICIOUS: sev("SUSPICIOUS"), "NEEDS SEMANTIC REVIEW": sev("NEEDS SEMANTIC REVIEW"), "EXTERNAL TO VERIFY": sev("EXTERNAL TO VERIFY"), OK: sev("OK") },
};

writeFileSync(outPath, JSON.stringify({ crawledAt: raw.startedAt, base, summary, routeBaseline, destinations, occurrences, nonAnchorButtons: buttons }) + "\n");
console.log(JSON.stringify(summary, null, 1));
