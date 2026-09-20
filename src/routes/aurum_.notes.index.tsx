import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { AurumEditorialArchive } from "@/components/aurum-editorial-archive";
import { fetchPublishedLearnNotes } from "@/lib/aurum-editorial.functions";

const canonical = "https://solid-gold-gateway.lovable.app/aurum/notes";
export const Route = createFileRoute("/aurum_/notes/")({
  validateSearch: (search: Record<string, unknown>) => {
    const parsed = Math.trunc(Number(search["page"] ?? 1));
    return { page: Number.isFinite(parsed) && parsed > 0 ? parsed : 1 };
  },
  loaderDeps: ({ search }) => ({ page: search.page }),
  loader: ({ deps }) => fetchPublishedLearnNotes({ data: { limit: 20, offset: (deps.page - 1) * 20 } }),
  head: () => ({
    meta: [
      { title: "Daily Note Archive | AURUM by SQOOT Pure" },
      { name: "description", content: "Browse AURUM's published, sourced notes on gold ownership and the gold market." },
      { property: "og:title", content: "Daily Note Archive | AURUM by SQOOT Pure" },
      { property: "og:description", content: "Browse AURUM's published, sourced notes on gold ownership and the gold market." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical }],
  }),
  component: NotesArchivePage,
});
function NotesArchivePage() {
  const data = Route.useLoaderData();
  const { page } = Route.useSearch();
  return <div className="aurum-page"><SiteHeader /><AurumEditorialArchive kind="notes" items={data.items} total={data.total} page={page} /><SiteFooter /></div>;
}
