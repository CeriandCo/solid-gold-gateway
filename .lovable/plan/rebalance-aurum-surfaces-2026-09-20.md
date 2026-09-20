# Rebalance AURUM surfaces

## Scope
- Keep all AURUM content, section order, shared header, and footer unchanged.
- Relight the current-price and facts bands using only the supplied SQOOT tokens.
- Make Weekly Brief the single dark anchor in the lower page.
- Remove the two retired background image imports, preloads, and CSS references.

## Implementation
1. Update `/aurum` metadata loading so only the hero image is preloaded; remove both obsolete PNG imports.
2. Replace the price and facts backgrounds, text colors, rules, and card styling with the specified light-surface system.
3. Use shared card geometry for all seven stat cards: equal grid columns, 24px gap, `24px 24px 22px`, 2px radius, common border, no fixed heights, no overflow clipping, and no per-item offsets.
4. Apply light-surface positive/negative colors to price changes based on their sign.
5. Re-theme Weekly Brief and its shared row/editorial states inside that section only, preserving the existing image and layout.
6. Ensure the hero ends with a hard edge and retain the existing 24px anchor breathing room.

## Verification
- Check 1440px, mobile, and 150% zoom rendering, including `$10,000.00` and `-100.00%` stress values.
- Measure the dark opening run, section anchor landing, card width/padding/height equality, and clipping.
- Measure contrast from rendered foreground/background colors for every changed pair.
- Capture network requests during a full scroll; confirm both removed PNGs are absent and total image transfer is under 900 KB.
- Confirm no content/order changes, no gold card borders, no overflow, no runtime errors, and run focused tests, type checking, and the production build.
