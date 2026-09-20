# Build homepage phase 2 hero

## Implementation
- Upload the supplied hero scene and phone artwork into the project asset flow and use them only in `#hero`.
- Keep the shared overlay navigation unchanged, then build the 780px desktop hero inside the existing `site-container` with the specified background image, directional scrim, copy, buttons, non-link store badges, phone, and sample spot card.
- Keep the three sample spot values in one typed constant so live pricing can replace them later without changing the card markup.
- Add a small homepage-hero style block using existing semantic tokens for exact layering, sizing, shadows, and the mobile switch to stacked content, centered phone, and in-flow spot card.
- Preserve all phase-one sections, footer, metadata, and site-wide components.

## Verification
- Check the hero at 1440px and 390px for image crop, three-line heading, button behavior, phone/card placement, stacking, and overflow.
- Confirm the primary action opens `/early-access`, the secondary action targets `#how-it-works`, store badges are not links, and the LCP image is eager/high priority with empty alt text.
- Confirm shared container alignment remains identical to `/vault`, then check preview build and browser console health.
