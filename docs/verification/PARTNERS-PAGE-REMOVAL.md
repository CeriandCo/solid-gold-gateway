# Partners page removal

Removed `src/routes/partners.tsx`; `/partners` now uses the shared not-found page without a redirect. Removed Partners from shared desktop/mobile navigation and footer in `src/components/site-chrome.tsx` so there are no dead links. The route tree regenerated automatically. Partner terms, stored applications and submission services remain unchanged.

Nothing published: the live site remains unchanged until the client publishes.

## Browser checks (raw output)
```
Skipping host requirements validation logic because `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS` env variable is set.
{"width": 375, "path": "/partners", "status": 404, "headings": ["404", "Page not found"]}
{"width": 375, "menuScrollBefore": 0, "menuScrollAfter": 0}
{"width": 375, "partnerLinks": 0, "overflow": 0}
{"width": 768, "path": "/partners", "status": 404, "headings": ["404", "Page not found"]}
{"width": 768, "menuScrollBefore": 0, "menuScrollAfter": 0}
{"width": 768, "partnerLinks": 0, "overflow": 0}
{"width": 1440, "path": "/partners", "status": 404, "headings": ["404", "Page not found"]}
{"width": 1440, "partnerLinks": 0, "overflow": 0}
```
Mobile and desktop screenshots visually inspected. No forms submitted or database writes performed.

## Automatic preview build (raw output)
```
=== build 2026-11-22T23:24:57Z ===
build OK
```

## Tests
`bun run test` was attempted but blocked by isolated database startup before execution:
```
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
[31m[1mSerialized Error:[22m[39m [90m{ status: 1, signal: null, output: [ null, null, null ], pid: 7980, stdout: null, stderr: null }[39m



error: script "test" exited with code 1
```
Manual build and typecheck commands were not run, following platform instructions. Full-suite verification remains blocked.
