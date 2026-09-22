/**
 * Focused tests for the published -> archived transition (the CMS "Unpublish"
 * action). The boundary tests read the source, so an accidental removal of the
 * auth middleware — or privileged capability taken before authorization — fails
 * here rather than in production.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  ARCHIVE_NOT_FOUND,
  ARCHIVE_WRONG_STATUS,
  parseArchiveInput,
  performArchivePost,
} from "./review.functions";
import { FORBIDDEN_ROLE_MESSAGE, NOT_AN_EDITOR_MESSAGE } from "@/lib/admin-roles";
import { makeFakeClient, makePost, type FakeDb, type FakePost } from "./review-fake-supabase";

const source = readFileSync(join(process.cwd(), "src/lib/aurum/review.functions.ts"), "utf8");
const declarationAt = source.indexOf("export const archivePost");
const declaration = source.slice(declarationAt);

const REVIEWER = "33333333-3333-4333-8333-333333333333";
const AUTHOR = "22222222-2222-4222-8222-222222222222";
const PAST = "2026-05-01T08:00:00.000Z";
const FUTURE = "2027-01-01T08:00:00.000Z";

function published(overrides: Partial<FakePost> = {}): FakePost {
  return makePost({
    status: "published",
    published_at: PAST,
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

describe("archivePost — boundary", () => {
  it("is a POST server function", () => {
    expect(source).toMatch(/export const archivePost = createServerFn\(\{\s*method:\s*"POST"\s*\}\)/);
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
    const implementation = source.slice(
      source.indexOf("export async function performArchivePost"),
      declarationAt,
    );
    expect(implementation).not.toMatch(/allow_self_approval|aurum_cms_settings/);
  });

  it("does not run publication validation", () => {
    const implementation = source.slice(
      source.indexOf("export async function performArchivePost"),
      declarationAt,
    );
    expect(implementation).not.toMatch(/validatePersistedPost|aurum_post_sources/);
  });

  it("accepts a reviewer", async () => {
    const post = published();
    const { deps, db } = setup(post, "reviewer");
    const result = await performArchivePost(deps, { postId: post.id });
    expect(result).toEqual({ id: post.id, status: "archived", changed: true });
    expect(db.posts[0]!.status).toBe("archived");
  });

  it("accepts an admin", async () => {
    const post = published();
    const { deps } = setup(post, "admin");
    await expect(performArchivePost(deps, { postId: post.id })).resolves.toMatchObject({
      status: "archived",
    });
  });

  it("rejects an editor before any privileged capability is obtained", async () => {
    const post = published();
    const { deps, db, requests } = setup(post, "editor");
    await expect(performArchivePost(deps, { postId: post.id })).rejects.toThrow(
      FORBIDDEN_ROLE_MESSAGE,
    );
    expect(requests()).toBe(0);
    expect(db.posts[0]!.status).toBe("published");
  });

  it("rejects someone with no editor row", async () => {
    const post = published();
    const { deps, requests } = setup(post, null);
    await expect(performArchivePost(deps, { postId: post.id })).rejects.toThrow(
      NOT_AN_EDITOR_MESSAGE,
    );
    expect(requests()).toBe(0);
  });

  it("rejects an unrecognised role value", async () => {
    const post = published();
    const { deps } = setup(post, "superuser");
    await expect(performArchivePost(deps, { postId: post.id })).rejects.toThrow(
      NOT_AN_EDITOR_MESSAGE,
    );
  });

  it("resolves the role through the caller's own client, never from input", async () => {
    const post = published();
    const { deps, user } = setup(post, "reviewer");
    await performArchivePost(deps, { postId: post.id });
    expect(user.calls.map((c) => c.name)).toEqual(["aurum_link_current_editor"]);
  });
});

describe("archivePost — input contract", () => {
  it("accepts a bare post id", () => {
    expect(parseArchiveInput({ postId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" })).toEqual({
      postId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    });
  });

  it("rejects a non-uuid id", () => {
    expect(() => parseArchiveInput({ postId: "42" })).toThrow();
  });

  it("rejects a missing id", () => {
    expect(() => parseArchiveInput({})).toThrow();
    expect(() => parseArchiveInput(undefined)).toThrow();
  });

  it.each([
    ["status", "archived"],
    ["reviewerId", REVIEWER],
    ["authorId", AUTHOR],
    ["archivedAt", PAST],
    ["publishedAt", PAST],
    ["reason", "legal request"],
    ["role", "admin"],
    ["allowSelfApproval", true],
  ])("refuses a caller-supplied %s", (key, value) => {
    expect(() =>
      parseArchiveInput({ postId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", [key]: value }),
    ).toThrow();
  });
});

describe("archivePost — the transition", () => {
  it("unpublishes a live post", async () => {
    const post = published();
    const { deps, db } = setup(post, "reviewer");
    await performArchivePost(deps, { postId: post.id });
    expect(db.posts[0]!.status).toBe("archived");
  });

  it("cancels a scheduled publication, which is a published row with a future date", async () => {
    const post = published({ published_at: FUTURE });
    const { deps, db } = setup(post, "reviewer");
    await expect(performArchivePost(deps, { postId: post.id })).resolves.toMatchObject({
      status: "archived",
      changed: true,
    });
    expect(db.posts[0]!.published_at).toBe(FUTURE);
  });

  it("preserves publication and review provenance exactly", async () => {
    const post = published();
    const { deps, db } = setup(post, "reviewer");
    await performArchivePost(deps, { postId: post.id });
    expect(db.posts[0]).toMatchObject({
      published_at: PAST,
      reviewed_by: REVIEWER,
      reviewed_at: "2026-04-30T10:00:00.000Z",
      submitted_at: "2026-04-30T09:00:00.000Z",
      author_id: AUTHOR,
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      type: post.type,
      read_minutes: post.read_minutes,
      created_at: post.created_at,
    });
    expect(db.posts[0]!.body).toEqual(post.body);
  });

  it("writes status and nothing else", () => {
    const implementation = source.slice(
      source.indexOf("export async function performArchivePost"),
      declarationAt,
    );
    const patch = /\.update\(\{([^}]*)\}\)/.exec(implementation)?.[1] ?? "";
    expect(patch.replace(/\s/g, "")).toBe('status:"archived",');
  });

  it("leaves the source rows untouched", async () => {
    const post = published();
    const { deps, db } = setup(post, "reviewer");
    await performArchivePost(deps, { postId: post.id });
    expect(db.sources).toEqual([{ id: "s1", post_id: post.id }]);
  });

  it("archives content a future source policy might reject", async () => {
    const post = published({ body: [], summary: "" });
    const db: FakeDb = { posts: [post], sources: [] };
    const deps = {
      supabase: makeFakeClient(db, { role: "reviewer" }),
      getPrivileged: async () => makeFakeClient(db, { role: "reviewer", privileged: true }),
    };
    await expect(performArchivePost(deps, { postId: post.id })).resolves.toMatchObject({
      changed: true,
    });
  });

  it("reads no post, source or settings row before writing", async () => {
    const post = published();
    const db: FakeDb = { posts: [post], sources: [] };
    const user = makeFakeClient(db, { role: "reviewer" });
    const guarded = {
      ...user,
      from() {
        throw new Error("archivePost must not read tables with the caller's client");
      },
    };
    const privileged = makeFakeClient(db, { role: "reviewer", privileged: true });
    await performArchivePost(
      { supabase: guarded, getPrivileged: async () => privileged },
      { postId: post.id },
    );
    expect(db.posts[0]!.status).toBe("archived");
  });

  it("returns only id, status and changed", async () => {
    const post = published();
    const { deps } = setup(post, "reviewer");
    const result = await performArchivePost(deps, { postId: post.id });
    expect(Object.keys(result).sort()).toEqual(["changed", "id", "status"]);
  });
});

describe("archivePost — rejected starting states", () => {
  it.each([["draft"], ["in_review"], ["archived"]])("refuses a %s post", async (status) => {
    const post = published({ status });
    const { deps, db } = setup(post, "reviewer");
    await expect(performArchivePost(deps, { postId: post.id })).rejects.toThrow(
      ARCHIVE_WRONG_STATUS,
    );
    expect(db.posts[0]!.status).toBe(status);
  });

  it("does not rewrite anything for an already archived post", async () => {
    const post = published({ status: "archived" });
    const { deps, db } = setup(post, "reviewer");
    const snapshot = { ...post };
    await expect(performArchivePost(deps, { postId: post.id })).rejects.toThrow(
      ARCHIVE_WRONG_STATUS,
    );
    expect(db.posts[0]).toEqual(snapshot);
  });

  it("reports a missing post as not found", async () => {
    const post = published();
    const { deps } = setup(post, "reviewer");
    await expect(
      performArchivePost(deps, { postId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" }),
    ).rejects.toThrow(ARCHIVE_NOT_FOUND);
  });
});

describe("archivePost — concurrency", () => {
  it("lets only the first of two simultaneous archives transition the post", async () => {
    const post = published();
    const db: FakeDb = { posts: [post], sources: [] };
    const client = () => ({
      supabase: makeFakeClient(db, { role: "reviewer" }),
      getPrivileged: async () => makeFakeClient(db, { role: "reviewer", privileged: true }),
    });
    const first = await performArchivePost(client(), { postId: post.id });
    expect(first.changed).toBe(true);
    const snapshot = { ...db.posts[0]! };
    await expect(performArchivePost(client(), { postId: post.id })).rejects.toThrow(
      ARCHIVE_WRONG_STATUS,
    );
    // The loser rewrites no provenance.
    expect(db.posts[0]).toEqual(snapshot);
  });

  it("loses to another archive that commits between authorization and the write", async () => {
    const post = published();
    const db: FakeDb = {
      posts: [post],
      sources: [],
      beforeUpdate: (state) => {
        state.posts[0]!.status = "archived";
      },
    };
    const deps = {
      supabase: makeFakeClient(db, { role: "reviewer" }),
      getPrivileged: async () => makeFakeClient(db, { role: "reviewer", privileged: true }),
    };
    await expect(performArchivePost(deps, { postId: post.id })).rejects.toThrow(
      ARCHIVE_WRONG_STATUS,
    );
    expect(db.posts[0]).toMatchObject({ published_at: PAST, reviewed_by: REVIEWER });
  });
});
