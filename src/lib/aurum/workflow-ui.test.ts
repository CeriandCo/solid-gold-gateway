/**
 * Focused tests for the CMS workflow UI model: who is offered which control,
 * what each control says, how a typed date becomes an unambiguous instant, and
 * which server function each control actually calls.
 *
 * The backend's own security tests are not repeated here.
 */
import { describe, expect, it, vi } from "vitest";
import {
  actionDescriptor,
  availableActions,
  createWorkflowGate,
  formatOffset,
  formatUtc,
  readOnlyReason,
  resolveScheduleInstant,
  runWorkflowAction,
  workflowErrorMessage,
  SCHEDULE_MISSING,
  WORKFLOW_STATUS_LABELS,
  WORKFLOW_UNEXPECTED,
  type WorkflowRunners,
  type WorkflowStatus,
} from "@/lib/aurum/workflow-ui";
import { ABSOLUTE_INSTANT_FOR_TESTS, parsePublishInput } from "@/lib/aurum/review.functions";

const ROLES = ["editor", "reviewer", "admin"] as const;

function fakeRunners() {
  const calls: { fn: string; data: unknown }[] = [];
  const record = (fn: string) => async (args: { data: unknown }) => {
    calls.push({ fn, data: args.data });
    return { ok: true };
  };
  const runners: WorkflowRunners = {
    submitForReview: record("submitForReview"),
    returnToDraft: record("returnToDraft"),
    publishPost: record("publishPost"),
    archivePost: record("archivePost"),
    restoreToDraft: record("restoreToDraft"),
  };
  return { runners, calls };
}

describe("action visibility", () => {
  it("offers an editor exactly one action on their own draft", () => {
    expect(availableActions({ status: "draft", role: "editor", editable: true })).toEqual([
      "submit",
    ]);
  });

  it("offers an editor nothing on a draft they may not edit", () => {
    expect(availableActions({ status: "draft", role: "editor", editable: false })).toEqual([]);
  });

  it("never offers an editor a reviewer action", () => {
    const states: WorkflowStatus[] = ["in_review", "published", "scheduled", "archived"];
    for (const status of states) {
      expect(availableActions({ status, role: "editor", editable: false })).toEqual([]);
    }
  });

  it("offers reviewers and admins the review decisions on an in-review post", () => {
    for (const role of ["reviewer", "admin"] as const) {
      expect(availableActions({ status: "in_review", role, editable: false })).toEqual([
        "publish",
        "schedule",
        "return",
      ]);
    }
  });

  it("offers archiving on live and scheduled posts", () => {
    for (const status of ["published", "scheduled"] as const) {
      expect(availableActions({ status, role: "reviewer", editable: false })).toEqual(["archive"]);
      expect(availableActions({ status, role: "admin", editable: false })).toEqual(["archive"]);
    }
  });

  it("offers restore on an archived post", () => {
    expect(availableActions({ status: "archived", role: "reviewer", editable: false })).toEqual([
      "restore",
    ]);
  });

  it("offers submission to a reviewer or admin working on a draft", () => {
    for (const role of ["reviewer", "admin"] as const) {
      expect(availableActions({ status: "draft", role, editable: true })).toEqual(["submit"]);
    }
  });

  it("never offers publish from a state other than in review", () => {
    for (const role of ROLES) {
      for (const status of ["draft", "published", "scheduled", "archived"] as WorkflowStatus[]) {
        const keys = availableActions({ status, role, editable: true });
        expect(keys).not.toContain("publish");
        expect(keys).not.toContain("schedule");
      }
    }
  });
});

describe("wording", () => {
  it("labels every state in words, not colour alone", () => {
    expect(WORKFLOW_STATUS_LABELS).toEqual({
      draft: "Draft",
      in_review: "In review",
      scheduled: "Scheduled",
      published: "Published",
      archived: "Archived",
    });
  });

  it("calls the destructive action Unpublish on a live post", () => {
    const descriptor = actionDescriptor("archive", "published");
    expect(descriptor.label).toBe("Unpublish");
    expect(descriptor.confirm?.confirmLabel).toBe("Unpublish");
    expect(descriptor.confirm?.body.join(" ")).toMatch(/nothing is deleted/i);
  });

  it("calls the same action a cancellation on a scheduled post", () => {
    const descriptor = actionDescriptor("archive", "scheduled");
    expect(descriptor.label).toBe("Cancel scheduled publication");
    expect(descriptor.confirm?.body.join(" ")).toMatch(/not appear at the scheduled time/i);
  });

  it("never calls returning a post a rejection", () => {
    const descriptor = actionDescriptor("return", "in_review");
    expect(descriptor.label).toBe("Return to draft");
    expect(descriptor.label.toLowerCase()).not.toContain("reject");
  });

  it("warns that publishing is immediate and public", () => {
    const confirm = actionDescriptor("publish", "in_review").confirm;
    expect(confirm).not.toBeNull();
    expect(confirm!.body.join(" ")).toMatch(/straight away/i);
  });

  it("makes clear that restoring does not republish", () => {
    const confirm = actionDescriptor("restore", "archived").confirm;
    expect(confirm!.body.join(" ")).toMatch(/does not put it back/i);
    expect(confirm!.body.join(" ")).toMatch(/reviewed and published again/i);
    expect(confirm!.confirmLabel.toLowerCase()).not.toContain("publish");
  });

  it("explains why an open post cannot be edited", () => {
    expect(readOnlyReason("draft", true)).toBeNull();
    expect(readOnlyReason("draft", false)).toMatch(/only the person who wrote/i);
    expect(readOnlyReason("in_review", false)).toMatch(/awaiting review/i);
    expect(readOnlyReason("published", false)).toMatch(/unpublish/i);
    expect(readOnlyReason("scheduled", false)).toMatch(/cancel/i);
    expect(readOnlyReason("archived", false)).toMatch(/restore/i);
  });
});

describe("scheduling", () => {
  it("formats offsets the way an ISO instant needs them", () => {
    expect(formatOffset(0)).toBe("Z");
    expect(formatOffset(420)).toBe("+07:00");
    expect(formatOffset(-330)).toBe("-05:30");
  });

  it("writes the chosen zone into the instant instead of guessing", () => {
    const utc = resolveScheduleInstant("2026-09-10T14:30", 0);
    expect(utc.iso).toBe("2026-09-10T14:30:00Z");
    const bangkok = resolveScheduleInstant("2026-09-10T14:30", 420);
    expect(bangkok.iso).toBe("2026-09-10T14:30:00+07:00");
    expect(bangkok.utcLabel).toBe("10 Sep 2026, 07:30 UTC");
  });

  it("produces an instant the publish wrapper accepts", () => {
    const resolved = resolveScheduleInstant("2026-09-10T14:30", 420);
    expect(ABSOLUTE_INSTANT_FOR_TESTS.test(resolved.iso)).toBe(true);
    const parsed = parsePublishInput({
      postId: "4b1f6c2e-5a3d-4c8b-9f2a-1d7e6b5c4a39",
      publishedAt: resolved.iso,
    });
    expect(parsed.publishedAt).toBe("2026-09-10T07:30:00.000Z");
  });

  it("refuses an incomplete date rather than inventing one", () => {
    expect(() => resolveScheduleInstant("", 0)).toThrow(SCHEDULE_MISSING);
    expect(() => resolveScheduleInstant("2026-09-10", 0)).toThrow(SCHEDULE_MISSING);
  });

  it("shows an absolute instant back to the reviewer", () => {
    expect(formatUtc("2026-01-02T03:04:00Z")).toBe("02 Jan 2026, 03:04 UTC");
  });
});

describe("wiring", () => {
  const postId = "4b1f6c2e-5a3d-4c8b-9f2a-1d7e6b5c4a39";

  it("submits through submitForReview with the loaded row version", async () => {
    const { runners, calls } = fakeRunners();
    await runWorkflowAction("submit", runners, { postId, updatedAt: "2026-09-10T00:00:00Z" });
    expect(calls).toEqual([
      { fn: "submitForReview", data: { postId, updatedAt: "2026-09-10T00:00:00Z" } },
    ]);
  });

  it("returns through returnToDraft with nothing but the post", async () => {
    const { runners, calls } = fakeRunners();
    await runWorkflowAction("return", runners, { postId, updatedAt: null });
    expect(calls).toEqual([{ fn: "returnToDraft", data: { postId } }]);
  });

  it("publishes now through publishPost with a null time", async () => {
    const { runners, calls } = fakeRunners();
    await runWorkflowAction("publish", runners, { postId, updatedAt: null });
    expect(calls).toEqual([{ fn: "publishPost", data: { postId, publishedAt: null } }]);
  });

  it("schedules through the same publishPost with an absolute instant", async () => {
    const { runners, calls } = fakeRunners();
    await runWorkflowAction("schedule", runners, {
      postId,
      updatedAt: null,
      scheduledAt: "2026-09-10T14:30:00+07:00",
    });
    expect(calls).toEqual([
      { fn: "publishPost", data: { postId, publishedAt: "2026-09-10T14:30:00+07:00" } },
    ]);
  });

  it("refuses to schedule without an instant", async () => {
    const { runners, calls } = fakeRunners();
    await expect(
      runWorkflowAction("schedule", runners, { postId, updatedAt: null }),
    ).rejects.toThrow(SCHEDULE_MISSING);
    expect(calls).toEqual([]);
  });

  it("unpublishes and cancels a schedule through the one archivePost", async () => {
    const { runners, calls } = fakeRunners();
    await runWorkflowAction("archive", runners, { postId, updatedAt: null });
    expect(calls).toEqual([{ fn: "archivePost", data: { postId } }]);
  });

  it("restores through restoreToDraft and never through publish", async () => {
    const { runners, calls } = fakeRunners();
    await runWorkflowAction("restore", runners, { postId, updatedAt: null });
    expect(calls).toEqual([{ fn: "restoreToDraft", data: { postId } }]);
    expect(calls.some((call) => call.fn === "publishPost")).toBe(false);
  });
});

describe("pending behaviour and errors", () => {
  it("drops a second request while one is in flight", async () => {
    const gate = createWorkflowGate();
    const work = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return "done";
    });
    const first = gate.run(work);
    const second = await gate.run(work);
    expect(second).toBeNull();
    expect(await first).toBe("done");
    expect(work).toHaveBeenCalledTimes(1);
    // The gate reopens once the request settles.
    expect(await gate.run(work)).toBe("done");
  });

  it("reopens the gate after a failure", async () => {
    const gate = createWorkflowGate();
    await expect(
      gate.run(async () => {
        throw new Error("no");
      }),
    ).rejects.toThrow("no");
    expect(gate.busy).toBe(false);
  });

  it("shows the server's own sentence and nothing more", () => {
    expect(workflowErrorMessage(new Error("That post is no longer awaiting review."))).toBe(
      "That post is no longer awaiting review.",
    );
    expect(workflowErrorMessage(new Error("Another reviewer has to approve your own post."))).toBe(
      "Another reviewer has to approve your own post.",
    );
    expect(workflowErrorMessage("boom")).toBe(WORKFLOW_UNEXPECTED);
    expect(workflowErrorMessage(new Error("   "))).toBe(WORKFLOW_UNEXPECTED);
  });
});
