# AURUM editorial admin — how it works

## Roles
- **Editor**: writes drafts, can only "Submit for review". Cannot publish.
- **Reviewer** / **Admin**: can Publish now, Schedule, Return to draft,
  Archive, and Restore. A reviewer cannot approve/publish their own draft —
  someone else has to.
- **Admin** only: manage who has access at /admin/people (add an email with
  a role — this is the allowlist that also gates sign-in).

## Writing a post by hand
1. /admin/posts → "New post".
2. Fill in title, body paragraphs, at least one source (publisher, title,
   date, URL) — sources are required before you can submit or publish.
3. "Save draft" as often as you like.
4. When ready, "Submit for review". This locks the content (read-only)
   until a reviewer either publishes it or sends it back.

## Reviewing and publishing
1. Open the post from /admin/posts (status "In review").
2. "Publish now" (goes live immediately) or "Schedule…" (pick a date/time).
3. "Return to draft" sends it back to the writer with content editable
   again.
4. Once live, "Archive" removes it from public view without deleting it;
   "Restore" brings an archived post back to Draft.

## The AI-generated Daily Note
- The pipeline is built and has been verified end-to-end (writes a
  correct draft from stored price data, fails closed on a bad output,
  never publishes on its own) — but **no automatic schedule is active
  yet**. As of now, nothing calls it unless someone triggers it manually.
- To turn on automatic generation, someone needs to:
  1. Decide the cadence (how often — daily? which time of day?) — this is
     a business decision, not a technical one.
  2. Set `AURUM_AI_DAILY_NOTES_ENABLED=true`.
  3. Point a scheduler (pg_cron, or an external scheduler) at
     `POST /api/public/aurum-ai-daily-note` with header
     `x-cron-secret: <AURUM_AI_CRON_SECRET>` on that cadence.
- Until that's done, the only way to generate an AI draft is a manual
  authenticated call to that endpoint (for testing), which a developer
  would run, not an editor from the admin UI.
- Once live, it still only creates an "In review" draft — a reviewer
  always reads and publishes it manually, exactly like a human-written
  post.
  around it by hand.