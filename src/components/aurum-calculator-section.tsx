import { useEffect, useRef, useState } from "react";
import { useAurumPrice } from "@/lib/aurum/use-aurum-price";
import { closeOn, type HistoryPoint } from "@/lib/aurum/price-state";
import { GoldButton } from "@/components/site-chrome";
import calculatorBg from "@/assets/aurum/aurum-calculator-bg.webp.asset.json";

const USD = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
const OZ = new Intl.NumberFormat("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
const PERCENT = new Intl.NumberFormat("en-US", { signDisplay: "always", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const DATE = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" });
const TIME = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

const DEFAULT_AMOUNT = "5000";
const PLACEHOLDER = "——";

/** ISO yyyy-mm-dd for a UTC-anchored date. */
function isoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

type LookBack = {
  amount: number;
  then: HistoryPoint;
  requested: Date;
  ounces: number;
  valueToday: number;
  changePct: number;
  spot: number;
  asOf: Date;
};

function nearestClose(history: HistoryPoint[], target: Date): HistoryPoint | null {
  let best: HistoryPoint | null = null;
  let bestGap = Number.POSITIVE_INFINITY;
  for (const point of history) {
    const gap = Math.abs(point.date.getTime() - target.getTime());
    if (gap < bestGap) {
      bestGap = gap;
      best = point;
    }
  }
  return best;
}

function periodInWords(from: Date, to: Date): string {
  let months = (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + (to.getUTCMonth() - from.getUTCMonth());
  if (to.getUTCDate() < from.getUTCDate()) months -= 1;
  if (months < 1) return "over less than a month";
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years === 1 ? "" : "s"}`);
  if (rest > 0) parts.push(`${rest} month${rest === 1 ? "" : "s"}`);
  return `over ${parts.join(" ")}`;
}

export function AurumCalculatorSection() {
  const { data, calculatorEnabled, state } = useAurumPrice();
  const [amountInput, setAmountInput] = useState(DEFAULT_AMOUNT);
  const [dateInput, setDateInput] = useState("");
  const [dateTouched, setDateTouched] = useState(false);
  const [result, setResult] = useState<LookBack | null>(null);
  const [noClose, setNoClose] = useState<string | null>(null);
  const defaultApplied = useRef(false);

  // All date boundaries come from the stored history — never a constant.
  const history = data?.history ?? [];
  const earliest = history.length > 0 ? history[0]!.date : null;
  const latest = history.length > 0 ? history[history.length - 1]!.date : null;

  // Apply the default date once, when history first becomes available. A date
  // the visitor has already typed is never overwritten.
  useEffect(() => {
    if (defaultApplied.current || dateTouched) return;
    if (history.length === 0 || !latest) return;
    const fiveYearsBefore = new Date(
      Date.UTC(latest.getUTCFullYear() - 5, latest.getUTCMonth(), latest.getUTCDate()),
    );
    const fallback = history.find((point) => point.date.getTime() >= fiveYearsBefore.getTime()) ?? history[0]!;
    defaultApplied.current = true;
    setDateInput(isoDay(fallback.date));
  }, [history, latest, dateTouched]);

  const amount = Number(amountInput);
  const requested = dateInput ? new Date(`${dateInput}T00:00:00.000Z`) : null;

  let amountError: string | null = null;
  if (amountInput.trim() === "" || !Number.isFinite(amount) || amount <= 0) {
    amountError = "Enter an amount above zero.";
  }

  let dateError: string | null = null;
  if (!requested || Number.isNaN(requested.getTime())) dateError = "Enter a valid date.";
  else if (earliest && requested.getTime() < earliest.getTime()) {
    dateError = `Choose a date from ${DATE.format(earliest)} onward.`;
  } else if (latest && requested.getTime() > latest.getTime()) {
    dateError = `Choose a date on or before ${DATE.format(latest)}.`;
  }

  const inputsValid = !amountError && !dateError;
  const canRun = calculatorEnabled && inputsValid && Boolean(data);

  const lastGood = data ? `${TIME.format(data.asOf)} UTC on ${DATE.format(data.asOf)}` : null;
  const unavailableReason =
    state.status === "loading"
      ? "Waiting for a current price."
      : state.status === "stale"
        ? "The stored price is older than the freshness limit, so no look back can be run against it."
        : state.status === "unavailable"
          ? state.reason === "network"
            ? "The price service could not be reached."
            : state.reason === "invalid"
              ? "The last price received did not pass validation."
              : "No current price is stored."
          : null;

  function run() {
    if (!data || !canRun || !requested) return;
    const exact = closeOn(data.history, requested);
    if (!exact) {
      const near = nearestClose(data.history, requested);
      setResult(null);
      setNoClose(
        near
          ? `No daily close is stored for ${DATE.format(requested)}. The nearest stored close is ${DATE.format(near.date)}.`
          : `No daily close is stored for ${DATE.format(requested)}.`,
      );
      return;
    }
    setNoClose(null);
    const ounces = Math.round((amount / exact.close) * 1000) / 1000;
    const valueToday = Math.round(ounces * data.spot * 100) / 100;
    setResult({
      amount,
      then: exact,
      requested,
      ounces,
      valueToday,
      changePct: ((valueToday - amount) / amount) * 100,
      spot: data.spot,
      asOf: data.asOf,
    });
  }

  const showResult = calculatorEnabled && result !== null;

  return (
    <section id="calculator" className="aurum-section aurum-calc" aria-labelledby="aurum-calc-title">
      <div
        className="aurum-calc__bg"
        style={{ backgroundImage: `url("${calculatorBg.url}")` }}
        aria-hidden="true"
      />
      <div className="aurum-container aurum-calc__inner">
        <p className="aurum-calc__eyebrow">LOOK BACK CALCULATOR</p>
        <h2 id="aurum-calc-title" className="aurum-calc__title">What would that have been worth?</h2>
        <p className="aurum-calc__dek">
          A historical look back using stored daily prices. It is not a purchase price, and it does not include
          product fees.
        </p>

        <div className="aurum-calc__grid">
          <form
            className="aurum-calc__panel"
            onSubmit={(event) => {
              event.preventDefault();
              run();
            }}
          >
            <div className="aurum-calc__field">
              <label htmlFor="aurum-calc-amount">AMOUNT</label>
              <div className="aurum-calc__box">
                <input
                  id="aurum-calc-amount"
                  type="number"
                  inputMode="decimal"
                  min="1"
                  step="1"
                  value={amountInput}
                  aria-invalid={amountError ? true : undefined}
                  onChange={(event) => setAmountInput(event.target.value)}
                />
                <span className="aurum-calc__suffix">USD</span>
              </div>
              <p className="aurum-calc__helper">{amountError ?? "Any amount. Nothing is charged."}</p>
            </div>

            <div className="aurum-calc__field">
              <label htmlFor="aurum-calc-date">PURCHASED ON</label>
              <div className="aurum-calc__box">
                <input
                  id="aurum-calc-date"
                  type="date"
                  min={EARLIEST}
                  value={dateInput}
                  aria-invalid={dateError ? true : undefined}
                  onChange={(event) => setDateInput(event.target.value)}
                />
              </div>
              <p className="aurum-calc__helper">{dateError ?? "Any date from 1 Jan 2000 onward."}</p>
            </div>

            <GoldButton type="submit" size="hero" disabled={!canRun} className="aurum-calc__submit">
              Show the look back
            </GoldButton>

            {noClose ? <p className="aurum-calc__notice">{noClose}</p> : null}
          </form>

          <div className="aurum-calc__result" aria-live="polite">
            {!calculatorEnabled ? (
              <>
                <p className="aurum-calc__chip">UNAVAILABLE</p>
                <p className="aurum-calc__result-title">Cannot run right now</p>
                <p className="aurum-calc__result-reason">{unavailableReason}</p>
                {lastGood ? <p className="aurum-calc__result-reason">Last good price: {lastGood}.</p> : null}
              </>
            ) : (
              <>
                <div className="aurum-calc__result-top">
                  <span className="aurum-calc__result-label">VALUE TODAY</span>
                  <span className="aurum-calc__result-stamp">
                    {showResult && result ? `as of ${TIME.format(result.asOf)} UTC` : ""}
                  </span>
                </div>
                <p className="aurum-calc__figure">
                  {showResult && result ? USD.format(result.valueToday) : PLACEHOLDER}
                </p>
                <p className="aurum-calc__delta">
                  <span className="aurum-calc__delta-pct">
                    {showResult && result ? `${PERCENT.format(result.changePct)}%` : PLACEHOLDER}
                  </span>
                  <span className="aurum-calc__delta-period">
                    {showResult && result ? periodInWords(result.then.date, result.asOf) : ""}
                  </span>
                </p>
                <hr className="aurum-calc__rule" />
                <dl className="aurum-calc__rows">
                  <div>
                    <dt>
                      Gold price on {showResult && result ? DATE.format(result.then.date) : "the purchase date"}
                    </dt>
                    <dd>{showResult && result ? USD.format(result.then.close) : PLACEHOLDER}</dd>
                  </div>
                  <div>
                    <dt>Gold price today</dt>
                    <dd>{showResult && result ? USD.format(result.spot) : PLACEHOLDER}</dd>
                  </div>
                  <div>
                    <dt>
                      Gold that {showResult && result ? USD.format(result.amount) : "that amount"} bought, in troy
                      ounces
                    </dt>
                    <dd>{showResult && result ? OZ.format(result.ounces) : PLACEHOLDER}</dd>
                  </div>
                </dl>
                <p className="aurum-calc__disclaimer">
                  Past performance is not a prediction and no outcome is guaranteed. Figures exclude any dealer
                  premium, storage fee or tax.
                </p>
              </>
            )}
          </div>
        </div>

        <div className="aurum-calc__freshness">
          <p className="aurum-calc__freshness-label">WHEN THE PRICE IS NOT FRESH</p>
          <p className="aurum-calc__freshness-text">
            The calculator is disabled and states why. It never runs on a stale price.
          </p>
        </div>
      </div>
    </section>
  );
}
