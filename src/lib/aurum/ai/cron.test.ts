/**
 * Security of the internal generation endpoint: same contract as the existing
 * commerce delivery tick.
 */
import { describe, expect, it, vi } from "vitest";

import { handleDailyNoteCron, timingSafeEqual } from "./cron.server";

const SECRET = "s3cr3t-value-for-tests";

function post(headers: Record<string, string> = {}): Request {
  return new Request("https://app.test/api/public/aurum-ai-daily-note", {
    method: "POST",
    headers,
  });
}

describe("constant-time comparison", () => {
  it("matches only identical strings, whatever the length", () => {
    expect(timingSafeEqual(SECRET, SECRET)).toBe(true);
    expect(timingSafeEqual(SECRET, `${SECRET}x`)).toBe(false);
    expect(timingSafeEqual("", SECRET)).toBe(false);
    expect(timingSafeEqual(SECRET, SECRET.replace("3", "4"))).toBe(false);
  });

  it("compares every byte instead of exiting on the first difference", () => {
    const a = "a".repeat(64);
    expect(timingSafeEqual(a, `b${a.slice(1)}`)).toBe(false);
    expect(timingSafeEqual(a, `${a.slice(0, 63)}b`)).toBe(false);
  });
});

describe("endpoint authentication", () => {
  it("fails closed when no secret is configured", async () => {
    const run = vi.fn();
    const response = await handleDailyNoteCron(post({ "x-cron-secret": SECRET }), {
      expectedSecret: undefined,
      run,
    });
    expect(response.status).toBe(500);
    expect(run).not.toHaveBeenCalled();
  });

  it("rejects a missing secret", async () => {
    const run = vi.fn();
    const response = await handleDailyNoteCron(post(), { expectedSecret: SECRET, run });
    expect(response.status).toBe(401);
    expect(run).not.toHaveBeenCalled();
  });

  it("rejects a wrong secret", async () => {
    const run = vi.fn();
    const response = await handleDailyNoteCron(post({ "x-cron-secret": "nope" }), {
      expectedSecret: SECRET,
      run,
    });
    expect(response.status).toBe(401);
    expect(run).not.toHaveBeenCalled();
  });

  it("ignores a secret passed in the query string", async () => {
    const run = vi.fn();
    const request = new Request(
      `https://app.test/api/public/aurum-ai-daily-note?x-cron-secret=${SECRET}`,
      { method: "POST" },
    );
    const response = await handleDailyNoteCron(request, { expectedSecret: SECRET, run });
    expect(response.status).toBe(401);
    expect(run).not.toHaveBeenCalled();
  });

  it("accepts the correct secret and returns the run outcome", async () => {
    const run = vi.fn(async () => ({ outcome: "disabled" }) as const);
    const response = await handleDailyNoteCron(post({ "x-cron-secret": SECRET }), {
      expectedSecret: SECRET,
      run,
    });
    expect(response).toEqual({ status: 200, body: { outcome: "disabled" } });
  });

  it("never echoes the secret in the response body", async () => {
    const responses = await Promise.all([
      handleDailyNoteCron(post(), { expectedSecret: SECRET, run: vi.fn() }),
      handleDailyNoteCron(post({ "x-cron-secret": "nope" }), {
        expectedSecret: SECRET,
        run: vi.fn(),
      }),
      handleDailyNoteCron(post({ "x-cron-secret": SECRET }), {
        expectedSecret: SECRET,
        run: vi.fn(async () => ({ outcome: "disabled" }) as const),
      }),
    ]);
    for (const response of responses) {
      expect(JSON.stringify(response.body)).not.toContain(SECRET);
    }
  });

  it("does not leak internal failure detail", async () => {
    const response = await handleDailyNoteCron(post({ "x-cron-secret": SECRET }), {
      expectedSecret: SECRET,
      run: async () => {
        throw new Error(`connection string ${SECRET}`);
      },
    });
    expect(response.status).toBe(500);
    expect(JSON.stringify(response.body)).not.toContain(SECRET);
  });

  it("repeated invocations are independent calls, each authenticated", async () => {
    const run = vi.fn(async () => ({ outcome: "duplicate" }) as const);
    for (let i = 0; i < 3; i++) {
      const response = await handleDailyNoteCron(post({ "x-cron-secret": SECRET }), {
        expectedSecret: SECRET,
        run,
      });
      expect(response.status).toBe(200);
    }
    expect(run).toHaveBeenCalledTimes(3);
    const blocked = await handleDailyNoteCron(post(), { expectedSecret: SECRET, run });
    expect(blocked.status).toBe(401);
    expect(run).toHaveBeenCalledTimes(3);
  });
});
