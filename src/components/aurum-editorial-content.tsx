import type { AurumEditorial } from "@/lib/aurum-editorial";

export function AurumEditorialBody({ article }: { article: AurumEditorial }) {
  return (
    <div className="aurum-note-body">
      {article.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
    </div>
  );
}

export function AurumEditorialQuote({ article }: { article: AurumEditorial }) {
  if (!article.pullQuote) return null;
  return <blockquote className="aurum-note-quote">{article.pullQuote}</blockquote>;
}

export function AurumEditorialSources({ article, idPrefix }: { article: AurumEditorial; idPrefix: string }) {
  return (
    <div className="aurum-note-sources">
      <p className="aurum-note-sources__label" id={`${idPrefix}-sources`}>SOURCES</p>
      <ol aria-labelledby={`${idPrefix}-sources`}>
        {article.sources.map((source, index) => (
          <li key={`${index}-${source.url}`}>

            <a href={source.url} target="_blank" rel="noopener noreferrer">
              {source.publisher} — {source.title}, {source.date}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function AurumEditorialPanel({
  article,
  idPrefix,
  pagePath,
  closeLabel,
  onClose,
}: {
  article: AurumEditorial;
  idPrefix: string;
  pagePath: string;
  closeLabel: string;
  onClose: () => void;
}) {
  return (
    <div className="aurum-note-panel__inner">
      <div className="aurum-note-panel__main">
        <AurumEditorialBody article={article} />
        <AurumEditorialQuote article={article} />
        <AurumEditorialSources article={article} idPrefix={idPrefix} />
        {article.reviewLine ? <p className="aurum-editorial-review aurum-editorial-review--closing">{article.reviewLine}</p> : null}
      </div>
      <aside className="aurum-note-panel__aside">
        <p className="aurum-note-aside__label">OPEN AS A PAGE</p>
        <a className="aurum-note-aside__link" href={pagePath}>{pagePath}</a>
        <button type="button" className="aurum-note-collapse" onClick={onClose}>{closeLabel}</button>
      </aside>
    </div>
  );
}