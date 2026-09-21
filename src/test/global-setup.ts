/**
 * Creates a throwaway Postgres + PostgREST pair for the isolated test project
 * and drops it again afterwards. The live project database is only ever read
 * (pg_dump --schema-only, plus a data-only dump of the two reference tables).
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ENV_FILE = "/tmp/sqoot-test-db/env.json";
const UP = resolve(process.cwd(), "scripts/test-db/up.sh");
const DOWN = resolve(process.cwd(), "scripts/test-db/down.sh");

export default function setup() {
  const reuse = process.env["SQOOT_TEST_DB_REUSE"] === "1" && existsSync(ENV_FILE);
  if (!reuse) {
    execFileSync("bash", [UP], { stdio: "inherit", timeout: 600_000 });
  }
  const env = JSON.parse(readFileSync(ENV_FILE, "utf8")) as { supabaseUrl: string };
  process.env["SQOOT_TEST_SUPABASE_URL"] = env.supabaseUrl;

  return () => {
    if (process.env["SQOOT_TEST_DB_REUSE"] === "1") return;
    execFileSync("bash", [DOWN], { stdio: "inherit", timeout: 120_000 });
  };
}
