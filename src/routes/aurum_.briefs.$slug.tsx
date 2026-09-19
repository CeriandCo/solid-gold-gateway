import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { AurumEditorialBody, AurumEditorialQuote, AurumEditorialSources } from "@/components/aurum-editorial-content";
import { formatEditorialDate } from "@/lib/aurum-editorial";
import { fetchEditorialBySlug } from "@/lib/aurum-editorial.functions";

export const Route = createFileRoute("/aurum_/briefs/$slug")({
  loader: async ({ params }) => {
    const brief = await fetchEditorialBySlug({ data: { type: "weekly_brief", slug: params.slug } });
    if (!brief) throw notFound();
    return { brief };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Brief unavailable | AURUM" },
          { name: "description", content: "This AURUM Weekly Brief is unavailable." },
          { property: "og:title", content: "Brief unavailable | AURUM" },
          { property: "og:description", content: "This AURUM Weekly Brief is unavailable." },
          { property: "og:type", content: "article" },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { brief } = loaderData;
    return {
      meta: [
        { title: `${brief.title} | AURUM Weekly Brief` },
        { name: "description", content: brief.summary },
        { property: "og:title", content: `${brief.title} | AURUM Weekly Brief` },
        { property: "og:description", content: brief.summary },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "robots", content: "noindex, nofollow" },
      ],
    };
  },
  component: AurumBriefPage,
  notFoundComponent: BriefNotFound,
});

function BriefNotFound() {
  return (
    <div className="aurum-page">
      <SiteHeader />
      <main className="aurum-note-page">
        <div className="aurum-container">
          <h1 className="aurum-note-page__title">Brief not found</h1>
          <Link className="aurum-note-page__back" to="/aurum" search={{ range: "1Y" as const, note: undefined, brief: undefined, priceState: undefined }} hash="weekly-brief">
            ← Back to the Weekly Brief
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function AurumBriefPage() {
  const { brief } = Route.useLoaderData();
  return (
    <div className="aurum-page">
      <SiteHeader />
      <main className="aurum-note-page aurum-brief-page">
        <article className="aurum-container">
          <p className="aurum-note-eyebrow">WEEKLY BRIEF</p>
          <h1 className="aurum-note-page__title">{brief.title}</h1>
          <p className="aurum-note-page__meta">{formatEditorialDate(brief.publishedAt)} · {brief.readMinutes} min read</p>
          <p className="aurum-note-page__summary">{brief.summary}</p>
          <AurumEditorialBody article={brief} />
          <AurumEditorialQuote article={brief} />
          <AurumEditorialSources article={brief} idPrefix={`brief-${brief.slug}`} />
          {brief.reviewLine ? <p className="aurum-editorial-review aurum-editorial-review--closing">{brief.reviewLine}</p> : null}
          <Link className="aurum-note-page__back" to="/aurum" search={{ range: "1Y" as const, note: undefined, brief: undefined, priceState: undefined }} hash="weekly-brief">
            ← Back to the Weekly Brief
          </Link>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}