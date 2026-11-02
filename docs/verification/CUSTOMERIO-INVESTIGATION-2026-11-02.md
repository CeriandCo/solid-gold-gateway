# Customer.io investigation — 2026-11-02

Read-only investigation; findings are in `.lovable/plan/customer-io-integration-investigation-findings-and-proposed-2026-11-02.md`.

Commands run: `rg` searches for customer.io/segment/resend/sendgrid/postmark/mailgun, server functions, `signInWithOtp`/`signUp`, and form submit handlers; listing of `src/routes` and `src/routes/api/public`.

Raw facts observed:
- No Customer.io/Segment code in `src/`. Resend is called in `src/lib/gift-delivery.server.ts:152`.
- Waitlist forms fake success: `src/hooks/use-waitlist-form.ts:27` and `src/routes/early-access.tsx:103` (`setTimeout(resolve, 600)`).
- Partner form `src/routes/partners.tsx:93` is browser-only.
- Only auth sign-in is admin magic link `src/lib/admin.server.ts:77`.

Decisions received: region US; first events = waitlist signups, partner applications, gift card purchases.
Secrets `CUSTOMERIO_SITE_ID` and `CUSTOMERIO_TRACK_API_KEY` were saved by the user through the secure form (values not read).

Not done / blocked:
- No app code written. Waitlist consent sentence was not supplied; project rules forbid inventing wording, so the build is paused until it is provided.
- No Customer.io API call made; credentials not validated.
