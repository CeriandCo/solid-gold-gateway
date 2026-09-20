# Replace the AURUM Double Menu

## Scope
- Add `AURUM` immediately before `Learn` in the single shared desktop/mobile navigation source.
- Remove the AURUM subheader markup, behavior, price chip, and all related styles.
- Add one floating section navigator rendered only on `/aurum`; leave the footer and section content unchanged.

## Shared navigation
- Keep the existing nav typography, colors, underline animation, CTA dimensions, and homepage overlay variant.
- Make navigation highlighting prefix-aware so `/aurum`, notes, and briefs all highlight AURUM.
- Test 1024px first; reduce only the item gap if needed, and raise the desktop-menu breakpoint only if spacing cannot prevent collision.

## Floating AURUM navigator
- Create a focused AURUM-only component using the existing mandala asset and shared live-price state/formatting.
- Keep it hidden through the hero, then show a fixed bottom-right pill with the validated price when available and the mark alone otherwise.
- Open an anchored panel containing Price, Daily Note, Weekly Brief, Learn, Calculator, Gifts, and Subscribe, plus the existing primary Subscribe action.
- Track the current section with IntersectionObserver, avoid the footer with IntersectionObserver, and support outside click, Escape, focus return, arrows, Tab, and reduced motion.
- Keep every destination as a real hash anchor and allow the browser/router to perform the single scroll; do not call `scrollIntoView` from panel clicks.

## Cleanup and verification
- Replace subheader-sized scroll margins with a small 24px breathing offset and remove every old subheader class, CSS variable, and sticky dependency.
- Verify `/aurum` has one header navigation, no initial pill flash, correct seven-anchor navigation, no double jump, current-section state, footer avoidance, and JavaScript-disabled anchors.
- Verify the pill is absent from other routes and test the shared header at 1024px plus the homepage overlay variant and mobile menu.
- Check desktop/mobile overflow, keyboard behavior, reduced motion, tests, type check, and the preview build; do not publish.
