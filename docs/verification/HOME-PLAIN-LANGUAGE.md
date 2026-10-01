# Home plain-language buying copy

Changed seven strings in `src/routes/index.tsx` (hero body, three-ways h2, fractional card title + description, app gift feature, step 03, gifting intro). No markup/CSS/order/link changes.

## Browser (raw, 1440px, body.innerText search; case-sensitive)
$25: ['…switch to ounces if you prefer. Orders start at $25, and your price locks for 90 …'] (1 hit)
1/10: [] · gram: [] · oz: []
OZ: ['GOLD SPOT · PER OZ  $3,412.80'] — hero spot card label, which the earlier hero task said not to touch; left as is.
Cards: [['Coins, delivered home','/precious-metal','Browse coins'], ['Buy any amount','/fractional-gold','How fractional works'], ['Keep it in the vault','/vault','See the vault']]

Not rendered on page but still in head metadata: page description/og text contains "Start with $25" (unchanged, out of scope). Full gates not run.
