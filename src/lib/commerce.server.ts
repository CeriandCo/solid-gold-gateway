import Stripe from "stripe";

export const STRIPE_API_VERSION = "2026-08-26.dahlia";

/**
 * Server-only Stripe helpers. The secret key is read from the environment
 * inside these functions (never at module scope, never in client code) and is
 * never logged or returned.
 */
export function getStripeSecretKey(): string | null {
  const key = process.env["STRIPE_SECRET_KEY"];
  return key && key.trim().length > 0 ? key.trim() : null;
}

export function isLiveKey(key: string): boolean {
  return !(key.startsWith("sk_test_") || key.startsWith("rk_test_"));
}

export function createStripeClient(key: string): Stripe {
  return new Stripe(key, {
    apiVersion: STRIPE_API_VERSION as Stripe.LatestApiVersion,
    httpClient: Stripe.createFetchHttpClient(),
  });
}

/** Salted SHA-256 of a value. The pepper is a server secret and never leaves the server. */
export async function peppered(value: string): Promise<string> {
  const pepper = process.env["COMMERCE_HASH_PEPPER"] ?? "";
  const bytes = new TextEncoder().encode(`${pepper}:${value}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
