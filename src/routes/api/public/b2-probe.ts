// TEMPORARY verification-only route for step B2. Delete after verification.
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/b2-probe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { fn?: string; data?: unknown };
        const { runGiftCardCheckout, runGiftCardCheckoutStatus } = await import(
          "@/lib/commerce-checkout.server"
        );
        const result =
          body.fn === "status"
            ? await runGiftCardCheckoutStatus(body.data)
            : await runGiftCardCheckout(body.data);
        return new Response(JSON.stringify(result), {
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
