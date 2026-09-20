# Rebuild homepage phase 1 shell

## Scope
- Preserve the shared header, footer, current homepage title, description, and waitlist capability.
- Remove the existing homepage body, including the trust/benefit strips, app showcase, FAQ, and obsolete commented sections.
- Delete only homepage assets confirmed unused elsewhere, including the five-phone app image.

## Implementation
- Replace the homepage body with the shared header and footer surrounding eleven empty sections in the requested order.
- Keep `#hero` as a dark, full-bleed placeholder with the existing overlay header; use `site-container` inside every section.
- Apply the shared cream, cream-2, forest-black, and forest-2 tokens to the specified sections, with `clamp(72px, 8.3vw, 120px)` vertical spacing only on cream and cream-2 sections.
- Reuse the existing theme palette, font registrations, 1320px container, and responsive gutters; add nothing because all requested tokens and font weights already exist.
- Remove the obsolete homepage-only eyebrow override after the old body is gone.

## Verification
- Confirm the section IDs, order, backgrounds, empty content shells, and absence of old homepage content and imports.
- Compare `/` and `/vault` at 1440px to verify identical shared left and right content edges.
- Check desktop and mobile rendering, horizontal overflow, metadata preservation, and preview build health.
