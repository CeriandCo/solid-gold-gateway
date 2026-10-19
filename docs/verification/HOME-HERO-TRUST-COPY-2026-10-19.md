# Homepage hero and trust-strip copy — October 19, 2026

## Scope
Copy-only changes in `src/routes/index.tsx`: hero eyebrow and supporting paragraph; first trust-strip heading and all four descriptions. The three-line headline, remaining headings, CTA labels/destinations, markup, classes, images and all other homepage sections were preserved. No database writes or publishing.

## Browser verification
Real Chromium visits at 375, 768 and 1440 pixels wide, 1800 pixels high. Screenshots inspected at each width: copy legible, no horizontal page overflow; existing two-column mobile/tablet and four-column desktop arrangements retained. The mobile strip wraps into narrow text columns under the unchanged design.

Raw measured output:
```jsonl
{"width": 375, "scrollWidth": 375, "eyebrow": "REAL GOLD. ANY AMOUNT.", "headline": "Own gold\nthe way it was\nmeant to be.", "body": "You don't need to buy a whole bar to own real gold. With TRUNK, start with a fraction, add to your holdings whenever you like, and keep your gold securely stored in an insured vault.", "proof": ["01\nReal gold. Any amount.\n\nOwn a fraction of real, physical gold. No need to buy a whole bar.", "02\nHeld in your name\n\nYour gold holdings are allocated to you and clearly documented.", "03\nPriced live\n\nSee the spot price and premiums before you confirm.", "04\nDeliver or sell back\n\nChoose physical delivery where eligible, or sell through the app."], "links": [{"text": "Join the waitlist", "href": "#cta"}, {"text": "How it works", "href": "#how-it-works"}], "columns": "164px 171px"}
{"width": 768, "scrollWidth": 768, "eyebrow": "REAL GOLD. ANY AMOUNT.", "headline": "Own gold\nthe way it was\nmeant to be.", "body": "You don't need to buy a whole bar to own real gold. With TRUNK, start with a fraction, add to your holdings whenever you like, and keep your gold securely stored in an insured vault.", "proof": ["01\nReal gold. Any amount.\n\nOwn a fraction of real, physical gold. No need to buy a whole bar.", "02\nHeld in your name\n\nYour gold holdings are allocated to you and clearly documented.", "03\nPriced live\n\nSee the spot price and premiums before you confirm.", "04\nDeliver or sell back\n\nChoose physical delivery where eligible, or sell through the app."], "links": [{"text": "Join the waitlist", "href": "#cta"}, {"text": "How it works", "href": "#how-it-works"}], "columns": "360px 360px"}
{"width": 1440, "scrollWidth": 1440, "eyebrow": "REAL GOLD. ANY AMOUNT.", "headline": "Own gold\nthe way it was\nmeant to be.", "body": "You don't need to buy a whole bar to own real gold. With TRUNK, start with a fraction, add to your holdings whenever you like, and keep your gold securely stored in an insured vault.", "proof": ["01\nReal gold. Any amount.\n\nOwn a fraction of real, physical gold. No need to buy a whole bar.", "02\nHeld in your name\n\nYour gold holdings are allocated to you and clearly documented.", "03\nPriced live\n\nSee the spot price and premiums before you confirm.", "04\nDeliver or sell back\n\nChoose physical delivery where eligible, or sell through the app."], "links": [{"text": "Join the waitlist", "href": "#cta"}, {"text": "How it works", "href": "#how-it-works"}], "columns": "314px 314px 314px 314px"}
```

CTA destinations were read, not clicked: these existing anchors intentionally scroll to other sections, so no unchanged-scroll claim is made. No new interactive controls were introduced.

## Validation
Automatic preview validation:
```text
=== build 2026-10-19T01:43:46Z ===
build OK
```

`bun run test` exited 1 before test execution during isolated test-database startup. Raw output:
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
[31m[1mSerialized Error:[22m[39m [90m{ status: 1, signal: null, output: [ null, null, null ], pid: 1176, stdout: null, stderr: null }[39m



error: script "test" exited with code 1
```

Manual typecheck and build were not run: the environment instructs agents to rely on automatic preview validation rather than manually invoke them. Full test-suite success remains unverified. No copy/style snapshot tests added.
