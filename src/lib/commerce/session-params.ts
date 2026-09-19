import type Stripe from "stripe";

export type GiftCardOrderRef = {
  id: string;
  amountCents: number;
};

export type GiftCardDenominationRef = {
  id: string;
  amountCents: number;
};

export type CommerceSessionSettings = {
  currency: string;
};

export const CHECKOUT_SESSION_TTL_SECONDS = 30 * 60;

/**
 * Pure builder for the Stripe Checkout Session parameters.
 * Kept free of any Stripe client, network call or secret so it can be unit
 * tested without a key. The amount ALWAYS comes from the denomination row and
 * the currency ALWAYS from commerce_settings — never from the browser.
 */
export function buildGiftCardSessionParams(
  order: GiftCardOrderRef,
  denomination: GiftCardDenominationRef,
  settings: CommerceSessionSettings,
  origin: string,
  now: Date = new Date(),
): Stripe.Checkout.SessionCreateParams {
  const base = origin.replace(/\/+$/, "");

  return {
    mode: "payment",
    payment_method_types: ["card"],
    submit_type: "pay",
    allow_promotion_codes: false,
    billing_address_collection: "required",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: settings.currency,
          unit_amount: denomination.amountCents,
          product_data: { name: "SQOOT Pure Gift Card" },
        },
      },
    ],
    payment_method_options: {
      card: { request_three_d_secure: "any" },
    },
    expires_at: Math.floor(now.getTime() / 1000) + CHECKOUT_SESSION_TTL_SECONDS,
    client_reference_id: order.id,
    metadata: {
      order_id: order.id,
      denomination_id: denomination.id,
      purpose: "sqoot_gift_card",
    },
    payment_intent_data: {
      metadata: {
        order_id: order.id,
        denomination_id: denomination.id,
        purpose: "sqoot_gift_card",
      },
    },
    custom_fields: [
      {
        key: "recipient_name",
        label: { type: "custom", custom: "Recipient name" },
        type: "text",
        optional: false,
        text: { maximum_length: 80 },
      },
      {
        key: "recipient_email",
        label: { type: "custom", custom: "Recipient email" },
        type: "text",
        optional: false,
        text: { maximum_length: 254 },
      },
      {
        key: "gift_message",
        label: { type: "custom", custom: "Gift message (optional)" },
        type: "text",
        optional: true,
        text: { maximum_length: 255 },
      },
    ],
    success_url: `${base}/gifting?checkout=success&session_id={CHECKOUT_SESSION_ID}#gift-card`,
    cancel_url: `${base}/gifting?checkout=cancelled#gift-card`,
  };
}
