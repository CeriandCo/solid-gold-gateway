# Data-derived AURUM look-back bounds

## Shared history state
- Keep one five-year history request in the existing AURUM price provider; do not add a second full-history download.
- Preserve the endpoint’s full paginated response and expose whether history loaded successfully, separately from live-price freshness.
- Derive `earliest`, `latest`, and count from the validated, sorted points returned by that request. Do not introduce a fallback date.

## Calculator bounds and validation
- Set the date input’s `min`, `max`, and initial selection from the returned history extent only.
- Generate the helper date from `earliest` and detect a rolling five-year window by comparing the actual earliest/latest span within a small tolerance.
- Show the rolling-window explanation only when that test passes.
- Distinguish malformed, before-earliest, and after-latest input with the exact requested messages; connect the message to the field, mark it invalid, and announce it politely.
- If history fails or has no valid bounds, retain the current calculator-disabled presentation and explicitly say stored history could not be loaded without claiming a range.

## Result provenance
- Add the purchase-date close provenance and live-spot timestamp below a successful result, both generated from the selected close and provider timestamp.
- Preserve the current stale/unavailable live-price lockout exactly.

## Chart accuracy
- Keep the 5Y chart on the same shared history result and verify all returned points are rendered.
- Derive the chart heading from the actual displayed extent when the store cannot cover the selected named range, rather than claiming a longer period.

## Verification
- Add focused tests for bounds, rolling-window detection, validation messages, unavailable history, provenance, and actual-range labeling.
- Verify input bounds against the endpoint, one-day-outside errors, live rendered provenance, all 1,258 five-year points, failed-history behavior, accessibility attributes, and responsive rendering.
- Grep calculator source for four-digit year literals, then run focused tests, type checking, build, and final diagnostics. Do not publish.
