import { createFileRoute } from "@tanstack/react-router";

/**
 * Stripe webhook receiver.
 * Public by prefix, but authenticated by Stripe's own signature: nothing is
 * read from the body until the signature over the RAW text has been verified.
 */
export const Route = createFileRoute("/api/public/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Stripe events are a few KB at most. Refuse anything larger before
        // spending CPU on a signature check.
        const MAX_BODY_BYTES = 256 * 1024;
        const declared = Number(request.headers.get("content-length") ?? "0");
        if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
          return new Response("payload too large", { status: 413 });
        }

        const raw = await request.text();
        if (raw.length > MAX_BODY_BYTES) {
          return new Response("payload too large", { status: 413 });
        }


        const { default: Stripe } = await import("stripe");
        const { getStripeSecretKey, isLiveKey, createStripeClient } = await import(
          "@/lib/commerce.server"
        );

        const secretKey = getStripeSecretKey();
        const webhookSecret = process.env["STRIPE_WEBHOOK_SECRET"];
        if (!secretKey || !webhookSecret) {
          return new Response("unavailable", { status: 503 });
        }

        const signature = request.headers.get("stripe-signature") ?? "";
        const stripe = createStripeClient(secretKey);

        let event;
        try {
          event = await stripe.webhooks.constructEventAsync(
            raw,
            signature,
            webhookSecret,
            300,
            Stripe.createSubtleCryptoProvider(),
          );
        } catch {
          console.warn("[stripe-webhook] signature_invalid");
          return new Response("bad request", { status: 400 });
        }

        if (event.livemode !== isLiveKey(secretKey)) {
          console.warn("[stripe-webhook] livemode_mismatch");
          return new Response("bad request", { status: 400 });
        }

        const { processStripeEvent } = await import("@/lib/stripe-webhook.server");
        const outcome = await processStripeEvent(event, {
          retrieveSession: (sessionId) =>
            stripe.checkout.sessions.retrieve(sessionId, {
              expand: ["payment_intent.latest_charge"],
            }),
        });

        return new Response(outcome.result, { status: outcome.status });
      },
    },
  },
});
