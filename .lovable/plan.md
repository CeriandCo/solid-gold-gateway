# Typography-only landing page pass

## Goal
Match the approved 1440px typography measurements while preserving all layout, imagery, colors, borders, radii, shadows, icons, copy, interactions, accessibility attributes, and component structure.

## Changes

### 1. Replace Inter with DM Sans
- Update the Google Fonts stylesheet in `src/routes/__root.tsx` to the exact supplied Cormorant Garamond and DM Sans URL.
- Update the global sans token in `src/styles.css` to `"DM Sans", system-ui, sans-serif` and retain Cormorant Garamond as the display family.
- Remove all remaining Inter references.

### 2. Centralize the measured type scale
- Replace the broad typography helpers with narrowly named reusable `@utility` classes for:
  - eyebrows
  - hero headline, hero body, hero note, hero CTA
  - header navigation and header CTA
  - price-badge label, value, and detail
  - section title and section body
  - step number, step title, and step body
  - comparison left/right headings and left/right list copy
  - fees/FAQ heading
  - fee intro, card label, card value, and footnote
  - FAQ question
  - early-access title, body, input, button, and privacy note
  - footer navigation and footer legal copy
- Encode the supplied desktop values at `lg` and retain explicit smaller mobile/tablet sizes so long words remain readable without horizontal overflow.
- Keep all letter spacing at the specified values and remove conflicting local typography overrides.

### 3. Apply utilities without layout changes
- Update only typography-related class names in `src/routes/index.tsx`.
- Preserve every existing layout utility, including widths, spacing, grid/flex rules, positioning, image classes, clip path, colors, borders, radii, and shadows.
- Keep the italic gold `accessible.` and `allocate` treatments while assigning their requested weights and sizes through the relevant utilities.
- Remove only the small `Fees` and `FAQ` eyebrow elements, as explicitly permitted, and uppercase their serif headings through the shared heading utility without changing the copy strings.

## Technical details
- Files changed: `src/styles.css`, `src/routes/__root.tsx`, and typography class names in `src/routes/index.tsx` only.
- Existing structural markup, component props, handlers, ARIA, and icon markup remain untouched, except for removal of the two explicitly authorized eyebrow paragraphs.
- No arbitrary text sizing will remain in JSX for the specified content roles; sizing will come from reusable Tailwind v4 `@utility` definitions.

## Validation
- Confirm the rendered font families are DM Sans and Cormorant Garamond and that Inter no longer appears in the codebase.
- Verify the key desktop computed sizes, weights, line heights, tracking, casing, and italic treatments at 1440px.
- Check representative tablet and mobile widths for readable scaling and no horizontal overflow.
- Confirm the hero artwork and clip-path element are byte-for-byte unchanged.
- Check the latest build diagnostics and run focused verification so the final build is error-free.
