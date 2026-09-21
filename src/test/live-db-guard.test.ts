import { describe, expect, it } from "vitest";

import { assertIsolatedDatabase, assertLiveOptIn, isLocalSupabaseUrl } from "./live-db-guard";

describe("live database guard", () => {
  it("recognises only local hosts as isolated", () => {
    expect(isLocalSupabaseUrl("http://127.0.0.1:54331")).toBe(true);
    expect(isLocalSupabaseUrl("http://localhost:54331")).toBe(true);
    expect(isLocalSupabaseUrl("https://ddcnihhwnnyqebsusbbh.supabase.co")).toBe(false);
    expect(isLocalSupabaseUrl(undefined)).toBe(false);
  });

  it("passes in this project, because the suite runs against the throwaway database", () => {
    expect(() => assertIsolatedDatabase()).not.toThrow();
    expect(process.env["SUPABASE_URL"]).toMatch(/127\.0\.0\.1|localhost/);
  });

  it("fails immediately when a process is pointed at the live project", () => {
    const original = process.env["SUPABASE_URL"];
    process.env["SUPABASE_URL"] = "https://ddcnihhwnnyqebsusbbh.supabase.co";
    try {
      expect(() => assertIsolatedDatabase()).toThrow(/local test database/);
    } finally {
      if (original === undefined) delete process.env["SUPABASE_URL"];
      else process.env["SUPABASE_URL"] = original;
    }
  });

  it("requires an explicit opt-in for live-write suites", () => {
    const original = process.env["ALLOW_LIVE_DB_TESTS"];
    delete process.env["ALLOW_LIVE_DB_TESTS"];
    try {
      expect(() => assertLiveOptIn()).toThrow(/ALLOW_LIVE_DB_TESTS=1/);
      process.env["ALLOW_LIVE_DB_TESTS"] = "1";
      expect(() => assertLiveOptIn()).not.toThrow();
    } finally {
      if (original === undefined) delete process.env["ALLOW_LIVE_DB_TESTS"];
      else process.env["ALLOW_LIVE_DB_TESTS"] = original;
    }
  });
});
