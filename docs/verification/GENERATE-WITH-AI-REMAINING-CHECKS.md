# Verify: remaining "Generate with AI" checks — 2026-09-26

## 1. Usage log row from a real click — PASS

Table: `public.aurum_ai_manual_runs` (id, user_id, outcome, provider, model, input/output/total_tokens, cost_usd, detail, created_at).

Raw query (`select ... from aurum_ai_manual_runs order by created_at desc limit 10`):

```
83654a8b-c8cb-40a7-b86b-09dafb627ab6 | 3e9a87ef-c676-4bb2-bfbd-3a992c2ff856 | generated | lovable-ai-gateway | openai/gpt-6-astra | 1055 | 2026-09-26 15:55:59.030906+00
aa6fbf84-75de-4b5f-9ae3-c1071c5761e0 | 5f563bb4-e57c-4420-89c3-34c4ab6df6a8 | generated | lovable-ai-gateway | openai/gpt-6-astra |  932 | 2026-09-26 15:42:11.696425+00
```

user_id mapping from `aurum_editors`: `3e9a87ef…` = luongduthichatdoi@gmail.com (editor), `5f563bb4…` = lenguyen.231203@gmail.com (admin).
Both rows are from preview page interactions (the earlier CLI tests stubbed usage recording and wrote nothing).

Independence from the cron cap: `aurum_ai_claim_run` definition (read from DB):

```
SELECT count(*) INTO used
  FROM public.aurum_ai_runs
 WHERE created_at >= date_trunc('day', now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';
```

It counts only `aurum_ai_runs`, so manual rows never consume the Daily Note cap. `aurum_ai_runs` latest row: `daily:2026-09-25 | saved | 2026-09-25 16:09:10`; no row today.

## 2. Self-approval test — NOT RUN (blocked)

Current value: `allow_self_approval = t`, updated `2026-09-22 17:15:37.612+00`.

Blocked: signing the preview in as a specific account (`lovable auth-session --user`) returned "Only workspace admins and owners can mint a session as a specific auth user." No publish attempts were made.

Code reading only (not observed behaviour), from `aurum_publish_post`:
- Only `reviewer`/`admin` roles may publish at all.
- The toggle blocks only when `allow_self_approval = false AND author_id = caller`.
- So an admin publishing an editor's post is allowed regardless of the toggle; the toggle affects only publishing one's own post. This matches the `/admin/settings` wording ("Allow a person to publish their own post").

## 3. Panel responsiveness — NOT RUN (blocked)

Same blocker: no editor session available in the test browser, and `/admin/posts/new` requires one.

## To unblock
Either a workspace admin/owner runs this turn, or the user completes checks 2–3 in the preview while signed in.
