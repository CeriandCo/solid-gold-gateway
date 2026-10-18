# AURUM — MELT newsletter invitation

## Changes
- Replaced the subscription form, Daily Note / Weekly Brief choices, and email input with a cleaner unframed invitation headed “The MELT Newsletter & more”.
- Added deeper-learning marketing copy and three supporting benefits.
- “Join AURUM” opens the supplied https://aurum-be0064.circle.so/ in a new tab with `noopener noreferrer`.
- No newsletter server logic, consent definition, database rows, editorial sections, or shared header/footer changed. Nothing published.

## Browser verification
Chromium at localhost; screenshots inspected at 375 and 1440, with measurements at all three widths:

```text
width=375 sectionWidth=375 inputs=0 scrollBefore=9591 scrollAfter=9591 overflow=0 runtimeErrors=[]
width=768 sectionWidth=768 inputs=0 scrollBefore=8528 scrollAfter=8528 overflow=0 runtimeErrors=[]
width=1440 sectionWidth=1440 inputs=0 scrollBefore=5397 scrollAfter=5397 overflow=0 runtimeErrors=[]
joinHref=https://aurum-be0064.circle.so/
```

Actual clicks opened the correct Circle host at every width and left the original page scroll position unchanged. Circle displayed a Cloudflare challenge URL; membership/signup inside Circle was not verified. No local signup request was made.

## Tests and preview checks
Ran `bun run test`; it exited 1 during isolated database global setup, before tests executed:

```text
No test files found, exiting with code 1
Error: Command failed: bash /dev-server/scripts/test-db/up.sh
Object.setup src/test/global-setup.ts:17:5
error: script "test" exited with code 1
```

Latest automatic preview check:

```text
=== build 2026-10-18T12:17:39Z ===
build OK
```

Manual typecheck and build were not run, per environment instructions. All requested gates cannot be claimed as passed. Existing page-head declarations were inspected; this task did not change route metadata.