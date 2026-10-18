# Starting purchase amount: $50

Updated starting-amount text from $25 to $50 in home, fractional gold, partners, early access, About Us, and old homepage, including affected page descriptions. Updated the existing frontend pricing configuration to 50, which also updates the Pricing page. No payment processing, database, legal wording, layout, or AURUM changes. Nothing published.

## Browser verification (raw output)

```text
Skipping host requirements validation logic because `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS` env variable is set.
{"width": 375, "route": "/", "status": 200, "old_25_count": 0, "new_50_count": 1}
{"width": 375, "route": "/fractional-gold", "status": 200, "old_25_count": 0, "new_50_count": 4}
{"width": 375, "route": "/pricing", "status": 200, "old_25_count": 0, "new_50_count": 4}
{"width": 375, "route": "/partners", "status": 200, "old_25_count": 0, "new_50_count": 2}
{"width": 375, "route": "/early-access", "status": 200, "old_25_count": 0, "new_50_count": 1}
{"width": 375, "route": "/about-us", "status": 200, "old_25_count": 0, "new_50_count": 1}
{"width": 375, "route": "/home-old-ver", "status": 200, "old_25_count": 0, "new_50_count": 1}
{"width": 768, "route": "/", "status": 200, "old_25_count": 0, "new_50_count": 1}
{"width": 768, "route": "/fractional-gold", "status": 200, "old_25_count": 0, "new_50_count": 4}
{"width": 768, "route": "/pricing", "status": 200, "old_25_count": 0, "new_50_count": 4}
{"width": 768, "route": "/partners", "status": 200, "old_25_count": 0, "new_50_count": 2}
{"width": 768, "route": "/early-access", "status": 200, "old_25_count": 0, "new_50_count": 1}
{"width": 768, "route": "/about-us", "status": 200, "old_25_count": 0, "new_50_count": 1}
{"width": 768, "route": "/home-old-ver", "status": 200, "old_25_count": 0, "new_50_count": 1}
{"width": 1440, "route": "/", "status": 200, "old_25_count": 0, "new_50_count": 1}
{"width": 1440, "route": "/fractional-gold", "status": 200, "old_25_count": 0, "new_50_count": 4}
{"width": 1440, "route": "/pricing", "status": 200, "old_25_count": 0, "new_50_count": 4}
{"width": 1440, "route": "/partners", "status": 200, "old_25_count": 0, "new_50_count": 2}
{"width": 1440, "route": "/early-access", "status": 200, "old_25_count": 0, "new_50_count": 2}
{"width": 1440, "route": "/about-us", "status": 200, "old_25_count": 0, "new_50_count": 1}
{"width": 1440, "route": "/home-old-ver", "status": 200, "old_25_count": 0, "new_50_count": 1}
```

## Targeted rule test (raw output)

```text
failed to load config from /tmp/start-50-vitest.config.mjs

[31m⎯⎯⎯⎯⎯⎯⎯[39m[1m[41m Startup Error [49m[22m[31m⎯⎯⎯⎯⎯⎯⎯⎯[39m
Error: ENOENT: no such file or directory, mkdir '/node_modules/.vite-temp'
    at async Object.mkdir (node:internal/fs/promises:855:10)
    at async loadConfigFromBundledFile (file:///persist/node_modules/vite/dist/node/chunks/node.js:36168:4)
    at async bundleAndLoadConfigFile (file:///persist/node_modules/vite/dist/node/chunks/node.js:36042:17)
    at async loadConfigFromFile (file:///persist/node_modules/vite/dist/node/chunks/node.js:36001:42)
    at async resolveConfig (file:///persist/node_modules/vite/dist/node/chunks/node.js:35617:22)
    at async resolveConfig$1 (file:///persist/node_modules/vitest/dist/chunks/index.DzobfTyw.js:14777:25)
    at async createVitest (file:///persist/node_modules/vitest/dist/chunks/cli-api.DcLieX4F.js:26:17)
    at async prepareVitest (file:///persist/node_modules/vitest/dist/chunks/cli-api.DcLieX4F.js:421:14)
    at async startVitest (file:///persist/node_modules/vitest/dist/chunks/cli-api.DcLieX4F.js:340:14)
    at async start (file:///persist/node_modules/vitest/dist/chunks/cac.fSuRXrAx.js:2370:15) {
  errno: -2,
  code: 'ENOENT',
  syscall: 'mkdir',
  path: '/node_modules/.vite-temp'
}



```

## Full isolated suite (raw output)

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
[31m[1mSerialized Error:[22m[39m [90m{ status: 1, signal: null, output: [ null, null, null ], pid: 2420, stdout: null, stderr: null }[39m



error: script "test" exited with code 1
```

The full suite failed during isolated database startup before tests executed; no live database test was run. Manual typecheck and build were not run because platform instructions prohibit them. The automatic preview build signal was:

```text
=== build 2026-10-18T05:00:38Z ===
build OK
```

A source search for `$25`, `$ 25`, and `minimumPurchaseUsd: 25` in src/routes and src/config returned zero matches. No in-page controls changed, so scroll-preservation testing was not applicable.
