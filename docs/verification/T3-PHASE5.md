# T3 Phase 5 — MELT consent activation / versioning contract

Date: 2026-09-23. No publish. No provider. No approved wording invented.

## 1. Files changed

| File | Change |
| --- | --- |
| `src/lib/newsletter/consent.server.ts` | Rewritten as the single authoritative consent definition: `APPROVED_CONSENT = null`, strict validation, `projectConsent()`, `publicConsentNotice()`, documented activation/rollback procedure and version convention. |
| `src/lib/newsletter.functions.ts` | Added `fetchMeltConsentNotice` (GET server fn) returning `{ text } | null`, and the `MeltConsentNotice` type. |
| `src/routes/aurum.tsx` | Loader fetches the consent notice alongside editorial data and passes it to the MELT section. |
| `src/components/aurum-subscribe-section.tsx` | Accepts `consentNotice` and renders the wording as plain text; comment updated. |
| `src/lib/newsletter/signup.server.ts` | Stores `consent_version` / `consent_text` verbatim (no `.trim()` repair — the validator already refused untrimmed values). |
| `src/lib/newsletter/consent-versioning.test.ts` | New: 27 tests (configuration, parity, version change, repeat, rollback, structural safety). |
| `docs/verification/T3-PHASE5.md` | This report. |

No migration. No UI redesign. No new CSS (reuses the existing, previously unused `.aurum-subscribe__consent`).

## 2. Current consent-boundary re-audit (before changes)

- The server decided consent availability in `src/lib/newsletter/consent.server.ts` via `APPROVED_CONSENT = null` + `isUsableConsent()`; `runMeltSignup` step 4 refused with `{ ok: false, code: "unavailable" }` before any write.
- Test-only consent was injected through `runMeltSignup(data, { consent })`, defaulting to `approvedConsent()`.
- No environment variable was or is involved in consent.
- No production consent version/text constant existed anywhere; the component's old `CONSENT_TEXT` / `CONSENT_VERSION` placeholders were deleted in Phase 4.
- The browser showed no wording at all and displayed "Sign-up is not available just yet. Please try again soon."
- `newsletter_signups` receives: `email`, `lists`, `consent_version`, `consent_text`, `consented_at`, `source`; `id`, `created_at`, `updated_at` are database-owned.

Phase 5 changed no security semantics; it added the display projection and hardened validation.

## 3. Authoritative consent location

`src/lib/newsletter/consent.server.ts` — one definition, server-owned. The component, the server function and the database snapshot all derive from it. No copy exists in React, in a migration, in an environment variable or in a production fixture.

## 4. Production-inactive representation

`const APPROVED_CONSENT = null as NewsletterConsent | null;` — a type-safe absence. No placeholder, no bracketed marker, no explanatory prose presented as copy, no empty string treated as valid. A structural test asserts this exact line and asserts the file contains none of `CLIENT-APPROVED`, `lorem`, `test-v1`, `Test consent text`.

## 5. Configuration validation

`isUsableConsent()` requires: both values strings; both already trimmed (no silent repair); version 1–80 chars; text 1–4000 chars (mirrors the DB CHECKs); no control characters except newline/tab in the text; no newline/tab in the version. Anything malformed → `approvedConsent()` is null → signup unavailable, nothing partially stored.

## 6. Version convention

`melt-YYYY-MM-DD` — the date the wording was approved. Bump for any material change to what the visitor agrees to (wording, purpose, communication scope, privacy meaning). A pure refactor that leaves the text identical does not bump it. No real version exists yet, by design.

## 7. Historical snapshot behaviour

Stored consent is historical evidence, never derived from current configuration at read time. Tested: a v1 row keeps its v1 text/version/timestamp after the configuration changes to v2 and after configuration is withdrawn entirely.

## 8. Repeat signup after a version change

Same normalised email → same row `id`, original `created_at` preserved, `lists` refreshed, `consent_version` / `consent_text` updated to the new snapshot, `consented_at` refreshed, `source` refreshed. Verified in test and in the browser (id `8e59…2ffc8` unchanged, `created_at 15:26:58.409801+00` unchanged, snapshot moved v1 → v2).

**Limitation, stated plainly:** one row per email records the person's *latest* consent evidence, not a full immutable ledger of every consent event. No consent-history table was added; there is no concrete requirement for one yet. If a complete sequence is ever required, that is an append-only child table and a separate phase.

## 9. Repeat signup under the same version

Treated as a new affirmative submission: generic `{ ok: true }` identical to a first-time signup (test asserts the two results are deep-equal and the object's only key is `ok`), same row, same id, original `created_at`, `consented_at` refreshed, preferences refreshed. Nothing reveals that the address already existed.

## 10. Browser-visible consent architecture

Project-native SSR data loading: the `/aurum` route loader calls `fetchMeltConsentNotice()` (GET server fn) in the same `Promise.all` as the editorial reads, with `.catch(() => null)` so a failure degrades to "no wording, signup unavailable". The projection contains only `text` — no version, no secrets, no configuration detail. The browser never submits consent data; `subscribeToMelt` still accepts only `{ email, lists, source }` under `.strict()`.

## 11. Displayed / stored parity

Both sides read the same object: the page renders `projectConsent(approvedConsent()).text`; the server stores `approvedConsent().text` verbatim. There is no second manually copied string. Test `stores byte-for-byte the text the visitor was shown` asserts `stored.consent_text === shown.text`. Browser proof: displayed `Browser check consent wording version one.` → stored `Browser check consent wording version one.`

## 12. Activation behaviour

With a valid definition: wording appears, the form submits normally, a valid signup persists, generic success shows. With none: no wording, `unavailable`, no row. No code change moves between these two states — only the constant.

## 13. Rollback

Set `APPROVED_CONSENT` back to `null`. Wording disappears, every signup fails closed, no new rows, existing consent evidence untouched (including for a returning address that re-submits). Proved in test and in the browser: after rollback the stored row still read `browsercheck-v2`, `consented_at 15:27:45.709+00`, unchanged.

## 14. Checkbox decision

No checkbox added. Whether submitting the form is itself the affirmative act, or an explicit tick-box is required, depends on the approved wording and remains a client decision.

## 15. Rendering / XSS safety

Rendered as a React text child inside `<p className="aurum-subscribe__consent">`; React escapes it. No `dangerouslySetInnerHTML`, no stored HTML, no markup execution. Control characters are rejected at configuration time. A structural test asserts the component contains no `dangerouslySetInnerHTML`.

## 16. Test-only configuration isolation

Phase 3's dependency injection is reused unchanged: `runMeltSignup(data, { consent })`. Test snapshots (`test-v1`, `browsercheck-v1`) live only in test files and never in `consent.server.ts`; production has no fallback path to them, and the module reads no environment variable. No second testing mechanism was invented.

## 17. Source control vs environment

Source-controlled. Consent wording is reviewed product/legal copy, not a secret: keeping it in the repository makes the exact text, the exact version and the fact that signup is being enabled visible in code review, and testable. Environment variables remain for credentials only (e.g. `NEWSLETTER_HASH_PEPPER`).

## 18. Exact future activation procedure

1. In `src/lib/newsletter/consent.server.ts`, replace `null` with `{ version: "melt-YYYY-MM-DD", text: "…approved wording…" }`.
2. Run `bunx vitest run src/lib/newsletter` (the structural test asserting `null` must be updated in the same change, deliberately, so activation cannot happen silently).
3. Open `/aurum#subscribe`, confirm the wording renders and a signup stores that exact text.
4. Deploy.

No other file changes. Rollback is step 1 in reverse.

## 19. No provider assumptions

Structural test asserts the changed files contain none of: customer.io, mailchimp, klaviyo, brevo, mailerlite, audience_id, provider_id, double opt-in, confirmation_token, confirmed_at. No SDK, no key, no sync state, no confirmation email.

## 20–21. Documentation and client decisions

What T3 records today: **local signup consent evidence** — email, MELT content preferences, the exact wording accepted, its version, and when. Nothing more.

- **Newsletter provider subscription** — not implemented. No platform chosen, no adapter, no key.
- **Double opt-in confirmation** — not decided, not implemented.
- **Content preferences** — Daily Note / Weekly Brief are MELT content choices, *not* provider audience/list IDs.
- **Consent history** — latest consent per address, not a full event sequence (see item 8).

No compliance claim is made here; this stores consent evidence.

Remaining client decisions, none resolved:

1. Approved MELT consent wording (blocks activation).
2. Whether an explicit checkbox is required.
3. Newsletter/email platform.
4. Who grants/configures provider access.
5. Provider audience/list.
6. Whether double opt-in / a confirmation email is required.

## 22–27. Tests

`src/lib/newsletter/consent-versioning.test.ts` — 27 passed, throwaway database only:

- Configuration (15): production unconfigured; well-formed accepted; 13 malformed shapes refused (absent, undefined, empty/whitespace/untrimmed version and text, oversized version and text, control characters, newline in version, non-string); malformed definition → unavailable with no row.
- Parity (3): projection is exactly `{ text }`; stored text/version match what was shown; browser-supplied `consent_text` / `consent_version` / `consented_at` rejected as `invalid_request` with no row.
- Version change (1 composite): v1 row retained; v2 stored for a new address; returning address re-consents in place with same id and `created_at`; unrelated v1 row unchanged.
- Same-version repeat (1): identical generic result, same id, original `created_at`, `consented_at` advanced, preferences refreshed.
- Rollback (1): new signup refused, no row, returning address cannot overwrite, existing row deep-equal to before.
- Structural safety (5): single null definition and no `process.env`; no placeholder/test wording in the production file; no HTML injection; browser non-authoritative; no provider machinery.

## 28. Browser verification (real preview, live consent configuration toggled temporarily)

1. Test wording v1 configured → `/aurum#subscribe` displayed exactly `Browser check consent wording version one.`
2. Submitted `melt-check@example.com` with Daily Note → POST to the signup server function, 200, panel `Thanks — we received your sign-up. | We have your preferences for Daily Note.`
3. Database: `consent_text = Browser check consent wording version one.`, `consent_version = browsercheck-v1`, `id 8e593e13-d6c0-4d85-836f-f64df0e2ffc8`, `created_at 2026-09-23 15:26:58.409801+00` — byte-identical to the displayed text.
4. Switched to v2 → page displayed `Browser check consent wording version two, materially revised.`
5. Re-submitted the same address → same id, `created_at` unchanged, `consent_version = browsercheck-v2`, `consented_at 15:27:45.709+00`, `updated_at 15:27:45.849269+00`.
6. Configuration returned to `null` → wording absent from the page (`.aurum-subscribe__consent` count 0), submission returned `Sign-up is not available just yet. Please try again soon.`, no new row, existing row unchanged.

## 29. Cleanup

Throwaway row and all attempt rows deleted. Consent file restored to `APPROVED_CONSENT = null` (verified at line 58). Post-cleanup counts: `published 9, signups 0, attempts 0, orders 7, newsletter policies 0`.

## 30–33. Regression

- Full suite: **622 passed, 43 files** (595 before; +27 new).
- REST-surface live security suite (`ALLOW_LIVE_DB_TESTS=1`): 9 passed.
- Typecheck `bunx tsgo --noEmit`: clean.
- Production build `bun run build`: success.

## 34. Existing data

`published = 9` AURUM posts unchanged; `gift_card_orders = 7` unchanged; zero newsletter signups and zero attempts remain; RLS policies on both newsletter tables still 0.

## 35. Deviations / blockers

- The dev server must restart to pick up a change to the consent module (server-only). Noted in the activation procedure as part of a normal deploy; no code impact.
- The structural test pinning `APPROVED_CONSENT = null` must be edited when the wording is approved. Deliberate: activation cannot pass review unnoticed.
- Browser verification required temporarily configuring test wording on the running preview, which wrote one throwaway row to the project database. It was removed; counts above confirm.
- Blocker unchanged: production signup stays disabled until approved wording exists.

## 36. Recommended Phase 6

Two independent steps, in this order, once the client answers:

1. **Activate consent** — paste the approved wording and version into `consent.server.ts`, update the pinning test, decide checkbox vs submit-as-affirmative based on the wording (a checkbox would add `acknowledged: z.literal(true)` plus a literal version token to the request contract, as commerce C-9 does), browser verify, confirm a real row stores the exact displayed text.
2. **Provider integration** — only after the platform is named: an `EmailProvider`-style adapter mirroring the Resend pattern, key entered through the secret manager by the account owner, provider sync state as new columns, double opt-in if required. Local consent evidence remains the record of truth; a provider failure must never block or delete a stored signup.
