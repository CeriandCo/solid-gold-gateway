import { describe, expect, it } from "vitest";
import { getPublishedLearnArticle, getPublishedLearnArticles, PUBLISHED_LEARN_ARTICLES } from "@/lib/learn-articles";

describe("published Learn articles as AURUM notes", () => {
  it("exposes exactly the three published Learn articles in their editorial order", () => {
    expect(getPublishedLearnArticles().map((article) => article.slug)).toEqual([
      "physical-gold-vs-gold-etf",
      "how-to-buy-gold-safely",
      "gifting-gold-guide",
    ]);
  });

  it("uses the publication date and computes read times at 200 words per minute", () => {
    for (const source of PUBLISHED_LEARN_ARTICLES) {
      const note = getPublishedLearnArticle(source.slug);
      expect(note?.publishedAt).toBe("2026-09-10");
      const body = source.blocks.flatMap((block) => block.type === "ul" ? block.items : [block.text]);
      const words = body.join(" ").trim().split(/\s+/).filter(Boolean).length;
      expect(note?.readMinutes).toBe(Math.max(1, Math.ceil(words / 200)));
    }
  });

  it("keeps structured body content identical for in-page and detail rendering", () => {
    for (const source of PUBLISHED_LEARN_ARTICLES) {
      const inPage = getPublishedLearnArticle(source.slug);
      const detail = getPublishedLearnArticle(source.slug);
      expect(detail).toEqual(inPage);
      expect(detail?.blocks).toEqual(source.blocks);
    }
  });

  it("does not invent sources", () => {
    expect(getPublishedLearnArticle("physical-gold-vs-gold-etf")?.sources).toEqual([]);
    expect(getPublishedLearnArticle("gifting-gold-guide")?.sources).toEqual([]);
    expect(getPublishedLearnArticle("how-to-buy-gold-safely")?.sources).toHaveLength(1);
  });
});
