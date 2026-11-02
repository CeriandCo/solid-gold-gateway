# Customer.io — waitlist / early access + partner applications (2026-11-02)

## Built
- Tables `waitlist_signups`, `partner_applications`, `lead_rate_events` (service-role only, RLS on, no anon/authenticated grants).
- SQL function `lead_rate_check` — REVOKE ALL FROM PUBLIC, anon, authenticated; EXECUTE to service_role only.
- Server: `src/lib/leads.functions.ts` → `src/lib/leads/leads.server.ts`; sender `src/lib/leads/customerio.server.ts` (US Track API, identify `PUT /customers/{email}` then `POST /customers/{email}/events`).
- Consent: `src/lib/leads/consent.ts` (version `waitlist-2026-11-02`), rendered by `src/components/waitlist-consent.tsx` under the home final CTA, shared waitlist CTA and /early-access forms; the same text is stored per row.
- Forms wired: `src/hooks/use-waitlist-form.ts`, `src/routes/early-access.tsx`, `src/routes/partners.tsx`. Fake 600ms success removed.
- New secret `LEADS_HASH_PEPPER` (generated) for IP hashing.

## Rules
- Live-only: Customer.io called only when the request Origin (fallback Host) is `trunk.gold` / `www.trunk.gold`. Other hosts save with `environment=non_production`, `cio_status=skipped`.
- Rate limits per hashed IP: waitlist 5/15 min, 20/day; partner 3/15 min, 10/day.
- Dedupe: unique email per table, insert-once; send claimed via `pending|failed|skipped → sending` update, so at most one event per row. A resubmission on the live site retries a `failed` row.
- Fail soft: row saved first; Customer.io errors/timeouts (5s) mark `failed`, visitor still sees success.
- Events: `waitlist_joined` {source, consent_version}; `partner_application_submitted` {role, license, state, client_count}. Phone and message are not sent.

## Checks run (raw)
- `bunx tsgo --noEmit`: no output (pass).
- `bunx vitest run` (project config): blocked — `scripts/test-db/up.sh` failed (same as earlier tasks). New test file run with a standalone config: `Tests 5 passed (5)`.
- `bun run build`: not run manually; build log: `build OK` (2026-11-02T09:11:35Z).
- Browser /early-access: 375 / 768 / 1440 → consent visible True, horizontal overflow 0 at all three.
- Preview submit early_access → row: `cio_status:skipped consent_version:waitlist-2026-11-02 environment:non_production source:early_access`, consent_text exact.
- Partner submit + repeat waitlist submit → counts: waitlist n=1, partner n=1, both skipped/non_production.
- Test rows then deleted (targeted by exact QA email).

## Not verified
- No live Customer.io call was made (preview is blocked by design; site not published). Credentials not validated.
- Whether the live host sends Origin `https://trunk.gold` to server functions is assumed (standard browser behaviour), not observed.
- Customer.io workspace must accept email as identifier ("Email or ID" setting).
- scrollY on the partner submit was not asserted.
