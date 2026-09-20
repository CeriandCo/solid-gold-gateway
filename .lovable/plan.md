# Stop AURUM in-section scroll jumps

## Implementation
- Keep chart range selection inside the price component instead of treating each change as page navigation. Preserve the initial URL range, retain the current hash, and update the chart heading for 30D, 90D, 1Y, and 5Y.
- If the range controls overflow on small screens, center the selected control by changing only the range row's horizontal `scrollLeft`; never scroll or focus the document.
- Keep Daily Note and Weekly Brief expansion state local after initial deep-link hydration, so expanding, collapsing, and revealing sources do not rewrite the URL or clear its hash.
- Add the one permitted post-render adjustment to the shared expandable panels: only when newly revealed content extends below the viewport while its top remains visible, use nearest-edge scrolling, with instant behavior for reduced motion.
- Remove the price-loading hash restoration workaround and retain only intentional anchor navigation plus focus calls using `preventScroll`.

## Verification
- Add focused regression coverage that audits AURUM source for prohibited scrolling, focus, and URL mutations.
- At 1440×900 with no hash, test all four ranges from scroll positions 2000 and 2400; confirm exact scroll retention and range-specific headings.
- Test Daily Note and Weekly Brief expansion, sources interaction, collapse, hash preservation, and the bounded nearest-edge exception.
- Run the focused tests, typecheck, build, and inspect runtime/build diagnostics. Do not publish.