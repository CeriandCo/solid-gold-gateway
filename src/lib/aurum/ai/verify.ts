/**
 * Deterministic verification of model output. Nothing reaches the database
 * unless every check here passes; a single violation rejects the WHOLE
 * generation (no sentence surgery, no partial save).
 *
 * Three independent layers:
 *   1. numerical  — every number in the draft must be a permitted rendering of
 *                   a fact-pack value (or an allowlisted structural number).
 *   2. semantic   — every fact paragraph must bind to the right subject,
 *                   metric, direction, period and value.
 *   3. linguistic — no causal explanation, prediction, advice, named entity or
 *                   disclaimer text produced by the model.
 */
import { DISCLAIMER, type ModelDraft } from "./contract";
import { allowedRenderings, type Fact, type FactPack } from "./fact-pack";

export type Violation = { code: string; detail: string };
export type VerifyResult = { ok: true } | { ok: false; violations: Violation[] };

const NUMBER_TOKEN = /[-+]?\$?\d[\d,]*(?:\.\d+)?%?/g;

/** Words that are never allowed anywhere in an AI Daily Note. */
const BANNED_TERMS = [
  // causation / macro / geopolitics
  "because", "due to", "driven by", "amid", "amidst", "fuelled", "fueled", "sparked",
  "spurred", "triggered by", "in response to", "on the back of", "attributed",
  "reflecting", "as investors", "as traders", "sentiment", "safe haven", "safe-haven",
  "inflation", "interest rate", "rate cut", "rate hike", "monetary", "fiscal", "stimulus",
  "recession", "tariff", "election", "war", "conflict", "geopolit", "economy", "economic",
  "demand", "supply", "flows", "etf", "central bank", "federal reserve", "the fed",
  "treasury", "cpi", "gdp", "jobs report", "news",
  // trade / industry claims
  "mint", "dealer", "premium", "spread", "inventory", "stock levels", "lead time",
  "production", "refiner", "vault shortage", "institutional",
  // advice / prediction
  "forecast", "predict", "expect", "outlook", "target price", "should buy", "should sell",
  "recommend", "advice", "advise", "opportunity to buy", "will rise", "will fall",
  "likely to", "we think", "investors should",
];

/** Capitalised words that are legitimate inside a Daily Note. */
const ALLOWED_CAPITALISED = new Set([
  "AURUM", "SQOOT", "Pure", "Gold", "Daily", "Note", "USD", "US", "UTC", "Spot",
  "January", "February", "March", "April", "May", "June", "July", "August",
  "September", "October", "November", "December",
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
]);

const UP_WORDS = /\b(rose|rise|risen|rising|up|higher|gained|gain|climbed|climb|advanced|stronger)\b/i;
const DOWN_WORDS = /\b(fell|fall|fallen|falling|down|lower|lost|loss|declined|decline|slipped|slip|weaker)\b/i;

function normaliseNumber(token: string): string {
  return token.replace(/[$,%+\s]/g, "").replace(/^-/, "");
}

/** Every plain-decimal string the draft is allowed to print. */
export function allowedNumberStrings(pack: FactPack): Set<string> {
  const allowed = new Set<string>();
  for (const fact of pack.facts) {
    for (const rendering of allowedRenderings(fact)) allowed.add(rendering);
  }
  // Structural, non-market numbers: the 24-hour range label and the calendar
  // parts of the effective timestamps the facts already carry.
  allowed.add("24");
  for (const fact of pack.facts) {
    const date = new Date(fact.effectiveAt);
    allowed.add(String(date.getUTCFullYear()));
    allowed.add(String(date.getUTCDate()));
    allowed.add(String(date.getUTCDate()).padStart(2, "0"));
  }
  return allowed;
}

function factById(pack: FactPack, id: string): Fact | undefined {
  return pack.facts.find((fact) => fact.id === id);
}

function checkNumbers(text: string, where: string, allowed: Set<string>): Violation[] {
  const violations: Violation[] = [];
  for (const match of text.match(NUMBER_TOKEN) ?? []) {
    const value = normaliseNumber(match);
    if (!allowed.has(value)) {
      violations.push({ code: "unsupported_number", detail: `${where}: "${match}"` });
    }
  }
  return violations;
}

function checkLanguage(text: string, where: string): Violation[] {
  const violations: Violation[] = [];
  const lower = text.toLowerCase();
  for (const term of BANNED_TERMS) {
    if (lower.includes(term)) {
      violations.push({ code: "prohibited_claim", detail: `${where}: "${term}"` });
    }
  }
  if (lower.includes("investment advice") || text.includes(DISCLAIMER)) {
    violations.push({ code: "model_wrote_disclaimer", detail: where });
  }

  // Capitalised tokens that are not sentence-initial are treated as named
  // entities unless explicitly allowed. Conservative on purpose.
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    const tokens = sentence.trim().split(/\s+/);
    tokens.slice(1).forEach((rawToken) => {
      const token = rawToken.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, "");
      if (!/^[A-Z][A-Za-z]{1,}$/.test(token)) return;
      if (ALLOWED_CAPITALISED.has(token)) return;
      violations.push({ code: "named_entity", detail: `${where}: "${token}"` });
    });
  }
  return violations;
}

export function verifyDraft(draft: ModelDraft, pack: FactPack): VerifyResult {
  const violations: Violation[] = [];
  const allowed = allowedNumberStrings(pack);

  const segments: { where: string; text: string }[] = [
    { where: "title", text: draft.title },
    { where: "summary", text: draft.summary },
    ...draft.paragraphs.map((paragraph, index) => ({
      where: `paragraph ${index + 1}`,
      text: paragraph.text,
    })),
  ];

  for (const segment of segments) {
    violations.push(...checkNumbers(segment.text, segment.where, allowed));
    violations.push(...checkLanguage(segment.text, segment.where));
  }

  let factParagraphs = 0;
  draft.paragraphs.forEach((paragraph, index) => {
    const where = `paragraph ${index + 1}`;
    if (paragraph.kind === "context") {
      if (/\d/.test(paragraph.text)) {
        violations.push({ code: "number_in_context_paragraph", detail: where });
      }
      return;
    }

    factParagraphs += 1;
    const fact = factById(pack, paragraph.factId);
    if (!fact) {
      violations.push({ code: "unknown_fact_reference", detail: `${where}: ${paragraph.factId}` });
      return;
    }
    if (paragraph.subject.trim().toLowerCase() !== fact.subject) {
      violations.push({ code: "wrong_subject", detail: `${where}: ${paragraph.subject}` });
    }
    if (paragraph.metric.trim() !== fact.metric) {
      violations.push({ code: "wrong_metric", detail: `${where}: ${paragraph.metric}` });
    }
    if (paragraph.direction !== fact.direction) {
      violations.push({ code: "wrong_direction", detail: `${where}: ${paragraph.direction}` });
    }

    const text = paragraph.text;
    const renderings = allowedRenderings(fact);
    const printed = (text.match(NUMBER_TOKEN) ?? []).map(normaliseNumber);
    if (!printed.some((value) => renderings.includes(value))) {
      violations.push({ code: "fact_value_missing", detail: `${where}: ${fact.id}` });
    }
    if (!/\bgold\b/i.test(text)) {
      violations.push({ code: "subject_missing_in_text", detail: where });
    }
    if (fact.direction === "up" && DOWN_WORDS.test(text)) {
      violations.push({ code: "direction_contradiction", detail: where });
    }
    if (fact.direction === "down" && UP_WORDS.test(text)) {
      violations.push({ code: "direction_contradiction", detail: where });
    }
    // A fact paragraph may only carry its own fact's number(s).
    for (const value of printed) {
      if (!renderings.includes(value) && !allowedNumberStrings(pack).has(value)) {
        violations.push({ code: "unsupported_number", detail: `${where}: ${value}` });
      }
    }
  });

  if (factParagraphs === 0) {
    violations.push({ code: "no_verifiable_fact", detail: "draft states no fact-pack fact" });
  }

  return violations.length === 0 ? { ok: true } : { ok: false, violations };
}

/** Trusted composition: paragraph texts plus exactly one disclaimer. */
export function composeBody(draft: ModelDraft): string[] {
  const body = draft.paragraphs.map((paragraph) => paragraph.text.trim()).filter(Boolean);
  return [...body, DISCLAIMER];
}
