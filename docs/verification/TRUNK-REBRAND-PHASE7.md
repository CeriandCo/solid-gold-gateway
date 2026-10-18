# TRUNK rebrand phase 7 — preflight, blocked before application changes

## Database reads actually performed

Read every aurum_posts row as JSON for case-insensitive sqoot matching, covering all existing columns (title, summary, body, pull_quote, review_line and other columns). There are no separate SEO/image-alt columns in this table; any embedded body fields were included by JSON matching.

Raw query results:

```text
aurum_posts: total_rows=12, matching_rows=0
aurum_cms_settings: total_rows=1, matching_rows=0
commerce_settings: total_rows=1, matching_rows=0
aurum_post_sources: total_rows=31, matching_rows=1
```

Raw matched linked source:

```text
id=e4fb679a-fccd-4408-a93c-93f19a539a4c
post_id=1ce2d203-e3e7-4c1d-8c66-c34f8c2b6ca1
position=0
publisher=SQOOT AURUM test
title=Test source
source_date=2026-09-25
url=https://solid-gold-gateway.lovable.app/aurum
```

Posts changed: 0. Fields changed: none. No database writes performed. The matched source has not yet been changed.

## Removal investigation

Both old pages are self-contained route modules. Their generated route-tree entries should regenerate, not be manually edited. Three ordinary assets appear exclusive to gifting-old-ver:

- src/assets/gifting-hero-product-final.jpg
- src/assets/gifting-legacy-gold-refined.jpg
- src/assets/gifting-phone-gold-bar-enhanced.png

The home-old-ver gold-bar-velvet-marble-branded.png image is shared by fractional-gold and must remain.

No application files or assets removed or changed yet; neither old URL has been claimed as 404.

## Blocking scope conflicts

The requested exhaustive zero-match sweep allows only three exception categories, but other matches cannot safely be replaced as presentation-only edits:

- Payment metadata/catalog identifiers are compatibility contracts for existing orders and webhooks. Blind replacement can break payment processing.
- Retained original image filenames and immutable asset-pointer URLs contain the old brand. Editing pointer URLs breaks image delivery; deleting retained originals exceeds the image deletion exception.
- Historical verification records and applied migration history contain raw old-brand evidence. Rewriting those as current branding would falsify evidence/history.
- A password-related server module was identified by the read-only investigator. Its secret value was not read back, printed or changed; password rotation is not a branding substitution.
- Test environment names/paths require a coordinated compatibility change rather than changing visible brand copy.

Waiting for the client to approve narrowly documented compatibility/historical/retained-asset exceptions or revise the scope. Final remaining-match list and final browser checks are not yet complete.

## Verification limits

No tests or browser checks ran in this preflight. Manual typecheck/build commands not run (prohibited by platform instructions). No gates claimed passed. No live test writes and nothing published.
