# Font swap: Newsreader / Geist / Geist Mono (2026-09-27)

## Changes
- Google Fonts link (`__root.tsx`): Newsreader 400 upright only, Geist 400/500/600, Geist Mono 400/500. Removed Cormorant Infant, Inter, DM Sans. **Kept Cormorant Garamond** (incl. italic) because AURUM editorial rules still use it.
- `:root`: `--font-display` Newsreader, `--font-sans` Geist, `--font-number` Geist Mono. New `--font-aurum-display: "Cormorant Garamond"`.
- AURUM: every `var(--font-display, "Cormorant Garamond")` rule (all `.aurum-*` selectors: note title/headline/body h3/blockquote/quote/page title, archive, brief, learn, gifts, subscribe) now reads `var(--font-aurum-display)` — same Cormorant rendering as before. `.aurum-note-body blockquote` and `.aurum-note-quote` italic left as-is.
- Italic → upright (colour only): `.home-hero-title em`, `.home-app-title em`, `hero-emphasis`, `comparison-emphasis`, `.fractional-legacy .comparison-emphasis`, `.waitlist-cta-title em`, `.home-final-cta-copy h2 em`, `.kc-hero-copy em` (Learn), Learn article blockquote, `home-old-ver` em.
- `.home-how-number` → Geist Mono 500, -0.02em, upright. `.pricing-hero-figures strong` → `var(--font-number)`.
- Hard-coded families replaced (Cormorant Garamond → Newsreader, Inter/DM Sans → Geist): trust-center, precious-metal, partners, learn.index, about-us, contact, inner-page-hero, footer rules in styles.css, `.fractional-legacy` DM Sans override.
- Weight: Newsreader loads 400 only and `body` already has `font-synthesis: none`, so existing 500/600 display weights render at 400 without faux-bold.

## Not done / flagged
- Step 4 (per-utility letter-spacing re-map to Figma roles) was **not** done utility by utility. Typeface/weight changed; tracking values are unchanged. Needs a follow-up pass.
- `/aurum` page-level headings (subscribe, gifts, learn, brief) also stay Cormorant, since they use the same AURUM fallback pattern. Tell us if they should switch to Newsreader.

## Audit (raw)
`rg "Cormorant|\"Inter\"|DM Sans" src` (excluding the aurum variable): only `styles.css:3937 var(--font-sans, "DM Sans", ...)` (unused fallback) and the fonts link.
`rg "font-style: ?italic|\bitalic\b" src` (excluding not-italic): only `styles.css:2670` (.aurum-note-body blockquote) and `2678` (.aurum-note-quote), both AURUM.

## Browser (1440, homepage)
`['grain by grain.', 'Newsreader, Georgia, serif', 'normal', 'oklch(0.743 0.117 89.5)', fonts.check Newsreader=True, Geist Mono 500=True, body 'Geist, Arial, sans-serif']`
Pricing page screenshot: headings Newsreader upright, gold accent upright, fee figures (0% / 3.00% / 0.45%) Geist Mono. AURUM pages not visually diffed against before-screenshots (no before capture taken).

## Gates
- `bunx tsgo --noEmit`: exit 0
- `bun run test`: 49 files, 724 tests passed
- `bun run build`: exit 0
