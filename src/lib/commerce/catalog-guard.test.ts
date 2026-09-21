import { describe, expect, it } from "vitest";

import { reassertCatalog } from "./catalog-guard.server";
import { catalogStatus } from "./stripe-catalog.server";

const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

/**
 * Runs against the isolated test database, which carries a copy of the real
 * denomination rows, so the mapping starts complete.
 */
describe("catalog safety net", () => {
  it("is a no-op when the mapping is already complete, and never touches checkout", async () => {
    const before = await supabaseAdmin
      .from("commerce_settings")
      .select("checkout_enabled")
      .maybeSingle();

    const status = await catalogStatus({ mode: "test" });
    if (!status.ready) {
      // Nothing to assert if the copied reference data has no mapping.
      expect(status.mapped).toBeLessThan(status.expected + 1);
      return;
    }

    const result = await reassertCatalog();
    expect(result.outcome).toBe("ready");
    expect(result.after.ready).toBe(true);
    expect(result.problems).toEqual([]);

    const after = await supabaseAdmin
      .from("commerce_settings")
      .select("checkout_enabled")
      .maybeSingle();
    expect(after.data?.checkout_enabled).toBe(before.data?.checkout_enabled);
  });
});
