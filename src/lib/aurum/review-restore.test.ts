/**
 * Focused tests for the archived -> draft transition (restore).
 *
 * Restore is never republication, and it must not depend on the content being
 * publishable: an archived post is often archived precisely because it needs
 * repair. The boundary tests read the source so an accidental removal of the
 * auth middleware fails here.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  RESTORE_NOT_FOUND,
  RESTORE_WRONG_STATUS,
  parseRestoreInput,
  performRestoreToDraft,
} from "./review.functions";
import { FORBIDDEN_ROLE_MESSAGE, NOT_AN_EDITOR_MESSAGE } from "@/lib/admin-roles";
import { makeFakeClient, makePost, type FakeDb, type FakePost } from "./review-fake-supabase";

const source = readFileSync(join(process.cwd(), "src/lib/aurum/review.functions.ts"), "utf8");
const implementationAt = source.indexOf("export async function performRestoreToDraft");
const declarationAt = source.indexOf("export const restoreToDraft");
const declaration = source.slice(declarationAt);
const implementation = source.slice(implementationAt, declarationAt);

const REVIEWER = "33333333-3333-4333-8333-333333333333";
const AUTHOR = "22222222-2222-4222-8222-222222222222";
const PUBLISHED_AT = "2026-05-01T08:00:00.000Z";

function archived(overrides: Partial<FakePost> = {}): FakePost {
  return makePost({
    status: "archived",
    published_at: PUBLISHED_AT,
    submitted_at: "2026-04-30T09:00:00.000Z",
    reviewed_by: REVIEWER,
    reviewed_at: "2026-04-30T10:00:00.000Z",
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
  return { db, user, deps, requests: () => privilegedRequests };
}

describe("restoreToDraft — boundary", () => {
  it("is a POST server function", () => {
    expect(source).toMatch(
      /export const restoreToDraft = createServerFn\(\{\s*method:\s*"POST"\s*\}\)/,
    );
  });

  it("is protected by requireSupabaseAuth", () => {
    expect(declaration).toMatch(/\.middleware\(\[requireSupabaseAuth\]\)/);
  });

  it("obtains privileged capability only inside the handler", () => {
    expect(source).not.toMatch(/^import[^\n]*client\.server/m);
    expect(declaration).toMatch(/await import\("@\/integrations\/supabase\/client\.server"\)/);
  });

  it("does not consult the self-approval setting", () => {
    expect(implementation).not.toMatch(/allow_self_approval|aurum_cms_settings/);
    expect(declaration).not.toMatch(/allow_self_approval/);
  });

  it("runs no content or source validation", () => {
    expect(implementation).not.toMatch(
      /parseDraftInput|validatePersistedPost|aurum_post_sources|aurum_publish_post/,
    );
  });

  it("accepts a reviewer", async () => {
    const post = archived();
    const { deps, db } = setup(post, "reviewer");
    const result = await performRestoreToDraft(deps, { postId: post.id });
    expect(result).toEqual({ id: post.id, status: "draft", changed: true });
    expect(db.posts[0]!.status).toBe("draft");
  });

  it("accepts an admin", async () => {
    const post = archived();
    const { deps } = setup(post, "admin");
    await expect(performRestoreToDraft(deps, { postId: post.id })).resolves.toMatchObject({
      status: "draft",
    });
  });

  it("rejects an editor before any privileged capability is obtained", async () => {
    const post = archived();
    const { deps, db, requests } = setup(post, "editor");
    await expect(performRestoreToDraft(deps, { postId: post.id })).rejects.toThrow(
      FORBIDDEN_ROLE_MESSAGE,
    );
    expect(requests()).toBe(0);
    expect(db.posts[0]!.status).toBe("archived");
  });

  it("rejects someone with no editor row", async () => {
    const post = archived();
    const { deps, requests } = setup(post, null);
    await expect(performRestoreToDraft(deps, { postId: post.id })).rejects.toThrow(
      NOT_AN_EDITOR_MESSAGE,
    );
    expect(requests()).toBe(0);
  });

  it("rejects an unrecognised role value", async () => {
    const post = archived();
    const { deps } = setup(post, "superuser");
    await expect(performRestoreToDraft(deps, { postId: post.id })).rejects.toThrow(
      NOT_AN_EDITOR_MESSAGE,
    );
  });

  it("resolves the role through the caller's own client, never from input", async () => {
    const post = archived();
    const { deps, user } = setup(post, "reviewer");
    await performRestoreToDraft(deps, { postId: post.id });
    expect(user.calls.map((c) => c.name)).toEqual(["aurum_link_current_editor"]);
  });
});

describe("restoreToDraft — input contract", () => {
  it("accepts a bare post id", () => {
    expect(parseRestoreInput({ postId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" })).toEqual({
      postId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    });
  });

  it("rejects a non-uuid id", () => {
    expect(() => parseRestoreInput({ postId: "42" })).toThrow();
  });

  it("rejects a missing id", () => {
    expect(() => parseRestoreInput({})).toThrow();
    expect(() => parseRestoreInput(undefined)).toThrow();
  });

  it.each([
    ["status", "published"],
    ["restoreTo", "published"],
    ["publishedAt", PUBLISHED_AT],
    ["submittedAt", PUBLISHED_AT],
    ["reviewerId", REVIEWER],
    ["authorId", AUTHOR],
    ["role", "admin"],
    ["reason", "legal cleared"],
    ["selfApproval", true],
  ])("refuses a caller-supplied %s", (key, value) => {
    expect(() =>
      parseRestoreInput({ postId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", [key]: value }),
    ).toThrow();
  });
});

describe("restoreToDraft — the transition", () => {
  it("clears published_at, submitted_at, reviewed_by and reviewed_at", async () => {
    const post = archived();
    const { deps, db } = setup(post, "reviewer");
    await performRestoreToDraft(deps, { postId: post.id });
    expect(db.posts[0]).toMatchObject({
      status: "draft",
      published_at: null,
      submitted_at: null,
      reviewed_by: null,
      reviewed_at: null,
    });
  });

  it("writes exactly those five columns", () => {
    const patch = /\.update\(\{([\s\S]*?)\}\)/.exec(implementation)?.[1] ?? "";
    const keys = [...patch.matchAll(/(\w+):/g)].map((m) => m[1]).sort();
    expect(keys).toEqual([
      "published_at",
      "reviewed_at",
      "reviewed_by",
      "status",
      "submitted_at",
    ]);
  });

  it("preserves the author, the content and the creation time", async () => {
    const post = archived();
    const { deps, db } = setup(post, "reviewer");
    await performRestoreToDraft(deps, { postId: post.id });
    expect(db.posts[0]).toMatchObject({
      author_id: AUTHOR,
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      type: post.type,
      read_minutes: post.read_minutes,
      pull_quote: post.pull_quote,
      review_line: post.review_line,
      created_at: post.created_at,
    });
    expect(db.posts[0]!.body).toEqual(post.body);
  });

  it("preserves the source rows", async () => {
    const post = archived();
    const { deps, db } = setup(post, "reviewer");
    await performRestoreToDraft(deps, { postId: post.id });
    expect(db.sources).toEqual([{ id: "s1", post_id: post.id }]);
  });

  it("restores content that would fail submission validation", async () => {
    const post = archived({ body: [], summary: "", title: "" });
    const db: FakeDb = { posts: [post], sources: [] };
    const deps = {
      supabase: makeFakeClient(db, { role: "reviewer" }),
      getPrivileged: async () => makeFakeClient(db, { role: "reviewer", privileged: true }),
    };
    await expect(performRestoreToDraft(deps, { postId: post.id })).resolves.toMatchObject({
      changed: true,
    });
  });

  it("reads no post, source or settings row before writing", async () => {
    const post = archived();
    const db: FakeDb = { posts: [post], sources: [] };
    const user = makeFakeClient(db, { role: "reviewer" });
    const guarded = {
      ...user,
      from() {
        throw new Error("restoreToDraft must not read tables with the caller's client");
      },
    };
    const privileged = makeFakeClient(db, { role: "reviewer", privileged: true });
    await performRestoreToDraft(
      { supabase: guarded, getPrivileged: async () => privileged },
      { postId: post.id },
    );
    expect(db.posts[0]!.status).toBe("draft");
  });

  it("returns only id, status and changed, never historical provenance", async () => {
    const post = archived();
    const { deps } = setup(post, "reviewer");
    const result = await performRestoreToDraft(deps, { postId: post.id });
    expect(Object.keys(result).sort()).toEqual(["changed", "id", "status"]);
    expect(result.status).toBe("draft");
  });
});

describe("restoreToDraft — rejected starting states", () => {
  it.each([["draft"], ["in_review"], ["published"]])("refuses a %s post", async (status) => {
    const post = archived({ status });
    const { deps, db } = setup(post, "reviewer");
    await expect(performRestoreToDraft(deps, { postId: post.id })).rejects.toThrow(
      RESTORE_WRONG_STATUS,
    );
    expect(db.posts[0]!.status).toBe(status);
  });

  it("refuses a scheduled post, which is a published row with a future date", async () => {
    const post = archived({ status: "published", published_at: "2027-01-01T08:00:00.000Z" });
    const { deps, db } = setup(post, "reviewer");
    await expect(performRestoreToDraft(deps, { postId: post.id })).rejects.toThrow(
      RESTORE_WRONG_STATUS,
    );
    expect(db.posts[0]!.published_at).toBe("2027-01-01T08:00:00.000Z");
  });

  it("rewrites nothing when the post is already a draft", async () => {
    const post = archived({ status: "draft" });
    const { deps, db } = setup(post, "reviewer");
    const snapshot = { ...post };
    await expect(performRestoreToDraft(deps, { postId: post.id })).rejects.toThrow(
      RESTORE_WRONG_STATUS,
    );
    expect(db.posts[0]).toEqual(snapshot);
  });

  it("reports a missing post as not found", async () => {
    const post = archived();
    const { deps } = setup(post, "reviewer");
    await expect(
      performRestoreToDraft(deps, { postId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" }),
    ).rejects.toThrow(RESTORE_NOT_FOUND);
  });
});

describe("restoreToDraft — concurrency", () => {
  it("lets only the first of two simultaneous restores transition the post", async () => {
    const post = archived();
    const db: FakeDb = { posts: [post], sources: [] };
    const client = () => ({
      supabase: makeFakeClient(db, { role: "reviewer" }),
      getPrivileged: async () => makeFakeClient(db, { role: "reviewer", privileged: true }),
    });
    const first = await performRestoreToDraft(client(), { postId: post.id });
    expect(first.changed).toBe(true);
    const snapshot = { ...db.posts[0]! };
    await expect(performRestoreToDraft(client(), { postId: post.id })).rejects.toThrow(
      RESTORE_WRONG_STATUS,
    );
    expect(db.posts[0]).toEqual(snapshot);
  });

  it("loses to a restore that commits between authorization and the write", async () => {
    const post = archived();
    const db: FakeDb = {
      posts: [post],
      sources: [],
      beforeUpdate: (state) => {
        state.posts[0]!.status = "draft";
        state.posts[0]!.published_at = null;
      },
    };
    const deps = {
      supabase: makeFakeClient(db, { role: "reviewer" }),
      getPrivileged: async () => makeFakeClient(db, { role: "reviewer", privileged: true }),
    };
    await expect(performRestoreToDraft(deps, { postId: post.id })).rejects.toThrow(
      RESTORE_WRONG_STATUS,
    );
    expect(db.posts[0]).toMatchObject({ status: "draft", published_at: null });
  });
});
