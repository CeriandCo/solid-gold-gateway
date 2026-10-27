import { describe, expect, it } from "vitest";
import { cleanUrl, isExcludedPath } from "./amplitude";

describe("amplitude privacy rules", () => {
  it("excludes admin routes but not public partner pages", () => {
    expect(isExcludedPath("/admin")).toBe(true);
    expect(isExcludedPath("/admin/posts")).toBe(true);
    expect(isExcludedPath("/partners")).toBe(false);
    expect(isExcludedPath("/administrator-guide")).toBe(false);
  });
  it("keeps only campaign params and drops the hash", () => {
    expect(cleanUrl("https://trunk.gold/a?utm_source=x&email=a@b.c#access_token=t")).toBe(
      "https://trunk.gold/a?utm_source=x",
    );
  });
});
