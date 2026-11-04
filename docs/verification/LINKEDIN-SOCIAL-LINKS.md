# LinkedIn social links

Both footer and contact social lists already contained exactly one LinkedIn entry with the requested URL. Updated only their accessible labels to `Trunk on LinkedIn`; preserved existing icons, styling, spacing, hover rules, URL, new-tab target and `noopener noreferrer`.

Files changed:
- `src/components/site-chrome.tsx`
- `src/routes/contact.tsx`
- This verification report.

Browser verification against `/contact`, raw output:
```json
{"width": 375, "linkedin_links": 2, "footer_linkedin_links": 1, "icon_sizes": [{"width": 20, "height": 20}, {"width": 20, "height": 20}, {"width": 20, "height": 20}, {"width": 20, "height": 20}, {"width": 20, "height": 20}]}
{"width": 768, "linkedin_links": 2, "footer_linkedin_links": 1, "icon_sizes": [{"width": 20, "height": 20}, {"width": 20, "height": 20}, {"width": 20, "height": 20}, {"width": 20, "height": 20}, {"width": 20, "height": 20}]}
{"width": 1440, "linkedin_links": 2, "footer_linkedin_links": 1, "icon_sizes": [{"width": 20, "height": 20}, {"width": 20, "height": 20}, {"width": 20, "height": 20}, {"width": 20, "height": 20}, {"width": 20, "height": 20}]}
```

Browser assertions passed for both links at all three widths: exact URL `https://www.linkedin.com/company/trunkgold`, `target="_blank"`, and `rel="noopener noreferrer"`. Captured footer screenshots at all three widths; inspected the phone screenshot. No link was clicked, so no navigation/scroll-change claim is made.

Automatic preview output:
```text
=== build 2026-11-04T11:27:37Z ===
build OK
```

Manual build/typecheck commands were not run, per environment instructions. Full test suite was not run for this accessibility-label-only change. Nothing published.