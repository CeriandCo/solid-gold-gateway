# Correct editorial guide AI section (2026-09-25)

Part 1 done: replaced the "AI-generated Daily Note" section of docs/admin-editorial-guide.md with the supplied wording. Env names checked against code: AURUM_AI_DAILY_NOTES_ENABLED (run.server.ts:36), AURUM_AI_CRON_SECRET (cron.server.ts:128).

Part 2 (live click-through) NOT run. It requires writes to the live database (new editor/reviewer accounts on the allowlist, drafts, a publicly published post, archive/restore) and sending a real sign-in email. Waiting on client approval and the accounts to use. No checklist item is reported as pass or fail.
