import { describe, expect, it } from "vitest";

import {
  FORBIDDEN_ROLE_MESSAGE,
  NOT_AN_EDITOR_MESSAGE,
  requireRole,
  resolveRole,
} from "./admin-roles";

/** Minimal stand-in for a user-scoped Supabase client. */
function client(role: unknown, options: { error?: string } = {}) {
  const calls: unknown[] = [];
  return {
    calls,
    async rpc(name: string, args?: unknown) {
      calls.push({ name, args });
      if (options.error) return { data: null, error: { message: options.error } };
      return { data: role, error: null };
    },
  };
}

describe("requireRole", () => {
  it("accepts an editor when editors are allowed", async () => {
    await expect(requireRole(client("editor"), ["editor", "reviewer", "admin"])).resolves.toBe(
      "editor",
    );
  });

  it("accepts a reviewer when reviewers are allowed", async () => {
    await expect(requireRole(client("reviewer"), ["reviewer", "admin"])).resolves.toBe("reviewer");
  });

  it("accepts an admin when admins are allowed", async () => {
    await expect(requireRole(client("admin"), ["admin"])).resolves.toBe("admin");
  });

  it("rejects a real role outside the allowed set", async () => {
    await expect(requireRole(client("editor"), ["reviewer", "admin"])).rejects.toThrow(
      FORBIDDEN_ROLE_MESSAGE,
    );
  });

  it("rejects someone with no allowlist row", async () => {
    await expect(requireRole(client(null), ["editor", "reviewer", "admin"])).rejects.toThrow(
      NOT_AN_EDITOR_MESSAGE,
    );
  });

  it("fails closed on an unrecognised role value", async () => {
    await expect(
      requireRole(client("superuser"), ["editor", "reviewer", "admin"]),
    ).rejects.toThrow(NOT_AN_EDITOR_MESSAGE);
    await expect(requireRole(client(true), ["admin"])).rejects.toThrow(NOT_AN_EDITOR_MESSAGE);
  });

  it("derives the role from the caller's own client, ignoring any supplied role", async () => {
    const caller = client("editor");
    // Even asking for admin cannot change what the database reports.
    await expect(
      requireRole(
        { ...caller, role: "admin" } as unknown as ReturnType<typeof client>,
        ["admin"],
      ),
    ).rejects.toThrow(FORBIDDEN_ROLE_MESSAGE);
    expect(caller.calls).toEqual([{ name: "aurum_link_current_editor", args: undefined }]);
  });

  it("surfaces a lookup failure instead of granting access", async () => {
    await expect(requireRole(client("admin", { error: "boom" }), ["admin"])).rejects.toThrow(
      "boom",
    );
  });

  it("resolveRole returns null rather than an unknown role", async () => {
    await expect(resolveRole(client("owner"))).resolves.toBeNull();
  });
});
