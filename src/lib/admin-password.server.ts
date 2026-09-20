/**
 * Server-only email + password sign-in for the AURUM admin area.
 *
 * Rules enforced here, not in the browser:
 *  - only emails already on the `aurum_editors` allowlist may sign in;
 *  - a password that is correct for a non-allowlisted account is still refused,
 *    and that session is signed out again immediately;
 *  - wrong email and wrong password return the same generic message;
 *  - failures are rate limited by IP and by email (salted hashes, never raw);
 *  - accounts and passwords are only ever created from the admin People page.
 *
 * No password value is logged, returned or stored here; Supabase Auth keeps the
 * hash and nothing else.
 */
import { getRequestHeader } from "@tanstack/react-start/server";
import { peppered } from "./commerce.server";
import { normalizeEmail, isValidEmail, publishableClient } from "./admin.server";

export const GENERIC_SIGN_IN_ERROR = "That email and password do not match an account with access.";
export const LOCKED_SIGN_IN_ERROR =
  "Too many attempts. Wait 15 minutes and try again, or use a sign-in link.";

export const PASSWORD_MIN_LENGTH = 12;

/** Top common passwords, normalised to lowercase. Length is checked separately. */
const COMMON_PASSWORDS = new Set([
  "123456789012",
  "1234567890123",
  "123456789012345",
  "111111111111",
  "000000000000",
  "qwertyuiop12",
  "qwertyuiopas",
  "passwordpassword",
  "password1234",
  "password12345",
  "passw0rd1234",
  "letmein12345",
  "iloveyou1234",
  "welcome12345",
  "adminadmin12",
  "administrator",
  "abc123456789",
  "monkeymonkey",
  "dragondragon",
  "sunshine1234",
  "princess1234",
  "football1234",
  "baseball1234",
  "superman1234",
  "trustno1trustno1",
  "qazwsxedcrfv",
  "zaq12wsxcde3",
  "1q2w3e4r5t6y",
  "aaaaaaaaaaaa",
  "changeme1234",
  "secretsecret",
  "gold12345678",
  "sqootsqoot12",
]);

export type PasswordCheck = { ok: true } | { ok: false; message: string };

/** Minimum 12 characters, no maximum, no forced rotation, no top common passwords. */
export function validateAdminPassword(password: string): PasswordCheck {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { ok: false, message: `Use at least ${PASSWORD_MIN_LENGTH} characters.` };
  }
  const normalised = password.trim().toLowerCase();
  if (COMMON_PASSWORDS.has(normalised)) {
    return { ok: false, message: "That password is too common. Choose something else." };
  }
  if (/^(.)\1+$/.test(normalised)) {
    return { ok: false, message: "That password is too common. Choose something else." };
  }
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Rate limiting — same shape as the commerce checkout bucket.
// ---------------------------------------------------------------------------

export const LOGIN_WINDOW_MS = 15 * 60 * 1000;
export const LOGIN_MAX_FAILURES = 10;

/** Cloudflare sets this at its own edge, so it cannot be spoofed by the caller. */
export async function clientIpHash(): Promise<string> {
  let ip: string | undefined;
  try {
    ip = getRequestHeader("cf-connecting-ip");
  } catch {
    ip = undefined;
  }
  return peppered(ip ?? "unknown");
}

async function recordAttempt(emailHash: string, ipHash: string, succeeded: boolean) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin
    .from("aurum_admin_login_attempts")
    .insert({ email_hash: emailHash, ip_hash: ipHash, succeeded });
}

/** True when either bucket has already hit the failure limit inside the window. */
export async function isLoginLocked(emailHash: string, ipHash: string): Promise<boolean> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const since = new Date(Date.now() - LOGIN_WINDOW_MS).toISOString();

  const counts = await Promise.all(
    (
      [
        ["email_hash", emailHash],
        ["ip_hash", ipHash],
      ] as const
    ).map(async ([column, value]) => {
      const { count } = await supabaseAdmin
        .from("aurum_admin_login_attempts")
        .select("id", { count: "exact", head: true })
        .eq(column, value)
        .eq("succeeded", false)
        .gte("created_at", since);
      return count ?? 0;
    }),
  );

  return counts.some((count) => count >= LOGIN_MAX_FAILURES);
}

// ---------------------------------------------------------------------------
// Sign-in
// ---------------------------------------------------------------------------

export type AdminSignInResult =
  | { ok: true; accessToken: string; refreshToken: string }
  | { ok: false; message: string };

async function isAllowlisted(email: string): Promise<boolean> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("aurum_editors")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  return Boolean(data);
}

export async function adminPasswordSignIn(
  rawEmail: string,
  password: string,
): Promise<AdminSignInResult> {
  const email = normalizeEmail(rawEmail);
  const ipHash = await clientIpHash();
  const emailHash = await peppered(email);

  if (await isLoginLocked(emailHash, ipHash)) {
    return { ok: false, message: LOCKED_SIGN_IN_ERROR };
  }

  const fail = async (): Promise<AdminSignInResult> => {
    await recordAttempt(emailHash, ipHash, false);
    return { ok: false, message: GENERIC_SIGN_IN_ERROR };
  };

  if (!isValidEmail(email) || password.length === 0) return fail();

  // Unknown email and wrong password are indistinguishable from outside.
  if (!(await isAllowlisted(email))) return fail();

  const client = publishableClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.session) return fail();

  // Defence in depth: the account that actually signed in must be allowlisted.
  const signedInEmail = normalizeEmail(data.user?.email ?? "");
  if (!signedInEmail || !(await isAllowlisted(signedInEmail))) {
    await client.auth.signOut();
    return fail();
  }

  await recordAttempt(emailHash, ipHash, true);
  return {
    ok: true,
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
  };
}

// ---------------------------------------------------------------------------
// Admin-set passwords (People page, service role)
// ---------------------------------------------------------------------------

/** Finds an existing auth user id for an email, without exposing anything else. */
async function findAuthUserId(email: string): Promise<string | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new Error("Could not look up the account.");
    const match = data.users.find((user) => normalizeEmail(user.email ?? "") === email);
    if (match) return match.id;
    if (data.users.length < 200) return null;
  }
  return null;
}

export type SetPasswordResult = { ok: true; created: boolean } | { ok: false; message: string };

/**
 * Sets (or resets) the password of an allowlisted account. Called only from an
 * admin-gated server function. The password itself is passed straight to
 * Supabase Auth, which stores a hash; it is never written anywhere else.
 */
export async function setAdminPassword(
  rawEmail: string,
  password: string,
): Promise<SetPasswordResult> {
  const email = normalizeEmail(rawEmail);
  if (!isValidEmail(email)) return { ok: false, message: "Enter a valid email address." };

  const check = validateAdminPassword(password);
  if (!check.ok) return { ok: false, message: check.message };

  if (!(await isAllowlisted(email))) {
    return { ok: false, message: "Add this email to the list first." };
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const existingId = await findAuthUserId(email);

  if (existingId) {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(existingId, { password });
    if (error) return { ok: false, message: "That password was refused. Try a different one." };
    return { ok: true, created: false };
  }

  const { error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) return { ok: false, message: "That password was refused. Try a different one." };
  return { ok: true, created: true };
}
