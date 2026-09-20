/**
 * Regression test for the 2026-09-20 incident: a test run reset the live
 * `commerce_settings` row (currency -> NULL, allowed_origins -> {}) because the
 * suites restored hard-coded defaults instead of what was there before.
 */
import { afterAll, describe, expect, it } from "vitest";

import {
  COMMERCE_SETTINGS_GUARDED_COLUMNS,
  restoreCommerceSettings,
  snapshotCommerceSettings,
  withCommerceSettings,
} from "./settings-fixture";

const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

const original = await snapshotCommerceSettings();

afterAll(async () => {
  await restoreCommerceSettings(original);
});

describe("commerce_settings snapshot fixture", () => {
  it("covers every operator-owned column", () => {
    expect([...COMMERCE_SETTINGS_GUARDED_COLUMNS]).toEqual([
      "checkout_enabled",
      "currency",
      "allowed_origins",
      "delivery_enabled",
      "email_from",
      "hold_hours",
      "review_threshold_cents",
      "daily_limit_cents",
      "max_card_cents",
    ]);
  });

  it("puts the operator's values back after a suite mutates the row", async () => {
    await withCommerceSettings(async () => {
      await supabaseAdmin
        .from("commerce_settings")
        .update({
          currency: null,
          allowed_origins: [],
          checkout_enabled: false,
          delivery_enabled: false,
          email_from: null,
        })
        .eq("id", true);
      const wiped = await snapshotCommerceSettings();
      expect(wiped["currency"]).toBeNull();
    });

    const after = await snapshotCommerceSettings();
    expect(after).toEqual(original);
  });

  it("restores even when the body throws", async () => {
    await expect(
      withCommerceSettings(async () => {
        await supabaseAdmin.from("commerce_settings").update({ currency: null }).eq("id", true);
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");

    const after = await snapshotCommerceSettings();
    expect(after).toEqual(original);
  });

  it("never leaves the row missing", async () => {
    const { count } = await supabaseAdmin
      .from("commerce_settings")
      .select("id", { count: "exact", head: true });
    expect(count).toBe(1);
  });
});
