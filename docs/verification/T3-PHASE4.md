# T3 Phase 4 — MELT form connected to the secure signup boundary

Date: 2026-09-23. Nothing published. No provider, no provider key, no double opt-in, no consent checkbox,
no invented consent wording.

## 1. Files changed

| File | Change |
|---|---|
| `src/components/aurum-subscribe-section.tsx` | fake submission removed; real server call wired; consent placeholder removed |
| `src/lib/newsletter/form-state.ts` | new — pure request builder, result mapping and public wording |
| `src/lib/newsletter/form-state.test.ts` | new — 14 tests (logic + structural client boundary) |

No migration, no schema change, no change to the Phase 3 server boundary.

## 2. Existing MELT UI re-audit

Confirmed before editing: email field `#aurum-melt-email` (`type="email"`, `required`, `maxLength={254}`,
labelled, `aria-describedby` on the status region); two checkboxes `#aurum-subscribe-daily-note` and
`#aurum-subscribe-weekly-brief` inside a `fieldset` with the legend "WHAT WOULD YOU LIKE TO RECEIVE";
`GoldButton` submit with the "Subscribing…" label; a `role="status" aria-live="polite"` region; a second
`aria-live` line for "Choose at least one thing to receive."; a success panel that replaced the form; an
error string; a consent block rendering `CONSENT_TEXT`; a 400 ms fake delay; `console.info("[the-melt] …")`;
and `attributionSource()` collecting page, referrer, UTM, gclid and ref.

Phase 3 contract as actually implemented: `subscribeToMelt` (POST) taking
`{ email: string, lists: ("daily-note"|"weekly-brief")[], source: "aurum_melt" }` under `.strict()`, and
returning `{ ok: true }` or `{ ok: false, code: "invalid_request" | "rate_limited" | "unavailable" }`.

**Mismatches found between the old UI payload and the real contract**, all resolved by changing the UI:
the old payload sent booleans `dailyNote`/`weeklyBrief` instead of a `lists` array; sent `consentText`,
`consentVersion` and a browser `timestamp`; and sent `source` as an attribution object rather than the
allowlisted string. Every one of those would now be rejected by `.strict()`. The server was not weakened.

## 3. Fake-path removal

Deleted: the 400 ms `setTimeout`, `console.info("[the-melt] subscribe", payload)`, the unconditional
`setStatus("success")`, and the `// Customer.io is not wired yet` comment. There is exactly one submission
path and no hidden fallback — asserted structurally by a test that fails if any of those strings return.

## 4. Real server wiring

`useServerFn(subscribeToMelt)` → `subscribe({ data: buildSignupRequest(email, selected) })`. The component
imports only `@/lib/newsletter.functions` and the client-safe `form-state` module; a test asserts no import
line in the component contains `.server`. Production client bundle scan for `newsletter_signups`,
`NEWSLETTER_HASH_PEPPER` and `runMeltSignup`: zero matches.

## 5. Exact browser request shape

Captured from a real submission in Chromium (decoded from the RPC body):

```
keys: ["email","lists","source"]
email:  "Payload.Check@Example.COM"
lists:  ["weekly-brief"]
source: "aurum_melt"
```

Nothing else is sent.

## 6. Preference mapping

The two controls map to the stable server identifiers `daily-note` and `weekly-brief`; the titles
"Daily Note" and "Weekly Brief" stay display-only (a test asserts no label text appears in the request).
The browser requires at least one selection for UX, and the server independently enforces the same rule
plus the allowlist — Phase 3 tests prove a tampered payload with `monthly-digest`, an empty array, or an
extra field is rejected with `invalid_request` and writes no row. These are content preferences, never
provider audiences.

## 7. Client-side email UX

Unchanged and deliberately simple: `type="email"`, `required`, `maxLength={254}` (matching the server and
database limit). No React-side email validator was added. The value is sent as typed; the server trims,
lowercases and validates, so the browser cannot disagree with server normalisation.

## 8. Consent-placeholder removal

`CONSENT_VERSION`, `CONSENT_TEXT` and the `.aurum-subscribe__consent` block were removed from the
component. No consent wording is displayed anywhere on the page, and the browser holds no consent snapshot
at all. A test fails if `CONSENT_TEXT`, `CONSENT_VERSION`, `2026-09-20` or `CLIENT-APPROVED` reappears in
the component. A code comment records where the approved copy will go (the server consent module) and that
it is displayed here in the same change.

The `.aurum-subscribe__consent` CSS rules remain in `src/styles.css`, unused, ready for the approved copy.

## 9. Submit-availability decision

**Chosen: submit → server → `unavailable`.** No availability endpoint was added.

Audited for an existing safe mechanism: there is none for the newsletter. The commerce precedent
(`getGiftCardOffering.available`) is a separate read of operator settings, not reusable here. Adding a
capability API purely so a disabled button can be rendered is the "new configuration API just for polish"
the brief warns against, and it would still require a round trip. The cost of the chosen path is one
rate-limit attempt row per submission, hashed, pruned after 7 days — acceptable, and it exercises the real
boundary. If the wording stays unresolved for long, a single boolean server function is a small later
addition.

## 10. No checkbox invented

No consent checkbox was added and no acknowledgement field exists in the request contract. Whether
submitting the form is itself the affirmative action, or an explicit checkbox is required, remains an open
product/legal decision.

## 11. Attribution fields removed

`attributionSource()` was deleted in full. No longer collected or sent: `window.location.pathname`,
`document.referrer`, every `utm_*` parameter, `gclid`, `ref`, and the browser-generated `timestamp`. Nothing
else in the component used them. None are persisted or logged anywhere.

## 12. Pending and double-submit behaviour

`event.preventDefault()`, a `useRef` in-flight flag set synchronously plus a `submitting` state, the submit
button disabled while pending and labelled "Subscribing…", and the `role="status"` region announcing
"Sending your preferences." Browser proof: three `requestSubmit()` calls in one tick produced **1** POST
request. (Two deliberate sequential clicks separated by a completed round trip produce two requests, which
is correct — that is a retry.)

## 13–16. Result wording

| Server result | Shown to the visitor |
|---|---|
| `{ ok: true }` | "Thanks — we received your sign-up." + "We have your preferences for …" |
| `invalid_request` | "That email address does not look right. Check it and try again." |
| `rate_limited` | "Too many attempts just now. Please try again in a little while." |
| `unavailable` / thrown exception | "Sign-up is not available just yet. Please try again soon." |

Tests assert the wording contains none of: "subscribed", "on the list", "mailing list", "confirm",
"check your inbox", "customer.io", "consent", "zod", "database", "pepper", "sql", "attempt count".

## 17. Repeated-signup privacy

Success wording and the success panel are identical for a first and a repeat signup; nothing distinguishes
created from updated. The server returns the same `{ ok: true }` in both cases (proven in Phase 3), and the
UI has no branch that could differ — it never learns which happened.

## 18. Error recovery

`setSubmitting(false)` and the in-flight flag are cleared in `finally`, so controls always re-enable.
On every failure the form stays on screen with the typed email and the chosen preferences intact — verified
in the browser at all three widths (`emailStillFilled: true`, `checkboxStillChecked: true`,
`submitDisabledAfter: false`). Only a success replaces the form.

## 19. Accessibility result

Measured in the browser: `label[for=aurum-melt-email]` present; both checkboxes have `label[for]`;
fieldset legend "WHAT WOULD YOU LIKE TO RECEIVE"; email `aria-describedby` points at the status region's id;
status region is `role="status" aria-live="polite"`; the "choose at least one" message has its own
`aria-live`; pending state is both a visible label change and an announced status; keyboard submission from
the email field with Enter works (it produced a real request). Outcome is conveyed by text, not colour
alone. No modal was introduced.

## 20. Responsive result

| Viewport | page scrollWidth | email input | CTA | horizontal overflow |
|---|---|---|---|---|
| 375 | 375 | 285px | 285px | none |
| 768 | 768 | 654px | 654px | none |
| 1440 | 1440 | 722px | 722px | none |

Status copy wraps within the panel at every width. `scrollWidth` is identical before and after submission,
so the new status text introduces no overflow. `scrollY` before submit 6586 → after click 6586 → after the
response settled 6586: no scroll jump. Zero console errors at all three widths. No visual redesign.

## 21. Structural client-boundary tests

`src/lib/newsletter/form-state.test.ts` → **14 passed**. The request is asserted to carry exactly
`email`, `lists`, `source`, and its serialisation must not contain `consent`, `timestamp`, `created`,
`updated`, `ip`, `provider`, `audience`, `status`, `referrer`, `utm`, `gclid` or any display label. The
component is asserted to contain no fake path, no consent constant, no attribution collection, no
server-only import, and to keep the double-submit guard.

## 22. Production fail-closed verification

Real browser, real server function, real database, at 375 / 768 / 1440:

- MELT section renders; no placeholder consent visible (`placeholderConsentVisible: false`);
- preference chosen, valid address entered, submitted;
- a real POST to the `subscribeToMelt` endpoint is made;
- pending state shown, then "Sign-up is not available just yet. Please try again soon.";
- success never shown (`successShown: false`);
- `select count(*) from newsletter_signups` → **0**;
- controls recover from pending.

The rate-limited path was also observed live after repeated runs, showing the generic retry message.

## 23. Test-only success result

The successful path is covered by the Phase 3 suite's injected test consent (44 tests), including first
signup, repeat signup returning the identical public result, correct preference storage, server-owned
consent snapshot, normalised email and the concurrent-duplicate case. Phase 4 adds the UI half: the request
builder and the success mapping. No production consent fallback exists, so a browser run with injected
consent is not possible without creating one — deliberately not done. Reported as a limitation.

## 24. Browser verification

Covered in items 12, 19, 20 and 22. Scripts under `/tmp/browser/melt/`; screenshots captured per width.

## 25. Search for old fake MELT code

`rg "the-melt|Customer.io"` across `src/`: matches only inside `form-state.test.ts`, where they are the
strings the regression test forbids. No stale Customer.io comment remains anywhere.

## 26. Search for placeholder consent

`rg "CONSENT_TEXT|CONSENT_VERSION|2026-09-20|CLIENT-APPROVED"` across `src/`: matches only the same
regression test, plus three unrelated pre-existing uses of the date `2026-09-20` (a commerce incident
comment, two image asset timestamps, one price-adapter fixture). None is consent copy.

## 27. No provider integration

`rg -i "mailchimp|klaviyo|brevo|mailerlite|customer\.io|convertkit|audience_id"` across `src/` and
`package.json`: matches only the forbidden-string list in the new test. No SDK, no API request, no audience
or list id, no provider key, no sync state, no confirmation email. "List" continues to mean a MELT content
preference only, stated in the code comments.

## 28–31. Regression and gates

- Phase 2 DB tests and Phase 3 server tests: included in the suite, passing.
- REST-surface (live, `ALLOW_LIVE_DB_TESTS=1`): 9 passed, "REST attempts checked: 234".
- `bunx tsgo --noEmit`: exit 0.
- `bun run test`: **42 files, 595 tests passed** (was 41 / 581).
- `bun run build`: success, Nitro output generated.

## 32. Existing data

Published AURUM posts: **9**, unchanged. `gift_card_orders` 7, `gift_cards` 0 — unchanged.
`newsletter_signups` **0**: the fail-closed path created none. The rate-limit attempt rows created by the
browser checks were deleted afterwards, so `newsletter_attempts` is **0**. No fixture left behind, no
provider secret added.

## 33. Remaining client blockers

Email/newsletter platform; who grants access; which list/audience sign-ups join; the exact approved consent
wording and its version; whether an affirmative checkbox is required; whether double opt-in is required.

## 34. Deviations / blockers

- No availability endpoint; a submission on the live site costs one hashed attempt row and returns
  "not available just yet" (item 9).
- The consent block was removed rather than filled with neutral text, because any sentence placed there
  could be read as consent language.
- A browser run of the success path is not possible without a production consent fallback; covered by
  server tests instead.

## 35. Recommended Phase 5

Two independent pieces, in this order once the client answers:

1. **Enable local signup** — paste the approved wording and version into
   `src/lib/newsletter/consent.server.ts`, render the same copy in the form's consent block (reusing the
   existing `.aurum-subscribe__consent` styles), and add a checkbox only if the approved wording requires an
   affirmative act (the server then gains `acknowledged: z.literal(true)` plus a literal version token, as
   commerce C-9 does). Verify end to end in the browser and confirm a real row is stored.
2. **Provider integration** — only after the platform is named: an `EmailProvider`-style adapter mirroring
   the Resend pattern, the key entered through the secret manager by the account owner, provider sync state
   added as new columns, and double opt-in wording if required. Local consent evidence stays the record of
   truth; a provider failure must never block or delete a stored signup.
