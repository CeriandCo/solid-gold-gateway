import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { classifySemantic, setDestinationLookup, type SemanticOccurrence } from "./semantic";

const base: SemanticOccurrence = {
  sourceRoute: "/",
  linkText: "",
  normalizedTarget: "",
  rawTarget: "",
  category: "internal-page",
  global: false,
};

describe("T5 Phase 3 semantic verdicts", () => {
  it("never inherits a verdict for an unknown link", () => {
    expect(classifySemantic({ ...base, linkText: "Brand new CTA", normalizedTarget: "/somewhere" }).semanticVerdict).toBe("UNREVIEWED");
  });

  it("flags the homepage spread card if it regresses to the archive", () => {
    const r = classifySemantic({ ...base, linkText: "Read the note", normalizedTarget: "/aurum/notes?page=1" });
    expect(r.semanticVerdict).toBe("INCORRECT");
    expect(classifySemantic({ ...base, linkText: "Read the note", normalizedTarget: "/aurum/notes/spread-on-a-one-ounce-coin" }).semanticVerdict).toBe("CORRECT");
  });

  it("does not accept a global label pointing at the wrong page", () => {
    expect(classifySemantic({ ...base, global: true, linkText: "Vault", normalizedTarget: "/gifting" }).semanticVerdict).toBe("UNREVIEWED");
  });

  it("keeps Sign Up on Gold.org blocked rather than correct", () => {
    expect(classifySemantic({ ...base, sourceRoute: "/learn", linkText: "Sign Up on Gold.org", normalizedTarget: "#", category: "placeholder" }).semanticVerdict).toBe("TECHNICALLY BLOCKED");
  });

  it("archive cards must match the destination title", () => {
    setDestinationLookup(() => "Three mints reported longer lead times");
    const o = { ...base, sourceRoute: "/learn", linkText: "DAILY NOTE 10 September 2026 Why the spread on a one ounce coin moved", normalizedTarget: "/aurum/notes/spread-on-a-one-ounce-coin" };
    expect(classifySemantic(o).semanticVerdict).toBe("UNREVIEWED");
    setDestinationLookup(() => "");
  });

  it("the committed artifact has no unreviewed and no incorrect occurrences", () => {
    const a = JSON.parse(readFileSync("docs/verification/t5-link-audit.json", "utf8"));
    const verdicts = a.occurrences.map((o: { semanticVerdict: string }) => o.semanticVerdict);
    expect(verdicts.length).toBe(a.occurrences.length);
    expect(verdicts.filter((v: string) => v === "UNREVIEWED" || v === "PENDING (Phase 3)")).toEqual([]);
    expect(verdicts.filter((v: string) => v === "INCORRECT")).toEqual([]);
  });
});
