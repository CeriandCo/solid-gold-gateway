# TRUNK sitewide page-text replacement

## Changes
- `src/routes/home-old-ver.tsx`: three SQOOT Pure → TRUNK replacements (hero image description, eyebrow, waitlist sentence).
- `src/routes/gifting-old-ver.tsx`: three SQOOT Pure → TRUNK replacements (hero introduction, occasions introduction, packaged image description).
- Other public pages already use TRUNK; no changes were needed there.
- Layouts, images, social links, backend/payment identifiers, historical audit data and AI pipelines were not changed.

## Browser verification
Static public pages were opened at 375, 768 and 1440 CSS pixels. No controls were changed or clicked.
Dynamic CMS slug pages and authenticated admin pages were not exercised; database content was not changed.
The screenshots still show old branding printed inside existing photographs. Replacing image artwork is outside this text-only change.

Raw measured output:
```jsonl
{"route": "/", "oldText": 0, "oldAlt": 0, "title": "TRUNK \u2014 Own Fine Gold, Three Ways", "width": 375, "scrollWidth": 375}
{"route": "/about-us", "oldText": 0, "oldAlt": 0, "title": "About TRUNK \u2014 Built on Gold Expertise", "width": 375, "scrollWidth": 375}
{"route": "/aurum", "oldText": 0, "oldAlt": 0, "title": "AURUM Gold Education | TRUNK", "width": 375, "scrollWidth": 375}
{"route": "/aurum_/briefs/", "oldText": 0, "oldAlt": 0, "title": "TRUNK \u2014 Fine Gold, Real Ownership", "width": 375, "scrollWidth": 375}
{"route": "/aurum_/notes/", "oldText": 0, "oldAlt": 0, "title": "TRUNK \u2014 Fine Gold, Real Ownership", "width": 375, "scrollWidth": 375}
{"route": "/contact", "oldText": 0, "oldAlt": 0, "title": "Get In Touch \u2014 TRUNK", "width": 375, "scrollWidth": 375}
{"route": "/early-access", "oldText": 0, "oldAlt": 0, "title": "Early Access \u2014 Join the Waitlist | TRUNK", "width": 375, "scrollWidth": 375}
{"route": "/fractional-gold", "oldText": 0, "oldAlt": 0, "title": "Fractional Gold | TRUNK", "width": 375, "scrollWidth": 375}
{"route": "/gifting", "oldText": 0, "oldAlt": 0, "title": "Gift Fine Gold \u2014 TRUNK", "width": 375, "scrollWidth": 375}
{"route": "/gifting-old-ver", "oldText": 0, "oldAlt": 0, "title": "Gifting \u2014 Give Fine Gold | TRUNK", "width": 375, "scrollWidth": 375}
{"route": "/home-old-ver", "oldText": 0, "oldAlt": 0, "title": "TRUNK \u2014 Fine Gold, Real Ownership", "width": 375, "scrollWidth": 375}
{"route": "/learn", "oldText": 0, "oldAlt": 0, "title": "Knowledge Center \u2014 Gold Education | TRUNK", "width": 375, "scrollWidth": 375}
{"route": "/learn/", "oldText": 0, "oldAlt": 0, "title": "Knowledge Center \u2014 Gold Education | TRUNK", "width": 375, "scrollWidth": 375}
{"route": "/learn/gifting-gold-guide", "oldText": 0, "oldAlt": 0, "title": "Gifting Gold: A Guide for Weddings, Festivals, and Milestones | TRUNK", "width": 375, "scrollWidth": 375}
{"route": "/learn/how-to-buy-gold-safely", "oldText": 0, "oldAlt": 0, "title": "How to Buy Physical Gold Online Safely | TRUNK", "width": 375, "scrollWidth": 375}
{"route": "/learn/physical-gold-vs-gold-etf", "oldText": 0, "oldAlt": 0, "title": "Physical Gold vs Gold ETF: What You Actually Own | TRUNK", "width": 375, "scrollWidth": 375}
{"route": "/partner-terms", "oldText": 0, "oldAlt": 0, "title": "Partner Program Terms \u2014 TRUNK", "width": 375, "scrollWidth": 375}
{"route": "/partners", "oldText": 0, "oldAlt": 0, "title": "Partners \u2014 TRUNK", "width": 375, "scrollWidth": 375}
{"route": "/precious-metal", "oldText": 0, "oldAlt": 0, "title": "Buy Physical Gold and Silver, Delivered | TRUNK", "width": 375, "scrollWidth": 375}
{"route": "/pricing", "oldText": 0, "oldAlt": 0, "title": "Pricing & Fees | TRUNK", "width": 375, "scrollWidth": 375}
{"route": "/privacy", "oldText": 0, "oldAlt": 0, "title": "Privacy Policy | TRUNK", "width": 375, "scrollWidth": 375}
{"route": "/terms", "oldText": 0, "oldAlt": 0, "title": "Terms of Use | TRUNK", "width": 375, "scrollWidth": 375}
{"route": "/trust-center", "oldText": 0, "oldAlt": 0, "title": "Trust Center \u2014 TRUNK Verified Gold Ownership", "width": 375, "scrollWidth": 375}
{"route": "/vault", "oldText": 0, "oldAlt": 0, "title": "Vaulted Gold, Fully Backed in the Vault | TRUNK", "width": 375, "scrollWidth": 375}
{"route": "/", "oldText": 0, "oldAlt": 0, "title": "TRUNK \u2014 Own Fine Gold, Three Ways", "width": 768, "scrollWidth": 768}
{"route": "/about-us", "oldText": 0, "oldAlt": 0, "title": "About TRUNK \u2014 Built on Gold Expertise", "width": 768, "scrollWidth": 768}
{"route": "/aurum", "oldText": 0, "oldAlt": 0, "title": "AURUM Gold Education | TRUNK", "width": 768, "scrollWidth": 768}
{"route": "/aurum_/briefs/", "oldText": 0, "oldAlt": 0, "title": "TRUNK \u2014 Fine Gold, Real Ownership", "width": 768, "scrollWidth": 768}
{"route": "/aurum_/notes/", "oldText": 0, "oldAlt": 0, "title": "TRUNK \u2014 Fine Gold, Real Ownership", "width": 768, "scrollWidth": 768}
{"route": "/contact", "oldText": 0, "oldAlt": 0, "title": "Get In Touch \u2014 TRUNK", "width": 768, "scrollWidth": 768}
{"route": "/early-access", "oldText": 0, "oldAlt": 0, "title": "Early Access \u2014 Join the Waitlist | TRUNK", "width": 768, "scrollWidth": 768}
{"route": "/fractional-gold", "oldText": 0, "oldAlt": 0, "title": "Fractional Gold | TRUNK", "width": 768, "scrollWidth": 768}
{"route": "/gifting", "oldText": 0, "oldAlt": 0, "title": "Gift Fine Gold \u2014 TRUNK", "width": 768, "scrollWidth": 768}
{"route": "/gifting-old-ver", "oldText": 0, "oldAlt": 0, "title": "Gifting \u2014 Give Fine Gold | TRUNK", "width": 768, "scrollWidth": 768}
{"route": "/home-old-ver", "oldText": 0, "oldAlt": 0, "title": "TRUNK \u2014 Fine Gold, Real Ownership", "width": 768, "scrollWidth": 768}
{"route": "/learn", "oldText": 0, "oldAlt": 0, "title": "Knowledge Center \u2014 Gold Education | TRUNK", "width": 768, "scrollWidth": 768}
{"route": "/learn/", "oldText": 0, "oldAlt": 0, "title": "Knowledge Center \u2014 Gold Education | TRUNK", "width": 768, "scrollWidth": 768}
{"route": "/learn/gifting-gold-guide", "oldText": 0, "oldAlt": 0, "title": "Gifting Gold: A Guide for Weddings, Festivals, and Milestones | TRUNK", "width": 768, "scrollWidth": 768}
{"route": "/learn/how-to-buy-gold-safely", "oldText": 0, "oldAlt": 0, "title": "How to Buy Physical Gold Online Safely | TRUNK", "width": 768, "scrollWidth": 768}
{"route": "/learn/physical-gold-vs-gold-etf", "oldText": 0, "oldAlt": 0, "title": "Physical Gold vs Gold ETF: What You Actually Own | TRUNK", "width": 768, "scrollWidth": 768}
{"route": "/partner-terms", "oldText": 0, "oldAlt": 0, "title": "Partner Program Terms \u2014 TRUNK", "width": 768, "scrollWidth": 768}
{"route": "/partners", "oldText": 0, "oldAlt": 0, "title": "Partners \u2014 TRUNK", "width": 768, "scrollWidth": 768}
{"route": "/precious-metal", "oldText": 0, "oldAlt": 0, "title": "Buy Physical Gold and Silver, Delivered | TRUNK", "width": 768, "scrollWidth": 768}
{"route": "/pricing", "oldText": 0, "oldAlt": 0, "title": "Pricing & Fees | TRUNK", "width": 768, "scrollWidth": 768}
{"route": "/privacy", "oldText": 0, "oldAlt": 0, "title": "Privacy Policy | TRUNK", "width": 768, "scrollWidth": 768}
{"route": "/terms", "oldText": 0, "oldAlt": 0, "title": "Terms of Use | TRUNK", "width": 768, "scrollWidth": 768}
{"route": "/trust-center", "oldText": 0, "oldAlt": 0, "title": "Trust Center \u2014 TRUNK Verified Gold Ownership", "width": 768, "scrollWidth": 768}
{"route": "/vault", "oldText": 0, "oldAlt": 0, "title": "Vaulted Gold, Fully Backed in the Vault | TRUNK", "width": 768, "scrollWidth": 768}
{"route": "/", "oldText": 0, "oldAlt": 0, "title": "TRUNK \u2014 Own Fine Gold, Three Ways", "width": 1440, "scrollWidth": 1440}
{"route": "/about-us", "oldText": 0, "oldAlt": 0, "title": "About TRUNK \u2014 Built on Gold Expertise", "width": 1440, "scrollWidth": 1440}
{"route": "/aurum", "oldText": 0, "oldAlt": 0, "title": "AURUM Gold Education | TRUNK", "width": 1440, "scrollWidth": 1440}
{"route": "/aurum_/briefs/", "oldText": 0, "oldAlt": 0, "title": "TRUNK \u2014 Fine Gold, Real Ownership", "width": 1440, "scrollWidth": 1440}
{"route": "/aurum_/notes/", "oldText": 0, "oldAlt": 0, "title": "TRUNK \u2014 Fine Gold, Real Ownership", "width": 1440, "scrollWidth": 1440}
{"route": "/contact", "oldText": 0, "oldAlt": 0, "title": "Get In Touch \u2014 TRUNK", "width": 1440, "scrollWidth": 1440}
{"route": "/early-access", "oldText": 0, "oldAlt": 0, "title": "Early Access \u2014 Join the Waitlist | TRUNK", "width": 1440, "scrollWidth": 1440}
{"route": "/fractional-gold", "oldText": 0, "oldAlt": 0, "title": "Fractional Gold | TRUNK", "width": 1440, "scrollWidth": 1440}
{"route": "/gifting", "oldText": 0, "oldAlt": 0, "title": "Gift Fine Gold \u2014 TRUNK", "width": 1440, "scrollWidth": 1440}
{"route": "/gifting-old-ver", "oldText": 0, "oldAlt": 0, "title": "Gifting \u2014 Give Fine Gold | TRUNK", "width": 1440, "scrollWidth": 1440}
{"route": "/home-old-ver", "oldText": 0, "oldAlt": 0, "title": "TRUNK \u2014 Fine Gold, Real Ownership", "width": 1440, "scrollWidth": 1440}
{"route": "/learn", "oldText": 0, "oldAlt": 0, "title": "Knowledge Center \u2014 Gold Education | TRUNK", "width": 1440, "scrollWidth": 1440}
{"route": "/learn/", "oldText": 0, "oldAlt": 0, "title": "Knowledge Center \u2014 Gold Education | TRUNK", "width": 1440, "scrollWidth": 1440}
{"route": "/learn/gifting-gold-guide", "oldText": 0, "oldAlt": 0, "title": "Gifting Gold: A Guide for Weddings, Festivals, and Milestones | TRUNK", "width": 1440, "scrollWidth": 1440}
{"route": "/learn/how-to-buy-gold-safely", "oldText": 0, "oldAlt": 0, "title": "How to Buy Physical Gold Online Safely | TRUNK", "width": 1440, "scrollWidth": 1440}
{"route": "/learn/physical-gold-vs-gold-etf", "oldText": 0, "oldAlt": 0, "title": "Physical Gold vs Gold ETF: What You Actually Own | TRUNK", "width": 1440, "scrollWidth": 1440}
{"route": "/partner-terms", "oldText": 0, "oldAlt": 0, "title": "Partner Program Terms \u2014 TRUNK", "width": 1440, "scrollWidth": 1440}
{"route": "/partners", "oldText": 0, "oldAlt": 0, "title": "Partners \u2014 TRUNK", "width": 1440, "scrollWidth": 1440}
{"route": "/precious-metal", "oldText": 0, "oldAlt": 0, "title": "Buy Physical Gold and Silver, Delivered | TRUNK", "width": 1440, "scrollWidth": 1440}
{"route": "/pricing", "oldText": 0, "oldAlt": 0, "title": "Pricing & Fees | TRUNK", "width": 1440, "scrollWidth": 1440}
{"route": "/privacy", "oldText": 0, "oldAlt": 0, "title": "Privacy Policy | TRUNK", "width": 1440, "scrollWidth": 1440}
{"route": "/terms", "oldText": 0, "oldAlt": 0, "title": "Terms of Use | TRUNK", "width": 1440, "scrollWidth": 1440}
{"route": "/trust-center", "oldText": 0, "oldAlt": 0, "title": "Trust Center \u2014 TRUNK Verified Gold Ownership", "width": 1440, "scrollWidth": 1440}
{"route": "/vault", "oldText": 0, "oldAlt": 0, "title": "Vaulted Gold, Fully Backed in the Vault | TRUNK", "width": 1440, "scrollWidth": 1440}
```

## Gates
Automatic preview build output:
```text
=== build 2026-10-18T02:31:59Z ===
build OK

=== build 2026-10-18T02:32:23Z ===
build OK
```
Manual builds/typechecks were not run because the environment instructions prohibit them.

`bun run test` was attempted and exited 1 before test execution because isolated database setup failed. No live-write tests were enabled. Raw failure:
```text
$ vitest run
The plugin "vite-tsconfig-paths" is detected. Vite now supports tsconfig paths resolution natively via the resolve.tsconfigPaths option. You can remove the plugin and set resolve.tsconfigPaths: true in your Vite config instead.
The plugin "vite-tsconfig-paths" is detected. Vite now supports tsconfig paths resolution natively via the resolve.tsconfigPaths option. You can remove the plugin and set resolve.tsconfigPaths: true in your Vite config instead.
The plugin "vite-tsconfig-paths" is detected. Vite now supports tsconfig paths resolution natively via the resolve.tsconfigPaths option. You can remove the plugin and set resolve.tsconfigPaths: true in your Vite config instead.
[1m[30m[43m Vitest [49m[39m[22m [33mThe "isolated" project applies the same plugin multiple times: "vite-tsconfig-paths". Since Vitest 5, an inline project extends the config file that declares it by default, so the plugins from "vitest.config.ts" already apply to this project and don't need to be listed again.
Remove the duplicated plugins from the project, or set `extends: false` to not inherit the declaring config. Setting the `extends` option explicitly hides this warning.[39m
[1m[30m[43m Vitest [49m[39m[22m [33mThe "live-readonly" project applies the same plugin multiple times: "vite-tsconfig-paths". Since Vitest 5, an inline project extends the config file that declares it by default, so the plugins from "vitest.config.ts" already apply to this project and don't need to be listed again.
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
[31m[1mSerialized Error:[22m[39m [90m{ status: 1, signal: null, output: [ null, null, null ], pid: 1225, stdout: null, stderr: null }[39m



error: script "test" exited with code 1

```

Nothing was published.
