# T3 — MELT newsletter opt-in: provider-independent acceptance record

Date: 2026-09-23. Acceptance audit only. **No code changed in this phase** (no defect found). Nothing published. Detail lives in [Phase 2](T3-PHASE2.md), [3](T3-PHASE3.md), [4](T3-PHASE4.md), [5](T3-PHASE5.md), [6](T3-PHASE6.md).

## 1. Scope and acceptance matrix

| Requirement | Status | Evidence | Blocker |
|---|---|---|---|
| MELT opt-in form on /aurum#subscribe wired to a real server boundary | DONE | `aurum-subscribe-section.tsx` → `subscribeToMelt`; browser run §11 | — |
| Server-side email validation + normalisation | DONE | `signup.server.ts` zod `.strict()`, control-char refusal, `isValidEmail`; 17 adversarial cases (Phase 6) | — |
| Local signup persistence (one row per address) | DONE | `newsletter_signups` unique email, single upsert; concurrency tests | — |
| Locked storage: RLS on, no browser policies, service-role only | DONE | live: both tables `rls_on`, 0 policies, no anon/authenticated grants; REST matrix 236 attempts refused | — |
| Salted/peppered IP-hash rate limiting (commerce pattern) | DONE | own table + own pepper `NEWSLETTER_HASH_PEPPER`; atomic `newsletter_rate_check` | — |
| Consent wording + timestamp stored with signup | DONE (mechanism) / BLOCKED ON CLIENT (wording) | `consent_text`, `consent_version`, server `consented_at`; `APPROVED_CONSENT = null` | Approved wording |
| Provider integration once provider known | BLOCKED ON CLIENT | no provider code (search §3) | Platform, access, list |
| Provider key via server secret management | BLOCKED ON CLIENT | nothing to store yet; pattern = secure secret form + `process.env` inside handler | Platform |
| No client-only security boundary | DONE | all checks in `runMeltSignup`; client bundle scan §6 | — |
| Confirmation email / double opt-in | BLOCKED ON CLIENT | not decided | Client decision |

## 2. Architecture and T3 file inventory

```text
browser form ──POST──> subscribeToMelt (server fn) ──> runMeltSignup
   IP bucket+pepper → newsletter_rate_check (atomic) → validate → consent snapshot
   → stale-version check → upsert newsletter_signups (service role) → {ok}|{ok:false,code}
```
- **Database:** `drizzle/migrations/0024_newsletter_signups.sql` (tables, constraints, `newsletter_prune_attempts`, cron `newsletter-prune-attempts` 03:29 daily), `0026_newsletter_rate_check.sql`.
- **Server/security:** `src/lib/newsletter/signup.server.ts`, `src/lib/newsletter.functions.ts`, `src/lib/newsletter/types.ts`.
- **Consent:** `src/lib/newsletter/consent.server.ts` (the only definition).
- **UI:** `src/components/aurum-subscribe-section.tsx`, `src/lib/newsletter/form-state.ts`, `/aurum` route loader (consent notice).
- **Tests:** `newsletter-schema-db` (17), `signup.server` (34), `signup-hardening.server` (35 declarations / 59 cases), `consent-versioning` (15), `form-state` (14) — 160 run; plus `security/rest-surface`, `security/function-privileges`.
- **Docs:** T3-PHASE2…6, this file.

Audit findings (no fix needed): no fake-submit code left; no test hook reachable in production (consent injection is a function parameter defaulting to `approvedConsent()`; the server fn passes only `data`); no provider naming (lists are content preferences `daily-note`/`weekly-brief`). Cosmetic only, left as-is per scope: `keepsFormContents` (form-state) is exported but used only by tests; `CONTROL_CHARACTERS` and `MeltSignupDeps` are exported but used only inside their module. The file header of `signup.server.ts` summarises the Phase 3 flow and doesn't list the Phase 6 version-token step (the inline comments do).

## 3. Stale provider-assumption search
`rg -i "customer.io|mailchimp|klaviyo|brevo|mailerlite|convertkit|hubspot|newsletter provider|audience.?id|provider list|double.?opt|confirmation email"` over `src supabase drizzle` (excluding tests and generated types):
- `drizzle/migrations/0024_newsletter_signups.sql:12` — comment: double opt-in "later decisions". Acceptable.
- `src/lib/newsletter/signup.server.ts:7` — "Nothing here calls a newsletter provider: none has been chosen." Acceptable.
- Test files: deny-list assertions only. Phase docs: historical, described as unselected.
No production code assumes a provider.

## 4. Stale consent-placeholder search
`rg "CONSENT_TEXT|CONSENT_VERSION|2026-09-20|CLIENT-APPROVED|lorem" src` (non-test): only `CONSENT_VERSION_MAX`/`CONSENT_TEXT_MAX` length limits, and two image `.asset.json` `created_at` timestamps (unrelated). No placeholder copy in runtime code. Tests assert the consent file contains none of `CLIENT-APPROVED`, `lorem`, `test-v1`, `Test consent text`. Mentions in Phase 3–5 docs are historical evidence.

## 5. Consent model
- One source: `APPROVED_CONSENT` in `consent.server.ts`, currently `null`.
- UI receives `{text, version}` projection via route loader; renders text as plain text; sends only `version` back as a comparison token.
- Server stores its own snapshot (version + text from one object read once); stale/missing token → `unavailable`; server sets `consented_at`.
- Same email → updates the row; `created_at` preserved (tests).
- The table is **latest-consent evidence, not a consent-event history**. No history requirement exists in T3.

## 6. Security boundary and privacy
- Browser never writes tables: REST matrix (live, `ALLOW_LIVE_DB_TESTS=1`) `REST attempts checked: 236`, 9/9 pass.
- Clean build `dist/client` (83 js files) scan: `SUPABASE_SERVICE_ROLE_KEY` 0, `NEWSLETTER_HASH_PEPPER` 0, `service_role` 0, `newsletter_rate_check` 0, `newsletter_signups` 0, `newsletter_attempts` 0, `runMeltSignup` 0 (form copy present: 1, sanity). These names appear only in `dist/server`. No existing automated bundle scan exists to extend.
- `newsletter_rate_check` live privileges: anon false, authenticated false, service_role true.
- **Stored:** signups = id, email (normalised), lists, consent_version, consent_text, consented_at, source (`aurum_melt` literal), created_at, updated_at. attempts = id, ip_hash (64-hex SHA-256 with newsletter pepper), created_at.
- **Not stored:** raw IP, user agent, referrer, UTM, gclid, attribution, provider metadata, request body.
- Logs: two coded `console.warn` lines; a test spies every console level across all outcomes and finds no email, IP, hash, pepper, consent text or error text. Not a legal-compliance claim.

## 7. Rate limits (operational defaults, not client decisions)
5 per 15 min and 20 per 24 h per IP bucket; trusted identity = `cf-connecting-ip` only, canonicalised; missing/malformed → shared `unknown` bucket. Atomic (30 concurrent → exactly 5; 3 prior + 6 concurrent → exactly 2). Limiter failure → `unavailable`, nothing saved. Prune: `DELETE FROM newsletter_attempts WHERE created_at < now() - interval '7 days'` — touches attempts only, never signups.

## 8. Failure-semantics matrix (canonical)

| Condition | Public result | Signup persisted? | Attempt counted? |
|---|---|---|---|
| Valid + consent configured + matching version | `{ok:true}` | yes (insert or update) | yes |
| Duplicate signup | `{ok:true}` (byte-identical) | same row updated | yes |
| Invalid email | `invalid_request` | no | yes |
| Invalid / empty / unknown preference | `invalid_request` | no | yes |
| Extra or privileged field | `invalid_request` | no | yes |
| Rate limited | `rate_limited` | no | yes |
| Consent unavailable (production today) | `unavailable` | no | yes |
| Stale or missing consent version | `unavailable` | no | yes |
| Missing / blank pepper | `unavailable` | no | no (cannot hash) |
| Limiter DB error / timeout | `unavailable` | no | no (call failed) |
| Signup DB error | `unavailable` | no | yes |
| Unexpected exception | `unavailable` | no | depends on the stage it fails at |

UI maps these to: "Thanks — we received your sign-up." / "That email address does not look right…" / "Too many attempts just now…" / "Sign-up is not available just yet…".

## 9. Current production state (verified)
- `APPROVED_CONSENT = null as NewsletterConsent | null;` (read in source; test `approvedConsent()` → null passes).
- Clean `bun run build` succeeded. The Worker build can't be served locally (`vite preview` fails: no `dist/server/server.js` for a Workers target) and the preview URL returns 401. So the browser run used the dev server, which uses the same consent source file. There is no environment-based consent, so the configuration is identical.
- Browser, 1440 and 375: form visible; consent block count 0; no placeholder text; valid submit → "Sending your preferences." → "Sign-up is not available just yet. Please try again soon."; server code `unavailable`; button re-enabled; no success text; scrollY 6586→6586 and 11160→11160.
- Live DB after: `audit_row 0`, `signups 0`, `attempts 2` (as designed: consent-off requests still cost quota), then deleted → 0.

## 10. Activation procedure (local signup)
The whole edit, in `src/lib/newsletter/consent.server.ts`:
```ts
const APPROVED_CONSENT = { version: "melt-YYYY-MM-DD", text: "<approved wording>" } as NewsletterConsent | null;
```
Nothing else. Proof without enabling production: `consent-versioning.test.ts` projects an injected `{version,text}` through the same `projectConsent` the page uses, submits with the rendered version, and asserts the stored row equals the displayed text byte for byte, re-consent updates in place, and setting it back to null fails closed with old rows intact. It passed in this run. The version is assigned by engineering from the approval date (`melt-YYYY-MM-DD`). The client does not need to supply it.

**Local signup ≠ provider subscription.** Once activated the system can receive, validate, rate-limit, persist consent evidence, update preferences, and honestly report receipt. It cannot yet subscribe the address in an email platform, add it to a list, send a confirmation, prove double opt-in, or sync status.

Success-copy audit: MELT success = "Thanks — we received your sign-up." (truthful). Search for "you're subscribed / on the list / check your inbox / subscription confirmed / welcome to melt" found "You're on the list" only in the **waitlist** forms (`waitlist-cta.tsx`, `routes/index.tsx`, `routes/early-access.tsx`), not MELT. Those are outside T3 and were not changed.

## 11. Preferences
Allowlist `daily-note`, `weekly-brief`; ≥1 required; deduped; stored in allowlist order; arbitrary values rejected (tests). These are content choices, not provider list IDs.
**Clarification flag (no change made):** "Jay wants to take the daily note out of the aurum board" could mean an AURUM board element, the MELT Daily Note preference, or the feature as a whole. The MELT preference is unchanged pending clarification.

## 12. Client blockers

| # | Decision | Blocks local signup? | Blocks provider? | Already done |
|---|---|---|---|---|
| 1 | Approved MELT consent wording | **Yes** | Yes | Storage, display, parity, rollback |
| 2 | Consent version | No: engineering assigns `melt-YYYY-MM-DD` on approval | No | Convention documented |
| 3 | Explicit checkbox? | Yes (determines final consent interaction) | No | Nothing invented |
| 4 | Email platform | No | **Yes** | Provider-neutral local core |
| 5 | Who grants platform access | No | Yes | Secret form pattern exists |
| 6 | Platform audience/list | No | Yes | Local content preferences |
| 7 | Double opt-in / confirmation email | No (success copy may change) | Yes | Truthful receipt copy |

## 13. Provider handoff point
Synchronisation attaches in `runMeltSignup` **after** the upsert succeeds (step 7), or in a separate worker reading `newsletter_signups`. The local row is the evidence of record and is written first. A provider failure must never roll back or delete it. At most it changes whether the public reply stays the truthful "received" message. Whether sync is inline, queued, or retried depends on the chosen provider's API and rate limits, so that decision waits for the provider. No interface is created now.

**Double opt-in readiness:** additive only. Likely a provider-status/confirmed-at field (or none if the provider manages confirmation), an application token only if the app owns confirmation, and new success copy ("check your inbox" only once an email is actually sent). The current consent columns don't need redesigning.

## 14. Residual risks

| Item | Class | Why |
|---|---|---|
| Not DDoS protection | INFRASTRUCTURE/FUTURE HARDENING | Edge-level concern; app limiter covers per-visitor abuse |
| No repo-level request-body cap | INFRASTRUCTURE/FUTURE HARDENING | Host edge enforces its own limit; schema bounds stop large values reaching storage |
| No minimum pepper length | ACCEPTED RESIDUAL RISK | Blank/missing already fails closed; a floor could silently break the existing secret |
| Alternate IPv6 spellings = separate buckets | ACCEPTED RESIDUAL RISK | Cloudflare emits one canonical form; spoofing needs control of the trusted header |
None is a T3 blocker.

## 15. Test inventory
DB constraints (schema-db 17) · RLS/REST (rest-surface 236 attempts, function-privileges) · validation + normalisation (signup.server, 17 adversarial) · rate limiting + boundaries (7 fixture-based) · concurrency (burst, near-threshold, cross-instance) · duplicate privacy (byte-identical) · consent config + parity + rollback (consent-versioning) · stale consent (5 cases) · UI behaviour (form-state 14 + browser runs Phases 4, 6, 7) · failure semantics (limiter/upsert/throw/pepper) · logging privacy (console spy). No original requirement lacks a test. Gap stated plainly: a successful sign-up through the real browser form has not been observed, because production consent is off.

## 16. Evidence (this run)
- `bunx tsgo --noEmit`: clean.
- `bun run test`: 44 files, **680 passed**. Newsletter subset: 5 files, 160 passed.
- `bun run build`: success.
- Data before/after: 9 published posts (max updated_at 2026-09-19 05:31:05, unchanged), 7 gift-card orders (max updated_at 2026-09-23 04:59:59, unchanged), 0 gift cards, 0 ledger, 0 signups, 0 attempts after cleanup. Cron jobs: the 7 pre-existing aurum/commerce jobs plus `newsletter-prune-attempts`. Nothing else was added.

## Verdict
T3 PROVIDER-INDEPENDENT FOUNDATION COMPLETE — PRODUCTION SIGNUP SAFELY DISABLED PENDING CLIENT CONSENT AND PROVIDER DECISIONS
