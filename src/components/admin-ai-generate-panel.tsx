import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateDraftFromPrompt } from "@/lib/admin.functions";

type Fact = { label: string; value: string };

/**
 * New-post only: fills title, summary and body from an editor brief and the
 * facts they type. Never saves or submits; sources are left for the editor.
 */
export function AdminAiGeneratePanel({
  onGenerated,
}: {
  onGenerated: (draft: { title: string; summary: string; body: string[] }) => void;
}) {
  const generate = useServerFn(generateDraftFromPrompt);
  const [open, setOpen] = useState(false);
  const [brief, setBrief] = useState("");
  const [facts, setFacts] = useState<Fact[]>([{ label: "", value: "" }]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const complete = facts.filter((fact) => fact.label.trim() && fact.value.trim());
  const canGenerate = complete.length > 0 && !busy;

  const setFact = (index: number, key: keyof Fact, value: string) =>
    setFacts((current) => current.map((f, i) => (i === index ? { ...f, [key]: value } : f)));

  const run = async () => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const result = await generate({ data: { brief, facts: complete } });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onGenerated(result);
      setNotice("Draft filled in below. Review every line and add sources before submitting.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Generation failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-field">
      <button
        type="button"
        className="admin-button admin-button--ghost"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? "Hide Generate with AI" : "Generate with AI"}
      </button>
      {open ? (
        <div className="admin-form">
          <p className="admin-help">
            The AI may only use the facts you enter. The result fills the form below as a starting
            draft; nothing is saved until you save it.
          </p>
          <div className="admin-field">
            <label className="admin-label" htmlFor="ai-brief">
              Brief
            </label>
            <textarea
              id="ai-brief"
              className="admin-input admin-textarea"
              rows={3}
              maxLength={2000}
              value={brief}
              onChange={(event) => setBrief(event.target.value)}
            />
          </div>
          <div className="admin-field">
            <span className="admin-label">Facts</span>
            {facts.map((fact, index) => (
              <div className="admin-paragraph" key={index}>
                <label className="admin-visually-hidden" htmlFor={`ai-fact-label-${index}`}>
                  Fact {index + 1} label
                </label>
                <input
                  id={`ai-fact-label-${index}`}
                  className="admin-input"
                  placeholder="Label, e.g. 24h high"
                  maxLength={60}
                  value={fact.label}
                  onChange={(event) => setFact(index, "label", event.target.value)}
                />
                <label className="admin-visually-hidden" htmlFor={`ai-fact-value-${index}`}>
                  Fact {index + 1} value
                </label>
                <input
                  id={`ai-fact-value-${index}`}
                  className="admin-input"
                  placeholder="Value, e.g. $4,310"
                  maxLength={120}
                  value={fact.value}
                  onChange={(event) => setFact(index, "value", event.target.value)}
                />
                <div className="admin-paragraph__actions">
                  <button
                    type="button"
                    className="admin-button admin-button--ghost"
                    disabled={facts.length === 1}
                    onClick={() => setFacts((current) => current.filter((_, i) => i !== index))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="admin-form__actions">
              <button
                type="button"
                className="admin-button admin-button--ghost"
                disabled={facts.length >= 8}
                onClick={() => setFacts((current) => [...current, { label: "", value: "" }])}
              >
                Add fact
              </button>
              <button type="button" className="admin-button" disabled={!canGenerate} onClick={run}>
                {busy ? "Generating…" : "Generate"}
              </button>
            </div>
            {complete.length === 0 ? (
              <p className="admin-help">Add at least one fact with a label and value.</p>
            ) : null}
          </div>
          {error ? (
            <p className="admin-alert" role="alert">
              {error}
            </p>
          ) : null}
          {notice ? (
            <p className="admin-note" role="status">
              {notice}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
