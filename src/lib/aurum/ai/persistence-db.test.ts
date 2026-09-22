/**
 * Database-level proof for AI persistence, against the throwaway database.
 *
 * Covers: the run claim (duplicate window, hard daily cap), the atomic
 * in_review save with its sources, the impossibility of a partial save, and the
 * fact that an ordinary authenticated session can neither forge AI provenance
 * nor reach the AI tables at all.
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

const EDITOR = "7c7c7c7c-1111-4111-8111-111111111111";

const BODY = JSON.stringify([
  "The latest stored gold observation is $3912.36 a troy ounce.",
  "Market commentary, not investment advice.",
]);

const SOURCES = JSON.stringify([
  {
    publisher: "SQOOT AURUM price record",
    title: "aurum_spot_prices latest observation",
    date: "2026-09-22",
    url: "https://solid-gold-gateway.lovable.app/aurum#price",
  },
]);

let baselinePublished = 0;

function claim(windowKey: string, cap = 1): Record<string, unknown> {
  return JSON.parse(
    sql(`select public.aurum_ai_claim_run('${windowKey}', ${cap})::text`),
  ) as Record<string, unknown>;
}

function create(runId: string, slug: string, sources = SOURCES): SqlResult {
  return run(
    `select public.aurum_ai_create_in_review('${runId}'::uuid, '${slug}', 'A verified AURUM daily note',
       'A short verified summary of the stored gold observation for today.',
       '${BODY}'::jsonb, '${sources}'::jsonb)`,
  );
}

beforeAll(() => {
  sql(
    `insert into auth.users (id, email) values ('${EDITOR}', 'ai-db-test@example.com')
     on conflict (id) do nothing`,
  );
  baselinePublished = Number(
    sql("select count(*) from public.aurum_posts where status = 'published'"),
  );
  sql("delete from public.aurum_posts where origin = 'ai'");
  sql("delete from public.aurum_ai_runs where window_key like 'test:%'");

  // The schema dump the throwaway database is built from does not carry the
  // "revoke from PUBLIC" part of the function grants, so restate it here to
  // match the live database exactly (verified live: only postgres and
  // service_role hold EXECUTE).
  for (const signature of [
    "public.aurum_ai_claim_run(text, integer)",
    "public.aurum_ai_finish_run(uuid, text, text, text, integer, integer, integer, numeric, uuid, text)",
    "public.aurum_ai_create_in_review(uuid, text, text, text, jsonb, jsonb)",
    "public.aurum_ai_max_runs_per_day()",
  ]) {
    sql(`revoke all on function ${signature} from public, anon, authenticated`);
  }
});

/** The daily cap counts rows, so each save test starts from an empty run table. */
function freshRun(windowKey: string): string {
  sql("delete from public.aurum_ai_runs where window_key like 'test:%'");
  return String(claim(windowKey)["run_id"]);
}

describe("run claim", () => {
  it("claims a window once and refuses the same window again", () => {
    const first = claim("test:window-a");
    expect(first["outcome"]).toBe("claimed");
    expect(claim("test:window-a")["outcome"]).toBe("duplicate");
  });

  it("enforces the configured daily cap", () => {
    const capped = claim("test:window-b", 0);
    expect(capped["outcome"]).toBe("cap");
  });

  it("clamps any configured cap to the hard database maximum", () => {
    expect(Number(sql("select public.aurum_ai_max_runs_per_day()"))).toBe(4);
    const outcomes: string[] = [];
    for (let i = 0; i < 6; i++) {
      outcomes.push(String(claim(`test:hardcap-${i}`, 99)["outcome"]));
    }
    expect(outcomes.filter((outcome) => outcome === "claimed").length).toBeLessThanOrEqual(4);
    expect(outcomes).toContain("cap");
  });

  it("rejects an empty window key", () => {
    const result = run("select public.aurum_ai_claim_run('', 1)");
    expect(result.ok).toBe(false);
  });
});

describe("atomic in_review save", () => {
  it("creates exactly one AI post with its sources and no reviewer state", () => {
    const runId = freshRun("test:save");
    const result = create(runId, "test-ai-daily-note-save");
    expect(result.ok).toBe(true);

    const row = sql(
      `select status || '|' || origin || '|' || type || '|' ||
              (author_id is null) || '|' || (submitted_at is not null) || '|' ||
              (reviewed_by is null) || '|' || (reviewed_at is null) || '|' ||
              (published_at is null)
         from public.aurum_posts where slug = 'test-ai-daily-note-save'`,
    );
    expect(row).toBe("in_review|ai|daily_note|true|true|true|true|true");

    expect(
      Number(
        sql(
          `select count(*) from public.aurum_post_sources s
             join public.aurum_posts p on p.id = s.post_id
            where p.slug = 'test-ai-daily-note-save'`,
        ),
      ),
    ).toBe(1);

    expect(
      sql(
        `select count(*) from public.aurum_posts p, jsonb_array_elements_text(p.body) line
          where p.slug = 'test-ai-daily-note-save'
            and line = 'Market commentary, not investment advice.'`,
      ),
    ).toBe("1");
  });

  it("refuses a second post for the same run", () => {
    const runId = freshRun("test:save-twice");
    expect(create(runId, "test-ai-once").ok).toBe(true);
    const second = create(runId, "test-ai-twice");
    expect(second.ok).toBe(false);
    expect(sql("select count(*) from public.aurum_posts where slug = 'test-ai-twice'")).toBe("0");
  });

  it("refuses an unknown run", () => {
    const result = create("00000000-0000-4000-8000-0000000000ff", "test-ai-unknown-run");
    expect(result.ok).toBe(false);
  });

  it("saves nothing at all when the sources are missing", () => {
    const runId = freshRun("test:no-sources");
    const result = create(runId, "test-ai-no-sources", "[]");
    expect(result.ok).toBe(false);
    expect(sql("select count(*) from public.aurum_posts where slug = 'test-ai-no-sources'")).toBe(
      "0",
    );
    expect(
      sql(`select coalesce(post_id::text, 'none') from public.aurum_ai_runs where id = '${runId}'`),
    ).toBe("none");
  });
});

describe("an ordinary session cannot reach or forge any of this", () => {
  function asEditor(statement: string): SqlResult {
    return run(
      ["begin", "set local role authenticated", `set local test.uid = '${EDITOR}'`, statement, "commit"].join(
        "; ",
      ),
    );
  }

  it.each([
    ["read runs", "select count(*) from public.aurum_ai_runs"],
    ["read alerts", "select count(*) from public.aurum_ai_alerts"],
    ["claim a run", "select public.aurum_ai_claim_run('test:evil', 1)"],
    [
      "create an in_review post",
      `select public.aurum_ai_create_in_review('00000000-0000-4000-8000-0000000000ff'::uuid,
        'evil', 'Evil title here', 'Evil summary that is long enough to pass.', '${BODY}'::jsonb, '${SOURCES}'::jsonb)`,
    ],
  ])("is blocked: %s", (_label, statement) => {
    expect(asEditor(statement).ok).toBe(false);
  });

  it("cannot insert a post claiming AI provenance", () => {
    const result = asEditor(
      `insert into public.aurum_posts (type, slug, title, summary, body, status, origin, author_id)
       values ('daily_note', 'forged-ai', 'Forged provenance', 'A forged summary long enough here.',
               '${BODY}'::jsonb, 'draft', 'ai', '${EDITOR}'::uuid)`,
    );
    expect(result.ok).toBe(false);
  });
});

describe("the existing published posts are untouched", () => {
  it("keeps the same published count, all human-origin", () => {
    expect(
      Number(sql("select count(*) from public.aurum_posts where status = 'published'")),
    ).toBe(baselinePublished);
    expect(
      sql("select count(*) from public.aurum_posts where status = 'published' and origin <> 'human'"),
    ).toBe("0");
  });

  it("cleans up every throwaway AI post", () => {
    sql("delete from public.aurum_posts where slug like 'test-ai-%'");
    sql("delete from public.aurum_ai_runs where window_key like 'test:%'");
    expect(sql("select count(*) from public.aurum_posts where slug like 'test-ai-%'")).toBe("0");
  });
});
