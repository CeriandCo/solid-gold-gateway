/**
 * Database-level proof for the T3 MELT persistence foundation, against the
 * throwaway database. Covers the consent-evidence constraints, the timestamp
 * behaviour, the upsert primitive Phase 3 will rely on, and the attempts
 * bucket with its prune function.
 *
 * No server function, no provider and no consent copy exist yet; everything
 * here speaks SQL directly.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

import { beforeEach, describe, expect, it } from "vitest";

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

/** A complete, valid row. Consent values here are test fixtures, never product copy. */
function insertSignup(overrides: Partial<Record<string, string>> = {}) {
  const values = {
    email: "'reader@example.com'",
    lists: "ARRAY['daily-note']",
    consent_version: "'test-fixture'",
    consent_text: "'TEST FIXTURE CONSENT SNAPSHOT'",
    consented_at: "now()",
    source: "'aurum#subscribe'",
    ...overrides,
  };
  return run(
    `INSERT INTO public.newsletter_signups (email, lists, consent_version, consent_text, consented_at, source)
     VALUES (${values.email}, ${values.lists}, ${values.consent_version}, ${values.consent_text}, ${values.consented_at}, ${values.source})`,
  );
}

beforeEach(() => {
  sql("DELETE FROM public.newsletter_signups");
  sql("DELETE FROM public.newsletter_attempts");
});

describe("newsletter_signups constraints", () => {
  it("accepts a valid row and fills both timestamps", () => {
    expect(insertSignup().ok).toBe(true);
    const row = sql(
      "SELECT created_at IS NOT NULL, updated_at IS NOT NULL, id IS NOT NULL FROM public.newsletter_signups",
    );
    expect(row).toBe("t|t|t");
  });

  it("rejects a duplicate normalised email", () => {
    expect(insertSignup().ok).toBe(true);
    const second = insertSignup();
    expect(second.ok).toBe(false);
    if (!second.ok) expect(second.sqlstate).toBe("23505");
  });

  it("rejects an email longer than 254 characters", () => {
    const long = `'${"a".repeat(250)}@example.com'`;
    const result = insertSignup({ email: long });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("newsletter_signups_email_len");
  });

  it("rejects an email that was not normalised", () => {
    const result = insertSignup({ email: "'Reader@Example.com'" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("newsletter_signups_email_normalised");
  });

  it("rejects an empty list selection", () => {
    const result = insertSignup({ lists: "ARRAY[]::text[]" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("newsletter_signups_lists_not_empty");
  });

  it("rejects an unsupported list value", () => {
    const result = insertSignup({ lists: "ARRAY['daily-note','monthly-digest']" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("newsletter_signups_lists_allowed");
  });

  it("accepts both current MELT content choices together", () => {
    expect(insertSignup({ lists: "ARRAY['daily-note','weekly-brief']" }).ok).toBe(true);
  });

  it("rejects an empty consent version", () => {
    const result = insertSignup({ consent_version: "'   '" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("newsletter_signups_consent_version_len");
  });

  it("rejects an empty consent snapshot", () => {
    const result = insertSignup({ consent_text: "''" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("newsletter_signups_consent_text_len");
  });

  it("rejects an empty source", () => {
    const result = insertSignup({ source: "'  '" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("newsletter_signups_source_len");
  });

  it("has no provider, confirmation or sync columns", () => {
    const columns = sql(
      `SELECT string_agg(column_name, ',' ORDER BY ordinal_position)
       FROM information_schema.columns
       WHERE table_schema='public' AND table_name='newsletter_signups'`,
    );
    expect(columns).toBe(
      "id,email,lists,consent_version,consent_text,consented_at,source,created_at,updated_at",
    );
  });
});

describe("newsletter_signups timestamps", () => {
  it("moves updated_at on update but leaves created_at and consented_at alone", () => {
    expect(insertSignup().ok).toBe(true);
    const before = sql(
      "SELECT id::text, created_at::text, updated_at::text, consented_at::text FROM public.newsletter_signups",
    ).split("|");

    sql("SELECT pg_sleep(0.05)");
    sql("UPDATE public.newsletter_signups SET source = 'aurum#subscribe-b'");

    const after = sql(
      "SELECT id::text, created_at::text, updated_at::text, consented_at::text FROM public.newsletter_signups",
    ).split("|");

    expect(after[0]).toBe(before[0]);
    expect(after[1]).toBe(before[1]);
    expect(after[3]).toBe(before[3]);
    expect(after[2]).not.toBe(before[2]);
  });
});

describe("upsert primitive for Phase 3", () => {
  it("re-consent updates in place without changing id or created_at", () => {
    expect(insertSignup().ok).toBe(true);
    const before = sql(
      "SELECT id::text, created_at::text, consented_at::text FROM public.newsletter_signups",
    ).split("|");

    sql("SELECT pg_sleep(0.05)");
    sql(
      `INSERT INTO public.newsletter_signups (email, lists, consent_version, consent_text, consented_at, source)
       VALUES ('reader@example.com', ARRAY['daily-note','weekly-brief'], 'test-fixture-2', 'SECOND TEST FIXTURE SNAPSHOT', now(), 'aurum#subscribe-2')
       ON CONFLICT (email) DO UPDATE SET
         lists = EXCLUDED.lists,
         consent_version = EXCLUDED.consent_version,
         consent_text = EXCLUDED.consent_text,
         consented_at = EXCLUDED.consented_at,
         source = EXCLUDED.source`,
    );

    expect(sql("SELECT count(*) FROM public.newsletter_signups")).toBe("1");
    const after = sql(
      `SELECT id::text, created_at::text, consented_at::text, consent_version, source,
              array_to_string(lists, ',') FROM public.newsletter_signups`,
    ).split("|");

    expect(after[0]).toBe(before[0]);
    expect(after[1]).toBe(before[1]);
    expect(after[2]).not.toBe(before[2]);
    expect(after[3]).toBe("test-fixture-2");
    expect(after[4]).toBe("aurum#subscribe-2");
    expect(after[5]).toBe("daily-note,weekly-brief");
  });

  it("keeps one row when the same email is inserted twice in one statement batch", () => {
    sql(
      `INSERT INTO public.newsletter_signups (email, lists, consent_version, consent_text, consented_at, source)
       SELECT 'reader@example.com', ARRAY['daily-note'], 'test-fixture', 'TEST FIXTURE CONSENT SNAPSHOT', now(), 'aurum#subscribe'
       FROM generate_series(1, 5)
       ON CONFLICT (email) DO UPDATE SET consented_at = EXCLUDED.consented_at`,
    );
    expect(sql("SELECT count(*) FROM public.newsletter_signups")).toBe("1");
  });
});

describe("newsletter_attempts", () => {
  it("accepts a hash and stamps the time", () => {
    sql("INSERT INTO public.newsletter_attempts (ip_hash) VALUES ('deadbeef')");
    expect(sql("SELECT created_at IS NOT NULL, id > 0 FROM public.newsletter_attempts")).toBe("t|t");
  });

  it("has no column that could hold a raw address, email or payload", () => {
    const columns = sql(
      `SELECT string_agg(column_name, ',' ORDER BY ordinal_position)
       FROM information_schema.columns
       WHERE table_schema='public' AND table_name='newsletter_attempts'`,
    );
    expect(columns).toBe("id,ip_hash,created_at");
  });

  it("prunes attempts older than seven days, keeps recent ones and never touches signups", () => {
    expect(insertSignup().ok).toBe(true);
    sql(
      `INSERT INTO public.newsletter_attempts (ip_hash, created_at) VALUES
         ('old', now() - interval '8 days'),
         ('recent', now() - interval '1 hour')`,
    );

    sql("SELECT public.newsletter_prune_attempts()");

    expect(sql("SELECT string_agg(ip_hash, ',') FROM public.newsletter_attempts")).toBe("recent");
    expect(sql("SELECT count(*) FROM public.newsletter_signups")).toBe("1");
  });
});
