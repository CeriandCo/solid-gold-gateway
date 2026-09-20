/**
 * Admin email + password sign-in. Runs against the real project database and
 * auth server, so every row it creates is removed again at the end.
 *
 * No password used here is a real one: each is generated per run and only ever
 * exists in memory.
 */
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { randomUUID } from "node:crypto";

import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { publishableClient } from "./admin.server";
import {
  GENERIC_SIGN_IN_ERROR,
  LOCKED_SIGN_IN_ERROR,
  LOGIN_MAX_FAILURES,
  adminPasswordSignIn,
  setAdminPassword,
  validateAdminPassword,
} from "./admin-password.server";

const run = randomUUID().slice(0, 8);
const listedEmail = `s6-listed-${run}@example.test`;
const strangerEmail = `s6-stranger-${run}@example.test`;
const listedPassword = `Listed-${randomUUID()}`;
const strangerPassword = `Stranger-${randomUUID()}`;

const createdUsers: string[] = [];

await supabaseAdmin.from("aurum_editors").insert({ email: listedEmail, role: "editor" });
await setAdminPassword(listedEmail, listedPassword);

const stranger = await supabaseAdmin.auth.admin.createUser({
  email: strangerEmail,
  password: strangerPassword,
  email_confirm: true,
});
if (stranger.data.user) createdUsers.push(stranger.data.user.id);

// The listed account's auth user, so it can be deleted too.
{
  const { data } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
  const match = data?.users.find((user) => user.email === listedEmail);
  if (match) createdUsers.push(match.id);
}

// The IP bucket is shared in this environment, so each test starts from a clean slate.
beforeEach(async () => {
  await supabaseAdmin.from("aurum_admin_login_attempts").delete().gte("id", 0);
});

afterAll(async () => {
  await supabaseAdmin.from("aurum_admin_login_attempts").delete().gte("id", 0);
  await supabaseAdmin.from("aurum_editors").delete().eq("email", listedEmail);
  for (const id of createdUsers) await supabaseAdmin.auth.admin.deleteUser(id);
});

describe("password rules", () => {
  it("rejects anything under 12 characters", () => {
    const result = validateAdminPassword("Short1!aBcd");
    expect(result.ok).toBe(false);
  });

  it("rejects top common passwords", () => {
    expect(validateAdminPassword("passwordpassword").ok).toBe(false);
    expect(validateAdminPassword("123456789012").ok).toBe(false);
  });

  it("accepts a long passphrase and imposes no maximum", () => {
    expect(validateAdminPassword("correct horse battery staple").ok).toBe(true);
    expect(validateAdminPassword("x".repeat(400).replace(/x/g, "aB3-")).ok).toBe(true);
  });

  it("refuses to set a weak password even for a listed account", async () => {
    const result = await setAdminPassword(listedEmail, "short");
    expect(result.ok).toBe(false);
  });

  it("refuses to set a password for an address that is not on the list", async () => {
    const result = await setAdminPassword(strangerEmail, `Fresh-${randomUUID()}`);
    expect(result).toEqual({ ok: false, message: "Add this email to the list first." });
  });
});

describe("self sign-up", () => {
  it("is blocked at the auth server", async () => {
    const { data, error } = await publishableClient().auth.signUp({
      email: `s6-selfsignup-${randomUUID().slice(0, 8)}@example.test`,
      password: `Self-${randomUUID()}`,
    });
    expect(error).not.toBeNull();
    expect(data.session).toBeNull();
  });
});

describe("sign-in", () => {
  it("lets an allowlisted account in", async () => {
    const result = await adminPasswordSignIn(listedEmail, listedPassword);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.accessToken.length).toBeGreaterThan(20);
      expect(result.refreshToken.length).toBeGreaterThan(10);
    }
  });

  it("denies a correct password for an account that is not allowlisted", async () => {
    const result = await adminPasswordSignIn(strangerEmail, strangerPassword);
    expect(result).toEqual({ ok: false, message: GENERIC_SIGN_IN_ERROR });

    // The refused session must not survive: the credentials still work at the auth
    // server, but our sign-in path never hands a session back.
    const direct = await publishableClient().auth.signInWithPassword({
      email: strangerEmail,
      password: strangerPassword,
    });
    expect(direct.data.session).not.toBeNull();
    await publishableClient().auth.signOut();
  });

  it("gives the same message for an unknown email and a wrong password", async () => {
    const unknown = await adminPasswordSignIn(`s6-nobody-${run}@example.test`, "whatever-1234");
    const wrong = await adminPasswordSignIn(listedEmail, `Wrong-${randomUUID()}`);
    expect(unknown).toEqual({ ok: false, message: GENERIC_SIGN_IN_ERROR });
    expect(wrong).toEqual({ ok: false, message: GENERIC_SIGN_IN_ERROR });
  });

  it("locks out after repeated failures, then refuses even the right password", async () => {
    for (let attempt = 0; attempt < LOGIN_MAX_FAILURES; attempt += 1) {
      const result = await adminPasswordSignIn(listedEmail, `Wrong-${attempt}-${run}`);
      expect(result).toEqual({ ok: false, message: GENERIC_SIGN_IN_ERROR });
    }
    const locked = await adminPasswordSignIn(listedEmail, listedPassword);
    expect(locked).toEqual({ ok: false, message: LOCKED_SIGN_IN_ERROR });
  });
});
