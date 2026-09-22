/**
 * Database-level regression for the published -> archived transition.
 *
 * Proves what a test double cannot: an ordinary authenticated session still
 * cannot perform the transition itself, the public visibility predicate really
 * does drop the row, and the single-winner races are decided by the conditional
 * status predicate rather than by timing.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

import { beforeAll, describe, expect, it } from "vitest";

import { assertIsolatedDatabase } from "@/test/live-db-guard";

assertIsolatedDatabase();

const env = JSON.parse(readFileSync("/tmp/sqoot-test-db/env.json", "utf8")) as { pgPort: number };
const CONN = `postgres://postgres@127.0.0.1:${env.pgPort}/postgres?sslmode=disable`;

type SqlResult = { ok: true; out: string } | { ok: false; sqlstate: string; message: string };

function run(text: string): SqlResult {
  try {
    const out = execFileSync(
      "psql",
      [CONN, "-At", "-q", "-v", "ON_ERROR_STOP=1", "-c", "\\set VERBOSITY verbose", "-c", text],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );
    return { ok: true, out: out.trim() };
  } catch (error) {
    const stderr = (error as { stderr?: string }).stderr ?? "";
    const verbose = /ERROR:\s*([0-9A-Z]{5}):\s*(.*)/.exec(stderr);
    return {
      ok: false,
      sqlstate: verbose?.[1] ?? "",
      message: verbose?.[2]?.trim() ?? stderr.trim(),
    };
  }
}

function sql(text: string): string {
  const result = run(text);
  if (!result.ok) throw new Error(`${result.sqlstate}: ${result.message}`);
  return result.out;
}

const EDITOR = "77777777-7777-4777-8777-777777777777";
const REVIEWER = "88888888-8888-4888-8888-888888888888";

/** The exact privileged write the server function issues. */
function archiveSql(postId: string): string {
  return `
    update public.aurum_posts set status = 'archived'
     where id = '${postId}'::uuid and status = 'published'
    returning id
  `;
}

/** The public visibility predicate used by every public read path. */
function publiclyVisible(postId: string, atSql = "now()"): boolean {
  return (
    sql(`
      select count(*) from public.aurum_posts
       where id = '${postId}'::uuid and status = 'published' and published_at <= ${atSql}
    `) === "1"
  );
}

function makePublishedPost(tag: string, publishedAt: string): string {
  const id = sql(`
    insert into public.aurum_posts
      (type, slug, title, summary, body, status, author_id, submitted_at, reviewed_by, reviewed_at, published_at)
    values ('daily_note', 't2-archive-${tag}-${Date.now()}', 'Archive guard', 'Archive summary',
            '["A paragraph."]'::jsonb, 'published', '${EDITOR}'::uuid, now() - interval '2 days',
            '${REVIEWER}'::uuid, now() - interval '1 day', ${publishedAt})
    returning id
  `);
  sql(`
    insert into public.aurum_post_sources (post_id, position, publisher, title, source_date, url)
    values ('${id}'::uuid, 1, 'Reuters', 'Gold steadies', current_date, 'https://example.com/a')
  `);
  return id;
}

function snapshot(postId: string): string {
  return sql(`
    select status || '|' || published_at::text || '|' || coalesce(reviewed_by::text, 'null') || '|' ||
           coalesce(reviewed_at::text, 'null') || '|' || coalesce(submitted_at::text, 'null') || '|' ||
           coalesce(author_id::text, 'null') || '|' || title || '|' || slug || '|' || body::text ||
           '|' || created_at::text
      from public.aurum_posts where id = '${postId}'::uuid
  `);
}

beforeAll(() => {
  sql(`
    create or replace function auth.uid() returns uuid language sql stable
    as $fn$ select nullif(current_setting('test.uid', true), '')::uuid $fn$
  `);
  sql(`
    grant select, insert, update, delete on all tables in schema public to authenticated;
    grant usage on schema auth to authenticated
  `);
  sql(`
    insert into public.aurum_cms_settings (id, allow_self_approval)
    values (true, false) on conflict (id) do nothing
  `);
  for (const [id, email, role] of [
    [EDITOR, "archive-editor@example.com", "editor"],
    [REVIEWER, "archive-reviewer@example.com", "reviewer"],
  ]) {
    sql(`insert into auth.users (id, email) values ('${id}'::uuid, '${email}')
         on conflict (id) do nothing`);
    sql(`insert into public.aurum_editors (email, role, user_id)
         values ('${email}', '${role}', '${id}'::uuid)
         on conflict (email) do update set role = excluded.role, user_id = excluded.user_id`);
  }
});

describe("published -> archived cannot be done by an authenticated session", () => {
  it("blocks the transition for an editor and for a reviewer", () => {
    const postId = makePublishedPost("rls", "now() - interval '1 hour'");
    for (const uid of [EDITOR, REVIEWER]) {
      const result = run(
        [
          "begin",
          "set local role authenticated",
          `set local test.uid = '${uid}'`,
          `update public.aurum_posts set status = 'archived' where id = '${postId}'::uuid returning id`,
          "commit",
        ].join("; "),
      );
      expect(result.ok === false || result.out === "").toBe(true);
    }
    expect(sql(`select status from public.aurum_posts where id = '${postId}'::uuid`)).toBe(
      "published",
    );
  });
});

describe("unpublishing a live post", () => {
  it("removes it from public reads while preserving every other column", () => {
    const postId = makePublishedPost("live", "now() - interval '1 hour'");
    expect(publiclyVisible(postId)).toBe(true);
    const before = snapshot(postId);

    expect(sql(archiveSql(postId))).toBe(postId);

    expect(publiclyVisible(postId)).toBe(false);
    expect(snapshot(postId)).toBe(before.replace(/^published\|/, "archived|"));
    expect(
      sql(`select count(*) from public.aurum_post_sources where post_id = '${postId}'::uuid`),
    ).toBe("1");
  });
});

describe("cancelling a scheduled publication", () => {
  it("archives a future-dated published row and it never becomes visible", () => {
    const postId = makePublishedPost("scheduled", "now() + interval '2 days'");
    const scheduledAt = sql(
      `select published_at::text from public.aurum_posts where id = '${postId}'::uuid`,
    );
    expect(publiclyVisible(postId)).toBe(false);

    expect(sql(archiveSql(postId))).toBe(postId);

    // Even once the scheduled moment has passed, the archived row stays private.
    expect(publiclyVisible(postId, "now() + interval '10 days'")).toBe(false);
    expect(
      sql(`select published_at::text from public.aurum_posts where id = '${postId}'::uuid`),
    ).toBe(scheduledAt);
    expect(
      sql(
        `select (reviewed_by is not null)::text || '|' || (reviewed_at is not null)::text
         from public.aurum_posts where id = '${postId}'::uuid`,
      ),
    ).toBe("true|true");
  });
});

describe("single-winner races", () => {
  it("a second archive matches no row and rewrites no provenance", () => {
    const postId = makePublishedPost("double", "now() - interval '1 hour'");
    expect(sql(archiveSql(postId))).toBe(postId);
    const after = snapshot(postId);
    expect(sql(archiveSql(postId))).toBe("");
    expect(snapshot(postId)).toBe(after);
  });

  it("publication cannot restore an archived post", () => {
    const postId = makePublishedPost("republish", "now() - interval '1 hour'");
    sql(archiveSql(postId));
    const result = run(
      [
        "begin",
        "set local role authenticated",
        `set local test.uid = '${REVIEWER}'`,
        `select public.aurum_publish_post('${postId}'::uuid)`,
        "commit",
      ].join("; "),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.sqlstate).toBe("55000");
    expect(sql(`select status from public.aurum_posts where id = '${postId}'::uuid`)).toBe(
      "archived",
    );
  });

  it("archiving a row publication has just created is a valid published -> archived move", () => {
    const postId = sql(`
      insert into public.aurum_posts (type, slug, title, summary, body, status, author_id, submitted_at)
      values ('daily_note', 't2-archive-after-publish-${Date.now()}', 'Archive guard', 'Archive summary',
              '["A paragraph."]'::jsonb, 'in_review', '${EDITOR}'::uuid, now())
      returning id
    `);
    sql(`
      insert into public.aurum_post_sources (post_id, position, publisher, title, source_date, url)
      values ('${postId}'::uuid, 1, 'Reuters', 'Gold steadies', current_date, 'https://example.com/a')
    `);
    const published = sql(
      [
        "begin",
        "set local role authenticated",
        `set local test.uid = '${REVIEWER}'`,
        `select (public.aurum_publish_post('${postId}'::uuid) ->> 'status')`,
        "commit",
      ].join("; "),
    );
    expect(published).toBe("published");
    expect(sql(archiveSql(postId))).toBe(postId);
    expect(publiclyVisible(postId)).toBe(false);
  });
});

describe("the self-approval setting is irrelevant to unpublishing", () => {
  it("archives regardless of how allow_self_approval is set", () => {
    for (const value of ["true", "false"]) {
      sql(`update public.aurum_cms_settings set allow_self_approval = ${value} where id = true`);
      const postId = makePublishedPost(`self-${value}`, "now() - interval '1 hour'");
      expect(sql(archiveSql(postId))).toBe(postId);
    }
    sql(`update public.aurum_cms_settings set allow_self_approval = false where id = true`);
  });
});
