# TRUNK rebrand phase 7 — verification

## Result and scope

Current branding updated; both old route modules and their three exclusive ordinary images removed. No layout, styles, fonts or image display changes. Shared images retained. Nothing published.

Final sweep is PARTIAL: compatibility identifiers, secret-related content, retained original assets and historical evidence remain outside the user's original three allowed categories. These are explicitly reported, not claimed compliant. The clarification was skipped, so no destructive compatibility or evidence rewrite was performed.

## Database verification (raw read results)

```text
Before:
aurum_posts total_rows=12 matching_rows=0
aurum_cms_settings total_rows=1 matching_rows=0
commerce_settings total_rows=1 matching_rows=0
aurum_post_sources total_rows=31 matching_rows=1

After:
aurum_posts total_rows=12 matching_rows=0
aurum_cms_settings total_rows=1 matching_rows=0
commerce_settings total_rows=1 matching_rows=0
aurum_post_sources total_rows=31 matching_rows=0

Updated source returned:
id=e4fb679a-fccd-4408-a93c-93f19a539a4c
post_id=1ce2d203-e3e7-4c1d-8c66-c34f8c2b6ca1
publisher=TRUNK AURUM test
```

Posts changed: **0**; post fields changed: **none** (all 12 already free of the old brand). Related sources changed: **1**, publisher only, from SQOOT AURUM test to TRUNK AURUM test. Settings changed: **0**. Post JSON search covered every column, including embedded body data. No separate excerpt/SEO/image-alt columns exist; summary is the excerpt field. No commerce/operator rows altered.

## Files edited

- `src/routes/terms.tsx`
- `src/routes/privacy.tsx`
- `src/routes/pricing.tsx`
- `src/lib/gift-delivery.server.ts`
- `src/lib/gift-delivery.server.test.ts`
- `src/lib/aurum/ai/manual.server.ts`
- `src/lib/aurum/ai/contract.ts`
- `src/lib/aurum/ai/data.server.ts`
- `src/lib/aurum/ai/run.test.ts`
- `src/lib/aurum/ai/persistence-db.test.ts`
- `src/components/site-chrome.tsx`
- `src/lib/link-audit/semantic.ts`
- `src/lib/link-audit/analyze.test.ts`
- `README.md`
- `DESIGN_SYSTEM.md`
- `roadmap.md`
- `AGENTS.md`
- `src/lib/link-audit/phase2-fixes.test.ts`
- `docs/verification/TRUNK-REBRAND-PHASE7.md`

Deleted:
- src/routes/home-old-ver.tsx (including its local page component)
- src/routes/gifting-old-ver.tsx (including its local page component/data)
- src/assets/gifting-hero-product-final.jpg
- src/assets/gifting-legacy-gold-refined.jpg
- src/assets/gifting-phone-gold-bar-enhanced.png

Generated route tree regenerated automatically; not manually edited. Shared site chrome and shared gold-bar image retained. Retired audit rules removed; old gifting regression replaced by two route-removal assertions.

Brand-only changes include legal emails, pricing canonical, gift email copy, manual/scheduled AI prompt brand names and price-record publisher labels, corresponding fixture strings and current documentation. AI verification, review, payment and publishing logic unchanged. The old AI name allowlist remains compatibility-sensitive for pre-existing input. No new AI behavior was added.

## Browser raw results

No in-page state-changing controls modified or clicked (scroll-click check not applicable). Both deleted URLs returned normal 404 at all widths. Other checked pages returned 200. Screenshots visually confirmed the existing not-found presentation.

```json
[
  {
    "width": 375,
    "path": "/home-old-ver",
    "status": 404,
    "old_visible_brand": false,
    "overflow": 0,
    "errors": [],
    "not_found": true
  },
  {
    "width": 375,
    "path": "/gifting-old-ver",
    "status": 404,
    "old_visible_brand": false,
    "overflow": 0,
    "errors": [],
    "not_found": true
  },
  {
    "width": 375,
    "path": "/terms",
    "status": 200,
    "old_visible_brand": false,
    "overflow": 0,
    "errors": []
  },
  {
    "width": 375,
    "path": "/privacy",
    "status": 200,
    "old_visible_brand": false,
    "overflow": 0,
    "errors": []
  },
  {
    "width": 375,
    "path": "/pricing",
    "status": 200,
    "old_visible_brand": false,
    "overflow": 0,
    "errors": []
  },
  {
    "width": 375,
    "path": "/learn",
    "status": 200,
    "old_visible_brand": false,
    "overflow": 0,
    "errors": []
  },
  {
    "width": 375,
    "path": "/gifting",
    "status": 200,
    "old_visible_brand": false,
    "overflow": 0,
    "errors": []
  },
  {
    "width": 375,
    "path": "/aurum",
    "status": 200,
    "old_visible_brand": false,
    "overflow": 0,
    "errors": []
  },
  {
    "width": 768,
    "path": "/home-old-ver",
    "status": 404,
    "old_visible_brand": false,
    "overflow": 0,
    "errors": [],
    "not_found": true
  },
  {
    "width": 768,
    "path": "/gifting-old-ver",
    "status": 404,
    "old_visible_brand": false,
    "overflow": 0,
    "errors": [],
    "not_found": true
  },
  {
    "width": 768,
    "path": "/terms",
    "status": 200,
    "old_visible_brand": false,
    "overflow": 0,
    "errors": []
  },
  {
    "width": 768,
    "path": "/privacy",
    "status": 200,
    "old_visible_brand": false,
    "overflow": 0,
    "errors": []
  },
  {
    "width": 768,
    "path": "/pricing",
    "status": 200,
    "old_visible_brand": false,
    "overflow": 0,
    "errors": []
  },
  {
    "width": 768,
    "path": "/learn",
    "status": 200,
    "old_visible_brand": false,
    "overflow": 0,
    "errors": []
  },
  {
    "width": 768,
    "path": "/gifting",
    "status": 200,
    "old_visible_brand": false,
    "overflow": 0,
    "errors": []
  },
  {
    "width": 768,
    "path": "/aurum",
    "status": 200,
    "old_visible_brand": false,
    "overflow": 0,
    "errors": []
  },
  {
    "width": 1440,
    "path": "/home-old-ver",
    "status": 404,
    "old_visible_brand": false,
    "overflow": 0,
    "errors": [],
    "not_found": true
  },
  {
    "width": 1440,
    "path": "/gifting-old-ver",
    "status": 404,
    "old_visible_brand": false,
    "overflow": 0,
    "errors": [],
    "not_found": true
  },
  {
    "width": 1440,
    "path": "/terms",
    "status": 200,
    "old_visible_brand": false,
    "overflow": 0,
    "errors": []
  },
  {
    "width": 1440,
    "path": "/privacy",
    "status": 200,
    "old_visible_brand": false,
    "overflow": 0,
    "errors": []
  },
  {
    "width": 1440,
    "path": "/pricing",
    "status": 200,
    "old_visible_brand": false,
    "overflow": 0,
    "errors": []
  },
  {
    "width": 1440,
    "path": "/learn",
    "status": 200,
    "old_visible_brand": false,
    "overflow": 0,
    "errors": []
  },
  {
    "width": 1440,
    "path": "/gifting",
    "status": 200,
    "old_visible_brand": false,
    "overflow": 0,
    "errors": []
  },
  {
    "width": 1440,
    "path": "/aurum",
    "status": 200,
    "old_visible_brand": false,
    "overflow": 0,
    "errors": []
  }
]
```

## Tests and preview

Full `bun run test` exit 1 before tests executed (isolated stack startup):

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
[31m[1mSerialized Error:[22m[39m [90m{ status: 1, signal: null, output: [ null, null, null ], pid: 8337, stdout: null, stderr: null }[39m



error: script "test" exited with code 1
```

Focused tests retry with configLoader runner (temporary config, no project test isolation edits; mocked/pure tests only):

```text

[1m[30m[46m RUN [49m[39m[22m [36mv5.0.1 [39m[90m/dev-server[39m

 [32m✓[39m src/lib/gift-delivery.server.test.ts [2m([22m[2m20 tests[22m[2m)[22m[33m 76400[2mms[22m[39m
   [32m✓[39m activation after the hold [2m(6)[22m
     [33m[2m✓[22m[39m activates a due pending card on a paid order[33m 3515[2mms[22m[39m
     [33m[2m✓[22m[39m leaves a card whose hold has not expired[33m 3536[2mms[22m[39m
     [33m[2m✓[22m[39m leaves a due card when the order is review[33m 2990[2mms[22m[39m
     [33m[2m✓[22m[39m leaves a due card when the order is disputed[33m 1554[2mms[22m[39m
     [33m[2m✓[22m[39m leaves a due card when the order is refunded[33m 1529[2mms[22m[39m
     [33m[2m✓[22m[39m activates exactly once under two concurrent runs[33m 2614[2mms[22m[39m
   [32m✓[39m delivery tick authentication [2m(2)[22m
     [33m[2m✓[22m[39m rejects a missing secret with 401 and touches nothing[33m 722[2mms[22m[39m
   [32m✓[39m delivery switches [2m(3)[22m
     [33m[2m✓[22m[39m does nothing while delivery is disabled[33m 4516[2mms[22m[39m
     [33m[2m✓[22m[39m does nothing while email_from is null[33m 3086[2mms[22m[39m
     [33m[2m✓[22m[39m does nothing while no email provider key is configured[33m 2376[2mms[22m[39m
   [32m✓[39m delivery happy path [2m(1)[22m
     [33m[2m✓[22m[39m delivers the card, stores only a hash, and sends exactly one email[33m 12613[2mms[22m[39m
   [32m✓[39m provider failure [2m(1)[22m
     [33m[2m✓[22m[39m keeps the card active, releases the lease and mints a different code next tick[33m 12179[2mms[22m[39m
   [32m✓[39m concurrent ticks [2m(1)[22m
     [33m[2m✓[22m[39m sends exactly one email per card[33m 6808[2mms[22m[39m
   [32m✓[39m HTML escaping [2m(2)[22m
     [33m[2m✓[22m[39m escapes an injected gift message[33m 5374[2mms[22m[39m
   [32m✓[39m code format and normalisation [2m(3)[22m
     [33m[2m✓[22m[39m matches a delivered card through every variant and rejects a wrong code[33m 6415[2mms[22m[39m
 [32m✓[39m src/lib/aurum/ai/run.test.ts [2m([22m[2m21 tests[22m[2m)[22m[32m 20[2mms[22m[39m
[90mstderr[2m | src/lib/aurum/ai/manual.test.ts[2m > [22m[2mgenerateDraftFromPrompt core[2m > [22m[2mreturns a clean error when the provider fails or throws
[22m[39m[aurum-ai-manual] failed to record usage Error: db

 [32m✓[39m src/lib/aurum/ai/manual.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 15[2mms[22m[39m
 [32m✓[39m src/lib/link-audit/analyze.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 17[2mms[22m[39m
 [32m✓[39m src/lib/link-audit/phase2-fixes.test.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 4[2mms[22m[39m

[2m Test Files [22m [1m[32m5 passed[39m[22m[90m (5)[39m
[2m      Tests [22m [1m[32m69 passed[39m[22m[90m (69)[39m
[2m   Start at [22m 18:10:21
[2m   Duration [22m 78.36s[2m (tests 98%, import 2%)[22m

```

Initial focused run failed due to temporary config bundling attempting /node_modules/.vite-temp; runner retry passed. Automatic preview build:

```text
=== build 2026-10-18T18:10:04Z ===
build OK
```

Manual typecheck/build not run: prohibited by platform instructions. The requested three manual gates did not all pass. No live test opt-in enabled or isolation guard changed. Tests used mocks; no live database test writes.

## Final remaining matches

Search included entire project source, scripts, public, seed/migration files, docs and hidden planning files; excluded dependencies, Git, generated build/cache artifacts, environment files and the secret-related admin-password module. The explicitly permitted backup file was excluded from this result. Report excluded itself to avoid recursive matches. Secret-related module listed by filename only; no secret values inspected or printed. Binary filename matches are recorded separately below. Thus this is a non-secret textual inventory, not a claim of a secret-complete zero-match audit.

Remaining categories:
- Permitted mandala paths/imports and existing sqootpure social links.
- Payment metadata/catalog keys and ledger-write migration identifiers (compatibility).
- Local isolated-test paths/environment variable names and matching fixtures (compatibility).
- Old name in legacy AI allowlist and backfill user-agent (preserved technical behavior).
- Original asset pointer metadata, original logo filename, mandala filename variant, and original design-reference filename (retained media/reference).
- Historical audit data/observations, verification reports and archived plans (evidence).
- Password-related module (secret handling; value not included).

Exact remaining non-secret file/line inventory:

- `./.lovable/plan/add-the-aurum-route-shell-2026-09-16.md`: 4
- `./.lovable/plan/correct-the-sqoot-pure-gift-card-visual-2026-09-21.md`: 1, 9
- `./.lovable/plan/match-the-us-only-trust-icon-to-the-reference-2026-09-01.md`: 14
- `./.lovable/plan/polish-the-global-aurum-cta-2026-09-21.md`: 9
- `./.lovable/plan/rebalance-aurum-surfaces-2026-09-20.md`: 5
- `./.lovable/plan/rebuild-the-knowledge-center-2026-09-03.md`: 6
- `./.lovable/plan/rebuild-the-sqoot-gifting-redesign-2026-09-03.md`: 1, 10
- `./.lovable/plan/rebuild-the-sqoot-pure-about-page-2026-09-03.md`: 1
- `./.lovable/plan/refine-the-homepage-trust-banner-2026-09-01.md`: 16
- `./.lovable/plan/refine-the-landing-page-typography-and-ui-rhythm-2026-09-01.md`: 4
- `./.lovable/plan/replace-engraving-with-gift-cards-2026-09-19.md`: 9, 11
- `./.lovable/plan/sqoot-pure-weight-and-hero-wrap-correction-2026-09-01.md`: 1
- `./.lovable/plan/standardize-inner-page-heroes-2026-09-09.md`: 25
- `./DESIGN_SYSTEM.md`: 458
- `./README.md`: 5
- `./docs/security/gift-card-threat-model.md`: 1
- `./docs/verification/C7a.md`: 1, 7, 8, 9, 13
- `./docs/verification/COPY-UPDATE-2026-09-26.md`: 30, 31, 51, 52, 75, 76, 78, 79, 84, 85, 96, 97, 129, 130, 153, 154, 156, 157, 240, 241, 243, 244, 294, 295, 318, 319, 324, 325, 369, 370, 372, 373, 399, 400, 402, 403, 419
- `./docs/verification/HOME-PROOF-STRIP-COPY.md`: 7, 9
- `./docs/verification/LEGAL-DOCUMENTS-2026-10-17.md`: 5
- `./docs/verification/S2.md`: 22, 27
- `./docs/verification/S5.md`: 63, 70, 71, 72, 73, 74, 75, 78, 79
- `./docs/verification/S8.md`: 133
- `./docs/verification/T2.md`: 71, 72
- `./docs/verification/T5-FINAL.md`: 11, 12, 93, 118, 119, 128, 129, 139, 153, 170, 171, 183, 190
- `./docs/verification/T5-PHASE1.md`: 28, 121, 192, 193, 225
- `./docs/verification/T5-PHASE2.md`: 124, 125, 127, 128, 129, 144, 153, 206
- `./docs/verification/T5-PHASE3.md`: 32, 139, 145, 151, 152, 153, 158, 273
- `./docs/verification/T5-PHASE4.md`: 55, 56, 57, 58, 78, 79, 111, 126, 144, 145, 180, 181
- `./docs/verification/TEMP-TRUNK-LOGO-PREVIEW.md`: 8
- `./docs/verification/TRUNK-REBRAND-PHASE1.md`: 3, 4, 8
- `./docs/verification/TRUNK-REBRAND-PHASE6C.md`: 44, 45, 46
- `./docs/verification/TRUNK-SITEWIDE-TEXT.md`: 4, 5
- `./docs/verification/link-audit-2026-09-24.md`: 30, 31, 44, 56
- `./docs/verification/t5-external-evidence.json`: 4, 7, 11, 15, 33, 36, 40, 44, 166, 170, 178, 301, 305, 311, 425, 429, 435, 443, 444, 445, 455, 456, 457, 470, 471, 472, 473, 507, 508, 510, 563, 564, 566, 567, 568, 569, 627, 628, 630, 646
- `./docs/verification/t5-link-audit.json`: 45, 58, 80, 102, 163, 293, 306, 319, 332, 345, 358, 371, 384, 397, 410, 423, 436, 449, 462, 475, 488, 502, 509, 516, 523, 530, 537, 544, 551, 558, 565, 572, 579, 588, 600, 607, 614, 623, 630, 637, 740, 747, 754, 761, 810, 833, 840, 847, 873, 917, 927, 929, 942, 970, 971, 973, 976, 991, 1024, 1039, 1072, 1087, 1120, 1144, 1179, 1194, 1227, 1242, 1275, 1290, 1323, 1338, 1371, 1386, 1420, 1435, 1469, 1484, 1518, 1533, 1567, 1582, 1616, 1631, 1665, 1680, 1714, 1729, 1763, 1778, 1812, 1827, 1861, 1876, 1910, 1959, 1974, 2008, 2023, 2057, 2059, 2060, 2061, 2062, 2108, 2123, 2157, 2172, 2206, 2208, 2221, 2249, 2250, 2252, 2255, 2270, 2304, 2319, 2353, 2368, 2402, 2417, 2451, 2475, 2511, 2526, 2560, 2575, 2609, 2624, 2658, 2673, 2707, 2722, 2756, 2771, 2805, 2854, 2859, 2862, 2863, 2864, 2903, 2908, 2913, 2916, 2917, 2918, 2957, 2967, 2970, 2971, 2972, 3011, 3021, 3036, 3070, 3085, 3117, 3132, 3164, 3179, 3211, 3226, 3258, 3273, 3305, 3329, 3363, 3378, 3410, 3425, 3457, 3472, 3504, 3519, 3551, 3553, 3554, 3555, 3556, 3602, 3617, 3649, 3664, 3696, 3698, 3711, 3739, 3740, 3742, 3745, 3760, 3793, 3808, 3841, 3856, 3889, 3913, 3948, 3963, 3996, 4011, 4044, 4059, 4092, 4107, 4140, 4155, 4189, 4204, 4238, 4240, 4253, 4281, 4282, 4284, 4287, 4302, 4336, 4351, 4385, 4400, 4434, 4449, 4483, 4507, 4543, 4558, 4592, 4607, 4641, 4656, 4690, 4705, 4739, 4754, 4788, 4803, 4837, 4886, 4891, 4894, 4895, 4896, 4935, 4940, 4945, 4948, 4949, 4950, 4989, 4999, 5002, 5003, 5004, 5043, 5053, 5068, 5100, 5115, 5147, 5162, 5194, 5209, 5241, 5256, 5288, 5303, 5335, 5359, 5393, 5408, 5440, 5455, 5487, 5502, 5534, 5549, 5581, 5596, 5628, 5643, 5675, 5677, 5690, 5718, 5719, 5721, 5724, 5739, 5772, 5787, 5820, 5835, 5868, 5892, 5927, 5942, 5975, 5990, 6023, 6038, 6071, 6086, 6119, 6143, 6179, 6203, 6239, 6290, 6341, 6392, 6443, 6494, 6540, 6591, 6642, 6693, 6744, 6795, 6841, 6892, 6943, 6994, 7040, 7055, 7089, 7104, 7138, 7153, 7187, 7202, 7236, 7238, 7251, 7279, 7280, 7282, 7285, 7300, 7334, 7349, 7383, 7398, 7432, 7447, 7481, 7505, 7541, 7556, 7590, 7605, 7639, 7654, 7688, 7703, 7737, 7752, 7786, 7801, 7835, 7884, 7889, 7892, 7893, 7894, 7933, 7938, 7943, 7946, 7947, 7948, 7987, 7997, 8000, 8001, 8002, 8041, 8051, 8066, 8098, 8113, 8145, 8160, 8192, 8207, 8239, 8254, 8286, 8310, 8344, 8359, 8391, 8406, 8438, 8453, 8485, 8500, 8532, 8556, 8592, 8616, 8652, 8676, 8712, 8736, 8772, 8796, 8832, 8856, 8892, 8916, 8952, 8967, 8999, 9014, 9046, 9048, 9061, 9089, 9090, 9092, 9095, 9110, 9143, 9158, 9191, 9206, 9239, 9263, 9298, 9313, 9346, 9361, 9394, 9409, 9442, 9457, 9490, 9514, 9550, 9601, 9652, 9703, 9754, 9805, 9851, 9902, 9953, 10004, 10055, 10106, 10152, 10203, 10254, 10305, 10351, 10353, 10366, 10394, 10395, 10397, 10400, 10415, 10449, 10464, 10498, 10513, 10547, 10562, 10596, 10620, 10656, 10671, 10705, 10720, 10754, 10769, 10803, 10818, 10852, 10867, 10901, 10916, 10950, 10999, 11004, 11007, 11008, 11009, 11048, 11053, 11058, 11061, 11062, 11063, 11102, 11112, 11115, 11116, 11117, 11156, 11166, 11181, 11213, 11228, 11260, 11275, 11307, 11322, 11354, 11369, 11401, 11425, 11459, 11474, 11506, 11521, 11553, 11568, 11600, 11615, 11647, 11662, 11694, 11709, 11743, 11756, 11784, 11785, 11787, 11805, 11853, 11901, 11958, 12008, 12056, 12104, 12152, 12470, 12506, 12519, 12547, 12548, 12550, 12568, 12617, 12666, 12715, 12773, 12824, 12873, 12922, 12971, 13020, 13069, 13152, 13160, 13161, 13162, 13201, 13206, 13214, 13215, 13216, 13255, 13268, 13269, 13270, 13309, 13334, 13381, 13428, 13475, 13522, 13578, 13627, 13674, 13721, 13768, 13815, 13862, 13896, 13909, 13937, 13938, 13940, 13958, 14006, 14054, 14111, 14161, 14209, 14257, 14305, 14623, 14659, 14672, 14700, 14701, 14703, 14721, 14770, 14819, 14868, 14926, 14977, 15026, 15075, 15124, 15173, 15222, 15305, 15313, 15314, 15315, 15354, 15359, 15367, 15368, 15369, 15408, 15421, 15422, 15423, 15462, 15487, 15534, 15581, 15628, 15675, 15731, 15780, 15827, 15874, 15921, 15968, 16015, 16049, 16062, 16090, 16091, 16093, 16111, 16159, 16207, 16264, 16314, 16362, 16410, 16458, 16668, 16704, 16717, 16745, 16746, 16748, 16766, 16815, 16864, 16913, 16971, 17022, 17071, 17120, 17169, 17218, 17267, 17350, 17358, 17359, 17360, 17399, 17404, 17412, 17413, 17414, 17453, 17466, 17467, 17468, 17507, 17532, 17579, 17626, 17673, 17720, 17776, 17825, 17872, 17919, 17966, 18013, 18060, 18092, 18094, 18107, 18135, 18136, 18138, 18141, 18156, 18189, 18204, 18237, 18252, 18285, 18309, 18344, 18359, 18392, 18407, 18440, 18455, 18488, 18503, 18536, 18560, 18596, 18642, 18693, 18739, 18785, 18787, 18800, 18828, 18829, 18831, 18834, 18849, 18883, 18898, 18932, 18947, 18981, 18996, 19030, 19054, 19090, 19105, 19139, 19154, 19188, 19203, 19237, 19252, 19286, 19301, 19335, 19350, 19384, 19433, 19438, 19441, 19442, 19443, 19482, 19487, 19492, 19495, 19496, 19497, 19536, 19546, 19549, 19550, 19551, 19590, 19600, 19615, 19647, 19662, 19694, 19709, 19741, 19756, 19788, 19803, 19835, 19859, 19893, 19908, 19940, 19955, 19987, 20002, 20034, 20049, 20081, 20096, 20128, 20143, 20177, 20190, 20218, 20219, 20221, 20239, 20287, 20335, 20392, 20442, 20490, 20538, 20586, 20742, 20778, 20791, 20819, 20820, 20822, 20840, 20889, 20938, 20987, 21045, 21096, 21145, 21194, 21243, 21292, 21341, 21424, 21432, 21433, 21434, 21473, 21478, 21486, 21487, 21488, 21527, 21540, 21541, 21542, 21581, 21606, 21653, 21700, 21747, 21794, 21850, 21899, 21946, 21993, 22040, 22087, 22134, 22168, 22181, 22209, 22210, 22212, 22230, 22278, 22326, 22383, 22433, 22481, 22529, 22577, 22625, 22661, 22674, 22702, 22703, 22705, 22723, 22772, 22821, 22870, 22928, 22979, 23028, 23077, 23126, 23175, 23224, 23307, 23315, 23316, 23317, 23356, 23361, 23369, 23370, 23371, 23410, 23423, 23424, 23425, 23464, 23489, 23536, 23583, 23630, 23677, 23733, 23782, 23829, 23876, 23923, 23970, 24017, 24051, 24064, 24092, 24093, 24095, 24113, 24161, 24209, 24266, 24316, 24364, 24412, 24460, 24562, 24598, 24611, 24639, 24640, 24642, 24660, 24709, 24758, 24807, 24865, 24916, 24965, 25014, 25063, 25112, 25161, 25244, 25252, 25253, 25254, 25293, 25298, 25306, 25307, 25308, 25347, 25360, 25361, 25362, 25401, 25426, 25473, 25520, 25567, 25614, 25670, 25719, 25766, 25813, 25860, 25907, 25954, 25988, 26001, 26029, 26030, 26032, 26050, 26098, 26146, 26203, 26253, 26301, 26349, 26397, 26445, 26481, 26494, 26522, 26523, 26525, 26543, 26592, 26641, 26690, 26748, 26799, 26848, 26897, 26946, 26995, 27044, 27127, 27135, 27136, 27137, 27176, 27181, 27189, 27190, 27191, 27230, 27243, 27244, 27245, 27284, 27309, 27356, 27403, 27450, 27497, 27553, 27602, 27649, 27696, 27743, 27790, 27837, 27871, 27884, 27912, 27913, 27915, 27933, 27981, 28029, 28086, 28136, 28184, 28232, 28280, 28490, 28526, 28539, 28567, 28568, 28570, 28588, 28637, 28686, 28735, 28793, 28844, 28893, 28942, 28991, 29040, 29089, 29172, 29180, 29181, 29182, 29221, 29226, 29234, 29235, 29236, 29275, 29288, 29289, 29290, 29329, 29354, 29401, 29448, 29495, 29542, 29598, 29647, 29694, 29741, 29788, 29835, 29882, 29916, 29929, 29957, 29958, 29960, 29978, 30026, 30074, 30131, 30181, 30229, 30277, 30325, 30589, 30625, 30638, 30666, 30667, 30669, 30687, 30736, 30785, 30834, 30892, 30943, 30992, 31041, 31090, 31139, 31188, 31271, 31279, 31280, 31281, 31320, 31325, 31333, 31334, 31335, 31374, 31387, 31388, 31389, 31428, 31453, 31500, 31547, 31594, 31641, 31697, 31746, 31793, 31840, 31887, 31934, 31981, 32015, 32028, 32056, 32057, 32059, 32077, 32125, 32173, 32230, 32280, 32328, 32376, 32424, 32580, 32616, 32629, 32657, 32658, 32660, 32678, 32727, 32776, 32825, 32883, 32934, 32983, 33032, 33081, 33130, 33179, 33262, 33270, 33271, 33272, 33311, 33316, 33324, 33325, 33326, 33365, 33378, 33379, 33380, 33419, 33444, 33491, 33538, 33585, 33632, 33688, 33737, 33784, 33831, 33878, 33925, 33972, 34006, 34019, 34047, 34048, 34050, 34068, 34116, 34164, 34221, 34271, 34319, 34367, 34415, 34571, 34607, 34620, 34648, 34649, 34651, 34669, 34718, 34767, 34816, 34874, 34925, 34974, 35023, 35072, 35121, 35170, 35253, 35261, 35262, 35263, 35302, 35307, 35315, 35316, 35317, 35356, 35369, 35370, 35371, 35410, 35435, 35482, 35529, 35576, 35623, 35679, 35728, 35775, 35822, 35869, 35916, 35963, 35997, 36010, 36038, 36039, 36041, 36059, 36107, 36155, 36212, 36262, 36310, 36358, 36406, 36562, 36598, 36611, 36639, 36640, 36642, 36660, 36709, 36758, 36807, 36865, 36916, 36965, 37014, 37063, 37112, 37161, 37244, 37252, 37253, 37254, 37293, 37298, 37306, 37307, 37308, 37347, 37360, 37361, 37362, 37401, 37426, 37473, 37520, 37567, 37614, 37670, 37719, 37766, 37813, 37860, 37907, 37954, 37986, 37988, 38001, 38029, 38030, 38032, 38035, 38050, 38083, 38098, 38131, 38146, 38179, 38203, 38238, 38253, 38286, 38301, 38334, 38349, 38382, 38397, 38430, 38432, 38433, 38434, 38435, 38481, 38483, 38484, 38485, 38486, 38535, 38537, 38538, 38539, 38540, 38589, 38638, 38643, 38645, 38646, 38647, 38648, 38687, 38692, 38697, 38699, 38700, 38701, 38702, 38741, 38751, 38753, 38754, 38755, 38756, 38795, 38805, 38807, 38820, 38848, 38849, 38851, 38854, 38869, 38903, 38918, 38952, 38967, 39001, 39016, 39050, 39074, 39110, 39125, 39159, 39174, 39208, 39223, 39257, 39272, 39306, 39321, 39355, 39370, 39404, 39453, 39458, 39461, 39462, 39463, 39502, 39507, 39512, 39515, 39516, 39517, 39556, 39566, 39569, 39570, 39571, 39610, 39620, 39635, 39667, 39682, 39714, 39729, 39761, 39776, 39808, 39823, 39855, 39879, 39913, 39928, 39960, 39975, 40007, 40022, 40054, 40069, 40101, 40116, 40148, 40163, 40195, 40197, 40210, 40238, 40239, 40241, 40244, 40259, 40292, 40307, 40340, 40355, 40388, 40412, 40447, 40462, 40495, 40510, 40543, 40558, 40591, 40606, 40639, 40641, 40654, 40682, 40683, 40685, 40688, 40703, 40737, 40752, 40786, 40801, 40835, 40850, 40884, 40908, 40944, 40959, 40993, 41008, 41042, 41057, 41091, 41106, 41140, 41155, 41189, 41204, 41238, 41287, 41292, 41295, 41296, 41297, 41336, 41341, 41346, 41349, 41350, 41351, 41390, 41400, 41403, 41404, 41405, 41444, 41454, 41469, 41501, 41516, 41548, 41563, 41595, 41610, 41642, 41657, 41689, 41713, 41747, 41762, 41794, 41809, 41841, 41856, 41888, 41903, 41935, 41950, 41984, 41999, 42016, 42033, 42048, 42080, 42095, 42127, 42129, 42142, 42170, 42171, 42173, 42176, 42191, 42224, 42239, 42272, 42287, 42320, 42344, 42379, 42394, 42427, 42442, 42475, 42490, 42523, 42538, 42571, 42586, 42620, 42674, 42728, 42782, 42784, 42797, 42825, 42826, 42828, 42831, 42846, 42880, 42895, 42929, 42944, 42978, 42993, 43027, 43051, 43087, 43102, 43136, 43151, 43185, 43200, 43234, 43249, 43283, 43298, 43332, 43347, 43381, 43430, 43435, 43438, 43439, 43440, 43479, 43484, 43489, 43492, 43493, 43494, 43533, 43543, 43546, 43547, 43548, 43587, 43597, 43612, 43646, 43661, 43693, 43708, 43740, 43755, 43787, 43802, 43834, 43849, 43881, 43905, 43939, 43954, 43986, 44001, 44033, 44048, 44080, 44095, 44127, 44142, 44174, 44189, 44221, 44223, 44236, 44264, 44265, 44267, 44270, 44285, 44318, 44333, 44366, 44381, 44414, 44438, 44473, 44488, 44521, 44536, 44569, 44584, 44617, 44632, 44665, 44680, 44709, 44714, 44729, 44763, 44778, 44812, 44827, 44861, 44863, 44876, 44904, 44905, 44907, 44910, 44925, 44959, 44974, 45008, 45023, 45057, 45072, 45106, 45130, 45166, 45181, 45215, 45230, 45264, 45279, 45313, 45328, 45362, 45377, 45411, 45426, 45460, 45509, 45514, 45517, 45518, 45519, 45558, 45563, 45568, 45571, 45572, 45573, 45612, 45622, 45625, 45626, 45627, 45666, 45676, 45691, 45725, 45740, 45772, 45787, 45819, 45834, 45866, 45881, 45913, 45928, 45960, 45984, 46018, 46033, 46065, 46080, 46112, 46127, 46159, 46174, 46206, 46221, 46253, 46268, 46300, 46302, 46315, 46343, 46344, 46346, 46349, 46364, 46397, 46412, 46445, 46460, 46493, 46517, 46552, 46567, 46600, 46615, 46648, 46663, 46696, 46711, 46744, 46759, 46793, 46808, 46842, 46857, 46891, 46893, 46906, 46934, 46935, 46937, 46940, 46955, 46989, 47004, 47038, 47053, 47087, 47102, 47136, 47160, 47196, 47211, 47245, 47260, 47294, 47309, 47343, 47358, 47392, 47407, 47441, 47456, 47490, 47539, 47544, 47547, 47548, 47549, 47588, 47593, 47598, 47601, 47602, 47603, 47642, 47652, 47655, 47656, 47657, 47696, 47706, 47721, 47753, 47768, 47800, 47815, 47847, 47862, 47894, 47909, 47941, 47956, 47988, 48012, 48046, 48061, 48093, 48108, 48140, 48155, 48187, 48202, 48234, 48249, 48281, 48296, 48328, 48330, 48343, 48371, 48372, 48374, 48377, 48392, 48425, 48440, 48473, 48488, 48521, 48545, 48580, 48595, 48628, 48643, 48676, 48691, 48724, 48739, 48772, 48787, 48821, 48836, 48870, 48885, 48919, 48934, 48968, 48983, 49017, 49032, 49066, 49068, 49081, 49109, 49110, 49112, 49115, 49130, 49164, 49179, 49213, 49228, 49262, 49277, 49311, 49335, 49371, 49386, 49420, 49435, 49469, 49484, 49518, 49533, 49567, 49582, 49616, 49631, 49665, 49714, 49719, 49722, 49723, 49724, 49763, 49768, 49773, 49776, 49777, 49778, 49817, 49827, 49830, 49831, 49832, 49871, 49881, 49896, 49928, 49943, 49975, 49990, 50022, 50037, 50069, 50084, 50116, 50140, 50174, 50189, 50221, 50236, 50268, 50283, 50315, 50330, 50362, 50377, 50409, 50424, 50456, 50458, 50471, 50499, 50500, 50502, 50505, 50520, 50553, 50568, 50601, 50616, 50649, 50673, 50708, 50723, 50756, 50771, 50804, 50819, 50852, 50867, 50900, 50915, 50949, 50964, 50998, 51013, 51047, 51062, 51096, 51111, 51145, 51160, 51194, 51209, 51243, 51258, 51292, 51307, 51341, 51392, 51446, 51495, 51544, 51593, 51642, 51691, 51740, 51789, 51838, 51887, 51902, 51936, 51951, 51985, 51987, 52000, 52028, 52029, 52031, 52034, 52049, 52083, 52098, 52132, 52147, 52181, 52196, 52230, 52254, 52290, 52305, 52339, 52354, 52388, 52403, 52437, 52452, 52486, 52501, 52535, 52550, 52584, 52633, 52638, 52641, 52642, 52643, 52682, 52687, 52692, 52695, 52696, 52697, 52736, 52746, 52749, 52750, 52751, 52790, 52800, 52815, 52849, 52864, 52896, 52911, 52943, 52958, 52990, 53005, 53037, 53052, 53084, 53108, 53142, 53157, 53189, 53204, 53236, 53251, 53283, 53298, 53330, 53345, 53377, 53392, 53424, 53426, 53439, 53467, 53468, 53470, 53473, 53488, 53521, 53536, 53569, 53584, 53617, 53641, 53676, 53691, 53724, 53739, 53772, 53787, 53820, 53835, 53868, 53870, 53883, 53890, 53917, 53919, 53932, 53960, 53961, 53963, 53966, 53981, 54015, 54030, 54064, 54079, 54113, 54128, 54162, 54186, 54222, 54237, 54271, 54286, 54320, 54335, 54369, 54384, 54418, 54433, 54467, 54482, 54516, 54565, 54570, 54573, 54574, 54575, 54614, 54619, 54624, 54627, 54628, 54629, 54668, 54678, 54681, 54682, 54683, 54722, 54732, 54747, 54781, 54796, 54828, 54843, 54875, 54890, 54922, 54937, 54969, 54984, 55016, 55040, 55074, 55089, 55121, 55136, 55168, 55183, 55215, 55230, 55262, 55277, 55309, 55324, 55356, 55358, 55371, 55399, 55400, 55402, 55405, 55420, 55453, 55468, 55501, 55516, 55549, 55573, 55608, 55623, 55656, 55671, 55704, 55719, 55752, 55767, 55800, 55802, 55815, 55822, 55849, 55851, 55864, 55892, 55893, 55895, 55898, 55913, 55947, 55962, 55996, 56011, 56045, 56060, 56094, 56118, 56154, 56169, 56203, 56218, 56252, 56267, 56301, 56316, 56350, 56365, 56399, 56414, 56448, 56497, 56502, 56505, 56506, 56507, 56546, 56551, 56556, 56559, 56560, 56561, 56600, 56610, 56613, 56614, 56615, 56654, 56664, 56679, 56713, 56728, 56760, 56775, 56807, 56822, 56854, 56869, 56901, 56916, 56948, 56972, 57006, 57021, 57053, 57068, 57100, 57115, 57147, 57162, 57194, 57209, 57241, 57256, 57288, 57290, 57303, 57331, 57332, 57334, 57337, 57352, 57385, 57400, 57433, 57448, 57481, 57505, 57540, 57555, 57588, 57603, 57636, 57651, 57684, 57699, 57732, 57734, 57747, 57754, 57781, 57783, 57796, 57824, 57825, 57827, 57830, 57845, 57879, 57894, 57928, 57943, 57977, 57992, 58026, 58050, 58086, 58101, 58135, 58150, 58184, 58199, 58233, 58248, 58282, 58297, 58331, 58346, 58380, 58429, 58434, 58437, 58438, 58439, 58478, 58483, 58488, 58491, 58492, 58493, 58532, 58542, 58545, 58546, 58547, 58586, 58596, 58611, 58645, 58660, 58692, 58707, 58739, 58754, 58786, 58801, 58833, 58848, 58880, 58904, 58938, 58953, 58985, 59000, 59032, 59047, 59079, 59094, 59126, 59141, 59173, 59188, 59220, 59222, 59235, 59263, 59264, 59266, 59269, 59284, 59317, 59332, 59365, 59380, 59413, 59437, 59472, 59487, 59520, 59535, 59568, 59583, 59616, 59631, 59664, 59679, 59713, 59728, 59762, 59764, 59777, 59805, 59806, 59808, 59811, 59826, 59860, 59875, 59909, 59924, 59958, 59973, 60007, 60031, 60067, 60082, 60116, 60131, 60165, 60180, 60214, 60229, 60263, 60278, 60312, 60327, 60361, 60410, 60415, 60418, 60419, 60420, 60459, 60464, 60469, 60472, 60473, 60474, 60513, 60523, 60526, 60527, 60528, 60567, 60577, 60592, 60626, 60641, 60673, 60688, 60720, 60735, 60767, 60782, 60814, 60829, 60861, 60885, 60919, 60934, 60966, 60981, 61013, 61028, 61060, 61075, 61107, 61122, 61154, 61169, 61201, 61203, 61216, 61244, 61245, 61247, 61250, 61265, 61298, 61313, 61346, 61361, 61394, 61418, 61453, 61468, 61501, 61516, 61549, 61564, 61597, 61612, 61645, 61660, 61694, 61696, 61697, 61698, 61699, 61745, 61760, 61794, 61796, 61809, 61837, 61838, 61840, 61843, 61858, 61892, 61907, 61941, 61956, 61990, 62005, 62039, 62063, 62099, 62114, 62148, 62163, 62197, 62212, 62246, 62261, 62295, 62310, 62344, 62359, 62393, 62442, 62447, 62450, 62451, 62452, 62491, 62496, 62501, 62504, 62505, 62506, 62545, 62555, 62558, 62559, 62560, 62599, 62609, 62624, 62658, 62673, 62705, 62720, 62752, 62767, 62799, 62814, 62846, 62861, 62893, 62917, 62951, 62966, 62998, 63013, 63045, 63060, 63092, 63107, 63139, 63154, 63186, 63201, 63233, 63235, 63248, 63276, 63277, 63279, 63282, 63297, 63330, 63345, 63378, 63393, 63426, 63450, 63485, 63500, 63533, 63548, 63581, 63596, 63629, 63644, 63677, 63692, 63726, 63741, 63775, 63790, 63824, 63839, 63873, 63888, 63922, 63937, 63971, 63986, 64020, 64035, 64069, 64084, 64118, 64133, 64167, 64182, 64216, 64231, 64265, 64280, 64314, 64316, 64329, 64357, 64358, 64360, 64363, 64378, 64412, 64427, 64461, 64476, 64510, 64525, 64559, 64583, 64619, 64634, 64668, 64683, 64717, 64732, 64766, 64781, 64815, 64830, 64864, 64879, 64913, 64962, 64967, 64970, 64971, 64972, 65011, 65016, 65021, 65024, 65025, 65026, 65065, 65075, 65078, 65079, 65080, 65119, 65129, 65144, 65178, 65193, 65225, 65240, 65272, 65287, 65319, 65334, 65366, 65381, 65413, 65437, 65471, 65486, 65518, 65533, 65565, 65580, 65612, 65627, 65659, 65674, 65706, 65721, 65753, 65755, 65768, 65796, 65797, 65799, 65802, 65817, 65850, 65865, 65898, 65913, 65946, 65970, 66005, 66020, 66053, 66068, 66101, 66116, 66149, 66164, 66197, 66212, 66246, 66261, 66295, 66310, 66344, 66359, 66393, 66408, 66442, 66457, 66491, 66506, 66540, 66555, 66589, 66604, 66638, 66653, 66687, 66702, 66736, 66751, 66785, 66800, 66834, 66849, 66883, 66898, 66932, 66947, 66981, 66996, 67030, 67032, 67045, 67073, 67074, 67076, 67079, 67094, 67128, 67143, 67177, 67192, 67226, 67241, 67275, 67299, 67335, 67350, 67384, 67399, 67433, 67448, 67482, 67497, 67531, 67546, 67580, 67595, 67629, 67678, 67683, 67686, 67687, 67688, 67727, 67732, 67737, 67740, 67741, 67742, 67781, 67791, 67794, 67795, 67796, 67835, 67845, 67860, 67894, 67909, 67941, 67956, 67988, 68003, 68035, 68050, 68082, 68097, 68129, 68153, 68187, 68202, 68234, 68249, 68281, 68296, 68328, 68343, 68375, 68390, 68422, 68437, 68469, 68471, 68484, 68512, 68513, 68515, 68518, 68533, 68566, 68581, 68614, 68629, 68662, 68686, 68721, 68736, 68769, 68784, 68817, 68832, 68865, 68880, 68913, 68928, 68962, 68965, 68966, 68967, 69013, 69015, 69016, 69017, 69018, 69064, 69066, 69079, 69107, 69108, 69110, 69113, 69128, 69162, 69177, 69211, 69226, 69260, 69275, 69309, 69333, 69369, 69384, 69418, 69433, 69467, 69482, 69516, 69531, 69565, 69580, 69614, 69629, 69663, 69712, 69717, 69720, 69721, 69722, 69761, 69766, 69771, 69774, 69775, 69776, 69815, 69825, 69828, 69829, 69830, 69869, 69879, 69894, 69926, 69941, 69973, 69988, 70020, 70035, 70067, 70082, 70114, 70129, 70161, 70185, 70219, 70234, 70266, 70281, 70313, 70328, 70360, 70375, 70407, 70422, 70454, 70469, 70501, 70503, 70516, 70544, 70545, 70547, 70550, 70565, 70598, 70613, 70646, 70661, 70694, 70718, 70753, 70768, 70801, 70816, 70849, 70864, 70897, 70912, 70945, 70960, 70994, 71009, 71043, 71058, 71092, 71107, 71141, 71156, 71190, 71205, 71239, 71254, 71288, 71290, 71303, 71331, 71332, 71334, 71337, 71352, 71386, 71401, 71435, 71450, 71484, 71499, 71533, 71557, 71593, 71608, 71642, 71657, 71691, 71706, 71740, 71755, 71789, 71804, 71838, 71853, 71887, 71936, 71941, 71944, 71945, 71946, 71985, 71990, 71995, 71998, 71999, 72000, 72039, 72049, 72052, 72053, 72054, 72093, 72103, 72118, 72152, 72167, 72199, 72214, 72246, 72261, 72293, 72308, 72340, 72355, 72387, 72411, 72445, 72460, 72492, 72507, 72539, 72554, 72586, 72601, 72633, 72648, 72680, 72695, 73237, 73366, 73367, 73368, 73372, 73376, 73377, 73382, 73385, 73386, 73388, 73392, 73395, 73396, 73398, 73562, 73572
- `./drizzle/migrations/0009_commerce_foundation.sql`: 1, 154, 215, 224
- `./scripts/s5-catalog-probe.ts`: 45
- `./scripts/test-db/down.sh`: 5, 14
- `./scripts/test-db/up.sh`: 8, 11, 14, 15, 16, 22
- `./src/assets/sqoot-pure-hero-background.jpg.asset.json`: 5, 6, 7
- `./src/assets/sqoot-pure-mandala.png.asset.json`: 5, 6, 7
- `./src/assets/sqoot-pure-product-comparison.png.asset.json`: 5, 6, 7
- `./src/components/aurum-floating-button.tsx`: 4
- `./src/components/aurum-floating-nav.tsx`: 3
- `./src/components/site-chrome.tsx`: 374, 375, 376
- `./src/lib/aurum/ai/persistence-db.test.ts`: 18
- `./src/lib/aurum/ai/verify.ts`: 43
- `./src/lib/aurum/publish-rpc.test.ts`: 19
- `./src/lib/aurum/review-archive-db.test.ts`: 18
- `./src/lib/aurum/review-restore-db.test.ts`: 18
- `./src/lib/aurum/review-return-db.test.ts`: 18
- `./src/lib/aurum/review-transition-db.test.ts`: 15
- `./src/lib/commerce-checkout.server.test.ts`: 25
- `./src/lib/commerce/session-params.test.ts`: 70
- `./src/lib/commerce/session-params.ts`: 60, 66
- `./src/lib/commerce/stripe-catalog.server.ts`: 103, 189
- `./src/lib/commerce/stripe-catalog.test.ts`: 27, 174, 206, 265
- `./src/lib/link-audit/analyze.test.ts`: 59
- `./src/lib/link-audit/external.ts`: 49, 53, 61, 64, 66, 67
- `./src/lib/link-audit/semantic.ts`: 81, 82, 83
- `./src/lib/newsletter/newsletter-schema-db.test.ts`: 19
- `./src/lib/stripe-webhook-refunds.server.test.ts`: 58, 177, 187
- `./src/lib/stripe-webhook.server.test.ts`: 54
- `./src/lib/stripe-webhook.server.ts`: 119, 203, 280
- `./src/routes/about-us.tsx`: 6, 126, 131, 132, 168
- `./src/routes/api/public/aurum-backfill-daily-history.ts`: 41
- `./src/routes/contact.tsx`: 55, 56, 57
- `./src/routes/early-access.tsx`: 7, 118, 211
- `./src/routes/fractional-gold.tsx`: 18, 158
- `./src/routes/gifting.tsx`: 44, 45, 532, 540
- `./src/routes/trust-center.tsx`: 10, 371, 374
- `./src/test/global-setup.ts`: 10, 15, 20, 23
- `./src/test/setup-isolated.ts`: 10

Filename-only retained brand assets: `src/assets/sqoot-pure-logo.png`, `src/assets/sqoot-mandala.png`, `src/assets/sqoot-pure-mandala.png.asset.json`, `src/assets/sqoot-pure-hero-background.jpg.asset.json`, `src/assets/sqoot-pure-product-comparison.png.asset.json`.

Secret-related excluded file: `src/lib/admin-password.server.ts` (value deliberately not read back).
