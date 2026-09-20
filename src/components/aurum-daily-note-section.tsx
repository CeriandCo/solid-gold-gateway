import { Link } from "@tanstack/react-router";
import type { AurumEditorial } from "@/lib/aurum-editorial";
import { AurumEditorialRow } from "@/components/aurum-editorial-row";
import { formatEditorialDate } from "@/lib/aurum-editorial";

function isOlderThanThirtyDays(date: string): boolean {
  const age = Date.now() - new Date(`${date}T00:00:00Z`).getTime();
  return age > 30 * 24 * 60 * 60 * 1000;
}

export function AurumDailyNoteSection({
  openSlug,
  onToggle,
  initial,
}: {
  openSlug: string | null;
  onToggle: (slug: string | null) => void;
  initial: { items: AurumEditorial[]; total: number } | null;
}) {
  const notes = initial?.items ?? [];
  const newest = notes[0];

  return (
    <section id="daily-note" className="aurum-section aurum-daily-note" aria-labelledby="aurum-daily-note-title">
      <div className="site-container">
        <p className="aurum-note-eyebrow">DAILY NOTE</p>
        <h2 id="aurum-daily-note-title" className="aurum-note-title">
          What moved, and why
        </h2>
        <p className="aurum-note-dek">
          Short, sourced notes published when there is something worth recording. Every material fact links to
          where it came from. No forecasts, no calls.
        </p>

        {initial === null ? (
          <p className="aurum-note-dek">Notes are temporarily unavailable.</p>
        ) : (
          <>
            <ul className="aurum-note-list">
              {notes.map((note, index) => (
                <AurumEditorialRow
                  key={note.slug}
                  article={note}
                  isOpen={openSlug === note.slug}
                  isLatest={index === 0}
                  panelId={`aurum-note-panel-${note.slug}`}
                  pagePath={`/aurum/notes/${note.slug}`}
                  closeLabel="Collapse ↑"
                  onToggle={() => onToggle(openSlug === note.slug ? null : note.slug)}
                />
              ))}
            </ul>

            <div className="aurum-note-footer">
              <p>
                {newest ? <>Most recent note: {formatEditorialDate(newest.publishedAt)}.{isOlderThanThirtyDays(newest.publishedAt) ? " New notes are published as they are written, not on a fixed schedule." : ""}</> : "No notes published yet."}
              </p>
              <Link className="aurum-note-more" to="/aurum/notes" search={{ page: 1 }}>Show older notes →</Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
