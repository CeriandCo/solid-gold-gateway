import { createServerFn } from "@tanstack/react-start";

import type {
  CheckoutResult,
  CheckoutStatusResult,
  GiftCardOffering,
} from "./commerce/types";

export type {
  CheckoutErrorCode,
  CheckoutResult,
  CheckoutStatusResult,
  GiftCardDenomination,
  GiftCardOffering,
} from "./commerce/types";

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
    const { catalogStatus } = await import("./commerce/stripe-catalog.server");

    const [settingsResult, denominationsResult, catalog] = await Promise.all([
      supabaseAdmin
        .from("commerce_settings")
        .select("checkout_enabled, currency")
        .maybeSingle(),
      supabaseAdmin
        .from("gift_card_denominations")
        .select("id, amount_cents")
        .eq("active", true)
        .order("sort_order", { ascending: true }),
      catalogStatus(),
    ]);

    if (settingsResult.error) throw settingsResult.error;
    if (denominationsResult.error) throw denominationsResult.error;

    const currency = settingsResult.data?.currency ?? null;
    const checkoutEnabled = settingsResult.data?.checkout_enabled ?? false;

    return {
      // Buying is only offered once every denomination is bound to a verified
      // Stripe price for the current mode.
      available: checkoutEnabled && currency !== null && catalog.ready,

      currency,
      denominations: (denominationsResult.data ?? []).map((row) => ({
        id: row.id,
        amountCents: row.amount_cents,
      })),
    };
  },
);

/** Starts a Stripe Checkout Session. Input is validated server-side; see commerce-checkout.server.ts. */
export const createGiftCardCheckout = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => input)
  .handler(async ({ data }): Promise<CheckoutResult> => {
    const { runGiftCardCheckout } = await import("./commerce-checkout.server");
    return runGiftCardCheckout(data);
  });

/** Reports payment status from our own records only; never returns personal data. */
export const getGiftCardCheckoutStatus = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => input)
  .handler(async ({ data }): Promise<CheckoutStatusResult> => {
    const { runGiftCardCheckoutStatus } = await import("./commerce-checkout.server");
    return runGiftCardCheckoutStatus(data);
  });
