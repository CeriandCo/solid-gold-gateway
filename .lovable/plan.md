# Customer.io test signup: findings and next step

## Findings (read-only, no code changed)
Database row for hoangvh238.dev+trunktest1@gmail.com (waitlist_signups):
- environment: production
- cio_status: failed
- cio_attempts: 1
- created_at: 2026-11-02 09:30:17 UTC, source early_access, consent_version waitlist-2026-11-02

Published server log (09:30:17.781Z): `[customerio] identify failed (401)`
- 401 = Customer.io refused the credentials. The first call (identify) failed, so no event was sent.
- Request target is hard-coded to `https://track.customer.io/api/v1` (US).
- The published build has the new code: the row was saved with the new consent version, marked production, and the new Customer.io code wrote the log line.
- Both secrets exist by name (CUSTOMERIO_SITE_ID, CUSTOMERIO_TRACK_API_KEY); values not read.

## Likely causes of a 401
1. Site ID and Track API key are from different workspaces, or were swapped, or include extra spaces.
2. The "Trunk" workspace is in the EU region (US endpoint rejects EU keys with 401).
3. An App API key was entered instead of a Track API key.

## Proposed next step (no code change)
1. You check in Customer.io: Settings > Workspace Settings > API and webhook credentials > Tracking API keys, confirm region is US, and copy that pair.
2. I re-open the secure form so you re-enter both secrets.
3. You submit a new test signup on trunk.gold (a new email, e.g. +trunktest2). I re-query the row and logs and report cio_status.
4. Optionally retry the failed trunktest1 row only if you ask (would need a separate approved change).
