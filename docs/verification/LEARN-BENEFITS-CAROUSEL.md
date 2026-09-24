# Learn benefits carousel fix

## Topic match check (run this task)
Static Learn articles: "Physical Gold vs Gold ETF: What You Actually Own", "How to Buy Physical Gold Online Safely", "Gifting Gold: A Guide for Weddings, Festivals, and Milestones".
Published aurum_posts (query `select title from aurum_posts where status='published'`, 9 rows):
- Why the spread on a one ounce coin moved this week
- Three mints reported longer lead times
- What a central bank purchase actually signals
- Why an assay card is part of the product
- The troy ounce, and why the number on the invoice looks odd
- Allocated and unallocated storage are different legal arrangements
- What a widening premium actually tells you
- Three mints, one supply story
- What central banks actually reported this quarter

None substantively covers Inflation Hedge, Portfolio Diversifier, Long-term Value, Global Liquidity, Tangible Asset or Crisis Protection. Result: 0 links, all 6 cards stay static.

## Changes (src/routes/learn.index.tsx)
- Removed the `article:hover` opacity and icon-lift rules, so cards react only to the carousel's active state.
- Added an outlined "Explore Learn →" link to `#aurum-archive`, placed next to "Learn about gold's qualities →".

## Browser (Playwright)
```
375 cardCursor auto scrollY 0 -> 6835 archiveTop 0 /learn#aurum-archive
768 cardCursor auto scrollY 0 -> 5241 archiveTop 0 /learn#aurum-archive
1440 cardCursor auto scrollY 0 -> 3488 archiveTop 0 /learn#aurum-archive
```
Not run this task: tsgo, test suite, build.
