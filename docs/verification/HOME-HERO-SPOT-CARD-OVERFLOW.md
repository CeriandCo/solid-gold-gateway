# Home hero spot-price card overflow fix

CSS only (`src/styles.css`, `.home-hero-spot-card` rules): price font `var(--font-display)` 32px (28px in tablet rule); row gets `flex-wrap: wrap; row-gap: 2px; min-width: 0` and children `min-width: 0`; card `width: auto; min-width: 217px; max-width: 272px`. Tablet rule width changed from `clamp(210px,26vw,217px)` to `auto` so it can grow leftwards (otherwise the fixed clamp would override). Mobile rule: added `max-width: none` so the new 272px cap does not stop the card from being full width. No tokens, text, position, background, shadow, radius or padding changed.

## Browser (raw, Playwright; inside = element box within card box)
1440x900: card [left 976, w 237, h 102], all 6 inside True, font 'Newsreader, Georgia, serif', % same line True
1280x720: card [888, 237, 102], all inside True, Newsreader, same line True
1920x1080: card [1216, 237, 102], all inside True, Newsreader, same line True
1024x800: card [711, 237, 102], all inside True
390x844: card [20, 350, 102], position relative, all inside True, same line True
1280x720 with temp "$10,412.80" (DOM-only, not saved): card [888, 255, 102], all inside True, same line True
#gold-price `.home-price-value` font: 'Newsreader, Georgia, serif' (matches).

Before fix (same script, stale CSS): '▲ Up 0.42%' inside False at 1440/1280/1920/1024. Full gates not run.
