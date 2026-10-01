import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useAurumPrice } from "@/lib/aurum/use-aurum-price";
import { AURUM_PERCENT, AURUM_USD, AURUM_UTC_TIME, formatPriceAge } from "@/lib/aurum/price-format";

const NBSP = "\u00a0";

/** Hero floating card. Reads the same price state as #gold-price, so the two can never disagree. */
export function HomeHeroSpotCard() {
  const { state, data, showSampleChip } = useAurumPrice();
  const change = data && data.changePct !== null ? data.changePct : null;
  const up = change !== null && change >= 0;

  return (
    <aside className="home-hero-spot-card" aria-label="Gold spot price" aria-busy={state.status === "loading" || undefined}>
      <p>GOLD SPOT · PER OZ</p>
      <div>
        {data ? (
          <>
            <strong>{AURUM_USD.format(data.spot)}</strong>
            {change !== null ? (
              <span>
                <span aria-hidden="true">{up ? "▲" : "▼"} </span>
                <span className="sr-only">{up ? "Up" : "Down"} </span>
                {AURUM_PERCENT.format(Math.abs(change)).replace(/^[+-]/, "")}%
              </span>
            ) : null}
          </>
        ) : state.status === "loading" ? (
          <strong className="invisible">{NBSP}</strong>
        ) : (
          <strong className="text-base">Price unavailable right now</strong>
        )}
      </div>
      {showSampleChip ? <small>Sample data — not a real price</small> : null}
    </aside>
  );
}

/** #gold-price section body. Never renders a number that is not backed by the shared price state. */
export function HomeGoldPrice() {
  const { state, data, now, showSampleChip } = useAurumPrice();
  const loading = state.status === "loading";
  const hasChange = data !== null && data.changePct !== null && data.changeAmount !== null;
  const ageSeconds = data ? Math.max(0, Math.round((now.getTime() - data.asOf.getTime()) / 1000)) : 0;
  const stats = data
    ? ([
        ["24-hour high", data.dayHigh],
        ["24-hour low", data.dayLow],
        ["Previous close", data.previousClose],
      ] as const).filter(([, value]) => typeof value === "number")
    : [];

  return (
    <div className="home-price-copy" aria-busy={loading || undefined}>
      <div className="home-price-labels">
        <p className="home-price-eyebrow">TODAY&rsquo;S GOLD PRICE</p>
        {showSampleChip ? <span className="home-price-chip">Sample data — not a real price</span> : null}
      </div>

      {data ? (
        <>
          <p className="home-price-value">{AURUM_USD.format(data.spot)}</p>
          <div className="home-price-change">
            {hasChange && data.changePct !== null && data.changeAmount !== null ? (
              <>
                <span className="home-price-delta">
                  <span aria-hidden="true">{data.changePct >= 0 ? "▲" : "▼"}</span> {AURUM_PERCENT.format(data.changePct)}%
                </span>
                <span className="home-price-delta">
                  {data.changeAmount >= 0 ? "+" : "−"}
                  {AURUM_USD.format(Math.abs(data.changeAmount))}
                </span>
              </>
            ) : null}
            <span className="home-price-meta">
              per troy ounce · USD · As of {AURUM_UTC_TIME.format(data.asOf)} UTC · {formatPriceAge(state.status === "stale" ? state.ageSeconds : ageSeconds)} ago
            </span>
          </div>
          {state.status === "stale" ? (
            <p className="home-price-meta" role="status">
              This price is delayed. It was recorded {formatPriceAge(state.ageSeconds)} ago and is not current.
            </p>
          ) : null}
          {stats.length > 0 ? (
            <dl className="home-price-stats">
              {stats.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{AURUM_USD.format(Number(value))}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </>
      ) : loading ? (
        <div role="status" aria-label="Loading the latest price">
          <p className="home-price-value invisible">{NBSP}</p>
          <div className="home-price-change invisible">
            <span className="home-price-meta">{NBSP}</span>
          </div>
          <dl className="home-price-stats invisible">
            {["a", "b", "c"].map((key) => (
              <div key={key}>
                <dt>{NBSP}</dt>
                <dd>{NBSP}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : (
        <p className="home-price-meta" role="status">
          The gold price is unavailable right now. Please check back shortly.
        </p>
      )}

      <div className="home-price-links">
        <Link to="/aurum" search={{ range: "1Y", brief: undefined, priceState: undefined }} className="home-price-link">
          Read what moved it in AURUM
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
        <p className="home-price-disclaimer">Figures are indicative. Not an offer to buy or sell.</p>
      </div>
    </div>
  );
}
