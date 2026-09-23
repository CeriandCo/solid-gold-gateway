/**
 * MELT form decision logic and client-boundary structure (task T3 Phase 4).
 * No DOM runner is installed; this follows the proportional approach used in
 * T2: pure logic tested directly, wiring asserted structurally, behaviour
 * verified in a real browser.
 */
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  MELT_MESSAGES,
  buildSignupRequest,
  keepsFormContents,
  outcomeFor,
} from "./form-state";
import { MELT_SOURCE } from "./types";

const COMPONENT = readFileSync("src/components/aurum-subscribe-section.tsx", "utf8");

describe("the request the browser is allowed to send", () => {
  it("carries exactly email, lists and source", () => {
    const request = buildSignupRequest("Reader@Example.com", ["daily-note"]);
    expect(Object.keys(request).sort()).toEqual(["email", "lists", "source"]);
    expect(request.source).toBe(MELT_SOURCE);
  });

  it("maps both preference controls to the server's stable identifiers", () => {
    expect(buildSignupRequest("a@b.co", ["daily-note", "weekly-brief"]).lists).toEqual([
      "daily-note",
      "weekly-brief",
    ]);
    expect(buildSignupRequest("a@b.co", ["weekly-brief"]).lists).toEqual(["weekly-brief"]);
  });

  it("sends no label, consent, timestamp, identity or provider field", () => {
    const serialised = JSON.stringify(buildSignupRequest("a@b.co", ["daily-note"]));
    for (const forbidden of [
      "consent",
      "Consent",
      "timestamp",
      "created",
      "updated",
      "ip",
      "provider",
      "audience",
      "status",
      "referrer",
      "utm",
      "gclid",
      "Daily Note",
    ]) {
      expect(serialised).not.toContain(forbidden);
    }
  });

  it("does not copy the selected array by reference", () => {
    const selected: ("daily-note" | "weekly-brief")[] = ["daily-note"];
    const request = buildSignupRequest("a@b.co", selected);
    selected.push("weekly-brief");
    expect(request.lists).toEqual(["daily-note"]);
  });
});

describe("coded result mapping", () => {
  it("maps every server code to a public outcome", () => {
    expect(outcomeFor({ ok: true })).toBe("success");
    expect(outcomeFor({ ok: false, code: "invalid_request" })).toBe("invalid");
    expect(outcomeFor({ ok: false, code: "rate_limited" })).toBe("rate_limited");
    expect(outcomeFor({ ok: false, code: "unavailable" })).toBe("unavailable");
  });

  it("treats a missing or unrecognised result as unavailable", () => {
    expect(outcomeFor(null)).toBe("unavailable");
    expect(outcomeFor(undefined)).toBe("unavailable");
  });

  it("never claims a subscription, a confirmation or a provider", () => {
    const all = Object.values(MELT_MESSAGES).join(" ").toLowerCase();
    for (const forbidden of [
      "subscribed",
      "on the list",
      "mailing list",
      "confirm",
      "check your inbox",
      "customer.io",
      "consent",
    ]) {
      expect(all).not.toContain(forbidden);
    }
  });

  it("explains a failure without exposing internals", () => {
    const failures = [
      MELT_MESSAGES.invalid,
      MELT_MESSAGES.rate_limited,
      MELT_MESSAGES.unavailable,
    ].join(" ").toLowerCase();
    for (const forbidden of ["zod", "database", "pepper", "sql", "attempt count", "consent"]) {
      expect(failures).not.toContain(forbidden);
    }
  });

  it("keeps what the visitor typed on every failure", () => {
    expect(keepsFormContents("invalid")).toBe(true);
    expect(keepsFormContents("rate_limited")).toBe(true);
    expect(keepsFormContents("unavailable")).toBe(true);
    expect(keepsFormContents("success")).toBe(false);
  });
});

describe("the MELT component's client boundary", () => {
  it("calls the real server function and nothing else", () => {
    expect(COMPONENT).toContain("subscribeToMelt");
    expect(COMPONENT).toContain("buildSignupRequest(email, selected)");
  });

  it("has no fake submission path left", () => {
    expect(COMPONENT).not.toContain("[the-melt] subscribe");
    expect(COMPONENT).not.toContain("console.info");
    expect(COMPONENT).not.toContain("setTimeout");
    expect(COMPONENT).not.toContain("Customer.io");
  });

  it("holds no consent wording, version or attribution collection", () => {
    for (const forbidden of [
      "CONSENT_TEXT",
      "CONSENT_VERSION",
      "2026-09-20",
      "CLIENT-APPROVED",
      "attributionSource",
      "document.referrer",
      "utm_",
      "gclid",
      "consentText",
      "consentVersion",
    ]) {
      expect(COMPONENT).not.toContain(forbidden);
    }
  });

  it("guards against a double submission", () => {
    expect(COMPONENT).toContain("inFlight.current");
  });

  it("does not import server-only newsletter code", () => {
    expect(COMPONENT).not.toContain("signup.server");
    expect(COMPONENT).not.toContain("consent.server");
  });
});
