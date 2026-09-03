# Rebuild the Knowledge Center

## Scope
- Replace only the `/learn` page implementation in `src/routes/learn.tsx`.
- Keep the shared `SiteHeader` and `SiteFooter` unchanged.
- Add only the four new editorial images needed for gaps in the existing asset library; reuse existing SQOOT photography and product imagery everywhere else.

## Page build
- Create a route-scoped `.knowledge-center-page` design system with the supplied forest, gold, paper, typography, border, radius, and shadow values.
- Build the hero and disclaimer band with editorial copy, macro-gold media, accessible preview/play and down-arrow controls.
- Build the interactive six-benefit explorer with keyboard-operable previous/next controls and restrained active emphasis.
- Build three educational article cards using phone, gold, and couple imagery.
- Build the returns section with supplied evidence copy, accessible time-period tabs, a real 20-year bar chart, a screen-reader data table, and honest “data coming soon” states for periods without supplied figures.
- Build the two resource promos, dark investing banner, and three final resource cards, including an anonymous cinematic treatment for the Touched by Gold preview.
- Add one-shot IntersectionObserver reveals, staggered groups, image/CTA hover motion, chart bar drawing, and reduced-motion fallbacks without adding an animation library.

## Responsive behavior
- Desktop: target the supplied section heights and 1296px content grid at 1440px.
- Small desktop/tablet: adapt hero, benefit grid, articles, returns, promo cards, banner, and final resources at the specified 1279px/1023px breakpoints.
- Mobile: stack all content, preserve media ratios, maintain 14px minimum body copy and 44px controls, and prevent horizontal overflow.

## Assets
- Reuse `band-gold.jpg`, `walkthrough-laptop.jpg`, `occasion-achievements.jpg`, `gifting-hero-product.jpg`, and suitable existing gold product imagery.
- Add generated editorial photography for phone-in-hand, couple-on-bench, raw gold nugget, and anonymous cinematic gold texture. No public-figure likeness will be created.

## Verification
- Verify `/learn` at 1440, 1366, 1024, 768, and 390px with Playwright screenshots and measured section/card heights.
- Check tab and benefit interactions, reveal completion, text clipping, chart accessibility, console errors, and horizontal overflow.
- Confirm the current build succeeds and no shared component or other route is modified.
