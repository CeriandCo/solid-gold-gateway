# Fix 1: /aurum/notes source; Fix 2: AI source consistency (2026-09-25)

## Fix 1
`fetchPublishedLearnNotes` now returns `loadEditorialPage({ type: "daily_note", limit, offset })` (same `EditorialPage` shape, same limit clamp). `learn-articles.ts` untouched. Slug route unchanged (static Learn slug first, then DB daily_note).

Browser (local preview, live DB):
- /aurum/notes links (6): spread-on-a-one-ounce-coin, three-mints-longer-lead-times, what-a-central-bank-purchase-signals, why-assay-cards-matter, troy-ounces-and-grams, allocated-and-unallocated. Matches the 6 `published` daily_note rows queried.
- /aurum/notes/spread-on-a-one-ounce-coin -> h1 "Why the spread on a one ounce coin moved this week", 8 paragraphs.
- /learn #articles still: /learn/physical-gold-vs-gold-etf, /learn/how-to-buy-gold-safely, /learn/gifting-gold-guide.
- TEST POST (1ce2d203…): Restore to draft -> Submit -> Publish now: archive count 7. Unpublish: count 6. DB status afterwards `archived`.

## Fix 2
`run.server.ts`: sources are now built only from facts the draft's paragraphs reference (`citedFactPack`). New `previousCloseContradiction`: if the cited facts include a change/previous-close fact and a daily close whose value differs from the spot row's previous close, the run is rejected (`ai_source_contradiction` critical alert, nothing saved).

Tests added (run.test.ts): contradiction rejects & saves nothing; unused disagreeing daily close is not cited and run saves; matching daily close saves. AI suite: 88/88.

## Gates
- `bunx tsgo --noEmit`: clean (after a type-only fix to `citedFactPack`).
- `bun run test`: 48 files, 710 tests passed (run before the type-only fix; run.test.ts re-run after: 21/21).
- `bun run build`: exit 0.
