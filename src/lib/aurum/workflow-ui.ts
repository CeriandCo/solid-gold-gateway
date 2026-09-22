/**
 * AURUM CMS workflow — the browser-side model behind the editorial controls.
 *
 * Everything here is pure and deliberately free of React so the visibility
 * matrix, the wording, the scheduling arithmetic and the wiring can be tested
 * directly. It restates NOTHING the backend decides: the server functions and
 * the database remain the authority, and these rules exist only so people are
 * not offered buttons that would be refused.
 */
import type { AdminPostStatus } from "@/lib/admin.functions";
import type { AdminRole } from "@/lib/admin-roles";

export type WorkflowStatus = AdminPostStatus;

export type WorkflowActionKey = "submit" | "return" | "publish" | "schedule" | "archive" | "restore";

export type WorkflowTone = "primary" | "ghost" | "danger";

export type WorkflowActionDescriptor = {
  key: WorkflowActionKey;
  label: string;
  pendingLabel: string;
  tone: WorkflowTone;
  /** Null when the action is performed without a confirmation step. */
  confirm: { title: string; body: string[]; confirmLabel: string } | null;
};

export const WORKFLOW_STATUS_LABELS: Record<WorkflowStatus, string> = {
  draft: "Draft",
  in_review: "In review",
  scheduled: "Scheduled",
  published: "Published",
  archived: "Archived",
};

/** The sentence shown when the editor is open but nothing can be changed. */
export function readOnlyReason(status: WorkflowStatus, mine: boolean): string | null {
  if (status === "draft") {
    return mine ? null : "Only the person who wrote this draft can edit it.";
  }
  if (status === "in_review") {
    return "This post is awaiting review. Content and sources stay read-only until it is returned to draft.";
  }
  if (status === "archived") {
    return "This post is archived. Restore it to draft to make changes.";
  }
  if (status === "scheduled") {
    return "This post is scheduled. Cancel the scheduled publication to make changes.";
  }
  return "This post is published. Unpublish it to make changes.";
}

export type ActionContext = {
  status: WorkflowStatus;
  role: AdminRole;
  /** The backend's own answer to "may this person edit this draft?". */
  editable: boolean;
};

/**
 * Which controls a person is offered. Editors get exactly one workflow action —
 * sending their own draft for review — and never see reviewer controls at all,
 * because a disabled button they can never enable is only noise.
 */
export function availableActions(context: ActionContext): WorkflowActionKey[] {
  const reviewer = context.role === "reviewer" || context.role === "admin";
  switch (context.status) {
    case "draft":
      return context.editable ? ["submit"] : [];
    case "in_review":
      return reviewer ? ["publish", "schedule", "return"] : [];
    case "published":
    case "scheduled":
      return reviewer ? ["archive"] : [];
    case "archived":
      return reviewer ? ["restore"] : [];
    default:
      return [];
  }
}

/**
 * Wording and confirmation copy. Archive says two different things because one
 * action serves two situations: taking live content off the site, and calling
 * off a publication that has not happened yet.
 */
export function actionDescriptor(
  key: WorkflowActionKey,
  status: WorkflowStatus,
): WorkflowActionDescriptor {
  switch (key) {
    case "submit":
      return {
        key,
        label: "Submit for review",
        pendingLabel: "Sending…",
        tone: "primary",
        confirm: null,
      };
    case "return":
      return {
        key,
        label: "Return to draft",
        pendingLabel: "Returning…",
        tone: "ghost",
        confirm: null,
      };
    case "publish":
      return {
        key,
        label: "Publish now",
        pendingLabel: "Publishing…",
        tone: "primary",
        confirm: {
          title: "Publish this post now?",
          body: [
            "It becomes visible to everyone on the website straight away.",
            "You can unpublish it afterwards, which removes it from public view without deleting anything.",
          ],
          confirmLabel: "Publish now",
        },
      };
    case "schedule":
      return {
        key,
        label: "Schedule…",
        pendingLabel: "Scheduling…",
        tone: "ghost",
        confirm: null,
      };
    case "archive":
      return status === "scheduled"
        ? {
            key,
            label: "Cancel scheduled publication",
            pendingLabel: "Cancelling…",
            tone: "danger",
            confirm: {
              title: "Cancel the scheduled publication?",
              body: [
                "The post will not appear at the scheduled time.",
                "Nothing is deleted: the content and its sources stay exactly as they are, and it can be restored to draft later.",
              ],
              confirmLabel: "Cancel publication",
            },
          }
        : {
            key,
            label: "Unpublish",
            pendingLabel: "Unpublishing…",
            tone: "danger",
            confirm: {
              title: "Unpublish this post?",
              body: [
                "It disappears from the website and its public address stops working.",
                "Nothing is deleted: the content and its sources stay exactly as they are, and it can be restored to draft later.",
              ],
              confirmLabel: "Unpublish",
            },
          };
    case "restore":
      return {
        key,
        label: "Restore to draft",
        pendingLabel: "Restoring…",
        tone: "primary",
        confirm: {
          title: "Restore this post to draft?",
          body: [
            "This does not put it back on the website.",
            "The previous publication date and reviewer are cleared, so it has to be reviewed and published again before it is public.",
          ],
          confirmLabel: "Restore to draft",
        },
      };
  }
}

/* ------------------------------------------------------------------ *
 * Scheduling — turning what a person typed into an unambiguous instant.
 * ------------------------------------------------------------------ */

export const SCHEDULE_MISSING = "Choose the date and time this post should appear.";

export type ScheduleZone = "local" | "utc";

export type ResolvedSchedule = {
  /** Absolute instant with an explicit offset, exactly what publishPost wants. */
  iso: string;
  /** The offset written into the instant, e.g. "+07:00". */
  offsetLabel: string;
  /** The same instant expressed in UTC, for the confirmation line. */
  utcLabel: string;
};

/** Minutes east of UTC -> "+07:00" / "-05:30" / "Z". */
export function formatOffset(minutes: number): string {
  if (minutes === 0) return "Z";
  const sign = minutes > 0 ? "+" : "-";
  const abs = Math.abs(minutes);
  const hh = String(Math.floor(abs / 60)).padStart(2, "0");
  const mm = String(abs % 60).padStart(2, "0");
  return `${sign}${hh}:${mm}`;
}

/** "10 Sep 2026, 14:30 UTC" from any absolute instant. */
export function formatUtc(iso: string): string {
  const date = new Date(iso);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = months[date.getUTCMonth()];
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mm = String(date.getUTCMinutes()).padStart(2, "0");
  return `${day} ${month} ${date.getUTCFullYear()}, ${hh}:${mm} UTC`;
}

/**
 * `value` is what a `datetime-local` input produced ("2026-09-10T14:30"), which
 * carries no zone at all. The offset is supplied by the caller and written into
 * the instant, so the reviewer's choice is never guessed at.
 */
export function resolveScheduleInstant(value: string, offsetMinutes: number): ResolvedSchedule {
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(trimmed)) throw new Error(SCHEDULE_MISSING);
  const withSeconds = trimmed.length === 16 ? `${trimmed}:00` : trimmed;
  const offsetLabel = formatOffset(offsetMinutes);
  const iso = `${withSeconds}${offsetLabel}`;
  const parsed = Date.parse(iso);
  if (Number.isNaN(parsed)) throw new Error(SCHEDULE_MISSING);
  return { iso, offsetLabel, utcLabel: formatUtc(new Date(parsed).toISOString()) };
}

/* ------------------------------------------------------------------ *
 * Wiring — each control calls exactly one existing server function.
 * ------------------------------------------------------------------ */

export type WorkflowRunners = {
  submitForReview: (args: { data: { postId: string; updatedAt: string | null } }) => Promise<unknown>;
  returnToDraft: (args: { data: { postId: string } }) => Promise<unknown>;
  publishPost: (args: {
    data: { postId: string; publishedAt: string | null };
  }) => Promise<unknown>;
  archivePost: (args: { data: { postId: string } }) => Promise<unknown>;
  restoreToDraft: (args: { data: { postId: string } }) => Promise<unknown>;
};

export type WorkflowActionArgs = {
  postId: string;
  /** The row version the editor was loaded with; only submission uses it. */
  updatedAt: string | null;
  /** Absolute instant for a scheduled publication; ignored by every other action. */
  scheduledAt?: string | null | undefined;
};

export async function runWorkflowAction(
  key: WorkflowActionKey,
  runners: WorkflowRunners,
  args: WorkflowActionArgs,
): Promise<unknown> {
  switch (key) {
    case "submit":
      return runners.submitForReview({
        data: { postId: args.postId, updatedAt: args.updatedAt },
      });
    case "return":
      return runners.returnToDraft({ data: { postId: args.postId } });
    case "publish":
      // Immediate publication: the database's own clock decides the instant.
      return runners.publishPost({ data: { postId: args.postId, publishedAt: null } });
    case "schedule": {
      const scheduledAt = args.scheduledAt ?? null;
      if (!scheduledAt) throw new Error(SCHEDULE_MISSING);
      return runners.publishPost({ data: { postId: args.postId, publishedAt: scheduledAt } });
    }
    case "archive":
      return runners.archivePost({ data: { postId: args.postId } });
    case "restore":
      return runners.restoreToDraft({ data: { postId: args.postId } });
  }
}

export const WORKFLOW_UNEXPECTED = "That did not work. Try again.";

/** Server functions already return safe, stable sentences; they are shown as-is. */
export function workflowErrorMessage(cause: unknown): string {
  if (cause instanceof Error && cause.message.trim()) return cause.message;
  return WORKFLOW_UNEXPECTED;
}

/**
 * A one-at-a-time gate. Repeat clicks while a workflow request is in flight are
 * dropped rather than queued, so no action can fire twice.
 */
export function createWorkflowGate() {
  let running = false;
  return {
    get busy() {
      return running;
    },
    async run<T>(work: () => Promise<T>): Promise<T | null> {
      if (running) return null;
      running = true;
      try {
        return await work();
      } finally {
        running = false;
      }
    },
  };
}
