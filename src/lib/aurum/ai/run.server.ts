/**
 * The AI Daily Note pipeline.
 *
 *   trusted DB data -> deterministic fact pack -> model draft ->
 *   deterministic verification -> internal sources -> atomic save as in_review
 *
 * The end state is always `in_review`. Nothing in this file (or anything it
 * calls) can publish, schedule, archive or restore a post.
 */
import { buildUserPrompt, parseModelDraft, SYSTEM_PROMPT } from "./contract";
import {
  buildFactPack,
  dailyNoteSlug,
  dailyWindowKey,
  type FactPack,
  type FactPackInputs,
} from "./fact-pack";
import type { DailyNoteGenerator, ProviderUsage } from "./provider.server";
import { composeBody, verifyDraft } from "./verify";

export type AiConfig = {
  /** Automatic generation is OFF until the cadence decision is made. */
  enabled: boolean;
  /** Configured cap, clamped by the database's own hard maximum of 4. */
  maxRunsPerDay: number;
  siteUrl: string;
};

export const DEFAULT_MAX_RUNS_PER_DAY = 1;
export const HARD_MAX_RUNS_PER_DAY = 4;

export function readAiConfig(env: Record<string, string | undefined>): AiConfig {
  const configured = Number(env["AURUM_AI_MAX_RUNS_PER_DAY"] ?? DEFAULT_MAX_RUNS_PER_DAY);
  const cap = Number.isFinite(configured) ? Math.trunc(configured) : DEFAULT_MAX_RUNS_PER_DAY;
  return {
    enabled: env["AURUM_AI_DAILY_NOTES_ENABLED"] === "true",
    maxRunsPerDay: Math.min(Math.max(cap, 0), HARD_MAX_RUNS_PER_DAY),
    siteUrl: env["AURUM_PUBLIC_SITE_URL"] ?? "https://solid-gold-gateway.lovable.app",
  };
}

export type ClaimResult =
  | { outcome: "claimed"; runId: string }
  | { outcome: "duplicate" }
  | { outcome: "cap"; used: number; cap: number };

export type AlertInput = {
  severity: "info" | "warning" | "critical";
  kind: string;
  message: string;
  runId?: string | null;
  postId?: string | null;
};

export type PersistInput = {
  runId: string;
  slug: string;
  title: string;
  summary: string;
  body: string[];
  sources: { publisher: string; title: string; date: string; url: string }[];
};

export type RunDeps = {
  config: AiConfig;
  now: () => Date;
  claimRun: (windowKey: string, cap: number) => Promise<ClaimResult>;
  finishRun: (input: {
    runId: string;
    outcome: "skipped" | "generated" | "rejected" | "saved" | "error";
    usage?: ProviderUsage | null;
    postId?: string | null;
    detail?: string | null;
  }) => Promise<void>;
  alert: (input: AlertInput) => Promise<void>;
  loadFactInputs: () => Promise<FactPackInputs>;
  loadStyleSamples: () => Promise<string[]>;
  buildSources: (
    pack: FactPack,
    siteUrl: string,
  ) => { publisher: string; title: string; date: string; url: string }[];
  generate: DailyNoteGenerator;
  persist: (input: PersistInput) => Promise<string>;
  /** Forced by the operator's manual invocation; ignores the enabled flag. */
  force?: boolean;
};

export type RunResult =
  | { outcome: "disabled" }
  | { outcome: "duplicate" }
  | { outcome: "cap"; used: number; cap: number }
  | { outcome: "skipped"; reason: string; runId: string }
  | { outcome: "rejected"; reason: string; runId: string }
  | { outcome: "error"; reason: string; runId: string }
  | { outcome: "saved"; postId: string; runId: string };

export async function runDailyNoteGeneration(deps: RunDeps): Promise<RunResult> {
  if (!deps.config.enabled && !deps.force) return { outcome: "disabled" };

  const now = deps.now();
  const windowKey = dailyWindowKey(now);

  const claim = await deps.claimRun(windowKey, deps.config.maxRunsPerDay);
  if (claim.outcome === "duplicate") return { outcome: "duplicate" };
  if (claim.outcome === "cap") {
    await deps.alert({
      severity: "info",
      kind: "ai_daily_cap_reached",
      message: `Daily generation cap reached (${claim.used}/${claim.cap}).`,
    });
    return { outcome: "cap", used: claim.used, cap: claim.cap };
  }
  const runId = claim.runId;

  // 1. Deterministic facts, or nothing at all.
  let pack: FactPack;
  try {
    const inputs = await deps.loadFactInputs();
    const built = buildFactPack(inputs, { windowKey, now });
    if (!built.ok) {
      await deps.finishRun({ runId, outcome: "skipped", detail: built.reason });
      await deps.alert({
        severity: "info",
        kind: "ai_insufficient_facts",
        message: `Daily Note skipped: ${built.reason}. The model was not called.`,
        runId,
      });
      return { outcome: "skipped", reason: built.reason, runId };
    }
    pack = built.pack;
  } catch (cause) {
    const reason = `fact_pack_failed: ${String(cause)}`;
    await deps.finishRun({ runId, outcome: "error", detail: reason });
    await deps.alert({ severity: "warning", kind: "ai_fact_pack_failed", message: reason, runId });
    return { outcome: "error", reason, runId };
  }

  // 2. Model. Text in, structured text out — no tools, no data access.
  const samples = await deps.loadStyleSamples().catch(() => []);
  const generated = await deps.generate({
    system: SYSTEM_PROMPT,
    user: buildUserPrompt(pack, samples),
  });
  if (!generated.ok) {
    await deps.finishRun({
      runId,
      outcome: "error",
      usage: generated.usage,
      detail: generated.reason,
    });
    await deps.alert({
      severity: "warning",
      kind: "ai_provider_failure",
      message: `Provider failure: ${generated.reason}`,
      runId,
    });
    return { outcome: "error", reason: generated.reason, runId };
  }

  // 3. Shape, then facts. A single violation rejects the whole generation.
  let draft;
  try {
    draft = parseModelDraft(generated.raw);
  } catch (cause) {
    const reason = `malformed_output: ${String(cause).slice(0, 400)}`;
    await deps.finishRun({ runId, outcome: "rejected", usage: generated.usage, detail: reason });
    await deps.alert({
      severity: "warning",
      kind: "ai_malformed_output",
      message: reason,
      runId,
    });
    return { outcome: "rejected", reason, runId };
  }

  const verdict = verifyDraft(draft, pack);
  if (!verdict.ok) {
    const reason = verdict.violations
      .map((violation) => `${violation.code} (${violation.detail})`)
      .join("; ")
      .slice(0, 900);
    await deps.finishRun({ runId, outcome: "rejected", usage: generated.usage, detail: reason });
    await deps.alert({
      severity: "critical",
      kind: "ai_verification_failed",
      message: `Generation rejected before saving: ${reason}`,
      runId,
    });
    return { outcome: "rejected", reason, runId };
  }

  // 4. Cite only the facts the text actually uses, and refuse a note whose
  //    cited sources disagree about the previous close.
  const citedPack = citedFactPack(draft, pack);
  const contradiction = previousCloseContradiction(citedPack);
  if (contradiction) {
    await deps.finishRun({ runId, outcome: "rejected", usage: generated.usage, detail: contradiction });
    await deps.alert({
      severity: "critical",
      kind: "ai_source_contradiction",
      message: `Generation rejected before saving: ${contradiction}`,
      runId,
    });
    return { outcome: "rejected", reason: contradiction, runId };
  }

  // 5. Trusted composition and atomic persistence as in_review.
  const body = composeBody(draft);
  const sources = deps.buildSources(citedPack, deps.config.siteUrl);
  if (sources.length === 0) {
    const reason = "no_internal_sources";
    await deps.finishRun({ runId, outcome: "rejected", usage: generated.usage, detail: reason });
    await deps.alert({ severity: "critical", kind: "ai_source_missing", message: reason, runId });
    return { outcome: "rejected", reason, runId };
  }

  try {
    const postId = await deps.persist({
      runId,
      slug: dailyNoteSlug(now),
      title: draft.title.trim(),
      summary: draft.summary.trim(),
      body,
      sources,
    });
    await deps.finishRun({ runId, outcome: "saved", usage: generated.usage, postId });
    return { outcome: "saved", postId, runId };
  } catch (cause) {
    const reason = `persist_failed: ${String(cause).slice(0, 400)}`;
    await deps.finishRun({ runId, outcome: "error", usage: generated.usage, detail: reason });
    await deps.alert({
      severity: "critical",
      kind: "ai_persist_failed",
      message: reason,
      runId,
    });
    return { outcome: "error", reason, runId };
  }
}
