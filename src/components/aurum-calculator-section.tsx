import { useState } from "react";
import { useAurumPrice } from "@/lib/aurum/use-aurum-price";
import { closeOn } from "@/lib/aurum/price-state";
import { AurumSampleChip } from "@/components/aurum-price-section";

const USD = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
const OZ = new Intl.NumberFormat("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
const PERCENT = new Intl.NumberFormat("en-US", { signDisplay: "always", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const DATE = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" });

const DEFAULT_AMOUNT = "5000";
const DEFAULT_DATE = "2021-04-14";

export function AurumCalculatorSection() {
  const { data, calculatorEnabled, showSampleChip, state } = useAurumPrice();
  const [amountInput, setAmountInput] = useState(DEFAULT_AMOUNT);
  const [dateInput, setDateInput] = useState(DEFAULT_DATE);

  const amount = Number(amountInput);
  const thenPoint = data ? closeOn(data.history, new Date(`${dateInput}T00:00:00.000Z`)) : null;
  const ounces = data && thenPoint && Number.isFinite(amount) && amount > 0
    ? Math.round((amount / thenPoint.close) * 1000) / 1000
    : null;
  const valueToday = data && ounces !== null ? Math.round(ounces * data.spot * 100) / 100 : null;
  const changePct = valueToday !== null && Number.isFinite(amount) && amount > 0
    ? ((valueToday - amount) / amount) * 100
    : null;

  return (
    <section id="calculator" className="aurum-section aurum-section--ivory aurum-calc" aria-labelledby="aurum-calc-title">
      <div className="aurum-container">
        <p className="aurum-history__eyebrow">LOOK BACK</p>
        <h2 id="aurum-calc-title" className="aurum-history__title">What an earlier purchase would be worth</h2>
        <p className="aurum-calc__dek">
          A plain arithmetic look back using stored daily closes. It is not a forecast and not advice.
        </p>

        <div className="aurum-calc__grid">
          <form className="aurum-calc__form" onSubmit={(event) => event.preventDefault()}>
            <label className="aurum-calc__field">
              <span>AMOUNT IN USD</span>
              <input
                type="number"
                inputMode="decimal"
                min="1"
                step="1"
                value={amountInput}
                disabled={!calculatorEnabled}
                onChange={(event) => setAmountInput(event.target.value)}
              />
            </label>
            <label className="aurum-calc__field">
              <span>PURCHASE DATE</span>
              <input
                type="date"
                value={dateInput}
                disabled={!calculatorEnabled}
                onChange={(event) => setDateInput(event.target.value)}
              />
            </label>
          </form>

          <div className="aurum-calc__result" aria-live="polite">
            {showSampleChip ? <AurumSampleChip /> : null}
            {!calculatorEnabled ? (
              <p className="aurum-calc__disabled">
                {state.status === "stale"
                  ? "The calculator is unavailable while the price is delayed."
                  : "The calculator is unavailable until a current price is available."}
              </p>
            ) : !thenPoint ? (
              <p className="aurum-calc__disabled">No daily close is stored for that date. Choose a trading day.</p>
            ) : ounces === null || valueToday === null || !data ? (
              <p className="aurum-calc__disabled">Enter an amount above zero.</p>
            ) : (
              <dl className="aurum-calc__rows">
                <div>
                  <dt>Gold price on {DATE.format(thenPoint.date)}</dt>
                  <dd>{USD.format(thenPoint.close)}</dd>
                </div>
                <div>
                  <dt>{USD.format(amount)} buys</dt>
                  <dd>{OZ.format(ounces)} troy ounces</dd>
                </div>
                <div className="aurum-calc__rows--total">
                  <dt>{OZ.format(ounces)} oz at today&apos;s {USD.format(data.spot)}</dt>
                  <dd>{USD.format(valueToday)}</dd>
                </div>
              </dl>
            )}
            {calculatorEnabled && changePct !== null ? (
              <p className="aurum-calc__change">{PERCENT.format(changePct)}% against the amount put in</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
