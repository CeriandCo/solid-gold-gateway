# TRUNK rebrand — phase 6d verification

## Scope

Replaced four Learn image imports only. No copy, fonts, layout, alt text, classes, loading, decoding, image width/height attributes, object-fit or aspect-ratio changes. Neither old-version page edited; all original assets retained. All uploaded files served byte-for-byte unchanged. Existing CSS cropping preserved.

## Every file edited or added

- `src/routes/learn.index.tsx`
- `src/assets/knowledge-buying-guide-trunk.jpg.asset.json`
- `src/assets/learn-article-gold-bar-v2-trunk.png.asset.json`
- `src/assets/learn-investing-banner-v2-trunk.png.asset.json`
- `src/assets/learn-article-phone-v2-trunk.png.asset.json`
- `roadmap.md`
- `docs/verification/TRUNK-REBRAND-PHASE6D.md`

## Browser verification

Real Chromium at 375 / 768 / 1440 CSS px, height 1800. All three `/learn` page responses HTTP 200. Before/after image comparisons: 12/12 observations unchanged for width, height, alt, classes, loading, decoding, width/height attributes, object-fit and aspect ratio. All four new images loaded at all three widths. No controls changed or clicked; control scroll invariance not applicable.

Raw measured output:

```text
375 /learn 200 [{"src": "http://localhost:8080/__l5e/assets-v1/b30065c7-0481-4547-b6ca-056443def957/learn-article-phone-v2-trunk.png", "width": 333, "height": 222, "alt": "A hand holding a phone displaying the TRUNK My Vault interface", "classes": "", "loading": "lazy", "widthAttr": "1536", "heightAttr": "1024", "objectFit": "cover", "aspectRatio": "auto 1536 / 1024", "naturalWidth": 1536, "naturalHeight": 1024, "decoding": "async"}, {"src": "http://localhost:8080/__l5e/assets-v1/a0df3fa9-2028-4b92-9ef9-952738739880/learn-article-gold-bar-v2-trunk.png", "width": 333, "height": 222, "alt": "TRUNK 10g fine gold bar with engraved emblem", "classes": "", "loading": "lazy", "widthAttr": "1536", "heightAttr": "1024", "objectFit": "cover", "aspectRatio": "auto 1536 / 1024", "naturalWidth": 1536, "naturalHeight": 1024, "decoding": "async"}, {"src": "http://localhost:8080/__l5e/assets-v1/58667ba0-c404-4b43-beb6-ea42c5c01094/knowledge-buying-guide-trunk.jpg", "width": 333, "height": 214.828125, "alt": "Dark green TRUNK Buying Gold Safely guide", "classes": "", "loading": "lazy", "widthAttr": "1400", "heightAttr": "900", "objectFit": "cover", "aspectRatio": "1.55 / 1", "naturalWidth": 1408, "naturalHeight": 912, "decoding": null}, {"src": "http://localhost:8080/__l5e/assets-v1/c91b4960-bf19-42f4-967f-6c70ce442681/learn-investing-banner-v2-trunk.png", "width": 333, "height": 237.84375, "alt": "TRUNK 10g gold bar, two emblem coins and stacked bullion", "classes": "", "loading": "lazy", "widthAttr": "1820", "heightAttr": "864", "objectFit": "cover", "aspectRatio": "1.4 / 1", "naturalWidth": 1820, "naturalHeight": 864, "decoding": "async"}]
768 /learn 200 [{"src": "http://localhost:8080/__l5e/assets-v1/b30065c7-0481-4547-b6ca-056443def957/learn-article-phone-v2-trunk.png", "width": 346, "height": 271.546875, "alt": "A hand holding a phone displaying the TRUNK My Vault interface", "classes": "", "loading": "lazy", "widthAttr": "1536", "heightAttr": "1024", "objectFit": "cover", "aspectRatio": "auto 1536 / 1024", "naturalWidth": 1536, "naturalHeight": 1024, "decoding": "async"}, {"src": "http://localhost:8080/__l5e/assets-v1/a0df3fa9-2028-4b92-9ef9-952738739880/learn-article-gold-bar-v2-trunk.png", "width": 346, "height": 271.546875, "alt": "TRUNK 10g fine gold bar with engraved emblem", "classes": "", "loading": "lazy", "widthAttr": "1536", "heightAttr": "1024", "objectFit": "cover", "aspectRatio": "auto 1536 / 1024", "naturalWidth": 1536, "naturalHeight": 1024, "decoding": "async"}, {"src": "http://localhost:8080/__l5e/assets-v1/58667ba0-c404-4b43-beb6-ea42c5c01094/knowledge-buying-guide-trunk.jpg", "width": 287.1875, "height": 298, "alt": "Dark green TRUNK Buying Gold Safely guide", "classes": "", "loading": "lazy", "widthAttr": "1400", "heightAttr": "900", "objectFit": "cover", "aspectRatio": "auto 1400 / 900", "naturalWidth": 1408, "naturalHeight": 912, "decoding": null}, {"src": "http://localhost:8080/__l5e/assets-v1/c91b4960-bf19-42f4-967f-6c70ce442681/learn-investing-banner-v2-trunk.png", "width": 323.09375, "height": 429.671875, "alt": "TRUNK 10g gold bar, two emblem coins and stacked bullion", "classes": "", "loading": "lazy", "widthAttr": "1820", "heightAttr": "864", "objectFit": "cover", "aspectRatio": "auto 1820 / 864", "naturalWidth": 1820, "naturalHeight": 864, "decoding": "async"}]
1440 /learn 200 [{"src": "http://localhost:8080/__l5e/assets-v1/b30065c7-0481-4547-b6ca-056443def957/learn-article-phone-v2-trunk.png", "width": 400.65625, "height": 271.546875, "alt": "A hand holding a phone displaying the TRUNK My Vault interface", "classes": "", "loading": "lazy", "widthAttr": "1536", "heightAttr": "1024", "objectFit": "cover", "aspectRatio": "auto 1536 / 1024", "naturalWidth": 1536, "naturalHeight": 1024, "decoding": "async"}, {"src": "http://localhost:8080/__l5e/assets-v1/a0df3fa9-2028-4b92-9ef9-952738739880/learn-article-gold-bar-v2-trunk.png", "width": 400.671875, "height": 271.546875, "alt": "TRUNK 10g fine gold bar with engraved emblem", "classes": "", "loading": "lazy", "widthAttr": "1536", "heightAttr": "1024", "objectFit": "cover", "aspectRatio": "auto 1536 / 1024", "naturalWidth": 1536, "naturalHeight": 1024, "decoding": "async"}, {"src": "http://localhost:8080/__l5e/assets-v1/58667ba0-c404-4b43-beb6-ea42c5c01094/knowledge-buying-guide-trunk.jpg", "width": 286.875, "height": 296, "alt": "Dark green TRUNK Buying Gold Safely guide", "classes": "", "loading": "lazy", "widthAttr": "1400", "heightAttr": "900", "objectFit": "cover", "aspectRatio": "auto 1400 / 900", "naturalWidth": 1408, "naturalHeight": 912, "decoding": null}, {"src": "http://localhost:8080/__l5e/assets-v1/c91b4960-bf19-42f4-967f-6c70ce442681/learn-investing-banner-v2-trunk.png", "width": 564.296875, "height": 334, "alt": "TRUNK 10g gold bar, two emblem coins and stacked bullion", "classes": "", "loading": "lazy", "widthAttr": "1820", "heightAttr": "864", "objectFit": "cover", "aspectRatio": "auto 1820 / 864", "naturalWidth": 1820, "naturalHeight": 864, "decoding": "async"}]
```

## Byte integrity

```text
knowledge-buying-guide-trunk.jpg: HTTP 200; uploaded=149996 bytes; served=149996 bytes; identical=True; SHA256=04097f63dba476a5e247dd6977d61d4677a0618b8357ed6459dfe53a987d15ca
learn-article-gold-bar-v2-trunk.png: HTTP 200; uploaded=1615118 bytes; served=1615118 bytes; identical=True; SHA256=31211085817cb4ce33529768d1e608d96d6731f435b1fb2ab883a2c2cbea5380
learn-investing-banner-v2-trunk.png: HTTP 200; uploaded=1604267 bytes; served=1604267 bytes; identical=True; SHA256=87008f157164d4d5e47018a87e45f9dc8f589dda93a3972fabcc2fb3d62632aa
learn-article-phone-v2-trunk.png: HTTP 200; uploaded=1692375 bytes; served=1692375 bytes; identical=True; SHA256=287fd31dcdb815e47a6c3e0afb2df1342966921684f578712a22783a4d61176d
```

## Old-filename search

Search of src/public excluding asset pointer JSON: zero old-filename matches. Full src/public search found only the deliberately retained original pointer metadata:

```text
src/assets/learn-investing-banner-v2.png.asset.json:5:  "url": "/__l5e/assets-v1/ddc04f56-4a00-4dfe-9642-5436365c1976/learn-investing-banner-v2.png",
src/assets/learn-investing-banner-v2.png.asset.json:6:  "r2_key": "a/v1/dfb6b88e-1020-4c5e-920c-1659e913f2e8/ddc04f56-4a00-4dfe-9642-5436365c1976/learn-investing-banner-v2.png",
src/assets/learn-investing-banner-v2.png.asset.json:7:  "original_filename": "learn-investing-banner-v2.png",
src/assets/knowledge-buying-guide.jpg.asset.json:5:  "url": "/__l5e/assets-v1/4ef8ace0-0d6c-45db-9c68-3a65f39acf4d/knowledge-buying-guide.jpg",
src/assets/knowledge-buying-guide.jpg.asset.json:6:  "r2_key": "a/v1/dfb6b88e-1020-4c5e-920c-1659e913f2e8/4ef8ace0-0d6c-45db-9c68-3a65f39acf4d/knowledge-buying-guide.jpg",
src/assets/knowledge-buying-guide.jpg.asset.json:7:  "original_filename": "knowledge-buying-guide.jpg",
src/assets/learn-article-phone-v2.png.asset.json:5:  "url": "/__l5e/assets-v1/fe60cd65-101d-49ac-a26e-f9ba8a742b18/learn-article-phone-v2.png",
src/assets/learn-article-phone-v2.png.asset.json:6:  "r2_key": "a/v1/dfb6b88e-1020-4c5e-920c-1659e913f2e8/fe60cd65-101d-49ac-a26e-f9ba8a742b18/learn-article-phone-v2.png",
src/assets/learn-article-phone-v2.png.asset.json:7:  "original_filename": "learn-article-phone-v2.png",
src/assets/learn-article-gold-bar-v2.png.asset.json:5:  "url": "/__l5e/assets-v1/4df1a40e-8d22-48a8-b4ac-fc033d2530ea/learn-article-gold-bar-v2.png",
src/assets/learn-article-gold-bar-v2.png.asset.json:6:  "r2_key": "a/v1/dfb6b88e-1020-4c5e-920c-1659e913f2e8/4df1a40e-8d22-48a8-b4ac-fc033d2530ea/learn-article-gold-bar-v2.png",
src/assets/learn-article-gold-bar-v2.png.asset.json:7:  "original_filename": "learn-article-gold-bar-v2.png",
```

Historical documentation also retains old filenames. The literal whole-codebase condition is incompatible with retaining original pointer files; no runtime imports/src point to the old files. Old-version pages were untouched.

## Gates

Automatic preview build passed:

```text
=== build 2026-10-18T18:02:17Z ===
build OK

=== build 2026-10-18T18:02:29Z ===
build OK
```

`bun run test` exit 1, isolated database setup failed before tests executed:

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
[31m[1mSerialized Error:[22m[39m [90m{ status: 1, signal: null, output: [ null, null, null ], pid: 6020, stdout: null, stderr: null }[39m



error: script "test" exited with code 1
```

Manual typecheck/build commands not run because platform instructions prohibit them; the requested three manual gates did not all pass. No live test suites enabled, no database isolation safeguards changed, no database writes and nothing published.
