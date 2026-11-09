import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  headers: {} as Record<string, string>,
  row: null as null | (Record<string, unknown> & { id: string; created_at: string; cio_status: string; cio_attempts: number; cio_sent_at: string | null; email?: string; environment?: string }),
  send: vi.fn(async () => true),
  lookupThrows: false,
}));
vi.mock("@tanstack/react-start/server", () => ({ getRequestHeader: (name: string) => state.headers[name] }));
vi.mock("../leads/customerio.server", async (original) => ({
  ...await original<typeof import("../leads/customerio.server")>(),
  sendToCustomerIo: state.send,
}));
vi.mock("@/integrations/supabase/client.server", () => ({
  supabaseAdmin: {
    rpc: async () => ({ data: false, error: null }),
    from: () => {
      let update: Record<string, unknown> | null = null;
      let statuses: string[] | null = null;
      const query = {
        upsert: async (values: Record<string, unknown>) => {
          state.row = { id: "subscriber-1", created_at: "2026-11-09T00:00:00Z", cio_status: "skipped", cio_attempts: 0, cio_sent_at: null, ...state.row, ...values };
          return { error: null };
        },
        update: (values: Record<string, unknown>) => { update = values; return query; },
        eq: () => query,
        in: (_key: string, values: string[]) => { statuses = values; return query; },
        select: () => query,
        maybeSingle: async () => {
          if (state.lookupThrows && !update) throw new Error("lookup");
          if (statuses && !statuses.includes(String(state.row?.cio_status))) return { data: null };
          if (update && state.row) Object.assign(state.row, update);
          return { data: state.row ? { ...state.row } : null };
        },
        then: (resolve: (result: { error: null }) => unknown) => {
          if (update && state.row) Object.assign(state.row, update);
          return Promise.resolve(resolve({ error: null }));
        },
      };
      return query;
    },
  },
}));
import { runMeltSignup, meltSubscribedEvent } from "./signup.server";
import { approvedConsent } from "./consent.server";

const request = { email: "reader@example.com", lists: ["daily-note", "weekly-brief"], source: "aurum_melt", consentVersion: "melt-2026-11-09" };
beforeEach(() => {
  vi.stubEnv("NEWSLETTER_HASH_PEPPER", "unit-test-only");
  state.headers = { origin: "https://trunk.gold", host: "trunk.gold", "cf-connecting-ip": "203.0.113.1" };
  state.row = null;
  state.lookupThrows = false;
  state.send.mockReset().mockResolvedValue(true);
});
afterEach(() => vi.unstubAllEnvs());

describe("MELT Customer.io delivery", () => {
  it("uses the approved consent version", () => expect(approvedConsent()?.version).toBe("melt-2026-11-09"));
  it("builds exactly the requested identify attributes and melt_subscribed event", () => {
    expect(meltSubscribedEvent({ email: request.email, created_at: "2026-11-09T00:00:00Z", consent_version: request.consentVersion })).toEqual({
      email: "reader@example.com",
      attributes: { created_at: 1794182400, melt_consent_version: "melt-2026-11-09" },
      name: "melt_subscribed",
      data: { email: "reader@example.com", date_joined: 1794182400, source: "aurum_melt", consent_version: "melt-2026-11-09" },
    });
  });
  it.each(["https://preview.lovable.app", "https://solid-gold-gateway.lovable.app", "http://localhost:8080"])("saves but never sends on %s", async (origin) => {
    state.headers["origin"] = origin;
    expect(await runMeltSignup(request)).toEqual({ ok: true });
    expect(state.row?.environment).toBe("non_production");
    expect(state.row?.cio_status).toBe("skipped");
    expect(state.send).not.toHaveBeenCalled();
  });
  it("sends once and never resets sent status on resubmission", async () => {
    expect(await runMeltSignup(request)).toEqual({ ok: true });
    expect(state.row?.cio_status).toBe("sent");
    expect(state.row?.cio_attempts).toBe(1);
    expect(await runMeltSignup(request)).toEqual({ ok: true });
    expect(state.send).toHaveBeenCalledTimes(1);
    expect(state.row?.cio_attempts).toBe(1);
  });
  it("claims before sending so concurrent requests emit once", async () => {
    expect(await Promise.all([runMeltSignup(request), runMeltSignup(request)])).toEqual([{ ok: true }, { ok: true }]);
    expect(state.send).toHaveBeenCalledTimes(1);
  });
  it("keeps signup successful on provider failure and retries once on resubmission", async () => {
    state.send.mockResolvedValueOnce(false);
    expect(await runMeltSignup(request)).toEqual({ ok: true });
    expect(state.row?.cio_status).toBe("failed");
    expect(state.row?.cio_attempts).toBe(1);
    expect(await runMeltSignup(request)).toEqual({ ok: true });
    expect(state.row?.cio_status).toBe("sent");
    expect(state.row?.cio_attempts).toBe(2);
  });
  it("keeps signup successful if delivery lookup throws", async () => {
    state.lookupThrows = true;
    expect(await runMeltSignup(request)).toEqual({ ok: true });
    expect(state.row?.email).toBe(request.email);
    expect(state.send).not.toHaveBeenCalled();
  });
  it("fails closed with unavailable consent", async () => {
    expect(await runMeltSignup(request, { consent: null })).toEqual({ ok: false, code: "unavailable" });
    expect(state.row).toBeNull();
    expect(state.send).not.toHaveBeenCalled();
  });
});