import { Area, AreaChart, CartesianGrid, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { useAurumPrice } from "@/lib/aurum/use-aurum-price";
import type { AurumRange, UnavailableReason } from "@/lib/aurum/price-state";
import { AURUM_USD } from "@/lib/aurum/price-format";
import { useEffect, useRef } from "react";

const PERCENT = new Intl.NumberFormat("en-US", { signDisplay: "always", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const TIME = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
const DATE = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" });
const MONTH = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "short" });
const RANGES: AurumRange[] = ["30D", "90D", "1Y", "5Y"];
const RANGE_HEADINGS: Record<AurumRange, string> = {
  "30D": "Thirty days of daily closes",
  "90D": "Ninety days of daily closes",
  "1Y": "Twelve months of daily closes",
  "5Y": "Five years of daily closes",
};

const REASON_COPY: Record<UnavailableReason, string> = {
  network: "The price service could not be reached.",
  invalid: "The latest price record did not pass validation.",
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


export function AurumPriceSection({ range, onRangeChange }: { range: AurumRange; onRangeChange: (range: AurumRange) => void }) {
  const { state, data, now, showLiveBadge, historyFor } = useAurumPrice();
  const facts = data?.facts ?? null;
  const points = historyFor(range).map((point) => ({ date: point.date.toISOString().slice(0, 10), close: point.close }));
  const latestClose = points.at(-1) ?? null;
  const ageSeconds = Math.max(0, Math.round((now.getTime() - (data?.asOf.getTime() ?? now.getTime())) / 1000));
  const rangeRowRef = useRef<HTMLDivElement>(null);
  const activeRangeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const row = rangeRowRef.current;
    const chip = activeRangeRef.current;
    if (row && chip && row.scrollWidth > row.clientWidth) {
      row.scrollLeft = chip.offsetLeft - (row.clientWidth - chip.clientWidth) / 2;
    }
  }, [range]);

  return (
    <section id="price" className="aurum-price-section" aria-labelledby="aurum-price-heading">
      <div className="aurum-price-current">
        <div className="aurum-container aurum-price-current__content">
          <p id="aurum-price-heading" className="aurum-price-eyebrow">TODAY&apos;S GOLD PRICE</p>


          {state.status === "loading" ? (
            <div className="aurum-price-unavailable" role="status" aria-busy="true">
              <p>Loading the latest price</p>
            </div>
          ) : null}

          {data ? (
            <>
              <div className="aurum-price-stamp">
                {showLiveBadge ? <span className="aurum-live-badge">LIVE</span> : null}
                {state.status === "stale" ? <span className="aurum-stale-badge">DELAYED</span> : null}
                <span>
                  As of {TIME.format(data.asOf)} UTC · {formatAge(state.status === "stale" ? state.ageSeconds : ageSeconds)} ago
                </span>
              </div>
              <data className="aurum-price-figure" value={data.spot}>{AURUM_USD.format(data.spot)}</data>
              <div className={`aurum-price-delta aurum-price-delta--${data.changePct >= 0 ? "positive" : "negative"}`}>
                <strong>{PERCENT.format(data.changePct)}%</strong>
                <span>{data.changeAmount >= 0 ? "+" : "−"}{AURUM_USD.format(Math.abs(data.changeAmount))}</span>
                <small>per troy ounce · USD</small>
              </div>
              {state.status === "stale" ? (
                <p className="aurum-price-stale-note" role="status">
                  This price is delayed. It was recorded {formatAge(state.ageSeconds)} ago and is not current.
                </p>
              ) : null}
              <div className="aurum-price-rule" />
              <dl className="aurum-price-stats">
                {([
                  ["24 HOUR HIGH", data.dayHigh],
                  ["24 HOUR LOW", data.dayLow],
                  ["PREVIOUS CLOSE", data.previousClose],
                ] as const)
                  .filter(([, value]) => typeof value === "number")
                  .map(([label, value]) => (
                     <div key={label}><dt>{label}</dt><dd>{AURUM_USD.format(Number(value))}</dd></div>
                  ))}
              </dl>
            </>
          ) : null}

          {state.status === "unavailable" ? (
            <div className="aurum-price-unavailable" role="status">
              <p>Price unavailable</p>
              <span>{REASON_COPY[state.reason]}</span>
            </div>
          ) : null}

          <p className="aurum-price-footnote">Indicative reference prices, shown for education. Not a dealer quote, not a solicitation, not investment advice.</p>
        </div>
      </div>

      {facts ? (
        <div className="aurum-price-facts">
          <div className="aurum-container">
            <p className="aurum-price-eyebrow">GOLD PRICE FACTS</p>

            <h2 className="aurum-price-title">Derived from real history, not estimates</h2>
            <div className="aurum-facts-grid">
              <Fact label="MONTH TO DATE" value={`${PERCENT.format(facts.monthToDatePct)}%`} caption={`From ${DATE.format(facts.monthToDateFrom)} close`} />
              <Fact label="YEAR TO DATE" value={`${PERCENT.format(facts.yearToDatePct)}%`} caption={`From ${DATE.format(facts.yearToDateFrom)} close`} />
               <Fact label="52 WEEK HIGH" value={AURUM_USD.format(facts.high52.price)} caption={`Recorded ${DATE.format(facts.high52.date)}`} />
               <Fact label="52 WEEK LOW" value={AURUM_USD.format(facts.low52.price)} caption={`Recorded ${DATE.format(facts.low52.date)}`} />
            </div>
            <p className="aurum-facts-footnote">Figures are historical facts calculated from stored daily prices. They are not forecasts, signals or recommendations.</p>
          </div>
        </div>
      ) : null}

      <div className="aurum-history">
        <div className="aurum-container">
          <div className="aurum-history__head">
            <div><p className="aurum-history__eyebrow">GOLD PRICE HISTORY</p><h2 className="aurum-history__title">{RANGE_HEADINGS[range]}</h2></div>
            <div ref={rangeRowRef} className="aurum-history__ranges" aria-label="History range">
              {RANGES.map((item) => <Button ref={range === item ? activeRangeRef : undefined} key={item} type="button" variant="outline" size="sm" aria-pressed={range === item} onClick={() => onRangeChange(item)}>{item}</Button>)}
            </div>
          </div>
          {latestClose ? (
            <div className="aurum-chart" aria-label={`${range} gold closing price chart`}>
              <span className="aurum-chart__axis-label">USD PER TROY OUNCE</span>
              <ResponsiveContainer width="100%" height={360}>
                <AreaChart data={points} margin={{ top: 34, right: 24, bottom: 8, left: 10 }}>
                  <defs><linearGradient id="aurum-chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--gold)" stopOpacity={0.12} /><stop offset="100%" stopColor="var(--gold)" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="date" tickFormatter={(value) => MONTH.format(new Date(`${value}T00:00:00Z`))} tick={{ fill: "var(--aurum-grey)", fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={36} />
                   <YAxis domain={["auto", "auto"]} tickFormatter={(value) => AURUM_USD.format(value).replace(".00", "")} tick={{ fill: "var(--aurum-grey)", fontSize: 11 }} axisLine={false} tickLine={false} width={74} />
                   <Tooltip formatter={(value) => [AURUM_USD.format(Number(value)), "Close"]} labelFormatter={(label) => DATE.format(new Date(`${String(label)}T00:00:00Z`))} />
                  <Area type="monotone" dataKey="close" stroke="var(--gold)" strokeWidth={2} fill="url(#aurum-chart-fill)" dot={false} activeDot={{ r: 4, fill: "var(--gold)" }} />
                  <ReferenceDot
                    x={latestClose.date}
                    y={latestClose.close}
                    r={4}
                    fill="var(--gold)"
                    stroke="var(--paper)"
                     label={{ value: AURUM_USD.format(latestClose.close), position: "top", fill: "var(--charcoal)", fontSize: 11 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="aurum-history__empty">
              {state.status === "loading" ? "Loading daily closes." : "No daily closes are available for this range."}
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
