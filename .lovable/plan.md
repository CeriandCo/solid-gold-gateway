# Refresh three Learn images

## Scope
- Replace only the first two Learn article-card images and the “Simple, straightforward investing” banner image.
- Preserve the Hero, Gifting Gold card, all copy, links, charts, layout, interactions, motion, header, footer, and every other asset.

## Implementation
- Upload the three supplied PNGs through the project’s existing CDN asset-pointer flow under their exact new filenames.
- Update the three imports and image data in `src/routes/learn.index.tsx`.
- Give the two replaced article records their supplied intrinsic dimensions and alt text while retaining lazy loading, async decoding, the existing card wrapper, hover zoom, and centered cover crop.
- Give the investing banner its supplied dimensions and alt text while retaining lazy loading, async decoding, the existing panel/mask, and `72% 50%` crop across desktop, tablet, and mobile unless visual inspection requires a permitted adjustment.
- Leave the old asset pointers intact even if now unused, avoiding irreversible CDN deletion.

## Verification
- Check `/learn` at 1440, 1024, 768, 390, and 375px for subject visibility, unchanged third card and Hero, no overflow, and no broken or old image requests.
- Confirm exact intrinsic attributes, lazy loading, async decoding, unchanged Hero media requests, reveal/hover behavior, and reduced-motion behavior.
- Run targeted formatting/lint, TypeScript checking, and inspect the current preview build diagnostics; report unrelated repository-wide lint failures separately if present.
