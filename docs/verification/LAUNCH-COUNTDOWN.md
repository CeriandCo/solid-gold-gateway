# Launch countdown bar

- Placement: homepage, between the navigation and hero (`src/routes/index.tsx`). Nothing else on the homepage changed.
- Component: `src/components/launch-countdown.tsx`. Date set in `src/config/launch.ts` (`launchAt: 2026-11-21T05:00:00Z` = 00:00 America/New_York).
- Colours #1A3A2A / #EDE5D4 were added as tokens; gold reuses the existing #C9A84C token. DM Sans was added to the font link.
- Browser check at 375 / 768 / 1440: bar heights 100 / 80 / 64 px; page width equals the viewport at each size (no sideways scroll). Values read at 04:02 UTC on 28 Oct: 24 days 00 hours 57–58 min.
- Tests: `src/config/launch.test.ts` (target date, countdown maths, no negatives). Could not run: the normal test setup fails at the isolated database start, and the standalone run failed with a Vite temp-path error.
- Not checked: what the bar looks like after launch (only covered by the maths test); refresh/inactive-tab accuracy (follows from recalculating from the clock every tick and on tab return).
- Conflict: the homepage FAQ still says "we will not promise a date". It was not changed.
- The brief was cut off at "Ensure the component does not negatively…".
