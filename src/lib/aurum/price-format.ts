export const AURUM_USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});
/** Signed percentage, same format the /aurum price section renders. */
export const AURUM_PERCENT = new Intl.NumberFormat("en-US", { signDisplay: "always", minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** "As of HH:MM:SS UTC" clock, same format the /aurum price section renders. */
export const AURUM_UTC_TIME = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

/** Relative age label, same wording the /aurum price section renders. */
export function formatPriceAge(seconds: number) {
  if (seconds < 90) return `${Math.max(1, Math.round(seconds))} seconds`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 90) return `${minutes} minutes`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours} hours`;
  return `${Math.round(hours / 24)} days`;
}
