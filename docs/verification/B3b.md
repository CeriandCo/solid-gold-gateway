# B3b verification — refunds, disputes, fraud review rules and alerts

Run: 2026-09-19, local dev, no Stripe key and no webhook secret configured on the project.
Tests: `bunx vitest run` — 47 tests across 4 files, all green (21 in `src/lib/stripe-webhook-refunds.server.test.ts`).

| # | Check | Result | Note |
|---|-------|--------|------|
| 1 | Body over 256 KB → 413, nothing written | PASS | rejected on `content-length` and on text length, before any signature work |
| 2a | Clean payment under every threshold | PASS | order `paid`, card `pending`, `review_reasons` empty |
| 2b | `radar_elevated` | PASS | `outcome.risk_level = elevated` → review with that reason |
| 2c | `prepaid_card` | PASS | `card.funding = prepaid` → review with that reason |
| 2d | `high_value` and `no_3ds_high_value` | PASS | at 100000 cents: `high_value` alone with 3DS authenticated; both reasons when not authenticated |
| 2e | `daily_limit_card` | PASS | two 150000-cent payments on one fingerprint; the second flagged |
| 3 | Concurrency, `daily_limit_email` | PASS | two simultaneous 150000-cent settlements for one buyer against a 200000 limit → exactly one flagged (advisory locks inside `gift_card_order_settle`) |
| 4 | `daily_limit_recipient` across two buyers | PASS | second order flagged |
| 5 | Full refund | PASS | `pending` → `void`, `active` → `void`, `delivered` → `freeze` then `void` (two ledger entries); order → `refunded` |
| 6 | Partial refund | PASS | `active` → `frozen`, `pending` → `review`, order → `review`, `warning` alert raised |
| 7 | Refund or dispute on a `redeemed` card | PASS | no transition; `critical` alert in both cases |
| 8 | Dispute created then won | PASS | `active` → `frozen` → `active`, `delivered` → `frozen` → `delivered`, a `review` card stays in review; order → `paid`; `info` alert |
| 9 | Dispute created then lost | PASS | card → `void`, order stays `disputed`, `warning` alert |
| 10 | Replaying a refund event | PASS | second delivery returns `duplicate`; ledger unchanged (`issue`, `void`) |
| 11 | Ledger append-only and balances consistent | PASS | UPDATE and DELETE both refused with "append-only"; `balance_after` equals the card amount throughout and never exceeds it |
| 12 | Final DB state | PASS | orders 0, cards 0, ledger 0, stripe_events 0, alerts 0, attempts 0; settings `checkout_enabled = false`, `currency = null`, `allowed_origins = {}` |
| 13 | Bundle scan and build | PASS | `dist/client` free of `sk_`, `rk_`, `whsec_`, key names and the pepper; no server-only module reachable from the browser build; `bunx vite build` and `bunx tsgo --noEmit` clean |

## Endpoint and subscriptions

- Endpoint path: `POST /api/public/stripe-webhook`
- Stripe events to subscribe (the five handled ones):
  `checkout.session.completed`, `checkout.session.expired`,
  `charge.refunded`, `charge.dispute.created`, `charge.dispute.closed`
- Every other event type is recorded as `ignored` and answered with 200.
