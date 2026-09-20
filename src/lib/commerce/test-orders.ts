import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Test-only bookkeeping for commerce rows.
 *
 * The suites run against the real database, so every order a test creates must
 * be tracked here and removed in teardown. `commerce_purge_test_order` is a
 * service-role-only function that removes the order together with its cards,
 * ledger entries, delivery attempts and alerts, and refuses livemode rows.
 */
const tracked = new Set<string>();

export function trackTestOrder(orderId: string): string {
  tracked.add(orderId);
  return orderId;
}

export async function purgeTrackedOrders(): Promise<number> {
  let removed = 0;
  for (const orderId of tracked) {
    const { error } = await supabaseAdmin.rpc("commerce_purge_test_order", {
      _order_id: orderId,
    });
    if (error) throw new Error(`failed to purge test order: ${error.message}`);
    removed += 1;
  }
  tracked.clear();
  return removed;
}
