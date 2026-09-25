# Magic-link redirect failure — diagnosis (no code changed)

Date: 2026-09-25. Read-only investigation plus one local browser probe using a fake token. No real link was sent, no database writes.

## Verdict
The point of failure is **step 1/2: the sign-in tokens in the link are thrown away by the app before the sign-in client reads them.**
Auth itself succeeded; redirect config (3), auth outcome (4), and the role check (5) are not the cause.

## Evidence per step

### 1. Landing URL
Auth log 15:50:34 UTC: `GET /verify` → 303, `action: login`, `login_method: implicit`, user `5f563bb4-…`. Implicit flow means the browser was sent to `<origin>/admin#access_token=…&refresh_token=…&type=recovery`.

Local reproduction with a fake token (`http://localhost:8080/admin#access_token=FAKE.JWT.X&…&type=recovery`), raw navigations recorded:
```
NAVS ['http://localhost:8080/admin#access_token=FAKE.JWT.X&expires_in=3600&refresh_token=FAKE&token_type=bearer&type=recovery',
      'http://localhost:8080/admin#access_token=FAKE.JWT.X&…',
      'http://localhost:8080/admin/posts']
FINAL http://localhost:8080/admin/posts
TEXT  AURUM / Editorial admin / Sign in with your email and password.
```
The `/admin/` index route redirects to `/admin/posts` (`src/routes/admin.index.tsx`) and the `#access_token=…` fragment is dropped. This exactly matches the reported symptom (landed on `/admin/posts`, sign-in screen shown).

### 2. Console / network
During the probe: no console errors, and **zero requests to `/auth/v1/*`**. The sign-in client never tried to read the token. Reason: the generated client is created lazily on first use (a Proxy in `src/integrations/supabase/client.ts`); the first use is inside `AdminLayout`'s `useEffect`, which runs after the router has already rewritten the URL to `/admin/posts` without the fragment. `detectSessionInUrl` then finds nothing.

### 3. Redirect URL allowlist
Not readable from here (no dashboard access on Lovable Cloud). Indirect evidence it is fine: the 303 from `/verify` sent the browser back to the app's `/admin` (the log's referer is the live `/admin` origin, and the user reported arriving on the live domain, not a fallback Site URL).

### 4. Auth log outcome (verbatim, UTC)
```
15:49:56  POST /admin/users   200  user_signedup (lenguyen.231203@gmail.com)
15:49:58  POST /otp           200  user_recovery_requested, email hook ran successfully
15:50:34  GET  /verify        303  login, login_method implicit   <- link click succeeded
15:51:15  POST /token         400  invalid_credentials (password sign-in attempt)
15:52:05  GET  /verify        403  "One-time token not found / Email link is invalid or has expired"  <- same link clicked again (links are single use)
```

### 5. Role lookup / "revoked" path
```
select email, role, user_id is not null linked from aurum_editors;
 hoangvh238.dev@gmail.com  | admin | t
 lenguyen.231203@gmail.com | admin | f
```
`getAdminMe()` calls `aurum_link_current_editor`, which links `user_id` on first successful call. `linked = f` means `getAdminMe()` never ran with a session for this user, so the revoked sign-out path was never reached. Ruled out.

## Proposed fix (awaiting approval, not applied)
Preserve the fragment through the `/admin/` → `/admin/posts` redirect (pass the current `hash` in the existing redirect in `admin.index.tsx`), so the sign-in client can read the token when the admin layout starts. No new redirect is added; the existing one only keeps the fragment. Verify with the same fake-token probe (expect an `/auth/v1/user` request) and then one real link.

Workaround meanwhile: none reliable from the link; password sign-in works if a password is set.
