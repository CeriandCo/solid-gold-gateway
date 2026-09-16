# Build the AURUM Price Section

## Scope
- Replace only the `/aurum#price` placeholder with the requested price, facts, and history chart bands.
- Use the supplied velvet photographs through the project asset flow and preserve all other AURUM sections.

## Data and states
- Add public read-only tables for validated spot-price snapshots and daily USD-per-troy-ounce closes; do not seed invented prices.
- Read both through one server function so the subheader and price section always share the same loading, live, or unavailable state.
- Treat records older than 60 seconds, malformed records, missing records, and failed reads as unavailable; never show stale values as current.
- Compute month-to-date, year-to-date, 52-week high, and 52-week low from stored daily closes at render time.
- Re-query stored closes whenever the visitor selects 30D, 90D, 1Y, or 5Y.

## Interface
- Build the photographed current-price band, dark facts band, and warm-white accessible chart to the supplied typography and spacing.
- Keep both compliance footnotes verbatim, mark the spot figure as data rather than a heading, and implement calm loading/empty states.
- Stack supporting statistics and fact cards at 390px without horizontal page overflow.

## Verification
- Check live-shaped, stale, unavailable, empty-history, and network-failure behavior without adding production sample data.
- Confirm range changes re-read storage, the subheader and section agree, and desktop/mobile layouts match the brief.
- Confirm the preview and build are healthy.

## Technical details
- Lovable Cloud provides public read-only price/history storage protected by row-level access rules.
- TanStack server functions perform database reads and validation; TanStack Query owns initial loading, caching, and range refreshes.
- Recharts renders only stored points and displays a textual empty state when no rows exist.
