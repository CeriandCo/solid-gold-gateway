# Polish the Global AURUM CTA

## Scope
- Restyle only the existing global AURUM link as the companion to the `/aurum` floating navigator.
- Preserve its destination, cleared search keys, global mount, exclusions, safe-area placement, and layer.
- Leave AURUM content, shared site chrome, and all other floating controls unchanged.

## Presentation and behavior
- Reuse the exact existing SQOOT mandala asset and the AURUM navigator’s forest pill, gold border, and restrained shadow language.
- Add the two-line desktop label, compact mobile label, and right arrow inside one accessible router link.
- Reveal after 180px with one 420ms entrance; keep the mandala stable and add no shimmer.
- Add clear hover, active, keyboard-focus, and reduced-motion states using existing tokens.

## Verification
- Check all requested routes at 390px, 768px, 1440px, and 1920px for visibility, overlap, sizing, and overflow.
- Verify threshold, client-side destination/search state, exclusions, keyboard focus, exact shared mandala asset, and reduced motion.
- Confirm no dependency, unrelated style, runtime, or build regression.
