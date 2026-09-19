# B3a verification — Stripe webhook, part 1

Run: 2026-09-19, local dev, no Stripe key and no webhook secret configured on the project.
Tests: `bunx vitest run` — 26 tests across 3 files, all green (12 webhook tests here).

| # | Check | Result | Note |
|---|-------|--------|------|
| 1 | Bad signature → 400, nothing written | PASS | stripe_events count unchanged; logged category `signature_invalid` only |
| 2 | Livemode mismatch → 400 | PASS | signed payload with `livemode: true` against a test-mode key |
| 3 | Unknown event type → ignored, 200 | PASS | `payment_intent.succeeded` stored as `ignored` / `unhandled_type` |
| 4 | Same completed event delivered twice | PASS | exactly 1 card, 1 `issue` ledger entry; second delivery returns `duplicate` |
| 5 | Two concurrent deliveries | PASS | exactly 1 card (conditional claim + unique `order_id`) |
| 6 | Happy path | PASS | order `paid`, card `pending`, balance 25000, hold_until ≈ now + 72h, name "Ada Lovelace" and message "Happy birthday" with control characters stripped, emails lowercased, fingerprint stored as a 64-char hash and never raw |
| 7 | amount_total ≠ order amount | PASS | order `review`, card `review`, no activation |
| 8 | Invalid recipient email | PASS | order `review`, card `review` |
| 9 | payment_status `unpaid` | PASS | no card, order stays `open`, event `ignored` / `not_paid` |
| 10 | client_reference_id mismatch | PASS | no card, event `ignored` / `order_reference_mismatch` |
| 11 | `checkout.session.expired` | PASS | open order → `expired`; already-paid order unchanged |
| 12 | Final DB state | PASS | orders 0, cards 0, ledger 0, stripe_events 0, checkout_attempts 0 |
| 13 | Bundle scan + build + typecheck | PASS | see below |

## Bundle scan and build

- `dist/client` contains no `sk_`, `rk_`, `whsec_`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` or pepper value.
- No server-only module (`*.server`, service-role client) reachable from the browser build.
- `bunx tsgo --noEmit` clean; `bunx vite build` clean.

## Endpoint and subscriptions

- Endpoint path: `POST /api/public/stripe-webhook`
- Events handled today: `checkout.session.completed`, `checkout.session.expired`
- Events to subscribe once B3b lands: `checkout.session.completed`, `checkout.session.expired`,
  `charge.refunded`, `charge.dispute.created`, `charge.dispute.closed`,
  `payment_intent.payment_failed`
