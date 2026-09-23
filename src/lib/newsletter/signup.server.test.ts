/**
 * MELT signup server boundary (task T3 Phase 3).
 *
 * Runs against the throwaway test database only (see src/test/setup-isolated.ts).
 * Every test uses its own IP bucket so the rate limiter cannot leak between
 * cases, and teardown deletes only the rows this run created.
 */
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const headers: Record<string, string | undefined> = {};

vi.mock("@tanstack/react-start/server", () => ({
  getRequestHeader: (name: string) => headers[name.toLowerCase()],
}));

const { runMeltSignup, newsletterPeppered, normalizeSignupEmail } = await import(
  "./signup.server"
);
const { approvedConsent } = await import("./consent.server");
const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

const PEPPER = "test-newsletter-pepper";
const RAW_IP = "203.0.113.77";

/** Clearly test-only. It is never a production fallback: production reads consent.server.ts. */
const TEST_CONSENT = { version: "test-v1", text: "Test consent text" };

const usedHashes = new Set<string>();

/** A unique, well-formed IPv6 documentation address, so each test has its own bucket. */
function freshIp(): string {
  const hex = crypto.randomUUID().replace(/-/g, "").slice(0, 16).match(/.{4}/g)!.join(":");
  return `2001:db8:${hex}::1`;
}
const usedEmails = new Set<string>();

function validRequest(email: string, lists: string[] = ["daily-note"]) {
  usedEmails.add(email.trim().toLowerCase());
  // consentVersion is the page's comparison token (T3 Phase 6); it matches TEST_CONSENT.
  return { email, lists, source: "aurum_melt", consentVersion: "test-v1" };
}

async function useIp(ip: string | undefined) {
  if (ip === undefined) {
    delete headers["cf-connecting-ip"];
    const hash = await newsletterPeppered("unknown");
    if (hash) usedHashes.add(hash);
    return;
  }
  headers["cf-connecting-ip"] = ip;
  const hash = await newsletterPeppered(ip);
  if (hash) usedHashes.add(hash);
}

async function attemptCount(ip: string) {
  const hash = await newsletterPeppered(ip);
  const { count } = await supabaseAdmin
    .from("newsletter_attempts")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", hash!);
  return count ?? 0;
}

async function signupRow(email: string) {
  const { data } = await supabaseAdmin
    .from("newsletter_signups")
    .select("*")
    .eq("email", email)
    .maybeSingle();
  return data;
}

beforeEach(async () => {
  process.env["NEWSLETTER_HASH_PEPPER"] = PEPPER;
  await useIp(freshIp());
});

afterEach(() => {
  vi.restoreAllMocks();
});

afterAll(async () => {
  for (const email of usedEmails) {
    await supabaseAdmin.from("newsletter_signups").delete().eq("email", email);
  }
  for (const hash of usedHashes) {
    await supabaseAdmin.from("newsletter_attempts").delete().eq("ip_hash", hash);
  }
  delete process.env["NEWSLETTER_HASH_PEPPER"];
});

// ─── Production fail-closed ────────────────────────────────────────────────

describe("consent fail-closed", () => {
  it("has no approved consent wording configured", () => {
    expect(approvedConsent()).toBeNull();
  });

  it("refuses with a generic unavailable and writes no row", async () => {
    const email = `failclosed-${crypto.randomUUID()}@example.com`;
    const result = await runMeltSignup(validRequest(email));
    expect(result).toEqual({ ok: false, code: "unavailable" });
    expect(await signupRow(email)).toBeNull();
  });

  it("still counts the attempt when consent is unavailable", async () => {
    const ip = freshIp();
    await useIp(ip);
    await runMeltSignup(validRequest(`fc-${crypto.randomUUID()}@example.com`));
    expect(await attemptCount(ip)).toBe(1);
  });

  it("refuses an empty or whitespace-only injected consent snapshot", async () => {
    const email = `blank-${crypto.randomUUID()}@example.com`;
    const result = await runMeltSignup(validRequest(email), {
      consent: { version: "  ", text: "   " },
    });
    expect(result).toEqual({ ok: false, code: "unavailable" });
    expect(await signupRow(email)).toBeNull();
  });
});

// ─── Validation ────────────────────────────────────────────────────────────

describe("request validation", () => {
  const reject = async (payload: unknown) => {
    const result = await runMeltSignup(payload, { consent: TEST_CONSENT });
    expect(result).toEqual({ ok: false, code: "invalid_request" });
  };

  it("accepts a valid request", async () => {
    const email = `valid-${crypto.randomUUID()}@example.com`;
    expect(await runMeltSignup(validRequest(email), { consent: TEST_CONSENT })).toEqual({
      ok: true,
    });
  });

  it("rejects a malformed address", () => reject(validRequest("not-an-address")));
  it("rejects a missing @", () => reject(validRequest("readerexample.com")));
  it("rejects a missing domain", () => reject(validRequest("reader@")));
  it("rejects an empty address", () => reject(validRequest("")));
  it("rejects whitespace inside the address", () => reject(validRequest("rea der@example.com")));
  it("rejects a control character inside the address", () =>
    reject(validRequest("reader\u0007@example.com")));

  it("rejects an overlength address", () =>
    reject(validRequest(`${"a".repeat(250)}@example.com`)));

  it("rejects an empty preference list", () => reject(validRequest("a@example.com", [])));
  it("rejects an unsupported preference", () =>
    reject(validRequest("a@example.com", ["monthly-digest"])));
  it("rejects a missing source", () =>
    reject({ email: "a@example.com", lists: ["daily-note"] }));
  it("rejects an arbitrary source string", () =>
    reject({ email: "a@example.com", lists: ["daily-note"], source: "https://evil.test/?utm=x" }));
  it("rejects an unknown field", () =>
    reject({ ...validRequest("a@example.com"), nickname: "x" }));
  it("rejects a non-object payload", () => reject("subscribe me"));

  it("normalises surrounding whitespace and uppercase", async () => {
    const id = crypto.randomUUID();
    const email = `Mixed.Case-${id}@Example.COM`;
    usedEmails.add(`mixed.case-${id}@example.com`);
    expect(await runMeltSignup(validRequest(`  ${email}  `), { consent: TEST_CONSENT })).toEqual({
      ok: true,
    });
    expect(await signupRow(`mixed.case-${id}@example.com`)).not.toBeNull();
  });

  it("normalises control characters out of the stored address", () => {
    expect(normalizeSignupEmail(" \u0000Reader@Example.com\u001f ")).toBe("reader@example.com");
  });
});

// ─── Browser-controlled privileged fields ──────────────────────────────────

describe("the browser cannot control server-owned fields", () => {
  const privileged = [
    { consentText: "I agree to anything" },
    { consent_text: "I agree to anything" },
    { consentedAt: "1999-01-01T00:00:00.000Z" },
    { createdAt: "1999-01-01T00:00:00.000Z" },
    { updatedAt: "1999-01-01T00:00:00.000Z" },
    { ipHash: "deadbeef" },
    { ip_hash: "deadbeef" },
    { provider: "customerio" },
    { audienceId: "aud_1" },
    { status: "confirmed" },
  ];

  for (const extra of privileged) {
    const field = Object.keys(extra)[0];
    it(`rejects a payload carrying ${field}`, async () => {
      const email = `priv-${crypto.randomUUID()}@example.com`;
      const result = await runMeltSignup(
        { ...validRequest(email), ...extra },
        { consent: TEST_CONSENT },
      );
      expect(result).toEqual({ ok: false, code: "invalid_request" });
      expect(await signupRow(email)).toBeNull();
    });
  }
});

// ─── Pepper and hashing ────────────────────────────────────────────────────

describe("newsletter pepper", () => {
  it("fails closed and writes nothing when the secret is missing", async () => {
    delete process.env["NEWSLETTER_HASH_PEPPER"];
    const email = `nopepper-${crypto.randomUUID()}@example.com`;
    const result = await runMeltSignup(validRequest(email), { consent: TEST_CONSENT });
    expect(result).toEqual({ ok: false, code: "unavailable" });
    expect(await signupRow(email)).toBeNull();
  });

  it("does not fall back to the commerce pepper", async () => {
    delete process.env["NEWSLETTER_HASH_PEPPER"];
    process.env["COMMERCE_HASH_PEPPER"] = "commerce-pepper";
    expect(await newsletterPeppered("203.0.113.9")).toBeNull();
    delete process.env["COMMERCE_HASH_PEPPER"];
  });

  it("is deterministic for the same IP and pepper, and differs per pepper", async () => {
    process.env["NEWSLETTER_HASH_PEPPER"] = PEPPER;
    const a = await newsletterPeppered("198.51.100.4");
    const b = await newsletterPeppered("198.51.100.4");
    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    process.env["NEWSLETTER_HASH_PEPPER"] = "other-pepper";
    expect(await newsletterPeppered("198.51.100.4")).not.toBe(a);
    process.env["NEWSLETTER_HASH_PEPPER"] = PEPPER;
  });

  it("never stores or logs the raw IP, the email or the pepper", async () => {
    const ip = "198.51.100.200";
    await useIp(ip);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const email = `logged-${crypto.randomUUID()}@example.com`;
    await runMeltSignup(validRequest(email), { consent: TEST_CONSENT });
    await runMeltSignup(validRequest("broken"), { consent: TEST_CONSENT });

    const logged = [...warn.mock.calls, ...info.mock.calls].flat().join(" ");
    expect(logged).not.toContain(ip);
    expect(logged).not.toContain(email);
    expect(logged).not.toContain(PEPPER);
    expect(logged).toContain("[newsletter] signup refused: invalid email");

    const { data } = await supabaseAdmin.from("newsletter_attempts").select("ip_hash");
    for (const row of data ?? []) expect(row.ip_hash).not.toContain(ip);
  });
});

// ─── Rate limiting ─────────────────────────────────────────────────────────

describe("rate limiting", () => {
  it("counts every attempt, including malformed ones", async () => {
    const ip = freshIp();
    await useIp(ip);
    await runMeltSignup("nonsense", { consent: TEST_CONSENT });
    await runMeltSignup({ email: "x" }, { consent: TEST_CONSENT });
    expect(await attemptCount(ip)).toBe(2);
  });

  it("stops at the short-window threshold before any persistence", async () => {
    const ip = freshIp();
    await useIp(ip);
    const email = `burst-${crypto.randomUUID()}@example.com`;

    const codes: string[] = [];
    for (let i = 0; i < 7; i += 1) {
      const result = await runMeltSignup(validRequest(email), { consent: TEST_CONSENT });
      codes.push(result.ok ? "ok" : result.code);
    }

    // 5 allowed, then generic rate_limited with no further detail.
    expect(codes.slice(0, 5)).toEqual(["ok", "ok", "ok", "ok", "ok"]);
    expect(codes.slice(5)).toEqual(["rate_limited", "rate_limited"]);
  });

  it("applies the 24-hour threshold to attempts older than the short window", async () => {
    const ip = freshIp();
    await useIp(ip);
    const hash = (await newsletterPeppered(ip))!;

    // 21 attempts two hours ago: outside the 15-minute window, inside the day.
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    await supabaseAdmin
      .from("newsletter_attempts")
      .insert(Array.from({ length: 21 }, () => ({ ip_hash: hash, created_at: twoHoursAgo })));

    const email = `day-${crypto.randomUUID()}@example.com`;
    const result = await runMeltSignup(validRequest(email), { consent: TEST_CONSENT });
    expect(result).toEqual({ ok: false, code: "rate_limited" });
    expect(await signupRow(email)).toBeNull();
  });

  it("uses the shared bucket when cf-connecting-ip is absent", async () => {
    await useIp(undefined);
    const sharedHash = (await newsletterPeppered("unknown"))!;
    const before = await supabaseAdmin
      .from("newsletter_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", sharedHash);
    await runMeltSignup(validRequest(`shared-${crypto.randomUUID()}@example.com`), {
      consent: TEST_CONSENT,
    });
    const after = await supabaseAdmin
      .from("newsletter_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", sharedHash);
    expect((after.count ?? 0) - (before.count ?? 0)).toBe(1);
  });

  it("ignores a spoofed x-forwarded-for", async () => {
    const ip = freshIp();
    await useIp(ip);
    headers["x-forwarded-for"] = "1.2.3.4";
    await runMeltSignup(validRequest(`xff-${crypto.randomUUID()}@example.com`), {
      consent: TEST_CONSENT,
    });
    delete headers["x-forwarded-for"];

    expect(await attemptCount(ip)).toBe(1);
    const spoofHash = (await newsletterPeppered("1.2.3.4"))!;
    const { count } = await supabaseAdmin
      .from("newsletter_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", spoofHash);
    expect(count ?? 0).toBe(0);
  });
});

// ─── Persistence with injected test consent ────────────────────────────────

describe("persistence", () => {
  it("stores exactly one normalised row with the server-owned consent snapshot", async () => {
    const id = crypto.randomUUID();
    const email = `store-${id}@example.com`;
    const before = Date.now() - 1000;

    expect(
      await runMeltSignup(validRequest(`  STORE-${id}@Example.com `, ["daily-note", "weekly-brief"]), {
        consent: TEST_CONSENT,
      }),
    ).toEqual({ ok: true });

    const row = await signupRow(email);
    expect(row).not.toBeNull();
    expect(row!.email).toBe(email);
    expect([...row!.lists].sort()).toEqual(["daily-note", "weekly-brief"]);
    expect(row!.consent_version).toBe("test-v1");
    expect(row!.consent_text).toBe("Test consent text");
    expect(row!.source).toBe("aurum_melt");
    expect(new Date(row!.consented_at).getTime()).toBeGreaterThan(before);
    expect(row!.created_at).toBeTruthy();
    expect(row!.updated_at).toBeTruthy();
  });

  it("returns the same public success for a repeat signup and refreshes it in place", async () => {
    const email = `repeat-${crypto.randomUUID()}@example.com`;
    const first = await runMeltSignup(validRequest(email, ["daily-note"]), {
      consent: TEST_CONSENT,
    });
    const original = await signupRow(email);

    await new Promise((resolve) => setTimeout(resolve, 20));

    const second = await runMeltSignup(validRequest(email, ["weekly-brief"]), {
      consent: { version: "test-v2", text: "Updated test consent text" },
    });

    // Identical public result: the endpoint never says "already subscribed".
    expect(first).toEqual({ ok: true });
    expect(second).toEqual(first);

    const updated = await signupRow(email);
    expect(updated!.id).toBe(original!.id);
    expect(updated!.created_at).toBe(original!.created_at);
    expect(updated!.lists).toEqual(["weekly-brief"]);
    expect(updated!.consent_version).toBe("test-v2");
    expect(updated!.consent_text).toBe("Updated test consent text");
    expect(new Date(updated!.consented_at).getTime()).toBeGreaterThan(
      new Date(original!.consented_at).getTime(),
    );
  });

  it("keeps one row when two requests for the same address run concurrently", async () => {
    const email = `race-${crypto.randomUUID()}@example.com`;
    const results = await Promise.all([
      runMeltSignup(validRequest(email), { consent: TEST_CONSENT }),
      runMeltSignup(validRequest(email), { consent: TEST_CONSENT }),
    ]);

    // Neither caller can tell which one inserted.
    expect(results).toEqual([{ ok: true }, { ok: true }]);
    const { count } = await supabaseAdmin
      .from("newsletter_signups")
      .select("id", { count: "exact", head: true })
      .eq("email", email);
    expect(count).toBe(1);
  });

  it("returns nothing beyond ok on success", async () => {
    const result = await runMeltSignup(
      validRequest(`shape-${crypto.randomUUID()}@example.com`),
      { consent: TEST_CONSENT },
    );
    expect(Object.keys(result)).toEqual(["ok"]);
  });
});
