import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { AurumEditorialArchive } from "@/components/aurum-editorial-archive";
import { fetchEditorialPage } from "@/lib/aurum-editorial.functions";

const canonical = "https://solid-gold-gateway.lovable.app/aurum/briefs";
export const Route = createFileRoute("/aurum_/briefs/")({
  validateSearch: (search: Record<string, unknown>) => {
    const parsed = Math.trunc(Number(search["page"] ?? 1));
    return { page: Number.isFinite(parsed) && parsed > 0 ? parsed : 1 };
  },
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: ({ deps }) => fetchEditorialPage({ data: { type: "weekly_brief", limit: 20, offset: (deps.page - 1) * 20 } }),
  head: () => ({
    meta: [
      { title: "Weekly Brief Archive | AURUM by SQOOT Pure" },
      { name: "description", content: "Browse every published AURUM Weekly Brief on gold market context and physical ownership." },
      { property: "og:title", content: "Weekly Brief Archive | AURUM by SQOOT Pure" },
      { property: "og:description", content: "Browse every published AURUM Weekly Brief on gold market context and physical ownership." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical }],
  }),
  component: BriefsArchivePage,
});
function BriefsArchivePage() {
  const data = Route.useLoaderData();
  const { page } = Route.useSearch();
  return <div className="aurum-page"><SiteHeader /><AurumEditorialArchive kind="briefs" items={data.items} total={data.total} page={page} /><SiteFooter /></div>;
}
