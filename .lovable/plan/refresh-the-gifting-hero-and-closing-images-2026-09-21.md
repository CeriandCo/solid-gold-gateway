# Refresh the `/gifting` Hero and Closing Images

## Scope
- Add the two uploaded images under their exact new filenames using the project’s CDN asset-pointer convention; retain the old assets unless a repository-wide reference search proves they are unused.
- Update only the Hero and `#closing-gift` image references, metadata, loading behavior, and responsive crop positions. Preserve all page content, links, layout, sections, shared header/footer, and existing motion.

## Implementation
- Extend the shared inner-page hero image API only as needed to pass the uploaded Hero’s real `1920 × 720` dimensions plus `loading="eager"`, `fetchPriority="high"`, and `decoding="async"` without changing its visible structure.
- Use the requested Hero alt text and route-scoped crop positions: `50% 50%` at 1024px+, `63% 50%` at 768–1023px, and `80% 100%` below 768px.
- Replace the Closing image with its real `1942 × 809` dimensions, requested alt text, `loading="lazy"`, and `decoding="async"`; use `67% 50%` at tablet/desktop and `68% 100%` on mobile.
- Keep the existing scrims unless visual inspection shows the desktop Hero scrim obscures the uploaded fabric detail.

## Verification
- Inspect `/gifting` at 1440, 1024, 768, 390, and 375px, adjusting only crop percentages by a few points if a product is clipped.
- Confirm one `h1`, unchanged CTA targets, intact reduced-motion behavior, no overflow, both images loaded, Hero eager/high priority, Closing lazy, and no requests or route references to the old Hero/Closing files.
- Confirm the latest preview build is clean and report changed files, final crop values, and detected intrinsic dimensions.
