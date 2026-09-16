import weeklyBriefImage from "@/assets/aurum/aurum-weekly-brief.webp.asset.json";
import { AURUM_BRIEFS } from "@/lib/aurum-briefs";
import { formatEditorialDate } from "@/lib/aurum-editorial";
import { AurumEditorialPanel } from "@/components/aurum-editorial-content";
import { AurumEditorialRow } from "@/components/aurum-editorial-row";

export function AurumWeeklyBriefSection({
  openSlug,
  onToggle,
}: {
  openSlug: string | null;
  onToggle: (slug: string | null) => void;
}) {
  const [featured, ...older] = AURUM_BRIEFS;
  if (!featured) return null;
  const isFeaturedOpen = openSlug === featured.slug;
  const featuredPanelId = `aurum-brief-panel-${featured.slug}`;

  return (
    <section id="weekly-brief" className="aurum-section aurum-weekly-brief" aria-labelledby="aurum-weekly-brief-title">
      <div className="aurum-container">
        <p className="aurum-note-eyebrow">WEEKLY BRIEF</p>
        <h2 id="aurum-weekly-brief-title" className="aurum-note-title">A weekly brief, not a hot take</h2>
        <p className="aurum-note-dek">One longer read each Monday. What moved, what it means, and what it does not mean.</p>

        <article className={`aurum-brief-feature${isFeaturedOpen ? " is-open" : ""}`}>
          <div className="aurum-brief-feature__card">
            <img src={weeklyBriefImage.url} alt="" width={1120} height={680} loading="lazy" />
            <div className="aurum-brief-feature__copy">
              <p className="aurum-brief-feature__meta">LATEST · {formatEditorialDate(featured.publishedAt)} · {featured.readMinutes} minute read</p>
              <h3>{featured.title}</h3>
              <p className="aurum-brief-feature__summary">{featured.summary}</p>
              <p className="aurum-editorial-review">Drafted with AI assistance and reviewed by a person before publication.</p>
              <button
                type="button"
                className="aurum-brief-feature__action"
                aria-expanded={isFeaturedOpen}
                aria-controls={featuredPanelId}
                onClick={() => onToggle(isFeaturedOpen ? null : featured.slug)}
              >
                {isFeaturedOpen ? "Close the brief ↑" : "Read the brief →"}
              </button>
            </div>
          </div>
          <div id={featuredPanelId} className="aurum-brief-feature__panel" hidden={!isFeaturedOpen}>
            <AurumEditorialPanel
              article={featured}
              idPrefix={featuredPanelId}
              pagePath={`/aurum/briefs/${featured.slug}`}
              closeLabel="Close the brief ↑"
              onClose={() => onToggle(null)}
            />
          </div>
        </article>

        <ul className="aurum-note-list aurum-brief-older">
          {older.map((brief) => (
            <AurumEditorialRow
              key={brief.slug}
              article={brief}
              isOpen={openSlug === brief.slug}
              panelId={`aurum-brief-panel-${brief.slug}`}
              pagePath={`/aurum/briefs/${brief.slug}`}
              closeLabel="Close the brief ↑"
              onToggle={() => onToggle(openSlug === brief.slug ? null : brief.slug)}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}