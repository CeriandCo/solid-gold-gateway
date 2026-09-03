# Rebuild the SQOOT Pure About Page

## Scope
- Replace only `src/routes/about-us.tsx`; keep the shared `SiteHeader` and `SiteFooter` and reuse the two existing hero assets.
- Preserve the route metadata while rebuilding the page into the nine specified sections.

## Page construction
- Add route-local semantic markup and scoped CSS tokens for the forest, cream, gold, and ink palette.
- Build the full-bleed hero, two-column story, company structure band, compliance statement, three-step process, ownership cards, trust close, and waitlist CTA at the supplied 1440px dimensions.
- Use lightweight inline SVG line-art for the mandala, company, custody, ownership, and trust icons; no new image assets.
- Anchor desktop measurements with `clamp()` values that scale from 1024px through 2560px while matching the 1440px artboard.

## Responsive and motion
- Stack and simplify layouts at the specified tablet/mobile breakpoints, preserve usable tap targets, and prevent horizontal overflow.
- Add restrained header/hero entrance motion and one-shot section reveals with reduced-motion support.

## Verification
- Measure all nine sections and the waitlist button at 1440px with Playwright.
- Check horizontal overflow at 1440px, 1024px, and 390px; verify `/about-us` returns 200, typecheck passes, and no other tracked file changed.
