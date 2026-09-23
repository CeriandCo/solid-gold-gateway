"""
T5 Phase 4 — external reachability evidence collector (raw evidence only).

Reads docs/verification/t5-link-audit.json, takes every UNIQUE external
http(s) destination (network checks are deduplicated, occurrence reporting is
not), and for each one:

  1. HTTP pass: GET with a normal browser User-Agent, redirects followed
     manually (max 10 hops) so every hop + status is recorded. Sequential,
     >= 1.5 s between requests to the same host, 20 s timeout, at most
     2 retries on timeout/connection error/5xx with 5 s back-off.
  2. Browser pass: real Chromium navigation (headless, one page at a time),
     records final URL, main-document status, <title>, first H1, and a
     short text sample used for soft-404 / challenge detection.

It makes NO verdicts; classification lives in src/lib/link-audit/external.ts.

Usage: python3 scripts/link-audit/external.py [--out /tmp/link-audit/external-raw.json]
"""
import argparse, asyncio, json, time
from pathlib import Path
from urllib.parse import urljoin, urlsplit

import requests
from playwright.async_api import async_playwright

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")
HOST_GAP = 1.5
_last = {}


def throttle(host):
    wait = HOST_GAP - (time.time() - _last.get(host, 0))
    if wait > 0:
        time.sleep(wait)
    _last[host] = time.time()


def http_check(url):
    attempts = []
    for attempt in range(3):
        chain, cur, err = [], url, None
        try:
            for _ in range(10):
                throttle(urlsplit(cur).hostname)
                r = requests.get(cur, headers={"User-Agent": UA, "Accept": "text/html,*/*"},
                                 allow_redirects=False, timeout=20, stream=True)
                ctype = r.headers.get("content-type", "")
                length = r.headers.get("content-length")
                body = ""
                if "html" in ctype and r.status_code < 300:
                    body = r.raw.read(200_000, decode_content=True).decode("utf-8", "replace")
                r.close()
                hop = {"url": cur, "status": r.status_code, "contentType": ctype,
                       "contentLength": length, "server": r.headers.get("server"),
                       "cfMitigated": r.headers.get("cf-mitigated")}
                chain.append(hop)
                if 300 <= r.status_code < 400 and r.headers.get("location"):
                    cur = urljoin(cur, r.headers["location"])
                    continue
                if body:
                    lo = body.lower()
                    i, j = lo.find("<title"), lo.find("</title>")
                    hop["title"] = " ".join(body[lo.find(">", i) + 1:j].split())[:200] if i >= 0 and j > i else None
                break
        except Exception as e:  # noqa: BLE001
            err = f"{type(e).__name__}: {str(e)[:160]}"
        attempts.append({"chain": chain, "error": err})
        last = chain[-1]["status"] if chain else None
        if err is None and not (last and last >= 500):
            break
        time.sleep(5)
    return attempts


async def browser_check(urls):
    out = {}
    async with async_playwright() as p:
        b = await p.chromium.launch(headless=True)
        ctx = await b.new_context(viewport={"width": 1280, "height": 1800}, user_agent=UA)
        for url in urls:
            page = await ctx.new_page()
            rec = {"url": url}
            try:
                resp = await page.goto(url, wait_until="domcontentloaded", timeout=45000)
                await page.wait_for_timeout(3500)
                rec["status"] = resp.status if resp else None
                rec["finalUrl"] = page.url
                rec["title"] = await page.title()
                rec["h1"] = await page.evaluate("() => (document.querySelector('h1')?.innerText || '').trim().slice(0,200)")
                rec["text"] = await page.evaluate("() => (document.body?.innerText || '').replace(/\\s+/g,' ').slice(0,600)")
                if urlsplit(url).fragment:
                    rec["fragmentFound"] = await page.evaluate(
                        "(f) => !!(document.getElementById(f) || document.getElementsByName(f)[0])", urlsplit(url).fragment)
            except Exception as e:  # noqa: BLE001
                rec["error"] = f"{type(e).__name__}: {str(e)[:160]}"
            await page.close()
            out[url] = rec
            await asyncio.sleep(1)
        await b.close()
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--audit", default="docs/verification/t5-link-audit.json")
    ap.add_argument("--out", default="/tmp/link-audit/external-raw.json")
    a = ap.parse_args()
    occ = json.load(open(a.audit))["occurrences"]
    urls = sorted({o["normalizedTarget"] for o in occ if o["category"] == "external"})
    http = {}
    for u in urls:
        http[u] = http_check(u)
        print("http", u, [h["status"] for h in (http[u][-1]["chain"])], http[u][-1]["error"], flush=True)
    br = asyncio.run(browser_check(urls))
    for u in urls:
        print("browser", u, br[u].get("status"), br[u].get("finalUrl"), (br[u].get("title") or "")[:70], br[u].get("error"), flush=True)
    Path(a.out).parent.mkdir(parents=True, exist_ok=True)
    json.dump({"checkedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "http": http, "browser": br},
              open(a.out, "w"), indent=1)


if __name__ == "__main__":
    main()
