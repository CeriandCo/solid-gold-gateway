# Temporary admin seed (2026-09-25)

Direct data change on the live database (not a migration; migrations are DDL only).

## Insert
```sql
INSERT INTO public.aurum_editors (email, role)
VALUES ('lenguyen.231203@gmail.com', 'admin')
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role;
```
Result: succeeded (no rows returned).

## Check
`select email, role from public.aurum_editors;`
```
hoangvh238.dev@gmail.com   | admin
lenguyen.231203@gmail.com  | admin
```

## Sign-in link send (live site)
- Page: https://solid-gold-gateway.lovable.app/admin, headless Chromium, 1280px.
- Filled lenguyen.231203@gmail.com, clicked "Forgotten password? Email me a sign-in link".
- Server function response: HTTP 200. On-screen: "If this email has access, a sign-in link is on its way."
- Worker log 2026-09-25T15:49:59.461Z: `[admin] sign-in link request: sent`
- DB after send: auth user created 2026-09-25 15:49:56.72 UTC; recovery_sent_at 15:49:57.05 UTC; aurum_admin_link_requests.last_requested_at 15:49:58.68 UTC.

## Not verified
Email delivery and the link click. The user will check the inbox and sign in.
Note: this is a temporary internal admin and must be removed or kept on purpose once the client's admin emails are added.
