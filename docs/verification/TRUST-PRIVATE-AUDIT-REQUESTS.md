# Trust Center confidential audit information

## Changes
- Removed Total Gold Verified, Client Accounts, Discrepancies Found and post-audit placeholders.
- Removed public report publication, full-page disclosure and permanent public archive claims.
- Replaced audit verification-result wording with independent oversight; customer identity/AML wording remains unchanged because it concerns account safety, not public audit results.
- Added: “Audit reports and company and client data are confidential. Clients may request information relevant to their own account.”
- Added a Request audit information email link to support@trunk.gold. Requests do not grant access automatically or expose company/other-client data. No new data access system added. Email application launch/delivery not verified.
- Retained six-month reporting, June 30, 2026 audit and December 30, 2026 upcoming report dates.
- Existing fonts, images, site chrome and AURUM unchanged. No database queries or writes; nothing published.

## Files changed
- src/routes/trust-center.tsx
- roadmap.md
- docs/verification/TRUST-PRIVATE-AUDIT-REQUESTS.md
- Project memory: vault audit reporting and index.

## Browser raw output
Screenshots inspected at all three widths. Clicked the request email link; scroll unchanged.
```text
Skipping host requirements validation logic because `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS` env variable is set.
{"width": 375, "removed_claim_counts": {"total gold": 0, "client accounts": 0, "post-audit": 0, "published": 0, "unredacted": 0, "discrepancies found": 0}, "request_href": "mailto:support@trunk.gold?subject=Audit%20information%20request", "scroll_before": 666, "scroll_after": 666, "overflow": 0, "june30": 5, "dec30": 3}
{"width": 768, "removed_claim_counts": {"total gold": 0, "client accounts": 0, "post-audit": 0, "published": 0, "unredacted": 0, "discrepancies found": 0}, "request_href": "mailto:support@trunk.gold?subject=Audit%20information%20request", "scroll_before": 582, "scroll_after": 582, "overflow": 0, "june30": 5, "dec30": 3}
{"width": 1440, "removed_claim_counts": {"total gold": 0, "client accounts": 0, "post-audit": 0, "published": 0, "unredacted": 0, "discrepancies found": 0}, "request_href": "mailto:support@trunk.gold?subject=Audit%20information%20request", "scroll_before": 0, "scroll_after": 0, "overflow": 0, "june30": 5, "dec30": 3}
```

## Test output
Full suite attempted; isolated database startup failed before test execution. Isolation retained. No tests for presentation copy added.
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
[31m[1mSerialized Error:[22m[39m [90m{ status: 1, signal: null, output: [ null, null, null ], pid: 2613, stdout: null, stderr: null }[39m



error: script "test" exited with code 1
```

## Automatic preview build
```text
=== build 2026-10-21T02:03:24Z ===
build OK
```
Manual typecheck/build not run per platform instructions.
