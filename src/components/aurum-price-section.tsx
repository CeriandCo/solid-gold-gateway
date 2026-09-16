import { Area, AreaChart, CartesianGrid, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { useAurumPrice } from "@/lib/aurum/use-aurum-price";
import type { AurumRange, UnavailableReason } from "@/lib/aurum/price-state";

const USD = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
const PERCENT = new Intl.NumberFormat("en-US", { signDisplay: "always", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const TIME = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
const DATE = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" });
const MONTH = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "short" });
const RANGES: AurumRange[] = ["30D", "90D", "1Y", "5Y"];

const REASON_COPY: Record<UnavailableReason, string> = {
  network: "The price service could not be reached.",
  invalid: "The latest price record did not pass validation.",
  "no-threshold": "No freshness limit is configured, so no price can be shown as current.",
  "no-data": "No price has been recorded yet.",
};

function formatAge(seconds: number) {
  if (seconds < 90) return `${Math.max(1, Math.round(seconds))} seconds`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 90) return `${minutes} minutes`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours} hours`;
  return `${Math.round(hours / 24)} days`;
}

function formatDate(value: string) {
  return DATE.format(new Date(`${value}T00:00:00Z`));
}

export function AurumSampleChip() {
  return <span className="aurum-sample-chip">SAMPLE DATA — NOT A REAL PRICE</span>;
}

export function AurumPriceSection({ range, onRangeChange }: { range: AurumRange; onRangeChange: (range: AurumRange) => void }) {
  const { state, derived, facts, history, isDemo } = useAurumPrice();
  const priced = state.status === "live" || state.status === "stale" ? state : null;
  const latestClose = history.status === "ready" ? history.points.at(-1) ?? null : null;

  return (
    <section id="price" className="aurum-price-section" aria-labelledby="aurum-price-heading">
      <div className="aurum-price-current">
        <div className="aurum-container aurum-price-current__content">
          <p id="aurum-price-heading" className="aurum-price-eyebrow">TODAY&apos;S GOLD PRICE</p>
          {isDemo ? <AurumSampleChip /> : null}

          {state.status === "loading" ? (
            <div className="aurum-price-unavailable" role="status" aria-busy="true">
              <p>Loading the latest price</p>
            </div>
          ) : null}

          {priced ? (
            <>
              <div className="aurum-price-stamp">
                {state.status === "live" && !isDemo ? <span className="aurum-live-badge">LIVE</span> : null}
                {state.status === "stale" ? <span className="aurum-stale-badge">STALE PRICE</span> : null}
                <span>
                  As of {TIME.format(priced.fetchedAt)} UTC · {DATE.format(priced.fetchedAt)}
                </span>
              </div>
              <data className="aurum-price-figure" value={priced.spot}>{USD.format(priced.spot)}</data>
              <div className="aurum-price-delta">
                <strong>{PERCENT.format(priced.changePct)}%</strong>
                {derived ? <span>{derived.changeAmount >= 0 ? "+" : "−"}{USD.format(Math.abs(derived.changeAmount))}</span> : null}
                <small>per troy ounce · USD</small>
              </div>
              {state.status === "stale" ? (
                <p className="aurum-price-stale-note" role="status">
                  This price is {formatAge(priced.ageSeconds)} old and is not current.
                </p>
              ) : null}
              <div className="aurum-price-rule" />
              {derived ? (
                <dl className="aurum-price-stats">
                  {[
                    ["24 HOUR HIGH", derived.high24h],
                    ["24 HOUR LOW", derived.low24h],
                    ["PREVIOUS CLOSE", derived.previousClose],
                  ].map(([label, value]) => (
                    <div key={String(label)}><dt>{label}</dt><dd>{USD.format(Number(value))}</dd></div>
                  ))}
                </dl>
              ) : null}
            </>
          ) : null}

          {state.status === "unavailable" ? (
            <div className="aurum-price-unavailable" role="status">
              <p>Price unavailable</p>
              <span>{REASON_COPY[state.reason]}</span>
              {state.lastGoodAt ? (
                <span>Last good price time: {DATE.format(state.lastGoodAt)}, {TIME.format(state.lastGoodAt)} UTC</span>
              ) : null}
            </div>
          ) : null}

          <p className="aurum-price-footnote">Indicative reference prices, shown for education. Not a dealer quote, not a solicitation, not investment advice.</p>
        </div>
      </div>

      {facts ? (
        <div className="aurum-price-facts">
          <div className="aurum-container">
            <p className="aurum-price-eyebrow">GOLD PRICE FACTS</p>
            {isDemo ? <AurumSampleChip /> : null}
            <h2 className="aurum-price-title">Derived from real history, not estimates</h2>
            <div className="aurum-facts-grid">
              <Fact label="MONTH TO DATE" value={`${PERCENT.format(facts.monthToDate.value)}%`} caption={`From ${formatDate(facts.monthToDate.referenceDate)} close`} />
              <Fact label="YEAR TO DATE" value={`${PERCENT.format(facts.yearToDate.value)}%`} caption={`From ${formatDate(facts.yearToDate.referenceDate)} close`} />
              <Fact label="52 WEEK HIGH" value={USD.format(facts.high52Week.value)} caption={`Recorded ${formatDate(facts.high52Week.date)}`} />
              <Fact label="52 WEEK LOW" value={USD.format(facts.low52Week.value)} caption={`Recorded ${formatDate(facts.low52Week.date)}`} />
            </div>
            <p className="aurum-facts-footnote">Figures are historical facts calculated from stored daily prices. They are not forecasts, signals or recommendations.</p>
          </div>
        </div>
      ) : null}

      <div className="aurum-history">
        <div className="aurum-container">
          <div className="aurum-history__head">
            <div><p className="aurum-history__eyebrow">GOLD PRICE HISTORY</p><h2 className="aurum-history__title">Twelve months of daily closes</h2></div>
            <div className="aurum-history__ranges" aria-label="History range">
              {RANGES.map((item) => <Button key={item} type="button" variant="outline" size="sm" aria-pressed={range === item} onClick={() => onRangeChange(item)}>{item}</Button>)}
            </div>
          </div>
          {history.status === "ready" && history.outOfDate ? (
            <p className="aurum-history__stale" role="status">
              This chart is out of date. The most recent stored close is {formatDate(history.newestDate)}, so it does not show current prices.
            </p>
          ) : null}
          {history.status === "ready" && latestClose ? (
            <div className="aurum-chart" aria-label={`${range} gold closing price chart`}>
              <span className="aurum-chart__axis-label">USD PER TROY OUNCE</span>
              <ResponsiveContainer width="100%" height={360}>
                <AreaChart data={history.points} margin={{ top: 34, right: 24, bottom: 8, left: 10 }}>
                  <defs><linearGradient id="aurum-chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--gold)" stopOpacity={0.12} /><stop offset="100%" stopColor="var(--gold)" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="date" tickFormatter={(value) => MONTH.format(new Date(`${value}T00:00:00Z`))} tick={{ fill: "var(--aurum-grey)", fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={36} />
                  <YAxis domain={["auto", "auto"]} tickFormatter={(value) => USD.format(value).replace(".00", "")} tick={{ fill: "var(--aurum-grey)", fontSize: 11 }} axisLine={false} tickLine={false} width={74} />
                  <Tooltip formatter={(value) => [USD.format(Number(value)), "Close"]} labelFormatter={(label) => formatDate(String(label))} />
                  <Area type="monotone" dataKey="close" stroke="var(--gold)" strokeWidth={2} fill="url(#aurum-chart-fill)" dot={false} activeDot={{ r: 4, fill: "var(--gold)" }} />
                  <ReferenceDot
                    x={latestClose.date}
                    y={latestClose.close}
                    r={4}
                    fill="var(--gold)"
                    stroke="var(--paper)"
                    label={{ value: USD.format(latestClose.close), position: "top", fill: "var(--charcoal)", fontSize: 11 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="aurum-history__empty">
              {history.status === "loading" ? "Loading daily closes." : "No stored daily closes are available for this range."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function Fact({ label, value, caption }: { label: string; value: string; caption: string }) {
  return <article className="aurum-fact"><p>{label}</p><strong>{value}</strong><span>{caption}</span></article>;
}
