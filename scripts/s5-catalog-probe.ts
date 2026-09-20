/**
 * S-5 read-only diagnostic: list what the Stripe sandbox actually contains for
 * the gift card catalog. Prints no secret material.
 *
 *   bun run scripts/s5-catalog-probe.ts
 */
import { createStripeClient, getStripeSecretKey } from "@/lib/commerce.server";

const key = getStripeSecretKey();
if (!key) {
  console.log(JSON.stringify({ error: "no_key" }));
  process.exit(0);
}

const stripe = createStripeClient(key);
const amounts = [5000, 10000, 25000, 50000, 100000, 200000];

const products = await stripe.products.list({ limit: 100, active: true });
const prices = await stripe.prices.list({ limit: 100, expand: ["data.product"] });

console.log(
  JSON.stringify(
    {
      products: products.data.map((p) => ({
        id: p.id,
        name: p.name,
        active: p.active,
        livemode: p.livemode,
        purpose: p.metadata?.["purpose"] ?? null,
      })),
      prices: prices.data.map((p) => ({
        id: p.id,
        lookup_key: p.lookup_key ?? null,
        unit_amount: p.unit_amount ?? null,
        currency: p.currency,
        type: p.type,
        active: p.active,
        livemode: p.livemode,
        product:
          typeof p.product === "string"
            ? p.product
            : { id: p.product.id, purpose: (p.product as { metadata?: Record<string, string> }).metadata?.["purpose"] ?? null },
      })),
      expectedLookupKeysIfCurrencyWere: {
        usd: amounts.map((a) => `sqoot_gift_card_usd_${a}`),
      },
    },
    null,
    2,
  ),
);
