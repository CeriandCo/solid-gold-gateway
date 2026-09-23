/**
 * MELT newsletter signup — the secure public server boundary (task T3 Phase 3).
 *
 * untrusted request → rate limit → strict validation → server-owned consent →
 * atomic local upsert.
 *
 * Nothing here calls a newsletter provider: none has been chosen. Nothing here
 * can persist while the approved consent wording is missing. The browser never
 * supplies consent text, consent time, timestamps, the IP hash or any status.
 */
import { z } from "zod";
import { getRequestHeader } from "@tanstack/react-start/server";

import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { isValidEmail, normalizeEmail } from "../admin.server";
import { approvedConsent, isUsableConsent, type NewsletterConsent } from "./consent.server";
import { MELT_LISTS, MELT_SOURCE, type NewsletterResult } from "./types";

/**
 * Operational defaults, not a product or client decision: no newsletter limits
 * have been specified anywhere in the repository. Commerce checkout uses
 * 10 / 15 min and 30 / day; a newsletter signup is far less frequent, so these
 * are deliberately tighter. One place to change them.
 */
const RATE_SHORT_WINDOW_MS = 15 * 60 * 1000;
const RATE_DAY_WINDOW_MS = 24 * 60 * 60 * 1000;
const SIGNUP_SHORT_MAX = 5;
const SIGNUP_DAY_MAX = 20;

/** Longest address the database will store, enforced here first. */
const EMAIL_MAX = 254;

/**
 * `.strict()` — anything else in the payload (a consent snapshot, a timestamp,
 * an ip hash, a provider field, a status) is rejected outright rather than
 * silently dropped. `lists` is allowlisted to our own content choices and must
 * carry at least one, mirroring the database constraint.
 */
const signupInput = z
  .object({
    email: z.string().min(1).max(1000),
    lists: z.array(z.enum(MELT_LISTS)).min(1).max(MELT_LISTS.length),
    source: z.literal(MELT_SOURCE),
    /**
     * Non-authoritative comparison token (task T3 Phase 6): the consent version
     * the page was rendered with. It is never stored and can never choose the
     * wording or version — it only lets the server refuse a stale page.
     */
    consentVersion: z.string().min(1).max(80).optional(),
  })
  .strict();

/** Coded operational logging only: never the email, the raw IP, the hash, the pepper or the payload. */
function refuse(reason: string): void {
  console.warn(`[newsletter] signup refused: ${reason}`);
}

/**
 * Salted SHA-256, same shape as the commerce helper but with its own secret.
 * A separate pepper means a leak of one subsystem's secret cannot be used to
 * link newsletter identifiers to commerce ones. Returns null when the secret is
 * absent — there is no unhashed, empty-pepper or commerce-pepper fallback.
 */
export async function newsletterPeppered(value: string): Promise<string | null> {
  const pepper = process.env["NEWSLETTER_HASH_PEPPER"];
  if (!pepper || pepper.trim().length === 0) return null;
  const bytes = new TextEncoder().encode(`${pepper}:${value}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Cloudflare overwrites CF-Connecting-IP at its own edge, so unlike an
 * X-Forwarded-For chain it cannot be spoofed by the caller. It is the only
 * header read here. When absent, every such request shares one bucket: the
 * limiter still applies, it never fails open.
 */
function clientIpBucket(): string {
  const bucket = canonicalIpBucket(getRequestHeader("cf-connecting-ip"));
  if (bucket === UNKNOWN_BUCKET) {
    console.warn("[newsletter] cf-connecting-ip missing or malformed; using the shared rate-limit bucket");
  }
  return bucket;
}

export const UNKNOWN_BUCKET = "unknown";
/** Longest textual IPv6 form (IPv4-mapped) is 45 characters. */
const IP_MAX = 45;

/**
 * Minimal canonicalisation of the one trusted header (task T3 Phase 6): trim,
 * lowercase (IPv6 hex case), and accept only IPv4/IPv6 characters. Anything
 * else — empty, whitespace, control characters, a comma list, an overlong
 * value — falls into the shared bucket rather than minting a fresh identity
 * per variant. Not a networking library: equivalent IPv6 spellings such as
 * `::1` and `0:0:0:0:0:0:0:1` still hash differently.
 */
export function canonicalIpBucket(raw: string | null | undefined): string {
  if (typeof raw !== "string") return UNKNOWN_BUCKET;
  const value = raw.trim().toLowerCase();
  if (value.length === 0 || value.length > IP_MAX) return UNKNOWN_BUCKET;
  if (!/^[0-9a-f:.]+$/.test(value)) return UNKNOWN_BUCKET;
  if (!value.includes(".") && !value.includes(":")) return UNKNOWN_BUCKET;
  return value;
}

/**
 * Records the attempt and reports whether this caller is over a limit, in one
 * database call (task T3 Phase 6). The primitive takes a per-bucket advisory
 * lock, inserts, then counts both windows, so concurrent requests from one
 * bucket are serialised and each sees an exact count. The earlier
 * insert-then-count version let a burst see each other's inserts and refuse
 * requests that were still within the limit.
 *
 * Fails CLOSED: if the limiter cannot give an answer, the caller is treated as
 * limited-unavailable and nothing is persisted.
 */
async function recordAndCheckRate(ipHash: string): Promise<"allowed" | "limited" | "error"> {
  const { data, error } = await supabaseAdmin.rpc("newsletter_rate_check", {
    _ip_hash: ipHash,
    _short_max: SIGNUP_SHORT_MAX,
    _day_max: SIGNUP_DAY_MAX,
    _short_seconds: RATE_SHORT_WINDOW_MS / 1000,
    _day_seconds: RATE_DAY_WINDOW_MS / 1000,
  });
  if (error || typeof data !== "boolean") return "error";
  return data ? "limited" : "allowed";
}

/** Control characters, as stripped by the Stripe webhook helper. */
export const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;

/** Strips control characters, trims and lowercases, matching the safest existing precedent. */
export function normalizeSignupEmail(value: string): string {
  return normalizeEmail(value.replace(/[\u0000-\u001f\u007f]/g, ""));
}

export type MeltSignupDeps = {
  /** Approved consent snapshot, or null. Tests inject their own; production reads the module. */
  consent: NewsletterConsent | null;
};

/**
 * Handles one public MELT signup request.
 *
 * The result is deliberately identical for a new and an existing subscriber, so
 * the endpoint cannot be used to discover who is on the list.
 */
export async function runMeltSignup(
  data: unknown,
  deps: MeltSignupDeps = { consent: approvedConsent() },
): Promise<NewsletterResult> {
  // Any unexpected throw becomes the same generic refusal: no stack, SQL,
  // table name, secret name, email or IP ever leaves the server.
  try {
    return await signup(data, deps);
  } catch {
    refuse("unexpected error");
    return { ok: false, code: "unavailable" };
  }
}

async function signup(data: unknown, deps: MeltSignupDeps): Promise<NewsletterResult> {
  // 1. Trusted IP bucket and the newsletter pepper, before any other work.
  //    Without the secret we cannot account for abuse at all, so we stop.
  const ipHash = await newsletterPeppered(clientIpBucket());
  if (!ipHash) {
    refuse("pepper missing");
    return { ok: false, code: "unavailable" };
  }

  // 2. Every request costs quota, malformed ones included, so junk traffic
  //    cannot be sent without limit.
  const rate = await recordAndCheckRate(ipHash);
  if (rate === "error") {
    refuse("rate limiter unavailable");
    return { ok: false, code: "unavailable" };
  }
  if (rate === "limited") {
    refuse("rate limited");
    return { ok: false, code: "rate_limited" };
  }

  // 3. Strict validation of the small browser-controlled contract.
  const parsed = signupInput.safeParse(data);
  if (!parsed.success) {
    refuse("invalid payload");
    return { ok: false, code: "invalid_request" };
  }

  // A control character in an address is never legitimate. Stripping it would
  // silently subscribe a different address than the one submitted, so refuse.
  if (CONTROL_CHARACTERS.test(parsed.data.email)) {
    refuse("invalid email");
    return { ok: false, code: "invalid_request" };
  }

  const email = normalizeSignupEmail(parsed.data.email);
  if (email.length < 3 || email.length > EMAIL_MAX || !isValidEmail(email)) {
    refuse("invalid email");
    return { ok: false, code: "invalid_request" };
  }

  // Canonical order and no duplicates, so browser ordering never causes a
  // meaningless update.
  const lists = MELT_LISTS.filter((list) => parsed.data.lists.includes(list));

  // 4. Consent is server-owned and fail-closed: no approved wording, no row.
  //    `deps.consent` is read once per request; version and text below come
  //    from this one object, so a hybrid snapshot cannot be stored.
  const consent = deps.consent;
  if (!isUsableConsent(consent)) {
    refuse("consent configuration missing");
    return { ok: false, code: "unavailable" };
  }

  // A page rendered under different wording must be refreshed: storing the
  // current wording against a visitor who saw other wording would break the
  // displayed-equals-stored guarantee.
  if (parsed.data.consentVersion !== consent.version) {
    refuse("stale consent");
    return { ok: false, code: "unavailable" };
  }

  // 5. Atomic local upsert. The unique email constraint resolves concurrent
  //    requests; id and created_at are absent from the payload, so a repeat
  //    signup refreshes consent and preferences in place.
  const { error } = await supabaseAdmin.from("newsletter_signups").upsert(
    {
      email,
      lists,
      // Stored verbatim: the validator already refused anything untrimmed or
      // malformed, so approved copy is never silently rewritten.
      consent_version: consent.version,
      consent_text: consent.text,
      consented_at: new Date().toISOString(),
      source: MELT_SOURCE,
    },
    { onConflict: "email" },
  );

  if (error) {
    refuse(`persistence failed (${error.code ?? "unknown"})`);
    return { ok: false, code: "unavailable" };
  }

  return { ok: true };
}
