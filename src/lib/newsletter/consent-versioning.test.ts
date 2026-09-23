/**
 * MELT consent activation, versioning and rollback contract (task T3 Phase 5).
 *
 * Runs against the throwaway test database only (see src/test/setup-isolated.ts).
 * Every test uses its own IP bucket and deletes only rows it created.
 */
import { readFileSync } from "node:fs";

import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const headers: Record<string, string | undefined> = {};

vi.mock("@tanstack/react-start/server", () => ({
  getRequestHeader: (name: string) => headers[name.toLowerCase()],
}));

const { runMeltSignup, newsletterPeppered } = await import("./signup.server");
const {
  approvedConsent,
  isUsableConsent,
  projectConsent,
  publicConsentNotice,
  CONSENT_TEXT_MAX,
  CONSENT_VERSION_MAX,
} = await import("./consent.server");
const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

const PEPPER = "test-newsletter-pepper";

/** Clearly test-only snapshots. Production reads consent.server.ts and never these. */
const V1 = { version: "test-v1", text: "Test consent text v1." };
const V2 = { version: "test-v2", text: "Test consent text v2, materially different." };

const usedHashes = new Set<string>();
const usedEmails = new Set<string>();

function request(email: string, lists: string[] = ["daily-note"]) {
  usedEmails.add(email.trim().toLowerCase());
  return { email, lists, source: "aurum_melt" };
}

async function useIp(ip: string) {
  headers["cf-connecting-ip"] = ip;
  const hash = await newsletterPeppered(ip);
  if (hash) usedHashes.add(hash);
}

async function row(email: string) {
  const { data } = await supabaseAdmin
    .from("newsletter_signups")
    .select("*")
    .eq("email", email)
    .maybeSingle();
  return data;
}

beforeEach(async () => {
  process.env["NEWSLETTER_HASH_PEPPER"] = PEPPER;
  await useIp(`consent-${crypto.randomUUID()}`);
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

// ─── Configuration ─────────────────────────────────────────────────────────

describe("consent configuration", () => {
  it("is not configured in production, so signup is disabled", () => {
    expect(approvedConsent()).toBeNull();
    expect(publicConsentNotice()).toBeNull();
  });

  it("accepts a well-formed definition", () => {
    expect(isUsableConsent(V1)).toBe(true);
  });

  it.each([
    ["absent", null],
    ["undefined", undefined],
    ["empty version", { version: "", text: "ok" }],
    ["empty text", { version: "v", text: "" }],
    ["whitespace-only version", { version: "   ", text: "ok" }],
    ["whitespace-only text", { version: "v", text: "  \n " }],
    ["untrimmed version", { version: " v ", text: "ok" }],
    ["untrimmed text", { version: "v", text: " ok " }],
    ["oversized version", { version: "v".repeat(CONSENT_VERSION_MAX + 1), text: "ok" }],
    ["oversized text", { version: "v", text: "t".repeat(CONSENT_TEXT_MAX + 1) }],
    ["control characters in text", { version: "v", text: "ok\u0000bad" }],
    ["newline in version", { version: "v\n2", text: "ok" }],
    ["non-string values", { version: 1 as unknown as string, text: "ok" }],
  ])("refuses a %s definition", (_label, candidate) => {
    expect(isUsableConsent(candidate as never)).toBe(false);
    expect(projectConsent(candidate as never)).toBeNull();
  });

  it("makes a malformed definition unavailable rather than partially stored", async () => {
    const email = `malformed-${crypto.randomUUID()}@example.com`;
    const result = await runMeltSignup(request(email), {
      consent: { version: " untrimmed ", text: "Something" },
    });
    expect(result).toEqual({ ok: false, code: "unavailable" });
    expect(await row(email)).toBeNull();
  });
});

// ─── Displayed / stored parity ─────────────────────────────────────────────

describe("displayed and stored consent parity", () => {
  it("projects exactly the configured text and nothing else", () => {
    expect(projectConsent(V1)).toEqual({ text: V1.text });
    expect(Object.keys(projectConsent(V1)!)).toEqual(["text"]);
  });

  it("stores byte-for-byte the text the visitor was shown", async () => {
    const email = `parity-${crypto.randomUUID()}@example.com`;
    const shown = projectConsent(V1)!;
    expect(await runMeltSignup(request(email), { consent: V1 })).toEqual({ ok: true });

    const stored = await row(email);
    expect(stored?.consent_text).toBe(shown.text);
    expect(stored?.consent_version).toBe(V1.version);
  });

  it("ignores consent fields supplied by the browser", async () => {
    const email = `override-${crypto.randomUUID()}@example.com`;
    const result = await runMeltSignup(
      {
        ...request(email),
        consent_text: "attacker text",
        consent_version: "attacker-v9",
        consented_at: "1999-01-01T00:00:00Z",
      },
      { consent: V1 },
    );
    expect(result).toEqual({ ok: false, code: "invalid_request" });
    expect(await row(email)).toBeNull();
  });
});

// ─── Version changes and historical evidence ───────────────────────────────

describe("version changes", () => {
  it("keeps old evidence intact and re-consents a returning address", async () => {
    const older = `older-${crypto.randomUUID()}@example.com`;
    const returning = `returning-${crypto.randomUUID()}@example.com`;

    expect(await runMeltSignup(request(older), { consent: V1 })).toEqual({ ok: true });
    expect(await runMeltSignup(request(returning), { consent: V1 })).toEqual({ ok: true });
    const first = await row(returning);
    expect(first?.consent_version).toBe(V1.version);

    // Wording is revised: a new signup records v2.
    const fresh = `fresh-${crypto.randomUUID()}@example.com`;
    expect(await runMeltSignup(request(fresh), { consent: V2 })).toEqual({ ok: true });
    expect((await row(fresh))?.consent_text).toBe(V2.text);

    // The returning address re-consents in place.
    expect(
      await runMeltSignup(request(returning, ["daily-note", "weekly-brief"]), { consent: V2 }),
    ).toEqual({ ok: true });
    const second = await row(returning);
    expect(second?.id).toBe(first?.id);
    expect(second?.created_at).toBe(first?.created_at);
    expect(second?.consent_version).toBe(V2.version);
    expect(second?.consent_text).toBe(V2.text);
    expect(second?.lists).toEqual(["daily-note", "weekly-brief"]);
    expect(new Date(second!.consented_at).getTime()).toBeGreaterThanOrEqual(
      new Date(first!.consented_at).getTime(),
    );

    // An unrelated row is untouched by the version change.
    const untouched = await row(older);
    expect(untouched?.consent_version).toBe(V1.version);
    expect(untouched?.consent_text).toBe(V1.text);
  });
});

// ─── Repeat signup under the same version ──────────────────────────────────

describe("repeat signup under the same version", () => {
  it("returns the identical public result and refreshes the submission", async () => {
    const email = `repeat-${crypto.randomUUID()}@example.com`;
    const firstResult = await runMeltSignup(request(email), { consent: V1 });
    const first = await row(email);

    await new Promise((resolve) => setTimeout(resolve, 15));
    const secondResult = await runMeltSignup(request(email, ["weekly-brief"]), { consent: V1 });
    const second = await row(email);

    // No enumeration: a known address is indistinguishable from a new one.
    expect(secondResult).toEqual(firstResult);
    expect(secondResult).toEqual({ ok: true });
    expect(Object.keys(secondResult)).toEqual(["ok"]);

    expect(second?.id).toBe(first?.id);
    expect(second?.created_at).toBe(first?.created_at);
    expect(second?.lists).toEqual(["weekly-brief"]);
    expect(new Date(second!.consented_at).getTime()).toBeGreaterThan(
      new Date(first!.consented_at).getTime(),
    );
  });
});

// ─── Rollback ──────────────────────────────────────────────────────────────

describe("rollback to unconfigured", () => {
  it("stops new signups, hides the wording and preserves stored evidence", async () => {
    const existing = `rollback-${crypto.randomUUID()}@example.com`;
    expect(await runMeltSignup(request(existing), { consent: V1 })).toEqual({ ok: true });
    const before = await row(existing);

    // Withdrawal is a single change: the configuration becomes unavailable.
    expect(projectConsent(null)).toBeNull();

    const fresh = `rollback-new-${crypto.randomUUID()}@example.com`;
    expect(await runMeltSignup(request(fresh), { consent: null })).toEqual({
      ok: false,
      code: "unavailable",
    });
    expect(await row(fresh)).toBeNull();

    // A returning address cannot overwrite its evidence either.
    expect(await runMeltSignup(request(existing), { consent: null })).toEqual({
      ok: false,
      code: "unavailable",
    });
    expect(await row(existing)).toEqual(before);
  });
});

// ─── Structural safety ─────────────────────────────────────────────────────

describe("structural safety", () => {
  const consentSource = readFileSync("src/lib/newsletter/consent.server.ts", "utf8");
  const componentSource = readFileSync("src/components/aurum-subscribe-section.tsx", "utf8");
  const formStateSource = readFileSync("src/lib/newsletter/form-state.ts", "utf8");

  it("has exactly one authoritative production definition, set to null", () => {
    expect(consentSource).toMatch(/const APPROVED_CONSENT = null as NewsletterConsent \| null;/);
    expect(consentSource).not.toMatch(/process\.env/);
  });

  it("carries no placeholder or test wording as a production fallback", () => {
    for (const forbidden of ["CLIENT-APPROVED", "CLIENT APPROVED", "lorem", "test-v1", "Test consent text"]) {
      expect(consentSource.toLowerCase()).not.toContain(forbidden.toLowerCase());
    }
  });

  it("renders consent as plain text with no HTML injection", () => {
    expect(componentSource).not.toContain("dangerouslySetInnerHTML");
    expect(componentSource).toContain('className="aurum-subscribe__consent">{consentNotice.text}');
  });

  it("keeps the browser non-authoritative: it displays text and never sends it", () => {
    expect(componentSource).toContain("consentNotice");
    expect(componentSource).not.toMatch(/consent_text|consentVersion|CONSENT_TEXT/);
    expect(formStateSource).not.toMatch(/consent/i);
  });

  it("introduces no provider, confirmation or double-opt-in machinery", () => {
    const combined = `${consentSource}\n${componentSource}`.toLowerCase();
    for (const forbidden of [
      "customer.io",
      "mailchimp",
      "klaviyo",
      "brevo",
      "mailerlite",
      "audience_id",
      "provider_id",
      "double opt-in",
      "confirmation_token",
      "confirmed_at",
    ]) {
      expect(combined).not.toContain(forbidden);
    }
  });
});
