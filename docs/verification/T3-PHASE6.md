# T3 Phase 6 — MELT signup hardening (provider-independent)

Date: 2026-09-23. Scope: hardening only. No provider, no consent wording, no checkbox, no confirmation email, no redesign. Nothing published.

## 1. Files changed
- Migration `drizzle/migrations/0026_newsletter_rate_check.sql` — new `public.newsletter_rate_check(...)` (SECURITY DEFINER, `REVOKE ALL ... FROM PUBLIC, anon, authenticated`, `GRANT EXECUTE ... TO service_role`). Types regenerated automatically.
- `src/lib/newsletter/signup.server.ts` — atomic limiter call, fail-closed on limiter error, IP canonicalisation, canonical list order, stale-consent token check, top-level catch.
- `src/lib/newsletter/consent.server.ts` — public projection now also carries `version` (comparison token).
- `src/lib/newsletter.functions.ts` — `MeltConsentNotice` type gains `version`; handler wrapped in catch → `unavailable`.
- `src/lib/newsletter/form-state.ts` — `buildSignupRequest(email, selected, consentVersion?)`.
- `src/components/aurum-subscribe-section.tsx` — one argument: passes `consentNotice?.version`. No visual change.
- Tests: new `src/lib/newsletter/signup-hardening.server.test.ts` (56 tests); updated `signup.server.test.ts`, `consent-versioning.test.ts`, `form-state.test.ts` for the token and well-formed test IPs.

## 2. Request flow (as implemented now)
```text
/aurum#subscribe  AurumSubscribeSection.onSubmit  (inFlight ref + submitting state)
  -> buildSignupRequest(email, lists, consentNotice?.version)      form-state.ts
  -> subscribeToMelt (createServerFn POST, try/catch)              newsletter.functions.ts
  -> runMeltSignup (try/catch -> unavailable)                      signup.server.ts
       1 canonicalIpBucket(cf-connecting-ip)  -> newsletterPeppered   (no pepper -> unavailable, nothing written)
       2 rpc newsletter_rate_check  (advisory lock; insert; count 15m + 24h)
            error/non-boolean -> unavailable     limited -> rate_limited
       3 zod .strict() validation, control chars, normalise, isValidEmail -> invalid_request
       4 lists -> allowlist order, deduped
       5 deps.consent read ONCE; unusable -> unavailable
       6 consentVersion token !== consent.version -> unavailable (stale page)
       7 single upsert onConflict email (version+text from the same object)
            error -> unavailable
  -> { ok: true } | { ok: false, code }  -> outcomeFor -> MELT_MESSAGES
```

## 3. Rate-limit concurrency finding (real race)
The old limiter was insert-then-count (inherited pattern). Raw probe output before the fix, real test DB:
```
ROUND 0..4: passed limiter 0 / 30 (limit 5)
ROUND 0..4: passed limiter 0 / 6 after 3 prior (expect exactly 2)
```
The threshold was never exceeded, but a burst saw each other's inserts and refused requests still inside the limit (0 instead of 5 / 0 instead of 2). Separately, the insert error and count error were ignored (`count ?? 0`) — a database failure would have **failed open**.

## 4. Limiter change
Replaced with one DB call `newsletter_rate_check` using `pg_advisory_xact_lock` per bucket, insert, and one filtered count. After the fix:
```
[phase6] burst round 0/1/2: 5/30 passed limiter
[phase6] near-threshold round 0/1/2: 2/6 passed limiter
```
Exact and deterministic. Commerce limiter untouched. Live grants queried: `anon_exec=false auth_exec=false svc_exec=true`.

## 5. Boundaries (DB fixtures, no sleeps) — all pass
1–5 pass, 6th limited; 5 attempts at 15m+10s ago don't count; 5 at 15m−30s do; 19 at 1h → 20th passes, 21st limited; 25 at 24h+10s don't count; 20 at 24h−60s do; 16 at 2h + 4 fresh pass, 5th fresh limited (daily cap while short window has room). Window edges are strict `>` now.

## 6. Trusted-IP malformed input
Absent, empty, whitespace, 5000 chars, control chars, `1.2.3.4, 5.6.7.8`, `evil-host` → shared `unknown` bucket. Spoofed `x-forwarded-for` / `x-real-ip`: 0 attempts recorded under their hashes. Only `cf-connecting-ip` is read.

## 7. IP canonicalisation
Trim + lowercase + IPv4/IPv6 character allowlist, ≤45 chars. ` 198.51.100.201\t` shares the bucket of `198.51.100.201` (DB-verified). Not done: IPv6 zero-compression equivalence (`::1` vs `0:0:0:0:0:0:0:1`) — documented residual; Cloudflare emits a single canonical form. Raw IP never persisted.

## 8. Pepper
Missing / empty / whitespace → `{ ok:false, code:"unavailable" }`, 0 attempts, 0 rows, response contains no "PEPPER". No minimum length imposed (the live secret's length was not inspected and adding a floor could break it invisibly) — residual.

## 9. Limiter DB failure
Error result, non-boolean result, thrown timeout → `unavailable`, no row, no DB text in response. Fail closed.

## 10. Signup DB failure
Upsert error → `unavailable`, no row, attempt kept (1). The single upsert is atomic: an invalid row (empty lists) is refused whole, 0 rows.

## 11. Unexpected exception
Throw containing SQL, table name, `SUPABASE_SERVICE_ROLE_KEY` → response `{"ok":false,"code":"unavailable"}`; asserted absent: SELECT, newsletter, SERVICE_ROLE, email, IP, stack. UI already maps any throw to its unavailable message (browser test below).

## 12. Enumeration
New vs repeat: `JSON.stringify` byte-identical `{"ok":true}`; no id/row data returned; same UI message. Remaining difference: repeat does an UPDATE vs INSERT (timing, not deliberate).

## 13. Adversarial validation (17 cases, all pass)
empty object, null, undefined, number, array payload, array/object as email, 100k email, 100k source, 10 000-item list, 3 duplicates, unsupported list, control char, extra `role`, nested list, 500-char version token, `__proto__` key → `invalid_request`, exactly 1 attempt counted, 0 rows.

## 14. Payload size
No body-size limit exists in the repository for server functions; the hosting edge limit is outside repository control and was not measured. Zod bounds (email ≤1000 pre-normalise / ≤254 stored, source literal, lists ≤2, token ≤80) stop large values before persistence; a large body is still parsed once. Residual.

## 15. Preferences
Stored in allowlist order, deduped. `["weekly-brief","daily-note"]` then reversed → one row, `["daily-note","weekly-brief"]`, `created_at` unchanged.

## 16. Consent race
Consent read exactly once per request (getter counter = 1); a deps object that would switch v1→v2 on second read stored `test-v1 / Test consent text v1`. No hybrid possible.

## 17–18. Stale browser consent — fixed
Before: the server stored whatever version was live even if the page showed older wording. Fix: the page echoes the rendered version as a non-authoritative token. Mismatch or missing (while consent is live) → `unavailable`, no row. A forged token while consent is off → `unavailable`. On match the server stores its own snapshot. No text is sent by the browser.

## 19. Retry
limiter throw → unavailable; upsert error → unavailable; retry → ok; repeat → ok; 1 row; 3 attempts recorded (the mocked-away call recorded none).

## 20. Triple-click / keyboard (real browser)
Same-tick triple `click()`: 1 request. Enter: 1. click + `requestSubmit()` same tick: 1. Pending text "Sending your preferences." shown, then cleared.

## 21. Cross-instance
8 concurrent identical calls, one bucket → 5 ok, 3 rate_limited, 1 row. 6 concurrent from 6 buckets → 6× `{ok:true}`, 1 row.

## 22. Logging
Only two `console.warn` lines in newsletter code (coded reasons; no values interpolated except fixed reason strings). Test spies all console levels across success, stale, invalid, consent-off and thrown-error paths: no email, IP, hash, pepper, consent text or error message appeared.

## 23. DB privacy
Signup row keys: `consent_text, consent_version, consented_at, created_at, email, id, lists, source, updated_at`. Attempt keys: `created_at, id, ip_hash` (64-hex). No IP, UA, referrer, UTM, gclid, provider fields.

## 24. REST/RLS
`ALLOW_LIVE_DB_TESTS=1 bunx vitest run src/lib/security/rest-surface.test.ts` → `REST attempts checked: 236`, 9/9 passed (234 before + the new function probed as anon and authenticated).

## 25. Browser (localhost dev, real server, 1440 and 375)
1440, in order: `reader@nodot` → invalid_request, "That email address does not look right…"; triple → unavailable; Enter → unavailable; race → unavailable; network aborted → UI "Sign-up is not available just yet…" (caught); retry → unavailable; next → rate_limited "Too many attempts just now…". Button re-enabled after each; scrollY 6586 → 6586. 375 (same shared local bucket) → rate_limited throughout, one unavailable on the aborted request; scrollY 11160 → 11160. Response leak check: false.
**Not verified in the browser:** successful signup and repeat signup with test consent — production consent is off and I did not temporarily switch it on. Covered by DB tests only.

## 26. No provider work
Search of changed newsletter code/migration for customer.io / mailchimp / klaviyo / confirmation_token / audience: only the pre-existing deny-list comment in `form-state.ts` and forbidden-list assertions in tests.

## 27. Cleanup
Live `newsletter_attempts` rows from browser runs deleted twice; after: `attempts 0, signups 0`. Test DB rows removed in `afterAll`.

## 28–30. Production / content / commerce (live query after cleanup)
`published 9, latest_pub_update 2026-09-19 05:31:05, orders 7, cards 0, signups 0`. `approvedConsent()` is null (test passes) → signup fails closed. Commerce code and rows untouched.

## 31–33. Gates
- `bunx tsgo --noEmit`: clean.
- `bun run test`: 44 files, **680 tests passed**.
- `bun run build`: success.

## 34. Residual limitations
Application-level abuse mitigation only, not DDoS protection. No IPv6 compression canonicalisation. No request-body cap in repo. No pepper length floor. Missing `cf-connecting-ip` shares one bucket (one abuser can exhaust it for other header-less callers — only relevant off Cloudflare). Repeat vs new has an update-vs-insert timing difference. No legal-compliance claim.

## 35. Recommended Phase 7
Client decisions only: approved wording + version, checkbox yes/no, provider, list, double-opt-in. Then activate consent and browser-verify success/repeat on the live form.
