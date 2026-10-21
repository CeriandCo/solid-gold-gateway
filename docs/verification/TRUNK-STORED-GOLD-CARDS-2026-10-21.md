# TRUNK Stored and gold-card copy — 2026-10-21

## Changes
- Exact supplied homepage Stored heading/body and all six gifting text blocks.
- Removed conflicting custody wording from homepage and Terms, preserving remaining Terms wording and date.
- Updated homepage gifting feature/occasion copy, Pricing gifting FAQ and trust item, and Gifting digital-delivery/claiming copy.
- Pricing calculator presentation text now distinguishes packaging for physical purchases from digital-only gold-card gifts. Existing calculator state, calculations and payment logic unchanged.
- $50 configured purchase minimum was already correct and remains unchanged.

## Files edited
- src/routes/index.tsx
- src/routes/terms.tsx
- src/routes/pricing.tsx
- src/routes/gifting.tsx
- src/components/pricing-calculator.tsx
- roadmap.md
- docs/verification/TRUNK-STORED-GOLD-CARDS-2026-10-21.md
- Project memory updated with the standing custody/gift constraints.

No CSS, assets, backend, payments or published content changed. Nothing published.

## Browser raw output
```text
Skipping host requirements validation logic because `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS` env variable is set.
{"width": 375, "route": "/", "status": 200, "forbidden_phrases": 0, "overflow_px": 0, "exact_gift_blocks": 6, "exact_stored_body": true, "stored_heading": ["Sourced", "Stored.", "Insured", "Audited"]}
{"width": 375, "route": "/terms", "status": 200, "forbidden_phrases": 0, "overflow_px": 0}
{"minimum_raw": "The minimum is US$50.", "scroll_before": 1789, "scroll_after": 1789}
{"width": 375, "route": "/pricing", "status": 200, "forbidden_phrases": 0, "overflow_px": 0, "minimum_49_error": "The minimum is US$50.", "scroll_before": 1789, "scroll_after": 1789, "minimum_50_accepted": true}
{"width": 375, "route": "/gifting", "status": 200, "forbidden_phrases": 0, "overflow_px": 0}
{"width": 375, "page_errors": []}
{"width": 768, "route": "/", "status": 200, "forbidden_phrases": 0, "overflow_px": 0, "exact_gift_blocks": 6, "exact_stored_body": true, "stored_heading": ["Sourced", "Stored.", "Insured", "Audited"]}
{"width": 768, "route": "/terms", "status": 200, "forbidden_phrases": 0, "overflow_px": 0}
{"minimum_raw": "The minimum is US$50.", "scroll_before": 1743, "scroll_after": 1743}
{"width": 768, "route": "/pricing", "status": 200, "forbidden_phrases": 0, "overflow_px": 0, "minimum_49_error": "The minimum is US$50.", "scroll_before": 1743, "scroll_after": 1743, "minimum_50_accepted": true}
{"width": 768, "route": "/gifting", "status": 200, "forbidden_phrases": 0, "overflow_px": 0}
{"width": 768, "page_errors": []}
{"width": 1440, "route": "/", "status": 200, "forbidden_phrases": 0, "overflow_px": 0, "exact_gift_blocks": 6, "exact_stored_body": true, "stored_heading": ["Sourced", "Stored.", "Insured", "Audited"]}
{"width": 1440, "route": "/terms", "status": 200, "forbidden_phrases": 0, "overflow_px": 0}
{"minimum_raw": "The minimum is US$50.", "scroll_before": 0, "scroll_after": 0}
{"width": 1440, "route": "/pricing", "status": 200, "forbidden_phrases": 0, "overflow_px": 0, "minimum_49_error": "The minimum is US$50.", "scroll_before": 0, "scroll_after": 0, "minimum_50_accepted": true}
{"width": 1440, "route": "/gifting", "status": 200, "forbidden_phrases": 0, "overflow_px": 0}
{"width": 1440, "page_errors": []}
```

Viewed homepage gifting screenshots at 375, 768, 1440 and trust screenshots at 375, 1440. Exact copy fits with no horizontal overflow. Existing trust status chips were preserved, including “Partner named before launch.”

## Existing $50 rule test — raw output
```text

[1m[30m[46m RUN [49m[39m[22m [36mv5.0.1 [39m[90m/dev-server[39m

 [32m✓[39m src/lib/minimum-purchase.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m   Start at [22m 00:49:56
[2m   Duration [22m 132ms[2m (transform 53%, import 26%, tests 10%, worker 10%)[22m

```

## Full suite — raw output
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
[31m[1mSerialized Error:[22m[39m [90m{ status: 1, signal: null, output: [ null, null, null ], pid: 1512, stdout: null, stderr: null }[39m



error: script "test" exited with code 1
```

Full suite failed before tests executed because the isolated database stack could not start; no live database tests were run. Manual typecheck and build were not run, per platform instructions.

## Latest automatic preview build
```text
=== build 2026-10-21T00:48:01Z ===
build OK
```

## Static-copy search
Search of src/routes, src/components, src/lib/learn-articles.ts and src/config for allocated, in your name, in their name, $25 returned only non-rendered image import identifiers:
```text
src/components/aurum-learn-section.tsx:3:import allocatedImage from "@/assets/aurum/aurum-caution-2-allocated.webp.asset.json";
src/components/aurum-learn-section.tsx:14:    image: allocatedImage.url,
```
No below-$50 purchase minimum found. The $3 minimum storage fee is not a purchase minimum and was preserved. General historical/educational gifting traditions were not rewritten into TRUNK product claims.

## Limits
Database-backed editorial rows and embedded screenshot text were not audited or altered. This was presentation-only; vault location/insurance and app claiming/verification operations were not independently validated. Initial browser attempt expected “$50” instead of the existing “US$50” display; corrected the expectation and reran successfully. One network-idle timeout was avoided by waiting for document load and rendered content.
