# Homepage ownership, punctuation and support-address update

## Implemented
- Homepage ownership cards now read fractional gold, physical coins, vault storage, using the supplied headings, descriptions and CTA labels. Corresponding original photos, phone screens and destination paths stay paired with each offering. Section link remains `/pricing#pricing-compare`.
- Naturally rewrote homepage app pricing, app summary, gifting introduction, trust heading and AURUM card excerpt to remove em dashes. Replaced homepage title separator with a colon and conditional sample labels with “Sample data, not a real price.” No AURUM page or AI pipeline change.
- Updated public support text and mailto links in home, pricing and Trust Center, plus matching link-audit expectations, to `support@trunk.gold`. Kept the Trust Center subject parameter. Other email addresses unchanged. No old-address references existed in legal pages, contact, shared footer, forms or templates.
- No layout, CSS, font, asset, checkout or pricing-logic changes. No database writes or publishing.

## Dependency review
Code review found the replaced address only in public text, mailto links and audit rules, not in detected transactional email sending/receiving integrations. Gift delivery uses Resend separately; its source does not reference the replaced support address. Credentials, DNS, sender authentication and backend email configuration were not read or modified. Hosted configuration and mailbox delivery were not verified.

## Search
Repository search excluding Git metadata, dependencies and secret environment files: zero remaining exact old-address matches. Homepage route and homepage price component search: zero em dashes. Historical content and other pages were not rewritten for punctuation. No wording required manual legal review.

## Browser
63 route/width visits across 21 public routes at 375, 768 and 1440 pixels wide. Zero old-address observations; 15 support-link observations all use the approved destination. Zero page errors. Ownership screenshots inspected at all three widths; correct image pairing and legible text. Unchanged CSS retains one-column mobile, two-column tablet, three-column desktop layout.
FAQ click scrollY before/after: 375: 12353/12353; 768: 9822/9822; 1440: 7225/7225. Mailto links read but not launched into an external email client. Existing navigation links intentionally navigate and were not tested as unchanged-scroll actions.

Raw browser output:
```jsonl
{"width": 375, "cards": [{"heading": "Own a fraction of real gold", "link": "/fractional-gold", "image": "/__l5e/assets-v1/d492bf3c-bcc0-432b-9228-ba4369884ac4/card-bg-buy-by-weight.png", "width": 335}, {"heading": "Gold coins, delivered to your door", "link": "/precious-metal", "image": "/__l5e/assets-v1/fc5317fe-f6de-4754-a903-e6270495630a/card-bg-coins-delivered-home.png", "width": 335}, {"heading": "Your gold. Securely stored.", "link": "/vault", "image": "/__l5e/assets-v1/23da1eb5-d77c-41e3-9028-afa679f06fde/card-bg-keep-it-in-the-vault.png", "width": 335}], "homepageEmDashes": 0, "scrollWidth": 375}
{"width": 375, "faqScrollBefore": 12353, "faqScrollAfter": 12353, "faqEmail": "mailto:support@trunk.gold"}
{"route": "/", "width": 375, "oldAddressCount": 0, "links": [{"text": "support@trunk.gold", "href": "mailto:support@trunk.gold"}, {"text": "support@trunk.gold", "href": "mailto:support@trunk.gold"}]}
{"route": "/about-us", "width": 375, "oldAddressCount": 0, "links": []}
{"route": "/fractional-gold", "width": 375, "oldAddressCount": 0, "links": []}
{"route": "/precious-metal", "width": 375, "oldAddressCount": 0, "links": []}
{"route": "/pricing", "width": 375, "oldAddressCount": 0, "links": [{"text": "support@trunk.gold", "href": "mailto:support@trunk.gold"}]}
{"route": "/vault", "width": 375, "oldAddressCount": 0, "links": []}
{"route": "/gifting", "width": 375, "oldAddressCount": 0, "links": []}
{"route": "/learn", "width": 375, "oldAddressCount": 0, "links": []}
{"route": "/learn/gifting-gold-guide", "width": 375, "oldAddressCount": 0, "links": []}
{"route": "/learn/how-to-buy-gold-safely", "width": 375, "oldAddressCount": 0, "links": []}
{"route": "/learn/physical-gold-vs-gold-etf", "width": 375, "oldAddressCount": 0, "links": []}
{"route": "/trust-center", "width": 375, "oldAddressCount": 0, "links": [{"text": "Request details", "href": "mailto:support@trunk.gold?subject=Legal%20Counsel%20Details%20Request"}, {"text": "support@trunk.gold", "href": "mailto:support@trunk.gold"}]}
{"route": "/aurum", "width": 375, "oldAddressCount": 0, "links": []}
{"route": "/aurum/notes", "width": 375, "oldAddressCount": 0, "links": []}
{"route": "/aurum/briefs", "width": 375, "oldAddressCount": 0, "links": []}
{"route": "/early-access", "width": 375, "oldAddressCount": 0, "links": []}
{"route": "/partners", "width": 375, "oldAddressCount": 0, "links": []}
{"route": "/partner-terms", "width": 375, "oldAddressCount": 0, "links": []}
{"route": "/contact", "width": 375, "oldAddressCount": 0, "links": []}
{"route": "/privacy", "width": 375, "oldAddressCount": 0, "links": []}
{"route": "/terms", "width": 375, "oldAddressCount": 0, "links": []}
{"width": 375, "pageErrors": []}
{"width": 768, "cards": [{"heading": "Own a fraction of real gold", "link": "/fractional-gold", "image": "/__l5e/assets-v1/d492bf3c-bcc0-432b-9228-ba4369884ac4/card-bg-buy-by-weight.png", "width": 352}, {"heading": "Gold coins, delivered to your door", "link": "/precious-metal", "image": "/__l5e/assets-v1/fc5317fe-f6de-4754-a903-e6270495630a/card-bg-coins-delivered-home.png", "width": 352}, {"heading": "Your gold. Securely stored.", "link": "/vault", "image": "/__l5e/assets-v1/23da1eb5-d77c-41e3-9028-afa679f06fde/card-bg-keep-it-in-the-vault.png", "width": 720}], "homepageEmDashes": 0, "scrollWidth": 768}
{"width": 768, "faqScrollBefore": 9822, "faqScrollAfter": 9822, "faqEmail": "mailto:support@trunk.gold"}
{"route": "/", "width": 768, "oldAddressCount": 0, "links": [{"text": "support@trunk.gold", "href": "mailto:support@trunk.gold"}, {"text": "support@trunk.gold", "href": "mailto:support@trunk.gold"}]}
{"route": "/about-us", "width": 768, "oldAddressCount": 0, "links": []}
{"route": "/fractional-gold", "width": 768, "oldAddressCount": 0, "links": []}
{"route": "/precious-metal", "width": 768, "oldAddressCount": 0, "links": []}
{"route": "/pricing", "width": 768, "oldAddressCount": 0, "links": [{"text": "support@trunk.gold", "href": "mailto:support@trunk.gold"}]}
{"route": "/vault", "width": 768, "oldAddressCount": 0, "links": []}
{"route": "/gifting", "width": 768, "oldAddressCount": 0, "links": []}
{"route": "/learn", "width": 768, "oldAddressCount": 0, "links": []}
{"route": "/learn/gifting-gold-guide", "width": 768, "oldAddressCount": 0, "links": []}
{"route": "/learn/how-to-buy-gold-safely", "width": 768, "oldAddressCount": 0, "links": []}
{"route": "/learn/physical-gold-vs-gold-etf", "width": 768, "oldAddressCount": 0, "links": []}
{"route": "/trust-center", "width": 768, "oldAddressCount": 0, "links": [{"text": "Request details", "href": "mailto:support@trunk.gold?subject=Legal%20Counsel%20Details%20Request"}, {"text": "support@trunk.gold", "href": "mailto:support@trunk.gold"}]}
{"route": "/aurum", "width": 768, "oldAddressCount": 0, "links": []}
{"route": "/aurum/notes", "width": 768, "oldAddressCount": 0, "links": []}
{"route": "/aurum/briefs", "width": 768, "oldAddressCount": 0, "links": []}
{"route": "/early-access", "width": 768, "oldAddressCount": 0, "links": []}
{"route": "/partners", "width": 768, "oldAddressCount": 0, "links": []}
{"route": "/partner-terms", "width": 768, "oldAddressCount": 0, "links": []}
{"route": "/contact", "width": 768, "oldAddressCount": 0, "links": []}
{"route": "/privacy", "width": 768, "oldAddressCount": 0, "links": []}
{"route": "/terms", "width": 768, "oldAddressCount": 0, "links": []}
{"width": 768, "pageErrors": []}
{"width": 1440, "cards": [{"heading": "Own a fraction of real gold", "link": "/fractional-gold", "image": "/__l5e/assets-v1/d492bf3c-bcc0-432b-9228-ba4369884ac4/card-bg-buy-by-weight.png", "width": 408}, {"heading": "Gold coins, delivered to your door", "link": "/precious-metal", "image": "/__l5e/assets-v1/fc5317fe-f6de-4754-a903-e6270495630a/card-bg-coins-delivered-home.png", "width": 408}, {"heading": "Your gold. Securely stored.", "link": "/vault", "image": "/__l5e/assets-v1/23da1eb5-d77c-41e3-9028-afa679f06fde/card-bg-keep-it-in-the-vault.png", "width": 408}], "homepageEmDashes": 0, "scrollWidth": 1440}
{"width": 1440, "faqScrollBefore": 7225, "faqScrollAfter": 7225, "faqEmail": "mailto:support@trunk.gold"}
{"route": "/", "width": 1440, "oldAddressCount": 0, "links": [{"text": "support@trunk.gold", "href": "mailto:support@trunk.gold"}, {"text": "support@trunk.gold", "href": "mailto:support@trunk.gold"}]}
{"route": "/about-us", "width": 1440, "oldAddressCount": 0, "links": []}
{"route": "/fractional-gold", "width": 1440, "oldAddressCount": 0, "links": []}
{"route": "/precious-metal", "width": 1440, "oldAddressCount": 0, "links": []}
{"route": "/pricing", "width": 1440, "oldAddressCount": 0, "links": [{"text": "support@trunk.gold", "href": "mailto:support@trunk.gold"}]}
{"route": "/vault", "width": 1440, "oldAddressCount": 0, "links": []}
{"route": "/gifting", "width": 1440, "oldAddressCount": 0, "links": []}
{"route": "/learn", "width": 1440, "oldAddressCount": 0, "links": []}
{"route": "/learn/gifting-gold-guide", "width": 1440, "oldAddressCount": 0, "links": []}
{"route": "/learn/how-to-buy-gold-safely", "width": 1440, "oldAddressCount": 0, "links": []}
{"route": "/learn/physical-gold-vs-gold-etf", "width": 1440, "oldAddressCount": 0, "links": []}
{"route": "/trust-center", "width": 1440, "oldAddressCount": 0, "links": [{"text": "Request details", "href": "mailto:support@trunk.gold?subject=Legal%20Counsel%20Details%20Request"}, {"text": "support@trunk.gold", "href": "mailto:support@trunk.gold"}]}
{"route": "/aurum", "width": 1440, "oldAddressCount": 0, "links": []}
{"route": "/aurum/notes", "width": 1440, "oldAddressCount": 0, "links": []}
{"route": "/aurum/briefs", "width": 1440, "oldAddressCount": 0, "links": []}
{"route": "/early-access", "width": 1440, "oldAddressCount": 0, "links": []}
{"route": "/partners", "width": 1440, "oldAddressCount": 0, "links": []}
{"route": "/partner-terms", "width": 1440, "oldAddressCount": 0, "links": []}
{"route": "/contact", "width": 1440, "oldAddressCount": 0, "links": []}
{"route": "/privacy", "width": 1440, "oldAddressCount": 0, "links": []}
{"route": "/terms", "width": 1440, "oldAddressCount": 0, "links": []}
{"width": 1440, "pageErrors": []}
```

## Validation
Automatic preview validation:
```text
=== build 2026-10-19T01:49:12Z ===
build OK
```
`bun run test` failed before test execution during isolated test-database startup:
```text
$ vitest run
The plugin "vite-tsconfig-paths" is detected. Vite now supports tsconfig paths resolution natively via the resolve.tsconfigPaths option. You can remove the plugin and set resolve.tsconfigPaths: true in your Vite config instead.
The plugin "vite-tsconfig-paths" is detected. Vite now supports tsconfig paths resolution natively via the resolve.tsconfigPaths option. You can remove the plugin and set resolve.tsconfigPaths: true in your Vite config instead.
The plugin "vite-tsconfig-paths" is detected. Vite now supports tsconfig paths resolution natively via the resolve.tsconfigPaths option. You can remove the plugin and set resolve.tsconfigPaths: true in your Vite config instead.
[1m[30m[43m Vitest [49m[39m[22m [33mThe "live-readonly" project applies the same plugin multiple times: "vite-tsconfig-paths". Since Vitest 5, an inline project extends the config file that declares it by default, so the plugins from "vitest.config.ts" already apply to this project and don't need to be listed again.
Remove the duplicated plugins from the project, or set `extends: false` to not inherit the declaring config. Setting the `extends` option explicitly hides this warning.[39m
[1m[30m[43m Vitest [49m[39m[22m [33mThe "isolated" project applies the same plugin multiple times: "vite-tsconfig-paths". Since Vitest 5, an inline project extends the config file that declares it by default, so the plugins from "vitest.config.ts" already apply to this project and don't need to be listed again.
Remove the duplicated plugins from the project, or set `extends: false` to not inherit the declaring config. Setting the `extends` option explicitly hides this warning.[39m

[1m[30m[46m RUN [49m[39m[22m [36mv5.0.1 [39m[90m/dev-server[39m

[31mNo test files found, exiting with code 1
[39m

[30m[46m isolated [49m[39m 

[2minclude: [22m[33msrc/**/*.test.ts[2m, [22msrc/**/*.test.tsx[39m
[2mexclude:  [22m[33m**/node_modules/**[2m, [22msrc/lib/security/function-privileges.test.ts[2m, [22msrc/lib/admin-password.server.test.ts[2m, [22msrc/lib/security/rest-surface.test.ts[39m

[30m[46m live-readonly [49m[39m 

[2minclude: [22m[33msrc/lib/security/function-privileges.test.ts[39m
[2mexclude:  [22m[33m**/node_modules/**[2m, [22m**/.git/**[39m


[31m⎯⎯⎯⎯⎯⎯[39m[1m[41m Unhandled Error [49m[22m[31m⎯⎯⎯⎯⎯⎯⎯[39m
[31m[1mError[22m: Command failed: bash /dev-server/scripts/test-db/up.sh[39m
[90m [2m❯[22m genericNodeError node:internal/errors:[2m983:15[22m[39m
[90m [2m❯[22m wrappedFn node:internal/errors:[2m537:14[22m[39m
[90m [2m❯[22m checkExecSyncError node:child_process:[2m916:11[22m[39m
[90m [2m❯[22m execFileSync node:child_process:[2m952:15[22m[39m
[90m [2m❯[22m Object.setup src/test/global-setup.ts:[2m17:5[22m[39m
[90m [2m❯[22m TestProject._initializeGlobalSetup ../persist/node_modules/vitest/dist/chunks/index.DzobfTyw.js:[2m12113:50[22m[39m
[90m [2m❯[22m Vitest.initializeGlobalSetup ../persist/node_modules/vitest/dist/chunks/index.DzobfTyw.js:[2m21212:35[22m[39m
[90m [2m❯[22m ../persist/node_modules/vitest/dist/chunks/index.DzobfTyw.js:[2m21052:6[22m[39m
[90m [2m❯[22m ../persist/node_modules/vitest/dist/chunks/index.DzobfTyw.js:[2m21081:11[22m[39m
[90m [2m❯[22m ../persist/node_modules/vitest/dist/chunks/index.DzobfTyw.js:[2m20943:19[22m[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[22m[39m
[31m[1mSerialized Error:[22m[39m [90m{ status: 1, signal: null, output: [ null, null, null ], pid: 2460, stdout: null, stderr: null }[39m



error: script "test" exited with code 1
```
Manual typecheck/build commands were not run because the environment requires automatic preview validation. Full suite remains unverified. No copy/styling snapshot tests added.
