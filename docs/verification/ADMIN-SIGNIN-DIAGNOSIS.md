# /admin one-time sign-in link: diagnosis (2026-09-24)

Read-only. No code, config or data changed. No sign-in link was sent in this pass.

## 1. Allowlist (`aurum_editors`)
Query: `select email, role, created_at from aurum_editors`
Result: exactly 1 row: `hoangvh238.dev@gmail.com`, role `admin`, created 2026-09-19 06:13:35 UTC.
Any other email gets the neutral message and no send (`sendAdminSignInLink` returns `not-listed` before any send or rate-limit write).

## 2 + 3. Send attempts
`aurum_admin_link_requests` (all rows):
- `zz.test.editor@example.com`, last 2026-09-19 06:23:56 UTC (test address, not in the allowlist now)
- `hoangvh238.dev@gmail.com`, last 2026-09-22 18:07:29 UTC

`auth.users` for the listed admin:
- recovery_sent_at 2026-09-22 18:07:28.79 UTC (link email issued)
- last_sign_in_at 2026-09-22 18:07:53.99 UTC (link clicked, session created 25 s later)

Auth logs query (`auth_logs`, latest 30): **0 rows returned**. Retention has no entries, so today's attempts can't be confirmed from logs.
Custom email domain: **none configured** (`list_email_domains`). Auth mail uses the built-in sender, which has low rate limits.
Redirect allowlist: this workspace can't read it. The 2026-09-22 success proves the origin used then was accepted.

## 4. Link click
The only recorded send (2026-09-22) completed sign-in, so there's no evidence of a PKCE or redirect failure for that origin.

## Conclusion
Cause not yet isolated. There is no failed attempt on record: the last allowlisted request succeeded end-to-end. The most likely cause is #1 (tested email not in the allowlist, since only one address is listed). This can't be confirmed without the email address and time of the failing test, or permission to send one live test link.
