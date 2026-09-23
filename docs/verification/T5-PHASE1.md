# T5 Phase 1: Full-site link discovery and audit foundation

Status: inventory is complete. Remediation has not started. No hrefs, content or site code were changed.
Crawl: 2026-09-23, dev server `http://localhost:8080`, headless Chromium at 1440px and 375px.

## 1. Files changed (all new, tooling and docs only)
- `src/lib/link-audit/analyze.ts`: pure classification, normalisation, redirect and verdict logic
- `src/lib/link-audit/analyze.test.ts`: 10 tests
- `scripts/link-audit/routes.ts`: builds the route inventory and writes `t5-routes.json`
- `scripts/link-audit/crawl.py`: rendered crawler. It collects raw evidence only and never requests external URLs
- `scripts/link-audit/analyze.ts`: turns raw crawl data into `t5-link-audit.json`
- `docs/verification/t5-published-posts.json`: read-only SELECT snapshot of published posts (type, slug, title)
- `docs/verification/t5-routes.json`, `docs/verification/t5-link-audit.json`, this file

Re-run order for the Phase 5 recrawl: refresh the posts snapshot with a SELECT → `bun scripts/link-audit/routes.ts` → `python3 scripts/link-audit/crawl.py` → `bun scripts/link-audit/analyze.ts`.

## 2. Routing architecture (from source)
- TanStack Router v1 file routes in `src/routes`. The generated tree is `src/routeTree.gen.ts`.
- 49 full paths: 30 public static, 2 public dynamic (`/aurum/notes/$slug`, `/aurum/briefs/$slug`), 16 internal (`/admin*` and `/api/public/*`), and 3 index aliases (`/learn/`, `/aurum/notes/`, `/aurum/briefs/`).
- Redirects:
  - `/admin/` → `/admin/posts` (internal).
  - The `/aurum` loader redirects `?brief=<slug>` to `/aurum/briefs/<slug>` when the post is beyond the page cap.
  - Trailing slashes are normalised with a 307 (`/learn/` → `/learn`).
  - `validateSearch` defaults are added with a 307 (`/aurum` → `/aurum?range=1Y`, and the same for the notes and briefs indexes).
- 404 handling:
  - The root `notFoundComponent` returns HTTP 404 (checked: `/nope` returns 404).
  - Note and brief detail pages call `notFound()` for unknown slugs and return 404 (checked: `/aurum/notes/nope` returns 404).
- Canonicals point to `https://solid-gold-gateway.lovable.app/...`. The exception is `/pricing`, whose canonical is `https://getsqoot.com/pricing` (flagged for Phase 3, not a link).
- No locale prefixes.
- Query parameters select content: `?range`, `?note`, `?brief`, `?page`, and `priceState` on `/aurum`, and `page` on the archives. Normalisation keeps them.
- Fragments are handled by the router's hash scroll. The AURUM range control uses `hashScrollIntoView:false`.

## 3–5. Route inventory method and totals
`routes.ts` builds the inventory from three sources:
- the route tree;
- `PUBLISHED_LEARN_ARTICLES` in `learn-articles.ts` (these are also served at `/aurum/notes/<slug>`);
- the published-rows snapshot. Drafts and in-review posts are excluded by the query.

A unit test fails if a new route shape appears that the inventory does not handle, and it asserts that exactly 2 dynamic public routes exist.

**Total public routes: 33.** All 33 rendered successfully at both viewports, with 0 page errors.

Published content routes included (all 9 database posts plus 3 Learn-fed notes):
- Daily Notes: allocated-and-unallocated, spread-on-a-one-ounce-coin, three-mints-longer-lead-times, troy-ounces-and-grams, what-a-central-bank-purchase-signals, why-assay-cards-matter
- Weekly Briefs: three-mints-one-supply-story, what-a-widening-premium-actually-tells-you, what-central-banks-reported-this-quarter
- Learn articles, reachable at both `/learn/<slug>` and `/aurum/notes/<slug>`: physical-gold-vs-gold-etf, how-to-buy-gold-safely, gifting-gold-guide

## 6. Link-producing mechanisms found
- Router `<Link>`, used by the header, footer, cards and the `GoldButton` `to` prop.
- `<a href>`, used by `GoldButton` `href`, social icons, fragments, mailto links and sources.
- Programmatic navigation. There are three cases:
  1. `gifting.tsx`: `window.location.assign(result.url)`. This is the Stripe checkout redirect. The URL comes from the server, and the button is currently shown as unavailable.
  2. `aurum.tsx` `changeRange`: `navigate({search})`. This only replaces the query string and is not navigation.
  3. The `/aurum` loader's `?brief` overflow redirect.
- No `location.replace`, `href=` assignment or `window.open` in public code.
- CMS post bodies contain 0 URLs, `href`s or markdown links (SQL count = 0). Their links come from the structured `sources` array, which is rendered and crawled.
- `learn-articles.ts:373` contains an LBMA URL as plain text, not as a link (Phase 3 note).

## 7–8. Audit implementation: rendered first, source second
- The crawler renders each route, scrolls through it to trigger lazy content, and extracts every `a`, `area` and `[role=link]` element. For each it records:
  - the raw href attribute and the resolved URL;
  - the accessible name (aria-label, then text, then image alt, then title);
  - `target`, `rel` and `aria-disabled`;
  - the surface (header, footer, a named nav, article, main or body);
  - context: nearest id, section class and section heading;
  - DOM path, visibility, and the viewport where it was seen.
- It then clicks every visible `aria-expanded="false"` control. That opened the mobile menu, the Buy dropdown, the AURUM floating nav and FAQ items, which revealed 407 occurrences that exist only after a click.
- It records every element id on the page, which is used for fragment checks.
- Internal destinations are fetched over HTTP with redirects followed by hand, so every hop is recorded.
- Source grep was used alongside the crawl to find programmatic navigation, unused components and dev or placeholder URLs.

## 9. Normalisation rules
- The crawl origin and the production origin are both first-party. An absolute production URL is still internal, but it gets a SUSPICIOUS note (none were found).
- Relative and root-relative URLs are resolved against the source page.
- Trailing slashes are removed, except on `/`.
- Only unreserved percent-escapes are decoded. Other escapes are uppercased.
- Query parameters are kept and sorted.
- The fragment is kept separately. The destination key is path + query.
- Email addresses are lowercased. Phone numbers have spaces, brackets and dashes removed.

## 10. Categories
internal-page, internal-fragment, same-page-fragment, external, mailto, tel, placeholder, programmatic (from source only), other-scheme.

## 11. Occurrence design
Every row in `occurrences[]` has these fields:
- sourcePage, sourceRoute, linkText
- rawTarget, normalizedTarget, destinationKey, category
- status, redirectClass, redirectChain
- fragment, fragmentExists
- opensNewTab, rel, relSafe
- destinationTitle, destinationH1
- surface, global, context
- viewports, visibleIn, revealedBy, domPath
- technicalVerdict, technicalReasons, semanticVerdict (PENDING), finalVerdict, suggestedFix, notes

The same element seen at both viewports is merged into one row, keyed on DOM path and raw href. `destinations{}` holds the per-destination results.

The client table can be produced from these fields: sourcePage | linkText | rawTarget | status | finalVerdict | suggestedFix.

## 12. Redirect classification
direct / canonical-redirect / unexpected-redirect / loop / not-found / failure.
- A redirect counts as canonical only if it stays on the same path, allowing for a trailing slash, and adds query parameters without changing any. All others are flagged. No redirect is accepted automatically.
- Result: 1 redirecting destination, `/aurum` → 307 → `/aurum?range=1Y` → 200 (canonical). 111 occurrences point to it. Most are the global "AURUM" header and footer links.

## 13. Fragment discovery
Every id was recorded per route across both viewports and after opening disclosure controls. A fragment is valid only if its id exists on the rendered destination page.
- 63 fragment occurrences: 7 to another page, 56 on the same page.
- 61 resolve.
- 2 do not (see 32).

## 14. Placeholder findings (2)
- `/learn` "Sign Up on Gold.org": `href="#"` (`learn.index.tsx:444`)
- `/learn` "Goldhub": `href="#"` (`learn.index.tsx:478`)
- `AppStoreBadge` in `site-chrome.tsx:33` has `href="#"`, but nothing uses it, so it never renders. The footer fallback `href ?? "#"` is never triggered on any page. Neither counts as a site defect.

## 15. External inventory
198 occurrences to 24 unique destinations:
- **Social:** Facebook, Instagram, LinkedIn and X, 34 occurrences each (the global footer on 33 pages plus `/contact`).
- **Sources on AURUM, briefs and notes:** 16 destinations across LBMA, US Mint, Royal Canadian Mint, PAMP, World Gold Council, IMF, BIS and NIST.
- **Membership badges on `/fractional-gold`:** jewelersboard.com and ncbassoc.org.
- **Brand sites on `/contact`:** sqootpure.com and aurum.sqootpure.com. These open in the same tab.

None were requested; network checks belong to Phase 4. The full list is in `t5-link-audit.json`.

## 16. `_blank` and `rel`
196 occurrences use `target="_blank"`. All 196 have `rel="noopener noreferrer"`: 0 are unsafe, and 0 internal links open in a new tab.

## 17. Semantic-review data
Each occurrence keeps the source route, surface, section heading and id, visible text, target, and the destination's `<title>` and `<h1>`.

## 18. CMS and dynamic coverage
All 9 published database posts and all 3 Learn articles were rendered, at both detail URLs where they apply. Their source links are included (for example, 1 NIST link on troy-ounces-and-grams).

## 19. Navigation surfaces
The share of occurrences on each surface:
- header (desktop nav, Buy dropdown, mobile menu): 693
- footer: 528
- AURUM floating nav: 8
- AURUM guides: 3
- unnamed nav: 30
- article: 65
- main: 106
- body (floating AURUM button and similar): 18

Header and footer rows are marked `global:true`.

## 20. Non-anchor navigation
44 buttons that are not toggles and not form submits were recorded. All of them are in-page controls: chart ranges, collapse, carousel, filters, calculator inputs, the fractional-gold steps and the vault options. None of them navigate. The only button that navigates is the gifting "Continue to Secure Checkout", which currently shows as unavailable and uses the programmatic Stripe redirect. No button was found that should be a link.

## 21–22. Dev, staging and placeholder domains
- No localhost, preview, staging or lovableproject URL appears in rendered links, and grep found none in production code.
- `example.com` appears only as an admin input placeholder, which is not a link.
- No placeholder domains appear among the external links.

## 23. Route reachability baseline
- 30 routes return 200 directly.
- 3 return 200 after a canonical 307 that adds default query parameters: `/aurum`, `/aurum/notes`, `/aurum/briefs`.
- 0 return 404.

The per-route status, title and h1 are in `routeBaseline[]`.

## 24. Orphan routes (recorded, not defects)
`/home-old-ver` and `/gifting-old-ver` have 0 inbound links. They are old design versions that are still publicly reachable.

## 25–34. Counts (from `t5-link-audit.json` summary)
| Metric | Count |
|---|---|
| public routes / rendered | 33 / 33 |
| link occurrences | 1451 |
| unique internal destinations | 33 |
| internal fragment / same-page fragment | 7 / 56 |
| external occurrences / unique | 198 / 24 |
| mailto / tel | 6 / 0 |
| placeholder candidates | 2 |
| `_blank` / unsafe | 196 / 0 |
| redirect occurrences / destinations | 111 / 1 |
| technical failures (404, loop, missing fragment) | 2 |
| orphan public routes | 2 |
| BROKEN | 4 |
| SUSPICIOUS | 0 |
| NEEDS SEMANTIC REVIEW | 1249 |
| EXTERNAL TO VERIFY | 198 |
| OK | 0 (nothing is marked OK until Phase 3 checks intent) |

BROKEN (4):
1. `/learn` "Sign Up on Gold.org": `#` placeholder
2. `/learn` "Goldhub": `#` placeholder
3. `/vault` "See how it works" → `#walkthrough`: no such id on the page (the page has `#how-it-works`)
4. `/gifting-old-ver` "How Gifting Works" → `#gifting-process`: no such id (this page is an orphan)

Mailto links for Phase 3 (the domains differ):
- `support@getsqoot.com` ×5: home, pricing, trust-center, including the legal-counsel subject line
- `hello@sqoot.us` ×1: contact

## 35. Artifacts
`docs/verification/t5-routes.json`, `docs/verification/t5-published-posts.json`, `docs/verification/t5-link-audit.json` (1.4 MB compact JSON, no HTML dumps). The raw crawl is kept at `/tmp/link-audit/raw.json` and is not committed.

## 36–39. Tests and gates
- New: `src/lib/link-audit/analyze.test.ts`, 10 tests passing. They cover route classification and completeness, normalisation, internal/external/production-origin classification, fragments, mailto and tel, placeholders, dev hosts, rel/target, redirect classes and verdicts.
- `bunx tsgo --noEmit`: clean.
- `bun run test`: 45 files, 690 tests passed (680 before, plus 10 new).
- `bun run build`: succeeded.

## 40. Data integrity (queried before and after the crawl, same values)
- 9 published posts. The md5 of body and title for each is unchanged, and every `updated_at` is still `2026-09-19 05:31:05.388927+00`.
- gift_card_orders = 7.
- commerce_settings md5 is `80f43e2ed3f8b6dd75ccbb4347f3c708`.
- Stripe price-id md5 is `56aef2f2d93ecf9298268ddd0501b1bf` (queried after the crawl).
- newsletter_signups = 0, newsletter_attempts = 0. `APPROVED_CONSENT` is still `null`.

The crawl only issued GET requests and did not submit any form.

## 41. Deviations and limitations
- The crawl ran against the dev server. The preview requires sign-in, and the Worker build cannot be served locally.
- Disclosure controls were each opened once. Links behind multi-step states, such as checkout success or a filled calculator, are not covered.
- `/aurum?note=<slug>` and `?brief=<slug>` deep-link states were reached only through rendered links, not enumerated separately.
- The published-posts snapshot must be refreshed by hand before each crawl.
- External reachability has not been checked (by design).
- The 44 buttons were judged non-navigating by their labels and the source code, not by clicking each one.

## 42. Recommended Phase 2 priorities
1. Fix the 2 missing fragments. `/vault` `#walkthrough` probably should be `#how-it-works` or needs a new id. For `/gifting-old-ver`, decide whether the page should be kept.
2. Replace the 2 `#` placeholders on `/learn` with the real Gold.org and Goldhub URLs (client to confirm).
3. Decide what to do with the orphan `*-old-ver` routes.
4. Confirm which contact address is correct (`getsqoot.com` or `sqoot.us`), and check the `/pricing` canonical to `getsqoot.com`.
5. Optional: point the global AURUM links straight at the canonical URL to avoid the 307.

T5 Phase 1 full-site link inventory complete; remediation has not started yet.
