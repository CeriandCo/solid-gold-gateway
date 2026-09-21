# Polish the Global AURUM CTA

## Scope
- Redesign only the existing global AURUM link as a compact dark-forest premium card.
- Preserve its `/aurum?range=1Y` destination, cleared search keys, global mount, exclusions, and safe-area-aware placement.
- Keep AURUM content, site chrome, and all other floating controls unchanged.

## Presentation and behavior
- Use the existing forest, gold, warm-white, typography, and motion tokens with Lucide icons already installed.
- Add a gold market icon, two-line desktop label, compact mobile label, and right arrow inside one accessible link.
- Reveal after 180px with one restrained entrance and one icon highlight sweep.
- Add clear hover, active, keyboard-focus, and reduced-motion states without repeating animation or glow.

## Verification
- Check the requested public routes at 390px, 768px, 1440px, and 1920px for visibility, overlap, tap size, and overflow.
- Verify the threshold, internal navigation/search state, excluded routes, keyboard focus, and reduced-motion behavior.
- Confirm no new package, unrelated styling change, runtime error, or build error.
