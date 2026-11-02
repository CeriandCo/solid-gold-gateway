/**
 * Public waitlist + partner application boundary.
 *
 * request → rate limit → strict validation → save (insert-once) → Customer.io
 * (live host only, fail-soft). A Customer.io outage never loses a signup: the
 * row stays `failed`/`pending` and a later resubmission retries it. The claim
 * update (`pending|failed → sending`) guarantees at most one send per row, so
 * one signup = one event.
 */
import { z } from "zod";
import { getRequestHeader } from "@tanstack/react-start/server";

import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { isValidEmail } from "../admin.server";
import { canonicalIpBucket, CONTROL_CHARACTERS, normalizeSignupEmail } from "../newsletter/signup.server";
import { WAITLIST_CONSENT, WAITLIST_SOURCES, type LeadResult } from "./consent";
import { isLiveHost, sendToCustomerIo, type CioEvent } from "./customerio.server";

const SHORT_SECONDS = 15 * 60;
const DAY_SECONDS = 24 * 60 * 60;
const LIMITS = { waitlist: { short: 5, day: 20 }, partner: { short: 3, day: 10 } } as const;

type Table = "waitlist_signups" | "partner_applications";

function refuse(reason: string) {
  console.warn(`[leads] refused: ${reason}`);
}

async function peppered(value: string): Promise<string | null> {
  const pepper = process.env["LEADS_HASH_PEPPER"];
  if (!pepper) return null;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${pepper}:${value}`));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function rateCheck(scope: keyof typeof LIMITS): Promise<"allowed" | "limited" | "error"> {
  const ipHash = await peppered(canonicalIpBucket(getRequestHeader("cf-connecting-ip")));
  if (!ipHash) return "error";
  const { data, error } = await supabaseAdmin.rpc("lead_rate_check", {
    _scope: scope,
    _ip_hash: ipHash,
    _short_max: LIMITS[scope].short,
    _day_max: LIMITS[scope].day,
    _short_seconds: SHORT_SECONDS,
    _day_seconds: DAY_SECONDS,
  });
  if (error || typeof data !== "boolean") return "error";
  return data ? "limited" : "allowed";
}

function cleanEmail(raw: string): string | null {
  if (CONTROL_CHARACTERS.test(raw)) return null;
  const email = normalizeSignupEmail(raw);
  return email.length >= 3 && email.length <= 254 && isValidEmail(email) ? email : null;
}

function isLive(): boolean {
  return isLiveHost(getRequestHeader("origin"), getRequestHeader("host"));
}

/** Claims the row for sending, sends, and records the outcome. Never throws. */
async function deliver(table: Table, id: string, event: CioEvent): Promise<void> {
  try {
    const { data: claimed } = await supabaseAdmin
      .from(table)
      .update({ cio_status: "sending" })
      .eq("id", id)
      .in("cio_status", ["pending", "failed", "skipped"])
      .select("id, cio_attempts")
      .maybeSingle();
    if (!claimed) return; // already sent or in flight: no duplicate event
    const ok = await sendToCustomerIo(event);
    await supabaseAdmin
      .from(table)
      .update({
        cio_status: ok ? "sent" : "failed",
        cio_attempts: (claimed.cio_attempts ?? 0) + 1,
        cio_sent_at: ok ? new Date().toISOString() : null,
      })
      .eq("id", id);
  } catch {
    refuse("customerio delivery bookkeeping failed");
  }
}

const waitlistInput = z
  .object({
    email: z.string().min(1).max(1000),
    source: z.enum(WAITLIST_SOURCES),
    consentVersion: z.string().min(1).max(80),
  })
  .strict();

export async function runWaitlistSignup(data: unknown): Promise<LeadResult> {
  try {
    const rate = await rateCheck("waitlist");
    if (rate === "error") return refuse("rate limiter unavailable"), { ok: false, code: "unavailable" };
    if (rate === "limited") return refuse("rate limited"), { ok: false, code: "rate_limited" };

    const parsed = waitlistInput.safeParse(data);
    if (!parsed.success) return refuse("invalid payload"), { ok: false, code: "invalid_request" };
    const email = cleanEmail(parsed.data.email);
    if (!email) return refuse("invalid email"), { ok: false, code: "invalid_request" };
    if (parsed.data.consentVersion !== WAITLIST_CONSENT.version) {
      return refuse("stale consent"), { ok: false, code: "unavailable" };
    }

    const live = isLive();
    const { error } = await supabaseAdmin.from("waitlist_signups").upsert(
      {
        email,
        source: parsed.data.source,
        consent_version: WAITLIST_CONSENT.version,
        consent_text: WAITLIST_CONSENT.text,
        environment: live ? "production" : "non_production",
        cio_status: live ? "pending" : "skipped",
      },
      { onConflict: "email", ignoreDuplicates: true },
    );
    if (error) return refuse(`persistence failed (${error.code ?? "unknown"})`), { ok: false, code: "unavailable" };

    if (live) {
      const { data: row } = await supabaseAdmin
        .from("waitlist_signups")
        .select("id, source, consent_version, created_at")
        .eq("email", email)
        .maybeSingle();
      if (row) {
        await deliver("waitlist_signups", row.id, {
          email,
          attributes: {
            created_at: Math.floor(new Date(row.created_at).getTime() / 1000),
            waitlist_source: row.source,
            waitlist_consent_version: row.consent_version,
          },
          name: "waitlist_joined",
          data: { source: row.source, consent_version: row.consent_version },
        });
      }
    }
    return { ok: true };
  } catch {
    refuse("unexpected error");
    return { ok: false, code: "unavailable" };
  }
}

const opt = (max: number) =>
  z.string().max(max).optional().transform((v) => (v && v.trim() ? v.trim() : null));
const req = (max: number) => z.string().trim().min(1).max(max);

const partnerInput = z
  .object({
    fullName: req(200),
    firmName: req(200),
    website: opt(500),
    role: req(100),
    license: req(100),
    email: z.string().min(1).max(1000),
    phone: opt(40),
    state: req(60),
    clients: req(20),
    message: opt(4000),
    authorization: z.literal(true),
    terms: z.literal(true),
  })
  .strict();

export async function runPartnerApplication(data: unknown): Promise<LeadResult> {
  try {
    const rate = await rateCheck("partner");
    if (rate === "error") return refuse("rate limiter unavailable"), { ok: false, code: "unavailable" };
    if (rate === "limited") return refuse("rate limited"), { ok: false, code: "rate_limited" };

    const parsed = partnerInput.safeParse(data);
    if (!parsed.success) return refuse("invalid payload"), { ok: false, code: "invalid_request" };
    const email = cleanEmail(parsed.data.email);
    if (!email) return refuse("invalid email"), { ok: false, code: "invalid_request" };
    const p = parsed.data;

    const live = isLive();
    const { error } = await supabaseAdmin.from("partner_applications").upsert(
      {
        email,
        full_name: p.fullName,
        firm_name: p.firmName,
        website: p.website,
        role: p.role,
        license: p.license,
        phone: p.phone,
        state: p.state,
        client_count: p.clients,
        message: p.message,
        authorization_confirmed: true,
        terms_accepted: true,
        environment: live ? "production" : "non_production",
        cio_status: live ? "pending" : "skipped",
      },
      { onConflict: "email", ignoreDuplicates: true },
    );
    if (error) return refuse(`persistence failed (${error.code ?? "unknown"})`), { ok: false, code: "unavailable" };

    if (live) {
      const { data: row } = await supabaseAdmin
        .from("partner_applications")
        .select("id, full_name, firm_name, role, license, state, client_count, created_at")
        .eq("email", email)
        .maybeSingle();
      if (row) {
        await deliver("partner_applications", row.id, {
          email,
          attributes: {
            created_at: Math.floor(new Date(row.created_at).getTime() / 1000),
            full_name: row.full_name,
            partner_firm_name: row.firm_name,
            partner_role: row.role,
          },
          name: "partner_application_submitted",
          data: { role: row.role, license: row.license, state: row.state, client_count: row.client_count },
        });
      }
    }
    return { ok: true };
  } catch {
    refuse("unexpected error");
    return { ok: false, code: "unavailable" };
  }
}
