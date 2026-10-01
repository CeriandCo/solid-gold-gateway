# Home: live gold price replaces hard-coded sample

## Changes
- `src/components/home-live-price.tsx` (new): `HomeHeroSpotCard` and `HomeGoldPrice`, both reading `useAurumPrice()` — the same provider/adapter/polling `/aurum` uses. No new fetch, provider, cache or poll.
- `src/routes/index.tsx`: removed `GOLD_PRICE`/`HERO_SPOT` constants; wraps the page in `AurumPriceProvider`; the hero card and `#gold-price` body render the new components. Classes, background, scrim and layout unchanged.
- `src/lib/aurum/price-format.ts`: added `AURUM_PERCENT`, `AURUM_UTC_TIME`, `formatPriceAge` (same formats/wording as `/aurum`). `aurum-price-section.tsx` was NOT edited (project rule: don't modify AURUM), so it keeps its own identical local copies.
- Sample chip / hero sample line render only when `showSampleChip` (= `isMock(state)`). Disclaimer always rendered.
- `src/routes/__root.tsx`: error component typed with `ErrorComponentProps` (needed after the router package update).

## Browser (raw, 1440px)
home (live): card 'GOLD SPOT · PER OZ | $4,179.30 | ▲ | Up | 0.57%'; gold '$4,179.30 | ▲ +0.57% | +$23.80 | per troy ounce · USD · As of 18:40:02 UTC · 3 minutes ago | 24-HOUR HIGH $4,190.40 | 24-HOUR LOW $4,139.70 | PREVIOUS CLOSE $4,155.50 | … | Figures are indicative. Not an offer to buy or sell.'; no sample text; section height 640
/aurum (same session): 'LIVE | As of 18:40:02 UTC · 3 minutes ago | $4,179.30 | +0.57% | +$23.80 | … $4,190.40 | $4,139.70 | $4,155.50'
loading (domcontentloaded): no numbers, height 640
provider 503, no cache: card 'Price unavailable right now'; section 'The gold price is unavailable right now. Please check back shortly.' + disclaimer; height 640; no $3,412.80
stale (intercepted payload, 3h old): numbers + 'This price is delayed. It was recorded 3 hours ago and is not current.'; height 640

## Gates
tsgo --noEmit: clean. bun run test: 49 files, 724 tests passed. bun run build: succeeded.

## Not verified
- Mock-source state in a browser (needs the demo-price env flag); chip logic is `isMock` from the shared module, covered by its existing unit tests.
- Bundle size and LCP not measured. The shared adapter also fetches 5-year history on the home page (same as /aurum); no chart library is imported.
