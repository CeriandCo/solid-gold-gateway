# Footer brand copy

Comment: 744c0526-d4b8-4bb5-926e-8fa725ec056c

Updated only the shared footer paragraph in `src/components/site-chrome.tsx` to:

```text
TRUNK
Make room for gold.
Start with a fraction, build at your own pace, and manage it all in one place.
```

The existing logo, styles, navigation links and copyright remain unchanged. The shared footer supplies this copy across pages. Project memory and roadmap updated.

## Browser verification

Real Chromium visits to `/` at each width. Exact paragraph text asserted; footer screenshots inspected. No controls changed, so no state-change click was required.

Raw measured output:

```json
{"viewport": 375, "documentWidth": 375, "copyWidth": 320, "copyHeight": 78, "copyScrollWidth": 320, "copyClientWidth": 320}
{"viewport": 768, "documentWidth": 768, "copyWidth": 183.265625, "copyHeight": 97.5, "copyScrollWidth": 183, "copyClientWidth": 183}
{"viewport": 1440, "documentWidth": 1440, "copyWidth": 320, "copyHeight": 78, "copyScrollWidth": 320, "copyClientWidth": 320}
```

## Checks and limitations

Automatic preview build output:

```text
=== build 2026-10-19T02:47:28Z ===
build OK
```

`bun run test` failed before test execution during isolated database startup. Raw error excerpt:

```text
Error: Command failed: bash /dev-server/scripts/test-db/up.sh
 ❯ Object.setup src/test/global-setup.ts:17:5
Serialized Error: { status: 1, signal: null, output: [ null, null, null ], pid: 1157, stdout: null, stderr: null }
error: script "test" exited with code 1
```

Manual typecheck/build commands were not run because platform instructions prohibit them; automatic preview build was checked instead. Full test gate remains blocked. No database changes or publishing.