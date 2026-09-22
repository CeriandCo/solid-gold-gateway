/**
 * Purchase acknowledgement terms (task C-9).
 *
 * ────────────────────────────────────────────────────────────────────────────
 * PLACEHOLDER COPY — AWAITING CLIENT APPROVAL.
 * The wording below is a draft. It is NOT final, reviewed or binding legal
 * text. The client edits the strings in this file only; no layout or component
 * markup lives here. Whenever any line changes, bump ACKNOWLEDGEMENT_VERSION in
 * the same edit, because the version is what is recorded against a purchase.
 * ────────────────────────────────────────────────────────────────────────────
 */

/** Single source of truth for the version recorded against every purchase. */
export const ACKNOWLEDGEMENT_VERSION = "placeholder-2026-09-22";

export const ACKNOWLEDGEMENT_HEADING = "I ACKNOWLEDGE:";

export type AcknowledgementKind = "gift_card" | "physical_gold";

/** PLACEHOLDER — awaiting client approval. */
const GIFT_CARD_TERMS = [
  "Gift cards are non-refundable and cannot be returned.",
  "Gift cards are not eligible for cancellation, price adjustments or promotions.",
  "Gift card value is fixed in US dollars and does not track the gold price.",
  "The gift card is delivered by email to the address provided.",
] as const;

/** PLACEHOLDER — awaiting client approval. */
const PHYSICAL_GOLD_TERMS = [
  "Orders for physical gold cannot be returned or refunded once placed.",
  "Orders are not eligible for cancellation or price adjustments.",
  "Proof of identity may be required on delivery.",
  "Delivery cannot be redirected to an alternative address.",
] as const;

export const ACKNOWLEDGEMENT_TERMS: Record<AcknowledgementKind, readonly string[]> = {
  gift_card: GIFT_CARD_TERMS,
  physical_gold: PHYSICAL_GOLD_TERMS,
};

/** The label of the single checkbox that covers the whole list. */
export const ACKNOWLEDGEMENT_CONFIRMATION =
  "I have read and accept the terms above.";

/**
 * The exact text shown to the buyer, flattened for the record kept on the
 * order. The server rebuilds this itself rather than trusting the browser.
 */
export function acknowledgementRecordText(kind: AcknowledgementKind): string {
  return [
    ACKNOWLEDGEMENT_HEADING,
    ...ACKNOWLEDGEMENT_TERMS[kind].map((line) => `- ${line}`),
    ACKNOWLEDGEMENT_CONFIRMATION,
  ].join("\n");
}
