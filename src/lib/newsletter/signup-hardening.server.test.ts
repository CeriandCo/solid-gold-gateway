/**
 * MELT signup hardening (task T3 Phase 6), against the throwaway test database.
 *
 * Abuse, races, dependency failures, malformed requests and privacy. Each test
 * uses its own well-formed IPv6 bucket; teardown deletes only rows it created.
 */
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const headers: Record<string, string | undefined> = {};

vi.mock("@tanstack/react-start/server", () => ({
  getRequestHeader: (name: string) => headers[name.toLowerCase()],
}));

/**
 * The generated admin client is a Proxy, so vi.spyOn cannot patch it. This
 * wrapper delegates to the real client unless a test installs a fault.
 */
const faults = vi.hoisted(() => ({
  rpc: null as null | ((...args: unknown[]) => unknown),
  from: null as null | ((table: string) => unknown),
}));

vi.mock("@/integrations/supabase/client.server", async (importOriginal) => {
  const real = ((await importOriginal()) as { supabaseAdmin: { rpc: (...a: unknown[]) => unknown; from: (t: string) => unknown } }).supabaseAdmin;
  return {
    supabaseAdmin: {
      rpc: (...args: unknown[]) => (faults.rpc ? faults.rpc(...args) : real.rpc(...args)),
      from: (table: string) => (faults.from ? faults.from(table) : real.from(table)),
    },
  };
});

const { runMeltSignup, newsletterPeppered, canonicalIpBucket, UNKNOWN_BUCKET } = await import(
  "./signup.server"
);
const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

const PEPPER = "test-newsletter-pepper-phase6";
const V1 = { version: "test-v1", text: "Test consent text v1" };
const V2 = { version: "test-v2", text: "Test consent text v2" };

const usedHashes = new Set<string>();
const usedEmails = new Set<string>();

function freshIp(): string {
  const hex = crypto.randomUUID().replace(/-/g, "").slice(0, 16).match(/.{4}/g)!.join(":");
  return `2001:db8:${hex}::1`;
}

function email(tag: string): string {
  const value = `${tag}-${crypto.randomUUID()}@example.com`;
  usedEmails.add(value);
  return value;
}

function request(address: string, extra: Record<string, unknown> = {}) {
  return { email: address, lists: ["daily-note"], source: "aurum_melt", consentVersion: V1.version, ...extra };
}

async function hashOf(ip: string): Promise<string> {
  const hash = (await newsletterPeppered(canonicalIpBucket(ip)))!;
  usedHashes.add(hash);
  return hash;
}

async function useIp(ip: string): Promise<string> {
  headers["cf-connecting-ip"] = ip;
  return hashOf(ip);
}

async function attempts(hash: string): Promise<number> {
  const { count } = await supabaseAdmin
    .from("newsletter_attempts")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", hash);
  return count ?? 0;
}

async function seedAttempts(hash: string, n: number, agoMs: number) {
  const created_at = new Date(Date.now() - agoMs).toISOString();
  const rows = Array.from({ length: n }, () => ({ ip_hash: hash, created_at }));
  const { error } = await supabaseAdmin.from("newsletter_attempts").insert(rows);
  if (error) throw error;
}

async function rows(address: string) {
  const { data } = await supabaseAdmin.from("newsletter_signups").select("*").eq("email", address);
  return data ?? [];
}

const passedLimiter = (r: { ok: boolean; code?: string }) => !(r.ok === false && r.code === "rate_limited");
const MIN = 60 * 1000;

beforeEach(async () => {
  process.env["NEWSLETTER_HASH_PEPPER"] = PEPPER;
  for (const key of Object.keys(headers)) delete headers[key];
  await useIp(freshIp());
});

afterEach(() => {
  vi.restoreAllMocks();
  faults.rpc = null;
  faults.from = null;
});

/** Installs a fault for exactly one call, then falls back to the real client. */
function once<T>(fn: () => Promise<T>) {
  return () => {
    faults.rpc = null;
    return fn();
  };
}

afterAll(async () => {
  process.env["NEWSLETTER_HASH_PEPPER"] = PEPPER;
  for (const address of usedEmails) await supabaseAdmin.from("newsletter_signups").delete().eq("email", address);
  for (const hash of usedHashes) await supabaseAdmin.from("newsletter_attempts").delete().eq("ip_hash", hash);
  delete process.env["NEWSLETTER_HASH_PEPPER"];
});

// ─── B/C. Concurrency ──────────────────────────────────────────────────────

describe("rate limiter under concurrent bursts", () => {
  it("admits exactly 5 of 30 simultaneous requests from one bucket, three rounds", async () => {
    for (let round = 0; round < 3; round++) {
      const hash = await useIp(freshIp());
      const results = await Promise.all(Array.from({ length: 30 }, () => runMeltSignup({}, { consent: null })));
      console.info(`[phase6] burst round ${round}: ${results.filter(passedLimiter).length}/30 passed limiter`);
      expect(results.filter(passedLimiter)).toHaveLength(5);
      expect(await attempts(hash)).toBe(30);
    }
  });

  it("admits exactly 2 of 6 simultaneous requests after 3 prior attempts", async () => {
    for (let round = 0; round < 3; round++) {
      await useIp(freshIp());
      for (let i = 0; i < 3; i++) await runMeltSignup({}, { consent: null });
      const results = await Promise.all(Array.from({ length: 6 }, () => runMeltSignup({}, { consent: null })));
      console.info(`[phase6] near-threshold round ${round}: ${results.filter(passedLimiter).length}/6 passed limiter`);
      expect(results.filter(passedLimiter)).toHaveLength(2);
    }
  });

  it("cross-instance: 8 concurrent identical signups give one row and at most 5 successes", async () => {
    const address = email("cross");
    const results = await Promise.all(Array.from({ length: 8 }, () => runMeltSignup(request(address), { consent: V1 })));
    const ok = results.filter((r) => r.ok).length;
    expect(ok).toBe(5);
    expect(results.filter((r) => !r.ok).every((r) => !r.ok && r.code === "rate_limited")).toBe(true);
    expect(await rows(address)).toHaveLength(1);
  });

  it("separate buckets for the same address: one row, identical success", async () => {
    const address = email("multi");
    const ips = Array.from({ length: 6 }, () => freshIp());
    for (const ip of ips) await hashOf(ip);
    // The header is read synchronously when each call starts.
    const results = await Promise.all(
      ips.map((ip) => {
        headers["cf-connecting-ip"] = ip;
        return runMeltSignup(request(address), { consent: V1 });
      }),
    );
    for (const r of results) expect(r).toEqual({ ok: true });
    expect(await rows(address)).toHaveLength(1);
  });
});

// ─── D. Attempt-first ─────────────────────────────────────────────────────

describe("attempt-first ordering", () => {
  it("malformed requests consume quota and a later valid request is limited", async () => {
    const hash = (await hashOf(headers["cf-connecting-ip"]!))!;
    for (let i = 0; i < 5; i++) expect(await runMeltSignup({ junk: i }, { consent: V1 })).toEqual({ ok: false, code: "invalid_request" });
    expect(await attempts(hash)).toBe(5);
    const address = email("after-junk");
    expect(await runMeltSignup(request(address), { consent: V1 })).toEqual({ ok: false, code: "rate_limited" });
    expect(await rows(address)).toHaveLength(0);
  });
});

// ─── E. Boundaries (DB fixtures, no sleeps) ───────────────────────────────

describe("rate-limit boundaries", () => {
  it("requests 1–5 pass, 6 is limited", async () => {
    const results = [];
    for (let i = 0; i < 6; i++) results.push(await runMeltSignup({}, { consent: null }));
    expect(results.slice(0, 5).every(passedLimiter)).toBe(true);
    expect(results[5]).toEqual({ ok: false, code: "rate_limited" });
  });

  it("attempts just outside 15 minutes do not count toward the short window", async () => {
    const hash = await hashOf(headers["cf-connecting-ip"]!);
    await seedAttempts(hash, 5, 15 * MIN + 10_000);
    expect(passedLimiter(await runMeltSignup({}, { consent: null }))).toBe(true);
  });

  it("attempts just inside 15 minutes do count", async () => {
    const hash = await hashOf(headers["cf-connecting-ip"]!);
    await seedAttempts(hash, 5, 15 * MIN - 30_000);
    expect(await runMeltSignup({}, { consent: null })).toEqual({ ok: false, code: "rate_limited" });
  });

  it("the 20th attempt in 24h passes and the 21st is limited", async () => {
    const hash = await hashOf(headers["cf-connecting-ip"]!);
    await seedAttempts(hash, 19, 60 * MIN);
    expect(passedLimiter(await runMeltSignup({}, { consent: null }))).toBe(true);
    expect(await runMeltSignup({}, { consent: null })).toEqual({ ok: false, code: "rate_limited" });
  });

  it("attempts just outside 24 hours do not count", async () => {
    const hash = await hashOf(headers["cf-connecting-ip"]!);
    await seedAttempts(hash, 25, 24 * 60 * MIN + 10_000);
    expect(passedLimiter(await runMeltSignup({}, { consent: null }))).toBe(true);
  });

  it("attempts just inside 24 hours do count", async () => {
    const hash = await hashOf(headers["cf-connecting-ip"]!);
    await seedAttempts(hash, 20, 24 * 60 * MIN - 60_000);
    expect(await runMeltSignup({}, { consent: null })).toEqual({ ok: false, code: "rate_limited" });
  });

  it("short and daily windows interact: short quota free but daily exhausted still limits", async () => {
    const hash = await hashOf(headers["cf-connecting-ip"]!);
    await seedAttempts(hash, 16, 2 * 60 * MIN);
    for (let i = 0; i < 4; i++) expect(passedLimiter(await runMeltSignup({}, { consent: null }))).toBe(true);
    expect(await runMeltSignup({}, { consent: null })).toEqual({ ok: false, code: "rate_limited" });
  });
});

// ─── F/G. Trusted IP header ────────────────────────────────────────────────

describe("trusted IP header normalisation", () => {
  it.each([
    ["absent", undefined],
    ["empty", ""],
    ["whitespace only", "   "],
    ["absurdly long", "1".repeat(5000)],
    ["control characters", "1.2.3.4\u0000\n"],
    ["comma list", "1.2.3.4, 5.6.7.8"],
    ["not an address", "evil-host"],
  ])("%s falls into the shared bucket", (_label, raw) => {
    expect(canonicalIpBucket(raw)).toBe(UNKNOWN_BUCKET);
  });

  it("trims and lowercases a valid address", () => {
    expect(canonicalIpBucket(" 1.2.3.4 ")).toBe("1.2.3.4");
    expect(canonicalIpBucket("2001:DB8::A")).toBe("2001:db8::a");
  });

  it("whitespace variants of one IPv4 share a bucket in the database", async () => {
    const hash = await useIp("198.51.100.201");
    const before = await attempts(hash);
    headers["cf-connecting-ip"] = "  198.51.100.201\t";
    await runMeltSignup({}, { consent: null });
    expect(await attempts(hash)).toBe(before + 1);
  });

  it("ignores spoofed x-forwarded-for and x-real-ip", async () => {
    const hash = await hashOf(headers["cf-connecting-ip"]!);
    headers["x-forwarded-for"] = "9.9.9.9";
    headers["x-real-ip"] = "8.8.8.8";
    await runMeltSignup({}, { consent: null });
    expect(await attempts(hash)).toBe(1);
    expect(await attempts(await hashOf("9.9.9.9"))).toBe(0);
    expect(await attempts(await hashOf("8.8.8.8"))).toBe(0);
  });
});

// ─── H. Pepper ────────────────────────────────────────────────────────────

describe("pepper failure modes", () => {
  it.each([
    ["missing", undefined],
    ["empty", ""],
    ["whitespace only", "   \t"],
  ])("%s → generic unavailable, no attempt, no row", async (_label, value) => {
    const hash = await hashOf(headers["cf-connecting-ip"]!);
    if (value === undefined) delete process.env["NEWSLETTER_HASH_PEPPER"];
    else process.env["NEWSLETTER_HASH_PEPPER"] = value;
    const address = email("pepper");
    const result = await runMeltSignup(request(address), { consent: V1 });
    process.env["NEWSLETTER_HASH_PEPPER"] = PEPPER;
    expect(result).toEqual({ ok: false, code: "unavailable" });
    expect(JSON.stringify(result)).not.toContain("PEPPER");
    expect(await rows(address)).toHaveLength(0);
    expect(await attempts(hash)).toBe(0);
  });

  it("valid pepper works", async () => {
    const address = email("pepper-ok");
    expect(await runMeltSignup(request(address), { consent: V1 })).toEqual({ ok: true });
  });
});

// ─── I/J/K. Dependency failures ────────────────────────────────────────────

describe("dependency failures fail closed", () => {
  it("limiter returns an error → unavailable, no row", async () => {
    faults.rpc = once(async () => ({
      data: null,
      error: { message: "relation newsletter_attempts does not exist", code: "42P01" },
    }));
    const address = email("rpc-err");
    const result = await runMeltSignup(request(address), { consent: V1 });
    expect(result).toEqual({ ok: false, code: "unavailable" });
    expect(JSON.stringify(result)).not.toMatch(/newsletter|42P01|relation/);
    expect(await rows(address)).toHaveLength(0);
  });

  it("limiter returns a non-boolean → unavailable, no row", async () => {
    faults.rpc = once(async () => ({ data: null, error: null }));
    const address = email("rpc-null");
    expect(await runMeltSignup(request(address), { consent: V1 })).toEqual({ ok: false, code: "unavailable" });
    expect(await rows(address)).toHaveLength(0);
  });

  it("limiter throws (timeout) → unavailable, no row", async () => {
    faults.rpc = once(async () => {
      throw new Error("timeout contacting service_role at db");
    });
    const address = email("rpc-throw");
    const result = await runMeltSignup(request(address), { consent: V1 });
    expect(result).toEqual({ ok: false, code: "unavailable" });
    expect(await rows(address)).toHaveLength(0);
  });

  it("signup upsert error → unavailable, no row, attempt kept", async () => {
    const hash = await hashOf(headers["cf-connecting-ip"]!);
    faults.from = (table) =>
      table === "newsletter_signups"
        ? { upsert: async () => ({ error: { code: "23514", message: "violates check newsletter_signups_email" } }) }
        : null;
    const address = email("upsert-err");
    const result = await runMeltSignup(request(address), { consent: V1 });
    faults.from = null;
    expect(result).toEqual({ ok: false, code: "unavailable" });
    expect(JSON.stringify(result)).not.toMatch(/23514|newsletter_signups|check/);
    expect(await rows(address)).toHaveLength(0);
    expect(await attempts(hash)).toBe(1);
  });

  it("an unexpected throw during persistence → unavailable with no internals", async () => {
    faults.from = () => {
      throw new Error("SELECT * FROM newsletter_signups; key=SUPABASE_SERVICE_ROLE_KEY");
    };
    const address = email("throw");
    const result = await runMeltSignup(request(address), { consent: V1 });
    expect(result).toEqual({ ok: false, code: "unavailable" });
    const body = JSON.stringify(result);
    for (const leak of ["SELECT", "newsletter", "SERVICE_ROLE", address, "2001:db8", "stack"]) expect(body).not.toContain(leak);
  });

  it("the single upsert is atomic: an invalid row is refused whole by the database", async () => {
    const address = email("atomic");
    const { error } = await supabaseAdmin.from("newsletter_signups").upsert(
      { email: address, lists: [], consent_version: V1.version, consent_text: V1.text, consented_at: new Date().toISOString(), source: "aurum_melt" },
      { onConflict: "email" },
    );
    expect(error).not.toBeNull();
    expect(await rows(address)).toHaveLength(0);
  });
});

// ─── L. Enumeration ───────────────────────────────────────────────────────

describe("enumeration", () => {
  it("new and repeat signup return byte-identical results and leak no id", async () => {
    const address = email("enum");
    const first = await runMeltSignup(request(address), { consent: V1 });
    const second = await runMeltSignup(request(address), { consent: V1 });
    expect(JSON.stringify(first)).toBe(JSON.stringify({ ok: true }));
    expect(JSON.stringify(second)).toBe(JSON.stringify(first));
  });
});

// ─── M. Adversarial validation ────────────────────────────────────────────

describe("adversarial inputs", () => {
  const address = "adv@example.com";
  const cases: [string, unknown][] = [
    ["empty object", {}],
    ["null", null],
    ["undefined", undefined],
    ["number", 42],
    ["array payload", [request(address)]],
    ["array as email", { ...request(address), email: [address] }],
    ["object as email", { ...request(address), email: { toString: address } }],
    ["huge email", { ...request(address), email: `${"a".repeat(100_000)}@example.com` }],
    ["huge source", { ...request(address), source: "s".repeat(100_000) }],
    ["huge list array", { ...request(address), lists: Array(10_000).fill("daily-note") }],
    ["three duplicate lists", { ...request(address), lists: ["daily-note", "daily-note", "daily-note"] }],
    ["unsupported list", { ...request(address), lists: ["vip"] }],
    ["control chars", { ...request(address), email: "adv\u0007@example.com" }],
    ["extra field", { ...request(address), role: "admin" }],
    ["nested structure", { ...request(address), lists: [["daily-note"]] }],
    ["overlong version token", { ...request(address), consentVersion: "v".repeat(500) }],
    ["prototype pollution", JSON.parse('{"__proto__":{"ok":true},"email":"adv@example.com","lists":["daily-note"],"source":"aurum_melt"}')],
  ];

  it.each(cases)("%s → invalid_request, attempt counted, no row", async (_label, payload) => {
    const hash = await hashOf(headers["cf-connecting-ip"]!);
    const result = await runMeltSignup(payload, { consent: V1 });
    expect(result).toEqual({ ok: false, code: "invalid_request" });
    expect(await attempts(hash)).toBe(1);
    expect(await rows(address)).toHaveLength(0);
  });
});

// ─── O. Preference canonicalisation ───────────────────────────────────────

describe("preference canonicalisation", () => {
  it("stores both orders identically and deduplicates", async () => {
    const address = email("order");
    await runMeltSignup(request(address, { lists: ["weekly-brief", "daily-note"] }), { consent: V1 });
    expect((await rows(address))[0].lists).toEqual(["daily-note", "weekly-brief"]);
    const before = (await rows(address))[0];
    await runMeltSignup(request(address, { lists: ["daily-note", "weekly-brief"] }), { consent: V1 });
    const after = await rows(address);
    expect(after).toHaveLength(1);
    expect(after[0].lists).toEqual(["daily-note", "weekly-brief"]);
    expect(after[0].created_at).toBe(before.created_at);

    const dup = email("dup");
    await runMeltSignup(request(dup, { lists: ["weekly-brief", "weekly-brief"] }), { consent: V1 });
    expect((await rows(dup))[0].lists).toEqual(["weekly-brief"]);
  });
});

// ─── P/Q. Consent snapshot and stale pages ────────────────────────────────

describe("consent snapshot", () => {
  it("reads the consent object once and never stores a hybrid", async () => {
    let reads = 0;
    const deps = {
      get consent() {
        reads += 1;
        return reads === 1 ? V1 : V2;
      },
    };
    const address = email("snapshot");
    expect(await runMeltSignup(request(address), deps)).toEqual({ ok: true });
    expect(reads).toBe(1);
    const [row] = await rows(address);
    expect([row.consent_version, row.consent_text]).toEqual([V1.version, V1.text]);
  });

  it("a stale page (rendered v1, server now v2) is refused and nothing is stored", async () => {
    const address = email("stale");
    expect(await runMeltSignup(request(address), { consent: V2 })).toEqual({ ok: false, code: "unavailable" });
    expect(await rows(address)).toHaveLength(0);
  });

  it("a missing version token is refused once consent is live", async () => {
    const address = email("no-token");
    const { consentVersion: _drop, ...payload } = request(address);
    expect(await runMeltSignup(payload, { consent: V1 })).toEqual({ ok: false, code: "unavailable" });
    expect(await rows(address)).toHaveLength(0);
  });

  it("a browser-chosen version cannot activate signup while consent is off", async () => {
    const address = email("forge");
    expect(await runMeltSignup(request(address, { consentVersion: "anything" }), { consent: null })).toEqual({
      ok: false,
      code: "unavailable",
    });
    expect(await rows(address)).toHaveLength(0);
  });

  it("a matching token stores the server's own snapshot", async () => {
    const address = email("match");
    expect(await runMeltSignup(request(address, { consentVersion: V2.version }), { consent: V2 })).toEqual({ ok: true });
    const [row] = await rows(address);
    expect([row.consent_version, row.consent_text]).toEqual([V2.version, V2.text]);
  });
});

// ─── R. Retry ─────────────────────────────────────────────────────────────

describe("retry after failure", () => {
  it("failed attempt counts, retry succeeds once, one row", async () => {
    const hash = await hashOf(headers["cf-connecting-ip"]!);
    const address = email("retry");
    faults.rpc = once(async () => {
      throw new Error("network");
    });
    expect(await runMeltSignup(request(address), { consent: V1 })).toEqual({ ok: false, code: "unavailable" });
    vi.restoreAllMocks();
    faults.from = () => ({ upsert: async () => ({ error: { code: "57014" } }) });
    expect(await runMeltSignup(request(address), { consent: V1 })).toEqual({ ok: false, code: "unavailable" });
    faults.from = null;
    expect(await runMeltSignup(request(address), { consent: V1 })).toEqual({ ok: true });
    expect(await runMeltSignup(request(address), { consent: V1 })).toEqual({ ok: true });
    expect(await rows(address)).toHaveLength(1);
    // The mocked-away limiter call recorded nothing; the three real calls did.
    expect(await attempts(hash)).toBe(3);
  });
});

// ─── U/V. Logging and stored-data privacy ─────────────────────────────────

describe("privacy", () => {
  it("logs contain no email, IP, hash, pepper or consent text across every outcome", async () => {
    const logged: string[] = [];
    for (const level of ["log", "info", "warn", "error", "debug"] as const) {
      vi.spyOn(console, level).mockImplementation((...args: unknown[]) => {
        logged.push(args.map(String).join(" "));
      });
    }
    const ip = headers["cf-connecting-ip"]!;
    const hash = await hashOf(ip);
    const address = email("log");
    await runMeltSignup(request(address), { consent: V1 });
    await runMeltSignup(request(address), { consent: V2 });
    await runMeltSignup({ email: address }, { consent: V1 });
    await runMeltSignup(request(address), { consent: null });
    faults.rpc = once(async () => {
      throw new Error(`boom ${address}`);
    });
    await runMeltSignup(request(address), { consent: V1 });
    const all = logged.join("\n");
    expect(logged.length).toBeGreaterThan(0);
    for (const secret of [address, ip, hash, PEPPER, V1.text, V2.text, "boom"]) expect(all).not.toContain(secret);
  });

  it("stored rows hold only the promised columns", async () => {
    const address = email("cols");
    await runMeltSignup(request(address), { consent: V1 });
    const [row] = await rows(address);
    expect(Object.keys(row).sort()).toEqual(
      ["consent_text", "consent_version", "consented_at", "created_at", "email", "id", "lists", "source", "updated_at"].sort(),
    );
    const hash = await hashOf(headers["cf-connecting-ip"]!);
    const { data } = await supabaseAdmin.from("newsletter_attempts").select("*").eq("ip_hash", hash).limit(1);
    expect(Object.keys(data![0]).sort()).toEqual(["created_at", "id", "ip_hash"]);
    expect(data![0].ip_hash).toMatch(/^[0-9a-f]{64}$/);
  });
});
