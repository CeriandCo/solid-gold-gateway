# Refine the homepage trust banner

## Goal
Bring the selected “Backed by trust. Built for you.” banner into close alignment with the supplied fractional-gold landing-page reference, without changing the surrounding hero or “How it works” sections.

## Changes
- Rebuild the partner row as a balanced four-column composition on desktop, centered within the same visual width as the reference.
- Standardize each partner lockup’s visual height, baseline, spacing, and text weight so Dillon Gage, IDS, Lloyd’s, and US-only feel like one coordinated set rather than mixed text blocks.
- Match the reference’s thin warm-beige vertical separators and generous horizontal breathing room.
- Tighten the banner’s top and bottom spacing and keep the gold uppercase eyebrow centered above the partner row.
- Refine the US-only lockup so the flag and two-line supporting copy remain compact and do not produce awkward wrapping.
- Preserve legibility responsively: use a clean 2×2 grid on small screens, remove inappropriate middle dividers, and add consistent row spacing without overflow.

## Technical details
- Update only the trust-banner markup and responsive utility classes in `src/routes/index.tsx`.
- Continue using the existing SQOOT semantic colors and Cormorant Garamond / DM Sans typography tokens.
- Keep the section semantic with its existing accessible label and meaningful partner text.
- Verify the result against the supplied reference at the current desktop viewport and at a narrow mobile viewport, checking alignment, wrapping, dividers, and section-to-section spacing.
