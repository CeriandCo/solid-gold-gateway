# Build the AURUM Weekly Brief

## Scope
- Add the `#weekly-brief` section with the supplied artwork, featured brief, two older briefs, and expand-in-place reading.
- Add indexable `/aurum/briefs/$slug` pages using the same article presentation.
- Preserve the existing AURUM shell, price state, Daily Note behavior, shared header, and shared footer.

## Shared reading system
- Generalize the Daily Note content types and reading components so notes and briefs share rows, article body, quote, sources, page links, and disclosure behavior.
- Keep content-specific labels, URLs, closing controls, and review disclosures configurable rather than hard-coded.
- Keep one expanded item per content section, with URL-backed state so browser back closes it.

## Weekly Brief content and presentation
- Store the three sourced briefs in one typed content collection, newest first, excluding any brief without sources.
- Convert the supplied image to WebP, store it as a project asset, and use it decoratively in the featured card with explicit dimensions.
- Match the requested ivory section, typography, card geometry, responsive stacking, review copy, and accessible controls.

## Pages and verification
- Add unique metadata and full article pages for all three brief slugs, including the human-review line and return link.
- Verify expansion/collapse, browser back, direct brief URLs, shared Daily Note behavior, desktop layout, and 390px overflow.
- Confirm the preview build remains clean.
