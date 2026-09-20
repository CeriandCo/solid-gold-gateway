import { createFileRoute } from "@tanstack/react-router";
import { LearnArticlePage } from "@/components/learn-article-page";
import { PUBLISHED_LEARN_ARTICLES } from "@/lib/learn-articles";

const article = PUBLISHED_LEARN_ARTICLES.find((candidate) => candidate.slug === "how-to-buy-gold-safely");
if (!article) throw new Error("Published Learn article is missing");

export const Route = createFileRoute("/learn/how-to-buy-gold-safely")({
  head: () => ({
    meta: [
      { title: "How to Buy Physical Gold Online Safely | SQOOT Pure" },
      { name: "description", content: article.summary },
      { property: "og:title", content: "How to Buy Physical Gold Online Safely | SQOOT Pure" },
      { property: "og:description", content: article.ogDescription },
      { property: "og:url", content: "https://solid-gold-gateway.lovable.app/learn/how-to-buy-gold-safely" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://solid-gold-gateway.lovable.app/learn/how-to-buy-gold-safely" }],
  }),
  component: () => <LearnArticlePage article={article} />,
});
