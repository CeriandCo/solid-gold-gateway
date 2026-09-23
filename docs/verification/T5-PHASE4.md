# T5 Phase 4 — External link reachability, redirects and new-tab security

Run: 2026-09-23 (UTC). Crawl `crawledAt` in artifact; external evidence `checkedAt` 2026-09-23T17:36:59Z (post-fix run). Pre-fix run: 2026-09-23 ~17:20Z (same script, same 25 URLs).

## 1. Files changed
- `scripts/link-audit/external.py` (new) — HTTP + real-Chromium evidence collector, no verdicts.
- `scripts/link-audit/external-verdicts.ts` (new) — merges verdicts into the artifact, writes evidence file.
- `src/lib/link-audit/external.ts` (new) — per-URL verdict table, `isSafeNewTab`, `protocolIssue`, list of replaced URLs.
- `src/lib/link-audit/external.test.ts` (new, 8 tests).
- `src/lib/link-audit/semantic.ts` — 3 citation rules updated to the new URLs (verdicts unchanged).
- `docs/verification/t5-link-audit.json` — regenerated; new per-occurrence fields `externalVerdict`, `externalRedirect`, `externalFinalUrl`, `externalBlocksT5`, `protocolIssue`; new `externalSummary`.
- `docs/verification/t5-external-evidence.json` (new) — raw HTTP chains + browser observations.
- Database (content only, `aurum_post_sources.url`, 6 rows, published status/titles/text untouched): see §17.

## 2–4. Counts (current, post-fix)
| | Value |
|---|---|
| External occurrences | **199** (Phase 1 said 198; recomputed) |
| Unique external URLs | **25** |
| Unique external hosts | **16** |
| `_blank` occurrences (all are external) | **197** |
| External same-tab occurrences | 2 (`/contact` domain values) |

## 5. Methodology
1. Inventory from the rendered 33-page crawl artifact (both 1440 and 375).
2. HTTP pass (`external.py`): `GET`, Chrome User-Agent, manual redirect following (≤10 hops, each hop's status recorded), 20 s timeout.
3. Browser pass: headless Chromium, `domcontentloaded` + 3.5 s wait; records status, final URL, title, H1, text sample (soft-404/challenge detection).
4. For Akamai/Cloudflare/X blocks and the two client domains: second browser attempt in Chromium **and Firefox** with 8 s wait (`/tmp/browser/p4/probe.py`).
5. Verdict = status + redirect chain + page identity + browser evidence (never status alone). Verdicts live in `external.ts`; the test fails if any new/changed external URL lacks one.

## 6. Throttling
Strictly sequential; ≥1.5 s between requests to the same host; max 2 retries only on network error/timeout/5xx with 5 s back-off; one browser page at a time, 1 s gap. Network checks deduplicated by normalized URL (25), never per occurrence (199). Total: 2 full runs + 1 targeted re-check.

## 7. Verdict definitions
As specified in the task, plus one honest sub-status: **AUTOMATED CHECK BLOCKED — BROWSER INCONCLUSIVE** = bot protection / login wall blocks both HTTP and the headless browser; the host is proven alive but the exact page was not observed. Not DEAD; not claimed browser-reachable.

## 8–14. Results (unique URLs / occurrences)
| Verdict | URLs | Occurrences |
|---|---|---|
| REACHABLE | 11 | 94 |
| REACHABLE VIA REDIRECT | 6 | 16 |
| BROWSER-REACHABLE / AUTOMATED CHECK BLOCKED | 3 | 42 |
| AUTOMATED CHECK BLOCKED — BROWSER INCONCLUSIVE | 2 | 38 |
| TEMPORARILY UNAVAILABLE | 0 | 0 |
| DEAD | 2 | 2 |
| WRONG EXTERNAL DESTINATION | 0 | 0 |
| CLIENT / EDITORIAL DECISION | 1 | 7 |
| **Total** | **25** | **199** |

Before fixes: DEAD 4 URLs (mint.ca 7 occ., nist.gov 1 occ., plus the 2 client domains) and 1 STALE (LBMA, 4 occ.); mint.ca, nist.gov and LBMA fixed (§17).

## 35. External remediation table (one row per unique URL; occurrence count in brackets)
| Source page(s) | Link text | Original URL | HTTP | Redirect/final | Browser | Verdict | Fix |
|---|---|---|---|---|---|---|---|
| footer, all 33 pages [33+1] | Facebook | facebook.com/profile.php?id=61586363577228 | 400 | → /people/Sqoot-Pure/61586363577228/ | 200, page “Sqoot Pure”, bio “A precious metals platform to buy + Store + Gift physical gold…” | BROWSER-REACHABLE / AUTOMATED BLOCKED | none |
| footer [33+1] | Instagram | instagram.com/sqootpure/ | 302 → 429 | login wall `next=/sqootpure/` | 429 login wall (no login attempted) | BLOCKED — BROWSER INCONCLUSIVE | none |
| footer [33+1] | LinkedIn | linkedin.com/company/sqootpure | 200 “SQOOT \| LinkedIn” | — | 200 “SQOOT \| LinkedIn” | REACHABLE | none |
| footer [33+1] | X (Twitter) | x.com/sqootpure | 200 “SqootPure (@SqootPure) / X” | — | Chromium 403 blank; Firefox 200 profile “SqootPure @SqootPure — Real gold. Real ownership…” | REACHABLE | none |
| /learn [1] | Goldhub | gold.org/goldhub | 200 | — | 200 “Goldhub \| The Definitive Source for Gold Data and Insight” | REACHABLE | none (Phase 2 fix confirmed) |
| AURUM pages [7] | WGC — Gold demand trends … | gold.org/goldhub/research/gold-demand-trends | 200 | — | 200 | REACHABLE | none |
| AURUM pages [4] | WGC — (Monthly) central bank statistics | gold.org/goldhub/data/monthly-central-bank-statistics | 301 → 200 | → /goldhub/data/gold-reserves-by-country | 200 “Central Banks Gold Reserves by Country” | REACHABLE VIA REDIRECT (HEALTHY) | not changed: page renamed; same-dataset equivalence is editorial |
| /aurum/notes/allocated-and-unallocated [1] | WGC — Investment guidance on storage | gold.org/goldhub/research | 301 → 200 | → /research/library | 200 “Gold Research Report Library” | REACHABLE VIA REDIRECT | none (citation precision editorial) |
| AURUM pages [3] | BIS — International banking | bis.org/statistics/ | 301 → 200 | → /statistics (slash) | 200 | REACHABLE VIA REDIRECT (HEALTHY) | none (trivial canonicalisation) |
| AURUM pages [4] | IMF — International Financial Statistics | data.imf.org/ | 403 | → /en | 200 “Data Home” | BROWSER-REACHABLE / AUTOMATED BLOCKED | none |
| AURUM pages + /fractional-gold [9] | LBMA Good Delivery … / Learn about the standard → | lbma.org.uk/good-delivery | 302 → 200 | → /good-delivery/about-good-delivery | 200 | REACHABLE VIA REDIRECT (HEALTHY, temporary) | none |
| AURUM/notes [3] | LBMA — Good Delivery Current List — Gold | lbma.org.uk/good-delivery/gold-current-list | 200 | — | 200 | REACHABLE | none |
| troy-ounces-and-grams [1] | LBMA — Precious metal price methodology | lbma.org.uk/prices-and-data | 302 → 200 | → /lbma-precious-metal-prices | 200 | REACHABLE VIA REDIRECT (HEALTHY, temporary) | none |
| AURUM pages [4] | LBMA — Gold price benchmark data | lbma.org.uk/prices-and-data/precious-metal-prices | 301 → 200 | → /prices-and-data/lbma-precious-metal-prices | 200 “LBMA Precious Metal Prices” | STALE SOURCE URL | **updated to canonical** |
| AURUM pages [1] | LBMA — Guide to the London precious metals market | lbma.org.uk/publications | 200 | — | 200 | REACHABLE | none (precision editorial) |
| AURUM pages [7] | Royal Canadian Mint — Bullion operations statement | mint.ca/en/discover/news | **404** | — | **404** | DEAD | **replaced → mint.ca/en/company/media-room** (200 “Media Room”, “All news releases”) |
| troy-ounces-and-grams [1] | NIST — Handbook 44, units of weight (2026-01-01) | nist.gov/pml/owm/nist-handbook-44 | **404** | — | **404** “Sorry, we cannot find that page” | DEAD | **replaced → NIST publication record “NIST Handbook 44 … (2026 Ed.)”** (200) |
| AURUM pages [7] | PAMP — Refinery delivery notice | pamp.com/news | 403 Akamai | Firefox: → pamp.com/ homepage | Chromium 403; Firefox lands on homepage | CLIENT / EDITORIAL DECISION (redirect SUSPICIOUS) | none — no authoritative replacement |
| why-assay-cards-matter [1] | PAMP — Veriscan authentication overview | pamp.com/veriscan | 403 Akamai | Firefox → /veriscan/ | Firefox 200, VERISCAN™ page | REACHABLE VIA REDIRECT (HEALTHY) | none |
| AURUM pages [4] | US Mint — Bullion product schedule update | usmint.gov/news | 403 CF challenge | — | 200 “News \| U.S. Mint” | BROWSER-REACHABLE / AUTOMATED BLOCKED | none |
| AURUM pages [4] | US Mint — production and sales figures / American Eagle report | usmint.gov/about/production-sales-figures | 403 CF challenge | — | Chromium + Firefox: challenge did not clear | BLOCKED — BROWSER INCONCLUSIVE | none |
| /learn? (article) [1] | Jewelers Board of Trade | jewelersboard.com/were-legit | 200 | — | 200 “We're Legit!” | REACHABLE | none |
| [1] | NCBA membership | ncbassoc.org/membership | 200 | — | 200 | REACHABLE | none |
| /contact [1] | sqootpure.com | https://sqootpure.com/ | TLS closed ×3 (DNS resolves); http:// 403 “forbidden by administrative rules” | — | ERR_CONNECTION_CLOSED; http 403 (Chromium+Firefox) | DEAD (client-owned) | none — client must decide |
| /contact [1] | aurum.sqootpure.com | https://aurum.sqootpure.com/ | DNS not resolved ×3 | — | ERR_NAME_NOT_RESOLVED | DEAD (client-owned) | none — client must decide |

Exact per-occurrence source pages are in the artifact (`externalVerdict` on each occurrence).

## 15–17. Redirect chains, stale redirects, canonical fixes
Chains are in the table and `t5-external-evidence.json`. Classification: HEALTHY 8 URLs (bis, 2× gold.org, 2× lbma 302, veriscan, imf, facebook, instagram login), STALE 1 (LBMA precious-metal-prices — fixed), SUSPICIOUS 1 (pamp.com/news → homepage), WRONG 0.

Database href-only changes (`aurum_post_sources.url`, matched by id AND old url):
| Post | Citation | Before | After | Why |
|---|---|---|---|---|
| three-mints-longer-lead-times, three-mints-one-supply-story, what-a-widening-premium-actually-tells-you | Royal Canadian Mint — Bullion operations statement | mint.ca/en/discover/news | mint.ca/en/company/media-room | DEAD 404; publisher's own news-release page |
| troy-ounces-and-grams | NIST — Handbook 44, units of weight | nist.gov/pml/owm/nist-handbook-44 | nist.gov/publications/nist-handbook-44-specifications-tolerances-and-other-technical-requirements-weighing-18 | DEAD 404; NIST record for HB 44 2026 Ed. (citation date 2026-01-01) |
| spread-on-a-one-ounce-coin, what-a-widening-premium-actually-tells-you | LBMA — Gold price benchmark data | …/prices-and-data/precious-metal-prices | …/prices-and-data/lbma-precious-metal-prices | 301 to the same page |
The Mint citation stays in the 20 index-level citations (precision still editorial).

## 18. Goldhub
`https://www.gold.org/goldhub` → HTTP 200, no redirect, browser 200 title “Goldhub | The Definitive Source for Gold Data and Insight” on gold.org (World Gold Council). 1 occurrence on /learn, `target=_blank`, `rel="noopener noreferrer"`. Unchanged.

## 19. Sign Up on Gold.org
Unchanged: `href="#"`, same tab. No authoritative destination encountered. CLIENT / EDITORIAL DECISION; still a T5 blocker.

## 20–21. The 20 index-level citations
| Publisher | Current target | Occ. | Reachability | Redirect | Precision |
|---|---|---|---|---|---|
| PAMP | pamp.com/news | 7 | CLIENT / EDITORIAL (Firefox lands on homepage; /news gone) | SUSPICIOUS | editorial |
| Royal Canadian Mint | mint.ca/en/company/media-room (was dead /discover/news) | 7 | REACHABLE | none | editorial |
| US Mint | usmint.gov/news | 4 | BROWSER-REACHABLE | none | editorial |
| LBMA | lbma.org.uk/publications | 1 | REACHABLE | none | editorial |
| WGC | gold.org/goldhub/research | 1 | REACHABLE VIA REDIRECT | 301 → /research/library | editorial |
Total 20. Exact dated documents were not guessed.

## 22. Social links
All four render in the footer on all 33 pages at 375 and 1440, plus once each on /contact: 34 occurrences each, `_blank`, `noopener noreferrer`. Facebook: page “Sqoot Pure” (browser). X: profile @SqootPure (Firefox). LinkedIn: “SQOOT” company page. Instagram: login wall — profile not observable without logging in (not attempted). Ownership beyond visible names not inferred.

## 23. mailto/tel
6 mailto, 0 tel: excluded from HTTP statistics, not contacted. Phase 2/3 results kept. Contact-email policy remains a client decision.

## 24–27. New-tab security
`_blank` occurrences 197 (all external). Unsafe before fixes: **0**. Fixes: none needed. Unsafe after: **0**. All 197 carry `rel="noopener noreferrer"` (convention kept). Regression assertions added (§40).

## 28. HTTP/HTTPS
0 `http://`, 0 protocol-relative, 0 malformed, 0 whitespace/control characters (199/199 absolute https).

## 29. Domain anomalies
No lookalikes, shorteners, tracking redirectors or preview hosts. Anomaly: the two client-owned domains on /contact do not serve a site (see §35).

## 30. Query parameters
One: Facebook `?id=61586363577228` — required identifier, resolves to the “Sqoot Pure” page. Nothing changed.

## 31. External fragments
None in sources. (LBMA appends `#-` client-side; not ours.)

## 32. Document/download links
None: no external PDF/file links. The NIST replacement is the HTML publication record, not the PDF.

## 33. Soft-404
mint.ca/en/discover/news returned a real 404 while rendering full site chrome (checked text; fixed). pamp.com/news is a silent redirect to the homepage (soft removal) → CLIENT / EDITORIAL. No other soft-404s among the pages checked.

## 34. Timeouts/retries
0 timeouts. Retries happened only for the two client domains (3 attempts each, same failure) plus browser checks in two engines.

## 36. Remaining client/editorial questions (external)
| Source | Current URL | Reachable? | Unknown | Blocks T5? |
|---|---|---|---|---|
| /learn “Sign Up on Gold.org” | `#` | n/a | intended destination | **Yes** |
| /contact “sqootpure.com” | https://sqootpure.com/ | **No** (DEAD) | is the domain going live, or remove the link? | **Yes** (dead public link) |
| /contact “aurum.sqootpure.com” | https://aurum.sqootpure.com/ | **No** (no DNS) | same | **Yes** |
| PAMP “Refinery delivery notice” ×7 | pamp.com/news | lands on PAMP homepage | correct notice/news URL | No (publisher right; precision editorial) |
| 20 index-level citations | as §20 | yes except PAMP above | exact documents | No |
| WGC “Monthly central bank statistics” ×4 | 301 → gold-reserves-by-country | yes | is the renamed page the cited dataset? | No |
| US Mint production figures ×4, Instagram ×34 | as table | host up; page not observed headless | manual check in a normal browser | No |
All other Phase 3 client decisions unchanged.

## 37. Post-fix 33-page recrawl
`routes.ts` → `crawl.py` → `analyze.ts` → `semantic.ts` → `external-verdicts.ts`. Result: 33 pages, 1,451 occurrences (internal-page 1182, external 199, same-page-fragment 56, internal-fragment 7, mailto 6, placeholder 1). Internal page statuses: 1182 × 200; 0 internal 404; 0 dead fragments; placeholders 1 (Sign Up, unchanged); semantic 1,423 CORRECT / 27 AMBIGUOUS / 1 TECHNICALLY BLOCKED / 0 INCORRECT (unchanged); unsafe `_blank` 0.

## 38. Desktop/mobile rendered links
From the post-fix crawl (real Chromium at 1440 and 375): 171 external occurrences visible at both widths; 28 are inside content visible at neither default state (collapsed citations, recorded via disclosure controls). Footer social links: 4 × 33 at both widths, identical href/target/rel. External links open new tabs, so no in-page scroll assertions apply.

## 39. Artifacts
`docs/verification/t5-link-audit.json` (`externalSummary` + per-occurrence fields), `docs/verification/t5-external-evidence.json`, this report. Phase 1–3 reports untouched.

## 40–43. Gates
- New tests: `src/lib/link-audit/external.test.ts` (8): new-tab safety rule, no unsafe `_blank` in artifact, convention preserved, every URL reviewed, protocol hygiene, replaced URLs absent, Goldhub, Sign Up placeholder.
- `bunx tsgo --noEmit`: pass.
- `bun run test`: see final line below.
- `bun run build`: pass.

## 44–45. Integrity (queried this run)
- Published posts: 9; `max(updated_at)` 2026-09-19 05:31:05.388927+00 (unchanged — source-row edits do not touch posts). Href-only changes: 6 rows in `aurum_post_sources` (§17).
- gift_card_orders: 7. commerce_settings md5 (ordered): 80f43e2ed3f8b6dd75ccbb4347f3c708 (unchanged).
- newsletter_signups 0, newsletter_attempts 0; signup still disabled (no code touched).
- No commerce configuration touched, so the Stripe price-id check was not re-run.

## 46. Deviations / limitations
- Browser checks are headless from a datacentre IP; PAMP (Akamai) and X blocked Chromium but Firefox loaded them; US Mint production page and Instagram never cleared.
- Added the “BROWSER INCONCLUSIVE” sub-status rather than overstate evidence.
- Published-article citations are database content; changed with a targeted data update (6 rows), not a migration.
- Found two new dead links (client domains on /contact) that also block clean sign-off.

## 47. Phase 5 priorities
1. Get client answers: Sign Up on Gold.org; sqootpure.com / aurum.sqootpure.com (make live or remove).
2. Manual normal-browser check: usmint.gov/about/production-sales-figures and instagram.com/sqootpure.
3. Editorial: PAMP notice URL; the 20 exact citations; WGC renamed dataset.
4. Carry over the remaining Phase 3 client decisions.
5. Final recrawl with the same pipeline + `external-verdicts.ts`; re-run `external.py` only for URLs that changed.
