/**
 * Pipeline behaviour: cap, duplicate window, insufficient facts, provider
 * failure modes, verification rejection, and the one success path — which ends
 * at in_review and nowhere else.
 */
import { describe, expect, it, vi } from "vitest";

import { DISCLAIMER } from "./contract";
import {
  HARD_MAX_RUNS_PER_DAY,
  readAiConfig,
  runDailyNoteGeneration,
  type AlertInput,
  type ClaimResult,
  type RunDeps,
} from "./run.server";

const NOW = new Date("2026-09-22T12:00:00.000Z");

const SPOT = {
  id: "spot-1",
  price: 3912.36,
  currency: "USD",
  unit: "oz",
  observed_at: "2026-09-22T11:30:00.000Z",
  high_24h: 3940.1,
  low_24h: 3880.22,
  previous_close: 3866.4,
};

const GOOD_MODEL_OUTPUT = {
  title: "Gold holds above its previous close",
  summary:
    "The latest stored gold observation sits at $3912.36 an ounce, above the previous close stored with it.",
  paragraphs: [
    {
      kind: "fact",
      factId: "f_spot",
      subject: "gold",
      metric: "spot_price",
      direction: "none",
      text: "The latest stored gold observation is $3912.36 a troy ounce.",
    },
    {
      kind: "fact",
      factId: "f_change_pct",
      subject: "gold",
      metric: "change_percent",
      direction: "up",
      text: "Against the previous close, gold is higher by 1.19%.",
    },
    {
      kind: "context",
      text: "These figures come from our own stored gold price records and describe only what was observed.",
    },
  ],
};

type Harness = {
  deps: RunDeps;
  alerts: AlertInput[];
  finished: unknown[];
  persisted: unknown[];
};

function harness(overrides: Partial<RunDeps> = {}, claim: ClaimResult = {
  outcome: "claimed",
  runId: "run-1",
}): Harness {
  const alerts: AlertInput[] = [];
  const finished: unknown[] = [];
  const persisted: unknown[] = [];

  const deps: RunDeps = {
    config: { enabled: true, maxRunsPerDay: 1, siteUrl: "https://example.test" },
    now: () => NOW,
    claimRun: async () => claim,
    finishRun: async (input) => {
      finished.push(input);
    },
    alert: async (input) => {
      alerts.push(input);
    },
    loadFactInputs: async () => ({ spot: SPOT, lastClose: null }),
    loadStyleSamples: async () => ["Gold was quiet in our stored records."],
    buildSources: () => [
      {
        publisher: "SQOOT AURUM price record",
        title: "aurum_spot_prices row spot-1",
        date: "2026-09-22",
        url: "https://example.test/aurum#price",
      },
    ],
    generate: async () => ({
      ok: true,
      raw: GOOD_MODEL_OUTPUT,
      usage: {
        provider: "lovable-ai-gateway",
        model: "openai/gpt-6-astra",
        inputTokens: 900,
        outputTokens: 210,
        totalTokens: 1110,
        costUsd: null,
      },
    }),
    persist: async (input) => {
      persisted.push(input);
      return "post-1";
    },
    ...overrides,
  };

  return { deps, alerts, finished, persisted };
}

describe("configuration", () => {
  it("is disabled by default and clamps the cap to the hard maximum", () => {
    expect(readAiConfig({})).toMatchObject({ enabled: false, maxRunsPerDay: 1 });
    expect(readAiConfig({ AURUM_AI_MAX_RUNS_PER_DAY: "99" }).maxRunsPerDay).toBe(
      HARD_MAX_RUNS_PER_DAY,
    );
    expect(readAiConfig({ AURUM_AI_MAX_RUNS_PER_DAY: "-4" }).maxRunsPerDay).toBe(0);
    expect(readAiConfig({ AURUM_AI_DAILY_NOTES_ENABLED: "TRUE" }).enabled).toBe(false);
    expect(readAiConfig({ AURUM_AI_DAILY_NOTES_ENABLED: "true" }).enabled).toBe(true);
  });
});

describe("guard rails before the model is called", () => {
  it("does nothing while generation is disabled", async () => {
    const { deps } = harness({ config: { enabled: false, maxRunsPerDay: 1, siteUrl: "x" } });
    const generate = vi.fn();
    expect(await runDailyNoteGeneration({ ...deps, generate })).toEqual({ outcome: "disabled" });
    expect(generate).not.toHaveBeenCalled();
  });

  it("a manual forced invocation still works while disabled", async () => {
    const { deps } = harness({
      config: { enabled: false, maxRunsPerDay: 1, siteUrl: "https://example.test" },
      force: true,
    });
    expect(await runDailyNoteGeneration(deps)).toMatchObject({ outcome: "saved" });
  });

  it("refuses a duplicate generation window", async () => {
    const generate = vi.fn();
    const { deps } = harness({ generate }, { outcome: "duplicate" });
    expect(await runDailyNoteGeneration(deps)).toEqual({ outcome: "duplicate" });
    expect(generate).not.toHaveBeenCalled();
  });

  it("stops at the daily cap and records it", async () => {
    const generate = vi.fn();
    const { deps, alerts } = harness({ generate }, { outcome: "cap", used: 1, cap: 1 });
    expect(await runDailyNoteGeneration(deps)).toEqual({ outcome: "cap", used: 1, cap: 1 });
    expect(generate).not.toHaveBeenCalled();
    expect(alerts[0]!.kind).toBe("ai_daily_cap_reached");
  });

  it("skips without calling the model when the facts are insufficient", async () => {
    const generate = vi.fn();
    const { deps, alerts, finished, persisted } = harness({
      generate,
      loadFactInputs: async () => ({ spot: null, lastClose: null }),
    });
    expect(await runDailyNoteGeneration(deps)).toMatchObject({
      outcome: "skipped",
      reason: "no_spot_row",
    });
    expect(generate).not.toHaveBeenCalled();
    expect(persisted).toHaveLength(0);
    expect(finished).toEqual([{ runId: "run-1", outcome: "skipped", detail: "no_spot_row" }]);
    expect(alerts[0]!.kind).toBe("ai_insufficient_facts");
  });
});

describe("provider failures never create a post", () => {
  it.each([
    ["timeout", { ok: false as const, reason: "timeout after 60s", usage: null }],
    ["rate limited", { ok: false as const, reason: "provider status 429", usage: null }],
    ["server error", { ok: false as const, reason: "provider status 500", usage: null }],
    ["empty response", { ok: false as const, reason: "empty response", usage: null }],
  ])("%s", async (_label, response) => {
    const { deps, alerts, persisted, finished } = harness({ generate: async () => response });
    const result = await runDailyNoteGeneration(deps);
    expect(result).toMatchObject({ outcome: "error" });
    expect(persisted).toHaveLength(0);
    expect(finished).toHaveLength(1);
    expect(alerts.map((entry) => entry.kind)).toContain("ai_provider_failure");
  });

  it("rejects malformed structured output", async () => {
    const { deps, alerts, persisted } = harness({
      generate: async () => ({ ok: true, raw: { title: "too short" }, usage: null }),
    });
    expect(await runDailyNoteGeneration(deps)).toMatchObject({ outcome: "rejected" });
    expect(persisted).toHaveLength(0);
    expect(alerts.map((entry) => entry.kind)).toContain("ai_malformed_output");
  });

  it("records a run even when the provider reports no usage metadata", async () => {
    const { deps, finished } = harness({
      generate: async () => ({ ok: true, raw: GOOD_MODEL_OUTPUT, usage: null }),
    });
    expect(await runDailyNoteGeneration(deps)).toMatchObject({ outcome: "saved" });
    expect(finished).toHaveLength(1);
  });

  it("rejects the whole generation when verification fails", async () => {
    const bad = structuredClone(GOOD_MODEL_OUTPUT);
    bad.paragraphs[1]!.text = "Against the previous close, gold is higher by 7.77%.";
    const { deps, alerts, persisted } = harness({
      generate: async () => ({ ok: true, raw: bad, usage: null }),
    });
    expect(await runDailyNoteGeneration(deps)).toMatchObject({ outcome: "rejected" });
    expect(persisted).toHaveLength(0);
    const verification = alerts.find((entry) => entry.kind === "ai_verification_failed");
    expect(verification?.severity).toBe("critical");
  });

  it("does not save without internal sources", async () => {
    const { deps, alerts, persisted } = harness({ buildSources: () => [] });
    expect(await runDailyNoteGeneration(deps)).toMatchObject({ outcome: "rejected" });
    expect(persisted).toHaveLength(0);
    expect(alerts.map((entry) => entry.kind)).toContain("ai_source_missing");
  });

  it("reports a persistence failure without leaving a partial result", async () => {
    const { deps, alerts } = harness({
      persist: async () => {
        throw new Error("boom");
      },
    });
    expect(await runDailyNoteGeneration(deps)).toMatchObject({ outcome: "error" });
    expect(alerts.map((entry) => entry.kind)).toContain("ai_persist_failed");
  });
});

describe("the success path", () => {
  it("saves a deterministic slug, a verified body and exactly one disclaimer", async () => {
    const { deps, persisted, finished } = harness();
    const result = await runDailyNoteGeneration(deps);
    expect(result).toEqual({ outcome: "saved", postId: "post-1", runId: "run-1" });

    const saved = persisted[0] as { slug: string; body: string[]; sources: unknown[] };
    expect(saved.slug).toBe("aurum-daily-note-2026-09-22");
    expect(saved.body.filter((line) => line === DISCLAIMER)).toHaveLength(1);
    expect(saved.body.at(-1)).toBe(DISCLAIMER);
    expect(saved.sources).toHaveLength(1);
    expect(finished[0]).toMatchObject({ outcome: "saved", postId: "post-1" });
  });

  it("logs provider, model and token usage on the run", async () => {
    const { deps, finished } = harness();
    await runDailyNoteGeneration(deps);
    expect(finished[0]).toMatchObject({
      usage: {
        provider: "lovable-ai-gateway",
        model: "openai/gpt-6-astra",
        inputTokens: 900,
        outputTokens: 210,
        totalTokens: 1110,
        costUsd: null,
      },
    });
  });

  it("never asks for any state other than in_review", async () => {
    const { deps, persisted } = harness();
    await runDailyNoteGeneration(deps);
    const serialised = JSON.stringify(persisted);
    expect(serialised).not.toContain("published");
    expect(serialised).not.toContain("reviewed_by");
    expect(serialised).not.toContain("author_id");
  });
});
