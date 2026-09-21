import { createFileRoute } from "@tanstack/react-router";

/**
 * Scheduled catalog check. Public by prefix, gated by the same shared secret
 * header pg_cron uses for the delivery tick. It verifies that every gift card
 * denomination still maps to a Stripe price and re-asserts the mapping when it
 * does not. It never enables or disables checkout.
 */
function timingSafeEqual(a: string, b: string): boolean {
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  let diff = left.length ^ right.length;
  const max = Math.max(left.length, right.length);
  for (let i = 0; i < max; i++) {
    diff |= (left[i] ?? 0) ^ (right[i] ?? 0);
  }
  return diff === 0;
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export const Route = createFileRoute("/api/public/commerce-catalog-check")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env["COMMERCE_CRON_SECRET"];
        if (!expected) {
          console.error("[commerce-catalog-check] COMMERCE_CRON_SECRET is not configured");
          return json({ outcome: "error", reason: "Endpoint is not configured" }, 500);
        }

        const provided = request.headers.get("x-cron-secret") ?? "";
        if (!timingSafeEqual(provided, expected)) {
          return json({ outcome: "error", reason: "Unauthorized" }, 401);
        }

        const { reassertCatalog } = await import("@/lib/commerce/catalog-guard.server");
        try {
          return json(await reassertCatalog(), 200);
        } catch (cause) {
          console.error("[commerce-catalog-check] run failed", cause);
          return json({ outcome: "error", reason: "Catalog check failed" }, 500);
        }
      },
    },
  },
});
