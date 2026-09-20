import { describe, expect, it } from "vitest";
import { buildGiftCardSessionParams } from "./session-params";

const order = { id: "11111111-1111-4111-8111-111111111111", amountCents: 25000 };
const denomination = {
  id: "22222222-2222-4222-8222-222222222222",
  amountCents: 25000,
  priceId: "price_test_25000",
};
const settings = { currency: "usd" };
const origin = "https://solid-gold-gateway.lovable.app";
const now = new Date("2026-09-19T12:00:00Z");

const params = buildGiftCardSessionParams(order, denomination, settings, origin, now);

describe("buildGiftCardSessionParams", () => {
  it("references the verified Stripe price id, never an ad-hoc amount", () => {
    const item = params.line_items?.[0];
    expect(item?.price).toBe("price_test_25000");
    expect(item?.price_data).toBeUndefined();
    expect(params.currency).toBe("usd");
    expect(item?.quantity).toBe(1);
    expect(item?.adjustable_quantity).toBeUndefined();
  });


  it("is card only, pay mode, no promotion codes, billing address required", () => {
    expect(params.mode).toBe("payment");
    expect(params.payment_method_types).toEqual(["card"]);
    expect(params.submit_type).toBe("pay");
    expect(params.allow_promotion_codes).toBe(false);
    expect(params.billing_address_collection).toBe("required");
  });

  it("requests 3D Secure on every card payment", () => {
    expect(params.payment_method_options?.card?.request_three_d_secure).toBe("any");
  });

  it("expires about 30 minutes from now", () => {
    const seconds = (params.expires_at ?? 0) - Math.floor(now.getTime() / 1000);
    expect(seconds).toBe(1800);
  });

  it("collects the three gift fields with the right limits", () => {
    const fields = params.custom_fields ?? [];
    expect(fields.map((f) => f.key)).toEqual([
      "recipient_name",
      "recipient_email",
      "gift_message",
    ]);
    expect(fields[0]?.optional).toBe(false);
    expect(fields[0]?.text?.maximum_length).toBe(80);
    expect(fields[1]?.optional).toBe(false);
    expect(fields[1]?.text?.maximum_length).toBe(254);
    expect(fields[2]?.optional).toBe(true);
    expect(fields[2]?.text?.maximum_length).toBe(255);
  });

  it("builds both redirects from the allowlisted origin only", () => {
    expect(params.success_url).toBe(
      `${origin}/gifting?checkout=success&session_id={CHECKOUT_SESSION_ID}#gift-card`,
    );
    expect(params.cancel_url).toBe(`${origin}/gifting?checkout=cancelled#gift-card`);
  });

  it("carries no personal data in metadata", () => {
    const expected = {
      order_id: order.id,
      denomination_id: denomination.id,
      purpose: "sqoot_gift_card",
    };
    expect(params.metadata).toEqual(expected);
    expect(params.payment_intent_data?.metadata).toEqual(expected);
    expect(params.client_reference_id).toBe(order.id);
    const serialised = JSON.stringify(params.metadata) + JSON.stringify(params.payment_intent_data);
    expect(serialised).not.toMatch(/@|email|name|message/i);
  });
});
