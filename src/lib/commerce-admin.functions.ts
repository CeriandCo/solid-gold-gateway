import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

import type { CatalogStatus, CatalogSyncResult } from "./commerce/stripe-catalog.server";

export type { CatalogStatus, CatalogSyncResult, CatalogProblem } from "./commerce/stripe-catalog.server";

/**
 * The commerce tables are service-role only, so these read/write through the
 * admin client — but only after the caller has been proven to be on the
 * editor allowlist, through their own user-scoped session.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function requireEditorOrAdmin(supabase: any): Promise<void> {
  const { data, error } = await supabase.rpc("aurum_link_current_editor");
  if (error) throw new Error(error.message);
  const role = (data as string | null) ?? null;
  if (role !== "admin" && role !== "editor" && role !== "reviewer") {
    throw new Error("Forbidden: you are not on the editor list.");
  }
}

export const getStripeCatalogStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CatalogStatus> => {
    await requireEditorOrAdmin(context.supabase);
    const { catalogStatus } = await import("./commerce/stripe-catalog.server");
    return catalogStatus();
  });

export const runStripeCatalogSync = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CatalogSyncResult> => {
    await requireEditorOrAdmin(context.supabase);
    const { syncStripeCatalog } = await import("./commerce/stripe-catalog.server");
    return syncStripeCatalog();
  });
