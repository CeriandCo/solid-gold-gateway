# Match the US-only trust icon to the reference

## Goal
Replace the current generic US marker in the trust banner with a compact full-color American flag that closely matches the supplied landing-page reference.

## Changes
- Replace the Lucide outline flag in the “US-ONLY” lockup with a small inline U.S. flag graphic: rectangular proportions, red and cream stripes, deep-blue canton, and subtle light stars/dots.
- Keep the icon decorative so assistive technology reads the adjacent “US-ONLY” label without duplication.
- Tune the flag’s fixed width, height, and gap to align with the two-line supporting copy while preserving the existing four-column desktop and 2×2 mobile layouts.
- Remove the now-unused `Flag` import.

## Technical details
- Update only the trust-banner icon and its related import in `src/routes/index.tsx`.
- Use a lightweight inline SVG with existing SQOOT semantic colors where appropriate; no external image or package is needed.
- Verify the trust row at desktop and mobile widths for visual match, alignment, wrapping, and overflow.
