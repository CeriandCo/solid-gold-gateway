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
- Runs automatically on a schedule (a secured cron job), not from a button
  in the admin UI. It writes a Daily Note draft using only stored AURUM
  price data, checks every figure against that data, and saves it directly
  as "In review" (skipping the Draft stage) — marked with an "AI" badge.
- It has a daily cap and won't run twice in the same window. Failures are
  logged as alerts rather than silently retried.
- A reviewer must still read it in full and Publish/Schedule/Return it like
  any other in-review post — the AI never publishes on its own.
- If it looks unstable (missing runs, bad output, wrong figures), that's a
  code/config issue in the generation pipeline, not something fixable from
  the admin UI — flag it for a follow-up prompt rather than trying to work
  around it by hand.