# Build the AURUM Hero

## Scope
- Fill only the existing `/aurum#top` placeholder and preserve the current header, subheader, remaining placeholders, and footer.
- Use the supplied photograph as the hero background, converted to WebP and stored through the project asset flow.

## Hero build
- Add the responsive horizontal/vertical forest scrim directly over the cover-fitted photograph.
- Add the editorial eyebrow, two-line display headline, gold ornament, explanatory copy, and two existing-style actions.
- Reuse the route’s measured sticky offset and shared anchor navigation behavior for the Price and Learn actions.
- Preload the hero image from the route metadata and include its intrinsic dimensions on an accessible, cover-fitted image layer.

## Responsive behavior
- Use 112px vertical spacing on desktop and 56px below 760px.
- Keep content on the left half at desktop and full width on mobile.
- Stack actions on mobile while preserving 44px minimum targets and avoiding horizontal overflow.

## Verification
- Check the hero at 1440px and 390px for image rendering, scrim direction, headline wrapping, contrast, and overflow.
- Verify both actions update the hash and land below the sticky AURUM subheader.
- Confirm the WebP preload, image dimensions, clean console, and successful build.
