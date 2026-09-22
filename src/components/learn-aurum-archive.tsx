import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { AurumArchiveRow } from "@/lib/aurum-editorial";
import { formatEditorialDate } from "@/lib/aurum-editorial";

export const PAGE_SIZE = 12;

export type Filter = "all" | "daily_note" | "weekly_brief";

/** Rows shown for a filter. Pure so the archive behaviour is testable without a DOM. */
export function filterArchiveRows(rows: AurumArchiveRow[], filter: Filter): AurumArchiveRow[] {
  return filter === "all" ? rows : rows.filter((row) => row.type === filter);
}

/** The existing public detail route pattern for a row's type. */
export function archiveRoutePattern(type: AurumArchiveRow["type"]): string {
  return type === "daily_note" ? "/aurum/notes/$slug" : "/aurum/briefs/$slug";
}

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "All" },
  { id: "daily_note", label: "Daily Note" },
  { id: "weekly_brief", label: "Weekly Brief" },
];

export function LearnAurumArchive({ rows }: { rows: AurumArchiveRow[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(
    () => (filter === "all" ? rows : rows.filter((row) => row.type === filter)),
    [rows, filter],
  );
  const shown = filtered.slice(0, visible);

  return (
    <section id="aurum-archive" className="kc-section kc-archive" aria-labelledby="kc-archive-title">
      <div className="kc-container">
        <p className="kc-label">AURUM ARCHIVE</p>
        <h2 id="kc-archive-title" className="kc-section-title">
          Every published note and brief
        </h2>
        <p className="kc-archive__dek">
          Short, sourced notes on what moved in the gold market, and the longer weekly reads.
          Newest first.
        </p>

        <div className="kc-archive__controls">
          <div className="kc-archive__filters" role="group" aria-label="Filter archive by type">
            {FILTERS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`kc-archive__filter${filter === option.id ? " is-active" : ""}`}
                aria-pressed={filter === option.id}
                onClick={() => {
                  setFilter(option.id);
                  setVisible(PAGE_SIZE);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="kc-archive__count" aria-live="polite">
            Showing {shown.length} of {filtered.length}
          </p>
        </div>

        {filtered.length === 0 ? (
          <p className="kc-archive__empty">No published posts of this type yet.</p>
        ) : (
          <ul className="kc-archive__list">
            {shown.map((row) => (
              <li key={`${row.type}-${row.slug}`} className="kc-archive__row">
                <Link
                  to={row.type === "daily_note" ? "/aurum/notes/$slug" : "/aurum/briefs/$slug"}
                  params={{ slug: row.slug }}
                  className="kc-archive__link"
                >
                  <span className="kc-archive__meta">
                    <span className="kc-archive__badge">
                      {row.type === "daily_note" ? "DAILY NOTE" : "WEEKLY BRIEF"}
                    </span>
                    <span className="kc-archive__date">{formatEditorialDate(row.publishedAt)}</span>
                  </span>
                  <span className="kc-archive__body">
                    <span className="kc-archive__title">{row.title}</span>
                    {row.summary ? (
                      <span className="kc-archive__summary">{row.summary}</span>
                    ) : null}
                  </span>
                  <span className="kc-archive__action" aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {visible < filtered.length ? (
          <button
            type="button"
            className="kc-archive__more"
            onClick={() => setVisible((current) => current + PAGE_SIZE)}
          >
            Load more
          </button>
        ) : null}
      </div>
    </section>
  );
}
