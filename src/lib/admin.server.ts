// Server-only helpers for the AURUM admin area.
// Access is allowlist-only: nothing here ever creates an auth user for an email that
// is not in aurum_editors, and the caller-facing message is identical either way so
// the sign-in form cannot be used to discover who has access.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const NEUTRAL_SIGN_IN_MESSAGE =
  "If this email has access, a sign-in link is on its way.";

const RATE_LIMIT_SECONDS = 60;

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
}

export function publishableClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export type LinkRequestOutcome = "sent" | "not-listed" | "rate-limited" | "send-failed";

/**
 * Sends a passwordless sign-in link, but only to an allowlisted email.
 * Returns an outcome for server-side logging; callers always show the neutral message.
 */
export async function sendAdminSignInLink(
  email: string,
  redirectTo: string,
): Promise<LinkRequestOutcome> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: editor } = await supabaseAdmin
    .from("aurum_editors")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (!editor) return "not-listed";

  const { data: recent } = await supabaseAdmin
    .from("aurum_admin_link_requests")
    .select("last_requested_at")
    .eq("email", email)
    .maybeSingle();
  if (recent) {
    const age = Date.now() - new Date(recent.last_requested_at).getTime();
    if (age < RATE_LIMIT_SECONDS * 1000) return "rate-limited";
  }

  // The auth user is created only for listed emails; magic links need an existing user.
  const { error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: true,
  });
  if (createError && !/already|exists|registered/i.test(createError.message)) {
    console.error("[admin] could not prepare the sign-in account:", createError.message);
    return "send-failed";
  }

  const { error } = await publishableClient().auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false, emailRedirectTo: redirectTo },
  });

  await supabaseAdmin
    .from("aurum_admin_link_requests")
    .upsert({ email, last_requested_at: new Date().toISOString() }, { onConflict: "email" });

  if (error) {
    console.error("[admin] sign-in link send failed:", error.message);
    return "send-failed";
  }
  return "sent";
}
