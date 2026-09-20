# AURUM price consistency fix

## Goal
Make every displayed current-price figure internally consistent and traceable to the same Dillon Gage spot instrument. When a trustworthy same-source baseline is missing or contradictory, keep the live price visible but omit the day-change figures.

## Implementation

### 1. Establish one validated price contract
- Add a shared pure helper that takes current spot, same-source baseline, and any supplied change fields.
- Derive amount as `spot - baseline` and percentage as `(amount / baseline) * 100`, without rounding until display.
- Accept a change only when price and baseline are positive finite values, their source identifiers match exactly, and supplied change fields agree within `0.01` when present.
- Return an explicit unavailable change state on a missing/mismatched baseline or contradictory payload; add a falling-price unit test proving both derived signs are negative.

### 2. Use stored Dillon Gage samples for the baseline and range
- Continue using the existing five-minute `aurum_spot_prices` samples; they already retain more than 24 hours of observations.
- For each current quote, find the final stored quote from the prior UTC day for the exact same `source` value (`dillon_gage:<instrument/feed>`). Never read Yahoo `GC=F` as a spot baseline.
- Derive and store the matching prior close and change values for new polls through the shared helper.
- Compute rolling 24-hour high and low from actual samples for that same source, including the current quote. Do not fall back to the current spot when the sample query is unavailable.

### 3. Harden the public endpoint and browser boundary
- Make `/api/public/get-gold-price` resolve the baseline provenance from the exact same stored source and validate/recompute change through the shared helper.
- Return null change fields when validation fails, while preserving price, timestamp, freshness, and live status.
- Return high/low only from a genuine same-source rolling 24-hour sample set.
- At the browser adapter boundary, verify any received amount and percentage again with the same helper. Contradictions become change-unavailable rather than reader-visible numbers.

### 4. Update all AURUM displays from shared state
- Extend shared price state with nullable change, high/low, and exact provider/baseline provenance.
- In the price block, omit amount and percentage together when unavailable and show: “Day change is unavailable for this feed.”
- Render high/low tiles only when tracked values are present; keep previous close only when its source matches spot.
- Add: “Spot from <provider>. Previous close from <previous_close_source>.” When no baseline exists, state that the previous close is unavailable.
- Keep the floating navigator and calculator reading the same shared `spot` value. Keep the chart’s stored-close endpoint honest and eliminate any duplicate current-price/change derivation found in the audit.

## Verification
- Unit-test rising, falling, zero-baseline, missing-baseline, source-mismatch, and contradictory-change cases.
- Test the endpoint/adapter unavailable-change path and genuine rolling high/low behavior.
- In the rendered DOM at 1440×900, compare displayed amount and percentage with the returned same-source baseline; confirm negative signs for a falling case.
- Force a contradictory response and verify price remains visible while both change figures disappear and the unavailable explanation appears.
- Verify the price block, floating pill, and calculator show the identical current price; verify high/low are either sample-derived or absent.
- Run focused tests one file at a time, typecheck, build, browser console/network checks, and confirm no unrelated page or publishing changes.
