# TRUNK rebrand — phase 6a verification

## Result and scope

Replaced only the three homepage phone sources, the shared laptop image on `/vault` and `/learn`, and both pricing image meta tags. No laptop usage exists on the current homepage. Preserved all image attributes, CSS, alt text, loading, rendered sizes and existing cropping. The `/learn` laptop remains narrowly cropped by its existing layout; no layout correction was made.

Uploaded `og-pricing-trunk-2.png` is the supplied pricing image; stored with the requested CDN filename `og-pricing-trunk.png`, unchanged at 1200×640. The old pricing image path actually present was `/og/pricing-trunk.png`, not the path described in the request. Both tags now use the absolute production-origin URL below. The published site's tags remain unchanged until the client publishes; nothing was published here.

Old image originals and pointers retained. `/home-old-ver` and `/gifting-old-ver` were not edited. No database changes.

## Every file edited or added

- `src/routes/index.tsx`
- `src/routes/vault.tsx`
- `src/routes/learn.index.tsx`
- `src/routes/pricing.tsx`
- `src/assets/home/phone-hero-vault-holdings-trunk.png.asset.json`
- `src/assets/home/phone-screen-home-full-trunk.png.asset.json`
- `src/assets/home/phone-screen-intro-priced-trunk.png.asset.json`
- `src/assets/walkthrough-laptop-trunk.jpg.asset.json`
- `src/assets/pricing/og-pricing-trunk.png.asset.json`
- `roadmap.md`
- `docs/verification/TRUNK-REBRAND-PHASE6A.md`

## Browser measurements

Real Chromium, reduced motion, viewport widths 375 / 768 / 1440, height 1800. Each affected route returned HTTP 200. Before/after equality assertions passed for width, height, alt, object-fit, aspect-ratio, loading, class, width attribute and height attribute, for all 15 rendered image observations. No controls were changed or clicked; scroll invariance for controls is not applicable.

| Width | Route | Image | Rendered width × height (CSS px) |
|---|---|---|---|
| 375 | / | phone-hero-vault-holdings-trunk.png | 220 × 454.390625 |
| 375 | / | phone-screen-intro-priced-trunk.png | 147.45236206054688 × 272.176025390625 |
| 375 | / | phone-screen-home-full-trunk.png | 154.85470581054688 × 334.44952392578125 |
| 375 | /vault | walkthrough-laptop-trunk.jpg | 335 × 209.375 |
| 375 | /learn | walkthrough-laptop-trunk.jpg | 133.1875 × 385.28125 |
| 768 | / | phone-hero-vault-holdings-trunk.png | 250 × 516.359375 |
| 768 | / | phone-screen-intro-priced-trunk.png | 214.47618103027344 × 395.89239501953125 |
| 768 | / | phone-screen-home-full-trunk.png | 225.24319458007812 × 486.47198486328125 |
| 768 | /vault | walkthrough-laptop-trunk.jpg | 720 × 450 |
| 768 | /learn | walkthrough-laptop-trunk.jpg | 147 × 385.28125 |
| 1440 | / | phone-hero-vault-holdings-trunk.png | 305 × 629.953125 |
| 1440 | / | phone-screen-intro-priced-trunk.png | 268.09521484375 × 494.865478515625 |
| 1440 | / | phone-screen-home-full-trunk.png | 281.553955078125 × 608.0900268554688 |
| 1440 | /vault | walkthrough-laptop-trunk.jpg | 380 × 237.5 |
| 1440 | /learn | walkthrough-laptop-trunk.jpg | 192.765625 × 343.28125 |

Both pricing tags, confirmed at all three widths:

```text
https://solid-gold-gateway.lovable.app/__l5e/assets-v1/eaf94749-0dd9-44bd-b5e5-594d92525515/og-pricing-trunk.png
```

## Byte integrity

The initial direct HTTP client received 403; a real browser retrieved each asset with HTTP 200. Browser response bytes compared equal to the original uploads, confirming no resize, compression or re-encoding.

```text
phone-hero-vault-holdings-trunk.png: HTTP=200 supplied=461924 served=461924 SHA256=c9e563353d6aa2ab28cdd52ab659999c91388d45509b5f6755baea5d81abad4a identical=True
phone-screen-home-full-trunk.png: HTTP=200 supplied=734899 served=734899 SHA256=0e10dca20f533d9d501ae7fcb1a5ba10fe701a49adce6ac18f9931229bcb533a identical=True
phone-screen-intro-priced-trunk.png: HTTP=200 supplied=1036373 served=1036373 SHA256=6c919905635b190b7f3d1191592fcac2a5dfadd95536cd20da65950cdc5b6957 identical=True
walkthrough-laptop-trunk.jpg: HTTP=200 supplied=77870 served=77870 SHA256=18f291e0c2af8895baf126cf7cb9bb85d74c6f021dba40e63421d16962a1b7d8 identical=True
og-pricing-trunk-2.png: HTTP=200 supplied=357195 served=357195 SHA256=db959aa743fe1ead44c47c991b9c50b3a72e8661ef25d2e68b4d768bd09a9459 identical=True
```

## Old-filename search

Active source search (excluding immutable retained pointer JSON):

```text
rg -n phone-hero-vault-holdings\.png|phone-screen-home-full\.png|phone-screen-intro-priced\.png|walkthrough-laptop\.jpg src --glob !*.asset.json
exit=1; zero matches
```

Literal old names still exist in the three retained original asset pointers and historical documentation. This is required to keep the original assets intact for phase 7; the literal whole-codebase zero-match condition cannot coexist with retaining these pointers. There are no remaining runtime imports/src references to any of the four old filenames, including in the two old-version routes.

## Checks and limitations

- Automatic preview build: passed. Latest raw entries:

```text

=== build 2026-10-18T17:42:26Z ===
build OK

=== build 2026-10-18T17:42:44Z ===
build OK

=== build 2026-10-18T17:43:50Z ===
build OK
```

- `bun run test`: failed during isolated stack setup, before executing tests. Raw output:

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
[31m[1mSerialized Error:[22m[39m [90m{ status: 1, signal: null, output: [ null, null, null ], pid: 1202, stdout: null, stderr: null }[39m



error: script "test" exited with code 1

```

- Manual `bunx tsgo --noEmit` and `bun run build` were not run: platform instructions prohibit manual typechecks/builds and provide automatic build checks. Therefore the requested three manual gates did not all pass. No test-isolation guard was weakened or live test suite enabled.
- Production asset URLs and live social previews were not checked after publishing, because publishing is client-owned.
- Screenshots inspected for homepage phones and vault/learn laptop; all measured image rendering attributes were unchanged.
