import { useState } from "react";
import { AURUM_NOTES, AURUM_NOTE_COUNT } from "@/lib/aurum-notes";
import { AurumEditorialRow } from "@/components/aurum-editorial-row";

const PAGE_SIZE = 3;

export function AurumDailyNoteSection({
  openSlug,
  onToggle,
}: {
  openSlug: string | null;
  onToggle: (slug: string | null) => void;
}) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const notes = AURUM_NOTES.slice(0, visible);

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
            Latest {notes.length} of {AURUM_NOTE_COUNT} notes
          </p>
          {visible < AURUM_NOTE_COUNT ? (
            <button type="button" className="aurum-note-more" onClick={() => setVisible((n) => n + PAGE_SIZE)}>
              Show older notes ↓
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
