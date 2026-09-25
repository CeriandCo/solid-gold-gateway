# Verify both blog-creation paths (2026-09-25)

Run against the local preview server, which uses the live database. Signed in as hoangvh238.dev@gmail.com (admin).

## A. Manual posting via UI
| Step | Result |
|---|---|
| A1 /admin/posts/new, Daily Note | PASS |
| A2 title "TEST POST — please ignore", test body, 1 source | PASS |
| A3 Save draft -> Submit for review -> Publish now | PASS (post 1ce2d203-e3e7-4c1d-8c66-c34f8c2b6ca1, published_at 2026-09-25 16:10:30 UTC) |
| A4 appears on /aurum/notes | FAIL — count of title on /aurum/notes?page=1 = 0. Cause: that page's loader (`fetchPublishedLearnNotes`) lists only the static Learn articles, not database Daily Notes. Published DB notes are reachable only by direct slug URL. Slug page was not checked before archiving. |
| A5 archive (Unpublish) and gone from public page | PASS for the archive (DB status `archived`, updated 16:10:34). "Gone from public page" not meaningful since it never appeared there. |

## B. AI generation (manual trigger)
| Step | Result |
|---|---|
| B1 secrets | AURUM_AI_CRON_SECRET present, LOVABLE_API_KEY present (values not read). |
| B2 enable flag | NOT changed. AURUM_AI_DAILY_NOTES_ENABLED is not set. Used the pipeline's built-in operator override header `x-aurum-ai-force: true` instead, so no setting was flipped. |
| B3/B4 request | HTTP 200 `{"outcome":"saved","postId":"93d58b80-1ef5-4f7c-a9fe-a28cd814cfe9","runId":"b5f64d4a-0e59-4fb7-9b2a-74eefb1f1aad"}`; run: model openai/gpt-6-astra, 1587 tokens. |
| B5 in admin | PASS — list row: `Gold above previous close · Daily Note · AI · In review · 2 sources`. published_at null. |
| B6 figures vs stored data | PARTIAL. Body: "The latest stored spot price for gold is $4295.80 per troy ounce." / "The price of gold is up 0.63% since the previous close." Spot row 2fa45187 (16:05:02 UTC): price 4295.8, previous_close 4268.7 -> +0.635% -> 0.63%. Both figures match. Caveat: the second cited source is aurum_daily_closes row 30bc9a5b (2026-09-24 close 4298), which is ABOVE spot; against that row gold is down 0.05%. The note's claim relies on the spot row's `previous_close`, but it cites a daily-close row that contradicts it. |
| B7 cleanup | PASS — Return to draft, then Delete draft. Row no longer exists. |
| B8 restore flag | N/A (never changed). |

Final counts: daily_note published 6, archived 1 (the test post); weekly_brief published 3. Unchanged published set.
