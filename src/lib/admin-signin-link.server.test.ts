/**
 * C-10 regression: an allowlisted, existing account can still request a sign-in
 * link while public sign-up stays disabled.
 *
 * The allowlist lookup and the rate-limit bookkeeping run against the isolated
 * test database. The auth server is stood in for by a stub that behaves the way
 * the real one does with signups disabled: an OTP request that asks for user
 * creation is refused with "Signups not allowed for otp". No real email is ever
 * dispatched and no password is created or used here.
 */
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { randomUUID } from "node:crypto";

import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendAdminSignInLink } from "./admin.server";

const run = randomUUID().slice(0, 8);
const listedEmail = `c10-listed-${run}@example.test`;
const strangerEmail = `c10-stranger-${run}@example.test`;
const redirectTo = "https://solid-gold-gateway.lovable.app/admin";

const createdUsers: string[] = [];

await supabaseAdmin.from("aurum_editors").insert({ email: listedEmail, role: "editor" });

const realFetch = globalThis.fetch;
type OtpCall = { url: string; body: Record<string, unknown> };
let otpCalls: OtpCall[] = [];

globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (url.includes("/auth/v1/otp")) {
    const raw = typeof init?.body === "string" ? init.body : "{}";
    otpCalls.push({ url, body: JSON.parse(raw) as Record<string, unknown> });
    return new Response("{}", { status: 200, headers: { "content-type": "application/json" } });
  }
  return realFetch(input as RequestInfo, init);
}) as typeof fetch;

beforeEach(async () => {
  otpCalls = [];
  await supabaseAdmin.from("aurum_admin_link_requests").delete().eq("email", listedEmail);
  await supabaseAdmin.from("aurum_admin_link_requests").delete().eq("email", strangerEmail);
});

afterAll(async () => {
  globalThis.fetch = realFetch;
  // sendAdminSignInLink prepares the auth user for a listed email; remove it again.
  const { data } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
  const match = data?.users.find((user) => user.email === listedEmail);
  if (match) createdUsers.push(match.id);
  await supabaseAdmin.from("aurum_admin_link_requests").delete().eq("email", listedEmail);
  await supabaseAdmin.from("aurum_admin_link_requests").delete().eq("email", strangerEmail);
  await supabaseAdmin.from("aurum_editors").delete().eq("email", listedEmail);
  for (const id of createdUsers) await supabaseAdmin.auth.admin.deleteUser(id);
});

describe("admin sign-in link", () => {
  it("keeps public sign-up disabled on the auth server", async () => {
    const response = await realFetch(`${process.env["SUPABASE_URL"]}/auth/v1/settings`, {
      headers: { apikey: process.env["SUPABASE_PUBLISHABLE_KEY"]! },
    });
    const settings = (await response.json()) as { disable_signup: boolean; external: { email: boolean } };
    expect(settings.disable_signup).toBe(true);
    expect(settings.external.email).toBe(true);
  });

  it("sends a link for an allowlisted account without creating a user", async () => {
    const outcome = await sendAdminSignInLink(listedEmail, redirectTo);
    expect(outcome).toBe("sent");
    expect(otpCalls).toHaveLength(1);
    // Signups are disabled project-wide, so the request must opt out of user creation,
    // otherwise the auth server rejects it with "Signups not allowed for otp".
    expect(otpCalls[0]!.body["create_user"]).toBe(false);
    expect(otpCalls[0]!.url).toContain(encodeURIComponent(redirectTo));
  });

  it("never sends a link for an email that is not allowlisted", async () => {
    const outcome = await sendAdminSignInLink(strangerEmail, redirectTo);
    expect(outcome).toBe("not-listed");
    expect(otpCalls).toHaveLength(0);
  });

  it("rate-limits a second request for the same email", async () => {
    expect(await sendAdminSignInLink(listedEmail, redirectTo)).toBe("sent");
    expect(await sendAdminSignInLink(listedEmail, redirectTo)).toBe("rate-limited");
    expect(otpCalls).toHaveLength(1);
  });
});
