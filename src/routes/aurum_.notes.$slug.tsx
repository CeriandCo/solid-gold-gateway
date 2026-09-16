import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { AurumNoteBody, AurumNoteQuote, AurumNoteSources } from "@/components/aurum-note-content";
import { formatNoteDate, getAurumNote } from "@/lib/aurum-notes";

export const Route = createFileRoute("/aurum_/notes/$slug")({
  loader: ({ params }) => {
    const note = getAurumNote(params.slug);
    if (!note) throw notFound();
    return { note };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Note unavailable | AURUM" }, { name: "robots", content: "noindex" }] };
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
      ],
    };
  },
  component: AurumNotePage,
  notFoundComponent: () => (
    <div className="aurum-page">
      <SiteHeader />
      <main className="aurum-note-page">
        <div className="aurum-container">
          <h1 className="aurum-note-page__title">Note not found</h1>
          <Link className="aurum-note-page__back" to="/aurum" search={{ range: "1Y" as const, note: undefined }} hash="daily-note">
            ← Back to the Daily Note
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
        <article className="aurum-container">
          <p className="aurum-note-eyebrow">DAILY NOTE</p>
          <h1 className="aurum-note-page__title">{note.title}</h1>
          <p className="aurum-note-page__meta">
            {formatNoteDate(note.publishedAt)} · {note.readMinutes} min read
          </p>
          <p className="aurum-note-page__summary">{note.summary}</p>
          <AurumNoteBody note={note} />
          <AurumNoteQuote note={note} />
          <AurumNoteSources note={note} idPrefix={`note-${note.slug}`} />
          <Link className="aurum-note-page__back" to="/aurum" search={{ range: "1Y" as const, note: undefined }} hash="daily-note">
            ← Back to the Daily Note
          </Link>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
