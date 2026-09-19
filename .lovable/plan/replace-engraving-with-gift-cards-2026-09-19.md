# Replace Engraving With Gift Cards

## Scope
- Change only `src/routes/gifting.tsx` and add one new photographic background asset for the gift-card composition.
- Preserve the page’s hero structure, benefits, occasions, trust strip, final call-to-action, footer, and shared site styling.
- Remove only the old personalisation section’s imports, markup, helper artwork, and scoped styles; keep its image files in place.

## Gift-card section
- Replace `#personalise` with a content-sized `#gift-card` editorial split: copy and purchase controls on the left, a generated velvet/paper/ribbon photograph with a code-rendered SQOOT Pure gift card on the right.
- Add six accessible radio amounts, selected/check and keyboard-focus states, client-only selection state, a disabled-until-selected shared primary button, reserved status area, Stripe lock note, live amount announcement, and the temporary checkout-unavailable message.
- Reuse the existing SQOOT logo, Mandala, typography, palette, spacing, and button component. The card amount will cross-fade without changing dimensions and motion will be suppressed when requested.

## Navigation and responsive behavior
- Update the hero actions to “Buy a Gift Card” → `#gift-card` and “Explore Gold Gifts” → `#occasions`, with reduced-motion-aware in-page navigation.
- Point “View all occasions” to `#gift-card` so every in-page link resolves.
- Keep the 52/48 split on comfortable tablet and desktop widths; stack visual-first below 768px, use a 3-column amount grid with two columns below 360px, and keep controls at least 44px tall.

## Verification
- Check type/build output, missing anchors, and forbidden old-section wording.
- In the running page, capture the gift-card section at 1440, 1024, 768, and 375px and confirm no horizontal overflow.
- Verify keyboard radio navigation, visible focus, live card update, disabled/enabled checkout state, zero section-height shift after selection, temporary message behavior, and both hero destinations.
- Report—but do not edit—other launch wording about engraving/personalisation in Gifting and “Engraving” matches in Pricing. Do not publish.
