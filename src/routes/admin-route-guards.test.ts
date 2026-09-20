import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Regression guard for the /admin redirect loop: /admin redirects to /admin/posts, so no
// admin child route may bounce back to /admin from beforeLoad. The layout renders the
// sign-in screen instead, and server functions remain the authorization boundary.
describe("admin child routes", () => {
  const dir = join(process.cwd(), "src/routes");
  const childRoutes = readdirSync(dir).filter(
    (name) => name.startsWith("admin.") && name.endsWith(".tsx") && name !== "admin.index.tsx",
  );

  it("finds the admin child route files", () => {
    expect(childRoutes.length).toBeGreaterThan(0);
  });

  it.each(childRoutes)("%s has no beforeLoad", (name) => {
    const source = readFileSync(join(dir, name), "utf8");
    expect(source).not.toMatch(/beforeLoad/);
  });

  it.each(childRoutes)("%s never redirects to /admin", (name) => {
    const source = readFileSync(join(dir, name), "utf8");
    expect(source).not.toMatch(/redirect\(\s*\{\s*to:\s*["']\/admin["']/);
  });

  it("keeps the /admin -> /admin/posts redirect", () => {
    const source = readFileSync(join(dir, "admin.index.tsx"), "utf8");
    expect(source).toMatch(/redirect\(\s*\{\s*to:\s*["']\/admin\/posts["']/);
  });
});
