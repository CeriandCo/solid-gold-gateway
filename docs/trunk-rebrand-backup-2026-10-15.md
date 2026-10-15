# TRUNK rebrand backup — old-brand strings (2026-10-15)

Case-insensitive search for `sqoot` across: src, public, supabase, scripts, package.json, vite.config.ts, tsconfig.json, components.json, README.md, AGENTS.md, DESIGN_SYSTEM.md, drizzle.config.ts, vitest.config.ts, eslint.config.js, bunfig.toml, .lovable/project.json. `src/routeTree.gen.ts` is generated and excluded.

Total matches: 312 in 69 files.

## DESIGN_SYSTEM.md

| File path | Line | Exact current text |
|---|---|---|
| DESIGN_SYSTEM.md | 1 | # SQOOT Pure Design System |
| DESIGN_SYSTEM.md | 3 | This document is the single source of truth for the visual language of the SQOOT Pure website. It is intended for both designers and future engineering/AI contributors working in this repository. All values below describe the current implementation; they are not aspirational. When building new pages or components, reference these tokens first before introducing new values. |
| DESIGN_SYSTEM.md | 349 | This section consolidates every Tailwind responsive prefix actually used across the SQOOT Pure site. The values below are the **concrete pixel breakpoints** in production code (\`src/routes/*.tsx\`, \`src/components/site-chrome.tsx\`, and \`src/styles.css\`). |
| DESIGN_SYSTEM.md | 458 | 2. **SQOOT Pure mandala** (\`sqoot-mandala.png\` / \`sqoot-pure-mandala.png.asset.json\`) |

## README.md

| File path | Line | Exact current text |
|---|---|---|
| README.md | 1 | # SQOOT Gold Vault |
| README.md | 3 | Use the supplied SQOOT Pure Style Guide as the single source of truth for colors, typography, spacing, radii, buttons and emotional register. |
| README.md | 5 | Use SQOOT-Website-New-01.jpg and IMG_5216.png as the primary website layout and visual-quality references. |
| README.md | 9 | Preserve the established SQOOT visual language: |

## scripts/s5-catalog-probe.ts

| File path | Line | Exact current text |
|---|---|---|
| scripts/s5-catalog-probe.ts | 45 |         usd: amounts.map((a) => \`sqoot_gift_card_usd_${a}\`), |

## scripts/test-db/down.sh

| File path | Line | Exact current text |
|---|---|---|
| scripts/test-db/down.sh | 5 | ROOT=/tmp/sqoot-test-db |
| scripts/test-db/down.sh | 14 |   setpriv --reuid="${SQOOT_TEST_PGUSER:-lovable}" --regid="${SQOOT_TEST_PGUSER:-lovable}" --clear-groups bash -c "pg_ctl -D '$ROOT/pgdata' -m immediate -w stop" >/dev/null 2>&1 \|\| true |

## scripts/test-db/up.sh

| File path | Line | Exact current text |
|---|---|---|
| scripts/test-db/up.sh | 8 | # Writes /tmp/sqoot-test-db/env.json with the local REST url. |
| scripts/test-db/up.sh | 11 | ROOT=/tmp/sqoot-test-db |
| scripts/test-db/up.sh | 14 | PGPORT_LOCAL=${SQOOT_TEST_PGPORT:-54329} |
| scripts/test-db/up.sh | 15 | RESTPORT=${SQOOT_TEST_RESTPORT:-54330} |
| scripts/test-db/up.sh | 16 | PROXYPORT=${SQOOT_TEST_PROXYPORT:-54331} |
| scripts/test-db/up.sh | 22 | PGRUNAS=${SQOOT_TEST_PGUSER:-lovable} |

## src/assets/sqoot-pure-hero-background.jpg.asset.json

| File path | Line | Exact current text |
|---|---|---|
| src/assets/sqoot-pure-hero-background.jpg.asset.json | 5 |   "url": "/__l5e/assets-v1/12771427-8146-4559-a926-c86b5c3374cc/sqoot-pure-hero-background.jpg", |
| src/assets/sqoot-pure-hero-background.jpg.asset.json | 6 |   "r2_key": "a/v1/dfb6b88e-1020-4c5e-920c-1659e913f2e8/12771427-8146-4559-a926-c86b5c3374cc/sqoot-pure-hero-background.jpg", |
| src/assets/sqoot-pure-hero-background.jpg.asset.json | 7 |   "original_filename": "sqoot-pure-hero-background.jpg", |

## src/assets/sqoot-pure-mandala.png.asset.json

| File path | Line | Exact current text |
|---|---|---|
| src/assets/sqoot-pure-mandala.png.asset.json | 5 |   "url": "/__l5e/assets-v1/6e05ddb7-4203-43e2-bbcd-bb1795cefd04/sqoot-pure-mandala.png", |
| src/assets/sqoot-pure-mandala.png.asset.json | 6 |   "r2_key": "a/v1/dfb6b88e-1020-4c5e-920c-1659e913f2e8/6e05ddb7-4203-43e2-bbcd-bb1795cefd04/sqoot-pure-mandala.png", |
| src/assets/sqoot-pure-mandala.png.asset.json | 7 |   "original_filename": "sqoot-pure-mandala.png", |

## src/assets/sqoot-pure-product-comparison.png.asset.json

| File path | Line | Exact current text |
|---|---|---|
| src/assets/sqoot-pure-product-comparison.png.asset.json | 5 |   "url": "/__l5e/assets-v1/0848d17b-a111-481a-9455-be6838661328/sqoot-pure-product-comparison.png", |
| src/assets/sqoot-pure-product-comparison.png.asset.json | 6 |   "r2_key": "a/v1/dfb6b88e-1020-4c5e-920c-1659e913f2e8/0848d17b-a111-481a-9455-be6838661328/sqoot-pure-product-comparison.png", |
| src/assets/sqoot-pure-product-comparison.png.asset.json | 7 |   "original_filename": "sqoot-pure-product-comparison.png", |

## src/components/aurum-floating-button.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/components/aurum-floating-button.tsx | 4 | import mandala from "@/assets/sqoot-pure-mandala.png.asset.json"; |

## src/components/aurum-floating-nav.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/components/aurum-floating-nav.tsx | 3 | import mandala from "@/assets/sqoot-pure-mandala.png.asset.json"; |

## src/components/learn-article-page.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/components/learn-article-page.tsx | 29 |           <h2 className="font-display text-2xl font-medium leading-[1.1] tracking-[-0.015em] sm:text-3xl">Join the SQOOT Pure waitlist</h2> |
| src/components/learn-article-page.tsx | 30 |           <p className="body-copy mx-auto mt-5 max-w-[600px] text-warm-white/80">Be among the first to explore fractional physical gold ownership when SQOOT Pure launches.</p> |
| src/components/learn-article-page.tsx | 31 |           <div className="mt-8"><GoldButton to="/early-access">Join the SQOOT Pure waitlist</GoldButton></div> |

## src/components/site-chrome.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/components/site-chrome.tsx | 39 |  * Shared SQOOT CTA button. |
| src/components/site-chrome.tsx | 230 |  * Shared SQOOT Pure navbar — single source for every page. |
| src/components/site-chrome.tsx | 374 |   { Icon: Instagram, label: "Instagram", href: "https://www.instagram.com/sqootpure/" }, |
| src/components/site-chrome.tsx | 375 |   { Icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/sqootpure" }, |
| src/components/site-chrome.tsx | 376 |   { Icon: Twitter, label: "X (Twitter)", href: "https://x.com/sqootpure" }, |
| src/components/site-chrome.tsx | 380 |  * Shared SQOOT Pure footer — single source for every page. |
| src/components/site-chrome.tsx | 422 |         <p className="site-footer__copy">© {year} SQOOT Pure. All rights reserved.</p> |

## src/components/waitlist-cta.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/components/waitlist-cta.tsx | 62 |               You’re on the list. Thank you for joining the SQOOT Pure waitlist — we’ll let you |

## src/lib/admin-password.server.ts

| File path | Line | Exact current text |
|---|---|---|
| src/lib/admin-password.server.ts | 59 |   "sqootsqoot12", |

## src/lib/aurum/ai/contract.ts

| File path | Line | Exact current text |
|---|---|---|
| src/lib/aurum/ai/contract.ts | 99 |   "You write one short AURUM Daily Note about the gold price for SQOOT Pure.", |

## src/lib/aurum/ai/data.server.ts

| File path | Line | Exact current text |
|---|---|---|
| src/lib/aurum/ai/data.server.ts | 60 |       publisher: "SQOOT AURUM price record", |

## src/lib/aurum/ai/manual.server.ts

| File path | Line | Exact current text |
|---|---|---|
| src/lib/aurum/ai/manual.server.ts | 64 |   "You draft one short AURUM post for SQOOT Pure. An editor will review and edit it.", |

## src/lib/aurum/ai/persistence-db.test.ts

| File path | Line | Exact current text |
|---|---|---|
| src/lib/aurum/ai/persistence-db.test.ts | 18 | const env = JSON.parse(readFileSync("/tmp/sqoot-test-db/env.json", "utf8")) as { pgPort: number }; |
| src/lib/aurum/ai/persistence-db.test.ts | 57 |     publisher: "SQOOT AURUM price record", |

## src/lib/aurum/ai/run.test.ts

| File path | Line | Exact current text |
|---|---|---|
| src/lib/aurum/ai/run.test.ts | 88 |         publisher: "SQOOT AURUM price record", |

## src/lib/aurum/ai/verify.ts

| File path | Line | Exact current text |
|---|---|---|
| src/lib/aurum/ai/verify.ts | 43 |   "AURUM", "SQOOT", "Pure", "Gold", "Daily", "Note", "USD", "US", "UTC", "Spot", |

## src/lib/aurum/publish-rpc.test.ts

| File path | Line | Exact current text |
|---|---|---|
| src/lib/aurum/publish-rpc.test.ts | 19 | const env = JSON.parse(readFileSync("/tmp/sqoot-test-db/env.json", "utf8")) as { |

## src/lib/aurum/review-archive-db.test.ts

| File path | Line | Exact current text |
|---|---|---|
| src/lib/aurum/review-archive-db.test.ts | 18 | const env = JSON.parse(readFileSync("/tmp/sqoot-test-db/env.json", "utf8")) as { pgPort: number }; |

## src/lib/aurum/review-restore-db.test.ts

| File path | Line | Exact current text |
|---|---|---|
| src/lib/aurum/review-restore-db.test.ts | 18 | const env = JSON.parse(readFileSync("/tmp/sqoot-test-db/env.json", "utf8")) as { pgPort: number }; |

## src/lib/aurum/review-return-db.test.ts

| File path | Line | Exact current text |
|---|---|---|
| src/lib/aurum/review-return-db.test.ts | 18 | const env = JSON.parse(readFileSync("/tmp/sqoot-test-db/env.json", "utf8")) as { pgPort: number }; |

## src/lib/aurum/review-transition-db.test.ts

| File path | Line | Exact current text |
|---|---|---|
| src/lib/aurum/review-transition-db.test.ts | 15 | const env = JSON.parse(readFileSync("/tmp/sqoot-test-db/env.json", "utf8")) as { pgPort: number }; |

## src/lib/commerce-checkout.server.test.ts

| File path | Line | Exact current text |
|---|---|---|
| src/lib/commerce-checkout.server.test.ts | 25 | const ORIGIN = "https://tests.sqoot.invalid"; |

## src/lib/commerce/session-params.test.ts

| File path | Line | Exact current text |
|---|---|---|
| src/lib/commerce/session-params.test.ts | 70 |       purpose: "sqoot_gift_card", |

## src/lib/commerce/session-params.ts

| File path | Line | Exact current text |
|---|---|---|
| src/lib/commerce/session-params.ts | 60 |       purpose: "sqoot_gift_card", |
| src/lib/commerce/session-params.ts | 66 |         purpose: "sqoot_gift_card", |

## src/lib/commerce/stripe-catalog.server.ts

| File path | Line | Exact current text |
|---|---|---|
| src/lib/commerce/stripe-catalog.server.ts | 103 |   return \`sqoot_gift_card_${currency}_${amountCents}\`; |
| src/lib/commerce/stripe-catalog.server.ts | 189 |     } else if ((product.metadata?.["purpose"] ?? null) !== "sqoot_gift_card") { |

## src/lib/commerce/stripe-catalog.test.ts

| File path | Line | Exact current text |
|---|---|---|
| src/lib/commerce/stripe-catalog.test.ts | 27 | const PRODUCT = { id: "prod_sqoot_gift", active: true, metadata: { purpose: "sqoot_gift_card" } }; |
| src/lib/commerce/stripe-catalog.test.ts | 174 |                 product: { id: "prod_other", active: true, metadata: { purpose: "sqoot_gift_card" } }, |
| src/lib/commerce/stripe-catalog.test.ts | 206 |                 product: { id: PRODUCT.id, active: false, metadata: { purpose: "sqoot_gift_card" } }, |
| src/lib/commerce/stripe-catalog.test.ts | 265 |       "https://tests.sqoot.invalid", |

## src/lib/gift-delivery.server.test.ts

| File path | Line | Exact current text |
|---|---|---|
| src/lib/gift-delivery.server.test.ts | 267 |     expect(message.subject).toBe("You've received a SQOOT Pure Gift Card"); |

## src/lib/gift-delivery.server.ts

| File path | Line | Exact current text |
|---|---|---|
| src/lib/gift-delivery.server.ts | 78 | export const GIFT_EMAIL_SUBJECT = "You've received a SQOOT Pure Gift Card"; |
| src/lib/gift-delivery.server.ts | 81 |   "Keep this code safe. You'll be able to redeem it with SQOOT Pure."; |
| src/lib/gift-delivery.server.ts | 99 |     \`You've received a SQOOT Pure Gift Card worth ${amount}.\`, |
| src/lib/gift-delivery.server.ts | 106 |     "SQOOT Pure", |
| src/lib/gift-delivery.server.ts | 118 |           <p style="margin:0 0 24px 0;font-family:Georgia,'Times New Roman',serif;font-size:14px;letter-spacing:0.18em;text-transform:uppercase;color:#1F3B2C;">SQOOT Pure</p> |
| src/lib/gift-delivery.server.ts | 121 |           <p style="margin:0 0 24px 0;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.6;color:#2B3B33;">You've received a SQOOT Pure Gift Card worth <strong>${escapeHtml(amount)}</strong>.</p> |

## src/lib/learn-articles.ts

| File path | Line | Exact current text |
|---|---|---|
| src/lib/learn-articles.ts | 236 |       text: "Explore physical gold ownership with SQOOT Pure" |
| src/lib/learn-articles.ts | 240 |       text: "SQOOT Pure is being built to make physical precious metal ownership more accessible, transparent and easier to understand." |
| src/lib/learn-articles.ts | 633 |       text: "SQOOT Pure is being built around a simple idea: make physical precious metal ownership easier to understand and more accessible." |
| src/lib/learn-articles.ts | 641 |       text: "Join the SQOOT Pure waitlist to be among the first to know when we launch." |
| src/lib/learn-articles.ts | 1002 |       text: "SQOOT Pure is being built to make physical precious metal ownership simpler and more accessible." |
| src/lib/learn-articles.ts | 1018 |       text: "Join the SQOOT Pure waitlist to be among the first to know when gifting and precious metal ownership become available." |

## src/lib/link-audit/analyze.test.ts

| File path | Line | Exact current text |
|---|---|---|
| src/lib/link-audit/analyze.test.ts | 59 |     expect(c("https://x.com/sqootpure")).toMatchObject({ category: "external", destinationKey: "https://x.com/sqootpure" }); |
| src/lib/link-audit/analyze.test.ts | 60 |     expect(c("mailto:hello@sqootpure.com").category).toBe("mailto"); |

## src/lib/link-audit/external.ts

| File path | Line | Exact current text |
|---|---|---|
| src/lib/link-audit/external.ts | 49 |   "https://www.linkedin.com/company/sqootpure": r("REACHABLE", "NONE", "200, title “SQOOT \| LinkedIn”", "200, “SQOOT \| LinkedIn” behind cookie banner", null, "LinkedIn company page “SQOOT”"), |
| src/lib/link-audit/external.ts | 53 |   "https://x.com/sqootpure": r("REACHABLE", "NONE", "200, title “SqootPure (@SqootPure) / X”", "Chromium 403 (blank); Firefox 200, profile “SqootPure @SqootPure — Real gold. Real ownership…”", null, "X profile @SqootPure"), |
| src/lib/link-audit/external.ts | 61 |   "https://www.facebook.com/profile.php?id=61586363577228": r("BROWSER-REACHABLE / AUTOMATED CHECK BLOCKED", "HEALTHY", "400", "200 → /people/Sqoot-Pure/61586363577228/, page “Sqoot Pure”, bio “A precious metals platform to buy + Store + Gift physical gold…”", "https://www.facebook.com/people/Sqoot-Pure/61586363577228/", "Facebook page “Sqoot Pure”"), |
| src/lib/link-audit/external.ts | 64 |   "https://www.instagram.com/sqootpure/": r("AUTOMATED CHECK BLOCKED — BROWSER INCONCLUSIVE", "HEALTHY", "302 → 429 login", "429, redirected to login wall with next=/sqootpure/ (no login attempted)", "https://www.instagram.com/accounts/login/?next=…/sqootpure/", "Instagram (platform correct; profile not observable without login)"), |
| src/lib/link-audit/external.ts | 66 |   "https://sqootpure.com/": r("DEAD", "NONE", "3 attempts: TLS connection closed (DNS resolves); http:// → 403 “Request forbidden by administrative rules”", "ERR_CONNECTION_CLOSED (Chromium); http:// 403 in Chromium + Firefox", null, "Client-owned domain shown on /contact; not serving a site", true), |
| src/lib/link-audit/external.ts | 67 |   "https://aurum.sqootpure.com/": r("DEAD", "NONE", "3 attempts: DNS name not resolved", "ERR_NAME_NOT_RESOLVED", null, "Client-owned subdomain shown on /contact; no DNS record", true), |

## src/lib/link-audit/semantic.ts

| File path | Line | Exact current text |
|---|---|---|
| src/lib/link-audit/semantic.ts | 60 |   ["SQOOT Pure home", "/", "logo → homepage (H1 “Own gold the way it was meant to be.”)"], |
| src/lib/link-audit/semantic.ts | 81 |   [/^Instagram/, /^https:\/\/www\.instagram\.com\/sqootpure\/$/, "Instagram icon/label → instagram.com/sqootpure"], |
| src/lib/link-audit/semantic.ts | 82 |   [/^LinkedIn/, /^https:\/\/www\.linkedin\.com\/company\/sqootpure$/, "LinkedIn icon/label → linkedin.com/company/sqootpure"], |
| src/lib/link-audit/semantic.ts | 83 |   [/^X \(Twitter\)/, /^https:\/\/x\.com\/sqootpure$/, "X icon/label → x.com/sqootpure"], |
| src/lib/link-audit/semantic.ts | 166 |   { id: "home:mail", match: all(on("/"), is("support@getsqoot.com", "mailto:support@getsqoot.com")), verdict: "CORRECT", evidence: "Visible address equals mailto target; FAQ/privacy-request context." }, |
| src/lib/link-audit/semantic.ts | 179 |   { id: "early-access-cta", match: is(/^(Get Early Access\|Join the Waitlist\|Join the waitlist to buy →\|Join the SQOOT Pure waitlist)$/, "/early-access"), verdict: "CORRECT", evidence: "Waitlist CTA (site is pre-launch; purchase opens via waitlist) → /early-access." }, |
| src/lib/link-audit/semantic.ts | 180 |   { id: "pricing:mail", match: all(on("/pricing"), is("support@getsqoot.com", "mailto:support@getsqoot.com")), verdict: "CORRECT", evidence: "Visible address equals mailto target (fees FAQ)." }, |
| src/lib/link-audit/semantic.ts | 248 |   { id: "contact:mail", match: all(on("/contact"), is("hello@sqoot.us", "mailto:hello@sqoot.us")), verdict: "CORRECT", evidence: "Visible address equals mailto target. Which address is canonical is a separate client content decision." }, |
| src/lib/link-audit/semantic.ts | 249 |   { id: "contact:domains", match: all(on("/contact"), (o) => (t(o) === "sqootpure.com" && tgt(o) === "https://sqootpure.com/") \|\| (t(o) === "aurum.sqootpure.com" && tgt(o) === "https://aurum.sqootpure.com/")), verdict: "CORRECT", evidence: "Visible domain equals target domain. Reachability/ownership left to Phase 4." }, |
| src/lib/link-audit/semantic.ts | 252 |   { id: "gifting:gift-card", match: is("Buy a Gift Card", "/gifting#gift-card"), verdict: "CORRECT", evidence: "→ “SQOOT PURE GIFT CARD — Give them the freedom to choose.” (purchase section)." }, |
| src/lib/link-audit/semantic.ts | 274 |   { id: "trust:mail", match: all(on("/trust-center"), (o) => /^mailto:support@getsqoot\.com(\?subject=Legal%20Counsel%20Details%20Request)?$/.test(tgt(o)) && (t(o) === "support@getsqoot.com" \|\| t(o) === "Request details")), verdict: "CORRECT", evidence: "Client Protection: visible address equals target; “Request details” pre-fills subject “Legal Counsel Details Request” to the same published support address." }, |

## src/lib/newsletter/newsletter-schema-db.test.ts

| File path | Line | Exact current text |
|---|---|---|
| src/lib/newsletter/newsletter-schema-db.test.ts | 19 | const env = JSON.parse(readFileSync("/tmp/sqoot-test-db/env.json", "utf8")) as { pgPort: number }; |

## src/lib/stripe-webhook-refunds.server.test.ts

| File path | Line | Exact current text |
|---|---|---|
| src/lib/stripe-webhook-refunds.server.test.ts | 58 |     metadata: { order_id: orderId, purpose: "sqoot_gift_card" }, |
| src/lib/stripe-webhook-refunds.server.test.ts | 177 |     metadata: { purpose: "sqoot_gift_card" }, |
| src/lib/stripe-webhook-refunds.server.test.ts | 187 |     metadata: { purpose: "sqoot_gift_card" }, |

## src/lib/stripe-webhook.server.test.ts

| File path | Line | Exact current text |
|---|---|---|
| src/lib/stripe-webhook.server.test.ts | 54 |     metadata: { order_id: orderId, purpose: "sqoot_gift_card" }, |

## src/lib/stripe-webhook.server.ts

| File path | Line | Exact current text |
|---|---|---|
| src/lib/stripe-webhook.server.ts | 119 |   if (sessionPurpose(session) !== "sqoot_gift_card") { |
| src/lib/stripe-webhook.server.ts | 203 |   if (sessionPurpose(session) !== "sqoot_gift_card") { |
| src/lib/stripe-webhook.server.ts | 280 |   return purpose === undefined \|\| purpose === "sqoot_gift_card"; |

## src/routes/__root.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/routes/__root.tsx | 83 |       { title: "SQOOT Pure — Fine Gold, Real Ownership" }, |
| src/routes/__root.tsx | 89 |       { name: "author", content: "SQOOT Pure" }, |
| src/routes/__root.tsx | 90 |       { property: "og:title", content: "SQOOT Pure — Fine Gold, Real Ownership" }, |

## src/routes/about-us.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/routes/about-us.tsx | 6 | import sqootMandala from "@/assets/sqoot-pure-mandala.png.asset.json"; |
| src/routes/about-us.tsx | 11 |       { title: "About SQOOT Pure — Built on Gold Expertise" }, |
| src/routes/about-us.tsx | 16 |       { property: "og:title", content: "About SQOOT Pure — Built on Gold Expertise" }, |
| src/routes/about-us.tsx | 19 |         content: "Founder-led and compliance-first: discover the experience behind SQOOT Pure.", |
| src/routes/about-us.tsx | 108 |         body={<>Our experience became SQOOT Pure: a simpler, more transparent way to own fine gold.</>} |
| src/routes/about-us.tsx | 111 |         imageAlt="SQOOT Pure gold bar resting on dark green velvet" |
| src/routes/about-us.tsx | 124 |             <p>SQOOT Pure is the outcome of that experience.<br />Built with a single purpose: to offer a gold ownership platform designed for a new era.</p> |
| src/routes/about-us.tsx | 126 |           <img className="about-story-etch" src={sqootMandala.url} alt="" aria-hidden="true" /> |
| src/routes/about-us.tsx | 131 |         <img className="about-mandala about-mandala-left" src={sqootMandala.url} alt="" aria-hidden="true" /> |
| src/routes/about-us.tsx | 132 |         <img className="about-mandala about-mandala-right" src={sqootMandala.url} alt="" aria-hidden="true" /> |
| src/routes/about-us.tsx | 168 |           <div className="about-trust-emblem"><img src={sqootMandala.url} alt="" aria-hidden="true" /><LineIcon name="shield" /></div> |

## src/routes/api/public/aurum-backfill-daily-history.ts

| File path | Line | Exact current text |
|---|---|---|
| src/routes/api/public/aurum-backfill-daily-history.ts | 41 |         headers: { accept: 'application/json', 'user-agent': 'Mozilla/5.0 (compatible; SqootAurum/1.0)' }, |

## src/routes/aurum.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/routes/aurum.tsx | 47 |       { title: "AURUM Gold Education \| SQOOT Pure" }, |
| src/routes/aurum.tsx | 50 |         content: "Free gold education from SQOOT Pure, with clear learning resources and no investment advice.", |
| src/routes/aurum.tsx | 52 |       { property: "og:title", content: "AURUM Gold Education \| SQOOT Pure" }, |
| src/routes/aurum.tsx | 55 |         content: "Free, clear gold education published by SQOOT Pure.", |

## src/routes/aurum_.briefs.$slug.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/routes/aurum_.briefs.$slug.tsx | 45 |         publisher: { "@type": "Organization", name: "SQOOT Pure" }, |

## src/routes/aurum_.briefs.index.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/routes/aurum_.briefs.index.tsx | 16 |       { title: "Weekly Brief Archive \| AURUM by SQOOT Pure" }, |
| src/routes/aurum_.briefs.index.tsx | 18 |       { property: "og:title", content: "Weekly Brief Archive \| AURUM by SQOOT Pure" }, |

## src/routes/aurum_.notes.$slug.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/routes/aurum_.notes.$slug.tsx | 51 |           publisher: { "@type": "Organization", name: "SQOOT Pure" }, |

## src/routes/aurum_.notes.index.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/routes/aurum_.notes.index.tsx | 16 |       { title: "Daily Note Archive \| AURUM by SQOOT Pure" }, |
| src/routes/aurum_.notes.index.tsx | 18 |       { property: "og:title", content: "Daily Note Archive \| AURUM by SQOOT Pure" }, |

## src/routes/contact.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/routes/contact.tsx | 9 |       { title: "Get In Touch — SQOOT Pure" }, |
| src/routes/contact.tsx | 13 |           "Contact SQOOT Pure: email hello@sqoot.us, find us in Sugar Land, TX, or follow us on Facebook, Instagram, LinkedIn and X.", |
| src/routes/contact.tsx | 15 |       { property: "og:title", content: "Get In Touch — SQOOT Pure" }, |
| src/routes/contact.tsx | 18 |         content: "Email hello@sqoot.us, find us in Sugar Land, TX, or follow SQOOT Pure on social.", |
| src/routes/contact.tsx | 30 |     value: "hello@sqoot.us", |
| src/routes/contact.tsx | 31 |     href: "mailto:hello@sqoot.us", |
| src/routes/contact.tsx | 36 |     value: "sqootpure.com", |
| src/routes/contact.tsx | 37 |     href: "https://sqootpure.com", |
| src/routes/contact.tsx | 42 |     value: "aurum.sqootpure.com", |
| src/routes/contact.tsx | 43 |     href: "https://aurum.sqootpure.com", |
| src/routes/contact.tsx | 48 |     value: "SQOOT PURE, Sugar Land TX 77478", |
| src/routes/contact.tsx | 55 |   { Icon: Instagram, label: "Instagram", href: "https://www.instagram.com/sqootpure/", handle: "instagram/sqootpure" }, |
| src/routes/contact.tsx | 56 |   { Icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/sqootpure", handle: "linkedin/sqootpure" }, |
| src/routes/contact.tsx | 57 |   { Icon: Twitter, label: "X (Twitter)", href: "https://x.com/sqootpure", handle: "x/sqootpure" }, |
| src/routes/contact.tsx | 92 |       <section className="contact-social" aria-label="Follow SQOOT Pure"> |

## src/routes/early-access.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/routes/early-access.tsx | 7 | import sqootPureMandala from "@/assets/sqoot-pure-mandala.png.asset.json"; |
| src/routes/early-access.tsx | 12 |       { title: "Early Access — Join the Waitlist \| SQOOT Pure" }, |
| src/routes/early-access.tsx | 16 |           "Join the SQOOT Pure waitlist and be notified when the app launches. Real physical gold from US$25, with secure storage and delivery options.", |
| src/routes/early-access.tsx | 18 |       { property: "og:title", content: "Early Access — Join the Waitlist \| SQOOT Pure" }, |
| src/routes/early-access.tsx | 22 |           "Be first in line. Join the SQOOT Pure waitlist and be notified when the app launches.", |
| src/routes/early-access.tsx | 56 |   { Icon: Smartphone, text: "Manage your holding through the SQOOT Pure app" }, |
| src/routes/early-access.tsx | 61 |     q: "Is SQOOT Pure available now?", |
| src/routes/early-access.tsx | 62 |     a: "Not yet. SQOOT Pure is currently in pre-launch. Joining the waitlist is the best way to be notified as soon as the app becomes available.", |
| src/routes/early-access.tsx | 77 |     q: "How will SQOOT Pure protect my information?", |
| src/routes/early-access.tsx | 118 |             src={sqootPureMandala.url} |
| src/routes/early-access.tsx | 130 |                 Join the SQOOT Pure waitlist and be notified when the app launches. |
| src/routes/early-access.tsx | 145 |                     Thank you for joining the SQOOT Pure waitlist. We’ll let you know when access |
| src/routes/early-access.tsx | 211 |                 <img src={sqootPureMandala.url} alt="" className="h-16 w-16 object-contain" /> |
| src/routes/early-access.tsx | 254 |               <Eyebrow>Why SQOOT Pure</Eyebrow> |

## src/routes/fractional-gold.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/routes/fractional-gold.tsx | 17 | import comparisonImage from "@/assets/sqoot-pure-product-comparison.png.asset.json"; |
| src/routes/fractional-gold.tsx | 18 | import sqootPureMandala from "@/assets/sqoot-pure-mandala.png.asset.json"; |
| src/routes/fractional-gold.tsx | 32 |       { title: "Fractional Gold \| SQOOT Pure" }, |
| src/routes/fractional-gold.tsx | 37 |       { property: "og:title", content: "Fractional Gold \| SQOOT Pure" }, |
| src/routes/fractional-gold.tsx | 46 |       { name: "twitter:title", content: "Fractional Gold \| SQOOT Pure" }, |
| src/routes/fractional-gold.tsx | 69 |       "SQOOT Pure is currently in pre-launch. You will be prompted to set up a transactional account after launch.", |
| src/routes/fractional-gold.tsx | 83 |       "Choose an amount that suits you, starting from US$25. SQOOT Pure is still pre-launch, so gold purchases are not available yet.", |
| src/routes/fractional-gold.tsx | 105 |     "SQOOT Pure keeps fees simple and transparent. You'll always see the applicable fees before confirming a transaction. For fractional gold ownership, the current fees are: Purchase fee: 3.00% of the amount purchased (US$3 per US$100), charged when you purchase gold. Storage and insurance: free for your first 12 months, then 0.45% of the value of your vaulted gold per year, charged pro-rata for the exact days held. Insurance is included — there is no separate insurance charge. A minimum storage fee of US$3.00 per year applies after your first 12 months. There are no hidden fees. Any applicable charges will be clearly disclosed before you complete a transaction. Fees may change from time to time. Please refer to our Fee Schedule for the current fees and full terms." |
| src/routes/fractional-gold.tsx | 117 |     "You are buying in physical gold held through Sqoot's custody arrangement. It is not an ETF, cryptocurrency, or digital token." |
| src/routes/fractional-gold.tsx | 121 |     "No. They are separate products. Vaulted gold is a fractional interest in physical gold held through Sqoot's custody arrangement. A physical coin is a specific retail product bought through a separate checkout and shipped to an eligible address. At launch, you will not be able to use your vaulted gold toward a coin for delivery." |
| src/routes/fractional-gold.tsx | 129 |     "Yes. Sqoot is built around real physical gold held in professional vault storage, not cryptocurrency, a digital token, or an ETF. Full ownership and custody details will be published before launch." |
| src/routes/fractional-gold.tsx | 132 |     "Is Sqoot an ETF, cryptocurrency, or digital token?", |
| src/routes/fractional-gold.tsx | 133 |     "No. Sqoot is being designed around real physical gold, not an ETF, cryptocurrency, or digital token. We will publish the precise ownership and custody structure before customers can buy." |
| src/routes/fractional-gold.tsx | 137 |     "Sqoot's gold is sourced from established precious-metals wholesalers that apply OECD-aligned due diligence to their suppliers, prohibit sourcing connected to conflict or serious human-rights abuses, and review their precious-metals supply chains annually." |
| src/routes/fractional-gold.tsx | 141 |     "No. Gold prices can rise or fall, and you may receive less when you sell than you paid. Fees and the difference between buy and sell prices can also affect your return. Sqoot does not provide investment, legal, or tax advice." |
| src/routes/fractional-gold.tsx | 158 |       src={sqootPureMandala.url} |
| src/routes/fractional-gold.tsx | 234 |         imageAlt="SQOOT Pure gold bars and a coin arranged on a deep green velvet tray over marble" |
| src/routes/fractional-gold.tsx | 259 |             {/* JBT — SQOOT Pure industry membership */} |
| src/routes/fractional-gold.tsx | 284 |             {/* NCBA — SQOOT Pure industry membership */} |
| src/routes/fractional-gold.tsx | 376 |               SQOOT Pure brings this established behaviour into a modern fractional-purchase experience. Build a vaulted precious-metal balance through purchases that fit your budget, without waiting until you can afford an entire coin or bar. |
| src/routes/fractional-gold.tsx | 493 |           <div className="relative my-10 min-h-[280px] lg:my-0"><img src={comparisonImage.url} alt="SQOOT PURE green suede box, gold bar, display card, flowers and velvet cloth" width={1540} height={1021} loading="lazy" decoding="async" className="h-full w-full rounded-lg object-cover object-center shadow-xl" /></div> |
| src/routes/fractional-gold.tsx | 494 |           <div className="lg:pl-8"><h2 className="section-title text-background">With SQOOT Pure,<br /><em className="comparison-emphasis text-gold">buy</em> only what<br />you want.</h2><List items={["Start with $25", "Buy or sell any amount", "Stored, insured and managed for you"]} /></div> |

## src/routes/gifting-old-ver.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/routes/gifting-old-ver.tsx | 17 |       { title: "Gifting — Give Fine Gold \| SQOOT Pure" }, |
| src/routes/gifting-old-ver.tsx | 23 |       { property: "og:title", content: "Gifting — Give Fine Gold \| SQOOT Pure" }, |
| src/routes/gifting-old-ver.tsx | 176 |                 SQOOT Pure gold gifts are fine gold, secure, and made to be remembered. Perfect for weddings, new beginnings, achievements, and the people who matter most. |
| src/routes/gifting-old-ver.tsx | 252 |             From joyous occasions to life&apos;s biggest milestones,{"\n"}SQOOT Pure makes gifting gold simple, meaningful, and memorable. |
| src/routes/gifting-old-ver.tsx | 441 |               alt="Luxury smartphone and 10g SQOOT Pure gold bar on dark green velvet" |

## src/routes/gifting.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/routes/gifting.tsx | 44 | import sqootLogo from "@/assets/trunk-wordmark-for-dark.svg"; |
| src/routes/gifting.tsx | 45 | import sqootMandala from "@/assets/sqoot-mandala.png"; |
| src/routes/gifting.tsx | 52 |       { title: "Gift Fine Gold — SQOOT Pure" }, |
| src/routes/gifting.tsx | 56 |           "Celebrate life's most precious moments with fine gold, thoughtfully and beautifully delivered by SQOOT Pure.", |
| src/routes/gifting.tsx | 58 |       { property: "og:title", content: "Gift Fine Gold — SQOOT Pure" }, |
| src/routes/gifting.tsx | 348 |         imageAlt="Dark green gift box tied with bronze ribbon beside a SQOOT Pure 10g gold bar" |
| src/routes/gifting.tsx | 412 |               <p>SQOOT Pure Gift Card</p> |
| src/routes/gifting.tsx | 421 |               their journey with SQOOT Pure. |
| src/routes/gifting.tsx | 512 |           aria-label="SQOOT Pure gift card resting on green velvet with cream paper and ribbon" |
| src/routes/gifting.tsx | 532 |               src={sqootLogo} |
| src/routes/gifting.tsx | 540 |               src={sqootMandala} |
| src/routes/gifting.tsx | 581 |           alt="SQOOT Pure 10g gold bar in an ivory presentation box with forest green velvet and olive branches" |

## src/routes/home-old-ver.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/routes/home-old-ver.tsx | 10 |       { title: "SQOOT Pure — Fine Gold, Real Ownership" }, |
| src/routes/home-old-ver.tsx | 16 |       { property: "og:title", content: "SQOOT Pure — Fine Gold, Real Ownership" }, |
| src/routes/home-old-ver.tsx | 65 |             alt="SQOOT Pure gold bar resting on dark velvet and marble" |
| src/routes/home-old-ver.tsx | 69 |             <Eyebrow>SQOOT Pure</Eyebrow> |
| src/routes/home-old-ver.tsx | 126 |               SQOOT Pure is launching soon. Join the waitlist to get early access and updates. |

## src/routes/index.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/routes/index.tsx | 35 |       { title: "SQOOT Pure — Own Fine Gold, Three Ways" }, |
| src/routes/index.tsx | 41 |       { property: "og:title", content: "SQOOT Pure — Own Fine Gold, Three Ways" }, |
| src/routes/index.tsx | 89 |     backgroundAlt: "Gold coins presented in a premium SQOOT Pure gift box", |
| src/routes/index.tsx | 91 |     screenAlt: "SQOOT Pure app coin collection screen", |
| src/routes/index.tsx | 103 |     screenAlt: "SQOOT Pure app buy screen", |
| src/routes/index.tsx | 115 |     screenAlt: "SQOOT Pure app vaulted holdings screen", |
| src/routes/index.tsx | 242 |     question: "Is SQOOT Pure available now?", |
| src/routes/index.tsx | 247 |     answer: "Yes. Sqoot is built around fine physical gold held in professional vault storage, not cryptocurrency, a digital token, or an ETF. Full ownership and custody details will be published before launch.", |
| src/routes/index.tsx | 251 |     answer: "Sqoot's gold is sourced from established precious-metals wholesalers that apply OECD-aligned due diligence to their suppliers, prohibit sourcing connected to conflict or serious human-rights abuses, and review their precious-metals supply chains annually.", |
| src/routes/index.tsx | 255 |     answer: "No. Joining the waitlist is free. We will not ask you to fund an account or provide bank details while Sqoot remains in waitlist mode.", |
| src/routes/index.tsx | 258 |     question: "When will SQOOT Pure launch?", |
| src/routes/index.tsx | 263 |     answer: "Yes. Use the unsubscribe link in any marketing email. For a privacy or deletion request, contact support@getsqoot.com.", |
| src/routes/index.tsx | 367 |       <a href="mailto:support@getsqoot.com">support@getsqoot.com</a>. |
| src/routes/index.tsx | 458 |               alt="SQOOT Pure app showing My Gold vaulted gold balance" |
| src/routes/index.tsx | 473 |               Why SQOOT gold |
| src/routes/index.tsx | 541 |               <p className="home-app-eyebrow">THE SQOOT PURE APP</p> |
| src/routes/index.tsx | 698 |                 <p className="home-aurum-eyebrow">FROM AURUM · THE SQOOT PURE GOLD BOARD</p> |
| src/routes/index.tsx | 724 |                 Still unsure? Write to <a href="mailto:support@getsqoot.com">support@getsqoot.com</a>. We will never ask for a password, one-time code or bank login by email. |

## src/routes/learn.gifting-gold-guide.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/routes/learn.gifting-gold-guide.tsx | 11 |       { title: "Gifting Gold: A Guide for Weddings, Festivals, and Milestones \| SQOOT Pure" }, |
| src/routes/learn.gifting-gold-guide.tsx | 13 |       { property: "og:title", content: "Gifting Gold: A Guide for Weddings, Festivals, and Milestones \| SQOOT Pure" }, |

## src/routes/learn.how-to-buy-gold-safely.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/routes/learn.how-to-buy-gold-safely.tsx | 11 |       { title: "How to Buy Physical Gold Online Safely \| SQOOT Pure" }, |
| src/routes/learn.how-to-buy-gold-safely.tsx | 13 |       { property: "og:title", content: "How to Buy Physical Gold Online Safely \| SQOOT Pure" }, |

## src/routes/learn.index.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/routes/learn.index.tsx | 37 |       { title: "Knowledge Center — Gold Education \| SQOOT Pure" }, |
| src/routes/learn.index.tsx | 41 |           "Explore clear, trusted education on gold ownership, performance, safety and long-term value from SQOOT Pure.", |
| src/routes/learn.index.tsx | 43 |       { property: "og:title", content: "Knowledge Center — Gold Education \| SQOOT Pure" }, |
| src/routes/learn.index.tsx | 78 |     alt: "A hand holding a phone displaying the SQOOT Pure My Vault interface", |
| src/routes/learn.index.tsx | 88 |     alt: "SQOOT Pure 10g fine gold bar with engraved emblem", |
| src/routes/learn.index.tsx | 389 |               alt="Dark green SQOOT Pure Buying Gold Safely guide" |
| src/routes/learn.index.tsx | 429 |               alt="SQOOT Pure 10g gold bar, two emblem coins and stacked bullion" |

## src/routes/learn.physical-gold-vs-gold-etf.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/routes/learn.physical-gold-vs-gold-etf.tsx | 11 |       { title: "Physical Gold vs Gold ETF: What You Actually Own \| SQOOT Pure" }, |
| src/routes/learn.physical-gold-vs-gold-etf.tsx | 13 |       { property: "og:title", content: "Physical Gold vs Gold ETF: What You Actually Own \| SQOOT Pure" }, |

## src/routes/partner-terms.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/routes/partner-terms.tsx | 7 |       { title: "Partner Program Terms — SQOOT Pure" }, |
| src/routes/partner-terms.tsx | 8 |       { name: "description", content: "SQOOT Pure Partner Program Terms." }, |
| src/routes/partner-terms.tsx | 9 |       { property: "og:title", content: "Partner Program Terms — SQOOT Pure" }, |
| src/routes/partner-terms.tsx | 10 |       { property: "og:description", content: "SQOOT Pure Partner Program Terms." }, |

## src/routes/partners.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/routes/partners.tsx | 11 |       { title: "Partners — SQOOT Pure" }, |
| src/routes/partners.tsx | 17 |       { property: "og:title", content: "Partners — SQOOT Pure" }, |
| src/routes/partners.tsx | 20 |         content: "Fine gold for your clients. Simple to introduce. Apply to the SQOOT Pure partner program.", |
| src/routes/partners.tsx | 47 |   ["Introduce clients", "Clients open their own accounts, complete identity verification and buy directly through SQOOT Pure."], |
| src/routes/partners.tsx | 110 |         body="SQOOT Pure gives your clients a simple way to buy fine physical gold, from $25 to larger holdings. Each client's gold balance is fully backed in the vault, priced using live gold prices, and available to sell when they choose. Apply to become a partner and, if approved, earn referral rewards for eligible clients you introduce." |
| src/routes/partners.tsx | 158 |           <p className="pt-note">Partners never collect, hold or transmit client money. Clients buy, hold and sell directly through SQOOT Pure.</p> |
| src/routes/partners.tsx | 160 |             Participation is subject to approval, Partner Terms and any required employer or firm authorization. Partners must clearly disclose their compensated relationship with SQOOT Pure whenever they share their partner link. |

## src/routes/precious-metal.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/routes/precious-metal.tsx | 17 |       { title: "Buy Physical Gold and Silver, Delivered \| SQOOT Pure" }, |
| src/routes/precious-metal.tsx | 23 |       { property: "og:title", content: "Buy Physical Gold and Silver, Delivered \| SQOOT Pure" }, |
| src/routes/precious-metal.tsx | 222 |           <p>Exact pricing and purchasing available in the SQOOT Pure app October 1.</p> |

## src/routes/pricing.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/routes/pricing.tsx | 17 | const CANONICAL_URL = "https://getsqoot.com/pricing"; |
| src/routes/pricing.tsx | 131 |       { title: "Pricing & Fees \| SQOOT Pure" }, |
| src/routes/pricing.tsx | 137 |       { property: "og:title", content: "Pricing & Fees — SQOOT Pure" }, |
| src/routes/pricing.tsx | 142 |       { name: "twitter:title", content: "Pricing & Fees — SQOOT Pure" }, |
| src/routes/pricing.tsx | 383 |             <h2 className="sr-only">Why customers trust SQOOT Pure</h2> |
| src/routes/pricing.tsx | 403 |                   <a href="mailto:support@getsqoot.com">support@getsqoot.com</a> and we will show |

## src/routes/privacy.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/routes/privacy.tsx | 7 |       { title: "Privacy Policy \| SQOOT Pure" }, |
| src/routes/privacy.tsx | 11 |           "Read the SQOOT Pure Privacy Policy to understand how we collect, use, disclose, and protect your personal information.", |
| src/routes/privacy.tsx | 13 |       { property: "og:title", content: "Privacy Policy \| SQOOT Pure" }, |
| src/routes/privacy.tsx | 17 |           "Privacy Policy for the SQOOT Pure digital gold ownership platform.", |
| src/routes/privacy.tsx | 56 |             Fortress Gold Inc. DBA Sqoot ("Sqoot Pure," "we," "us," or "our") operates the website getsqoot.com and related services. This Privacy Policy describes how we collect, use, disclose, and protect your personal information when you visit our website or use our platform. |
| src/routes/privacy.tsx | 152 |             To exercise these rights, contact us at compliance@sqoot.us. |
| src/routes/privacy.tsx | 187 |             By providing your phone number during account registration, through our website contact forms, or through our live chat, you consent to receive text messages from Sqoot Pure related to your account, including order confirmations, shipping notifications, KYC verification updates, payment receipts, and customer support responses. |
| src/routes/privacy.tsx | 200 |             We use regulated payment processors to handle all transactions — including ACH bank transfer, RTP, and wire transfer. When you initiate a payment, your bank account details are transmitted directly to our payment processor and are never stored by SQOOT Pure. We receive only the transaction confirmation and limited account details necessary to fulfill your order. |
| src/routes/privacy.tsx | 207 |             If you have questions or concerns about this Privacy Policy, please contact us through our contact form on getsqoot.com. |
| src/routes/privacy.tsx | 210 |             Fortress Gold Inc. DBA Sqoot<br /> |
| src/routes/privacy.tsx | 211 |             Website: getsqoot.com |

## src/routes/terms.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/routes/terms.tsx | 7 |       { title: "Terms of Use \| SQOOT Pure" }, |
| src/routes/terms.tsx | 11 |           "Read the SQOOT Pure Terms of Use governing access to getsqoot.com and related services operated by Fortress Gold Inc. DBA Sqoot.", |
| src/routes/terms.tsx | 13 |       { property: "og:title", content: "Terms of Use \| SQOOT Pure" }, |
| src/routes/terms.tsx | 17 |           "Terms of Use for the SQOOT Pure digital gold ownership platform.", |
| src/routes/terms.tsx | 53 |             These Terms of Use (&quot;Terms&quot;) govern your access to and use of getsqoot.com and related services (&quot;Platform&quot;) operated by Fortress Gold Inc. DBA Sqoot (&quot;Sqoot Pure,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), a Wyoming Corporation. By accessing or using the Platform, you agree to be bound by these Terms. |
| src/routes/terms.tsx | 83 |             Sqoot Pure is a digital platform for purchasing, storing, gifting, and redeeming physical gold. Gold is classified as a commodity under US law. Sqoot Pure is not a securities broker, investment advisor, bank, or money services business. We provide infrastructure for direct physical gold ownership. |
| src/routes/terms.tsx | 104 |             SQOOT Pure accepts the following payment methods: (1) ACH bank transfer up to $100,000 per transaction with same-day settlement; (2) RTP instant bank payment; and (3) wire transfer. No cash, no cards, and no cryptocurrency accepted. Payment processing is subject to identity verification and may be delayed pending AML review. SQOOT Pure reserves the right to add, modify, or remove supported payment methods with notice to users. |
| src/routes/terms.tsx | 125 |             You may redeem your SQOOT Pure gold at any time. Redemption is the process for exiting a gold position or requesting physical delivery. Depending on the redemption method available in your account, you may request an ACH cash payout based on the current live spot price, less disclosed platform and processing fees, or request physical delivery through an insured carrier. Redemption requests are subject to processing times, identity verification, available liquidity, shipping requirements, and applicable fees. |
| src/routes/terms.tsx | 132 |             Sqoot Pure Customer Care Messaging Program |
| src/routes/terms.tsx | 135 |             By providing your phone number on this Platform, you consent to receive text messages from Sqoot Pure for customer care purposes, including: order confirmations and status updates, shipping and delivery notifications, KYC verification updates, payment receipts and transaction alerts, customer support responses. |
| src/routes/terms.tsx | 161 |             All content on getsqoot.com, including text, graphics, logos, and software, is the property of Fortress Gold Inc. DBA Sqoot and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our written permission. |
| src/routes/terms.tsx | 168 |             To the maximum extent permitted by law, Sqoot Pure shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform. Our total liability shall not exceed the amount you paid to us in the twelve months preceding the claim. |
| src/routes/terms.tsx | 196 |             Gold prices fluctuate continuously. SQOOT Pure does not guarantee that your gold will increase in value or that a redemption will return the same amount you paid. You are responsible for reviewing the live price, fees, and transaction details before confirming any purchase or redemption. |
| src/routes/terms.tsx | 203 |             All gold purchases on SQOOT Pure are final and non-refundable. By confirming a transaction, you acknowledge that no cash refund will be issued to your original payment method for any reason, including changes in gold market value after your purchase is confirmed. |
| src/routes/terms.tsx | 212 |             On SQOOT Pure, &quot;redeem&quot; is the customer exit process. It may mean receiving an ACH cash payout for your gold at the current live spot price, less disclosed fees, or requesting insured physical delivery when available. We do not treat &quot;redeem&quot; and &quot;buyback&quot; as separate customer actions. |
| src/routes/terms.tsx | 218 |             <li>Submit a redemption request from your account dashboard or by contacting hello@sqoot.us.</li> |
| src/routes/terms.tsx | 224 |             Your redemption price will reflect current market conditions. SQOOT Pure does not guarantee that the redemption value will equal or exceed your original purchase price. |
| src/routes/terms.tsx | 227 |             <strong>Platform Errors:</strong> If a verified technical error by SQOOT Pure results in a duplicate charge or incorrect transaction amount, we will investigate and issue a correction within 5 business days. Contact hello@sqoot.us with your transaction ID and a description of the issue. |
| src/routes/terms.tsx | 237 |             If you have questions about these Terms, please contact us through our contact form on getsqoot.com or call +1 (254) 455-5959 or +1 (920) 776-6863. |
| src/routes/terms.tsx | 240 |             Fortress Gold Inc. DBA Sqoot<br /> |
| src/routes/terms.tsx | 242 |             Website: getsqoot.com |

## src/routes/trust-center.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/routes/trust-center.tsx | 10 | import sqootMandala from "@/assets/sqoot-pure-mandala.png.asset.json"; |
| src/routes/trust-center.tsx | 15 |       { title: "Trust Center — SQOOT Pure Verified Gold Ownership" }, |
| src/routes/trust-center.tsx | 19 |           "Independent audits, storage fully backed in the vault and independent legal counsel: see how SQOOT Pure verifies and publishes proof of your gold ownership.", |
| src/routes/trust-center.tsx | 21 |       { property: "og:title", content: "Trust Center — SQOOT Pure Verified Gold Ownership" }, |
| src/routes/trust-center.tsx | 93 |     body: "SQOOT Pure launched in 2026. Our first biannual audit is scheduled for Q4 2026. The complete report — every page, unredacted — will be published here the day it is received from our auditor.", |
| src/routes/trust-center.tsx | 98 |     body: "Every audit SQOOT Pure has completed, in order. All reports remain permanently accessible — nothing is removed or altered after publication.", |
| src/routes/trust-center.tsx | 118 |     body: "Every six months, an independent auditor verifies every ounce of gold held for SQOOT Pure clients.", |
| src/routes/trust-center.tsx | 145 |     body: "In the event SQOOT Pure ceases operations, you do not need to rely on us to access your gold. An independent legal counsel holds your custody claim instructions and can act on your behalf directly.", |
| src/routes/trust-center.tsx | 153 |       { icon: "alert" as const, label: "Trigger:", value: "SQOOT Pure wind-down or insolvency event" }, |
| src/routes/trust-center.tsx | 160 |     disclosureLead: "Counsel name, firm, and contact details are disclosed to verified SQOOT Pure account holders upon written request. Email ", |
| src/routes/trust-center.tsx | 161 |     disclosureEmail: "support@getsqoot.com", |
| src/routes/trust-center.tsx | 169 |       body: "All gold held through SQOOT Pure is fully backed in the vault and is not co-mingled with other clients' holdings or SQOOT Pure's corporate assets.", |
| src/routes/trust-center.tsx | 174 |       body: "SQOOT Pure's audit partner has no financial interest in SQOOT Pure and is engaged under a fixed-fee arrangement not contingent on audit results.", |
| src/routes/trust-center.tsx | 179 |       body: "SQOOT Pure is operated by Fortress Gold Inc. (Wyoming), a registered precious metals dealer. This Trust Center is published for transparency purposes and does not constitute a legal guarantee.", |
| src/routes/trust-center.tsx | 371 |             <img className="tc-verify-watermark" src={sqootMandala.url} alt="" aria-hidden="true" /> |
| src/routes/trust-center.tsx | 374 |                 <img src={sqootMandala.url} alt="" aria-hidden="true" /> |
| src/routes/trust-center.tsx | 509 |               <GoldButton className="mt-[calc(22*var(--u))]" href="mailto:support@getsqoot.com?subject=Legal%20Counsel%20Details%20Request"> |
| src/routes/trust-center.tsx | 536 |                 <a href="mailto:support@getsqoot.com">{TC.protection.disclosureEmail}</a> |

## src/routes/vault.tsx

| File path | Line | Exact current text |
|---|---|---|
| src/routes/vault.tsx | 34 |       { title: "Vaulted Gold, Fully Backed in the Vault \| SQOOT Pure" }, |
| src/routes/vault.tsx | 40 |       { property: "og:title", content: "Vaulted Gold, Fully Backed in the Vault \| SQOOT Pure" }, |
| src/routes/vault.tsx | 55 |   ["What happens if SQOOT disappears?", "Your metal is held at IDS, fully backed in the vault, not on our balance sheet, and remains yours."], |
| src/routes/vault.tsx | 273 |                   <span className="eyebrow text-[11px] text-[#F8F5F1]">SQOOT Record</span> |
| src/routes/vault.tsx | 431 |                   "Available to all SQOOT Pure clients", |
| src/routes/vault.tsx | 598 |                 alt="Laptop showing a SQOOT Pure vault record dashboard" |

## src/test/global-setup.ts

| File path | Line | Exact current text |
|---|---|---|
| src/test/global-setup.ts | 10 | const ENV_FILE = "/tmp/sqoot-test-db/env.json"; |
| src/test/global-setup.ts | 15 |   const reuse = process.env["SQOOT_TEST_DB_REUSE"] === "1" && existsSync(ENV_FILE); |
| src/test/global-setup.ts | 20 |   process.env["SQOOT_TEST_SUPABASE_URL"] = env.supabaseUrl; |
| src/test/global-setup.ts | 23 |     if (process.env["SQOOT_TEST_DB_REUSE"] === "1") return; |

## src/test/setup-isolated.ts

| File path | Line | Exact current text |
|---|---|---|
| src/test/setup-isolated.ts | 10 | const env = JSON.parse(readFileSync("/tmp/sqoot-test-db/env.json", "utf8")) as { |

## 1. Files whose filename contains `sqoot`

- src/assets/sqoot-mandala.png
- src/assets/sqoot-pure-hero-background.jpg.asset.json
- src/assets/sqoot-pure-logo.png
- src/assets/sqoot-pure-mandala.png.asset.json
- src/assets/sqoot-pure-product-comparison.png.asset.json

## 2. Current site metadata and font values

**Site title / default description (src/routes/__root.tsx):**
- `83:      { title: "SQOOT Pure — Fine Gold, Real Ownership" },`
- `85:        name: "description",`
- `86:        content:`
- `87:          "Start with $25 in fine gold fully backed in the vault, or buy physical gold coins. Real ownership, insured U.S. storage, redeemable on demand.",`
- `93:        content:`
- `108:        href: "https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap",`
- `110:      { rel: "icon", href: "/favicon.png", type: "image/png" },`

Title template: none — each route sets its own full title (pattern `<Page> — SQOOT Pure`); root default is `SQOOT Pure — Fine Gold, Real Ownership`.

**Favicon:**
- `src/routes/__root.tsx:110:      { rel: "icon", href: "/favicon.png", type: "image/png" },`
- file: favicon.png

**og:image per route:**
- `src/routes/pricing.tsx:139:      { property: "og:image", content: OG_IMAGE },`
- `src/routes/pricing.tsx:144:      { name: "twitter:image", content: OG_IMAGE },`
- `src/routes/fractional-gold.tsx:45:      { property: "og:image", content: OG_IMAGE },`
- `src/routes/fractional-gold.tsx:51:      { name: "twitter:image", content: OG_IMAGE },`

- `src/routes/pricing.tsx:18: const OG_IMAGE = `${SITE_ORIGIN}/og/pricing.png`;`
- `src/routes/fractional-gold.tsx:26: const OG_IMAGE = `${SITE_ORIGIN}/og/fractional-gold.png`;`
- All other routes: no og:image.

**CSS font variables (src/styles.css):**
- `29:  --font-display: "Newsreader", Georgia, serif;`
- `30:  --font-aurum-display: "Cormorant Garamond", Georgia, serif;`
- `31:  --font-number: "Geist Mono", monospace;`
- `32:  --font-money: "Geist Mono", monospace;`
- `33:  --font-sans: "Geist", Arial, sans-serif;`

**Google Fonts URL:**
- `src/routes/__root.tsx:108:        href: "https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap",`

## 3. Emails, domains and social URLs (src, public, supabase)

**Email addresses:**
- Reader@Example.com
- a@b.co
- a@example.com
- a@example.test
- admin@example.com
- adv@example.com
- ai-db-test@example.com
- archive-editor@example.com
- archive-reviewer@example.com
- buyer@example.com
- compliance@sqoot.us
- der@example.com
- editor@example.com
- gifts@example.test
- hello@sqoot.us
- hello@sqootpure.com
- name@example.com
- outsider@example.com
- reader@example.com
- recipient@example.com
- restore-editor@example.com
- restore-reviewer-two@example.com
- restore-reviewer@example.com
- return-editor@example.com
- return-reviewer@example.com
- reviewer2@example.com
- reviewer@example.com
- submit-editor@example.com
- support@getsqoot.com
- u0000Reader@Example.com
- u0007@example.com
- you@email.com
- your@email.com

**Domains (from all http(s) URLs):**
- .
- 127.0.0.1:3000
- 127.0.0.1:54331
- YOUR_URL
- a.com
- ai.gateway.lovable.dev
- api.resend.com
- app.test
- aurum.sqootpure.com
- base.invalid
- data.imf.org
- ddcnihhwnnyqebsusbbh.supabase.co
- evil.example.com
- evil.test
- example.com
- example.test
- fonts.googleapis.com
- fonts.gstatic.com
- getsqoot.com
- id-preview--abc.lovable.app
- localhost:3000
- localhost:54331
- localhost:8080
- lovable.dev
- query1.finance.yahoo.com
- schema.org
- solid-gold-gateway.lovable.app
- sqootpure.com
- stage-connect.fiztrade.com
- tests.sqoot.invalid
- www.bis.org
- www.facebook.com
- www.gold.org
- www.instagram.com
- www.jewelersboard.com
- www.lbma.org.uk
- www.linkedin.com
- www.mint.ca
- www.ncbassoc.org
- www.nist.gov
- www.pamp.com
- www.usmint.gov
- www.w3.org
- x
- x.com

**Social URLs:**
- https://www.facebook.com/people/Sqoot-Pure/61586363577228/
- https://www.facebook.com/profile.php?id=61586363577228
- https://www.instagram.com/accounts/login/?next=…/sqootpure/
- https://www.instagram.com/sqootpure/
- https://www.linkedin.com/company/sqootpure
- https://x.com/a
- https://x.com/sqootpure
