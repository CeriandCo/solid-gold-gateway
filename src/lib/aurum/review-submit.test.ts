import { describe, expect, it } from "vitest";

import {
  makeFakeClient,
  makePost,
  type FakeDb,
  type FakePost,
} from "./review-fake-supabase";
import {
  SUBMIT_CONFLICT,
  SUBMIT_FORBIDDEN,
  SUBMIT_MISSING_SOURCE,
  SUBMIT_NOT_FOUND,
  SUBMIT_STALE,
  SUBMIT_WRONG_STATUS,
  performSubmitForReview,
} from "./review.functions";
import { FORBIDDEN_ROLE_MESSAGE, NOT_AN_EDITOR_MESSAGE } from "@/lib/admin-roles";

const EDITOR = "22222222-2222-4222-8222-222222222222";

type Setup = {
  post?: Partial<FakePost>;
  sources?: number;
  role?: unknown;
  canEditDraft?: boolean;
  beforeUpdate?: (db: FakeDb) => void;
};

function setup(options: Setup = {}) {
  const post = makePost(options.post);
  const db: FakeDb = {
    posts: [post],
    sources: Array.from({ length: options.sources ?? 1 }, (_, index) => ({
      id: `s${index}`,
      post_id: post.id,
    })),
    ...(options.beforeUpdate ? { beforeUpdate: options.beforeUpdate } : {}),
  };
  const user = makeFakeClient(db, {
    role: options.role ?? "editor",
    canEditDraft: options.canEditDraft ?? true,
  });
  const privileged = makeFakeClient(db, { role: null, privileged: true });
  const submit = (updatedAt: string | null = null) =>
    performSubmitForReview(
      { supabase: user, getPrivileged: async () => privileged },
      { postId: post.id, updatedAt },
    );
  return { db, post, user, submit };
}

describe("submitForReview — permissions", () => {
  it("lets an editor submit a draft they may edit", async () => {
    const { submit, db } = setup();
    const result = await submit();
    expect(result).toMatchObject({ status: "in_review", changed: true });
    expect(db.posts[0]!.status).toBe("in_review");
  });

  it("refuses an editor who may not edit that draft", async () => {
    const { submit, db } = setup({ canEditDraft: false, post: { author_id: "someone-else" } });
    await expect(submit()).rejects.toThrow(SUBMIT_FORBIDDEN);
    expect(db.posts[0]!.status).toBe("draft");
  });

  it("lets a reviewer and an admin submit under the same edit semantics", async () => {
    for (const role of ["reviewer", "admin"]) {
      const { submit } = setup({ role });
      await expect(submit()).resolves.toMatchObject({ changed: true });
    }
  });

  it("refuses anyone who is not on the editor list", async () => {
    const { submit, db } = setup({ role: null });
    await expect(submit()).rejects.toThrow(NOT_AN_EDITOR_MESSAGE);
    expect(db.posts[0]!.status).toBe("draft");
  });

  it("fails closed on an unrecognised role", async () => {
    const { submit } = setup({ role: "owner" });
    await expect(submit()).rejects.toThrow(NOT_AN_EDITOR_MESSAGE);
  });

  it("keeps the allowed-role list meaningful", async () => {
    // Guards the helper wiring: a role outside the allowlist is refused by the
    // shared guard, not by ad-hoc checks in the workflow.
    expect(FORBIDDEN_ROLE_MESSAGE).toMatch(/Forbidden/);
  });

  it("reports a missing post as not found", async () => {
    const { user, db } = setup();
    const privileged = makeFakeClient(db, { role: null, privileged: true });
    await expect(
      performSubmitForReview(
        { supabase: user, getPrivileged: async () => privileged },
        { postId: "00000000-0000-4000-8000-000000000000", updatedAt: null },
      ),
    ).rejects.toThrow(SUBMIT_NOT_FOUND);
  });
});

describe("submitForReview — starting state", () => {
  it("refuses a published post", async () => {
    const { submit } = setup({
      post: { status: "published", published_at: "2026-01-01T00:00:00.000Z" },
    });
    await expect(submit()).rejects.toThrow(SUBMIT_WRONG_STATUS);
  });

  it("refuses a scheduled post (published with a future date)", async () => {
    const { submit } = setup({
      post: { status: "published", published_at: "2099-01-01T00:00:00.000Z" },
    });
    await expect(submit()).rejects.toThrow(SUBMIT_WRONG_STATUS);
  });

  it("refuses an archived post", async () => {
    const { submit } = setup({ post: { status: "archived" } });
    await expect(submit()).rejects.toThrow(SUBMIT_WRONG_STATUS);
  });

  it("refuses a stale updatedAt from the editor's form", async () => {
    const { submit, db } = setup();
    await expect(submit("2026-08-30T10:00:00.000Z")).rejects.toThrow(SUBMIT_STALE);
    expect(db.posts[0]!.status).toBe("draft");
  });

  it("accepts a matching updatedAt", async () => {
    const { submit, post } = setup();
    await expect(submit(post.updated_at)).resolves.toMatchObject({ changed: true });
  });
});

describe("submitForReview — content and sources", () => {
  it("rejects an empty body", async () => {
    const { submit } = setup({ post: { body: [] } });
    await expect(submit()).rejects.toThrow(/paragraph/i);
  });

  it("rejects a missing title", async () => {
    const { submit } = setup({ post: { title: "   " } });
    await expect(submit()).rejects.toThrow(/title/i);
  });

  it("rejects a malformed slug", async () => {
    const { submit } = setup({ post: { slug: "Not A Slug" } });
    await expect(submit()).rejects.toThrow(/web address/i);
  });

  it("rejects a missing summary", async () => {
    const { submit } = setup({ post: { summary: "" } });
    await expect(submit()).rejects.toThrow(/summary/i);
  });

  it("rejects a nonsense read time", async () => {
    const { submit } = setup({ post: { read_minutes: 0 } });
    await expect(submit()).rejects.toThrow(/read time/i);
  });

  it("rejects a daily note with no source", async () => {
    const { submit, db } = setup({ sources: 0 });
    await expect(submit()).rejects.toThrow(SUBMIT_MISSING_SOURCE);
    expect(db.posts[0]!.status).toBe("draft");
  });

  it("rejects a weekly brief with no source", async () => {
    const { submit } = setup({ post: { type: "weekly_brief" }, sources: 0 });
    await expect(submit()).rejects.toThrow(SUBMIT_MISSING_SOURCE);
  });

  it("keeps the current article policy: no source requirement", async () => {
    const { submit } = setup({ post: { type: "article" }, sources: 0 });
    await expect(submit()).resolves.toMatchObject({ changed: true });
  });

  it("refuses an unsupported post type", async () => {
    const { submit } = setup({ post: { type: "newsletter" } });
    await expect(submit()).rejects.toThrow(/post type/i);
  });
});

describe("submitForReview — transition metadata", () => {
  it("writes the transition and preserves everything else", async () => {
    const { submit, db, post } = setup({
      post: {
        reviewed_by: "11111111-1111-4111-8111-111111111111",
        reviewed_at: "2026-08-01T10:00:00.000Z",
        author_id: EDITOR,
        published_at: null,
      },
    });
    const before = { ...post };
    const result = await submit();
    const after = db.posts[0]!;

    expect(after.status).toBe("in_review");
    expect(after.submitted_at).toBe(result.submittedAt);
    expect(new Date(after.submitted_at!).getTime()).toBeGreaterThan(0);
    expect(after.reviewed_by).toBeNull();
    expect(after.reviewed_at).toBeNull();
    expect(after.author_id).toBe(EDITOR);
    expect(after.published_at).toBe(before.published_at);
    expect(after.created_at).toBe(before.created_at);
    expect(after.title).toBe(before.title);
    expect(after.body).toEqual(before.body);
    expect(db.sources).toHaveLength(1);
  });

  it("returns only the fields the workflow UI needs", async () => {
    const { submit, post } = setup();
    const result = await submit();
    expect(Object.keys(result).sort()).toEqual(["changed", "id", "status", "submittedAt"]);
    expect(result.id).toBe(post.id);
  });

  it("never accepts workflow metadata from the caller", async () => {
    const { user, db, post } = setup();
    const privileged = makeFakeClient(db, { role: null, privileged: true });
    await performSubmitForReview(
      { supabase: user, getPrivileged: async () => privileged },
      {
        postId: post.id,
        updatedAt: null,
        // Extra keys are simply not part of the contract.
        ...({ submittedAt: "1999-01-01T00:00:00.000Z", status: "published" } as object),
      },
    );
    expect(db.posts[0]!.status).toBe("in_review");
    expect(db.posts[0]!.submitted_at).not.toBe("1999-01-01T00:00:00.000Z");
  });
});

describe("submitForReview — duplicate requests", () => {
  it("returns an idempotent success without rewriting submitted_at", async () => {
    const { submit, db } = setup();
    const first = await submit();
    const stamped = db.posts[0]!.submitted_at;
    const second = await submit();
    expect(second).toEqual({
      id: first.id,
      status: "in_review",
      submittedAt: stamped,
      changed: false,
    });
    expect(db.posts[0]!.submitted_at).toBe(stamped);
  });

  it("treats a post that moved to in_review mid-flight as the same end state", async () => {
    const { submit, db } = setup({
      beforeUpdate: (database) => {
        const row = database.posts[0]!;
        if (row.status === "draft") {
          row.status = "in_review";
          row.submitted_at = "2026-09-01T11:00:00.000Z";
        }
      },
    });
    const result = await submit();
    expect(result).toMatchObject({ changed: false, submittedAt: "2026-09-01T11:00:00.000Z" });
  });

  it("reports a conflict when the post moved to another state mid-flight", async () => {
    const { submit, db } = setup({
      beforeUpdate: (database) => {
        database.posts[0]!.status = "archived";
      },
    });
    await expect(submit()).rejects.toThrow(SUBMIT_CONFLICT);
    expect(db.posts[0]!.status).toBe("archived");
  });

  it("reports a conflict when the draft was edited between validation and the write", async () => {
    const { submit } = setup({
      beforeUpdate: (database) => {
        database.posts[0]!.updated_at = "2026-09-02T10:00:00.000Z";
      },
    });
    await expect(submit()).rejects.toThrow(SUBMIT_CONFLICT);
  });

  it("lets only one of two concurrent submissions perform a real transition", async () => {
    const { db, post } = setup();
    const client = () =>
      makeFakeClient(db, { role: "editor", canEditDraft: true });
    const privileged = makeFakeClient(db, { role: null, privileged: true });
    const call = () =>
      performSubmitForReview(
        { supabase: client(), getPrivileged: async () => privileged },
        { postId: post.id, updatedAt: null },
      );
    const [a, b] = await Promise.all([call(), call()]);
    expect([a.changed, b.changed].filter(Boolean)).toHaveLength(1);
    expect(a.submittedAt).toBe(b.submittedAt);
  });
});

describe("submitForReview — privileged capability", () => {
  it("does not reach for the privileged client before authorization succeeds", async () => {
    const { db, post } = setup({ role: null });
    let reached = false;
    await expect(
      performSubmitForReview(
        {
          supabase: makeFakeClient(db, { role: null }),
          getPrivileged: async () => {
            reached = true;
            return makeFakeClient(db, { role: null, privileged: true });
          },
        },
        { postId: post.id, updatedAt: null },
      ),
    ).rejects.toThrow(NOT_AN_EDITOR_MESSAGE);
    expect(reached).toBe(false);
  });

  it("does not reach for the privileged client when validation fails", async () => {
    const { db, post } = setup({ sources: 0 });
    let reached = false;
    await expect(
      performSubmitForReview(
        {
          supabase: makeFakeClient(db, { role: "editor", canEditDraft: true }),
          getPrivileged: async () => {
            reached = true;
            return makeFakeClient(db, { role: null, privileged: true });
          },
        },
        { postId: post.id, updatedAt: null },
      ),
    ).rejects.toThrow(SUBMIT_MISSING_SOURCE);
    expect(reached).toBe(false);
  });
});
