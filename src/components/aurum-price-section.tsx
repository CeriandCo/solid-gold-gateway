import { Area, AreaChart, CartesianGrid, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AurumPriceResponse, AurumRange } from "@/lib/aurum-price.functions";
import { Button } from "@/components/ui/button";

const USD = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
const PERCENT = new Intl.NumberFormat("en-US", { signDisplay: "always", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const TIME = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
const DATE = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" });
const MONTH = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "short" });
const RANGES: AurumRange[] = ["30D", "90D", "1Y", "5Y"];

function formatDate(value: string) {
  return DATE.format(new Date(`${value}T00:00:00Z`));
}

export function AurumPriceSection({ data, range, onRangeChange }: { data: AurumPriceResponse; range: AurumRange; onRangeChange: (range: AurumRange) => void }) {
  const live = data.priceState.status === "live" ? data.priceState : null;
  const unavailable = data.priceState.status === "unavailable" ? data.priceState : null;
  const latestClose = data.series.at(-1) ?? null;
  const secondsAgo = live ? Math.max(0, Math.floor((Date.parse(data.checkedAt) - Date.parse(live.observedAt)) / 1000)) : null;

  return (
    <section id="price" className="aurum-price-section" aria-labelledby="aurum-price-heading">
      <div className="aurum-price-current">
        <div className="aurum-container aurum-price-current__content">
          <p id="aurum-price-heading" className="aurum-price-eyebrow">TODAY&apos;S GOLD PRICE</p>
          {live ? (
            <>
              <div className="aurum-price-stamp">
                <span className="aurum-live-badge">LIVE</span>
                <span>As of {TIME.format(new Date(live.observedAt))} UTC · {secondsAgo} seconds ago</span>
              </div>
              <data className="aurum-price-figure" value={live.price}>{USD.format(live.price)}</data>
              <div className="aurum-price-delta">
                <strong>{PERCENT.format(live.changePercent)}%</strong>
                <span>{live.changeAmount >= 0 ? "+" : "−"}{USD.format(Math.abs(live.changeAmount))}</span>
                <small>per troy ounce · USD</small>
              </div>
              <div className="aurum-price-rule" />
              <dl className="aurum-price-stats">
                {[
                  ["24 HOUR HIGH", live.high24h],
                  ["24 HOUR LOW", live.low24h],
                  ["PREVIOUS CLOSE", live.previousClose],
                ].map(([label, value]) => (
                  <div key={String(label)}><dt>{label}</dt><dd>{USD.format(Number(value))}</dd></div>
                ))}
              </dl>
            </>
          ) : (
            <div className="aurum-price-unavailable" role="status">
              <p>Price unavailable</p>
              <span>{unavailable?.reason}</span>
              {unavailable?.lastGoodAt ? <span>Last good price time: {DATE.format(new Date(unavailable.lastGoodAt))}, {TIME.format(new Date(unavailable.lastGoodAt))} UTC</span> : null}
            </div>
          )}
          <p className="aurum-price-footnote">Indicative reference prices, shown for education. Not a dealer quote, not a solicitation, not investment advice.</p>
        </div>
      </div>

      <div className="aurum-price-facts">
        <div className="aurum-container">
          <p className="aurum-price-eyebrow">GOLD PRICE FACTS</p>
          <h2 className="aurum-price-title">Derived from real history, not estimates</h2>
          <div className="aurum-facts-grid">
            <Fact label="MONTH TO DATE" value={data.facts.monthToDate ? `${PERCENT.format(data.facts.monthToDate.value)}%` : null} caption={data.facts.monthToDate ? `From ${formatDate(data.facts.monthToDate.referenceDate)} close` : null} />
            <Fact label="YEAR TO DATE" value={data.facts.yearToDate ? `${PERCENT.format(data.facts.yearToDate.value)}%` : null} caption={data.facts.yearToDate ? `From ${formatDate(data.facts.yearToDate.referenceDate)} close` : null} />
            <Fact label="52 WEEK HIGH" value={data.facts.high52Week ? USD.format(data.facts.high52Week.value) : null} caption={data.facts.high52Week ? `Recorded ${formatDate(data.facts.high52Week.date)}` : null} />
            <Fact label="52 WEEK LOW" value={data.facts.low52Week ? USD.format(data.facts.low52Week.value) : null} caption={data.facts.low52Week ? `Recorded ${formatDate(data.facts.low52Week.date)}` : null} />
          </div>
          <p className="aurum-facts-footnote">Figures are historical facts calculated from stored daily prices. They are not forecasts, signals or recommendations.</p>
        </div>
      </div>

      <div className="aurum-history">
        <div className="aurum-container">
          <div className="aurum-history__head">
            <div><p className="aurum-history__eyebrow">GOLD PRICE HISTORY</p><h2 className="aurum-history__title">Twelve months of daily closes</h2></div>
            <div className="aurum-history__ranges" aria-label="History range">
              {RANGES.map((item) => <Button key={item} type="button" variant="outline" size="sm" aria-pressed={range === item} onClick={() => onRangeChange(item)}>{item}</Button>)}
            </div>
          </div>
          {latestClose ? (
            <div className="aurum-chart" aria-label={`${range} gold closing price chart`}>
              <span className="aurum-chart__axis-label">USD PER TROY OUNCE</span>
              <ResponsiveContainer width="100%" height={360}>
                <AreaChart data={data.series} margin={{ top: 34, right: 24, bottom: 8, left: 10 }}>
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
          ) : <p className="aurum-history__empty">No stored daily closes are available for this range.</p>}
        </div>
      </div>
    </section>
  );
}

function Fact({ label, value, caption }: { label: string; value: string | null; caption: string | null }) {
  return <article className="aurum-fact"><p>{label}</p><strong>{value ?? "Not available"}</strong><span>{caption ?? "Stored history is incomplete."}</span></article>;
}