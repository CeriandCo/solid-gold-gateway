# Premium Gift Card Purchase Column

## Scope
Refine only the left purchase column in the Gifting page’s `#gift-card` section. Preserve all wording, selection logic, accessibility semantics, the right-hand card composition, and every other section. Do not publish.

## Changes
- Split the heading into two intentional display lines, with “to choose.” in the existing deep-gold token.
- Match the eyebrow to the page’s established overline pattern and tune the body width, tone, and line height.
- Restyle the amount legend as a quiet uppercase label with a warm divider.
- Rework the six radio tiles into transparent luxury price controls: serif numerals, raised gold currency marks, fixed dimensions, double-hairline selected state, corner check, distinct keyboard outline, and reduced-motion-safe transitions.
- Add a non-interactive value summary that mirrors the chosen amount while continuing to use only the existing polite announcement.
- Restore the standard arrow-bearing hero button at auto width on desktop/tablet, keep it full-width on mobile, and align the muted Stripe trust line appropriately.
- Apply the requested 8px-based vertical rhythm while keeping the purchase column vertically centered.

## Verification
- Capture the left column at 1440px and 375px in unselected and `$250`-selected states.
- Calculate WCAG contrast ratios for the selected tile numeral and currency mark.
- Measure section height across all six amount selections and confirm zero change.
- Verify arrow-key selection and that the focus outline is visible and visually distinct from selection.
- Confirm no horizontal overflow at 360px, reduced-motion behavior remains correct, and the build is clean.
