# SQOOT Pure Weight and Hero Wrap Correction

## Changes
- Update the Google Fonts request so Cormorant Garamond includes weight 600 in both roman and italic styles while leaving every DM Sans request unchanged.
- Remove `-webkit-font-smoothing: antialiased` from the body rule.
- Correct only the specified serif utility weights:
  - Hero title and italic emphasis: 600
  - Section title, step title, comparison titles and italic emphasis, Fees/FAQ titles, early-access title, and price value: 500
- Widen only the desktop hero copy wrapper and H1 maximum widths from their current 470px/460px values to 500px.
- Disable text balancing and retain normal whitespace behavior on the hero title so its explicit `<br />` elements produce the only desktop line breaks.

## Verification
- Confirm the loaded font and computed Cormorant weights in the browser.
- At 1280px, 1440px, 1600px, and 1920px, verify the H1 renders exactly as three lines: “Gold allocation,” / “made more” / “accessible.”
- Check the latest preview build result and resolve any errors caused by these changes.

## Scope Guard
No changes to DM Sans weights, copy, colors, hero artwork, clip-path, structure, spacing beyond the two requested hero max-width values, or any other visual properties.
