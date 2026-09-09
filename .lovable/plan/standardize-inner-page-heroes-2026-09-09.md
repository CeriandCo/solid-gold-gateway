# Standardize inner-page heroes

## Scope
Apply the Buy Gold hero structure to `/precious-metal`, `/fractional-gold`, `/gifting`, `/trust-center`, `/about-us`, and `/learn` only. Do not change the Homepage, Vault, shared navigation, or visual content below each hero.

## Implementation
- Treat Buy Gold’s hero geometry as the shared master: header relationship, `clamp(560px, 80vh, 820px)` desktop height, text inset/column width, Cormorant headline scale and line height, Inter body styling, gold eyebrow/rule, 54px CTA row, image layer, deep-green fade, entrance motion, and mobile breakpoint behavior.
- Update Buy Gold’s hero to include a stable CTA slot and a shared `GoldButton` linking to `/early-access`; add a concise “Buy Gold” eyebrow while preserving all existing copy and imagery.
- Rework Fractional Gold into the same single-layer hero structure, preserving its exact uploaded image, wording, gold “accessible.” emphasis, note, `/early-access` CTA, and image focal position.
- Rework Gifting into the same geometry while preserving its exact image, copy, “Gifting gold” eyebrow, and two-button row: “Explore Gifting” → `#occasions`, “How It Works” → `#personalise`.
- Rework Trust Centre into the same geometry while preserving its exact verification image and copy; add a concise “Trust Centre” eyebrow and “Explore the audit programme” linking to a nonvisual `#audit-programme` anchor on the existing audit section.
- Rework About Us into the same geometry while preserving the velvet, mandala, and gold-bar assets as layered imagery; retain its eyebrow/copy, reserve the standard body-copy space without inventing copy, and add “How we protect ownership” linking to `/trust-center#protection`.
- Rework Learn into the same full-bleed image/fade geometry while preserving the current gold image and play control; add a concise “Learn” eyebrow and use “Watch the introduction” as the hero CTA tied to the existing introduction control.
- Keep one stable CTA-row height on every hero, including pages with one or two buttons, so text/image alignment remains consistent.
- Preserve page-specific `object-position` values where needed to keep each original image recognisable; use Buy Gold’s image sizing and one continuous deep-green overlay without filters, recolouring, seams, cream fades, or new assets.
- Add only nonvisual section IDs needed by the new Trust Centre/About CTA destinations; do not restyle or restructure those sections.

## Responsive behavior
- Desktop and tablet use the same Buy Gold height, text column, image layer, and broad left-to-right fade.
- Mobile follows the Buy Gold breakpoint geometry and consistent typography/spacing while retaining page-specific focal positioning and readable CTA stacking.
- About’s layered product composition and Learn’s play control remain functional inside the standardized frame.

## Verification
- Check all six routes at 1440px, 1024px, and 390px with browser screenshots and measurements.
- Confirm equal hero heights, aligned eyebrow/headline/rule/body/CTA rows, stable CTA-row heights, smooth SQOOT-green fades, recognisable unchanged images, working CTA targets, and no horizontal overflow or console errors.
- Confirm Homepage and Vault source/rendering are unchanged, shared navigation remains unchanged, lower sections retain their structure, and the final typecheck/build is clean.
