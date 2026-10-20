# Home hero phone: transparent image

## Changed
- `src/routes/index.tsx`: changed the hero phone import only, from `phone-hero-vault-holdings-trunk.png.asset.json` to `phone-hero-vault-holdings-trunk-v2.png.asset.json`.
- Added `src/assets/home/phone-hero-vault-holdings-trunk-v2.png.asset.json`. The upload is byte-for-byte: 471111 bytes uploaded, 471111 source.
- No CSS change. `.home-hero-phone` already uses `filter: drop-shadow(...)`. The image and its wrapper have a transparent background, 0px border, no outline and no box-shadow.

## Other uses
No other file uses the old image.

## Browser (computed styles: [background, border width, outline, box-shadow, filter])
```
1440 src=phone-hero-vault-holdings-trunk-v2.png 611  img ['rgba(0, 0, 0, 0)','0px','none','none','drop-shadow(...)']  wrapper ['rgba(0, 0, 0, 0)','0px','none','none','none']
390  same
```
In the 1440 screenshot, the hero photo shows through at the rounded corners with no rectangle.
