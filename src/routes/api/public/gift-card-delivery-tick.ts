import { createFileRoute } from "@tanstack/react-router";

/**
 * Gift card delivery tick. Public by prefix, gated by a shared secret header
 * that pg_cron reads from Vault (same pattern as the gold price fetcher).
 * The secret is compared in constant time and never logged; a missing or wrong
 * header is rejected before any database access.
 */
function timingSafeEqual(a: string, b: string): boolean {
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  // Compare a fixed-length digest-free window: length differences are folded
  // into the accumulator so the loop count never depends on the secret.
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

export const Route = createFileRoute("/api/public/gift-card-delivery-tick")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env["COMMERCE_CRON_SECRET"];
        if (!expected) {
          console.error("[gift-card-delivery-tick] COMMERCE_CRON_SECRET is not configured");
          return json({ outcome: "error", reason: "Endpoint is not configured" }, 500);
        }

        const provided = request.headers.get("x-cron-secret") ?? "";
        if (!timingSafeEqual(provided, expected)) {
          return json({ outcome: "error", reason: "Unauthorized" }, 401);
        }

        const { runDeliveryTick } = await import("@/lib/gift-delivery.server");
        try {
          return json(await runDeliveryTick(), 200);
        } catch (cause) {
          console.error("[gift-card-delivery-tick] run failed", cause);
          return json({ outcome: "error", reason: "Delivery tick failed" }, 500);
        }
      },
    },
  },
});
