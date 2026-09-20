import {
  AurumEditorialBody,
  AurumEditorialQuote,
  AurumEditorialSources,
} from "@/components/aurum-editorial-content";
import { formatEditorialDate, type AurumEditorial } from "@/lib/aurum-editorial";
import { formatNoteDate } from "@/lib/aurum-notes";

/**
 * The same markup the public detail pages render, fed from unsaved form state.
 * Nothing here reads or writes the database.
 */
export function AurumEditorialPreview({
  article,
  type,
}: {
  article: AurumEditorial;
  type: "daily_note" | "weekly_brief";
}) {
  const isBrief = type === "weekly_brief";
  return (
    <div className="aurum-page">
      <main className={isBrief ? "aurum-note-page aurum-brief-page" : "aurum-note-page"}>
        <article className="site-container">
          <p className="aurum-note-eyebrow">{isBrief ? "WEEKLY BRIEF" : "DAILY NOTE"}</p>
          <h1 className="aurum-note-page__title">{article.title}</h1>
          <p className="aurum-note-page__meta">
            {isBrief ? formatEditorialDate(article.publishedAt) : formatNoteDate(article.publishedAt)}
            {" · "}
            {article.readMinutes} min read
          </p>
          <p className="aurum-note-page__summary">{article.summary}</p>
          <AurumEditorialBody article={article} />
          <AurumEditorialQuote article={article} />
          <AurumEditorialSources article={article} idPrefix="preview" />
          {article.reviewLine ? (
            <p className="aurum-editorial-review aurum-editorial-review--closing">
              {article.reviewLine}
            </p>
          ) : null}
        </article>
      </main>
    </div>
  );
}
