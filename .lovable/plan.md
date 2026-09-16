# Add the AURUM Route Shell

## Scope
- Add one new `/aurum` route while preserving the shared SQOOT Pure header and footer.
- Add only the requested `AURUM` footer link under “Discover More”.
- Build the route shell and navigation behavior only; leave all nine content sections as placeholders for later work.

## Page shell
- Render the existing `SiteHeader`, an AURUM-only sticky subheader, the nine ordered placeholder sections, and the existing `SiteFooter`.
- Reuse the established 1200px footer-aligned container in every AURUM section.
- Add route-specific metadata for `/aurum`.

## AURUM subheader
- Add the wordmark, desktop descriptor, seven section links, unavailable price state, and shared gold Subscribe button.
- Keep the main header unchanged and make only the AURUM bar sticky.
- Collapse the anchor navigation into a page-safe horizontal scroller below 760px.
- Scope the three new status colors and all AURUM-only styling to the route.

## Navigation behavior
- Handle anchor clicks without reloading, update the URL hash, and respect reduced-motion preferences.
- Measure the rendered subheader height and apply it as each section’s scroll offset.
- Support direct hash entry such as `/aurum#calculator` after layout settles.
- Track the active section with IntersectionObserver; show no active link while `#top` is in view.

## Verification
- Confirm `/aurum` returns 200 with the unchanged shared header and footer.
- Test anchor navigation, hash updates, direct hash loading, sticky positioning, and active-link changes.
- Check desktop and 390px layouts for overflow, tap-target sizing, section alignment, and unavailable price state.
- Confirm all existing routes still build and the footer link points to `/aurum`.
