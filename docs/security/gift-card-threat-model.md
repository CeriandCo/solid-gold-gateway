# SQOOT Pure Gift Card — threat model and go-live checklist

Covers everything built in steps B1–B5. Last reviewed 2026-09-19.

## Threats, controls and tests

| # | Threat | Control | Test reference |
| - | ------ | ------- | -------------- |
| 1 | Buyer tampers with the price in the browser | The browser sends only a denomination id; the amount, currency and limits live in `gift_card_denominations` and `commerce_settings` and are read server-side | `commerce-checkout.server.test.ts` (attempt binding), `docs/verification/B3a.md` money checks |
| 2 | Checkout used before the business is ready | `checkout_enabled` kill switch; delivery has a second switch `delivery_enabled` | `commerce-checkout.server.test.ts` "refuses while the kill switch is off"; `gift-delivery.server.test.ts` awaiting_email_provider |
| 3 | Checkout session created from an unknown site | Origin allowlist in `commerce_settings.allowed_origins` | `commerce-checkout.server.test.ts` origin test |
| 4 | Attempt replay: reusing an `attempt_id` to get a different amount | `attempt_id` is unique and bound to its denomination and order status; idempotency key includes the denomination | `commerce-checkout.server.test.ts` "binds an attempt id to its denomination" |
| 5 | Checkout flooding / card testing | Per-IP rate limits in `checkout_attempts`, separate buckets for checkout and status, IP taken only from `cf-connecting-ip` | `commerce-checkout.server.test.ts` rate-limit test |
| 6 | Order status used to enumerate other people's orders | Status endpoint returns a minimal status only; throttled polls return `confirming` | `docs/verification/B3b.md`, checkout suite |
| 7 | Forged webhook | Async raw-body Stripe signature verification, 5-minute tolerance, missing secret → 503, livemode mismatch → 400 | `stripe-webhook.server.test.ts` route guards |
| 8 | Webhook replay / duplicate delivery | `stripe_events` claim-and-takeover, idempotent settlement | `stripe-webhook.server.test.ts` duplicate + concurrent delivery |
| 9 | Oversized webhook body as a DoS | 256 KB cap, 413 before any signature work | `docs/verification/B3b.md` check 1 |
| 10 | Paying less than the card is worth | Settlement re-checks amount, currency and `client_reference_id` against the order | `stripe-webhook.server.test.ts` money/reference tests |
| 11 | Fraudulent or stolen-card purchases | Review rules: elevated risk, prepaid card, high value, high value without 3-D Secure, and daily limits per buyer, card fingerprint and recipient; counted inside the settlement function under locks | `stripe-webhook-refunds.server.test.ts` review-rule tests |
| 12 | Cashing out before a chargeback | 72-hour hold: cards are minted `pending` and only activate after `hold_until` and only when the order is exactly `paid` | `gift-delivery.server.test.ts` activation tests |
| 13 | Refund or dispute leaving value behind | Full refund voids (delivered goes via frozen), partial refund freezes or holds, refund/dispute on a redeemed card raises a critical alert | `stripe-webhook-refunds.server.test.ts` |
| 14 | Balance tampering | `gift_cards` state-machine guard, balance changes only through `gift_card_record`, append-only ledger (no UPDATE, no DELETE) | `stripe-webhook-refunds.server.test.ts` ledger integrity |
| 15 | Gift code theft from the database, logs or backups | A plaintext code exists only in memory at send time; the database stores `code_hash` (HMAC-SHA256 with `GIFT_CODE_PEPPER`) and `code_last4` only | `gift-delivery.server.test.ts` "no plaintext anywhere" |
| 16 | Double delivery or double spend of a delivery slot | 10-minute lease claim (`delivery_claimed_at`), conditional claim, `FOR UPDATE SKIP LOCKED` | `gift-delivery.server.test.ts` concurrent ticks |
| 17 | Failed email leaving a live code in an inbox | On failure the lease is released and the next tick mints a **new** code, invalidating the old hash | `gift-delivery.server.test.ts` provider failure |
| 18 | Anyone triggering the delivery cron | Shared secret header compared in constant time, read from Vault by `commerce_delivery_tick`; 401 before any database access | `gift-delivery.server.test.ts` secret tests |
| 19 | HTML/script injection through the gift message or recipient name | Every user value HTML-escaped in the HTML part; a plain-text part is always sent; no remote tracking pixels | `gift-delivery.server.test.ts` HTML escaping |
| 20 | Reading commerce data straight from the API | RLS enabled with **no policies** on every commerce table; no grants to `anon` or `authenticated` | `security/rest-surface.test.ts` |
| 21 | Calling a `SECURITY DEFINER` function through PostgREST RPC (e.g. marking an order paid without paying) | EXECUTE revoked from PUBLIC/anon/authenticated on every function the browser does not need; default privileges revoked; permanent regression test | `security/function-privileges.test.ts`, `security/rest-surface.test.ts` |
| 22 | A signed-in editor reaching commerce or another editor's data | Commerce invisible to `authenticated`; CMS policies limit editors to their own drafts; published posts cannot be changed or deleted through the API | `security/rest-surface.test.ts` editor tests |
| 23 | Secrets leaking into the browser bundle | Server-only modules, and a bundle scan for `sk_`, `rk_`, `whsec_`, `re_`, both peppers, both cron secrets and `service_role` | `docs/verification/B5.md` check 22 |

## Residual risks (stated honestly)

1. **Stripe policy approval.** Gift cards, stored value and precious metals are restricted categories. Without written approval from Stripe the account can be shut down or funds held, no matter how sound the code is. Nothing here removes that risk.
2. **Redemption is not built.** Only the server-side primitive `verifyGiftCode` exists. Redemption, its rate limiting, lockout, partial spend and audit trail are still to come, so a card today can be delivered but not spent.
3. **Email copy pending client approval.** The redemption sentence in the delivery email is marked `// COPY PENDING CLIENT APPROVAL` and must be replaced before the first real send.
4. **Shared rate-limit bucket without `cf-connecting-ip`.** The rate limiter trusts only that header. If it is ever absent (a non-Cloudflare path), attempts fall into one shared bucket with a warning: the limit still holds, but one abusive client can exhaust it for everyone on that path.
5. **Fraud rules are heuristics.** Daily limits and review reasons reduce but do not remove chargeback exposure; the 72-hour hold is shorter than a dispute window.
6. **Default-privilege drift.** `ALTER DEFAULT PRIVILEGES` binds to the creating role, so a future function created by another role could arrive PUBLIC-executable. The regression test is the real guard; keep it in CI.

## Go-live checklist, in order

1. **Stripe written approval** for the business model (gift cards / stored value tied to precious metals). Do not proceed without it.
2. **Restricted key (`rk_`)**, not a secret key. Minimum permissions:
   - Checkout Sessions: write
   - PaymentIntents: read
   - Charges: read
   - Customers: read (only if used later)
   - Refunds: read
   - Disputes: read
   - Events: read
   - Everything else: none. No Payouts, no Balance, no Connect, no Products/Prices write.
3. **Webhook endpoint** `POST /api/public/stripe-webhook` subscribed to exactly these five events: `checkout.session.completed`, `checkout.session.expired`, `charge.refunded`, `charge.dispute.created`, `charge.dispute.closed`.
4. **`STRIPE_WEBHOOK_SECRET`** added as a server secret.
5. **`currency`** set in `commerce_settings` (it is null today, which blocks checkout by design).
6. **`allowed_origins`** set to the published domain only.
7. **Stripe receipts** enabled so buyers get a payment receipt from Stripe.
8. **Radar rules** suggested: block if risk score is elevated; require 3-D Secure on every payment or at least above the review threshold; block more than 3 gift-card payments per card per day; review prepaid cards; block mismatched CVC and postcode.
9. **Email domain** with SPF, DKIM and DMARC verified, then `RESEND_API_KEY` as a secret and `email_from` set to the verified sender.
10. **Test-mode rehearsal** with Stripe test cards:
    - success `4242 4242 4242 4242`
    - 3-D Secure required `4000 0027 6000 3184`
    - generic decline `4000 0000 0000 0002`
    - dispute (fraudulent) `4000 0000 0000 0259`
    Walk each one end to end: order, settlement, hold, activation, delivery email, refund and dispute.
11. **Turn on the switches**: `checkout_enabled` first, then `delivery_enabled` once a real delivery email has been received and read.
12. **Switch to live keys** and create the live webhook endpoint with the same five events and a new signing secret.
13. **Publish.**
