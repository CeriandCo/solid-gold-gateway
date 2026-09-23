# T5 — Full link audit: final report (Phase 5 of 5)

Run date: 2026-09-23 (UTC). Nothing was published or deployed.

## 1. Executive summary

- The final rendered crawl covered all **33 public routes** at 1440px and 375px. It found **1,444 link occurrences**. Every occurrence has a technical status and a semantic verdict. None is unreviewed.
- Result: **0 internal 404s**, **0 dead fragments** (after one Phase 5 fix), **0 redirect loops**, **0 unsafe new-tab links** and **0 semantically incorrect links**.
- Links that remain broken or have no destination: **3**. All three need the client to decide where they should go.
  - "Sign Up on Gold.org" (`href="#"`)
  - `sqootpure.com` (dead)
  - `aurum.sqootpure.com` (dead)
- Engineering-owned defects remaining: **none**.
- Final verdict: **T5 AUDIT COMPLETE — LINK REMEDIATION BLOCKED ONLY BY EXPLICIT CLIENT/EDITORIAL DECISIONS**.

## 2. Scope and method

- **Freeze.** HEAD was `86b8c486 Removed Daily Note section` and the worktree was clean before Phase 5. The only T5 edits after that are listed in §5 (#8) and §11.
- **Route inventory.** `scripts/link-audit/routes.ts` reads `src/routeTree.gen.ts` plus published content.
  - Public: 33. Internal: 16. Index aliases: 3.
  - No public routes were added or removed since Phase 1. The count is confirmed as 33.
- **Published content.** Queried this run: 9 published posts.
  - 6 daily notes: allocated-and-unallocated, spread-on-a-one-ounce-coin, three-mints-longer-lead-times, troy-ounces-and-grams, what-a-central-bank-purchase-signals, why-assay-cards-matter.
  - 3 weekly briefs: three-mints-one-supply-story, what-a-widening-premium-actually-tells-you, what-central-banks-reported-this-quarter.
  - 3 Learn articles also render as `/aurum/notes/*` and `/learn/*`.
- **Crawl.** `scripts/link-audit/crawl.py` uses headless Chromium at 1440 and 375, then `analyze.ts`, `semantic.ts` and `external-verdicts.ts`. The artifact is regenerated from the crawl. No counts were edited by hand.
- **Semantic regression.** The final crawl was compared with the Phase 4 artifact at occurrence level (route, text, target, context).
  - **8 occurrences were removed.** Seven are the Daily Note board section and the "Daily Note →" floating-nav entry, removed on the client's explicit instruction (Jay's request). The eighth is the old archive back link `/aurum#daily-note`.
  - **1 occurrence was added:** the fixed back link (`/aurum`). It was reviewed and marked CORRECT.
  - All other occurrences are byte-identical, and their verdicts carry over.
  - The Phase 3 homepage fix still holds. "Read the note" on the card "Why the spread on a one-ounce coin moved" opens `/aurum/notes/spread-on-a-one-ounce-coin` (200, CORRECT).
- **External checks.** No external URL changed in Phase 5, so Phase 4 evidence (Phase 4 `checkedAt`) is reused. Only the two inconclusive URLs were rechecked, one attempt each in Chromium and Firefox (see §8).

## 3. Final counts

| Metric | Value | Level |
|---|---|---|
| Public routes | 33 | route |
| Total link occurrences | 1,444 | occurrence |
| Internal page links | 1,179 | occurrence |
| Fragment links (55 same-page + 5 cross-page) | 60 | occurrence |
| External links | 198 | occurrence |
| mailto / tel | 6 / 0 | occurrence |
| Placeholder (`#`) | 1 (Sign Up on Gold.org) | occurrence |
| Unique internal destinations | 33 | destination |
| Unique external URLs / hosts | 25 / 16 | destination |
| Internal 404s | 0 | occurrence |
| Dead fragments | 0 | occurrence |
| Redirect loops / unexpected redirects | 0 / 0 | occurrence |
| Intentional internal redirect (`/aurum` → `/aurum?range=1Y`) | 110 | occurrence (1 destination) |
| External DEAD | 2 occurrences / 2 URLs | both |
| Semantically incorrect | 0 | occurrence |
| Client-decision occurrences | 10 (7 CTA/IA + 1 Sign Up + 2 dead domains) | occurrence |
| Editorial-decision occurrences | 20 (PAMP 7 + 13 citation-precision) | occurrence |
| Manual-verification occurrences | 38 (Instagram 34 + US Mint figures 4) | occurrence |
| `_blank` occurrences / unsafe | 196 / 0 | occurrence |

External verdicts (unique URLs / occurrences):

| Verdict | URLs | Occurrences |
|---|---|---|
| REACHABLE | 11 | 93 |
| REACHABLE VIA REDIRECT | 6 | 16 |
| BROWSER-REACHABLE / AUTOMATED CHECK BLOCKED | 3 | 42 |
| AUTOMATED CHECK BLOCKED — BROWSER INCONCLUSIVE | 2 | 38 |
| TEMPORARILY UNAVAILABLE | 0 | 0 |
| DEAD | 2 | 2 |
| WRONG DESTINATION | 0 | 0 |
| CLIENT / EDITORIAL DECISION | 1 | 7 |

The totals are 198 external occurrences and 196 `_blank` links. Phase 4 had 199 and 197. The difference is the removed Daily Note section, which contained one LBMA citation.

## 4. Acceptance criteria

| Acceptance criterion | Result | Evidence | Blocker |
|---|---|---|---|
| Crawl every public route | PASS | 33/33 rendered at 1440 and 375, 0 page errors | — |
| Internal links: no 404 or unexpected broken redirect | PASS | 1,179 × 200; 0 loops; 1 intentional redirect | — |
| Semantic destination correctness reviewed | PASS WITH EXPLICIT CLIENT FLAG | 1,416 CORRECT, 27 AMBIGUOUS, 1 BLOCKED, 0 INCORRECT | T5-Q04…Q11 |
| In-page anchors valid | PASS | 60/60 fragments resolve | — |
| No empty or placeholder links | BLOCKED | 1 × `href="#"` | T5-Q01 |
| External links checked | PASS WITH EXPLICIT CLIENT FLAG | 25/25 URLs have a verdict; 2 DEAD are flagged | T5-Q02, T5-Q03 |
| `_blank` links protected | PASS | 196/196 have `rel="noopener noreferrer"` | — |
| Navigation, footer and mobile audited | PASS | Shared chrome present on 33 pages at both sizes | — |
| Learn, AURUM and legal audited | PASS | All 9 posts, 3 Learn articles, 30 legal table-of-contents links | — |
| Broken links fixed unless a client decision is required | PASS WITH EXPLICIT CLIENT FLAG | 11 fixes (§5); the 3 remaining need client input | T5-Q01…Q03 |
| Final client-ready table produced | PASS | §10 | — |

**Engineering audit complete?** Yes. Every occurrence has a verdict, and no engineering-owned defect remains.

**Website link state fully clean?** No. Three links are still unusable:
- the Sign Up placeholder;
- the two dead Sqoot domains.

**Can T5 be administratively closed with client flags?** Yes, as an audit. Two of the original criteria (zero 404s and zero dead anchors) are met. The third (every external link reachable or explicitly flagged) is met because of the flags. Literal zero-broken-link acceptance still waits on T5-Q01 to Q03.

## 5. Fixed-links register

| # | Source | Before | After | Reason | Final verification |
|---|---|---|---|---|---|
| 1 | /learn "Goldhub" | `#` | https://www.gold.org/goldhub | Placeholder | 200, no redirect, `_blank` + noopener (Phase 4); present in this crawl |
| 2 | /vault "See how it works" | `#walkthrough`, no target on the page | `#walkthrough` added to the existing walkthrough section | Dead fragment | Fragment resolves (crawl) |
| 3 | /gifting-old-ver "How Gifting Works" | `#gifting-process`, no target on the page | ID added to the matching section | Dead fragment | Fragment resolves (crawl) |
| 4 | / card "Why the spread…" → "Read the note" | notes archive | /aurum/notes/spread-on-a-one-ounce-coin | Semantic mismatch | 200, CORRECT (crawl) |
| 5 | Royal Canadian Mint citation (3 articles) | mint.ca/en/discover/news (not found) | mint.ca/en/company/media-room | Dead source URL | REACHABLE; exact document still editorial (T5-Q12) |
| 6 | NIST Handbook 44 citation (1 article) | nist.gov/pml/owm/nist-handbook-44 (not found) | NIST publications record, Handbook 44 2026 edition | Dead source URL | REACHABLE |
| 7 | LBMA benchmark-data citation (2 articles) | …/precious-metal-prices (301) | …/lbma-precious-metal-prices | Stale permanent redirect | REACHABLE |
| 8 | /aurum/notes "← Back to AURUM" (Phase 5) | `/aurum#daily-note` | `/aurum` | Dead fragment after the Daily Note section was removed | Browser at 1440/768/375: lands on `/aurum?range=1Y`, scrollY 0. The briefs back link still reaches `#weekly-brief`. |
| — | Four AURUM links (homepage ×3, floating button) | carried the old note setting | setting removed; destination unchanged | Build fix during the Daily Note removal | 200, CORRECT |

Fixes 5–7 changed six citation rows in total. Only the URL field changed; titles, body text, publish state and `updated_at` are unchanged.

## 6. Remaining blockers (block zero-broken-link acceptance)

| Source | Link text | Current state | Why engineering can't fix it | Client action |
|---|---|---|---|---|
| /learn (weekly-briefing card) | Sign Up on Gold.org | `href="#"`, same tab | Copy promises a weekly briefing. No authoritative sign-up URL exists in the repository history or on gold.org (sign-in is a script form only). Generic account registration is not evidence. | Provide the intended Gold.org weekly-briefing sign-up URL, or confirm the button should be removed or reworded. |
| /contact | sqootpure.com | DEAD (Phase 4 HTTP and browser: no usable website served) | Engineering cannot tell whether the domain should exist | Provide a live destination, bring the domain online, or remove or replace the link. |
| /contact | aurum.sqootpure.com | DEAD (Phase 4: no DNS record) | Same as above | Create the subdomain, provide a different URL, or remove the link. |

## 7. Open-decision register

This lists 17 decisions covering 76 occurrences, plus 2 orphan routes.

| ID | Type | Source | Decision needed | Impact | Blocks T5 close? |
|---|---|---|---|---|---|
| T5-Q01 | Client destination | /learn "Sign Up on Gold.org" (1) | Intended sign-up URL, or remove or reword | Placeholder link | Yes (zero-broken) |
| T5-Q02 | Client destination | /contact sqootpure.com (1) | Activate, change or remove | Dead link | Yes (zero-broken) |
| T5-Q03 | Client destination | /contact aurum.sqootpure.com (1) | Create, change or remove | Dead link | Yes (zero-broken) |
| T5-Q04 | Destination correctness | / "See all questions" → /contact (1) | Relabel, or create an FAQ destination | Works; label overpromises | Destination-correctness only |
| T5-Q05 | Destination correctness | /learn "Learn about gold's qualities" → #articles (1) | Relabel or create a destination | Works; no qualities page | Destination-correctness only |
| T5-Q06 | Destination correctness | /gifting "View all occasions" → #gift-card (1) | Relabel or create a destination | Works | Destination-correctness only |
| T5-Q07 | Destination correctness | /vault "View vault details" → /early-access (2) | Relabel or add facility pages | Works | Destination-correctness only |
| T5-Q08 | Destination correctness | /vault "Learn more" (Redemption) → #faq (1) | Add a redemption FAQ entry or retarget | Works | Destination-correctness only |
| T5-Q09 | Destination correctness | /vault "Watch the walkthrough" → /early-access (1) | Provide a video or relabel | Works | Destination-correctness only |
| T5-Q10 | Editorial destination | PAMP "Refinery delivery notice" (7) | Exact notice URLs | Publisher reachable; the named resource is gone | Destination-correctness only |
| T5-Q11 | Editorial precision | Royal Canadian Mint statements (7), US Mint schedule updates (4), LBMA guide (1), WGC storage guidance (1) | Exact document URLs, including whether the WGC renamed research area is equivalent | Publisher reachable | No |
| T5-Q12 | Manual verification | Instagram (34), US Mint production figures (4) | One check from a normal browser | Not dead | No |
| T5-Q13 | IA / content | Contact email: support@getsqoot.com ×5 vs hello@sqoot.us ×1 | Is the difference intentional? | Not broken | No |
| T5-Q14 | IA | /home-old-ver lifecycle | Keep, remove or redirect | Orphan route | No |
| T5-Q15 | IA | /gifting-old-ver lifecycle | Keep, remove or redirect | Orphan route | No |
| T5-Q16 | Wording | / "Compare the three" vs "Two ways" (Phase 3) | Align the wording | Link works | No |
| T5-Q17 | Content scope | Jay: "take the daily note out of the aurum board" | **Done on the client's explicit instruction** (board section and floating-nav entry removed; archive untouched). Remaining question: should the "Daily Note" newsletter topic stay? | No broken link | No |

## 8. Manual-verification items

These sites are online, but the audit environment (data-centre IP) could not load the exact pages because of bot or login protection. A quick check from a normal user's browser is recommended. Neither is dead.

- **usmint.gov/about/production-sales-figures (4 occurrences).**
  - Phase 5 Chromium: 403, "Just a moment…" (Cloudflare "Performing security verification").
  - Phase 5 Firefox: same result.
  - The usmint.gov host itself is proven alive; its `/news` page is browser-reachable (Phase 4).
- **instagram.com/sqootpure (34 occurrences).**
  - Phase 5 Chromium: 429, redirected to the login page.
  - Phase 5 Firefox: empty response.
  - No login was attempted.
- **PAMP and X.** In Phase 4, Chromium was blocked on both while Firefox loaded them. That remains the documented behaviour; X is classed as browser-reachable.

## 9. Orphan routes / IA follow-up

`/home-old-ver` and `/gifting-old-ver` are public, have 0 inbound links, and all their links were audited (the gifting-page fragment was fixed). They are not counted as broken. Verdict: **IA FOLLOW-UP**. They were not removed or redirected.

## 10. Final client-requested link table

Verified links from shared components are grouped, with occurrence counts. The full per-occurrence evidence is in `t5-link-audit.json`.

| Source page | Link text | Target | Status | Verdict | Suggested fix | Notes |
|---|---|---|---|---|---|---|
| /learn | Sign Up on Gold.org | `#` | no destination | CLIENT DECISION REQUIRED | Provide the intended Gold.org weekly-briefing sign-up URL, or confirm the button should be removed or reworded | T5-Q01; no destination guessed |
| /contact | sqootpure.com | https://sqootpure.com | dead | CLIENT DECISION REQUIRED | Provide a live destination, bring the domain online, or remove or replace the link | T5-Q02 |
| /contact | aurum.sqootpure.com | https://aurum.sqootpure.com | dead (no DNS) | CLIENT DECISION REQUIRED | Create the subdomain, give another URL, or remove the link | T5-Q03 |
| /aurum, /aurum/briefs, brief three-mints-one-supply-story | PAMP — Refinery delivery notice, 28 Aug 2026 | https://www.pamp.com/news | redirects to homepage | EDITORIAL DECISION REQUIRED | Provide the exact 28 Aug notice URL | 3 occurrences, T5-Q10 |
| /aurum, /aurum/briefs, brief what-a-widening-premium… | PAMP — Refinery delivery notice, 4 Sep 2026 | https://www.pamp.com/news | redirects to homepage | EDITORIAL DECISION REQUIRED | Provide the exact 4 Sep notice URL | 3 occurrences |
| note three-mints-longer-lead-times | PAMP — Refinery delivery notice, 8 Sep 2026 | https://www.pamp.com/news | redirects to homepage | EDITORIAL DECISION REQUIRED | Provide the exact 8 Sep notice URL | 1 occurrence |
| /aurum, /aurum/briefs, brief three-mints-one-supply-story | Royal Canadian Mint — Bullion operations statement, 31 Aug 2026 | mint.ca/en/company/media-room | 200 / direct | EDITORIAL DECISION REQUIRED | Provide the exact statement URL, or accept the media-room page | 3 occurrences; URL fixed in T5 |
| /aurum, /aurum/briefs, brief what-a-widening-premium… | Royal Canadian Mint — Bullion operations statement, 7 Sep 2026 | same | 200 / direct | EDITORIAL DECISION REQUIRED | Same as above | 3 occurrences |
| note three-mints-longer-lead-times | Royal Canadian Mint — Bullion operations statement, 8 Sep 2026 | same | 200 / direct | EDITORIAL DECISION REQUIRED | Same as above | 1 occurrence |
| /aurum, /aurum/briefs, brief what-a-widening-premium… | US Mint — Bullion product schedule update, 8 Sep 2026 | https://www.usmint.gov/news | browser reachable | EDITORIAL DECISION REQUIRED | Provide the exact update URL, or accept the news page | 3 occurrences |
| note three-mints-longer-lead-times | US Mint — Bullion product schedule update, 9 Sep 2026 | same | browser reachable | EDITORIAL DECISION REQUIRED | Same as above | 1 occurrence |
| note allocated-and-unallocated | LBMA — Guide to the London precious metals market, 1 Mar 2026 | lbma.org.uk/publications | 200 / direct | EDITORIAL DECISION REQUIRED | Provide the exact guide URL | 1 occurrence |
| note allocated-and-unallocated | World Gold Council — Investment guidance on storage structures, 18 Jun 2026 | gold.org/goldhub/research | 200 / redirected | EDITORIAL DECISION REQUIRED | Confirm the renamed research area is acceptable, or give the exact document | 1 occurrence |
| /aurum, /aurum/briefs, brief three-mints-one-supply-story; note spread-on-a-one-ounce-coin | US Mint — production and sales figures / American Eagle production report | usmint.gov/about/production-sales-figures | automation blocked | MANUAL VERIFICATION RECOMMENDED | Open once in a normal browser | 4 occurrences; site online |
| Footer on all 33 pages + /contact | Instagram | instagram.com/sqootpure/ | automation blocked (login wall) | MANUAL VERIFICATION RECOMMENDED | Open once in a normal browser | 34 occurrences |
| / | See all questions | /contact | internal direct | CLIENT DECISION REQUIRED | Relabel (e.g. to contact wording) or provide an FAQ page | T5-Q04 |
| /learn | Learn about gold's qualities | #articles | fragment valid | CLIENT DECISION REQUIRED | Relabel, or name the intended qualities destination | T5-Q05 |
| /gifting | View all occasions | #gift-card | fragment valid | CLIENT DECISION REQUIRED | Relabel, or provide an occasions destination | T5-Q06 |
| /vault | View vault details (×2) | /early-access | internal direct | CLIENT DECISION REQUIRED | Relabel, or provide facility-detail pages | T5-Q07 |
| /vault (Redemption) | Learn more | #faq | fragment valid | CLIENT DECISION REQUIRED | Add a redemption FAQ entry, or retarget | T5-Q08 |
| /vault | Watch the walkthrough | /early-access | internal direct | CLIENT DECISION REQUIRED | Provide the video, or relabel | T5-Q09 |
| /contact + 4 pages | support@getsqoot.com ×5 / hello@sqoot.us ×1 | mailto | client decision | IA FOLLOW-UP | Confirm which address(es) are intended | 6/6 valid syntax; visible address matches target |
| /home-old-ver, /gifting-old-ver | (whole page) | — | internal direct, 0 inbound | IA FOLLOW-UP | Decide the lifecycle (keep, remove or redirect) | Links audited |
| /learn | Goldhub | gold.org/goldhub | 200 / direct | FIXED | — | Was `#` |
| /vault | See how it works | #walkthrough | fragment valid | FIXED | — | |
| /gifting-old-ver | How Gifting Works | #gifting-process | fragment valid | FIXED | — | |
| / | Read the note (spread card) | /aurum/notes/spread-on-a-one-ounce-coin | internal direct | FIXED | — | Phase 3 |
| 3 articles | Royal Canadian Mint citation | mint.ca/en/company/media-room | 200 / direct | FIXED (URL) | Precision still editorial (rows above) | |
| 1 article | NIST Handbook 44 | NIST 2026 publication record | 200 / direct | FIXED | — | |
| 2 articles | LBMA benchmark data | …/lbma-precious-metal-prices | 200 / direct | FIXED | — | |
| /aurum/notes | ← Back to AURUM | /aurum | internal direct | FIXED | — | Phase 5 |
| All pages (header, footer, mobile menu, floating AURUM button) | Aurum / AURUM / Open AURUM… | /aurum → /aurum?range=1Y | 200 / redirected (intentional) | VERIFIED | — | 110 occurrences; the redirect sets the required 1Y chart range |
| All pages (shared header, footer, mobile menu) | Logo, Coin/Buy Gold, Fraction, Gifting, Vault, Pricing, Learn, About Us, Trust Center, Get Early Access, Get In Touch, Terms, Privacy | respective routes | internal direct | VERIFIED | — | ~1,000 occurrences across 27 shared groups |
| Footer + /contact | Facebook, X, LinkedIn | official profiles | 200 / browser reachable | VERIFIED | — | 34 occurrences each |
| 9 posts + 3 Learn articles | other source citations | publisher pages | 200 / direct or redirected | VERIFIED | — | See the artifact |
| All pages | remaining same-page fragments and CTAs | — | fragment valid / internal direct | VERIFIED | — | 1,416 CORRECT in total |

## 11. Regression evidence (this run)

- `bunx tsgo --noEmit`: pass.
- `bun run test`: 48 files, **707 passed**. This includes the link-audit semantic and external test files (the new-tab safety assertion, and verdict coverage for every external URL), plus route, content, AURUM and Learn tests.
- `bun run build`: pass.
- Database, queried this run:

  | Check | Value |
  |---|---|
  | Published posts | 9 |
  | Latest `updated_at` among published posts | 2026-09-19 05:31:05.388927+00 (unchanged) |
  | Gift-card orders | 7 |
  | commerce_settings md5 | 80f43e2ed3f8b6dd75ccbb4347f3c708 (unchanged) |
  | newsletter_signups | 0 |
  | newsletter_attempts | 0 |

- `APPROVED_CONSENT = null`, so newsletter signup stays disabled.
- No database writes were made in Phase 5.
- Phase 5 changed these files:
  - `src/components/aurum-editorial-archive.tsx` (back link)
  - `src/lib/link-audit/semantic.ts` (the back-link rule now expects `/aurum`)
  - the artifacts listed in §12.

## 12. Artifacts and limitations

- Artifacts:
  - `docs/verification/t5-link-audit.json`, regenerated from the final crawl.
  - `docs/verification/t5-external-evidence.json`: Phase 4 evidence plus a `phase5Recheck` block.
  - Phase 1–4 reports are preserved.
- **Checking environment.** External checks ran from a data-centre IP, so US Mint figures and Instagram stay inconclusive.
- **Crawl states.** The crawl covers default rendered states. Hidden menus are opened by the crawler; content behind forms is not reached.
- **Stripe price-id md5.** The historical Phase 2 value can't be reproduced (its query was never recorded). No commerce configuration was touched, so this check was not re-run.
- **Out-of-scope edit.** The Phase 5 back-link fix touched the notes archive component, which was previously out of scope. Only its back-link target changed, because the old target became a dead fragment when the Daily Note board section was removed.

**T5 AUDIT COMPLETE — LINK REMEDIATION BLOCKED ONLY BY EXPLICIT CLIENT/EDITORIAL DECISIONS**
