/**
 * Database-level regression for the archived -> draft transition (restore).
 *
 * Proves what a test double cannot: an authenticated session still cannot do
 * this itself, a restored draft stays out of every public read, the author
 * regains normal editing rights, and a restored post really does have to travel
 * a complete new review cycle before it can be public again.
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

const EDITOR = "5b5b5b5b-7777-4777-8777-777777777771";
const REVIEWER = "5b5b5b5b-8888-4888-8888-888888888882";
const REVIEWER_TWO = "5b5b5b5b-9999-4999-8999-999999999993";

/** The exact privileged writes the server functions issue. */
function restoreSql(postId: string): string {
  return `
    update public.aurum_posts
       set status = 'draft', published_at = null, submitted_at = null,
           reviewed_by = null, reviewed_at = null
     where id = '${postId}'::uuid and status = 'archived'
    returning id
  `;
}

function archiveSql(postId: string): string {
  return `
    update public.aurum_posts set status = 'archived'
     where id = '${postId}'::uuid and status = 'published'
    returning id
  `;
}

function submitSql(postId: string): string {
  return `
    update public.aurum_posts
       set status = 'in_review', submitted_at = now(), reviewed_by = null, reviewed_at = null
     where id = '${postId}'::uuid and status = 'draft'
    returning id
  `;
}

function publishAs(uid: string, postId: string): SqlResult {
  return run(
    [
      "begin",
      "set local role authenticated",
      `set local test.uid = '${uid}'`,
      `select (public.aurum_publish_post('${postId}'::uuid) ->> 'status')`,
      "commit",
    ].join("; "),
  );
}

/** The public visibility predicate shared by every public read path. */
function publiclyVisible(postId: string, atSql = "now()"): boolean {
  return (
    sql(`
      select count(*) from public.aurum_posts
       where id = '${postId}'::uuid and status = 'published' and published_at <= ${atSql}
    `) === "1"
  );
}

function makeDraft(tag: string, author = EDITOR): string {
  const id = sql(`
    insert into public.aurum_posts (type, slug, title, summary, body, status, author_id)
    values ('daily_note', 't2-restore-${tag}-${Date.now()}', 'Restore guard', 'Restore summary',
            '["A paragraph."]'::jsonb, 'draft', '${author}'::uuid)
    returning id
  `);
  sql(`
    insert into public.aurum_post_sources (post_id, position, publisher, title, source_date, url)
    values ('${id}'::uuid, 1, 'Reuters', 'Gold steadies', current_date, 'https://example.com/a')
  `);
  return id;
}

/** draft -> in_review -> published -> archived, using the real publish RPC. */
function makeArchivedPost(tag: string, author = EDITOR, reviewer = REVIEWER): string {
  const id = makeDraft(tag, author);
  sql(submitSql(id));
  const published = publishAs(reviewer, id);
  if (!published.ok) throw new Error(`${published.sqlstate}: ${published.message}`);
  sql(archiveSql(id));
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
    values (true, false) on conflict (id) do update set allow_self_approval = false
  `);
  for (const [id, email, role] of [
    [EDITOR, "restore-editor@example.com", "editor"],
    [REVIEWER, "restore-reviewer@example.com", "reviewer"],
    [REVIEWER_TWO, "restore-reviewer-two@example.com", "reviewer"],
  ]) {
    sql(`insert into auth.users (id, email) values ('${id}'::uuid, '${email}')
         on conflict (id) do nothing`);
    sql(`insert into public.aurum_editors (email, role, user_id)
         values ('${email}', '${role}', '${id}'::uuid)
         on conflict (email) do update set role = excluded.role, user_id = excluded.user_id`);
  }
});

describe("archived -> draft cannot be done by an authenticated session", () => {
  it("blocks the transition and each workflow field it touches", () => {
    const postId = makeArchivedPost("rls");
    for (const patch of [
      "status = 'draft'",
      "published_at = null",
      "reviewed_by = null, reviewed_at = null",
      "status = 'draft', published_at = null, submitted_at = null, reviewed_by = null, reviewed_at = null",
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
        expect(result.ok === false || result.out === "").toBe(true);
      }
    }
    expect(sql(`select status from public.aurum_posts where id = '${postId}'::uuid`)).toBe(
      "archived",
    );
  });
});

describe("restoring an archived post", () => {
  it("clears publication and review metadata while keeping content and sources", () => {
    const postId = makeArchivedPost("clear");
    const before = sql(`
      select title || '|' || slug || '|' || summary || '|' || body::text || '|' ||
             author_id::text || '|' || created_at::text
        from public.aurum_posts where id = '${postId}'::uuid
    `);

    expect(sql(restoreSql(postId))).toBe(postId);

    expect(
      sql(`
        select status || '|' || coalesce(published_at::text, 'null') || '|' ||
               coalesce(submitted_at::text, 'null') || '|' || coalesce(reviewed_by::text, 'null') ||
               '|' || coalesce(reviewed_at::text, 'null')
          from public.aurum_posts where id = '${postId}'::uuid
      `),
    ).toBe("draft|null|null|null|null");

    expect(
      sql(`
        select title || '|' || slug || '|' || summary || '|' || body::text || '|' ||
               author_id::text || '|' || created_at::text
          from public.aurum_posts where id = '${postId}'::uuid
      `),
    ).toBe(before);

    expect(
      sql(`select count(*) || '|' || min(position)::text from public.aurum_post_sources
           where post_id = '${postId}'::uuid`),
    ).toBe("1|1");
  });

  it("does not make the post public again, now or later", () => {
    const postId = makeArchivedPost("private");
    sql(restoreSql(postId));
    expect(publiclyVisible(postId)).toBe(false);
    expect(publiclyVisible(postId, "now() + interval '30 days'")).toBe(false);
    // Even a hand-planted past publication date cannot make a draft public.
    sql(`update public.aurum_posts set published_at = now() - interval '1 day'
         where id = '${postId}'::uuid`);
    expect(publiclyVisible(postId)).toBe(false);
  });

  it("gives the original author normal draft editing rights back", () => {
    const postId = makeArchivedPost("editable");
    sql(restoreSql(postId));

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
        `update public.aurum_posts set title = 'Repaired title' where id = '${postId}'::uuid`,
        `insert into public.aurum_post_sources (post_id, position, publisher, title, source_date, url)
           values ('${postId}'::uuid, 2, 'FT', 'Gold rallies', current_date, 'https://example.com/b')`,
        "commit",
      ].join("; "),
    );
    expect(edit.ok).toBe(true);
    expect(sql(`select title from public.aurum_posts where id = '${postId}'::uuid`)).toBe(
      "Repaired title",
    );
    expect(
      sql(`select count(*) from public.aurum_post_sources where post_id = '${postId}'::uuid`),
    ).toBe("2");
  });
});

describe("state predicates isolate the transition", () => {
  it("a second restore matches no row and rewrites nothing", () => {
    const postId = makeArchivedPost("double");
    expect(sql(restoreSql(postId))).toBe(postId);
    const after = sql(`
      select status || '|' || coalesce(published_at::text, 'null') || '|' || updated_at::text
        from public.aurum_posts where id = '${postId}'::uuid
    `);
    expect(sql(restoreSql(postId))).toBe("");
    expect(
      sql(`
        select status || '|' || coalesce(published_at::text, 'null') || '|' || updated_at::text
          from public.aurum_posts where id = '${postId}'::uuid
      `),
    ).toBe(after);
  });

  it("a stale publish cannot republish an archived or a restored row", () => {
    const archivedId = makeArchivedPost("stale-publish-archived");
    const stale = publishAs(REVIEWER, archivedId);
    expect(stale.ok).toBe(false);
    if (!stale.ok) expect(stale.sqlstate).toBe("55000");

    const restoredId = makeArchivedPost("stale-publish-restored");
    sql(restoreSql(restoredId));
    const afterRestore = publishAs(REVIEWER, restoredId);
    expect(afterRestore.ok).toBe(false);
    if (!afterRestore.ok) expect(afterRestore.sqlstate).toBe("55000");
    expect(publiclyVisible(restoredId)).toBe(false);
  });

  it("a stale archive cannot touch an archived or a restored row", () => {
    const archivedId = makeArchivedPost("stale-archive");
    expect(sql(archiveSql(archivedId))).toBe("");

    const restoredId = makeArchivedPost("stale-archive-restored");
    sql(restoreSql(restoredId));
    expect(sql(archiveSql(restoredId))).toBe("");
    expect(sql(`select status from public.aurum_posts where id = '${restoredId}'::uuid`)).toBe(
      "draft",
    );
  });

  it("a stale archive executing first leaves the archived row restorable", () => {
    const postId = makeArchivedPost("archive-then-restore");
    expect(sql(archiveSql(postId))).toBe("");
    expect(sql(restoreSql(postId))).toBe(postId);
  });
});

describe("a restored post needs a complete new review cycle", () => {
  it("publish -> archive -> restore -> edit -> submit -> publish records the new approval", () => {
    const postId = makeArchivedPost("cycle");
    const firstReviewer = sql(
      `select coalesce(reviewed_by::text, 'null') from public.aurum_posts where id = '${postId}'::uuid`,
    );
    expect(firstReviewer).toBe(REVIEWER);

    expect(sql(restoreSql(postId))).toBe(postId);
    // Restore itself never republishes.
    expect(sql(`select status from public.aurum_posts where id = '${postId}'::uuid`)).toBe("draft");
    expect(publiclyVisible(postId)).toBe(false);

    sql(`update public.aurum_posts set title = 'Second run' where id = '${postId}'::uuid`);

    // Old metadata cannot authorize a new publication: publish needs in_review.
    const withoutSubmit = publishAs(REVIEWER_TWO, postId);
    expect(withoutSubmit.ok).toBe(false);
    if (!withoutSubmit.ok) expect(withoutSubmit.sqlstate).toBe("55000");

    expect(sql(submitSql(postId))).toBe(postId);
    const submittedAt = sql(
      `select coalesce(submitted_at::text, 'null') from public.aurum_posts where id = '${postId}'::uuid`,
    );
    expect(submittedAt).not.toBe("null");

    const republished = publishAs(REVIEWER_TWO, postId);
    expect(republished.ok).toBe(true);
    if (republished.ok) expect(republished.out).toBe("published");

    // The second approval owns the new provenance.
    expect(
      sql(`select reviewed_by::text from public.aurum_posts where id = '${postId}'::uuid`),
    ).toBe(REVIEWER_TWO);
    expect(
      sql(`
        select (reviewed_at >= submitted_at)::text || '|' || (published_at > now() - interval '1 minute')::text
          from public.aurum_posts where id = '${postId}'::uuid
      `),
    ).toBe("true|true");
    expect(publiclyVisible(postId)).toBe(true);
  });

  it("republication still respects the current self-approval policy", () => {
    // The reviewer is the author here, so their own approval must be refused
    // while self-approval is off, and accepted once it is on.
    const postId = makeArchivedPost("self-approval", REVIEWER, REVIEWER_TWO);
    expect(sql(restoreSql(postId))).toBe(postId);
    expect(sql(submitSql(postId))).toBe(postId);

    const refused = publishAs(REVIEWER, postId);
    expect(refused.ok).toBe(false);
    if (!refused.ok) {
      expect(refused.sqlstate).toBe("42501");
      expect(refused.message).toMatch(/another reviewer must approve/i);
    }

    sql(`update public.aurum_cms_settings set allow_self_approval = true where id = true`);
    const allowed = publishAs(REVIEWER, postId);
    sql(`update public.aurum_cms_settings set allow_self_approval = false where id = true`);
    expect(allowed.ok).toBe(true);
  });
});
