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

/** Names that would move a post out of in_review. None may appear at all. */
const FORBIDDEN = [
  "publishPost",
  "aurum_publish_post",
  "archivePost",
  "restoreToDraft",
  "submitForReview",
];

describe("no AI -> published path", () => {
  it.each(FORBIDDEN)("generation code never references %s", (needle) => {
    for (const file of sourceFiles()) {
      expect(file.text.includes(needle), `${file.path} references ${needle}`).toBe(false);
    }
  });

  it("the only editorial state the pipeline persists is in_review", () => {
    const all = sourceFiles()
      .map((file) => file.text)
      .join("\n");
    expect(all).toContain("aurum_ai_create_in_review");
    // No write of any other workflow state, and no post mutation at all.
    expect(all).not.toMatch(/status\s*[:=]\s*["'](published|archived|draft|in_review)["']/);
    expect(all).not.toMatch(/from\(["']aurum_posts["']\)[\s\S]{0,120}\.(update|upsert|delete)\(/);
  });

  it("reads published posts for style only, and never writes them", () => {
    const data = readFileSync(join(AI_DIR, "data.server.ts"), "utf8");
    expect(data).toContain('.eq("status", "published")');
    for (const write of [".update(", ".insert(", ".upsert(", ".delete("]) {
      expect(data.includes(write), `data.server.ts uses ${write}`).toBe(false);
    }
  });

  it("the model is never handed credentials, a database client or tools", () => {
    const contract = readFileSync(join(AI_DIR, "contract.ts"), "utf8");
    const provider = readFileSync(join(AI_DIR, "provider.server.ts"), "utf8");
    for (const needle of [
      "supabase",
      "SERVICE_ROLE",
      "CRON_SECRET",
      "LOVABLE_API_KEY",
      '"tools"',
      "web_search",
      "tool_choice",
    ]) {
      expect(contract.includes(needle)).toBe(false);
      expect(provider.includes(needle)).toBe(false);
    }
  });
});
