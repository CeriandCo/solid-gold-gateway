# Rebuild Pricing phase 1 shell

## Scope
- Remove all existing `/pricing` content while leaving the shared header and footer unchanged.
- Add the requested shared palette and font tokens only where they are missing.
- Create one typed pricing configuration containing every supplied fee, limit, and sample price.
- Render the five empty Pricing sections in the required order on the cream page background.

## Implementation
- Replace the current Pricing route body with the existing shared header, a centered 1200px content shell, and empty sections: `pricing-hero`, `pricing-compare`, `pricing-trust`, `pricing-faq`, and `pricing-cta`.
- Preserve the existing title, description, canonical, Open Graph, and Twitter metadata; remove obsolete FAQ structured data tied to deleted content.
- Add Cormorant Infant and Geist Mono to the existing font request, plus shared number and money font tokens.
- Align missing color tokens to the supplied values and remove Pricing-only legacy tokens/styles, including the old selected-state green treatment.
- Add `src/config/pricing.ts` with typed, immutable constants and no duplicated fees or sample prices elsewhere on the page.
- Delete old Pricing data modules and Pricing image pointers only if the final import audit confirms nothing else uses them.

## Verification
- Check section order, emptiness, page background, 1200px container, 120px wide-screen insets, 24px mobile insets, preserved metadata, unchanged shared chrome, no stale Pricing content, no duplicate fee literals, no overflow, and a clean build.
