import { describe, expect, it, vi } from "vitest";

import { generateManualDraft, NO_FACTS_MESSAGE, parseManualInput } from "./manual.server";

const facts = [
  { label: "24h high", value: "$4,310" },
  { label: "Spot price", value: "$4,295.80" },
];
const usage = { provider: "p", model: "m", inputTokens: 10, outputTokens: 20, totalTokens: 30, costUsd: null };

const good = {
  title: "Gold held a narrow range",
  summary: "A short look at the figures the editor supplied today.",
  paragraphs: [
    { kind: "fact", factId: "f1", subject: "gold", metric: "24h high", direction: "up", text: "Gold reached a 24h high of $4,310 during the session." },
    { kind: "context", factId: null, subject: null, metric: null, direction: null, text: "These figures describe the recent trading window only." },
    { kind: "fact", factId: "f2", subject: "gold", metric: "Spot price", direction: "none", text: "The gold spot price stood at $4,295.80 at the time of writing." },
  ],
};

describe("generateDraftFromPrompt core", () => {
  it("rejects empty facts without calling the model", async () => {
    const generate = vi.fn();
    const record = vi.fn();
    const result = await generateManualDraft({ brief: "x", facts: [] }, { generate, record });
    expect(result).toEqual({ ok: false, error: NO_FACTS_MESSAGE });
    expect(generate).not.toHaveBeenCalled();
    expect(parseManualInput({ brief: "x", facts: [{ label: "", value: "" }] }).facts).toEqual([]);
  });

  it("flattens a well-formed response into body paragraphs and records usage", async () => {
    const record = vi.fn();
    const result = await generateManualDraft(
      { brief: "Short note", facts },
      { generate: async () => ({ ok: true, raw: good, usage }), record },
    );
    expect(result).toEqual({
      ok: true,
      title: good.title,
      summary: good.summary,
      body: good.paragraphs.map((p) => p.text),
    });
    expect(record).toHaveBeenCalledWith({ outcome: "generated", usage, detail: null });
  });

  it("returns a clean error when the provider fails or throws", async () => {
    const record = vi.fn();
    const failed = await generateManualDraft(
      { brief: "", facts },
      { generate: async () => ({ ok: false, reason: "provider_status_503", usage }), record },
    );
    expect(failed.ok).toBe(false);
    expect(record).toHaveBeenCalledWith(expect.objectContaining({ outcome: "error" }));
    const thrown = await generateManualDraft(
      { brief: "", facts },
      { generate: async () => { throw new Error("boom"); }, record: async () => { throw new Error("db"); } },
    );
    expect(thrown.ok).toBe(false);
  });

  it("discards a draft stating a number not in the facts", async () => {
    const bad = structuredClone(good);
    bad.paragraphs[0]!.text = "Gold reached a 24h high of $4,400 during the session.";
    const record = vi.fn();
    const result = await generateManualDraft(
      { brief: "", facts },
      { generate: async () => ({ ok: true, raw: bad, usage }), record },
    );
    expect(result.ok).toBe(false);
    expect(record).toHaveBeenCalledWith(expect.objectContaining({ outcome: "rejected" }));
  });
});
