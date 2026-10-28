/**
 * Launch countdown target. Change `launchAt` to move the launch date;
 * the countdown bar reads only this value.
 * 21 November 2026, 00:00 America/New_York (EST, UTC-5) = 05:00 UTC.
 */
export const launchConfig = {
  launchAt: "2026-11-21T05:00:00Z",
} as const;

export type Remaining = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

/** Time left until `target`, never negative. */
export function getRemaining(nowMs: number, target: string = launchConfig.launchAt): Remaining {
  const diff = Math.max(0, Date.parse(target) - nowMs);
  const total = Math.floor(diff / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    done: diff === 0,
  };
}
