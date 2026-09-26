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

  it("discards a draft that leaves out a supplied fact", async () => {
    const missing = structuredClone(good);
    missing.paragraphs = missing.paragraphs.filter((p) => p.factId !== "f2");
    const record = vi.fn();
    const result = await generateManualDraft(
      { brief: "", facts },
      { generate: async () => ({ ok: true, raw: missing, usage }), record },
    );
    expect(result.ok).toBe(false);
    expect(record).toHaveBeenCalledWith(expect.objectContaining({ outcome: "rejected", detail: expect.stringContaining("f2 not used") }));
  });

  it("accepts a supplied qualitative reason stated in a fact paragraph", async () => {
    const withDriver = [...facts, { label: "Key driver", value: "Weaker USD, inflation concerns" }];
    const draft = structuredClone(good);
    draft.paragraphs.push({ kind: "fact", factId: "f3", subject: "gold", metric: "Key driver", direction: "none", text: "The supplied driver for gold's move is a weaker USD and inflation concerns." });
    const result = await generateManualDraft(
      { brief: "", facts: withDriver },
      { generate: async () => ({ ok: true, raw: draft, usage }), record: vi.fn() },
    );
    expect(result.ok).toBe(true);
  });
});

describe("manual draft: woven facts", () => {
  const woven = [
    { label: "Spot price", value: "$4,312.50" },
    { label: "Previous close", value: "$4,283.60" },
  ];
  const draft = (factId: string, text: string) => ({
    title: "Gold edges up from its previous close",
    summary: "A modest move higher, measured against the prior close.",
    paragraphs: [
      { kind: "context", factId: null, subject: null, metric: null, direction: null, text: "A quiet session with a small tilt higher." },
      { kind: "fact", factId, subject: "gold", metric: "Spot price", direction: "up", text },
    ],
  });

  it("accepts one paragraph citing several facts and their numbers", async () => {
    const result = await generateManualDraft(
      { brief: "", facts: woven },
      { generate: async () => ({ ok: true, raw: draft("f1,f2", "Gold stood at $4,312.50, above the previous close of $4,283.60."), usage }), record: vi.fn() },
    );
    expect(result.ok).toBe(true);
  });

  it("still rejects a woven paragraph with a number outside its cited facts", async () => {
    const result = await generateManualDraft(
      { brief: "", facts: woven },
      { generate: async () => ({ ok: true, raw: draft("f1", "Gold stood at $4,312.50, above the previous close of $4,283.60."), usage }), record: vi.fn() },
    );
    expect(result.ok).toBe(false);
  });
});

describe("manual draft: strict number-to-label attribution", () => {
  const facts4 = [
    { label: "Spot price", value: "4,312.50 USD/oz" },
    { label: "24h change", value: "+0.68%" },
    { label: "Previous close", value: "4,283.60 USD/oz" },
    { label: "Key driver", value: "Weaker USD, inflation concerns" },
  ];
  const make = (text: string) => ({
    title: "Gold edges higher on a weaker dollar",
    summary: "A modest move higher against the previous close.",
    paragraphs: [
      { kind: "context", factId: null, subject: null, metric: null, direction: null, text: "A modest move, not a break from the pattern." },
      { kind: "fact", factId: "f1,f2,f3,f4", subject: "gold", metric: "Spot price", direction: "up", text },
    ],
  });
  const run = (text: string) =>
    generateManualDraft({ brief: "", facts: facts4 }, { generate: async () => ({ ok: true, raw: make(text), usage }), record: vi.fn() });

  it("accepts correctly labelled figures", async () => {
    expect((await run("With the spot price at 4,312.50 USD/oz, gold showed a 24h change of +0.68% against its previous close of 4,283.60 USD/oz, driven by weaker USD and inflation concerns.")).ok).toBe(true);
  });

  it("rejects swapped spot price and previous close", async () => {
    expect((await run("With the spot price at 4,283.60 USD/oz, gold showed a 24h change of +0.68% against its previous close of 4,312.50 USD/oz, driven by weaker USD and inflation concerns.")).ok).toBe(false);
  });

  it("rejects a figure with no label nearby (ambiguous fails closed)", async () => {
    expect((await run("Gold stood at 4,312.50 USD/oz, with a 24h change of +0.68% against a previous close of 4,283.60 USD/oz, driven by weaker USD and inflation concerns.")).ok).toBe(false);
  });
});
