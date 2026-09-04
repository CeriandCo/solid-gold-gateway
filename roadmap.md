# Roadmap

## Done
- Shared 4-column footer (homepage design) used on all 8 pages via `SiteFooter`; styles live in `src/styles.css` (`footer.site-footer`) so page-scoped CSS cannot alter them.
- Shared header: removed Gifting's header/footer overrides; Trust Center header/footer moved outside the page-scoped `<main>`; header geometry now fits 1024–1439px without horizontal overflow (full artboard values from 1440px).
- Removed dead `src/components/about-us-header.tsx`; removed the old "Fortress Gold Inc." footer and local `Brand`/`nav` from Fractional Gold.
- Vault: process/redemption step rows wrap on narrower laptops instead of overflowing the page.

## Ready
- Create real pages for footer links that still point to `#`: Security, Help Center, Terms of Service, Data Privacy Policy, Disclosures.
- Wire the header "Get Early Access" button (`#login`) to the actual early-access form (`/vault#early-access`).
- Social links in the footer point to `#`; add real Instagram / LinkedIn / YouTube URLs when available.
