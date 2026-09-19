# Pricing v2 Phase 4 — Purchase Calculator

## Build
- Replace the empty comparison-column placeholder with a client-side calculator card that defaults to US$500, vault ownership, two years, coin, and gift off.
- Add reusable accessible radio groups with arrow-key navigation for quick amounts, ownership, hold period, and item type, plus an accessible gift toggle.
- Keep the fee table unchanged and place the calculator beside it on desktop and below it on narrower screens.

## Calculation and states
- Read every price, fee, rate, limit, and sample product from `src/config/pricing.ts`; add no duplicate financial constants elsewhere.
- Implement half-up money and four-decimal weight rounding, exact vault storage-year rules, delivery item selection, additive line-item reconciliation, and the specified collapsed five-year storage display.
- Implement live 150ms input updates, minimum/maximum validation, the delivery “not quite enough” state, disabled invalid-state action, and the switch-to-vault recovery action.

## Presentation and tracking
- Match the specified white form and forest result treatments using existing Pricing tokens, type families, focus rings, and compact responsive spacing.
- Link the valid estimate action to the existing early-access page.
- Preserve `calculator_estimate_shown` with an 800ms debounce and the requested properties; add `calculator_switch_to_vault` for the recovery action.

## Verification
- Add focused calculation tests for all five supplied check values and rounding/fee reconciliation.
- Verify radio semantics, arrow-key behavior, live updates, validation announcements, disabled/action states, mobile placement, no overflow, and no layout-breaking transitions at desktop and mobile widths.
- Check browser console/runtime output, type safety, tests, and the preview build. Do not publish.
