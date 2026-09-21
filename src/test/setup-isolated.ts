/**
 * Runs in every worker of the isolated project: repoints the Supabase server
 * client at the throwaway database before any test module is imported, then
 * refuses to continue if that did not take effect.
 */
import { readFileSync } from "node:fs";

import { assertIsolatedDatabase } from "./live-db-guard";

const env = JSON.parse(readFileSync("/tmp/sqoot-test-db/env.json", "utf8")) as {
  supabaseUrl: string;
};

process.env["SUPABASE_URL"] = env.supabaseUrl;
// PostgREST here runs with db-anon-role = service_role, so the key is only a
// placeholder: the local stack has no JWT verification and no real secret.
process.env["SUPABASE_SERVICE_ROLE_KEY"] = "local-test-database";
process.env["SUPABASE_PUBLISHABLE_KEY"] = "local-test-database";

assertIsolatedDatabase();
