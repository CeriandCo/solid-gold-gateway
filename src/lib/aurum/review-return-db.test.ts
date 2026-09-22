/**
 * Database-level regression for the in_review -> draft transition.
 *
 * Two things are proven here that a test double cannot prove: an ordinary
 * authenticated editor still cannot perform the transition themselves, and the
 * single-winner race against public.aurum_publish_post really is decided by the
 * conditional status predicate rather than by timing.
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
function returnToDraftSql(postId: string): string {
  return `
    update public.aurum_posts
       set status = 'draft', submitted_at = null, reviewed_by = null, reviewed_at = null
     where id = '${postId}'::uuid and status = 'in_review'
    returning id
  `;
}

function makeInReviewPost(tag: string): string {
  const id = sql(`
    insert into public.aurum_posts (type, slug, title, summary, body, status, author_id, submitted_at)
    values ('daily_note', 't2-return-${tag}-${Date.now()}', 'Return guard', 'Return summary',
            '["A paragraph."]'::jsonb, 'in_review', '${EDITOR}'::uuid, now())
    returning id
  `);
  sql(`
    insert into public.aurum_post_sources (post_id, position, publisher, title, source_date, url)
    values ('${id}'::uuid, 1, 'Reuters', 'Gold steadies', current_date, 'https://example.com/a')
  `);
  return id;
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
    [EDITOR, "return-editor@example.com", "editor"],
    [REVIEWER, "return-reviewer@example.com", "reviewer"],
  ]) {
    sql(`insert into auth.users (id, email) values ('${id}'::uuid, '${email}')
         on conflict (id) do nothing`);
    sql(`insert into public.aurum_editors (email, role, user_id)
         values ('${email}', '${role}', '${id}'::uuid)
         on conflict (email) do update set role = excluded.role, user_id = excluded.user_id`);
  }
});

describe("in_review -> draft cannot be done by an authenticated session", () => {
  it("blocks the transition and every workflow field it touches", () => {
    const postId = makeInReviewPost("rls");
    for (const patch of [
      "status = 'draft'",
      "submitted_at = null",
      "reviewed_by = null, reviewed_at = null",
      "status = 'draft', submitted_at = null, reviewed_by = null, reviewed_at = null",
    ]) {
      for (const uid of [EDITOR, REVIEWER]) {
        const result = run(
          [
            "begin",
            "set local role authenticated",
            `set local test.uid = '${uid}'`,
            `update public.aurum_posts set ${patch} where id = '${postId}'::uuid returning id`,
            "commit",
          ].join("; "),
        );
        // Either the workflow trigger rejects the write, or RLS makes the
        // in_review row invisible to the update. Both leave the row untouched.
        expect(result.ok === false || result.out === "").toBe(true);
      }
    }
    expect(sql(`select status from public.aurum_posts where id = '${postId}'::uuid`)).toBe(
      "in_review",
    );
  });
});

describe("single-winner race between publish and return to draft", () => {
  it("case A: publication wins, and the return cannot revert it", () => {
    const postId = makeInReviewPost("publish-first");
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

    // The conditional update matches nothing, so no row is returned.
    expect(sql(returnToDraftSql(postId))).toBe("");
    const after = sql(
      `select status || '|' || (reviewed_by is not null) from public.aurum_posts
       where id = '${postId}'::uuid`,
    );
    expect(after).toBe("published|true");
  });

  it("case B: the return wins, and the publish RPC then refuses the post", () => {
    const postId = makeInReviewPost("return-first");
    expect(sql(returnToDraftSql(postId))).toBe(postId);

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
    expect(sql(`select status from public.aurum_posts where id = '${postId}'::uuid`)).toBe("draft");
  });

  it("a second return matches no row and rewrites no workflow metadata", () => {
    const postId = makeInReviewPost("double-return");
    expect(sql(returnToDraftSql(postId))).toBe(postId);
    const snapshot = sql(
      `select status || '|' || coalesce(submitted_at::text, 'null') || '|' ||
              coalesce(reviewed_by::text, 'null') || '|' || coalesce(reviewed_at::text, 'null')
       from public.aurum_posts where id = '${postId}'::uuid`,
    );
    expect(sql(returnToDraftSql(postId))).toBe("");
    expect(
      sql(
        `select status || '|' || coalesce(submitted_at::text, 'null') || '|' ||
                coalesce(reviewed_by::text, 'null') || '|' || coalesce(reviewed_at::text, 'null')
         from public.aurum_posts where id = '${postId}'::uuid`,
      ),
    ).toBe(snapshot);
  });
});

describe("draft editing resumes after the return", () => {
  it("the author may edit the returned draft and its sources again", () => {
    const postId = makeInReviewPost("edit-again");
    sql(returnToDraftSql(postId));

    expect(
      sql(
        [
          "begin",
          "set local role authenticated",
          `set local test.uid = '${EDITOR}'`,
          `select public.aurum_can_edit_draft(author_id)::text from public.aurum_posts
             where id = '${postId}'::uuid`,
          "commit",
        ].join("; "),
      ),
    ).toBe("true");

    const edit = run(
      [
        "begin",
        "set local role authenticated",
        `set local test.uid = '${EDITOR}'`,
        `update public.aurum_posts set title = 'Reworked title' where id = '${postId}'::uuid`,
        `insert into public.aurum_post_sources (post_id, position, publisher, title, source_date, url)
           values ('${postId}'::uuid, 2, 'FT', 'Gold rallies', current_date, 'https://example.com/b')`,
        "commit",
      ].join("; "),
    );
    expect(edit.ok).toBe(true);
    expect(sql(`select title from public.aurum_posts where id = '${postId}'::uuid`)).toBe(
      "Reworked title",
    );
    expect(
      sql(`select count(*) from public.aurum_post_sources where post_id = '${postId}'::uuid`),
    ).toBe("2");
  });
});
