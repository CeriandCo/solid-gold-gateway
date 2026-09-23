# QA finding: "Submit for review" fails right after editing a draft

## Confirmed

`src/components/admin-workflow-panel.tsx` `perform()` captured `updatedAt` from the render
closure. For `submit` with `dirty === true` it saved first (`persist()` → `updateDraft`,
which the `aurum_posts_updated_at` trigger re-stamps), then sent the pre-save value to
`performSubmitForReview`, which throws `SUBMIT_STALE`
(`src/lib/aurum/review.functions.ts`: `if (input.updatedAt && input.updatedAt !== row.updated_at)`).

## Fix

Smallest change, panel only: when the panel itself saves the form immediately before
submitting, the optimistic token is dropped (`updatedAt: null`) because our own save is by
definition the newest version. Every other path (submit without unsaved changes, publish,
schedule, archive, restore) still sends the token unchanged, so the concurrency guard is
untouched.

## Gates (run 2026-09-23)

- `bunx tsgo --noEmit` — exit 0
- `bun run test` — 39 files / 519 tests passed
- `bun run build` — exit 0; `/tmp/observability/build-errors.log` last entry `build OK`
