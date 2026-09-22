import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { AurumNoteBody, AurumNoteQuote, AurumNoteSources } from "@/components/aurum-note-content";
import { formatNoteDate } from "@/lib/aurum-notes";
import { fetchEditorialBySlug, fetchPublishedLearnNoteBySlug } from "@/lib/aurum-editorial.functions";

const origin = "https://solid-gold-gateway.lovable.app";

export const Route = createFileRoute("/aurum_/notes/$slug")({
  loader: async ({ params }) => {
    // Learn-fed notes first; archived database Daily Notes keep their existing URLs.
    const note =
      (await fetchPublishedLearnNoteBySlug({ data: { slug: params.slug } })) ??
      (await fetchEditorialBySlug({ data: { type: "daily_note", slug: params.slug } }));
    if (!note) throw notFound();
    return { note };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [
        { title: "Note unavailable | AURUM" },
        { name: "description", content: "This AURUM Daily Note is unavailable." },
        { property: "og:title", content: "Note unavailable | AURUM" },
        { property: "og:description", content: "This AURUM Daily Note is unavailable." },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "robots", content: "noindex" },
      ] };
    }
    const { note } = loaderData;
    return {
      meta: [
        { title: `${note.title} | AURUM Daily Note` },
        { name: "description", content: note.summary },
        { property: "og:title", content: `${note.title} | AURUM Daily Note` },
        { property: "og:description", content: note.summary },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:url", content: `${origin}/aurum/notes/${note.slug}` },
      ],
      links: [{ rel: "canonical", href: `${origin}/aurum/notes/${note.slug}` }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: note.title,
          description: note.summary,
          datePublished: note.publishedAt,
          mainEntityOfPage: `${origin}/aurum/notes/${note.slug}`,
          publisher: { "@type": "Organization", name: "SQOOT Pure" },
        }),
      }],
    };
  },
  component: AurumNotePage,
  notFoundComponent: () => (
    <div className="aurum-page">
      <SiteHeader />
      <main className="aurum-note-page">
        <div className="site-container">
          <h1 className="aurum-note-page__title">Note not found</h1>
          <Link className="aurum-note-page__back" to="/aurum/notes" search={{ page: 1 }}>
            ← Back to the notes archive
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  ),
});

function AurumNotePage() {
  const { note } = Route.useLoaderData();

  return (
    <div className="aurum-page">
      <SiteHeader />
      <main className="aurum-note-page">
        <article className="site-container">
          <p className="aurum-note-eyebrow">DAILY NOTE</p>
          <h1 className="aurum-note-page__title">{note.title}</h1>
          <p className="aurum-note-page__meta">
            {formatNoteDate(note.publishedAt)} · {note.readMinutes} min read
          </p>
          <p className="aurum-note-page__summary">{note.summary}</p>
          <AurumNoteBody note={note} />
          <AurumNoteQuote note={note} />
          <AurumNoteSources note={note} idPrefix={`note-${note.slug}`} />
          <Link className="aurum-note-page__back" to="/aurum/notes" search={{ page: 1 }}>
            ← Back to the notes archive
          </Link>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
