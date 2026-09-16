import { useCallback, useEffect, useState } from "react";
import { AURUM_NOTES, AURUM_NOTE_COUNT, formatNoteDate, type AurumNote } from "@/lib/aurum-notes";
import { AurumNoteBody, AurumNoteQuote, AurumNoteSources } from "@/components/aurum-note-content";

const PAGE_SIZE = 3;

export function AurumDailyNoteSection() {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  useEffect(() => {
    const onPopState = () => {
      const match = /^\/aurum\/notes\/([^/]+)$/.exec(window.location.pathname);
      setOpenSlug(match?.[1] ?? null);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const toggle = useCallback((note: AurumNote) => {
    setOpenSlug((current) => {
      const next = current === note.slug ? null : note.slug;
      if (typeof window !== "undefined") {
        window.history.pushState(null, "", next ? `/aurum/notes/${note.slug}` : "/aurum#daily-note");
      }
      return next;
    });
  }, []);

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
          {notes.map((note, index) => {
            const isOpen = openSlug === note.slug;
            const panelId = `aurum-note-panel-${note.slug}`;
            return (
              <li key={note.slug} className={`aurum-note-row${isOpen ? " is-open" : ""}`}>
                <button
                  type="button"
                  className="aurum-note-trigger"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(note)}
                >
                  <span className="aurum-note-meta">
                    {index === 0 && visible >= PAGE_SIZE ? <span className="aurum-note-chip">LATEST</span> : null}
                    <span className="aurum-note-date">{formatNoteDate(note.publishedAt)}</span>
                    <span className="aurum-note-read">{note.readMinutes} min read</span>
                  </span>
                  <span className="aurum-note-content">
                    <span className="aurum-note-headline">{note.title}</span>
                    <span className="aurum-note-summary">{note.summary}</span>
                    <span className="aurum-note-count">
                      {note.sources.length} {note.sources.length === 1 ? "SOURCE" : "SOURCES"}
                    </span>
                  </span>
                  <span className="aurum-note-open" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      {isOpen ? <path d="M5 15l7-7 7 7" /> : <path d="M5 12h13M13 6l6 6-6 6" />}
                    </svg>
                  </span>
                </button>

                <div id={panelId} className="aurum-note-panel" hidden={!isOpen}>
                  <div className="aurum-note-panel__inner">
                    <div className="aurum-note-panel__main">
                      <AurumNoteBody note={note} />
                      <AurumNoteQuote note={note} />
                      <AurumNoteSources note={note} idPrefix={panelId} />
                    </div>
                    <aside className="aurum-note-panel__aside">
                      <p className="aurum-note-aside__label">OPEN AS A PAGE</p>
                      <a className="aurum-note-aside__link" href={`/aurum/notes/${note.slug}`}>
                        /aurum/notes/{note.slug}
                      </a>
                      <button type="button" className="aurum-note-collapse" onClick={() => toggle(note)}>
                        Collapse ↑
                      </button>
                    </aside>
                  </div>
                </div>
              </li>
            );
          })}
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
