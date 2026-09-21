# From AURUM section

## Build
- Upload the three supplied article images through Lovable Assets and import their pointers on the homepage.
- Replace only the empty `from-aurum` placeholder with the shared `site-container`, exact heading content, AURUM link, and three reusable article cards.
- Use existing typography, color, radius, and arrow-link patterns without adding design tokens.

## Destinations
- Daily Note card: existing `/aurum/notes` archive.
- Before You Buy and Guide cards: existing `/aurum#learn` section, which contains the matching “Spot is not your price” and “Allocated or pooled” content.
- Section heading link: existing `/aurum` root with its required default search state.

## Responsive behavior and verification
- Desktop: 120px section spacing, 48px content gap, three equal cards with 24px gaps and 240px images.
- Tablet: stacked heading and a 2+1 article grid; mobile: 40px heading and one article per row.
- Verify 375, 767, 768, 834, 1023, 1024, 1280, and 1440px for alignment, text fit, overflow, and 3→2+1→1 progression; review build diagnostics.
