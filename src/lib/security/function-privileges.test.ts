import { describe, expect, it } from "vitest";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Permanent regression guard: Postgres grants EXECUTE on new functions to
 * PUBLIC by default, which exposes them through PostgREST RPC. Nothing in
 * `public` may be callable by `anon`, and only these helpers may be callable
 * by a signed-in user: the four RLS helpers, plus the review-workflow publish
 * primitive, which authenticates and authorises the caller internally.
 */
const AUTHENTICATED_ALLOWLIST = new Set([
  "aurum_current_editor_role",
  "aurum_can_edit_draft",
  "aurum_can_edit_post_sources",
  "aurum_link_current_editor",
  "aurum_publish_post",
]);


type GrantRow = {
  function_name: string;
  arguments: string;
  security_definer: boolean;
  anon_execute: boolean;
  authenticated_execute: boolean;
  service_role_execute: boolean;
};

async function loadGrants(): Promise<GrantRow[]> {
  const { data, error } = await supabaseAdmin.rpc("security_function_grants");
  if (error) throw error;
  return (data ?? []) as GrantRow[];
}

describe("public function EXECUTE privileges", () => {
  it("exposes no function in public to anon", async () => {
    const offenders = (await loadGrants())
      .filter((row) => row.anon_execute)
      .map((row) => row.function_name);
    expect(offenders).toEqual([]);
  });

  it("exposes no SECURITY DEFINER function to authenticated outside the allowlist", async () => {
    const offenders = (await loadGrants())
      .filter((row) => row.security_definer && row.authenticated_execute)
      .map((row) => row.function_name)
      .filter((name) => !AUTHENTICATED_ALLOWLIST.has(name));
    expect(offenders).toEqual([]);
  });

  it("keeps every public function executable by service_role", async () => {
    const offenders = (await loadGrants())
      .filter((row) => !row.service_role_execute)
      .map((row) => row.function_name);
    expect(offenders).toEqual([]);
  });

  it("exposes the review publish primitive to signed-in editors only", async () => {
    const row = (await loadGrants()).find((entry) => entry.function_name === "aurum_publish_post");
    expect(row).toMatchObject({
      security_definer: true,
      anon_execute: false,
      authenticated_execute: true,
      service_role_execute: true,
    });
  });

});
