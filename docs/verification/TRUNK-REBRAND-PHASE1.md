# TRUNK rebrand — phase 1 (head metadata and icons)

> Archive note: Brand wording was normalized to TRUNK on November 23, 2026. Addresses, technical identifiers and recorded measurements remain historical; this is not a new verification run.

- Replaced TRUNK / TRUNK / TRUNK / TRUNK / TRUNK with TRUNK inside the `head()` block of 26 route files (titles, descriptions, og:*, twitter:*, author, JSON-LD publisher name on the two AURUM slug pages).
- Kept as-is (not brand words): `hello@sqoot.us` (contact descriptions), `getsqoot.com` and the legal name "Fortress Gold Inc." (terms description).
- `public/favicon.png` replaced with the uploaded 32x32 file; `public/apple-touch-icon.png` added and linked in root head.
- `public/og/pricing-trunk.png` (1200x640, 356K) added; /pricing og:image and twitter:image point to it. Old `public/og/pricing.png` kept.
- Not done: `favicon.ico` was not among the uploads (favicon-48.png was), so no .ico file or link was added.
- Remaining "TRUNK" matches in head blocks: only the email, domain and legal DBA above.
- Gates: `bunx tsgo --noEmit` passed, `bun run build` passed. `bun run test` and browser check not run.
