/**
 * Structural regression test: there must be no path from AI generation to a
 * published post. This reads the generation source itself, so a future edit
 * that adds a publish call fails here.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const AI_DIR = join(process.cwd(), "src/lib/aurum/ai");
const ROUTE = join(process.cwd(), "src/routes/api/public/aurum-ai-daily-note.ts");

function sourceFiles(): { path: string; text: string }[] {
  return readdirSync(AI_DIR)
    .filter((name) => name.endsWith(".ts") && !name.endsWith(".test.ts"))
    .map((name) => ({ path: name, text: readFileSync(join(AI_DIR, name), "utf8") }))
    .concat([{ path: "route", text: readFileSync(ROUTE, "utf8") }]);
}

const FORBIDDEN = [
  "publishPost",
  "aurum_publish_post",
  "archivePost",
  "restoreToDraft",
  "submitForReview",
  "'published'",
  '"published"',
  "status: \"published\"",
];

describe("no AI -> published path", () => {
  it.each(FORBIDDEN)("generation code never references %s", (needle) => {
    for (const file of sourceFiles()) {
      expect(file.text.includes(needle), `${file.path} references ${needle}`).toBe(false);
    }
  });

  it("the only editorial state the pipeline persists is in_review", () => {
    const persistence = sourceFiles()
      .map((file) => file.text)
      .join("\n");
    expect(persistence).toContain("aurum_ai_create_in_review");
    expect(persistence).not.toMatch(/status\s*[:=]\s*["'](published|archived|draft)["']/);
  });

  it("the model is never handed credentials, a database client or tools", () => {
    const contract = readFileSync(join(AI_DIR, "contract.ts"), "utf8");
    const provider = readFileSync(join(AI_DIR, "provider.server.ts"), "utf8");
    for (const needle of ["supabase", "SERVICE_ROLE", "CRON_SECRET", "tools", "web_search"]) {
      expect(contract.includes(needle)).toBe(false);
      expect(provider.includes(needle)).toBe(false);
    }
  });
});
