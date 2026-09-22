import { createFileRoute } from "@tanstack/react-router";

/**
 * Internal generation route for AI-written AURUM Daily Notes. Public by prefix,
 * gated by the shared cron secret header that pg_cron reads from Vault. All
 * logic (including the secret comparison) lives in the server module.
 */
export const Route = createFileRoute("/api/public/aurum-ai-daily-note")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { handleDailyNoteCron } = await import("@/lib/aurum/ai/cron.server");
        const result = await handleDailyNoteCron(request);
        return new Response(JSON.stringify(result.body), {
          status: result.status,
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
