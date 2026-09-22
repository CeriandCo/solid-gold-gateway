/**
 * Security and state-machine contract for public.aurum_publish_post.
 *
 * These run against the throwaway Postgres created by the vitest global setup
 * (never the live project: assertIsolatedDatabase refuses otherwise). psql is
 * used directly rather than PostgREST because the contract is defined in terms
 * of the database role and auth.uid(), which the local REST facade does not
 * model.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

import { beforeAll, describe, expect, it } from "vitest";

import { assertIsolatedDatabase } from "@/test/live-db-guard";

assertIsolatedDatabase();

const env = JSON.parse(readFileSync("/tmp/sqoot-test-db/env.json", "utf8")) as {
  pgPort: number;
};
const CONN = `postgres://postgres@127.0.0.1:${env.pgPort}/postgres?sslmode=disable`;

type SqlResult = { ok: true; out: string } | { ok: false; sqlstate: string; message: string };

function run(sql: string): SqlResult {
  try {
    const out = execFileSync(
      "psql",
      [CONN, "-At", "-q", "-v", "ON_ERROR_STOP=1", "-c", `\\set VERBOSITY verbose`, "-c", sql],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );

    return { ok: true, out: out.trim() };
  } catch (error) {
    const err = error as { stderr?: string };
    const stderr = err.stderr ?? "";
    const verbose = /ERROR:\s*([0-9A-Z]{5}):\s*(.*)/.exec(stderr);
    const sqlstate = verbose?.[1] ?? "";
    const message = verbose?.[2]?.trim() ?? /ERROR:\s*(.*)/.exec(stderr)?.[1]?.trim() ?? stderr.trim();
    return { ok: false, sqlstate, message };
  }
}

function sql(text: string): string {
  const result = run(text);
  if (!result.ok) throw new Error(`${result.sqlstate}: ${result.message}`);
  return result.out;
}

function lit(value: string | null): string {
  return value === null ? "null" : `'${value.replace(/'/g, "''")}'`;
}

/** Calls the RPC as a signed-in user with the given auth uid. */
function publish(uid: string | null, postId: string, publishedAt?: string | null): SqlResult {
  const at = publishedAt === undefined || publishedAt === null ? "null" : `${lit(publishedAt)}::timestamptz`;
  return run(
    [
      "begin",
      "set local role authenticated",
      `set local test.uid = ${lit(uid ?? "")}`,
      `select public.aurum_publish_post(${lit(postId)}::uuid, ${at})`,
      "commit",
    ].join("; "),
  );
}

function payload(result: SqlResult): { id: string; status: string; published_at: string; changed: boolean } {
  if (!result.ok) throw new Error(`expected success, got ${result.sqlstate}: ${result.message}`);
  const line = result.out.split("\n").filter(Boolean).pop() ?? "";
  return JSON.parse(line);
}

const REVIEWER = "11111111-1111-4111-8111-111111111111";
const REVIEWER_2 = "22222222-2222-4222-8222-222222222222";
const ADMIN = "33333333-3333-4333-8333-333333333333";
const EDITOR = "44444444-4444-4444-8444-444444444444";
const OUTSIDER = "55555555-5555-4555-8555-555555555555";

let seq = 0;

type PostOptions = {
  type?: "daily_note" | "weekly_brief" | "article";
  status?: "draft" | "in_review" | "published" | "archived";
  authorId?: string | null;
  withSource?: boolean;
  body?: string;
  publishedAt?: string | null;
  reviewedBy?: string | null;
};

function makePost(options: PostOptions = {}): string {
  const {
    type = "daily_note",
    status = "in_review",
    authorId = EDITOR,
    withSource = true,
    body = `'["A paragraph."]'::jsonb`,
    publishedAt = null,
    reviewedBy = null,
  } = options;
  seq += 1;
  const slug = `t2-publish-${seq}-${Date.now()}`;
  const id = sql(`
    insert into public.aurum_posts
      (type, slug, title, summary, body, status, author_id, submitted_at, published_at, reviewed_by)
    values (${lit(type)}, ${lit(slug)}, 'Title ${seq}', 'Summary ${seq}', ${body},
            ${lit(status)}, ${lit(authorId)}::uuid, now() - interval '1 hour',
            ${publishedAt === null ? "null" : `${lit(publishedAt)}::timestamptz`},
            ${lit(reviewedBy)}::uuid)
    returning id
  `);
  if (withSource) {
    sql(`
      insert into public.aurum_post_sources (post_id, position, publisher, title, source_date, url)
      values (${lit(id)}::uuid, 0, 'LBMA', 'Reference', current_date, 'https://example.com/a')
    `);
  }
  return id;
}

function setSelfApproval(allowed: boolean): void {
  sql(`update public.aurum_cms_settings set allow_self_approval = ${allowed} where id = true`);
}

beforeAll(() => {
  // auth.uid() in the throwaway stack is a stub; make it readable per session.
  sql(`
    create or replace function auth.uid() returns uuid language sql stable
    as $fn$ select nullif(current_setting('test.uid', true), '')::uuid $fn$
  `);
  // The live project grants table DML to `authenticated`; the schema dump used
  // by the throwaway stack strips privileges, and the deferred source trigger
  // runs at commit as the session role, so restore them here.
  sql(`
    grant select, insert, update, delete on all tables in schema public to authenticated;
    grant usage on schema auth to authenticated
  `);
  sql(`
    insert into auth.users (id, email) values
      (${lit(REVIEWER)}::uuid, 'reviewer@example.com'),
      (${lit(REVIEWER_2)}::uuid, 'reviewer2@example.com'),
      (${lit(ADMIN)}::uuid, 'admin@example.com'),
      (${lit(EDITOR)}::uuid, 'editor@example.com'),
      (${lit(OUTSIDER)}::uuid, 'outsider@example.com')
    on conflict (id) do nothing
  `);
  sql(`
    insert into public.aurum_editors (email, role, user_id) values
      ('reviewer@example.com', 'reviewer', ${lit(REVIEWER)}::uuid),
      ('reviewer2@example.com', 'reviewer', ${lit(REVIEWER_2)}::uuid),
      ('admin@example.com', 'admin', ${lit(ADMIN)}::uuid),
      ('editor@example.com', 'editor', ${lit(EDITOR)}::uuid)
    on conflict (email) do update set role = excluded.role, user_id = excluded.user_id

  `);
  sql(`insert into public.aurum_cms_settings (id) values (true) on conflict (id) do nothing`);
  setSelfApproval(true);
});

describe("aurum_publish_post — definition hardening", () => {
  it("is SECURITY DEFINER with a pinned search_path and no dynamic SQL", () => {
    const row = sql(`
      select p.prosecdef || '|' || array_to_string(p.proconfig, ',') || '|' ||
             (position('EXECUTE format' in p.prosrc) > 0 or position('execute format' in p.prosrc) > 0)
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.proname = 'aurum_publish_post'
    `);
    expect(row).toBe("true|search_path=public, auth|false");
  });

  it("keeps the deferred source trigger in place as defence in depth", () => {
    const row = sql(`
      select t.tgdeferrable || '|' || t.tginitdeferred
      from pg_trigger t
      where t.tgrelid = 'public.aurum_posts'::regclass and t.tgname = 'aurum_posts_require_source_trg'
    `);
    expect(row).toBe("true|true");
  });
});

describe("aurum_publish_post — authentication and authorization", () => {
  it("refuses an unauthenticated caller before touching the post", () => {
    const post = makePost();
    const result = publish(null, post);
    expect(result).toMatchObject({ ok: false, sqlstate: "28000" });
    expect(sql(`select status from public.aurum_posts where id = ${lit(post)}::uuid`)).toBe("in_review");
  });

  it("refuses an editor", () => {
    const result = publish(EDITOR, makePost({ authorId: null }));
    expect(result).toMatchObject({ ok: false, sqlstate: "42501" });
  });

  it("refuses a caller with no allowlist row", () => {
    const result = publish(OUTSIDER, makePost({ authorId: null }));
    expect(result).toMatchObject({ ok: false, sqlstate: "42501" });
  });

  it("lets a reviewer publish someone else's in_review post", () => {
    const result = payload(publish(REVIEWER, makePost()));
    expect(result).toMatchObject({ status: "published", changed: true });
  });

  it("lets an admin publish an eligible in_review post", () => {
    const result = payload(publish(ADMIN, makePost()));
    expect(result.changed).toBe(true);
  });

  it("reports a missing post as not found", () => {
    const result = publish(REVIEWER, "99999999-9999-4999-8999-999999999999");
    expect(result).toMatchObject({ ok: false, sqlstate: "P0002" });
  });
});

describe("aurum_publish_post — self-approval", () => {
  it("blocks a reviewer and an admin from publishing their own post when disabled", () => {
    setSelfApproval(false);
    try {
      expect(publish(REVIEWER, makePost({ authorId: REVIEWER }))).toMatchObject({
        ok: false,
        sqlstate: "42501",
      });
      expect(publish(ADMIN, makePost({ authorId: ADMIN }))).toMatchObject({
        ok: false,
        sqlstate: "42501",
      });
    } finally {
      setSelfApproval(true);
    }
  });

  it("treats a NULL author as nobody's own post even when disabled", () => {
    setSelfApproval(false);
    try {
      expect(payload(publish(REVIEWER, makePost({ authorId: null }))).changed).toBe(true);
    } finally {
      setSelfApproval(true);
    }
  });

  it("permits both roles to publish their own post when enabled", () => {
    expect(payload(publish(REVIEWER, makePost({ authorId: REVIEWER }))).changed).toBe(true);
    expect(payload(publish(ADMIN, makePost({ authorId: ADMIN }))).changed).toBe(true);
  });
});

describe("aurum_publish_post — content, sources and state", () => {
  it("rejects a daily note with no source", () => {
    expect(publish(REVIEWER, makePost({ withSource: false }))).toMatchObject({
      ok: false,
      sqlstate: "23514",
    });
  });

  it("rejects a weekly brief with no source", () => {
    expect(publish(REVIEWER, makePost({ type: "weekly_brief", withSource: false }))).toMatchObject({
      ok: false,
      sqlstate: "23514",
    });
  });

  it("keeps the existing article policy: no source requirement", () => {
    const result = payload(publish(REVIEWER, makePost({ type: "article", withSource: false })));
    expect(result.changed).toBe(true);
  });

  it("rejects an empty body array", () => {
    expect(publish(REVIEWER, makePost({ body: "'[]'::jsonb" }))).toMatchObject({
      ok: false,
      sqlstate: "23514",
    });
  });

  it("rejects a draft", () => {
    expect(publish(REVIEWER, makePost({ status: "draft" }))).toMatchObject({
      ok: false,
      sqlstate: "55000",
    });
  });

  it("rejects an archived post", () => {
    expect(publish(REVIEWER, makePost({ status: "archived" }))).toMatchObject({
      ok: false,
      sqlstate: "55000",
    });
  });
});

describe("aurum_publish_post — immediate publication", () => {
  it("writes the full workflow transition and preserves everything else", () => {
    const post = makePost();
    const before = sql(
      `select submitted_at::text || '|' || author_id::text from public.aurum_posts where id = ${lit(post)}::uuid`,
    );
    expect(payload(publish(REVIEWER, post))).toMatchObject({ status: "published", changed: true });

    const after = sql(`
      select status || '|' || (published_at <= now())::text || '|' || reviewed_by::text || '|' ||
             (reviewed_at is not null) || '|' || submitted_at::text || '|' || author_id::text
      from public.aurum_posts where id = ${lit(post)}::uuid
    `);
    expect(after).toBe(`published|true|${REVIEWER}|true|${before}`);
    expect(
      sql(`select count(*) from public.aurum_post_sources where post_id = ${lit(post)}::uuid`),
    ).toBe("1");
  });
});

describe("aurum_publish_post — scheduling", () => {
  it("stores a future instant exactly", () => {
    const at = sql(`select (now() + interval '2 days')::text`);
    const post = makePost();
    const result = payload(publish(REVIEWER, post, at));
    expect(result.changed).toBe(true);
    expect(
      sql(
        `select (published_at = ${lit(at)}::timestamptz)::text from public.aurum_posts where id = ${lit(post)}::uuid`,
      ),
    ).toBe("true");
  });


  it("rejects a publication time at or before database now", () => {
    const past = sql(`select (now() - interval '1 minute')::text`);
    expect(publish(REVIEWER, makePost(), past)).toMatchObject({ ok: false, sqlstate: "22007" });
  });
});

describe("aurum_publish_post — idempotency and conflicts", () => {
  it("returns changed:false for the same reviewer repeating publish now", () => {
    const post = makePost();
    const first = payload(publish(REVIEWER, post));
    const second = payload(publish(REVIEWER, post));
    expect(second).toMatchObject({ changed: false, published_at: first.published_at });
    expect(sql(`select reviewed_by::text from public.aurum_posts where id = ${lit(post)}::uuid`)).toBe(
      REVIEWER,
    );
  });

  it("returns changed:false for the same reviewer repeating an identical schedule", () => {
    const post = makePost();
    const at = sql(`select (now() + interval '3 days')::text`);
    payload(publish(REVIEWER, post, at));
    expect(payload(publish(REVIEWER, post, at)).changed).toBe(false);
  });

  it("conflicts when a different reviewer arrives after publication", () => {
    const post = makePost();
    payload(publish(REVIEWER, post));
    expect(publish(REVIEWER_2, post)).toMatchObject({ ok: false, sqlstate: "40001" });
    expect(sql(`select reviewed_by::text from public.aurum_posts where id = ${lit(post)}::uuid`)).toBe(
      REVIEWER,
    );
  });

  it("conflicts when a different reviewer arrives after scheduling", () => {
    const post = makePost();
    const at = sql(`select (now() + interval '1 day')::text`);
    payload(publish(REVIEWER, post, at));
    expect(publish(REVIEWER_2, post, at)).toMatchObject({ ok: false, sqlstate: "40001" });
  });

  it("conflicts when the same reviewer asks for a different schedule", () => {
    const post = makePost();
    payload(publish(REVIEWER, post, sql(`select (now() + interval '1 day')::text`)));
    expect(publish(REVIEWER, post, sql(`select (now() + interval '2 days')::text`))).toMatchObject({
      ok: false,
      sqlstate: "40001",
    });
  });

  it("conflicts on publish-now against an already scheduled post", () => {
    const post = makePost();
    payload(publish(REVIEWER, post, sql(`select (now() + interval '1 day')::text`)));
    expect(publish(REVIEWER, post)).toMatchObject({ ok: false, sqlstate: "40001" });
  });

  it("conflicts on scheduling against an already published post", () => {
    const post = makePost();
    payload(publish(REVIEWER, post));
    expect(publish(REVIEWER, post, sql(`select (now() + interval '1 day')::text`))).toMatchObject({
      ok: false,
      sqlstate: "40001",
    });
  });
});

describe("aurum_publish_post — concurrency", () => {
  it("lets exactly one of two simultaneous different reviewers win", async () => {
    const post = makePost();
    const [a, b] = await Promise.all([
      Promise.resolve().then(() => publish(REVIEWER, post)),
      Promise.resolve().then(() => publish(REVIEWER_2, post)),
    ]);
    const successes = [a, b].filter((r) => r.ok);
    expect(successes).toHaveLength(1);
    const loser = [a, b].find((r) => !r.ok);
    expect(loser).toMatchObject({ sqlstate: "40001" });
    const owner = sql(`select reviewed_by::text from public.aurum_posts where id = ${lit(post)}::uuid`);
    expect([REVIEWER, REVIEWER_2]).toContain(owner);
  });

  it("gives the same reviewer one real transition and one idempotent result", async () => {
    const post = makePost();
    const [a, b] = await Promise.all([
      Promise.resolve().then(() => publish(REVIEWER, post)),
      Promise.resolve().then(() => publish(REVIEWER, post)),
    ]);
    expect(a.ok && b.ok).toBe(true);
    const changed = [a, b].map((r) => payload(r).changed);
    expect(changed.filter(Boolean)).toHaveLength(1);
  });
});
