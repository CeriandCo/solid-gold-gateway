import type { AurumNote } from "@/lib/aurum-notes";

export function AurumNoteBody({ note }: { note: AurumNote }) {
  return (
    <div className="aurum-note-body">
      {note.body.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}

export function AurumNoteQuote({ note }: { note: AurumNote }) {
  if (!note.pullQuote) return null;
  return <blockquote className="aurum-note-quote">{note.pullQuote}</blockquote>;
}

export function AurumNoteSources({ note, idPrefix }: { note: AurumNote; idPrefix: string }) {
  return (
    <div className="aurum-note-sources">
      <p className="aurum-note-sources__label" id={`${idPrefix}-sources`}>
        SOURCES
      </p>
      <ol aria-labelledby={`${idPrefix}-sources`}>
        {note.sources.map((source) => (
          <li key={source.url + source.title}>
            <a href={source.url} target="_blank" rel="noopener noreferrer">
              {source.publisher} — {source.title}, {source.date}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
