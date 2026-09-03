# Rebuild the SQOOT Gifting Redesign

## Scope
- Rebuild `src/routes/gifting-new.tsx` from scratch while preserving `/gifting` byte-for-byte.
- Change only the two shared-header CTA labels in `src/components/site-chrome.tsx` from “Log In” to “Get Early Access”; preserve all other shared navigation behavior and styling.
- Create the 11 explicitly requested generated image assets under `src/assets/`. These asset files are treated as required deliverables; no other existing source files will be changed.

## Imagery
- Generate a cohesive high-resolution editorial set: full-bleed gifting hero, six occasion photographs, three personalisation photographs, and the closing banner.
- Use SQOOT’s deep forest, warm gold, bronze ribbon, cream, and warm-brown palette; avoid text overlays except the specifically requested engraved bar and handwritten card content.
- Import each image directly into the new route with descriptive alt text, correct aspect treatment, and no generic asset substitutions.

## Page construction
- Build semantic, full-width sections in the required order: shared header, hero, six-benefit strip, occasions, personalisation mosaic, trust strip, closing banner, shared footer.
- Scope the supplied colour tokens, typography, geometry variables, and responsive styles to `/gifting-new` inside the route so no other page changes.
- At 1024px, enforce the requested boundaries: 76px header, 384px hero, 140px benefits, 304px occasions, 332px personalisation, 119px trust, then the 210px closing banner.
- Override only the shared header’s rendered dimensions within this route to meet the 1024–1440px geometry while preserving its desktop links, active state, mobile menu, and logo.
- Use the exact 43% / 27% / 30% personalisation grid, large tightly spaced occasion cards, correct image crops, separators, type weights, icons, and compact footer treatment.

## Responsive and motion
- Implement tablet and mobile grids, horizontal snap-scroll occasion cards, stacked hero controls, single-column personalisation, responsive trust layout, and overflow-safe image crops.
- Add lightweight IntersectionObserver reveals and CSS transitions for hero load, cards, buttons, and mosaic imagery; disable movement under `prefers-reduced-motion`.

## Verification and correction pass
- Render `/gifting-new` at exactly 1024px in Playwright and measure every section boundary in the DOM.
- Inspect the screenshot for image crop, card sizing, full-width composition, 43/27/30 mosaic proportions, typography strength, and footer density; perform one focused correction pass.
- Verify mobile rendering, no horizontal overflow, no console errors, no broken images, build success, `/gifting-new` and `/gifting` returning 200, absence of “Log In” and “For Advisors,” and unchanged `src/routes/gifting.tsx`.
