import { describe, expect, it, vi } from "vitest";

import {
  PUBLISH_BAD_TIME,
  PUBLISH_CONFLICT,
  PUBLISH_EMPTY_BODY,
  PUBLISH_FORBIDDEN_ROLE,
  PUBLISH_MISSING_SOURCE,
  PUBLISH_NOT_FOUND,
  PUBLISH_PAST_TIME,
  PUBLISH_SELF_APPROVAL,
  PUBLISH_SETTINGS_UNAVAILABLE,
  PUBLISH_UNAUTHENTICATED,
  PUBLISH_UNEXPECTED,
  PUBLISH_WRONG_STATUS,
  performPublishPost,
  translatePublishError,
} from "./review.functions";
import { FORBIDDEN_ROLE_MESSAGE, NOT_AN_EDITOR_MESSAGE } from "@/lib/admin-roles";

const POST_ID = "3f2504e0-4f89-41d3-9a0c-0305e82c3301";
const PUBLISHED_AT = "2026-10-01T09:00:00.000Z";

type Rpc = { name: string; args: unknown };

/**
 * Stands in for the caller's own user-scoped Supabase client. Any table access
 * fails the test: publication correctness must not rely on wrapper-side reads.
 */
function client(options: {
  role?: unknown;
  result?: unknown;
  error?: { code?: string; message?: string };
}) {
  const calls: Rpc[] = [];
  return {
    calls,
    from() {
      throw new Error("the publish wrapper must not read tables");
    },
    async rpc(name: string, args?: unknown) {
      calls.push({ name, args });
      if (name === "aurum_link_current_editor") {
        return { data: "role" in options ? options.role : "reviewer", error: null };
      }
      if (name === "aurum_publish_post") {
        if (options.error) return { data: null, error: options.error };
        return {
          data: options.result ?? {
            id: POST_ID,
            status: "published",
            published_at: PUBLISHED_AT,
            changed: true,
          },
          error: null,
        };
      }
      throw new Error(`unexpected rpc ${name}`);
    },
  };
}

function rpcCalls(caller: ReturnType<typeof client>): Rpc[] {
  return caller.calls.filter((call) => call.name === "aurum_publish_post");
}

describe("publishPost — boundary", () => {
  it("is a POST server function protected by requireSupabaseAuth", async () => {
    const { readFileSync } = await import("node:fs");
    const source = readFileSync("src/lib/aurum/review.functions.ts", "utf8");
    const declaration = source.slice(source.indexOf("export const publishPost"));
    expect(declaration).toMatch(/createServerFn\(\{\s*method:\s*"POST"\s*\}\)/);
    expect(declaration).toMatch(/\.middleware\(\[requireSupabaseAuth\]\)/);
    // The RPC must run as the human reviewer, never as service role.
    expect(declaration).not.toMatch(/client\.server|supabaseAdmin/);
    expect(declaration).toMatch(/context\.supabase/);
  });

  it("derives the role from the caller's context and refuses an editor before the RPC", async () => {
    const caller = client({ role: "editor" });
    await expect(
      performPublishPost(caller, { postId: POST_ID, publishedAt: null }),
    ).rejects.toThrow(FORBIDDEN_ROLE_MESSAGE);
    expect(rpcCalls(caller)).toHaveLength(0);
  });

  it("refuses someone with no editor row before the RPC", async () => {
    const caller = client({ role: null });
    await expect(
      performPublishPost(caller, { postId: POST_ID, publishedAt: null }),
    ).rejects.toThrow(NOT_AN_EDITOR_MESSAGE);
    expect(rpcCalls(caller)).toHaveLength(0);
  });

  it("lets a reviewer and an admin reach the RPC", async () => {
    for (const role of ["reviewer", "admin"]) {
      const caller = client({ role });
      await expect(
        performPublishPost(caller, { postId: POST_ID, publishedAt: null }),
      ).resolves.toMatchObject({ status: "published" });
      expect(rpcCalls(caller)).toHaveLength(1);
    }
  });
});

describe("publishPost — input contract", () => {
  // The server function's validator, exercised directly.
  async function parse(input: unknown) {
    const { readFileSync } = await import("node:fs");
    void readFileSync; // keep the import list honest for the linter
    const mod = await import("./review.functions");
    const fn = mod.publishPost as unknown as {
      options: { inputValidator: (value: unknown) => unknown };
    };
    return fn.options.inputValidator(input);
  }

  it("accepts a valid uuid and no timestamp as publish-now", async () => {
    await expect(parse({ postId: POST_ID })).resolves.toEqual({
      postId: POST_ID,
      publishedAt: null,
    });
  });

  it("accepts an explicit null timestamp as publish-now", async () => {
    await expect(parse({ postId: POST_ID, publishedAt: null })).resolves.toEqual({
      postId: POST_ID,
      publishedAt: null,
    });
  });

  it("rejects an invalid uuid", async () => {
    await expect(parse({ postId: "not-a-uuid" })).rejects.toThrow();
  });

  it("accepts a UTC timestamp", async () => {
    await expect(parse({ postId: POST_ID, publishedAt: PUBLISHED_AT })).resolves.toEqual({
      postId: POST_ID,
      publishedAt: PUBLISHED_AT,
    });
  });

  it("accepts a timestamp with an explicit offset and normalises it", async () => {
    await expect(
      parse({ postId: POST_ID, publishedAt: "2026-10-01T11:00:00+02:00" }),
    ).resolves.toEqual({ postId: POST_ID, publishedAt: PUBLISHED_AT });
  });

  it("rejects a timezone-less local datetime rather than guessing a zone", async () => {
    await expect(parse({ postId: POST_ID, publishedAt: "2026-10-01T09:00:00" })).rejects.toThrow();
    await expect(parse({ postId: POST_ID, publishedAt: "2026-10-01" })).rejects.toThrow();
  });

  it("rejects a malformed timestamp", async () => {
    await expect(parse({ postId: POST_ID, publishedAt: "tomorrow" })).rejects.toThrow();
    await expect(
      parse({ postId: POST_ID, publishedAt: "2026-13-45T99:00:00Z" }),
    ).rejects.toThrow();
  });

  it("refuses workflow metadata supplied by the caller", async () => {
    for (const extra of [
      { status: "published" },
      { reviewedBy: POST_ID },
      { reviewedAt: PUBLISHED_AT },
      { authorId: POST_ID },
      { role: "admin" },
      { allowSelfApproval: true },
      { changed: true },
    ]) {
      await expect(parse({ postId: POST_ID, ...extra })).rejects.toThrow();
    }
  });
});

describe("publishPost — RPC invocation", () => {
  it("makes exactly one publish call with null for publish-now", async () => {
    const caller = client({});
    await performPublishPost(caller, { postId: POST_ID, publishedAt: null });
    expect(rpcCalls(caller)).toEqual([
      { name: "aurum_publish_post", args: { _post_id: POST_ID, _published_at: null } },
    ]);
  });

  it("passes the exact accepted instant when scheduling", async () => {
    const caller = client({});
    await performPublishPost(caller, { postId: POST_ID, publishedAt: PUBLISHED_AT });
    expect(rpcCalls(caller)).toEqual([
      { name: "aurum_publish_post", args: { _post_id: POST_ID, _published_at: PUBLISHED_AT } },
    ]);
  });

  it("reads no post, source or settings row of its own", async () => {
    const caller = client({});
    await performPublishPost(caller, { postId: POST_ID, publishedAt: null });
    // `from()` throws if touched; only the role lookup and the RPC are allowed.
    expect(caller.calls.map((call) => call.name)).toEqual([
      "aurum_link_current_editor",
      "aurum_publish_post",
    ]);
  });
});

describe("publishPost — result handling", () => {
  it("returns a real transition", async () => {
    await expect(
      performPublishPost(client({}), { postId: POST_ID, publishedAt: null }),
    ).resolves.toEqual({
      id: POST_ID,
      status: "published",
      publishedAt: PUBLISHED_AT,
      changed: true,
    });
  });

  it("returns an idempotent same-reviewer repeat as success without a second call", async () => {
    const caller = client({
      result: { id: POST_ID, status: "published", published_at: PUBLISHED_AT, changed: false },
    });
    await expect(
      performPublishPost(caller, { postId: POST_ID, publishedAt: null }),
    ).resolves.toEqual({
      id: POST_ID,
      status: "published",
      publishedAt: PUBLISHED_AT,
      changed: false,
    });
    expect(rpcCalls(caller)).toHaveLength(1);
  });

  it("fails closed on an unexpected payload instead of trusting it", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    for (const result of [
      null,
      {},
      { id: POST_ID, status: "draft", published_at: PUBLISHED_AT, changed: true },
      { id: POST_ID, status: "published", changed: true },
      { id: "nope", status: "published", published_at: PUBLISHED_AT, changed: true },
      { id: POST_ID, status: "published", published_at: PUBLISHED_AT, changed: "yes" },
    ]) {
      await expect(
        performPublishPost(client({ result }), { postId: POST_ID, publishedAt: null }),
      ).rejects.toThrow(PUBLISH_UNEXPECTED);
    }
    spy.mockRestore();
  });
});

describe("publishPost — error mapping", () => {
  const cases: [string, string, string][] = [
    ["28000", "AURUM publish: not signed in", PUBLISH_UNAUTHENTICATED],
    [
      "42501",
      "AURUM publish: reviewer or admin permission is required",
      PUBLISH_FORBIDDEN_ROLE,
    ],
    [
      "42501",
      "AURUM publish: another reviewer must approve your own post",
      PUBLISH_SELF_APPROVAL,
    ],
    [
      "42501",
      "AURUM publish: approval settings are unavailable",
      PUBLISH_SETTINGS_UNAVAILABLE,
    ],
    ["P0002", "AURUM publish: post not found", PUBLISH_NOT_FOUND],
    [
      "40001",
      "AURUM publish: this post was already published or scheduled by another approval",
      PUBLISH_CONFLICT,
    ],
    ["55000", "AURUM publish: this post is no longer awaiting review", PUBLISH_WRONG_STATUS],
    ["23514", "AURUM publish: this post has no content to publish", PUBLISH_EMPTY_BODY],
    ["23514", "AURUM publish: add at least one source before publishing", PUBLISH_MISSING_SOURCE],
    [
      "22007",
      "AURUM publish: to publish immediately, leave the publication time empty",
      PUBLISH_PAST_TIME,
    ],
  ];

  it.each(cases)("maps %s to a stable message", (code, message, expected) => {
    expect(translatePublishError({ code, message }).message).toBe(expected);
  });

  it("surfaces mapped errors through the wrapper", async () => {
    const caller = client({ error: { code: "P0002", message: "AURUM publish: post not found" } });
    await expect(
      performPublishPost(caller, { postId: POST_ID, publishedAt: null }),
    ).rejects.toThrow(PUBLISH_NOT_FOUND);
  });

  it("fails closed on an unknown database error without leaking internals", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const raw = 'permission denied for relation "aurum_posts" at select secret from vault';
    const translated = translatePublishError({ code: "XX000", message: raw });
    expect(translated.message).toBe(PUBLISH_UNEXPECTED);
    expect(translated.message).not.toContain("vault");
    expect(translated.message).not.toContain("select");
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("does not collapse distinct 42501 meanings into one message", () => {
    expect(PUBLISH_SELF_APPROVAL).not.toBe(PUBLISH_FORBIDDEN_ROLE);
    expect(PUBLISH_BAD_TIME).not.toBe(PUBLISH_PAST_TIME);
  });
});
