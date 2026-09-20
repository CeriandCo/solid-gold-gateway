import { createFileRoute } from "@tanstack/react-router";
import { LearnArticlePage } from "@/components/learn-article-page";
import { PUBLISHED_LEARN_ARTICLES } from "@/lib/learn-articles";

const article = PUBLISHED_LEARN_ARTICLES.find((candidate) => candidate.slug === "gifting-gold-guide");
if (!article) throw new Error("Published Learn article is missing");

export const Route = createFileRoute("/learn/gifting-gold-guide")({
  head: () => ({
    meta: [
      { title: "Gifting Gold: A Guide for Weddings, Festivals, and Milestones | SQOOT Pure" },
      { name: "description", content: article.summary },
      { property: "og:title", content: "Gifting Gold: A Guide for Weddings, Festivals, and Milestones | SQOOT Pure" },
      { property: "og:description", content: article.ogDescription },
      { property: "og:url", content: "https://solid-gold-gateway.lovable.app/learn/gifting-gold-guide" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://solid-gold-gateway.lovable.app/learn/gifting-gold-guide" }],
  }),
  component: () => <LearnArticlePage article={article} />,
});
