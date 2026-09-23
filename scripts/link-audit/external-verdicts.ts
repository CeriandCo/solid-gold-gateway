/**
 * T5 Phase 4 — merge external verdicts into the audit artifact.
 * Run after semantic.ts. Usage: bun scripts/link-audit/external-verdicts.ts [/tmp/link-audit/external-raw-postfix.json]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { EXTERNAL_VERDICTS, isSafeNewTab, protocolIssue } from "../../src/lib/link-audit/external";

const PATH = "docs/verification/t5-link-audit.json";
const [rawPath = "/tmp/link-audit/external-raw-postfix.json"] = process.argv.slice(2);
const a = JSON.parse(readFileSync(PATH, "utf8"));
const raw = JSON.parse(readFileSync(rawPath, "utf8"));
type O = Record<string, any>;
const ext = (a.occurrences as O[]).filter((o) => o.category === "external");
const byOcc: Record<string, number> = {};
const byUrl: Record<string, number> = {};
for (const o of ext) {
  const v = EXTERNAL_VERDICTS[o.normalizedTarget];
  if (!v) throw new Error(`No Phase 4 verdict for ${o.normalizedTarget}`);
  o.externalVerdict = v.verdict;
  o.externalRedirect = v.redirect;
  o.externalFinalUrl = v.finalUrl;
  o.externalBlocksT5 = v.blocksT5;
  o.protocolIssue = protocolIssue(o.rawTarget);
  byOcc[v.verdict] = (byOcc[v.verdict] ?? 0) + 1;
}
const urls = [...new Set(ext.map((o) => o.normalizedTarget))];
for (const u of urls) byUrl[EXTERNAL_VERDICTS[u].verdict] = (byUrl[EXTERNAL_VERDICTS[u].verdict] ?? 0) + 1;
const blank = (a.occurrences as O[]).filter((o) => o.opensNewTab);
a.externalSummary = {
  checkedAt: raw.checkedAt,
  evidence: "docs/verification/t5-external-evidence.json",
  occurrences: ext.length,
  uniqueUrls: urls.length,
  uniqueHosts: new Set(urls.map((u) => new URL(u).hostname)).size,
  verdictsByOccurrence: byOcc,
  verdictsByUniqueUrl: byUrl,
  blankOccurrences: blank.length,
  unsafeBlank: blank.filter((o) => !isSafeNewTab("_blank", o.rel)).length,
  httpUrls: ext.filter((o) => o.protocolIssue === "plain http").length,
  protocolIssues: ext.filter((o) => o.protocolIssue).length,
  destinations: Object.fromEntries(urls.map((u) => [u, { ...EXTERNAL_VERDICTS[u], occurrences: ext.filter((o) => o.normalizedTarget === u).length }])),
};
writeFileSync(PATH, JSON.stringify(a, null, 1) + "\n");
writeFileSync("docs/verification/t5-external-evidence.json", JSON.stringify(raw, null, 1) + "\n");
console.log(JSON.stringify({ ...a.externalSummary, destinations: undefined }, null, 1));
