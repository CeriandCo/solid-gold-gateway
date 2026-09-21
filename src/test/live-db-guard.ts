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
 * Makes the live project effectively read-only for this process.
 *
 * Privileged (service-role) requests may only read: GET/HEAD, or a POST to
 * /rest/v1/rpc/, which is how PostgREST exposes read-only functions. Anything
 * that could write is rejected before it leaves the process.
 *
 * Requests made with the public anon key are left alone: the security suites
 * fire deliberate write attempts with that key to prove RLS rejects them, and
 * blocking those here would hide a real regression.
 */
export function enforceReadOnlyFetch(): void {
  const original = globalThis.fetch;
  const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];

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

    const headers = new Headers(
      typeof input === "object" && "headers" in input ? input.headers : undefined,
    );
    if (init?.headers) new Headers(init.headers).forEach((v, k) => headers.set(k, v));
    const privileged =
      Boolean(serviceKey) &&
      (headers.get("apikey") === serviceKey ||
        headers.get("Authorization") === `Bearer ${serviceKey}`);

    const live = process.env["SUPABASE_URL"];
    const touchesLive = Boolean(live) && url.startsWith(live!);
    const readOnly =
      ["GET", "HEAD", "OPTIONS"].includes(method) ||
      (method === "POST" && url.includes("/rest/v1/rpc/"));

    if (touchesLive && privileged && !readOnly) {
      throw new Error(
        `Blocked a privileged ${method} request to the live project from a read-only test suite: ${url.split("?")[0]}`,
      );
    }
    return original(input as RequestInfo, init);
  }) as typeof fetch;
}
