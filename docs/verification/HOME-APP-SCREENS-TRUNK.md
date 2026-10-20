# Home app screens: TRUNK swap

## Edited
- `src/routes/index.tsx`: changed 6 import paths only.
- Added 6 new pointer files in `src/assets/home/`, one `*-trunk.png.asset.json` per screen. Each was uploaded byte-for-byte: uploaded size equals source size, e.g. coins 377008, weight 217209, vault 309785, gift 739507, deliver 189803, sell 272992. Every image is 804×1748.
- The old pointer files were not deleted.

## Search for old names
`rg` finds the old names only in their own old `.asset.json` pointers, which were kept. No route imports them. The `*-old-ver` routes no longer exist.

## Pricing
The pricing CTA (`src/components/waitlist-cta.tsx`) uses different files, `pricing/phone-sell-quote.{png,webp}` and `pricing/phone-deliver.{png,webp}`, which already include the phone frame. It does not use the listed files, so it is unchanged.

## Browser
On `/` at 375, 768 and 1440px, all 6 new images loaded with naturalWidth 804.
