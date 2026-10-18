# TRUNK rebrand — phase 6b

## Changes

Only the three requested image imports were replaced. No layout, copy, fonts, image classes, alt text, sizing, loading or object-fit changes. Old assets retained; neither old-version route edited. All replacement images are served byte-for-byte identical to the supplied uploads, with no crop, resize, compression or re-encoding. Existing CSS cropping remains unchanged.

## Every file edited or added

- `src/routes/about-us.tsx`
- `src/routes/gifting.tsx`
- `src/assets/about-hero-velvet-bar-trunk.png.asset.json`
- `src/assets/gifting-hero-v2-trunk.png.asset.json`
- `src/assets/gifting-closing-v2-trunk.png.asset.json`
- `roadmap.md`
- `docs/verification/TRUNK-REBRAND-PHASE6B.md`

## Browser results

Chromium at 375 / 768 / 1440 CSS px, height 1800. All six page loads returned 200. Before/after assertions: 9/9 image observations unchanged across rendered width/height, alt, class, loading, width/height attributes, object-fit and aspect ratio. No controls were modified or clicked; control scroll checks do not apply. Screenshots inspected: About desktop, Gifting mobile hero, Gifting tablet closing banner.

Raw measured output:

```text
375 /about-us 200 [{"src": "http://localhost:8080/__l5e/assets-v1/55a1b277-8da5-4e79-950e-2e580714ca6e/about-hero-velvet-bar-trunk.png", "width": 375, "height": 620, "alt": "TRUNK gold bar resting on dark green velvet", "classes": "inner-page-hero-image inner-page-hero-image--about", "loading": null, "widthAttr": null, "heightAttr": null, "objectFit": "cover", "aspectRatio": "auto", "naturalWidth": 1551, "naturalHeight": 1014}]
375 /gifting 200 [{"src": "http://localhost:8080/__l5e/assets-v1/d3ec00bb-76ea-42dc-a0a0-22706f69cb51/gifting-hero-v2-trunk.png", "width": 375, "height": 620, "alt": "Dark green gift box tied with bronze ribbon beside a TRUNK 10g gold bar", "classes": "inner-page-hero-image inner-page-hero-image--gifting", "loading": "eager", "widthAttr": "1920", "heightAttr": "720", "objectFit": "cover", "aspectRatio": "auto 1920 / 720", "naturalWidth": 1920, "naturalHeight": 720}, {"src": "http://localhost:8080/__l5e/assets-v1/ae7841db-606d-41b8-989b-f1f5fb786a7a/gifting-closing-v2-trunk.png", "width": 375, "height": 540, "alt": "TRUNK 10g gold bar in an ivory presentation box with forest green velvet and olive branches", "classes": "", "loading": "lazy", "widthAttr": "1942", "heightAttr": "809", "objectFit": "cover", "aspectRatio": "auto 1942 / 809", "naturalWidth": 1942, "naturalHeight": 809}]
768 /about-us 200 [{"src": "http://localhost:8080/__l5e/assets-v1/55a1b277-8da5-4e79-950e-2e580714ca6e/about-hero-velvet-bar-trunk.png", "width": 768, "height": 820, "alt": "TRUNK gold bar resting on dark green velvet", "classes": "inner-page-hero-image inner-page-hero-image--about", "loading": null, "widthAttr": null, "heightAttr": null, "objectFit": "cover", "aspectRatio": "auto", "naturalWidth": 1551, "naturalHeight": 1014}]
768 /gifting 200 [{"src": "http://localhost:8080/__l5e/assets-v1/d3ec00bb-76ea-42dc-a0a0-22706f69cb51/gifting-hero-v2-trunk.png", "width": 768, "height": 820, "alt": "Dark green gift box tied with bronze ribbon beside a TRUNK 10g gold bar", "classes": "inner-page-hero-image inner-page-hero-image--gifting", "loading": "eager", "widthAttr": "1920", "heightAttr": "720", "objectFit": "cover", "aspectRatio": "auto 1920 / 720", "naturalWidth": 1920, "naturalHeight": 720}, {"src": "http://localhost:8080/__l5e/assets-v1/ae7841db-606d-41b8-989b-f1f5fb786a7a/gifting-closing-v2-trunk.png", "width": 768, "height": 480, "alt": "TRUNK 10g gold bar in an ivory presentation box with forest green velvet and olive branches", "classes": "", "loading": "lazy", "widthAttr": "1942", "heightAttr": "809", "objectFit": "cover", "aspectRatio": "auto 1942 / 809", "naturalWidth": 1942, "naturalHeight": 809}]
1440 /about-us 200 [{"src": "http://localhost:8080/__l5e/assets-v1/55a1b277-8da5-4e79-950e-2e580714ca6e/about-hero-velvet-bar-trunk.png", "width": 1440, "height": 820, "alt": "TRUNK gold bar resting on dark green velvet", "classes": "inner-page-hero-image inner-page-hero-image--about", "loading": null, "widthAttr": null, "heightAttr": null, "objectFit": "cover", "aspectRatio": "auto", "naturalWidth": 1551, "naturalHeight": 1014}]
1440 /gifting 200 [{"src": "http://localhost:8080/__l5e/assets-v1/d3ec00bb-76ea-42dc-a0a0-22706f69cb51/gifting-hero-v2-trunk.png", "width": 1440, "height": 820, "alt": "Dark green gift box tied with bronze ribbon beside a TRUNK 10g gold bar", "classes": "inner-page-hero-image inner-page-hero-image--gifting", "loading": "eager", "widthAttr": "1920", "heightAttr": "720", "objectFit": "cover", "aspectRatio": "auto 1920 / 720", "naturalWidth": 1920, "naturalHeight": 720}, {"src": "http://localhost:8080/__l5e/assets-v1/ae7841db-606d-41b8-989b-f1f5fb786a7a/gifting-closing-v2-trunk.png", "width": 1440, "height": 600.046875, "alt": "TRUNK 10g gold bar in an ivory presentation box with forest green velvet and olive branches", "classes": "", "loading": "lazy", "widthAttr": "1942", "heightAttr": "809", "objectFit": "cover", "aspectRatio": "auto 1942 / 809", "naturalWidth": 1942, "naturalHeight": 809}]
```

## File integrity

```text
about-hero-velvet-bar-trunk.png: HTTP 200; uploaded=1423948 bytes; served=1423948 bytes; identical=True; SHA256=75a4690a5f9a82506e4c1e477b9a653e20604c56f39394bc4e7fc462c85991ce
gifting-hero-v2-trunk.png: HTTP 200; uploaded=1726890 bytes; served=1726890 bytes; identical=True; SHA256=eed81317f0fcd6881376017bbba259b73d486b4d241d525050ec935411c47b43
gifting-closing-v2-trunk.png: HTTP 200; uploaded=2002503 bytes; served=2002503 bytes; identical=True; SHA256=e8b6ae3326ef5cba344c53af5ee5ef35b22a9d5724b83559261f12bc387e4a74
```

## Old filename search

`rg` of `src` and `public`, excluding `.asset.json`: zero matches for all three old filenames. Full search retains the following old asset pointer metadata intentionally, because deleting or rewriting it would violate the requirement to keep the old assets. Historical documentation also retains old names; no active import/src references remain. The literal whole-codebase condition cannot be satisfied while preserving these old asset pointers.

```text
src/assets/about-hero-velvet-bar.png.asset.json:5:  "url": "/__l5e/assets-v1/b5a692cc-38ee-4cbc-8246-6bce72ef8406/about-hero-velvet-bar.png",
src/assets/about-hero-velvet-bar.png.asset.json:6:  "r2_key": "a/v1/dfb6b88e-1020-4c5e-920c-1659e913f2e8/b5a692cc-38ee-4cbc-8246-6bce72ef8406/about-hero-velvet-bar.png",
src/assets/about-hero-velvet-bar.png.asset.json:7:  "original_filename": "about-hero-velvet-bar.png",
src/assets/gifting-closing-v2.png.asset.json:5:  "url": "/__l5e/assets-v1/c916b238-41d5-4084-b968-dfff3b90a9f7/gifting-closing-v2.png",
src/assets/gifting-closing-v2.png.asset.json:6:  "r2_key": "a/v1/dfb6b88e-1020-4c5e-920c-1659e913f2e8/c916b238-41d5-4084-b968-dfff3b90a9f7/gifting-closing-v2.png",
src/assets/gifting-closing-v2.png.asset.json:7:  "original_filename": "gifting-closing-v2.png",
src/assets/gifting-hero-v2.png.asset.json:5:  "url": "/__l5e/assets-v1/c0746f91-4563-402c-87a9-b4142fd93a0d/gifting-hero-v2.png",
src/assets/gifting-hero-v2.png.asset.json:6:  "r2_key": "a/v1/dfb6b88e-1020-4c5e-920c-1659e913f2e8/c0746f91-4563-402c-87a9-b4142fd93a0d/gifting-hero-v2.png",
src/assets/gifting-hero-v2.png.asset.json:7:  "original_filename": "gifting-hero-v2.png",
```

## Gates

Automatic preview build passed:

```text
=== build 2026-10-18T17:45:57Z ===
build OK

=== build 2026-10-18T17:46:06Z ===
build OK
```

`bun run test` failed before test execution during isolated database startup. No live tests were enabled and no database isolation guards changed. Raw output:

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
[31m[1mSerialized Error:[22m[39m [90m{ status: 1, signal: null, output: [ null, null, null ], pid: 3093, stdout: null, stderr: null }[39m



error: script "test" exited with code 1
```

Manual typecheck/build commands were not run because platform instructions prohibit them; automatic preview build is the build signal. The requested three manual gates therefore did not all pass. No publishing or live-site verification was performed.
