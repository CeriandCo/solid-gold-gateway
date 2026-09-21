/**
 * Safety net for the Stripe price mapping.
 *
 * The mapping lives in the database and has been wiped in the past, which
 * silently turns checkout off for every buyer. This module re-asserts it from
 * Stripe, idempotently: when the catalog is already complete it does nothing
 * but report, and it NEVER changes checkout_enabled.
 */
import { catalogStatus, syncStripeCatalog, type CatalogStatus } from "./stripe-catalog.server";

export type CatalogGuardOutcome = {
  outcome: "ready" | "repaired" | "failed";
  before: { mapped: number; expected: number; ready: boolean };
  after: { mapped: number; expected: number; ready: boolean };
  mode: CatalogStatus["mode"];
  problems: string[];
};

/** Writes one alert at most every 30 minutes, so a persistent fault cannot flood the table. */
async function alert(severity: "info" | "warning" | "critical", message: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const since = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  const { data: recent } = await supabaseAdmin
    .from("commerce_alerts")
    .select("id")
    .eq("kind", "catalog_guard")
    .gte("created_at", since)
    .limit(1);
  if (recent && recent.length > 0) return;
  await supabaseAdmin
    .from("commerce_alerts")
    .insert({ severity, kind: "catalog_guard", message: message.slice(0, 500) });
}

/** Re-asserts the price mapping when it is incomplete. Safe to run at any time. */
export async function reassertCatalog(): Promise<CatalogGuardOutcome> {
  const before = await catalogStatus();
  const snapshot = (status: CatalogStatus) => ({
    mapped: status.mapped,
    expected: status.expected,
    ready: status.ready,
  });

  if (before.ready) {
    return {
      outcome: "ready",
      before: snapshot(before),
      after: snapshot(before),
      mode: before.mode,
      problems: [],
    };
  }

  const sync = await syncStripeCatalog();
  const after = await catalogStatus();
  const problems = sync.problems.map((p) => `${p.code}${p.lookupKey ? ` ${p.lookupKey}` : ""}`);

  if (after.ready) {
    await alert(
      "warning",
      `Catalog mapping was incomplete (${before.mapped}/${before.expected}) and has been re-asserted from Stripe (${after.mapped}/${after.expected}, mode ${after.mode}). Checkout was left untouched.`,
    );
    return { outcome: "repaired", before: snapshot(before), after: snapshot(after), mode: after.mode, problems };
  }

  await alert(
    "critical",
    `Catalog mapping is incomplete (${after.mapped}/${after.expected}, mode ${after.mode}) and could not be repaired: ${problems.join(", ") || "unknown"}. Checkout was left untouched and may be failing.`,
  );
  return { outcome: "failed", before: snapshot(before), after: snapshot(after), mode: after.mode, problems };
}

/**
 * Cheap health check for the scheduled tick: reads the stored mapping only
 * (no Stripe call) and repairs it when something has cleared it. Never throws
 * and never touches checkout_enabled, so a failure here cannot break delivery.
 */
export async function runScheduledCatalogCheck(): Promise<CatalogGuardOutcome | null> {
  try {
    const status = await catalogStatus();
    if (status.ready) return null;
    return await reassertCatalog();
  } catch (cause) {
    console.error("[catalog-guard] scheduled check failed", cause);
    return null;
  }
}
