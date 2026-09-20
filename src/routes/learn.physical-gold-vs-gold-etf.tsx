import { createFileRoute } from "@tanstack/react-router";
import { LearnArticlePage } from "@/components/learn-article-page";
import { PUBLISHED_LEARN_ARTICLES } from "@/lib/learn-articles";

const article = PUBLISHED_LEARN_ARTICLES.find((candidate) => candidate.slug === "physical-gold-vs-gold-etf");
if (!article) throw new Error("Published Learn article is missing");

export const Route = createFileRoute("/learn/physical-gold-vs-gold-etf")({
  head: () => ({
    meta: [
      { title: "Physical Gold vs Gold ETF: What You Actually Own | SQOOT Pure" },
      { name: "description", content: article.summary },
      { property: "og:title", content: "Physical Gold vs Gold ETF: What You Actually Own | SQOOT Pure" },
      { property: "og:description", content: article.ogDescription },
      { property: "og:url", content: "https://solid-gold-gateway.lovable.app/learn/physical-gold-vs-gold-etf" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://solid-gold-gateway.lovable.app/learn/physical-gold-vs-gold-etf" }],
  }),
  component: () => <LearnArticlePage article={article} />,
});
