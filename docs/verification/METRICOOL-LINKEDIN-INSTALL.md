# Metricool and LinkedIn installation

## Changes
- Added `src/lib/analytics/metricool.ts` and `linkedin.ts`, their unit tests, and calls beside `initGA4()` in the root pathname effect.
- Both use shared `PROD_HOSTS` and `isExcludedPath`, are client-only and load their scripts once. Internal browsers (`trunk_internal=1`) are skipped because neither tag supports the existing GA4 internal classification.
- Metricool uses the supplied hash, tracks initially after script load and on later public pathname changes without duplicating initial tracking.
- LinkedIn uses partner ID `559237849`, sets the partner globals and queue stub; exports `trackLinkedInConversion(conversionId)`. No application conversion calls added.
- No repository CSP found. If one is later added, allow `tracker.metricool.com`, `snap.licdn.com` and `px.ads.linkedin.com` in the relevant script/connect/image directives.
- Existing GA4/Amplitude behavior and the previously requested static Metricool image remain unchanged. That old image is still ungated and can generate an additional Metricool request; the new script gating does not govern it.
- No page UI/copy changes, database writes, or publishing.

## Verification
Focused tests used a temporary database-free Vitest config with mocked browser globals; no database protection was changed.
Command: `bunx vitest run --config /tmp/marketing-tags.vitest.config.mts --configLoader runner`

```text

[1m[30m[46m RUN [49m[39m[22m [36mv5.0.1 [39m[90m/dev-server[39m

 [32m✓[39m src/lib/analytics/ga4.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m src/lib/analytics/metricool.test.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 7[2mms[22m[39m
 [32m✓[39m src/lib/analytics/linkedin.test.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 7[2mms[22m[39m

[2m Test Files [22m [1m[32m3 passed[39m[22m[90m (3)[39m
[2m      Tests [22m [1m[32m11 passed[39m[22m[90m (11)[39m
[2m   Start at [22m 06:43:05
[2m   Duration [22m 167ms[2m (transform 69%, import 16%, tests 10%, worker 5%)[22m

```

Browser verification served the local app under an intercepted production origin, replacing vendor scripts with local recording stubs and blocking other external traffic. This verifies app initialization and SPA behavior, not vendor receipt or the published build. Initial count 1, navigation count 2, one script each, no queued conversions at 375/768/1440. Localhost script count 0.

```text
Skipping host requirements validation logic because `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS` env variable is set.
{"width": 375, "firstLoad": {"metricool": 1, "linkedin": 1}, "afterNavigation": {"path": "/privacy", "calls": [{"path": "/", "hash": "d50f9e1e0e1d26d82d2786ce19a34567"}, {"path": "/privacy", "hash": "d50f9e1e0e1d26d82d2786ce19a34567"}], "metricoolScripts": 1, "linkedinScripts": 1, "partner": "559237849", "queue": [], "viewport": 375, "documentWidth": 513}}
{"width": 768, "firstLoad": {"metricool": 1, "linkedin": 1}, "afterNavigation": {"path": "/privacy", "calls": [{"path": "/", "hash": "d50f9e1e0e1d26d82d2786ce19a34567"}, {"path": "/privacy", "hash": "d50f9e1e0e1d26d82d2786ce19a34567"}], "metricoolScripts": 1, "linkedinScripts": 1, "partner": "559237849", "queue": [], "viewport": 768, "documentWidth": 768}}
{"width": 1440, "firstLoad": {"metricool": 1, "linkedin": 1}, "afterNavigation": {"path": "/privacy", "calls": [{"path": "/", "hash": "d50f9e1e0e1d26d82d2786ce19a34567"}, {"path": "/privacy", "hash": "d50f9e1e0e1d26d82d2786ce19a34567"}], "metricoolScripts": 1, "linkedinScripts": 1, "partner": "559237849", "queue": [], "viewport": 1440, "documentWidth": 1440}}
localhost marketing script count: 0
```

The intercepted screenshots were unstyled, so their document-width measurements do not establish real-site layout; no layout verification is claimed.

Normal focused tests and `bun run test` both exited 1 before tests executed:
```text
Error: Command failed: bash /dev-server/scripts/test-db/up.sh
Object.setup src/test/global-setup.ts:17:5
```
Full-suite verification remains blocked by the throwaway database startup. Manual typecheck/build were not run, per platform instructions; automatic preview log:
```text
=== build 2026-11-04T06:42:07Z ===
build OK
```

## DevTools verification after client publication
1. On `https://trunk.gold`, use a non-internal browser, disable ad blockers and open DevTools Network with Preserve log enabled.
2. Reload; filter `metricool`. Confirm `resources/be.js` loads once and tracking requests follow. Navigate through a site link: another tracking call should occur without another script load. The retained `c3po.jpg` image is distinct from the new script.
3. Filter `licdn` then `px.ads.linkedin.com`. Confirm `insight.min.js` loads and inspect its tracking requests for partner ID `559237849`.
4. Direct preview/localhost/admin visits must not load the new scripts. An internal browser must not load them either. Existing vendor scripts already loaded on a public page cannot be unloaded by navigating to admin; our Metricool calls/conversion helper recheck exclusions.
5. No LinkedIn conversion is expected until an actual conversion ID is created and an application action explicitly calls the helper.
