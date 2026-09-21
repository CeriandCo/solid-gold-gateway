# Align the Gifting Page with the Shared Layout and Motion System

## Scope
- Refine only `/gifting` layout CSS, responsive spacing, and reveal markup.
- Preserve all copy, assets and crop positions, gift-card behavior, checkout and analytics, accessibility labels, links, shared header/footer, and section order.
- Do not change the global design system or publish.

## Implementation
- Apply `site-container` directly to the Benefits, Occasions, Trust, and Closing inner wrappers; remove their competing width, max-width, centering, and horizontal-padding rules.
- Align the Gift Card copy with the shared container edge using container-derived left padding while preserving its full-bleed split layout and readable copy width.
- Replace fixed content-section heights with the requested content-driven padding for Benefits, Occasions, Gift Card, and Trust; retain the Closing image stage with the requested responsive minimum heights.
- Normalize Gift section eyebrows, major headings, and body copy to the existing project typography scale without changing wording or visual character.
- Preserve the current desktop, tablet, and mobile content models, including the mobile occasion snap rail and its shared 20px edge gutters.
- Remove unused legacy Gift Hero selectors, responsive overrides, variables, and keyframes after confirming the shared `InnerPageHero` is the only live hero implementation.
- Move reveal markers from whole sections to meaningful child elements: benefit items, occasion header/cards/link, Gift Card copy groups and visual, trust items, and Closing copy elements.
- Use `data-reveal="trigger"` on the Closing stage and start its restrained image settle only once visible; begin the gift-card sheen only after its visual reveal completes.
- Keep pointer tilt and hover effects mouse-only, preserve selection/checkout state, and ensure reduced motion immediately shows all content while disabling Closing settle, sheen, and tilt.
- Replace Gift-local aliases that duplicate global colors/fonts with existing semantic tokens; retain only genuinely Gift-specific shades.

## Verification
- Check 1440, 1280, 1024, 768, 390, 375, and 320px layouts for shared content edges, intended grids/rail/stacking, image crops, and zero horizontal overflow.
- At 1440px, measure the Benefits, Occasions, Gift Card copy, Trust, and Closing copy left edge at 92px; confirm shared header, hero, headings, and footer align.
- Confirm no obsolete Hero selectors/keyframes, `--page-max`, `--page-padding`, or deprecated percentage-width container rules remain.
- Verify reveal order, one-time behavior, mid-page reload visibility, hover compatibility, Closing image settle, and reduced-motion behavior.
- Regression-test gift-card radio and keyboard controls, selected amount, checkout loading/status behavior, unchanged CTA targets, asset dimensions/loading/crops, one H1, image requests, runtime console, hydration, and layout stability.
- Run the project lint command and rely on the preview harness for type/build validation; inspect the latest build, runtime, console, and network diagnostics before reporting completion.
