/**
 * T5 Phase 3 — apply semantic verdicts to the regenerated audit artifact.
 * Run after scripts/link-audit/analyze.ts. Never edit the JSON by hand.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { classifySemantic, setDestinationLookup, type SemanticOccurrence } from "../../src/lib/link-audit/semantic";

const PATH = "docs/verification/t5-link-audit.json";
const artifact = JSON.parse(readFileSync(PATH, "utf8"));
type Occ = SemanticOccurrence & { destinationH1?: string | null; [k: string]: unknown };

setDestinationLookup((o) => ((o as Occ).destinationH1 ?? "") as string);

const counts: Record<string, number> = {};
const severities: Record<string, number> = {};
const rules: Record<string, number> = {};
for (const o of artifact.occurrences as Occ[]) {
  const r = classifySemantic(o);
  Object.assign(o, r);
  o.semanticGroup = o.global ? `global:${o.surface}:${o.linkText}` : `individual`;
  counts[r.semanticVerdict] = (counts[r.semanticVerdict] ?? 0) + 1;
  severities[r.semanticSeverity] = (severities[r.semanticSeverity] ?? 0) + 1;
  rules[r.semanticRule] = (rules[r.semanticRule] ?? 0) + 1;
}
const occ = artifact.occurrences as Occ[];
artifact.semanticSummary = {
  reviewedAt: new Date().toISOString(),
  occurrences: occ.length,
  globalComponentOccurrences: occ.filter((o) => o.global).length,
  globalGroups: new Set(occ.filter((o) => o.global).map((o) => o.semanticGroup)).size,
  individualOccurrences: occ.filter((o) => !o.global).length,
  verdicts: counts,
  severities,
  rules,
};
writeFileSync(PATH, JSON.stringify(artifact, null, 2) + "\n");
console.log(JSON.stringify(artifact.semanticSummary, null, 2));
