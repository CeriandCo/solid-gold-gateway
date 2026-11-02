import { afterEach, describe, expect, it, vi } from "vitest";

import { WAITLIST_CONSENT } from "./consent";
import { isLiveHost, sendToCustomerIo } from "./customerio.server";

describe("Customer.io live-only gate", () => {
  it("sends only from trunk.gold and www.trunk.gold", () => {
    expect(isLiveHost("https://trunk.gold", null)).toBe(true);
    expect(isLiveHost("https://www.trunk.gold", null)).toBe(true);
    expect(isLiveHost(null, "trunk.gold")).toBe(true);
  });
  it("never sends from preview, lovable.app or localhost", () => {
    expect(isLiveHost("https://id-preview--x.lovable.app", "trunk.gold")).toBe(false);
    expect(isLiveHost("https://solid-gold-gateway.lovable.app", null)).toBe(false);
    expect(isLiveHost("http://localhost:8080", null)).toBe(false);
    expect(isLiveHost(null, null)).toBe(false);
    expect(isLiveHost("https://trunk.gold.evil.com", null)).toBe(false);
  });
});

describe("Customer.io sender", () => {
  afterEach(() => vi.unstubAllEnvs());
  const event = { email: "a@b.co", attributes: {}, name: "waitlist_joined", data: { source: "early_access" } };

  it("identifies then tracks against the US Track API", async () => {
    vi.stubEnv("CUSTOMERIO_SITE_ID", "site");
    vi.stubEnv("CUSTOMERIO_TRACK_API_KEY", "key");
    const fetchImpl = vi.fn(async () => new Response("{}", { status: 200 }));
    expect(await sendToCustomerIo(event, fetchImpl as unknown as typeof fetch)).toBe(true);
    const calls = fetchImpl.mock.calls as unknown as [string, RequestInit][];
    expect(calls.map(([url, init]) => `${init.method} ${url}`)).toEqual([
      "PUT https://track.customer.io/api/v1/customers/a%40b.co",
      "POST https://track.customer.io/api/v1/customers/a%40b.co/events",
    ]);
  });

  it("fails soft (returns false, never throws) when Customer.io is down", async () => {
    vi.stubEnv("CUSTOMERIO_SITE_ID", "site");
    vi.stubEnv("CUSTOMERIO_TRACK_API_KEY", "key");
    const down = vi.fn(async () => {
      throw new Error("network");
    });
    expect(await sendToCustomerIo(event, down as unknown as typeof fetch)).toBe(false);
    const err500 = vi.fn(async () => new Response("", { status: 500 }));
    expect(await sendToCustomerIo(event, err500 as unknown as typeof fetch)).toBe(false);
  });
});

describe("waitlist consent", () => {
  it("stored text equals the displayed sentence", () => {
    expect(WAITLIST_CONSENT.text).toBe(
      "By joining, you agree to receive emails from TRUNK about our launch and updates. You can unsubscribe anytime. See our Privacy Policy.",
    );
    expect(`${WAITLIST_CONSENT.lead} ${WAITLIST_CONSENT.linkText}.`).toBe(WAITLIST_CONSENT.text);
  });
});
