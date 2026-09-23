/**
 * Pure decision logic for the MELT signup form (task T3 Phase 4).
 *
 * Client-safe on purpose: it holds the exact request the browser is allowed to
 * send and the public wording for each coded server result, so both can be
 * tested without a DOM runner. It imports nothing server-only.
 */
import { MELT_SOURCE, type MeltList, type NewsletterResult } from "./types";

/** The complete browser-controlled request. Nothing else may be added here. */
export type MeltSignupRequest = {
  email: string;
  lists: MeltList[];
  source: typeof MELT_SOURCE;
  /** Version of the wording this page displayed. A comparison token only; never stored. */
  consentVersion?: string;
};

/**
 * Builds the request from what the visitor actually chose.
 *
 * Deliberately absent: consent text, consent timestamp, any
 * created/updated timestamp, IP or IP hash, provider, audience, subscription
 * status, referrer, UTM and gclid. The consent snapshot is server-owned, and
 * attribution is not part of this contract.
 */
export function buildSignupRequest(
  email: string,
  selected: readonly MeltList[],
  consentVersion?: string,
): MeltSignupRequest {
  const request: MeltSignupRequest = { email, lists: [...selected], source: MELT_SOURCE };
  if (consentVersion) request.consentVersion = consentVersion;
  return request;
}

export type MeltOutcome = "success" | "invalid" | "rate_limited" | "unavailable";

/** Maps the coded server result onto a public outcome; anything unknown is treated as unavailable. */
export function outcomeFor(result: NewsletterResult | null | undefined): MeltOutcome {
  if (!result) return "unavailable";
  if (result.ok) return "success";
  if (result.code === "invalid_request") return "invalid";
  if (result.code === "rate_limited") return "rate_limited";
  return "unavailable";
}

/**
 * Public wording. "Received your sign-up" is literally what happened: the
 * signup and its consent snapshot were stored by us. It does not claim a
 * provider subscription or a confirmed address, because neither exists yet.
 * A repeat signup gets the identical message, so the form cannot be used to
 * find out who is already signed up.
 */
export const MELT_MESSAGES: Record<MeltOutcome, string> = {
  success: "Thanks — we received your sign-up.",
  invalid: "That email address does not look right. Check it and try again.",
  rate_limited: "Too many attempts just now. Please try again in a little while.",
  unavailable: "Sign-up is not available just yet. Please try again soon.",
};

/** Only a success replaces the form; every other outcome keeps what the visitor typed. */
export function keepsFormContents(outcome: MeltOutcome): boolean {
  return outcome !== "success";
}
