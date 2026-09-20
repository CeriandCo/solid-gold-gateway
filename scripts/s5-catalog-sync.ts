/**
 * S-5 one-off: run the Stripe catalog sync against the real sandbox and print
 * ONLY the structured result. Never prints the secret key or any part of it.
 *
 *   bun run scripts/s5-catalog-sync.ts
 */
import { syncStripeCatalog, keyMode } from "@/lib/commerce/stripe-catalog.server";

const result = await syncStripeCatalog();
console.log(
  JSON.stringify(
    {
      mode: result.mode,
      keyMode: keyMode(),
      currency: result.currency,
      mapped: result.mapped,
      expected: result.expected,
      ready: result.ok && result.mapped === result.expected,
      productId: result.productId ?? null,
      problems: result.problems,
    },
    null,
    2,
  ),
);
