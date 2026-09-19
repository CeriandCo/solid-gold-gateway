import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { fetchEditorialPage } from "@/lib/aurum-editorial.functions";
import type { AurumEditorial } from "@/lib/aurum-editorial";
import { AurumEditorialRow } from "@/components/aurum-editorial-row";

const PAGE_SIZE = 3;

export function AurumDailyNoteSection({
  openSlug,
  onToggle,
  initial,
}: {
  openSlug: string | null;
  onToggle: (slug: string | null) => void;
  initial: { items: AurumEditorial[]; total: number } | null;
}) {
  const loadPage = useServerFn(fetchEditorialPage);
  const [notes, setNotes] = useState<AurumEditorial[]>(initial?.items ?? []);
  const [total, setTotal] = useState(initial?.total ?? 0);
  const [loading, setLoading] = useState(false);

  // Loader data can widen (a shared ?note= link loads enough pages to include that
  // note). Merge it in rather than replacing, so an expanded list stays expanded.
  useEffect(() => {
    if (!initial) return;
    setTotal(initial.total);
    setNotes((current) => {
      const merged = [...current];
      for (const item of initial.items) {
        if (!merged.some((note) => note.slug === item.slug)) merged.push(item);
      }
      return merged.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
    });
  }, [initial]);

  const showOlder = async () => {
    setLoading(true);
    try {
      const page = await loadPage({
        data: { type: "daily_note", limit: PAGE_SIZE, offset: notes.length },
      });
      setNotes((current) => [
        ...current,
        ...page.items.filter((item) => !current.some((note) => note.slug === item.slug)),
      ]);
      setTotal(page.total);
    } catch {
      // Keep what is already on screen; the counter and button stay as they are.
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="daily-note" className="aurum-section aurum-daily-note" aria-labelledby="aurum-daily-note-title">
      <div className="aurum-container">
        <p className="aurum-note-eyebrow">DAILY NOTE</p>
        <h2 id="aurum-daily-note-title" className="aurum-note-title">
          What moved, and why
        </h2>
        <p className="aurum-note-dek">
          A short, sourced note on each trading day. Every material fact links to where it came from. No
          forecasts, no calls.
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
                Latest {notes.length} of {total} notes
              </p>
              {notes.length < total ? (
                <button type="button" className="aurum-note-more" onClick={showOlder} disabled={loading}>
                  Show older notes ↓
                </button>
              ) : null}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
