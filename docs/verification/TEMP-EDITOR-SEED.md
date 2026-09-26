# Temporary editor account + pending UI checks (part 1 of 2)

## 1. Seed (live database, one-off insert)
Result of the insert: `[]` (no error).
Query `select email, role, user_id is not null as linked from public.aurum_editors order by created_at`:
```
hoangvh238.dev@gmail.com     admin   linked:true
lenguyen.231203@gmail.com    admin   linked:true
luongduthichatdoi@gmail.com  editor  linked:false
```
Row is temporary: remove or keep on purpose once client editors are set up.

## 2. Sign-in link from live /admin
Playwright on https://solid-gold-gateway.lovable.app/admin, clicked "Forgotten password? Email me a sign-in link".
Server function response: HTTP 200. Page text: "If this email has access, a sign-in link is on its way."
Inbox arrival not verified (user checks).

Caveat: the live site still runs the build without the magic-link fix (MAGIC-LINK-REDIRECT-FIX.md) and without the Generate with AI panel, because neither has been published. Clicking the link on the live site may therefore drop the sign-in token as before.

## Current setting
`select allow_self_approval, updated_at from public.aurum_cms_settings`:
```
allow_self_approval: true   updated_at: 2026-09-22 17:15:37.612+00
```

## 3. UI checks
Not run yet: waiting for the user to confirm the editor sign-in.
