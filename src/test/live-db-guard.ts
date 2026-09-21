/**
 * Hard guard: no test process may be pointed at the live project database.
 *
 * Isolation is the primary protection (the commerce suites run against a
 * throwaway Postgres + PostgREST pair created per run). This guard exists so
 * that a misconfigured run fails loudly instead of silently writing to the
 * operator's data.
 */

export const LIVE_DB_OPT_IN = "ALLOW_LIVE_DB_TESTS";

const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost", "[::1]"]);

export function isLocalSupabaseUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    return LOCAL_HOSTS.has(new URL(url).hostname);
  } catch {
    return false;
  }
}

/** Throws unless the process is pointed at a local, throwaway database. */
export function assertIsolatedDatabase(): void {
  const url = process.env["SUPABASE_URL"];
  if (isLocalSupabaseUrl(url)) return;
  throw new Error(
    `Refusing to run: SUPABASE_URL does not point at a local test database. ` +
      `Start it with scripts/test-db/up.sh (the vitest global setup does this ` +
      `automatically). Live-database suites must run in the 'live-readonly' ` +
      `project, or with ${LIVE_DB_OPT_IN}=1 for the write suites.`,
  );
}

/** Throws unless the operator explicitly opted in to touching the live project. */
export function assertLiveOptIn(): void {
  if (process.env[LIVE_DB_OPT_IN] === "1") return;
  throw new Error(
    `Refusing to run a live-database suite without ${LIVE_DB_OPT_IN}=1.`,
  );
}

/**
 * Makes the live project physically read-only for this process: any REST or
 * auth request that is not a GET/HEAD is rejected before it leaves the
 * process. Used by the read-only live suites so they cannot regress into
 * writing.
 */
export function enforceReadOnlyFetch(): void {
  const original = globalThis.fetch;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const method = (
      init?.method ??
      (typeof input === "object" && "method" in input ? input.method : "GET") ??
      "GET"
    ).toUpperCase();
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;

    const live = process.env["SUPABASE_URL"];
    const touchesLive = Boolean(live) && url.startsWith(live!);
    if (touchesLive && !["GET", "HEAD", "OPTIONS"].includes(method)) {
      throw new Error(
        `Blocked a ${method} request to the live project from a read-only test suite: ${url.split("?")[0]}`,
      );
    }
    return original(input as RequestInfo, init);
  }) as typeof fetch;
}
