# Launch countdown bar

- Placement: homepage, between the navigation and hero (`src/routes/index.tsx`). Nothing else on the homepage changed.
- Component: `src/components/launch-countdown.tsx`. Date set in `src/config/launch.ts` (`launchAt: 2026-11-21T05:00:00Z` = 00:00 America/New_York).
- Colours #1A3A2A / #EDE5D4 were added as tokens; gold reuses the existing #C9A84C token. DM Sans was added to the font link.
- Browser check at 375 / 768 / 1440: bar heights 100 / 80 / 64 px; page width equals the viewport at each size (no sideways scroll). Values read at 04:02 UTC on 28 Oct: 24 days 00 hours 57–58 min.
- Tests: `src/config/launch.test.ts` (target date, countdown maths, no negatives). Could not run: the normal test setup fails at the isolated database start, and the standalone run failed with a Vite temp-path error.
- Not checked: what the bar looks like after launch (only covered by the maths test); refresh/inactive-tab accuracy (follows from recalculating from the clock every tick and on tab return).
- Conflict: the homepage FAQ still says "we will not promise a date". It was not changed.
- The brief was cut off at "Ensure the component does not negatively…".

## Ticker (update, 28 Oct)
- Added a "COMING SOON · MAKE ROOM FOR GOLD · TRUNK" ticker right below the countdown, in the same component. It uses a #10251A background (existing forest token), gold text, DM Sans, 4px letter spacing, 10px on mobile / 11px from 640px up, and a height of 32px.
- The loop is two identical halves of 6 repeats each, moving left by 50%. Pure CSS, linear, 90s per half, which works out to about 30s per two-phrase line. Reduced motion turns the animation off (measured: `animationName: none`).
- Browser check: ticker 32px tall at 375/768/1440; page scrollWidth = 375/768/1440 (no overflow); the strip's position changed within 1s at every width.
