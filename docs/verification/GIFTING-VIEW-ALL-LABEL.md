# Gifting "View all occasions" label fix

- Changed: `src/routes/gifting.tsx` line 402, visible text "View all occasions" → "Give a Gift Card".
- Unchanged: href `#gift-card`, className `gift-view-all`, `data-reveal`, `<ArrowRight />`.
- Resolves T5 client decision #8 ("View all occasions" destination) by relabel.
- Not verified in this task: browser render, test suite, build (text-only change; harness build runs automatically).
- Note: `src/lib/link-audit/semantic.ts` still has a rule keyed on the old label; the committed audit artifact was not regenerated.
