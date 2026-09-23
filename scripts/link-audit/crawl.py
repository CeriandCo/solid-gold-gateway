"""
T5 link audit — rendered crawler (raw evidence only).

Reads the route inventory produced by `scripts/link-audit/routes.ts`, renders
every public route in a real browser at 1440px and 375px, opens every
disclosure control (aria-expanded="false") so conditionally rendered menus are
captured, and records every anchor / role=link / button plus every element id.
It then resolves every same-origin destination over HTTP (redirects followed
manually) and renders any destination that is not itself a crawled route so
its ids can be checked.

It makes NO judgements. Classification and verdicts live in
src/lib/link-audit/analyze.ts so they are unit-tested.

It never requests external URLs (Phase 4 owns that).

Usage:
  python3 scripts/link-audit/crawl.py [--base http://localhost:8080] \
      [--routes docs/verification/t5-routes.json] [--out /tmp/link-audit/raw.json]
"""
import argparse
import asyncio
import json
import sys
import time
from pathlib import Path
from urllib.parse import urljoin, urlsplit, urlunsplit

import requests
from playwright.async_api import async_playwright

EXTRACT_JS = r"""
(revealedBy) => {
  const clean = (s) => (s || "").replace(/\s+/g, " ").trim();
  const domPath = (el) => {
    const parts = [];
    while (el && el.nodeType === 1 && el !== document.body) {
      const p = el.parentElement;
      const i = p ? Array.prototype.indexOf.call(p.children, el) : 0;
      parts.unshift(el.tagName.toLowerCase() + ":" + i);
      el = p;
    }
    return parts.join(">");
  };
  const surface = (el) => {
    if (el.closest("footer")) return "footer";
    if (el.closest("header")) return "header";
    const nav = el.closest("nav");
    if (nav) return "nav:" + (nav.getAttribute("aria-label") || "unnamed");
    if (el.closest("article")) return "article";
    if (el.closest("main")) return "main";
    return "body";
  };
  const context = (el) => {
    const withId = el.closest("[id]");
    const section = el.closest("section, article, aside, nav, header, footer");
    const heading = section ? section.querySelector("h1, h2, h3") : null;
    return {
      nearestId: withId ? withId.id : null,
      sectionClass: section ? clean(section.getAttribute("class")).split(" ")[0] || null : null,
      sectionHeading: heading ? clean(heading.innerText).slice(0, 120) : null,
    };
  };
  const name = (el) =>
    clean(el.getAttribute("aria-label")) ||
    clean(el.innerText) ||
    clean(Array.from(el.querySelectorAll("img[alt]")).map((i) => i.alt).join(" ")) ||
    clean(el.getAttribute("title")) ||
    "";
  const visible = (el) => {
    const r = el.getClientRects();
    if (!r.length) return false;
    const cs = getComputedStyle(el);
    return cs.visibility !== "hidden" && cs.display !== "none";
  };
  const links = Array.from(document.querySelectorAll("a, area, [role=link]")).map((el) => ({
    tag: el.tagName.toLowerCase(),
    role: el.getAttribute("role"),
    hasHref: el.hasAttribute("href"),
    rawHref: el.getAttribute("href"),
    resolvedHref: el.hasAttribute("href") ? el.href : null,
    text: name(el),
    target: el.getAttribute("target"),
    rel: el.getAttribute("rel"),
    ariaDisabled: el.getAttribute("aria-disabled"),
    surface: surface(el),
    context: context(el),
    domPath: domPath(el),
    visible: visible(el),
    revealedBy,
  }));
  const buttons = Array.from(document.querySelectorAll("button, [role=button], input[type=submit]")).map((el) => ({
    tag: el.tagName.toLowerCase(),
    type: el.getAttribute("type"),
    text: name(el),
    ariaExpanded: el.getAttribute("aria-expanded"),
    ariaControls: el.getAttribute("aria-controls"),
    inForm: !!el.closest("form"),
    surface: surface(el),
    context: context(el),
    domPath: domPath(el),
    visible: visible(el),
    revealedBy,
  }));
  const ids = Array.from(document.querySelectorAll("[id]")).map((e) => e.id).filter(Boolean);
  const idCounts = {};
  ids.forEach((i) => { idCounts[i] = (idCounts[i] || 0) + 1; });
  const duplicateIds = Object.keys(idCounts).filter((i) => idCounts[i] > 1);
  const names = Array.from(document.querySelectorAll("a[name]")).map((e) => e.getAttribute("name"));
  const canonical = document.querySelector('link[rel="canonical"]');
  const h1 = document.querySelector("h1");
  return {
    links, buttons, ids: Array.from(new Set(ids)), duplicateIds, anchorNames: names,
    title: document.title, h1: h1 ? clean(h1.innerText) : null,
    canonical: canonical ? canonical.getAttribute("href") : null,
  };
}
"""


def http_chain(url, max_hops=10):
    """Follow redirects by hand so every hop is recorded."""
    chain, seen, current = [], set(), url
    for _ in range(max_hops):
        if current in seen:
            chain.append({"url": current, "status": "LOOP"})
            return chain
        seen.add(current)
        try:
            r = requests.get(current, allow_redirects=False, timeout=30)
        except Exception as e:  # noqa: BLE001
            chain.append({"url": current, "status": "ERROR", "error": type(e).__name__})
            return chain
        hop = {"url": current, "status": r.status_code}
        chain.append(hop)
        if 300 <= r.status_code < 400 and r.headers.get("location"):
            current = urljoin(current, r.headers["location"])
            continue
        return chain
    chain.append({"url": current, "status": "TOO_MANY_REDIRECTS"})
    return chain


async def settle(page):
    try:
        await page.wait_for_load_state("networkidle", timeout=15000)
    except Exception:  # noqa: BLE001
        pass
    # Scroll through the page so intersection-triggered content renders.
    height = await page.evaluate("document.body.scrollHeight")
    y = 0
    while y < height:
        y += 700
        await page.evaluate(f"window.scrollTo(0, {y})")
        await page.wait_for_timeout(60)
        height = await page.evaluate("document.body.scrollHeight")
    await page.evaluate("window.scrollTo(0, 0)")
    await page.wait_for_timeout(300)


async def render(context, url, reveal=True):
    page = await context.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)[:200]))
    snapshot = {"url": url, "ok": False}
    try:
        resp = await page.goto(url, wait_until="domcontentloaded", timeout=45000)
        await settle(page)
        base = await page.evaluate(EXTRACT_JS, None)
        snapshot.update(base)
        snapshot["ok"] = True
        snapshot["navStatus"] = resp.status if resp else None
        snapshot["finalUrl"] = page.url
        if reveal:
            # Open every closed disclosure control so conditionally rendered
            # menus/panels are captured. One click each, re-extracted after.
            seen_paths = {l["domPath"] + "|" + (l["rawHref"] or "") for l in base["links"]}
            ids = set(base["ids"])
            toggles = page.locator('[aria-expanded="false"]')
            count = await toggles.count()
            for i in range(count):
                t = toggles.nth(i)
                try:
                    if not await t.is_visible():
                        continue
                    label = (await t.get_attribute("aria-label")) or (await t.inner_text())
                    before = page.url
                    await t.click(timeout=3000)
                    await page.wait_for_timeout(400)
                    if page.url.split("#")[0] != before.split("#")[0]:
                        await page.goto(url, wait_until="domcontentloaded")
                        await settle(page)
                        continue
                    extra = await page.evaluate(EXTRACT_JS, " ".join(label.split())[:80])
                    for l in extra["links"]:
                        k = l["domPath"] + "|" + (l["rawHref"] or "")
                        if k not in seen_paths:
                            seen_paths.add(k)
                            snapshot["links"].append(l)
                    for b in extra["buttons"]:
                        if b["revealedBy"] and not any(x["domPath"] == b["domPath"] for x in snapshot["buttons"]):
                            snapshot["buttons"].append(b)
                    ids.update(extra["ids"])
                    await page.keyboard.press("Escape")
                    await page.wait_for_timeout(150)
                except Exception:  # noqa: BLE001
                    continue
            snapshot["ids"] = sorted(ids)
    except Exception as e:  # noqa: BLE001
        snapshot["error"] = f"{type(e).__name__}: {str(e)[:200]}"
    snapshot["pageErrors"] = errors
    await page.close()
    return snapshot


def same_origin_target(resolved, base):
    if not resolved:
        return None
    s, b = urlsplit(resolved), urlsplit(base)
    if s.scheme not in ("http", "https") or s.netloc != b.netloc:
        return None
    return urlunsplit((s.scheme, s.netloc, s.path, s.query, ""))


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="http://localhost:8080")
    ap.add_argument("--routes", default="docs/verification/t5-routes.json")
    ap.add_argument("--out", default="/tmp/link-audit/raw.json")
    args = ap.parse_args()

    routes = json.loads(Path(args.routes).read_text())["public"]
    out = {"base": args.base, "startedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "pages": [], "destinations": {}}

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        for route in routes:
            url = args.base + route["path"]
            page_rec = {"route": route, "http": http_chain(url), "viewports": {}}
            for vw in (1440, 375):
                ctx = await browser.new_context(viewport={"width": vw, "height": 1800})
                page_rec["viewports"][str(vw)] = await render(ctx, url)
                await ctx.close()
            out["pages"].append(page_rec)
            print(f"crawled {route['path']}", file=sys.stderr)

        # Resolve every same-origin destination (path + query, fragment stripped).
        crawled = {args.base + r["path"] for r in routes}
        targets = set()
        for pg in out["pages"]:
            for vp in pg["viewports"].values():
                for l in vp.get("links", []):
                    t = same_origin_target(l.get("resolvedHref"), args.base)
                    if t:
                        targets.add(t)
        ctx = await browser.new_context(viewport={"width": 1440, "height": 1800})
        for t in sorted(targets):
            rec = {"http": http_chain(t)}
            if t not in crawled:
                snap = await render(ctx, t, reveal=False)
                rec["render"] = {k: snap.get(k) for k in ("ok", "finalUrl", "title", "h1", "ids", "anchorNames", "navStatus", "error")}
            out["destinations"][t] = rec
        await ctx.close()
        await browser.close()

    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    Path(args.out).write_text(json.dumps(out, indent=1))
    print(f"wrote {args.out}: {len(out['pages'])} pages, {len(out['destinations'])} same-origin destinations", file=sys.stderr)


asyncio.run(main())
