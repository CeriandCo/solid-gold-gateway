# C-7a — SQOOT Pure gift-card visual

Date: 2026-09-21. Nothing published.

## Asset audit

- Card logo: `src/assets/sqoot-pure-logo.png` — the same 567 × 200 RGBA lockup imported by the shared header/footer. The browser loaded it at its full intrinsic dimensions and rendered it between 111px and 202px wide in the tested layouts.
- Card watermark: `src/assets/sqoot-mandala.png` — the 767 × 768 transparent brand mandala. It uses the design system's **Structural** tier: opacity `0.12`, `screen` blend mode.
- No standalone SQOOT Pure logo SVG or mandala SVG exists in the project. The only SVG previously involved was a hand-authored React decoration in `gifting.tsx`; it is no longer used on the card. A client-supplied vector logo would still be preferable for future print-scale output.

## Implementation

- The card uses the real logo lockup as one image; there is no hand-set `SQOOT` / `PURE` typography on the card.
- The right-side watermark is the brand mandala PNG, not the old inline flower drawing.
- The card keeps a fixed aspect ratio and width while the denomination changes. Before selection it says `Select amount`; after selection it mirrors the selected denomination.
- Premium depth uses a small resting perspective, directional shadow, outer gold border, inset edge highlight, and restrained animated sheen.
- Mouse movement sets capped X/Y tilt values (maximum 2.5° X and 3° Y) from the pointer position. Pointer exit removes those values and the card returns to its resting angle.
- Touch/coarse pointers keep a static presentation and `touch-action: pan-y`, so the card does not trap page scrolling.
- Reduced-motion mode uses a static transform, removes transform transitions, and does not render the sheen layer.

## Browser measurements

Chromium, device scale factor 2. Measurements are CSS pixels. Each screenshot captured only the rendered card after selecting the fourth denomination (`$500`).

| Viewport | Card bounds (x, y, w, h) | Logo bounds (w × h) | Section height before / after selection | Horizontal overflow |
|---|---:|---:|---:|---:|
| 375 × 1800 | 28.96, 1598.12, 323.02, 203.17 | 119.15 × 45.45 | 1071.48 / 1071.48 | 0 |
| 768 × 1800 | 436.06, 797.96, 300.35, 188.91 | 110.88 × 42.23 | 779.02 / 779.02 | 0 |
| 1024 × 1800 | 585.59, 1553.55, 394.11, 247.87 | 144.97 × 55.53 | 767.66 / 767.66 | 0 |
| 1440 × 1800 | 825.90, 725.46, 554.45, 348.60 | 202.43 × 78.32 | 883.80 / 883.80 | 0 |

The card width and height were unchanged before and after selection at every viewport. The section height was also unchanged, confirming zero selection-induced layout shift. At 768px the document position changed by 8.37px while the fixed dimensions remained identical; this was the existing page reveal/scroll settling, not a card reflow.

The logo reported `complete: true`, intrinsic size `567 × 200`, and the expected local PNG source at all four sizes. Screenshots showed the complete lockup, clean high-DPI edges, the correct brand mandala, and no clipping or page overflow.

## Interaction and motion checks

- Mouse: the computed matrix changed at the upper-right pointer position at all four widths, and `data-interacting="true"` was present. After pointer exit and 600ms, the matrix returned exactly to its initial resting value.
- Touch emulation at 375px: a synthetic touch pointer move left both the computed matrix and interaction state unchanged.
- Reduced motion at 1440px: pointer movement left the computed matrix unchanged, no interaction state was set, and the sheen pseudo-element computed to `display: none`.
- The selected card text was `$500` in every run. The initial neutral text was present before selection.
- No browser console or page errors occurred in any viewport.

Screenshots inspected:

- `/tmp/browser/c7a/screenshots/card-375.png`
- `/tmp/browser/c7a/screenshots/card-768.png`
- `/tmp/browser/c7a/screenshots/card-1024.png`
- `/tmp/browser/c7a/screenshots/card-1440.png`