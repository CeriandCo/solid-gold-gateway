# Apply homepage pixel redline pass 1

## Goal
Match the approved 1440px homepage measurements exactly for the header, hero, price badge, and trust band while preserving the existing mobile-first behavior, content, accessibility, and interactions.

## Changes
- Replace Inter with DM Sans everywhere and load the exact requested Cormorant Garamond and DM Sans font weights.
- Add reusable typography utilities for the 16px eyebrow, 76/77px hero heading, 21/37px hero body, navigation, hero note, and both CTA treatments.
- Add reusable desktop layout utilities that establish the specified 1440px header, hero text, vertical rhythm, image bounds, badge size/position, and trust-band geometry.
- Remove the clipped diagonal image overlay and render the full hero photograph with contain-style sizing, a transparent presentation, and right-edge anchoring so the full bar and marble slab remain visible.
- Scale and position the logo lockup, navigation gaps, header CTA, hero CTA, note icon, and price badge to the measured dimensions.
- Tune the trust eyebrow, 72px partner row, cell widths, and full-height 1px separators to the supplied coordinates.

## Technical details
- Changes are limited to `src/styles.css`, `src/routes/index.tsx`, and `src/routes/__root.tsx`.
- Exact redline values activate at `min-width: 90rem` (1440px); existing smaller breakpoints remain responsive.
- Existing copy, route structure, event handlers, focus styles, and ARIA attributes remain unchanged.
- Validate at 1440px and a narrow mobile viewport, including image cropping, element coordinates, overflow, and build status.