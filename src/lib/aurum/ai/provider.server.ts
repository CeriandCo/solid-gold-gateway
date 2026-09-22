/**
 * The single narrow model interface. The provider is given text only: no
 * database client, no credentials, no tools, no web access, no URL fetching.
 */
import { DRAFT_JSON_SCHEMA } from "./contract";

export type ProviderUsage = {
  provider: string;
  model: string;
  inputTokens: number | null;
  outputTokens: number | null;
  totalTokens: number | null;
  costUsd: number | null;
};

export type ProviderResult =
  | { ok: true; raw: unknown; usage: ProviderUsage }
  | { ok: false; reason: string; usage: ProviderUsage | null };

export type DailyNoteGenerator = (input: {
  system: string;
  user: string;
}) => Promise<ProviderResult>;

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/responses";
const MODEL = "openai/gpt-6-astra";

/** Lovable AI Gateway generator. Streams, per the Responses API contract. */
export function createGatewayGenerator(apiKey: string): DailyNoteGenerator {
  return async ({ system, user }) => {
    const usage: ProviderUsage = {
      provider: "lovable-ai-gateway",
      model: MODEL,
      inputTokens: null,
      outputTokens: null,
      totalTokens: null,
      costUsd: null,
    };

    let response: Response;
    try {
      response = await fetch(GATEWAY_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "Lovable-API-Key": apiKey,
          "X-Lovable-AIG-SDK": "fetch",
        },
        body: JSON.stringify({
          model: MODEL,
          instructions: system,
          input: [{ role: "user", content: [{ type: "input_text", text: user }] }],
          stream: true,
          reasoning: { effort: "low" },
          text: {
            format: {
              type: "json_schema",
              name: "aurum_daily_note",
              strict: true,
              schema: DRAFT_JSON_SCHEMA,
            },
          },
        }),
      });
    } catch (cause) {
      return { ok: false, reason: `provider_unreachable: ${String(cause)}`, usage };
    }

    if (!response.ok || !response.body) {
      return { ok: false, reason: `provider_status_${response.status}`, usage };
    }

    let text = "";
    try {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const chunk = await reader.read();
        if (chunk.done) break;
        buffer += decoder.decode(chunk.value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          let event: Record<string, unknown>;
          try {
            event = JSON.parse(payload) as Record<string, unknown>;
          } catch {
            continue;
          }
          if (event["type"] === "response.output_text.delta") {
            text += String(event["delta"] ?? "");
          }
          if (event["type"] === "response.completed") {
            const completed = (event["response"] ?? {}) as Record<string, unknown>;
            const used = (completed["usage"] ?? {}) as Record<string, unknown>;
            const input = Number(used["input_tokens"]);
            const output = Number(used["output_tokens"]);
            const total = Number(used["total_tokens"]);
            usage.inputTokens = Number.isFinite(input) ? input : null;
            usage.outputTokens = Number.isFinite(output) ? output : null;
            usage.totalTokens = Number.isFinite(total)
              ? total
              : (usage.inputTokens ?? 0) + (usage.outputTokens ?? 0) || null;
          }
        }
      }
    } catch (cause) {
      return { ok: false, reason: `provider_stream_failed: ${String(cause)}`, usage };
    }

    if (!text.trim()) return { ok: false, reason: "provider_empty_response", usage };

    try {
      return { ok: true, raw: JSON.parse(text) as unknown, usage };
    } catch {
      return { ok: false, reason: "provider_malformed_json", usage };
    }
  };
}
