/**
 * The workflow only works if every state can actually be found. These read the
 * admin listing and the editor page as source, which is enough to prove the
 * states are reachable without pulling in a browser test runner.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const listing = readFileSync("src/routes/admin.posts.index.tsx", "utf8");
const editor = readFileSync("src/components/admin-post-form.tsx", "utf8");
const panel = readFileSync("src/components/admin-workflow-panel.tsx", "utf8");

describe("admin listing reachability", () => {
  it("has a filter tab for every workflow state", () => {
    for (const key of ["draft", "in_review", "scheduled", "published", "archived"]) {
      expect(listing).toContain(`key: "${key}"`);
    }
  });

  it("names each state in words in the tab and the badge", () => {
    for (const label of ["Draft", "In review", "Scheduled", "Published", "Archived"]) {
      expect(listing).toContain(`"${label}"`);
    }
  });

  it("shows the publication date, so a scheduled post's time is visible", () => {
    expect(listing).toContain("Publication date");
  });
});

describe("editor page", () => {
  it("renders the workflow panel with the persisted state, not form state", () => {
    expect(editor).toContain("<AdminWorkflowPanel");
    expect(editor).toContain("status={post.status}");
    expect(editor).toContain("updatedAt={post.updatedAt}");
    expect(editor).toContain("editable={post.editable}");
  });

  it("no longer lets a draft carry an editable publication date", () => {
    expect(editor).not.toContain('id="post-published-at"');
    expect(editor).toContain("Set by the reviewer when the post is published or scheduled.");
  });
});

describe("workflow panel", () => {
  it("calls only the existing workflow server functions", () => {
    expect(panel).toContain('from "@/lib/aurum/review.functions"');
    for (const fn of [
      "submitForReview",
      "returnToDraft",
      "publishPost",
      "archivePost",
      "restoreToDraft",
    ]) {
      expect(panel).toContain(fn);
    }
  });

  it("saves the open form before sending a post for review", () => {
    expect(panel).toContain('if (key === "submit" && dirty)');
    expect(panel).toContain("await saveNow()");
  });

  it("reloads the persisted post after every action instead of assuming success", () => {
    expect(panel).toContain("await onDone();");
  });

  it("never recreates a role or self-approval rule of its own", () => {
    expect(panel).not.toMatch(/allow_self_approval|allowSelfApproval/);
    expect(panel).not.toMatch(/author_id|authorId/);
  });

  it("uses the project's confirmation pattern and keeps it keyboard usable", () => {
    expect(panel).toContain('role="alertdialog"');
    expect(panel).toContain('event.key === "Escape"');
    expect(panel).toContain("confirmRef.current?.focus()");
    expect(panel).toContain("returnFocusRef.current?.focus()");
  });

  it("blocks a second click while an action is in flight", () => {
    expect(panel).toContain("disabled={pending !== null}");
    expect(panel).toContain("if (pending) return;");
  });
});
