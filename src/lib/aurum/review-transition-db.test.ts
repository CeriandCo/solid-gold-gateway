/**
 * Database-level regression: an ordinary authenticated session must not be able
 * to move a draft into review by writing workflow fields itself. The privileged
 * server function is the only sanctioned path.
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

const EDITOR = "66666666-6666-4666-8666-666666666666";
let postId = "";

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
    insert into auth.users (id, email) values ('${EDITOR}'::uuid, 'submit-editor@example.com')
    on conflict (id) do nothing
  `);
  sql(`
    insert into public.aurum_editors (email, role, user_id)
    values ('submit-editor@example.com', 'editor', '${EDITOR}'::uuid)
    on conflict (email) do update set role = excluded.role, user_id = excluded.user_id
  `);
  postId = sql(`
    insert into public.aurum_posts (type, slug, title, summary, body, status, author_id)
    values ('daily_note', 't2-submit-guard-${Date.now()}', 'Guard', 'Guard summary',
            '["A paragraph."]'::jsonb, 'draft', '${EDITOR}'::uuid)
    returning id
  `);
});

describe("draft -> in_review cannot be done by an authenticated session", () => {
  it("blocks writing status directly", () => {
    const result = run(
      [
        "begin",
        "set local role authenticated",
        `set local test.uid = '${EDITOR}'`,
        `update public.aurum_posts set status = 'in_review' where id = '${postId}'::uuid`,
        "commit",
      ].join("; "),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.sqlstate).toBe("42501");
  });

  it("blocks writing submitted_at and reviewer fields directly", () => {
    for (const patch of [
      "submitted_at = now()",
      `reviewed_by = '${EDITOR}'::uuid, reviewed_at = now()`,
      "author_id = null",
    ]) {
      const result = run(
        [
          "begin",
          "set local role authenticated",
          `set local test.uid = '${EDITOR}'`,
          `update public.aurum_posts set ${patch} where id = '${postId}'::uuid`,
          "commit",
        ].join("; "),
      );
      expect(result.ok).toBe(false);
    }
  });

  it("leaves the post a draft", () => {
    expect(sql(`select status from public.aurum_posts where id = '${postId}'::uuid`)).toBe("draft");
  });
});
