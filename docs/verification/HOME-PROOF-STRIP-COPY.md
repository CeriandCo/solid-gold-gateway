# Home proof strip copy restore (#proof)

Changed only four strings in `PROOF_ITEMS` (`src/routes/index.tsx`): item 01 title, item 02 title + line, item 04 line. Markup, classes, CSS and the `sr-only` h2 untouched.

## Browser (raw, 1440px)
items: ['01 | Real, physical gold | Coins and bullion — never a token, note or ETF.', '02 | Held in your name | Allocated to you and shown on every statement.', '03 | Priced live | Spot and premium shown before you confirm.', '04 | Deliver or sell back | Take it home or sell it back from the app.']
h2: `<h2 id="proof-heading" class="sr-only">Why SQOOT gold</h2>`

Note: `body.innerText` still contains "Why SQOOT gold" because `sr-only` clips rather than hides; it is not visually rendered. Not checked: the meta description on line 43 still says "Fully backed in the vault" (out of scope). Full gates not run.
