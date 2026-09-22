/**
 * Focused tests for the in_review -> draft transition.
 *
 * The boundary tests read the source so an accidental removal of the auth
 * middleware, or a privileged import hoisted above authorization, fails here.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  RETURN_NOT_FOUND,
  RETURN_WRONG_STATUS,
  parseReturnInput,
  performReturnToDraft,
} from "./review.functions";
import { FORBIDDEN_ROLE_MESSAGE, NOT_AN_EDITOR_MESSAGE } from "@/lib/admin-roles";
import { makeFakeClient, makePost, type FakeDb, type FakePost } from "./review-fake-supabase";

const source = readFileSync(join(process.cwd(), "src/lib/aurum/review.functions.ts"), "utf8");
const declaration = source.slice(source.indexOf("export const returnToDraft"));

const REVIEWER = "33333333-3333-4333-8333-333333333333";
const AUTHOR = "22222222-2222-4222-8222-222222222222";

function inReview(overrides: Partial<FakePost> = {}): FakePost {
  return makePost({
    status: "in_review",
    submitted_at: "2026-09-02T09:00:00.000Z",
    reviewed_by: null,
    reviewed_at: null,
    author_id: AUTHOR,
    ...overrides,
  });
}

function setup(post: FakePost, role: unknown) {
  const db: FakeDb = { posts: [post], sources: [{ id: "s1", post_id: post.id }] };
  const user = makeFakeClient(db, { role });
  let privilegedRequests = 0;
  const privileged = makeFakeClient(db, { role, privileged: true });
  const deps = {
    supabase: user,
    getPrivileged: async () => {
      privilegedRequests += 1;
      return privileged;
    },
  };
  return { db, deps, user, privileged, requests: () => privilegedRequests };
}

describe("returnToDraft — authentication and role boundary", () => {
  it("is a POST server function", () => {
    expect(source).toMatch(/export const returnToDraft = createServerFn\(\{\s*method:\s*"POST"\s*\}\)/);
  });

  it("is protected by requireSupabaseAuth", () => {
    expect(declaration).toMatch(/\.middleware\(\[requireSupabaseAuth\]\)/);
  });

  it("obtains privileged capability only inside the handler", () => {
    expect(source).not.toMatch(/^import[^\n]*client\.server/m);
    expect(declaration).toMatch(/await import\("@\/integrations\/supabase\/client\.server"\)/);
  });

  it("does not consult the self-approval setting", () => {
    expect(declaration).not.toMatch(/allow_self_approval/);
  });

  it("accepts a reviewer", async () => {
    const post = inReview();
    const { deps, db } = setup(post, "reviewer");
    const result = await performReturnToDraft(deps, { postId: post.id });
    expect(result).toEqual({ id: post.id, status: "draft", changed: true });
    expect(db.posts[0]!.status).toBe("draft");
  });

  it("accepts an admin", async () => {
    const post = inReview();
    const { deps } = setup(post, "admin");
    await expect(performReturnToDraft(deps, { postId: post.id })).resolves.toMatchObject({
      status: "draft",
    });
  });

  it("rejects an editor before any privileged capability is obtained", async () => {
    const post = inReview();
    const { deps, db, requests } = setup(post, "editor");
    await expect(performReturnToDraft(deps, { postId: post.id })).rejects.toThrow(
      FORBIDDEN_ROLE_MESSAGE,
    );
    expect(requests()).toBe(0);
    expect(db.posts[0]!.status).toBe("in_review");
  });

  it("rejects someone with no editor row", async () => {
    const post = inReview();
    const { deps, requests } = setup(post, null);
    await expect(performReturnToDraft(deps, { postId: post.id })).rejects.toThrow(
      NOT_AN_EDITOR_MESSAGE,
    );
    expect(requests()).toBe(0);
  });

  it("rejects an unrecognised role value", async () => {
    const post = inReview();
    const { deps } = setup(post, "superuser");
    await expect(performReturnToDraft(deps, { postId: post.id })).rejects.toThrow(
      NOT_AN_EDITOR_MESSAGE,
    );
  });

  it("resolves the role through the caller's own client, never from input", async () => {
    const post = inReview();
    const { deps, user } = setup(post, "reviewer");
    await performReturnToDraft(deps, { postId: post.id } as { postId: string });
    expect(user.calls.map((c) => c.name)).toEqual(["aurum_link_current_editor"]);
  });
});

describe("returnToDraft — input contract", () => {
  it("accepts a bare post id", () => {
    expect(parseReturnInput({ postId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" })).toEqual({
      postId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    });
  });

  it("rejects a non-uuid id", () => {
    expect(() => parseReturnInput({ postId: "42" })).toThrow();
  });

  it("rejects a missing id", () => {
    expect(() => parseReturnInput({})).toThrow();
    expect(() => parseReturnInput(undefined)).toThrow();
  });

  it.each([
    ["reviewerId", REVIEWER],
    ["status", "draft"],
    ["authorId", AUTHOR],
    ["reviewedAt", "2026-09-02T09:00:00.000Z"],
    ["submittedAt", "2026-09-02T09:00:00.000Z"],
    ["role", "admin"],
    ["reason", "needs work"],
  ])("refuses a caller-supplied %s", (key, value) => {
    expect(() =>
      parseReturnInput({ postId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", [key]: value }),
    ).toThrow();
  });
});

describe("returnToDraft — the transition", () => {
  it("clears submitted_at, reviewed_by and reviewed_at", async () => {
    const post = inReview({
      submitted_at: "2026-09-02T09:00:00.000Z",
      reviewed_by: REVIEWER,
      reviewed_at: "2026-09-02T10:00:00.000Z",
    });
    const { deps, db } = setup(post, "reviewer");
    await performReturnToDraft(deps, { postId: post.id });
    expect(db.posts[0]).toMatchObject({
      status: "draft",
      submitted_at: null,
      reviewed_by: null,
      reviewed_at: null,
    });
  });

  it("preserves the author, the content and the publication date", async () => {
    const post = inReview({ published_at: "2026-05-01T08:00:00.000Z" });
    const { deps, db } = setup(post, "reviewer");
    await performReturnToDraft(deps, { postId: post.id });
    expect(db.posts[0]).toMatchObject({
      author_id: AUTHOR,
      published_at: "2026-05-01T08:00:00.000Z",
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      type: post.type,
      read_minutes: post.read_minutes,
      created_at: post.created_at,
    });
    expect(db.posts[0]!.body).toEqual(post.body);
  });

  it("preserves the source rows", async () => {
    const post = inReview();
    const { deps, db } = setup(post, "reviewer");
    await performReturnToDraft(deps, { postId: post.id });
    expect(db.sources).toEqual([{ id: "s1", post_id: post.id }]);
  });

  it("returns incomplete content without validating it", async () => {
    const post = inReview({ body: [], summary: "", title: "" });
    const db: FakeDb = { posts: [post], sources: [] };
    const deps = {
      supabase: makeFakeClient(db, { role: "reviewer" }),
      getPrivileged: async () => makeFakeClient(db, { role: "reviewer", privileged: true }),
    };
    await expect(performReturnToDraft(deps, { postId: post.id })).resolves.toMatchObject({
      changed: true,
    });
  });

  it("reads no post, source or settings row before writing", async () => {
    const post = inReview();
    const db: FakeDb = { posts: [post], sources: [] };
    const user = makeFakeClient(db, { role: "reviewer" });
    // The user-scoped client must never touch a table in this transition.
    const guarded = {
      ...user,
      from() {
        throw new Error("returnToDraft must not read tables with the caller's client");
      },
    };
    const privileged = makeFakeClient(db, { role: "reviewer", privileged: true });
    await performReturnToDraft(
      { supabase: guarded, getPrivileged: async () => privileged },
      { postId: post.id },
    );
    expect(db.posts[0]!.status).toBe("draft");
  });

  it("returns only id, status and changed", async () => {
    const post = inReview();
    const { deps } = setup(post, "reviewer");
    const result = await performReturnToDraft(deps, { postId: post.id });
    expect(Object.keys(result).sort()).toEqual(["changed", "id", "status"]);
  });
});

describe("returnToDraft — rejected starting states", () => {
  it.each([["published"], ["archived"]])("refuses a %s post", async (status) => {
    const post = inReview({ status, published_at: "2026-05-01T08:00:00.000Z" });
    const { deps, db } = setup(post, "reviewer");
    await expect(performReturnToDraft(deps, { postId: post.id })).rejects.toThrow(
      RETURN_WRONG_STATUS,
    );
    expect(db.posts[0]!.status).toBe(status);
  });

  it("refuses a scheduled post, which is a published row with a future date", async () => {
    const post = inReview({ status: "published", published_at: "2027-01-01T08:00:00.000Z" });
    const { deps, db } = setup(post, "reviewer");
    await expect(performReturnToDraft(deps, { postId: post.id })).rejects.toThrow(
      RETURN_WRONG_STATUS,
    );
    expect(db.posts[0]!.published_at).toBe("2027-01-01T08:00:00.000Z");
  });

  it("refuses a draft rather than reporting a false idempotent success", async () => {
    const post = inReview({ status: "draft", submitted_at: null });
    const { deps } = setup(post, "reviewer");
    await expect(performReturnToDraft(deps, { postId: post.id })).rejects.toThrow(
      RETURN_WRONG_STATUS,
    );
  });

  it("reports a missing post as not found", async () => {
    const post = inReview();
    const { deps } = setup(post, "reviewer");
    await expect(
      performReturnToDraft(deps, { postId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" }),
    ).rejects.toThrow(RETURN_NOT_FOUND);
  });
});

describe("returnToDraft — concurrency", () => {
  it("loses to a publication that commits first, leaving the post published", async () => {
    const post = inReview();
    const db: FakeDb = {
      posts: [post],
      sources: [],
      // The publish RPC wins the race between authorization and this write.
      beforeUpdate: (state) => {
        state.posts[0]!.status = "published";
        state.posts[0]!.published_at = "2026-09-03T08:00:00.000Z";
        state.posts[0]!.reviewed_by = REVIEWER;
      },
    };
    const deps = {
      supabase: makeFakeClient(db, { role: "reviewer" }),
      getPrivileged: async () => makeFakeClient(db, { role: "reviewer", privileged: true }),
    };
    await expect(performReturnToDraft(deps, { postId: post.id })).rejects.toThrow(
      RETURN_WRONG_STATUS,
    );
    expect(db.posts[0]).toMatchObject({ status: "published", reviewed_by: REVIEWER });
  });

  it("lets only the first of two simultaneous returns transition the post", async () => {
    const post = inReview({ submitted_at: "2026-09-02T09:00:00.000Z" });
    const db: FakeDb = { posts: [post], sources: [] };
    const client = () => ({
      supabase: makeFakeClient(db, { role: "reviewer" }),
      getPrivileged: async () => makeFakeClient(db, { role: "reviewer", privileged: true }),
    });
    const first = await performReturnToDraft(client(), { postId: post.id });
    expect(first.changed).toBe(true);
    const snapshot = { ...db.posts[0]! };
    await expect(performReturnToDraft(client(), { postId: post.id })).rejects.toThrow(
      RETURN_WRONG_STATUS,
    );
    // The loser rewrites nothing.
    expect(db.posts[0]).toEqual(snapshot);
  });
});
