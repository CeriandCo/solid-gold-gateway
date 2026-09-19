import { createServerFn } from "@tanstack/react-start";

export type GiftCardDenomination = {
  id: string;
  amountCents: number;
};

export type GiftCardOffering = {
  available: boolean;
  currency: string | null;
  denominations: GiftCardDenomination[];
};

/**
 * Public, read-only view of the gift card offering.
 * The browser never learns prices from its own code: amounts, currency and the
 * kill switch all come from the database. Commerce tables have RLS enabled with
 * no policies, so this read runs through the service-role client and projects
 * only non-sensitive fields.
 */
export const getGiftCardOffering = createServerFn({ method: "GET" }).handler(
  async (): Promise<GiftCardOffering> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [settingsResult, denominationsResult] = await Promise.all([
      supabaseAdmin
        .from("commerce_settings")
        .select("checkout_enabled, currency")
        .maybeSingle(),
      supabaseAdmin
        .from("gift_card_denominations")
        .select("id, amount_cents")
        .eq("active", true)
        .order("sort_order", { ascending: true }),
    ]);

    if (settingsResult.error) throw settingsResult.error;
    if (denominationsResult.error) throw denominationsResult.error;

    const currency = settingsResult.data?.currency ?? null;
    const checkoutEnabled = settingsResult.data?.checkout_enabled ?? false;

    return {
      available: checkoutEnabled && currency !== null,
      currency,
      denominations: (denominationsResult.data ?? []).map((row) => ({
        id: row.id,
        amountCents: row.amount_cents,
      })),
    };
  },
);
