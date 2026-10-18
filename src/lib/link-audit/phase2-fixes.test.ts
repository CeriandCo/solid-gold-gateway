import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// T5 Phase 2 regression guards for the three repaired links.
const read = (p: string) => readFileSync(p, "utf8");

describe("T5 Phase 2 link repairs", () => {
  it("Vault 'See how it works' targets the founder walkthrough section, which carries the id", () => {
    const s = read("src/routes/vault.tsx");
    expect(s).toContain('href="#walkthrough"');
    expect(s).toMatch(/\{\/\* Founder walkthrough \*\/\}\s*<section data-reveal id="walkthrough"/);
  });

  it("retired home preview route is absent", () => {
    expect(existsSync("src/routes/home-old-ver.tsx")).toBe(false);
  });

  it("retired gifting preview route is absent", () => {
    expect(existsSync("src/routes/gifting-old-ver.tsx")).toBe(false);
  });

  it("Goldhub opens the official World Gold Council Goldhub in a safe new tab", () => {
    expect(read("src/routes/learn.index.tsx")).toContain(
      '<GoldButton href="https://www.gold.org/goldhub" target="_blank" rel="noopener noreferrer">Goldhub</GoldButton>',
    );
  });
});
