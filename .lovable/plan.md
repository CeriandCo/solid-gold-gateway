# Customer.io integration: investigation findings and proposed approach

No code changes yet. This is the answer to the five questions, then a proposed build if you approve.

## 1. Backend today
- Lovable Cloud database and auth. Server logic runs as TanStack server functions (`src/lib/*.functions.ts`) and public endpoints under `src/routes/api/public/` (Stripe webhook, gold price fetcher, AI Daily Note, gift-card delivery tick). Edge functions are not used.
- Main tables: `aurum_*` (editorial CMS, editors, AI runs, prices), `gift_card_*` + `commerce_*` + `stripe_events` (gift cards), `newsletter_signups` / `newsletter_attempts` (MELT opt-in, currently fails closed).
- Existing integrations: Stripe (checkout + webhook), Resend called directly in `src/lib/gift-delivery.server.ts` for gift-card emails (delivery switched off by default), Dillon Gage price feed, Amplitude + GA4 browser analytics. No Customer.io or Segment code exists, and no Customer.io secrets are set (checked last turn).

## 2. Where people are created or updated
- Waitlist (home, shared CTA, early-access): `src/hooks/use-waitlist-form.ts`, `src/components/waitlist-cta.tsx`, `src/routes/early-access.tsx`. They fake success with a 600ms timer and store nothing.
- Partners form: `src/routes/partners.tsx` (`onSubmit`), browser-only, stores nothing.
- MELT newsletter: `subscribeToMelt` in `src/lib/newsletter.functions.ts` -> `newsletter_signups`. The page now links to Circle instead, so this is unused on-screen.
- Gift-card buyers/recipients: `createGiftCardCheckout` (`src/lib/commerce.functions.ts`) and the Stripe webhook -> `gift_card_orders` (buyer_email, recipient_email). Checkout is off by default.
- Auth: only admin/editor sign-in (`src/lib/admin.server.ts`, magic link + `aurum_editors`). No customer accounts, signup or profiles exist; buying, vault and fractional gold happen in the app, not this website.

## 3. Candidate events
| Event | Where | Status |
|---|---|---|
| waitlist_joined | waitlist forms above | needs a real server submission first |
| early_access_requested | `early-access.tsx` | same as above (could be waitlist_joined with form_location) |
| partner_application_submitted | `partners.tsx` | needs a server submission first |
| newsletter_subscribed | `subscribeToMelt` | exists server-side, not shown on site |
| gift_card_purchased | Stripe webhook settle (`gift_card_order_settle`) | real, but checkout disabled |
| gift_card_delivered | `gift-delivery.server.ts` | real, delivery disabled |
| signed_up, purchase, vault actions | none | do not exist on the website |
Admin/editor sign-ins should not be sent (staff, not customers).

## 4. Proposed approach
- One server-only module `src/lib/customerio.server.ts` with `identify(email, attrs)` and `track(email, name, props)` calling the Track API (`https://track.customer.io/api/v1/customers/{id}` and `/events`; US region unless the workspace is EU) with Basic auth.
- Called only from server functions after the action succeeds (e.g. new `joinWaitlist` server function storing a `waitlist_signups` row, service-role only, then identify + `waitlist_joined`). Browser never sees keys.
- Use the email (lowercased) as the Customer.io id, plus `created_at`, `form_location`, `product_interest`, UTM fields.
- Secrets to add via Project Settings -> Secrets: `CUSTOMERIO_SITE_ID`, `CUSTOMERIO_TRACK_API_KEY`, optionally `CUSTOMERIO_REGION` (us/eu). Later, for sending transactional email through Customer.io, an App API key `CUSTOMERIO_APP_API_KEY`.
- Fail soft: the signup row saves even if Customer.io is down; failures are logged and retried by a small queue/tick, never shown to the visitor as an error.

## 5. Risks
- PII: email is sent by design; never send free-text messages, phone, KYC, banking or payment data. Gift recipients did not consent themselves, so do not identify them as marketing contacts. Privacy Policy should list Customer.io as a provider.
- Consent: waitlist signup must state that we will email them; marketing vs transactional must be separated (the MELT consent text is still unset).
- Rate limits: Track API ~100 requests/s per workspace; fine for our volumes, but add backoff.
- Duplicates: double-clicks and webhook retries. Use a stored row plus an event `id` (dedupe key) per action; Stripe events already dedupe via `stripe_events`.
- Test vs production: preview and live share one database. Use a separate Customer.io workspace for preview, or gate sends to production hosts; mark Stripe test-mode orders and never send them.
- Abuse: the waitlist endpoint is public; reuse the existing hashed-IP rate limiting pattern from the newsletter.
- Sending domain: until trunk.gold is verified, Customer.io campaigns should stay paused.

## Open questions before building
- Is the Customer.io workspace US or EU region?
- Which events go first: waitlist only, or also partners and gift cards?
- Exact consent wording to show under the waitlist form.
