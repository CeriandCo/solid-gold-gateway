# TRUNK rebrand — phase 6c verification

## Scope

Replaced the two requested imports on `/fractional-gold`. No changes to copy, layout, fonts, other images or share metadata. Both old-version pages were untouched. Old image pointers retained. New image bytes were not transformed; existing CSS object-fit cropping remains unchanged.

## Every file edited or added

- `src/routes/fractional-gold.tsx`
- `src/assets/fractional-gold-hero-trunk.png.asset.json`
- `src/assets/trunk-product-comparison.png.asset.json`
- `roadmap.md`
- `docs/verification/TRUNK-REBRAND-PHASE6C.md`

## Browser verification

Chromium at 375 / 768 / 1440 CSS px, height 1800. All three page responses HTTP 200. Before/after comparison: 6/6 image observations passed exact equality for rendered width/height, alt, classes, loading, width/height attributes, object-fit and aspect-ratio. Both replacement images loaded at each width. No controls were changed or clicked; control scroll invariance is not applicable.

Raw browser output:

```text
375 /fractional-gold 200 [{"src": "http://localhost:8080/__l5e/assets-v1/9c7994e8-026f-4bf7-a68c-7a161a97de0c/fractional-gold-hero-trunk.png", "width": 375, "height": 620, "alt": "TRUNK gold bars and a coin arranged on a deep green velvet tray over marble", "classes": "inner-page-hero-image inner-page-hero-image--fractional", "loading": null, "widthAttr": null, "heightAttr": null, "objectFit": "cover", "aspectRatio": "auto", "naturalWidth": 1672, "naturalHeight": 941}, {"src": "http://localhost:8080/__l5e/assets-v1/4b9ea1b8-2c13-4c68-af5f-813c2376c95f/trunk-product-comparison.png", "width": 295, "height": 280, "alt": "TRUNK green suede box, gold bar, display card, flowers and velvet cloth", "classes": "h-full w-full rounded-lg object-cover object-center shadow-xl", "loading": "lazy", "widthAttr": "1540", "heightAttr": "1021", "objectFit": "cover", "aspectRatio": "auto 1540 / 1021", "naturalWidth": 1540, "naturalHeight": 1021}]
768 /fractional-gold 200 [{"src": "http://localhost:8080/__l5e/assets-v1/9c7994e8-026f-4bf7-a68c-7a161a97de0c/fractional-gold-hero-trunk.png", "width": 768, "height": 820, "alt": "TRUNK gold bars and a coin arranged on a deep green velvet tray over marble", "classes": "inner-page-hero-image inner-page-hero-image--fractional", "loading": null, "widthAttr": null, "heightAttr": null, "objectFit": "cover", "aspectRatio": "auto", "naturalWidth": 1672, "naturalHeight": 941}, {"src": "http://localhost:8080/__l5e/assets-v1/4b9ea1b8-2c13-4c68-af5f-813c2376c95f/trunk-product-comparison.png", "width": 664, "height": 440.21875, "alt": "TRUNK green suede box, gold bar, display card, flowers and velvet cloth", "classes": "h-full w-full rounded-lg object-cover object-center shadow-xl", "loading": "lazy", "widthAttr": "1540", "heightAttr": "1021", "objectFit": "cover", "aspectRatio": "auto 1540 / 1021", "naturalWidth": 1540, "naturalHeight": 1021}]
1440 /fractional-gold 200 [{"src": "http://localhost:8080/__l5e/assets-v1/9c7994e8-026f-4bf7-a68c-7a161a97de0c/fractional-gold-hero-trunk.png", "width": 1440, "height": 820, "alt": "TRUNK gold bars and a coin arranged on a deep green velvet tray over marble", "classes": "inner-page-hero-image inner-page-hero-image--fractional", "loading": null, "widthAttr": null, "heightAttr": null, "objectFit": "cover", "aspectRatio": "auto", "naturalWidth": 1672, "naturalHeight": 941}, {"src": "http://localhost:8080/__l5e/assets-v1/4b9ea1b8-2c13-4c68-af5f-813c2376c95f/trunk-product-comparison.png", "width": 483.078125, "height": 320.265625, "alt": "TRUNK green suede box, gold bar, display card, flowers and velvet cloth", "classes": "h-full w-full rounded-lg object-cover object-center shadow-xl", "loading": "lazy", "widthAttr": "1540", "heightAttr": "1021", "objectFit": "cover", "aspectRatio": "auto 1540 / 1021", "naturalWidth": 1540, "naturalHeight": 1021}]
```

## Byte integrity

Browser-served responses compared directly to the uploaded originals:

```text
fractional-gold-hero-trunk.png: HTTP 200; uploaded=1927991 bytes; served=1927991 bytes; identical=True; SHA256=187a2b81d344ec422f52fd5fcb75d8eab818352d2ee6f93cb459aadbec8e70c0
trunk-product-comparison.png: HTTP 200; uploaded=1303537 bytes; served=1303537 bytes; identical=True; SHA256=da50b5565f901e18aea442d5046f4d83530b4fff30975c8b0dd3aa44cccacfbd
```

## Old-name search

Search of active source (src/public excluding asset JSON): zero matches for either old filename. Complete src/public search returned only preserved original pointer metadata:

```text
src/assets/fractional-gold-hero.png.asset.json:5:  "url": "/__l5e/assets-v1/3e3e46b6-9d5b-4d8d-a1c5-906fd92eb82e/fractional-gold-hero.png",
src/assets/fractional-gold-hero.png.asset.json:6:  "r2_key": "a/v1/dfb6b88e-1020-4c5e-920c-1659e913f2e8/3e3e46b6-9d5b-4d8d-a1c5-906fd92eb82e/fractional-gold-hero.png",
src/assets/fractional-gold-hero.png.asset.json:7:  "original_filename": "fractional-gold-hero.png",
src/assets/sqoot-pure-product-comparison.png.asset.json:5:  "url": "/__l5e/assets-v1/0848d17b-a111-481a-9455-be6838661328/sqoot-pure-product-comparison.png",
src/assets/sqoot-pure-product-comparison.png.asset.json:6:  "r2_key": "a/v1/dfb6b88e-1020-4c5e-920c-1659e913f2e8/0848d17b-a111-481a-9455-be6838661328/sqoot-pure-product-comparison.png",
src/assets/sqoot-pure-product-comparison.png.asset.json:7:  "original_filename": "sqoot-pure-product-comparison.png",
```

Historical documentation also retains these filenames. Literal old names cannot be removed from retained original asset pointers without violating the keep-old-files requirement. No old runtime imports/src remain; no old-version page was edited.

## Verification gates

Automatic preview build passed, raw output:

```text
=== build 2026-10-18T17:51:17Z ===
build OK

=== build 2026-10-18T17:51:28Z ===
build OK
```

`bun run test` exit 1: isolated database setup failed before tests executed. Raw output:

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
[31m[1mSerialized Error:[22m[39m [90m{ status: 1, signal: null, output: [ null, null, null ], pid: 4568, stdout: null, stderr: null }[39m



error: script "test" exited with code 1
```

Manual typecheck/build not run, as platform instructions prohibit those manual commands. Therefore the requested three manual gates did not all pass. No isolation guards changed, no live tests enabled, no database writes and nothing published.
