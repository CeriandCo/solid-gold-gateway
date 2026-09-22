import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Regression guard for the authentication boundary of the review workflow
 * server functions: removing the middleware, or reaching for service-role
 * capability before the caller is authorized, must fail a test.
 */
const source = readFileSync(join(process.cwd(), "src/lib/aurum/review.functions.ts"), "utf8");

describe("review workflow server functions", () => {
  it("submitForReview is a POST server function", () => {
    expect(source).toMatch(
      /export const submitForReview = createServerFn\(\{\s*method:\s*"POST"\s*\}\)/,
    );
  });

  it("submitForReview is protected by requireSupabaseAuth", () => {
    const declaration = source.slice(source.indexOf("export const submitForReview"));
    expect(declaration).toMatch(/\.middleware\(\[requireSupabaseAuth\]\)/);
  });

  it("every server function in the file is authenticated", () => {
    const functions = [...source.matchAll(/createServerFn\(\{[^}]*\}\)([\s\S]{0,120})/g)];
    expect(functions.length).toBeGreaterThan(0);
    for (const match of functions) {
      expect(match[1]).toMatch(/\.middleware\(\[requireSupabaseAuth\]\)/);
    }
  });

  it("loads the privileged client only inside a handler, after authorization", () => {
    expect(source).not.toMatch(/^import[\s\S]*client\.server/m);
    const privilegedAt = source.indexOf("client.server");
    const guardAt = source.indexOf("requireRole(supabase");
    expect(privilegedAt).toBeGreaterThan(guardAt);
    expect(guardAt).toBeGreaterThan(-1);
  });

  it("does not read the self-approval setting: that is a publication rule", () => {
    expect(source).not.toMatch(/allow_self_approval/);
  });
});
