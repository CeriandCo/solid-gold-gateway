# Align AURUM with the shared page system

## Implementation
- Replace every remaining `aurum-container` class across AURUM pages and components with `site-container`, remove the obsolete stylesheet rule, and remove the narrower price-content exception so price, headings, chart, facts, calculator, and hero share one width.
- Rebuild `/aurum#top` with the existing `InnerPageHero`, retaining the current photograph, eyebrow, heading, standfirst, two actions, and AURUM dark scrim treatment while inheriting the shared height, image entrance, typography, and alignment.
- Set the six requested AURUM content sections to 96px vertical spacing at desktop while retaining their established compact mobile spacing and 24px anchor breathing room.
- Leave the price section’s internal structure, section colors, ordering, floating navigator, header, and footer unchanged.

## Verification
- Confirm no `aurum-container` class or stylesheet rule remains and all visible AURUM content uses the shared 1320px/32px container.
- Compare AURUM and Vault hero heights at 1440×900, 1280×800, and 390×844; check left-edge alignment at 1280, 1440, 1600, and 1920.
- Check all six section paddings, horizontal overflow from 320px through 2560px, chart labels/end point, four fact-card values, and cold hash landings.
- Measure rendered hero text contrast, capture desktop/mobile verification screenshots, and confirm tests and preview build health.
