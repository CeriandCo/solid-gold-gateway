# Roadmap

## In progress
- [x] Make AURUM day change, prior close, and rolling range use one validated same-provider spot source.
- [x] Rebuild homepage phase 1 with the shared tokens, container, and ordered empty section shell.
- [x] Build homepage phase 2 hero with the supplied scene, phone, actions, store badges, and sample spot card.

## Done
- [x] Aligned AURUM containers, hero height, and desktop section rhythm with the shared inner-page system.
- [x] Derived AURUM calculator bounds, validation, provenance, and chart labels from the real history extent.
- [x] Sourced AURUM Daily Notes from published Learn articles and added searchable Notes and Briefs archives.
- [x] Stopped AURUM chart and editorial controls from changing scroll position or clearing the current hash.
- [x] Rebalanced `/aurum` with light price/facts bands, a dark Weekly Brief anchor, shared stat-card geometry, and retired background assets removed.
- [x] Replaced the AURUM double menu with a shared-nav AURUM entry and route-scoped floating section navigator.
- Built `/aurum#price` with validated database-only live/unavailable states, computed historical facts, and re-querying range chart.
- Built the `/aurum#top` editorial hero with its responsive photo scrim, educational copy, and Price/Learn anchor actions.
- Added the `/aurum` route shell with its sticky subheader, anchor navigation, nine placeholders, unavailable price state, and shared footer link.
- Shared 4-column footer (homepage design) used on all 8 pages via `SiteFooter`; styles live in `src/styles.css` (`footer.site-footer`) so page-scoped CSS cannot alter them.
- Shared header: removed Gifting's header/footer overrides; Trust Center header/footer moved outside the page-scoped `<main>`; header geometry now fits 1024–1439px without horizontal overflow (full artboard values from 1440px).
- Removed dead `src/components/about-us-header.tsx`; removed the old "Fortress Gold Inc." footer and local `Brand`/`nav` from Fractional Gold.
- Vault: process/redemption step rows wrap on narrower laptops instead of overflowing the page.

## Ready
- Create real pages for footer links that still point to `#`: Security, Help Center, Terms of Service, Data Privacy Policy, Disclosures.
- Wire the header "Get Early Access" button (`#login`) to the actual early-access form (`/vault#early-access`).
- Social links in the footer point to `#`; add real Instagram / LinkedIn / YouTube URLs when available.

## Done
- Standardized Buy Gold, Fractional Gold, Gifting, Trust Centre, About Us, and Learn heroes to one shared Buy Gold structure; verified desktop, tablet, and mobile without changing Homepage or Vault.

- [x] Replace About Us hero image with uploaded gold-bar-on-green-velvet asset
- [x] Unify scroll-reveal animation across all routes (shared useReveal hook)
- [x] Stabilize About Us responsive card sections (ownership paths, process, trust) across 390–1440px

## New (pending)
- [x] Daily Note section (#daily-note) with expand-in-place notes and /aurum/notes/:slug pages
- [x] Weekly Brief section (#weekly-brief) with shared expand-in-place reading and /aurum/briefs/:slug pages
- [x] Learn section (#learn) with four first-buyer cautions and links to the three published guides
- [x] Gifts section (#gifts) with three milestone cards (uploaded photos as WebP) and a /gifting handoff
- [x] Community section (#community) with Reddit-source sample pulse, opinion notice, and Circle room block (both compliance chips)
- [x] Subscribe section (#subscribe) — The Melt signup with consent version/timestamp/attribution payload
- Replace Vault page hero image with uploaded secure allocation drawer image and restructure Vault hero to match shared InnerPageHero pattern.
- Fix homepage FAQ accordion: split into two independent columns, animate height with grid-template-rows, replace icon swap with animated plus/minus bars.
- [x] Add AURUM before Learn in the footer; top/mobile insertion was reverted by the approved overflow gate after failing at 1024px.
- [x] Verify all six desktop widths, footer order, screenshots, and build.

## CMS (AURUM editorial)
- [x] Step 1 — database tables for posts and sources, sourcing rule, seed.
- [x] Step 2 — public site reads notes and briefs from the database.
- [x] Step 3a — allowlist sign-in, roles, admin shell with People and Settings.
- [x] Step 3b-1 — read-only Posts list in the admin (filters, tabs, search, detail).
- [x] Step 3b-2 — creating, editing and deleting drafts in the admin (drafts only; publishing arrives with the review workflow).
- [x] Step 3b-3 — sources editor and live preview for drafts.

## Gifting
- [x] G1 — replace the engraving section with the Gift Card purchase UI and verify responsive/accessibility behavior.
- [x] Refine the Gift Card left column typography, amount controls, summary, CTA, and trust line.
- [x] B1 — commerce database foundation (settings kill switch, denominations, orders, cards, ledger, Stripe events, rate-limit attempts) and server-loaded amounts.
- [x] B2 — secure checkout session creation (origins, rate limiting, server-decided amounts).
- [x] B3a — Stripe webhook: signature verification, replay protection, payment settlement.
- [x] B3b — refunds, disputes, fraud review rules and alerts.


- [ ] Set up a custom sending domain so sign-in links are not sent by the shared default sender.
- [x] B4 — activation after the hold, gift code minting and delivery.
- [x] B5 — security hardening and abuse-test pass.
- [x] S2 — gift card Checkout bound to a verified Stripe Product catalog (sandbox-first).
