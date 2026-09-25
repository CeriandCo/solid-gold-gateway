# Magic-link redirect fix

## Change
`src/routes/admin.index.tsx` only: the existing `/admin/` → `/admin/posts` redirect now passes through `search` and `hash` from the incoming location. Same target, same `replace: true`, no new redirect, sign-in flow untouched.

## Verified (local dev server, Playwright, fake token — no real link sent)
Before the fix (from the diagnosis): the fragment was dropped and there were 0 `/auth/v1` requests.
After the fix:
```
NAVS [ '/admin#access_token=FAKE.JWT.X&…&type=recovery',
       '/admin/posts#access_token=FAKE.JWT.X&…&type=recovery' ]
AUTHREQ GET …/auth/v1/user          <- sign-in client now reads the token
PLAIN  /admin?x=1 -> /admin/posts?x=1   <- plain forward still works; query kept
```
Gates: `bunx tsgo --noEmit` exit 0; `bun run test` 48 files / 707 tests passed; `bun run build` exit 0.

## Not verified
- Real link click, success-on-first-click, and "invalid or expired" on a second click. I cannot open the inbox. Also, the email link returns to the host it was requested from. The live site keeps running the old code until the client publishes, so a live test before then will still fail.
- A signed-in visit to `/admin` with a real session was not run. The forward logic is the same for every visit, and the plain-visit check above shows it still lands on `/admin/posts`.
