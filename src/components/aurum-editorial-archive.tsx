import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { AurumEditorial } from "@/lib/aurum-editorial";
import { MONTH_ABBR } from "@/lib/aurum-editorial";
import { AurumEditorialRow } from "@/components/aurum-editorial-row";

export type AurumArchiveKind = "notes" | "briefs";

export function AurumEditorialArchive({
  kind,
  items,
  total,
  page,
}: {
  kind: AurumArchiveKind;
  items: AurumEditorial[];
  total: number;
  page: number;
}) {
  const [query, setQuery] = useState("");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return items;
    return items.filter((item) => `${item.title} ${item.summary}`.toLocaleLowerCase().includes(needle));
  }, [items, query]);
  const groups = useMemo(() => {
    const grouped = new Map<string, AurumEditorial[]>();
    for (const item of filtered) {
      const [year, month] = item.publishedAt.split("-");
      const label = `${MONTH_ABBR[Number(month) - 1]} ${year}`;
      grouped.set(label, [...(grouped.get(label) ?? []), item]);
    }
    return [...grouped.entries()];
  }, [filtered]);
  const noun = kind === "notes" ? "notes" : "briefs";
  const start = total === 0 ? 0 : (page - 1) * 20 + 1;
  const end = Math.min(page * 20, total);
  const pages = Math.max(1, Math.ceil(total / 20));
  const sectionHash = kind === "notes" ? "daily-note" : "weekly-brief";

  return (
    <main className="aurum-archive">
      <div className="site-container">
        <a className="aurum-archive__back" href={`/aurum#${sectionHash}`}>← Back to AURUM</a>
        <p className="aurum-note-eyebrow">AURUM</p>
        <h1 className="aurum-archive__title">{kind === "notes" ? "Daily Note archive" : "Weekly Brief archive"}</h1>
        <p className="aurum-archive__dek">{kind === "notes" ? "Short, sourced notes published when there is something worth recording." : "Longer reads on what moved in gold, what it means, and what it does not mean."}</p>
        <label className="aurum-archive__search-label" htmlFor={`${kind}-archive-search`}>Search {noun}</label>
        <input id={`${kind}-archive-search`} className="aurum-archive__search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${noun} by title or summary`} />
        <p className="aurum-archive__count">Showing {start}-{end} of {total} {noun}</p>
        {groups.length > 0 ? groups.map(([month, monthItems]) => (
          <section className="aurum-archive__month" key={month} aria-labelledby={`${kind}-${month.replace(" ", "-")}`}>
            <h2 id={`${kind}-${month.replace(" ", "-")}`}>{month}</h2>
            <ul className="aurum-note-list">
              {monthItems.map((item) => (
                <AurumEditorialRow key={item.slug} article={item} isOpen={openSlug === item.slug} panelId={`archive-${kind}-${item.slug}`} pagePath={`/aurum/${kind}/${item.slug}`} closeLabel="Collapse ↑" onToggle={() => setOpenSlug(openSlug === item.slug ? null : item.slug)} />
              ))}
            </ul>
          </section>
        )) : <p className="aurum-archive__empty">No {noun} match your search.</p>}
        {pages > 1 ? <nav className="aurum-archive__pagination" aria-label={`${noun} pages`}>
          {page > 1 ? <Link to={kind === "notes" ? "/aurum/notes" : "/aurum/briefs"} search={{ page: page - 1 }}>← Previous</Link> : <span />}
          <span>Page {page} of {pages}</span>
          {page < pages ? <Link to={kind === "notes" ? "/aurum/notes" : "/aurum/briefs"} search={{ page: page + 1 }}>Next →</Link> : <span />}
        </nav> : null}
      </div>
    </main>
  );
}
