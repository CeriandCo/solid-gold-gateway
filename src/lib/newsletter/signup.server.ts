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
  const ip = getRequestHeader("cf-connecting-ip");
  if (!ip) {
    console.warn("[newsletter] cf-connecting-ip missing; using the shared rate-limit bucket");
    return "unknown";
  }
  return ip;
}

/** Records the attempt first, then reports whether this caller is over a limit. */
async function recordAndCheckRate(ipHash: string): Promise<boolean> {
  await supabaseAdmin.from("newsletter_attempts").insert({ ip_hash: ipHash });

  const now = Date.now();
  const countSince = async (ms: number) => {
    const { count } = await supabaseAdmin
      .from("newsletter_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", new Date(now - ms).toISOString());
    return count ?? 0;
  };

  const [shortWindow, dayWindow] = await Promise.all([
    countSince(RATE_SHORT_WINDOW_MS),
    countSince(RATE_DAY_WINDOW_MS),
  ]);

  return shortWindow > SIGNUP_SHORT_MAX || dayWindow > SIGNUP_DAY_MAX;
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
  // 1. Trusted IP bucket and the newsletter pepper, before any other work.
  //    Without the secret we cannot account for abuse at all, so we stop.
  const ipHash = await newsletterPeppered(clientIpBucket());
  if (!ipHash) {
    refuse("pepper missing");
    return { ok: false, code: "unavailable" };
  }

  // 2. Every request costs quota, malformed ones included, so junk traffic
  //    cannot be sent without limit.
  if (await recordAndCheckRate(ipHash)) {
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

  const lists = [...new Set(parsed.data.lists)];

  // 4. Consent is server-owned and fail-closed: no approved wording, no row.
  const consent = deps.consent;
  if (!isUsableConsent(consent)) {
    refuse("consent configuration missing");
    return { ok: false, code: "unavailable" };
  }

  // 5. Atomic local upsert. The unique email constraint resolves concurrent
  //    requests; id and created_at are absent from the payload, so a repeat
  //    signup refreshes consent and preferences in place.
  const { error } = await supabaseAdmin.from("newsletter_signups").upsert(
    {
      email,
      lists,
      consent_version: consent.version.trim(),
      consent_text: consent.text.trim(),
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
