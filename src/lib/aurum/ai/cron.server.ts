/**
 * Secured entry point for the AI Daily Note pipeline.
 *
 * Same pattern as commerce-delivery-tick: server-only, `x-cron-secret`,
 * constant-time comparison, fail closed, no session fallback, no query-string
 * secret, and the secret is never logged or echoed.
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";

import { buildInternalSources, loadFactInputs, loadStyleSamples } from "./data.server";
import { createGatewayGenerator, type DailyNoteGenerator } from "./provider.server";
import {
  readAiConfig,
  runDailyNoteGeneration,
  type AlertInput,
  type ClaimResult,
  type PersistInput,
  type RunDeps,
  type RunResult,
} from "./run.server";

export function timingSafeEqual(a: string, b: string): boolean {
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  let diff = left.length ^ right.length;
  const max = Math.max(left.length, right.length);
  for (let i = 0; i < max; i++) {
    diff |= (left[i] ?? 0) ^ (right[i] ?? 0);
  }
  return diff === 0;
}

async function claimRun(windowKey: string, cap: number): Promise<ClaimResult> {
  const { data, error } = await supabaseAdmin.rpc("aurum_ai_claim_run", {
    _window_key: windowKey,
    _daily_cap: cap,
  });
  if (error) throw new Error(error.message);
  const payload = (data ?? {}) as Record<string, unknown>;
  if (payload["outcome"] === "claimed") {
    return { outcome: "claimed", runId: String(payload["run_id"]) };
  }
  if (payload["outcome"] === "cap") {
    return { outcome: "cap", used: Number(payload["used"] ?? 0), cap: Number(payload["cap"] ?? 0) };
  }
  return { outcome: "duplicate" };
}

async function finishRun(input: Parameters<RunDeps["finishRun"]>[0]): Promise<void> {
  // The RPC defaults every optional argument, so only supply the ones we have.
  const args: Record<string, unknown> = { _run_id: input.runId, _outcome: input.outcome };
  const optional = {
    _provider: input.usage?.provider,
    _model: input.usage?.model,
    _input_tokens: input.usage?.inputTokens,
    _output_tokens: input.usage?.outputTokens,
    _total_tokens: input.usage?.totalTokens,
    _cost_usd: input.usage?.costUsd,
    _post_id: input.postId,
    _detail: input.detail,
  };
  for (const [key, value] of Object.entries(optional)) {
    if (value !== null && value !== undefined) args[key] = value;
  }
  const { error } = await (
    supabaseAdmin.rpc as unknown as (
      fn: string,
      params: Record<string, unknown>,
    ) => Promise<{ error: { message: string } | null }>
  )("aurum_ai_finish_run", args);
  if (error) console.error("[aurum-ai] failed to record run outcome", error.message);
}

async function alert(input: AlertInput): Promise<void> {
  const { error } = await supabaseAdmin.from("aurum_ai_alerts").insert({
    severity: input.severity,
    kind: input.kind,
    message: input.message,
    run_id: input.runId ?? null,
    post_id: input.postId ?? null,
  });
  if (error) console.error("[aurum-ai] failed to record alert", error.message);
}

async function persist(input: PersistInput): Promise<string> {
  const { data, error } = await supabaseAdmin.rpc("aurum_ai_create_in_review", {
    _run_id: input.runId,
    _slug: input.slug,
    _title: input.title,
    _summary: input.summary,
    _body: input.body,
    _sources: input.sources,
  });
  if (error) throw new Error(error.message);
  return String(data);
}

export function buildRunDeps(options: {
  generate: DailyNoteGenerator;
  force?: boolean;
  env?: Record<string, string | undefined>;
}): RunDeps {
  return {
    config: readAiConfig(options.env ?? process.env),
    now: () => new Date(),
    claimRun,
    finishRun,
    alert,
    loadFactInputs,
    loadStyleSamples: () => loadStyleSamples(3),
    buildSources: buildInternalSources,
    generate: options.generate,
    ...(options.force ? { force: true } : {}),
  } as RunDeps;
}

export type CronResponse = { status: number; body: Record<string, unknown> };

/**
 * Authenticates the caller, then runs the pipeline. Returns a plain object so
 * the route stays a three-line adapter and this stays testable.
 */
export async function handleDailyNoteCron(
  request: Request,
  deps?: Partial<{ expectedSecret: string | undefined; run: () => Promise<RunResult> }>,
): Promise<CronResponse> {
  const expected = deps?.expectedSecret ?? process.env["AURUM_AI_CRON_SECRET"];
  if (!expected) {
    console.error("[aurum-ai-daily-note] AURUM_AI_CRON_SECRET is not configured");
    return { status: 500, body: { outcome: "error", reason: "Endpoint is not configured" } };
  }

  const provided = request.headers.get("x-cron-secret") ?? "";
  if (!timingSafeEqual(provided, expected)) {
    return { status: 401, body: { outcome: "error", reason: "Unauthorized" } };
  }

  const force = request.headers.get("x-aurum-ai-force") === "true";

  try {
    const run =
      deps?.run ??
      (async () => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");
        return runDailyNoteGeneration(
          buildRunDeps({ generate: createGatewayGenerator(apiKey), ...(force ? { force } : {}) }),
        );
      });
    const result = await run();
    return { status: 200, body: result as unknown as Record<string, unknown> };
  } catch (cause) {
    console.error("[aurum-ai-daily-note] run failed", cause);
    return { status: 500, body: { outcome: "error", reason: "Generation failed" } };
  }
}
