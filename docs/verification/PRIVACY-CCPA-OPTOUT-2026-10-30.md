# Privacy + California opt-out (2026-10-30)

Files: src/routes/privacy.tsx, src/routes/do-not-sell-or-share.tsx (new), src/lib/analytics/ccpa.ts (new, exports isAdOptOut), src/lib/analytics/ccpa.test.ts (new), src/components/site-chrome.tsx.

Browser (Playwright, localhost) raw output:
```
375  title "Do Not Sell or Share | TRUNK", aria-checked=true after click, cookie trunk_ccpa_optout=1, status "Opt-out request honoured", dataLayer [{ccpa_status,false},{ccpa_status,true}], scrollWidth 375, footer link count 1
1440 same, scrollWidth 1440, footer link count 1
768 with GPC=true: toggle disabled=True, status "Opt-out request honoured. Your browser's Global Privacy Control signal is on."
```
Typecheck: passed. Unit test: blocked by isolated test DB global setup (same pre-existing failure). No sitemap.xml exists in the project, so nothing was added there; route tree regenerates automatically.
`ccpa_status` is pushed on load of the opt-out page and on change; it is not pushed on other pages.
