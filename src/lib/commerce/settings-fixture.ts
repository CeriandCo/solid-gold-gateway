/**
 * Test-only snapshot/restore for the singleton `commerce_settings` row.
 *
 * The suites run against the real project database, so a test that "restores"
 * the row to hard-coded defaults silently wipes the live configuration
 * (currency, allowed origins, switches). Every suite that touches the row must
 * snapshot it first and put the *original* values back afterwards.
 */

/** Every operator-owned column. Nothing outside this list may be rewritten by a test. */
export const COMMERCE_SETTINGS_GUARDED_COLUMNS = [
  "checkout_enabled",
  "currency",
  "allowed_origins",
  "delivery_enabled",
  "email_from",
  "hold_hours",
  "review_threshold_cents",
  "daily_limit_cents",
  "max_card_cents",
] as const;

export type CommerceSettingsSnapshot = Record<string, unknown>;

const COLUMN_LIST = COMMERCE_SETTINGS_GUARDED_COLUMNS.join(", ");

/** Reads the current row. Throws rather than let a suite run without a snapshot. */
export async function snapshotCommerceSettings(): Promise<CommerceSettingsSnapshot> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("commerce_settings")
    .select(COLUMN_LIST)
    .eq("id", true)
    .maybeSingle();
  if (error) throw new Error(`Could not snapshot commerce_settings: ${error.message}`);
  if (!data) throw new Error("commerce_settings has no singleton row to snapshot.");
  return data as unknown as CommerceSettingsSnapshot;
}

/** Writes the snapshot back verbatim. */
export async function restoreCommerceSettings(
  snapshot: CommerceSettingsSnapshot,
): Promise<void> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin
    .from("commerce_settings")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update(snapshot as any)
    .eq("id", true);
  if (error) throw new Error(`Could not restore commerce_settings: ${error.message}`);
}

/** Runs `body` with the row restored afterwards, whatever the body did to it. */
export async function withCommerceSettings<T>(body: () => Promise<T>): Promise<T> {
  const snapshot = await snapshotCommerceSettings();
  try {
    return await body();
  } finally {
    await restoreCommerceSettings(snapshot);
  }
}
