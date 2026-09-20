import { formatEditorialDate, type AurumEditorial } from "@/lib/aurum-editorial";
import { AurumEditorialPanel } from "@/components/aurum-editorial-content";
import { useNearestPanelScroll } from "@/lib/aurum/use-nearest-panel-scroll";

export function AurumEditorialRow({
  article,
  isOpen,
  isLatest = false,
  panelId,
  pagePath,
  closeLabel,
  onToggle,
}: {
  article: AurumEditorial;
  isOpen: boolean;
  isLatest?: boolean;
  panelId: string;
  pagePath: string;
  closeLabel: string;
  onToggle: () => void;
}) {
  const panelRef = useNearestPanelScroll<HTMLDivElement>(isOpen);

  return (
    <li className={`aurum-note-row${isOpen ? " is-open" : ""}`}>
      <button type="button" className="aurum-note-trigger" aria-expanded={isOpen} aria-controls={panelId} onClick={onToggle}>
        <span className="aurum-note-meta">
          {isLatest ? <span className="aurum-note-chip">LATEST</span> : null}
          <span className="aurum-note-date">{formatEditorialDate(article.publishedAt)}</span>
          <span className="aurum-note-read">{article.readMinutes} min read</span>
        </span>
        <span className="aurum-note-content">
          <span className="aurum-note-headline">{article.title}</span>
          <span className="aurum-note-summary">{article.summary}</span>
          {article.sources.length > 0 ? <span className="aurum-note-count">{article.sources.length} {article.sources.length === 1 ? "SOURCE" : "SOURCES"}</span> : null}
        </span>
        <span className="aurum-note-open" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            {isOpen ? <path d="M5 15l7-7 7 7" /> : <path d="M5 12h13M13 6l6 6-6 6" />}
          </svg>
        </span>
      </button>
      <div ref={panelRef} id={panelId} className="aurum-note-panel" hidden={!isOpen}>
        <AurumEditorialPanel article={article} idPrefix={panelId} pagePath={pagePath} closeLabel={closeLabel} onClose={onToggle} />
      </div>
    </li>
  );
}