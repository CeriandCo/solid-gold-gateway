# TEMP-TRUNK-LOGO-PREVIEW

Temporary logo swap for client review. Not published.

## Assets (copied byte-for-byte with `cp` from the uploads)
- `src/assets/trunk-lockup-l3-horizontal-for-dark.svg` (505x92)
- `src/assets/trunk-wordmark-for-dark.svg` (1030x232)
- `src/assets/sqoot-pure-logo.png` kept for rollback.

## Swaps
1. Header (`SiteNav`): L3 lockup, `h-[38px] w-auto lg:h-[42px] xl:h-[46px] min-[90rem]:h-[50px]`, width 505 / height 92, alt "TRUNK", aria-label "TRUNK home".
   - `min-[1440px]:` as written did not apply: at 1440 the logo measured 46px, because Tailwind sorted it before `xl:`. Changed it to `min-[90rem]:`, which is the same 1440px breakpoint, and it then measured 50px.
2. Footer: L3 lockup, alt/aria as above. `.site-footer__logo` height changed from 3.5rem to 44px.
3. Contact hero: L3 lockup, alt "TRUNK", 56px tall (44px at ≤900px), centred with display:block and margin auto.
4. Gifting `.gift-card-logo`: wordmark. CSS (position, 38% width) not changed; only the width/height attributes changed to the SVG's 1030x232. Mandala not changed.

## Deviation needed so the nav fits at 1024
With the required lg:h-[42px] (230.5px wide), the header row's content measured 1000px against 960px available at 1024, so it overflowed. The old PNG was also already about 20px too wide there. Smallest fix, at lg only:
- Gap in the header row: `gap-6` → `lg:gap-4 xl:gap-6` (no change at xl and above)
- Gap in the nav: `lg:gap-2.5` → `lg:gap-1.5` (xl and above unchanged)

## Measured (Playwright, homepage, real browser)
| Viewport | Logo w×h (px) | Row scrollWidth / clientWidth | Nav rows | Fits |
|---|---|---|---|---|
| 375 | 208.6 × 38 | 335 / 335 | nav hidden (menu) | yes |
| 768 | 208.6 × 38 | 720 / 720 | nav hidden (menu) | yes |
| 1024 | 230.5 × 42 | 960 / 960 | 1 | yes |
| 1280 | 252.5 × 46 | 1216 / 1216 | 1 | yes |
| 1440 | 274.5 × 50 | 1256 / 1256 | 1 | yes |

At 1024 the page as a whole still scrolls sideways. That comes from `.home-own-card` (right edge 1231px), which is page content outside the header and was not touched.

Not measured: footer, contact and gifting sizes. Those values come from the CSS and were not checked in a browser.

## Gates
- `bunx tsgo --noEmit`: exit 0
- `bun run build`: exit 0
- `bun run test`: **did not run.** The global setup (`scripts/test-db/up.sh`) failed in this sandbox. initdb error: `FATAL: could not access file "$libdir/dict_snowball": No such file or directory`. This is an environment problem with the local Postgres install, not a test failure. No test results are available for this task.
