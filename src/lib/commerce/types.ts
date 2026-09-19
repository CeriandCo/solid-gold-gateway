export type GiftCardDenomination = {
  id: string;
  amountCents: number;
};

export type GiftCardOffering = {
  available: boolean;
  currency: string | null;
  denominations: GiftCardDenomination[];
};

export type CheckoutErrorCode =
  | "unavailable"
  | "invalid_request"
  | "rate_limited"
  | "origin_not_allowed"
  | "checkout_failed";

export type CheckoutResult = { ok: true; url: string } | { ok: false; code: CheckoutErrorCode };

export type CheckoutStatusResult = {
  status: "confirming" | "paid" | "not_found";
  amountCents?: number;
  currency?: string;
};
