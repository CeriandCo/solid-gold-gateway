# Separate the homepage header from the hero

## Changes
- Replace the homepage’s overlay navigation wrapper with the shared solid `SiteHeader` used by `/vault` and other inner pages.
- Render `SiteHeader` before `#hero`, leaving all hero imagery, scrim, copy, phone, and price card inside the hero section.
- Remove the now-unused homepage-only hero header styling.

## Verification
- Compare `/` and `/vault` at 1440px for matching solid header height, color, and content edges.
- Check that the hero begins exactly below the header at 1440px, 768px, and 390px.
- Scroll down and back up to confirm the header is not sticky and overlaps no section.
- Confirm the 780px desktop hero height, mobile auto height, no overflow, and a clean build.
