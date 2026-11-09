# AURUM MELT opt-in — 2026-11-09

## Changes
- Activated approved consent version `melt-2026-11-09` with the exact requested text. The loader still returns the authoritative projection and the server refuses missing/stale consent.
- Replaced only the subscribe CTA with a required email form, the existing primary/hero GoldButton and arrow, desktop-inline/mobile-stacked layout, in-flight guard, specified success/error messages, linked Privacy Policy, and secondary community link. Null consent hides the form.
- Preserved newsletter validation, 5/15-minute and 20/day rate limits, server-owned consent evidence, and atomic preferences/consent upsert.
- Added `environment`, `cio_status`, `cio_attempts`, `cio_sent_at` through `0029_newsletter_customerio_delivery.sql`. Existing rows default to non-production/skipped; no historical bulk delivery. Existing RLS/grants unchanged; no new SQL functions.
- Extracted the existing lead delivery helper to `src/lib/leads/delivery.server.ts`, unchanged claim/status logic. Waitlist/partner limits, payloads, insert-once behavior and host gates unchanged.
- Newsletter only invokes delivery on `isLiveHost(origin, host)` (trunk.gold/www.trunk.gold). The sender remains the US `https://track.customer.io/api/v1` helper. Preview/lovable.app/localhost save without sending. The consent upsert omits delivery status/attempts/sent time, preserving a sent or in-flight claim. New rows start skipped and are claimed directly to sending by the same lead logic. Failed deliveries can retry on resubmission; no scheduled retry added.
- `melt_subscribed` identify attributes: `created_at`, `melt_consent_version`. Event data: `email`, `date_joined`, `source: aurum_melt`, `consent_version`. Dates derive from stored creation time in Unix seconds. Only Customer.io receives the requested email; no browser analytics change. No email, payload, keys or provider bodies logged.

## Files
`src/components/aurum-subscribe-section.tsx`, `src/styles.css`, `src/lib/newsletter/consent.server.ts`, `src/lib/newsletter/signup.server.ts`, `src/lib/leads/delivery.server.ts`, `src/lib/leads/leads.server.ts`, four adjusted newsletter test files, new `src/lib/newsletter/customerio-signup.server.test.ts`, generated migration/history/types files, `AGENTS.md`, `roadmap.md`, and this report.

## Database schema verification (read-only query)
```text
[map[column_default:0 column_name:cio_attempts data_type:integer is_nullable:NO] map[column_default:<nil> column_name:cio_sent_at data_type:timestamp with time zone is_nullable:YES] map[column_default:'skipped'::text column_name:cio_status data_type:text is_nullable:NO] map[column_default:'non_production'::text column_name:environment data_type:text is_nullable:NO]]
```

## Focused tests — mocked storage/network only
Command: `bunx vitest run --config /tmp/melt-verification/vitest.config.mjs --configLoader runner`. Temporary config selects the new delivery tests, existing form-state tests and existing leads Customer.io sender tests. No real provider calls or database writes. Tests cover exact event name/keys/Unix values, approved version, non-live suppression, sequential and concurrent dedupe, failure/retry, lookup failure, and null-consent refusal.
```text

[1m[30m[46m RUN [49m[39m[22m [36mv5.0.1 [39m[90m/dev-server[39m

 [32m✓[39m src/lib/newsletter/form-state.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 6[2mms[22m[39m
[90mstderr[2m | src/lib/leads/customerio.server.test.ts[2m > [22m[2mCustomer.io sender[2m > [22m[2mfails soft (returns false, never throws) when Customer.io is down
[22m[39m[customerio] request error

[90mstderr[2m | src/lib/leads/customerio.server.test.ts[2m > [22m[2mCustomer.io sender[2m > [22m[2mfails soft (returns false, never throws) when Customer.io is down
[22m[39m[customerio] identify failed (500)

 [32m✓[39m src/lib/leads/customerio.server.test.ts [2m([22m[2m5 tests[22m[2m)[22m[32m 38[2mms[22m[39m
[90mstderr[2m | src/lib/newsletter/customerio-signup.server.test.ts[2m > [22m[2mMELT Customer.io delivery[2m > [22m[2mkeeps signup successful if delivery lookup throws
[22m[39m[newsletter] signup refused: customerio delivery lookup failed

[90mstderr[2m | src/lib/newsletter/customerio-signup.server.test.ts[2m > [22m[2mMELT Customer.io delivery[2m > [22m[2mfails closed with unavailable consent
[22m[39m[newsletter] signup refused: consent configuration missing

 [32m✓[39m src/lib/newsletter/customerio-signup.server.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 18[2mms[22m[39m

[2m Test Files [22m [1m[32m3 passed[39m[22m[90m (3)[39m
[2m      Tests [22m [1m[32m29 passed[39m[22m[90m (29)[39m
[2m   Start at [22m 13:47:49
[2m   Duration [22m 229ms[2m (transform 53%, import 22%, tests 21%, worker 3%)[22m

```

## Requested newsletter + leads suites
Command: `bunx vitest run src/lib/newsletter src/lib/leads`. Blocked before tests execute by the existing throwaway database startup failure. Isolation was not bypassed.
```text
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
[2mfilter: [22m[33msrc/lib/newsletter[2m, [22msrc/lib/leads[39m

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
[31m[1mSerialized Error:[22m[39m [90m{ status: 1, signal: null, output: [ null, null, null ], pid: 4380, stdout: null, stderr: null }[39m



```

## Full test gate
Command: `bun run test`; also blocked before tests execute:
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
[31m[1mSerialized Error:[22m[39m [90m{ status: 1, signal: null, output: [ null, null, null ], pid: 4588, stdout: null, stderr: null }[39m



error: script "test" exited with code 1
```

## Browser verification
Real Chromium at 375/768/1440 on localhost `/aurum#subscribe`. All POST server-function requests were aborted to comply with the standing prohibition on live database writes from tests (preview shares that database). The actual rendered form, exact consent, links, arrow and sizing were checked; screenshots reviewed at mobile and desktop. Error submission retained input and scrollY stayed unchanged. This verifies the unavailable path, not a stored-success flow. Raw measurements:
```text
Skipping host requirements validation logic because `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS` env variable is set.
{"width": 375, "overflow": 0, "input": {"x": 20, "y": 380.9375, "width": 335, "height": 54}, "button": {"x": 20, "y": 446.9375, "width": 335, "height": 54}, "consent": "By subscribing, you agree to receive The MELT newsletter and related emails from TRUNK. You can unsubscribe anytime. See our Privacy Policy.", "privacy": "/privacy", "community": "https://aurum-be0064.circle.so/"}
{"width": 375, "blocked_post_scroll_before": 10074, "scroll_after": 10074, "error": "Something went wrong. Please try again.", "input_retained": "reader@example.com"}
{"width": 768, "overflow": 0, "input": {"x": 24, "y": 808.984375, "width": 508, "height": 54}, "button": {"x": 544, "y": 808.984375, "width": 200, "height": 54}, "consent": "By subscribing, you agree to receive The MELT newsletter and related emails from TRUNK. You can unsubscribe anytime. See our Privacy Policy.", "privacy": "/privacy", "community": "https://aurum-be0064.circle.so/"}
{"width": 768, "blocked_post_scroll_before": 8610, "scroll_after": 8610, "error": "Something went wrong. Please try again.", "input_retained": "reader@example.com"}
{"width": 1440, "overflow": 0, "input": {"x": 92, "y": 1101.703125, "width": 461.734375, "height": 54}, "button": {"x": 565.734375, "y": 1101.703125, "width": 200, "height": 54}, "consent": "By subscribing, you agree to receive The MELT newsletter and related emails from TRUNK. You can unsubscribe anytime. See our Privacy Policy.", "privacy": "/privacy", "community": "https://aurum-be0064.circle.so/"}
{"width": 1440, "blocked_post_scroll_before": 5479, "scroll_after": 5479, "error": "Something went wrong. Please try again.", "input_retained": "reader@example.com"}
```

## Automatic preview validation
The harness runs typechecking/builds; no manual build/typecheck was run, following the environment instruction. Latest observed output:
```text
=== build 2026-11-09T13:47:43Z ===
build OK
```
`git diff --check` exited 0.

## Not verified / limitations
- Full newsletter/leads database suites and full test gate cannot pass until isolated database startup works. The new mocked tests are not evidence of real database concurrency.
- End-to-end persisted signup, success UI and a real Customer.io event are not verified. We did not submit to the shared live database, call Customer.io with real credentials, or publish. Provider credentials/current delivery health remain unverified.
- Same existing claim logic intentionally retained: a worker interruption can leave sending stuck; a remotely accepted event whose response is lost could be duplicated on a failed-row retry. This is not an exactly-once remote transaction.
- Schema is applied to Lovable Cloud now; changed website code remains unpublished.

## Client verification after publishing
On `https://trunk.gold/aurum#subscribe`, subscribe with a new address you control. In Customer.io workspace Trunk, find the matching person and inspect Activity/Profile activity for `melt_subscribed`; inspect `date_joined`, `source`, `consent_version` and identify attribute `melt_consent_version`. Resubmit the same address and confirm no second successful event. A thank-you confirms local persistence only, not provider delivery; if absent, inspect stored delivery status/attempt count and coded server logs. Preview must not create Customer.io events.

## Tight follow-up verification — 13:49 UTC

The approved implementation was already committed; no application changes were needed. Reran requested suites: isolated database startup still blocks the full newsletter/leads suites. Reran focused database-free newsletter/leads unit tests: 29 passed. Rechecked actual browser at 375/1440; POSTs blocked to prevent live test writes. Zero horizontal overflow; unchanged scrollY on unavailable submission. Stored success and real provider delivery remain unverified. Nothing published.

### Focused unit output
```text

[1m[30m[46m RUN [49m[39m[22m [36mv5.0.1 [39m[90m/dev-server[39m

 [32m✓[39m src/lib/newsletter/form-state.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 6[2mms[22m[39m
[90mstderr[2m | src/lib/leads/customerio.server.test.ts[2m > [22m[2mCustomer.io sender[2m > [22m[2mfails soft (returns false, never throws) when Customer.io is down
[22m[39m[customerio] request error

[90mstderr[2m | src/lib/leads/customerio.server.test.ts[2m > [22m[2mCustomer.io sender[2m > [22m[2mfails soft (returns false, never throws) when Customer.io is down
[22m[39m[customerio] identify failed (500)

 [32m✓[39m src/lib/leads/customerio.server.test.ts [2m([22m[2m5 tests[22m[2m)[22m[32m 40[2mms[22m[39m
[90mstderr[2m | src/lib/newsletter/customerio-signup.server.test.ts[2m > [22m[2mMELT Customer.io delivery[2m > [22m[2mkeeps signup successful if delivery lookup throws
[22m[39m[newsletter] signup refused: customerio delivery lookup failed

[90mstderr[2m | src/lib/newsletter/customerio-signup.server.test.ts[2m > [22m[2mMELT Customer.io delivery[2m > [22m[2mfails closed with unavailable consent
[22m[39m[newsletter] signup refused: consent configuration missing

 [32m✓[39m src/lib/newsletter/customerio-signup.server.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 18[2mms[22m[39m

[2m Test Files [22m [1m[32m3 passed[39m[22m[90m (3)[39m
[2m      Tests [22m [1m[32m29 passed[39m[22m[90m (29)[39m
[2m   Start at [22m 13:49:07
[2m   Duration [22m 228ms[2m (transform 50%, tests 24%, import 23%, worker 3%)[22m

```

### Newsletter/leads suite output
```text
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
[2mfilter: [22m[33msrc/lib/newsletter[2m, [22msrc/lib/leads[39m

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
[31m[1mSerialized Error:[22m[39m [90m{ status: 1, signal: null, output: [ null, null, null ], pid: 7491, stdout: null, stderr: null }[39m



```

### Browser measurements
```text
Skipping host requirements validation logic because `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS` env variable is set.
{"width": 375, "overflow": 0, "input": {"x": 20, "y": 380.9375, "width": 335, "height": 54}, "button": {"x": 20, "y": 446.9375, "width": 335, "height": 54}, "consent": "By subscribing, you agree to receive The MELT newsletter and related emails from TRUNK. You can unsubscribe anytime. See our Privacy Policy."}
{"width": 375, "scroll_before": 10074, "scroll_after": 10074, "error": "Something went wrong. Please try again."}
{"width": 1440, "overflow": 0, "input": {"x": 92, "y": 1101.703125, "width": 461.734375, "height": 54}, "button": {"x": 565.734375, "y": 1101.703125, "width": 200, "height": 54}, "consent": "By subscribing, you agree to receive The MELT newsletter and related emails from TRUNK. You can unsubscribe anytime. See our Privacy Policy."}
{"width": 1440, "scroll_before": 5479, "scroll_after": 5479, "error": "Something went wrong. Please try again."}
```
