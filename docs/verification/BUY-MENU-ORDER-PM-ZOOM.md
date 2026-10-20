# Buy menu order + /precious-metal zoomed-out overlap

## Files changed
- `src/components/site-chrome.tsx`: `siteNav` lists Fraction before Coin, which sets the order in the Buy dropdown and the mobile menu. Footer "Discover More" now lists Fractional before Buy Gold.
- `src/routes/precious-metal.tsx` (page styles only): added `--pm-vw: min(1vw, 14.4px)` on `.precious-metals-page`. Every `Nvw` value is now `calc(N * var(--pm-vw))`, and any clamp max above its 1440px value was lowered to that value. Fixed `height` became `min-height` on .pm-products, .pm-product-card, .pm-product-card h3, .pm-process, .pm-pricing, .pm-pricing-panel, .pm-benefits and .pm-cta. `.pm-product-sizes` now has `flex-wrap: wrap; row-gap: 4px`. In the CTA button margin, `2.0833vw` became the capped variable form.

## Browser (Playwright, after scrolling through the page so reveal animations finish)
Product cards, [width, height, left]:
```
375  [[335,390,20]x3]         sw 375
768  [[226,304,24],[226,304,271],[226,304,518]]
1440 [[399,427,92],[399,427,520],[399,427,949]]   centre offset 0
1920 [[399,427,332],[399,427,760],[399,427,1189]] centre offset 0
2880 [[399,427,812],...]                          centre offset 0
3840 [[399,427,1292],...]                         centre offset 0
```
At 1920, 2880 and 3840 the cards match 1440 exactly. The automatic edge check flagged one benefit line, "Globally recognized metal…", at every width from 1440 up, including 1440 itself, where computed values are unchanged. The 3840 screenshot shows it fully visible inside the row, so the flag comes from the cell's inline padding and is not clipping. Screenshots of products, process, pricing and benefits at 3840 show no overlap.

Buy dropdown order: desktop 1440 `['Fraction','Coin']`; mobile 375 `['Fraction','Coin']`.

## Gates
- `bunx tsgo --noEmit`: exit 0, no output.
- `bun run test`, `bun run build`: not run this turn. The automatic preview build reloaded the page without errors.
