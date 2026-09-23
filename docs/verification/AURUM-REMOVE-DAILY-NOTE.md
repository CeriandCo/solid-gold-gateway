# Remove Daily Note section from the AURUM board

## Changes
- `src/routes/aurum.tsx`: removed `<AurumDailyNoteSection>`, its import, `NOTE_PAGE_SIZE`, the `note` search param (validateSearch + loaderDeps), the `fetchPublishedLearnNotes` loader call and the `notes` return value, and `openNote`/`expandedNote`/`setExpandedNote`. Weekly Brief's toggle is now `setExpandedBrief(slug)`.
- `src/components/aurum-floating-nav.tsx`: removed the `Daily Note` entry from `LINKS`.
- `src/components/aurum-daily-note-section.tsx`: deleted. Only `aurum.tsx` imported it (checked with `rg`).
- Change needed to compile: `note: undefined` removed from the `/aurum` Link `search` objects in `src/routes/index.tsx` (×3) and `src/components/aurum-floating-button.tsx`. The rendered href stays the same (an undefined value is never serialised).

## Browser (Chromium, localhost)
- `/aurum` at 1440 and 375: section ids `top, price, weekly-brief, learn, calculator, gifts, subscribe`; `#daily-note` count 0.
- Floating nav LINKS: Price, Weekly Brief, Learn, Calculator, Gifts, Subscribe.
- `/aurum/notes` → 200, H1 "Daily Note archive"; `/aurum/notes/physical-gold-vs-gold-etf` → 200.
- `/aurum?brief=what-a-widening-premium-actually-tells-you` → 1 expanded brief in `#weekly-brief`.

## Not changed (out of scope, flagged)
- The MELT subscribe section still lists a "Daily Note" topic option (subscribe section was out of scope).
- The archive's "← Back to AURUM" link on `/aurum/notes` targets `/aurum#daily-note`, which no longer exists, so it lands at the top of the board (archive was out of scope). `styles.css` `.aurum-daily-note` rules are now unused.

## Gates
`bunx tsgo --noEmit` pass; `bun run test` 48 files / 707 tests pass; `bun run build` pass.
