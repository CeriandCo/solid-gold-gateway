# Legal documents update — October 17, 2026

## Scope

Updated `/privacy` and `/terms` from the two supplied Word documents. Last updated is October 17, 2026 on both pages. Retained trunk.gold, hello@sqoot.us and compliance@sqoot.us exactly as explicitly requested. Included all document legal paragraphs and copyright lines. Preserved shared header/footer, existing typography, prose column and section navigation. `/partner-terms`, AURUM, payment behavior and the database were not changed. Nothing published.

The Word XML supplied the exact text: the parser's apparent truncated Privacy title and stray “image” marker were not in the document text and were not added to the page.

## Browser verification

Ran Python Playwright against http://localhost:8080 at widths 375, 768 and 1440, height 1800. Compared every legal paragraph, heading and list item against the source Word text in order (whitespace normalized only), excluding existing navigation. All comparisons passed. Verified every section navigation target exists; no clicks were needed because these existing intentional scrolling links were unchanged.

Raw measured results:

```json
[
  {"route":"privacy","status":200,"width":375,"viewport":375,"scrollWidth":375,"articleWidth":375,"exactDocumentParagraphs":55,"validSectionLinks":13,"runtimeErrors":[]},
  {"route":"terms","status":200,"width":375,"viewport":375,"scrollWidth":375,"articleWidth":375,"exactDocumentParagraphs":59,"validSectionLinks":17,"runtimeErrors":[]},
  {"route":"privacy","status":200,"width":768,"viewport":768,"scrollWidth":768,"articleWidth":760,"exactDocumentParagraphs":55,"validSectionLinks":13,"runtimeErrors":[]},
  {"route":"terms","status":200,"width":768,"viewport":768,"scrollWidth":768,"articleWidth":760,"exactDocumentParagraphs":59,"validSectionLinks":17,"runtimeErrors":[]},
  {"route":"privacy","status":200,"width":1440,"viewport":1440,"scrollWidth":1440,"articleWidth":760,"exactDocumentParagraphs":55,"validSectionLinks":13,"runtimeErrors":[]},
  {"route":"terms","status":200,"width":1440,"viewport":1440,"scrollWidth":1440,"articleWidth":760,"exactDocumentParagraphs":59,"validSectionLinks":17,"runtimeErrors":[]}
]
```

Screenshots: `/tmp/browser/legal-update/{privacy,terms}-{375,768,1440}.png`.

## Checks and limitations

Ran `bun run test`; it failed during isolated database startup before executing tests. Kept database isolation protection in force; did not substitute a live database.

Raw failure output:

```text
No test files found, exiting with code 1
Error: Command failed: bash /dev-server/scripts/test-db/up.sh
 ❯ Object.setup src/test/global-setup.ts:17:5
error: script "test" exited with code 1
```

Automatic preview diagnostics after edits:

```text
=== build 2026-10-18T04:58:01Z ===
build OK

=== build 2026-10-18T04:58:20Z ===
build OK
```

Manual typecheck and production build were not run: platform instructions prohibit running these manually and provide automatic checking. Thus the requested standalone gate commands are not claimed as passed. No business behavior changed, so no new business-rule tests were added; exact legal wording was checked through the real page instead of copy assertions in unit tests.

Legal text is transcribed, not independently validated as describing currently enabled payment integrations. Uploaded wording does not activate Plaid, stablecoin or BNPL processing.