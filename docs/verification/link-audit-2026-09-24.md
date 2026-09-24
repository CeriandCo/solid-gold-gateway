# Full-site click-through audit — 2026-09-24

This is an audit only. No code, content or data was changed in this pass.

## Method (what was actually run)

1. **Routes:** all 33 public routes. This is the T5 route inventory, taken from `src/routes/` + the 3 static Learn articles + the 9 published AURUM posts. Admin routes (`/admin/*`) and `/api/*` are excluded because they are not public pages.
2. **Rendered crawl:** Playwright/Chromium loaded every route at **1440px and 375px**, so 66 page loads with 0 load errors. On each page it collected every `<a>`, `<button>`, `[role=button|link]`, `summary`, submit input, and every non-control element with `cursor: pointer`. For each one it recorded the href, target, type, disabled state, the React event handlers attached (read from the rendered element's props), whether it sits in a form with a submit handler, and whether a `#fragment` target exists on the page.
   - Elements captured: **2,390** (2,048 anchors, 342 non-anchor controls/pointer elements), summed across both viewports.
   - Script: `/tmp/browser/ca/crawl_clicks.py`, analysis: `/tmp/browser/ca/analyze_clicks.py` (not committed).
3. **Flag rules:** a flag was raised for:
   - an `href` that is missing, empty, `#` or `javascript:`
   - a fragment with no matching id on the page
   - a button with no click handler, no submit role and no `aria-controls`
   - a pointer cursor with no handler
   - a disabled control
4. **Wrong-destination / misleading labels:** these come from the T5 semantic review (`docs/verification/t5-link-audit.json`, final crawl). I re-checked the current source for the 2 items changed since then ("View all occasions" relabel, "Explore Learn" link).
5. **External reachability** is carried forward from T5 Phase 4/5 (`t5-external-evidence.json`). It was **not re-probed** in this pass.

Limitation: a handler being attached does not prove it does something visible. I did not click-test the 342 controls that have handlers (tabs, accordions, carousels, menus, forms). They were flagged only when they had **no** handler.

## Findings

| Route | Element / label | Current behavior | Verdict | Suggested fix |
|---|---|---|---|---|
| /learn | "Sign Up on Gold.org" button | `href="#"`. Clicking does nothing except jump to the top. Copy promises a weekly briefing. (1440 + 375) | **broken** | Client to supply the Gold.org newsletter URL (none found: /newsletter, /subscribe return 404), or approve the gold.org account-register page, or remove/reword the button. |
| /learn | Play button in hero, "Preview the introduction to gold" | `<button type="button">` with no click handler. Nothing happens on click. (1440 + 375) | **broken** | Provide the intro video to play (modal/inline), or remove the play icon so it does not look clickable. |
| /learn | Play button on "Elton John / Touched by Gold: Watch the Film" card | `<button type="button">` with no handler. Heading says "Watch the Film" but nothing plays. (1440 + 375) | **broken / misleading** | Link to the official film (client to confirm source URL), or remove the play button and "Watch the Film" wording. |
| /gifting-old-ver | 8 occasion tiles (Achievements, Anniversaries, Birthdays, Festivals, Graduations, Housewarmings, New Arrivals, Weddings) | Pointer cursor on hover but no handler, so clicking does nothing. (1440 + 375) | **misleading** (orphan page) | Decide the page's future first (T5-Q15 orphan route). If kept, remove the pointer cursor or link each tile. |
| /contact | "sqootpure.com" | External link. Domain does not serve a usable site (T5: DEAD). | **broken** | Client: give the live URL, bring the domain online, or remove. |
| /contact | "aurum.sqootpure.com" | External link. Subdomain has no DNS (T5: DEAD). | **broken** | Client: create the subdomain, change it to `/aurum` on this site, or remove. |
| /aurum, /aurum/briefs, 3 briefs, 1 note (7 occurrences) | "PAMP — Refinery delivery notice, …" citations | https://www.pamp.com/news redirects to the PAMP homepage. The cited notice is not reachable. | **misleading** | Editorial: supply the exact notice URL or reword the citation as a general source. |
| /aurum, briefs, notes (13 citation items: RCM ×7, US Mint ×4, LBMA ×1, WGC ×1) | Dated source citations | Link goes to the publisher's index page (media room / news / publications), not the specific dated document. | **misleading** (precision) | Editorial: replace each with the exact document URL, or relabel as the publisher source. |
| / (home FAQ) | "See all questions" | Goes to `/contact`. There is no full FAQ page. | **misleading** | Rename (e.g. "Ask us a question") or create an FAQ page. Client decision. |
| /learn | "Learn about gold's qualities →" | Scrolls to `#articles` (3 general guides), which are not specifically about gold's qualities. | **misleading** | Rename (e.g. "Read our guides") or point to relevant content once it exists. |
| /vault (×2) | "View vault details" | Goes to `/early-access` (waitlist), not a vault details page. | **misleading** | Rename to "Join early access", or build a vault details destination. |
| /vault | "Watch the walkthrough" | Goes to `/early-access`. There is no video. | **misleading** | Supply the walkthrough video, or rename to match the waitlist destination. |
| /vault | Redemption card "Learn more" | Scrolls to `#faq` on the same page. This works, but it is generic. | **misleading** (minor) | Point it to the specific redemption FAQ item, or rename to "See redemption FAQ". |
| /gifting | "Continue to Secure Checkout" (Gift Card form) | Disabled until a gift amount is chosen. Its accessible name says so. | **OK** (intentional) | None. |
| /gifting | "Give a Gift Card →" (formerly "View all occasions") | Scrolls to `#gift-card`. Label now matches the destination. | **OK** (fixed earlier) | None. `src/lib/link-audit/semantic.ts` still has a rule keyed on the old label; update it when the audit is next regenerated. |
| /learn | "Explore Learn →" | Scrolls to `#aurum-archive`. Target exists. | **OK** | None. |
| All pages | Instagram (34) and US Mint (4) external links | The automated browser was blocked (Instagram 429/login wall, US Mint Cloudflare 403). Both sites are online. | **OK — manual check recommended** | Someone opens them once in a normal browser to confirm. |
| /home-old-ver, /gifting-old-ver | Whole pages | Nothing on the site links to them (orphans). | **IA follow-up** | Client: keep, retire, or redirect. |
| Site-wide | Contact email | support@getsqoot.com ×5 vs hello@sqoot.us ×1. Both mailto links work. | **IA follow-up** | Client: choose one address. |

## Everything else: OK

The rest of the rendered controls on all 33 routes, at both widths, are OK:
- Every other anchor has a real href: no other `#`, empty or `javascript:` values, and 0 dead fragments.
- Every other button has a click handler, submits a handled form, or controls a panel (`aria-controls`). This covers the menu, tabs, accordions, carousel arrows, range toggles, forms and copy buttons.

The T5 final crawl found 0 internal 404s, 0 redirect loops and 0 unsafe new-tab links. Those results were not re-run here.

## Counts

- Broken: 5 distinct items (Sign Up on Gold.org, 2 Learn play buttons, sqootpure.com, aurum.sqootpure.com)
- Misleading: 8 distinct decisions (old-gifting tiles, PAMP, citation precision, See all questions, gold's qualities, View vault details, Watch the walkthrough, Redemption Learn more)
- Follow-up: Instagram/US Mint manual check, 2 orphan routes, contact email
