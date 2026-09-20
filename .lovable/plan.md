# AURUM Learn-fed notes and archives

## Data source and parity
- Create one typed, server-safe Learn article registry for the three currently published articles, with publication date `2026-09-10`, title, summary, canonical slug, body, optional sources, and computed read time at 200 words per minute.
- Refactor the three Learn detail pages to render their article body from that registry, so Learn, the AURUM expanded note, and the AURUM note detail page cannot drift.
- Adapt those published Learn records to the existing AURUM editorial row shape, newest first; tie-break equal dates by the existing Learn page order.
- Keep Weekly Briefs on the existing published editorial records.
- Omit source controls and source blocks entirely when a record has no sources.

## AURUM page
- Replace the Daily Note database list with the published Learn article query while preserving the current row and expansion presentation.
- Mark only the first row as `LATEST`.
- Update the cadence text and add a generated “Most recent note” line, including the over-30-days qualifier when applicable.
- Change “Show older notes” into a link to `/aurum/notes`.
- Correct the Daily Note subscribe description and any other AURUM daily-cadence promise found in the site; preserve footer structure.

## Archives
- Add SSR routes `/aurum/notes` and `/aurum/briefs` using one shared archive layout and the existing editorial row presentation.
- Add title/description, search by title and standfirst, month grouping, 20-item pagination via validated `?page=`, count text, canonical metadata, and back links to the relevant AURUM section.
- Keep search client-side within the loaded archive result and preserve real page URLs for pagination.

## Learn signpost
- Add the requested AURUM link strip at the bottom of `/learn`, above the footer, using the Learn page’s existing container and visual language.

## Detail pages and metadata
- Make `/aurum/notes/$slug` resolve Learn-fed notes from the same registry used by the in-page rows.
- Keep Weekly Brief detail reads unchanged.
- Add canonical metadata, unique descriptions, Article JSON-LD with the real publication date, and archive breadcrumbs.

## Verification
- Verify both archive routes return SSR HTML and group every published item.
- Check all three Learn articles appear on AURUM with real dates and matching expanded/detail content.
- Check no draft or daily-cadence promise appears, no `0 SOURCES` renders, and source-less notes omit the control.
- Exercise archive search, pagination URLs, back links, Learn signposts, metadata, structured data, responsive layout, and keyboard behavior.
- Run focused tests, type checking, build verification, and inspect current diagnostics. Do not publish.
