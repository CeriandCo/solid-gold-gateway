# Correct the SQOOT Pure Gift Card Visual

## Scope
- Change only the gift-card visual on `/gifting` and add its verification report.
- Preserve denomination selection, checkout behavior, surrounding page content, and all shared site styling.
- Do not publish.

## Changes
- Replace the card’s drawn mark with the existing SQOOT Pure PNG logo and use the existing brand mandala PNG as the right-side structural watermark.
- Add a fixed-size perspective presentation, restrained shadow and edge highlight, plus a slow surface sheen.
- Add capped mouse-only parallax that returns smoothly at pointer exit; keep touch and reduced-motion presentations static.
- Preserve the neutral pre-selection amount and live selected-denomination amount without changing card dimensions.

## Verification
- Test and screenshot the card at 375, 768, 1024, and 1440 pixels.
- Measure card bounds, page overflow, and position stability before and after selection.
- Confirm mouse tilt changes the transform, touch does not tilt, and reduced motion disables tilt and sheen.
- Record the asset audit, measurements, and results in `docs/verification/C7a.md`.
