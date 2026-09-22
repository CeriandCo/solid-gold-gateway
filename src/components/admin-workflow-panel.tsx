import { useEffect, useRef, useState } from "react";
import {
  submitForReview,
  returnToDraft,
  publishPost,
  archivePost,
  restoreToDraft,
} from "@/lib/aurum/review.functions";
import {
  actionDescriptor,
  availableActions,
  formatUtc,
  resolveScheduleInstant,
  runWorkflowAction,
  workflowErrorMessage,
  WORKFLOW_STATUS_LABELS,
  type ResolvedSchedule,
  type WorkflowActionKey,
  type WorkflowRunners,
  type WorkflowStatus,
} from "@/lib/aurum/workflow-ui";
import type { AdminRole } from "@/lib/admin-roles";

const DEFAULT_RUNNERS: WorkflowRunners = {
  submitForReview,
  returnToDraft,
  publishPost,
  archivePost,
  restoreToDraft,
};

export type AdminWorkflowPanelProps = {
  postId: string;
  status: WorkflowStatus;
  publishedAt: string | null;
  updatedAt: string;
  editable: boolean;
  role: AdminRole;
  /** True when the editor form holds changes that are not saved yet. */
  dirty: boolean;
  /** Saves the open form; false means the save failed and nothing should be sent. */
  saveNow: () => Promise<boolean>;
  /** Reloads the post from the server so the shown state is the persisted one. */
  onDone: () => Promise<void> | void;
  runners?: WorkflowRunners;
};

const TONE_CLASS: Record<string, string> = {
  primary: "admin-button",
  ghost: "admin-button admin-button--ghost",
  danger: "admin-button admin-button--danger",
};

export function AdminWorkflowPanel({
  postId,
  status,
  publishedAt,
  updatedAt,
  editable,
  role,
  dirty,
  saveNow,
  onDone,
  runners = DEFAULT_RUNNERS,
}: AdminWorkflowPanelProps) {
  const [pending, setPending] = useState<WorkflowActionKey | null>(null);
  const [confirming, setConfirming] = useState<WorkflowActionKey | null>(null);
  const [scheduling, setScheduling] = useState(false);
  const [scheduleValue, setScheduleValue] = useState("");
  const [scheduleZone, setScheduleZone] = useState<"local" | "utc">("local");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const confirmRef = useRef<HTMLButtonElement | null>(null);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);

  const keys = availableActions({ status, role, editable });

  useEffect(() => {
    if (confirming) confirmRef.current?.focus();
  }, [confirming]);

  const closeConfirm = () => {
    setConfirming(null);
    returnFocusRef.current?.focus();
  };

  let resolved: ResolvedSchedule | null = null;
  let scheduleError: string | null = null;
  if (scheduleValue) {
    try {
      const offset =
        scheduleZone === "utc" ? 0 : -new Date(`${scheduleValue}:00`).getTimezoneOffset();
      resolved = resolveScheduleInstant(scheduleValue, offset);
    } catch (cause) {
      scheduleError = workflowErrorMessage(cause);
    }
  }

  const perform = async (key: WorkflowActionKey, scheduledAt?: string) => {
    if (pending) return;
    setError(null);
    setNotice(null);

    // Never send form state that is only in the browser: the server reads the
    // saved row, so unsaved changes are written first or the action is stopped.
    if (key === "submit" && dirty) {
      setPending(key);
      const saved = await saveNow();
      if (!saved) {
        setPending(null);
        return;
      }
    }

    setPending(key);
    try {
      await runWorkflowAction(key, runners, { postId, updatedAt, scheduledAt });
      setConfirming(null);
      setScheduling(false);
      await onDone();
      setNotice(SUCCESS[key]);
    } catch (cause) {
      setError(workflowErrorMessage(cause));
    } finally {
      setPending(null);
    }
  };

  const scheduledLine =
    status === "scheduled" && publishedAt
      ? `Scheduled to appear on ${formatUtc(publishedAt)}.`
      : status === "published" && publishedAt
        ? `Published on ${formatUtc(publishedAt)}.`
        : null;

  return (
    <section className="admin-workflow" aria-label="Editorial workflow">
      <div className="admin-workflow__state">
        <span className={`admin-badge admin-badge--${status.replace("_", "-")}`}>
          {WORKFLOW_STATUS_LABELS[status]}
        </span>
        {scheduledLine ? <span className="admin-muted">{scheduledLine}</span> : null}
      </div>

      {error ? (
        <p className="admin-alert" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="admin-note" role="status">
          {notice}
        </p>
      ) : null}

      {keys.length === 0 ? (
        <p className="admin-help">
          {role === "editor"
            ? "A reviewer takes it from here."
            : "There is nothing to do on this post right now."}
        </p>
      ) : (
        <div className="admin-workflow__actions">
          {keys.map((key) => {
            const descriptor = actionDescriptor(key, status);
            return (
              <button
                key={key}
                type="button"
                className={TONE_CLASS[descriptor.tone]}
                disabled={pending !== null}
                aria-busy={pending === key}
                onClick={(event) => {
                  if (key === "schedule") {
                    setScheduling((open) => !open);
                    setError(null);
                    return;
                  }
                  if (descriptor.confirm) {
                    returnFocusRef.current = event.currentTarget;
                    setConfirming(key);
                    return;
                  }
                  void perform(key);
                }}
              >
                {pending === key ? descriptor.pendingLabel : descriptor.label}
              </button>
            );
          })}
        </div>
      )}

      {scheduling ? (
        <div className="admin-confirm" role="group" aria-label="Schedule publication">
          <div className="admin-field">
            <label className="admin-label" htmlFor="workflow-schedule-at">
              Date and time
            </label>
            <input
              id="workflow-schedule-at"
              className="admin-input"
              type="datetime-local"
              value={scheduleValue}
              onChange={(event) => setScheduleValue(event.target.value)}
            />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="workflow-schedule-zone">
              Time zone
            </label>
            <select
              id="workflow-schedule-zone"
              className="admin-input admin-input--select"
              value={scheduleZone}
              onChange={(event) => setScheduleZone(event.target.value as "local" | "utc")}
            >
              <option value="local">My time zone</option>
              <option value="utc">UTC</option>
            </select>
          </div>
          <p className="admin-help" role="status">
            {resolved
              ? `This post will appear at ${resolved.utcLabel} (entered as ${scheduleValue.replace("T", " ")} ${resolved.offsetLabel === "Z" ? "UTC" : `UTC${resolved.offsetLabel}`}).`
              : (scheduleError ??
                "Times are unambiguous: pick a date and time, then choose which time zone you typed it in.")}
          </p>
          <div className="admin-form__actions">
            <button
              type="button"
              className="admin-button"
              disabled={pending !== null || !resolved}
              onClick={() => resolved && void perform("schedule", resolved.iso)}
            >
              {pending === "schedule" ? "Scheduling…" : "Schedule publication"}
            </button>
            <button
              type="button"
              className="admin-button admin-button--ghost"
              disabled={pending !== null}
              onClick={() => setScheduling(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {confirming ? (
        <ConfirmBlock
          descriptor={actionDescriptor(confirming, status)}
          pending={pending === confirming}
          confirmRef={confirmRef}
          onCancel={closeConfirm}
          onConfirm={() => void perform(confirming)}
        />
      ) : null}
    </section>
  );
}

const SUCCESS: Record<WorkflowActionKey, string> = {
  submit: "Sent for review.",
  return: "Returned to draft.",
  publish: "Published.",
  schedule: "Scheduled.",
  archive: "Removed from the website.",
  restore: "Restored to draft.",
};

function ConfirmBlock({
  descriptor,
  pending,
  confirmRef,
  onCancel,
  onConfirm,
}: {
  descriptor: ReturnType<typeof actionDescriptor>;
  pending: boolean;
  confirmRef: React.RefObject<HTMLButtonElement | null>;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const confirm = descriptor.confirm!;
  return (
    <div
      className="admin-confirm"
      role="alertdialog"
      aria-modal="false"
      aria-label={confirm.title}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          onCancel();
        }
      }}
    >
      <p>
        <strong>{confirm.title}</strong>
      </p>
      {confirm.body.map((line) => (
        <p key={line} className="admin-help">
          {line}
        </p>
      ))}
      <div className="admin-form__actions">
        <button
          ref={confirmRef}
          type="button"
          className={TONE_CLASS[descriptor.tone]}
          disabled={pending}
          onClick={onConfirm}
        >
          {pending ? descriptor.pendingLabel : confirm.confirmLabel}
        </button>
        <button
          type="button"
          className="admin-button admin-button--ghost"
          disabled={pending}
          onClick={onCancel}
        >
          Keep as it is
        </button>
      </div>
    </div>
  );
}
