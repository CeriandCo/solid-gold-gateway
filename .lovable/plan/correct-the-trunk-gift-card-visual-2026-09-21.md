# Correct the TRUNK Gift Card Visual

> Archive note: Brand wording was normalized to TRUNK on November 23, 2026. Addresses, technical identifiers and recorded measurements remain historical; this is not a new verification run.

## Scope
- Change only the gift-card visual on `/gifting` and add its verification report.
- Preserve denomination selection, checkout behavior, surrounding page content, and all shared site styling.
- Do not publish.

## Changes
- Replace the card’s drawn mark with the existing TRUNK PNG logo and use the existing brand mandala PNG as the right-side structural watermark.
- Add a fixed-size perspective presentation, restrained shadow and edge highlight, plus a slow surface sheen.
- Add capped mouse-only parallax that returns smoothly at pointer exit; keep touch and reduced-motion presentations static.
- Preserve the neutral pre-selection amount and live selected-denomination amount without changing card dimensions.

## Verification
- Test and screenshot the card at 375, 768, 1024, and 1440 pixels.
- Measure card bounds, page overflow, and position stability before and after selection.
- Confirm mouse tilt changes the transform, touch does not tilt, and reduced motion disables tilt and sheen.
- Record the asset audit, measurements, and results in `docs/verification/C7a.md`.
