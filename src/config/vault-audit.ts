export const vaultAuditSchedule = {
  intervalMonths: 6,
  latestAuditDate: "2026-06-30",
  upcomingReportDate: "2026-12-30",
} as const;

export function formatAuditDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}