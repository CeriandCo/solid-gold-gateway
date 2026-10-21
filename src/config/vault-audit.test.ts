import { describe, expect, it } from "vitest";
import { vaultAuditSchedule } from "./vault-audit";

describe("vault audit reporting schedule", () => {
  it("reports every six months, not quarterly", () => {
    expect(vaultAuditSchedule.intervalMonths).toBe(6);
  });
  it("records the June 30, 2026 vault audit date", () => {
    expect(vaultAuditSchedule.latestAuditDate).toBe("2026-06-30");
  });
  it("schedules the next report for December 30, 2026", () => {
    expect(vaultAuditSchedule.upcomingReportDate).toBe("2026-12-30");
  });
});