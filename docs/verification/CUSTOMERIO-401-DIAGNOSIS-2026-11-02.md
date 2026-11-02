# Customer.io test signup — 401 diagnosis (2026-11-02)

No code changed. Secret values were not read.

## Database row (waitlist_signups, queried this run)
- email: hoangvh238.dev+trunktest1@gmail.com
- environment: production
- cio_status: failed
- cio_attempts: 1
- cio_sent_at: null
- source: early_access, consent_version: waitlist-2026-11-02
- created_at: 2026-11-02 09:30:17.017214+00

## Published server log
`[2026-11-02T09:30:17.781Z] [warn] [customerio] identify failed (401)`

The app does not store the Customer.io error body; only the HTTP status is logged.

## Endpoint
`src/lib/leads/customerio.server.ts`: `TRACK_BASE = "https://track.customer.io/api/v1"` (US).

## Published build
Confirmed by the row (production environment + new consent version) and the new log line, both produced only by the new code.

## Action
Re-requested CUSTOMERIO_SITE_ID and CUSTOMERIO_TRACK_API_KEY through the secure form; user saved new values. Not yet verified with a new signup.

The trunktest1 row stays `failed`; it is not retried automatically.
