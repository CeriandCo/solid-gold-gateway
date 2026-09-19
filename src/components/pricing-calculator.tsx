import { Button } from "@/components/ui/button";
import { PRICING } from "@/config/pricing";
import { track } from "@/lib/analytics";
import {
  calculateDeliveryEstimate,
  calculateVaultEstimate,
  formatMoney,
  formatWeight,
  getCheapestDeliveryItem,
  getDeliveryItemPrice,
  holdLabel,
  type DeliveryKind,
  type HoldPeriod,
  type Ownership,
} from "@/lib/pricing-calculator";
import { Link } from "@tanstack/react-router";
import {
  type Dispatch,
  type KeyboardEvent,
  type SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type RadioOption<T extends string | number> = { label: string; value: T };

const ownershipOptions: readonly RadioOption<Ownership>[] = [
  { label: "Store in the vault", value: "vault" },
  { label: "Take delivery", value: "delivery" },
];

const deliveryOptions: readonly RadioOption<DeliveryKind>[] = [
  { label: "Coin", value: "coin" },
  { label: "Bar", value: "bar" },
];

function parseBudget(value: string) {
  const digits = value.replace(/[^0-9]/g, "");
  return digits === "" ? 0 : Number(digits);
}

function formatBudgetInput(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function RadioGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string;
  options: readonly RadioOption<T>[];
  value: T;
  onChange: Dispatch<SetStateAction<T>> | ((value: T) => void);
  className?: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const last = options.length - 1;
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? last
        : (index + (["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1) + options.length) % options.length;
    const next = options[nextIndex];
    if (!next) return;
    onChange(next.value);
    refs.current[nextIndex]?.focus();
  }

  return (
    <div
      className={`pricing-calculator-options${className ? ` ${className}` : ""}`}
      role="radiogroup"
      aria-label={label}
    >
      {options.map((option, index) => {
        const selected = option.value === value;
        return (
          <Button
            className="pricing-calculator-option"
            key={option.value}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            ref={(node) => { refs.current[index] = node; }}
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            type="button"
            variant="outline"
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}

export function PricingCalculator() {
  const [budgetInput, setBudgetInput] = useState(formatBudgetInput(PRICING.calculator.defaultBudgetUsd));
  const [budget, setBudget] = useState<number>(PRICING.calculator.defaultBudgetUsd);
  const [ownership, setOwnership] = useState<Ownership>("vault");
  const [holdDays, setHoldDays] = useState<HoldPeriod>(PRICING.calculator.defaultHoldDays);
  const [deliveryKind, setDeliveryKind] = useState<DeliveryKind>("coin");
  const [gift, setGift] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setBudget(parseBudget(budgetInput)), 150);
    return () => window.clearTimeout(timer);
  }, [budgetInput]);

  const minimumError = budget < PRICING.vault.minimumPurchaseUsd;
  const maximumError = budget > PRICING.maxBudgetUsd;
  const invalid = minimumError || maximumError;
  const vaultEstimate = useMemo(
    () => (!invalid && ownership === "vault" ? calculateVaultEstimate(budget, holdDays) : null),
    [budget, holdDays, invalid, ownership],
  );
  const deliveryEstimate = useMemo(
    () => (!invalid && ownership === "delivery" ? calculateDeliveryEstimate(budget, deliveryKind) : null),
    [budget, deliveryKind, invalid, ownership],
  );
  const notEnough = !invalid && ownership === "delivery" && deliveryEstimate === null;
  const valid = vaultEstimate !== null || deliveryEstimate !== null;

  useEffect(() => {
    if (!valid) return;
    const timer = window.setTimeout(() => {
      track("calculator_estimate_shown", {
        amount: budget,
        own: ownership,
        hold: ownership === "vault" ? holdLabel(holdDays) : null,
        item: ownership === "delivery" ? deliveryKind : null,
        gift: ownership === "delivery" ? gift : false,
      });
    }, 800);
    return () => window.clearTimeout(timer);
  }, [budget, deliveryKind, gift, holdDays, ownership, valid]);

  const quickBudgetOptions = PRICING.calculator.quickBudgetsUsd.map((amount) => ({
    label: `$${amount.toLocaleString("en-US")}`,
    value: amount,
  }));
  const holdOptions = PRICING.calculator.holdOptionsDays.map((days) => ({
    label: holdLabel(days),
    value: days,
  }));
  const parsedInput = parseBudget(budgetInput);

  function selectBudget(amount: number) {
    setBudgetInput(formatBudgetInput(amount));
    setBudget(amount);
  }

  return (
    <aside className="pricing-calculator" aria-labelledby="pricing-calculator-title">
      <div className="pricing-calculator-form">
        <div>
          <p className="pricing-calculator-eyebrow">Purchase calculator</p>
          <h3 id="pricing-calculator-title">See what your money could buy.</h3>
        </div>

        <div className="pricing-calculator-field">
          <label htmlFor="pricing-budget">Budget</label>
          <div className={`pricing-calculator-input${invalid ? " is-error" : ""}`}>
            <span>US$</span>
            <input
              id="pricing-budget"
              inputMode="numeric"
              pattern="[0-9,]*"
              value={budgetInput}
              aria-describedby={invalid ? "pricing-budget-error" : undefined}
              aria-invalid={invalid}
              onBlur={() => setBudgetInput(parsedInput ? formatBudgetInput(parsedInput) : "")}
              onChange={(event) => setBudgetInput(event.target.value.replace(/[^0-9,]/g, ""))}
            />
          </div>
          <p id="pricing-budget-error" className="pricing-calculator-error" aria-live="polite">
            {minimumError
              ? `The minimum is ${formatMoney(PRICING.vault.minimumPurchaseUsd).replace(".00", "")}.`
              : maximumError
                ? `The maximum is ${formatMoney(PRICING.maxBudgetUsd).replace(".00", "")}.`
                : ""}
          </p>
          <RadioGroup
            className="pricing-calculator-quick-options"
            label="Quick budget amount"
            onChange={selectBudget}
            options={quickBudgetOptions}
            value={PRICING.calculator.quickBudgetsUsd.some((amount) => amount === parsedInput) ? parsedInput : -1}
          />
        </div>

        <div className="pricing-calculator-field">
          <span className="pricing-calculator-label">How would you like to own it?</span>
          <RadioGroup label="How would you like to own it?" onChange={setOwnership} options={ownershipOptions} value={ownership} />
        </div>

        {ownership === "vault" ? (
          <div className="pricing-calculator-field">
            <span className="pricing-calculator-label">Hold for</span>
            <RadioGroup
              className="pricing-calculator-hold-options"
              label="Hold for"
              onChange={setHoldDays}
              options={holdOptions}
              value={holdDays}
            />
          </div>
        ) : (
          <>
            <div className="pricing-calculator-field">
              <span className="pricing-calculator-label">Coin or bar?</span>
              <RadioGroup label="Coin or bar?" onChange={setDeliveryKind} options={deliveryOptions} value={deliveryKind} />
            </div>
            <div className="pricing-calculator-gift-row">
              <div>
                <span>This is a gift</span>
                <small>Engraving and gift packaging, priced at checkout</small>
              </div>
              <Button
                className="pricing-calculator-toggle"
                type="button"
                role="switch"
                aria-checked={gift}
                aria-label="This is a gift"
                onClick={() => setGift((current) => !current)}
                variant="outline"
              >
                <span aria-hidden="true" />
              </Button>
            </div>
          </>
        )}
      </div>

      <CalculatorResult
        budget={budget}
        deliveryEstimate={deliveryEstimate}
        deliveryKind={deliveryKind}
        gift={gift}
        holdDays={holdDays}
        invalid={invalid}
        notEnough={notEnough}
        onSwitchToVault={() => {
          setOwnership("vault");
          track("calculator_switch_to_vault", { amount: budget, item: deliveryKind });
        }}
        vaultEstimate={vaultEstimate}
      />
    </aside>
  );
}

function CalculatorResult({
  budget,
  deliveryEstimate,
  deliveryKind,
  gift,
  holdDays,
  invalid,
  notEnough,
  onSwitchToVault,
  vaultEstimate,
}: {
  budget: number;
  deliveryEstimate: ReturnType<typeof calculateDeliveryEstimate>;
  deliveryKind: DeliveryKind;
  gift: boolean;
  holdDays: HoldPeriod;
  invalid: boolean;
  notEnough: boolean;
  onSwitchToVault: () => void;
  vaultEstimate: ReturnType<typeof calculateVaultEstimate> | null;
}) {
  const minimumItem = getCheapestDeliveryItem(deliveryKind);
  const minimumPrice = minimumItem ? getDeliveryItemPrice(minimumItem) : 0;

  if (invalid) {
    return (
      <div className="pricing-calculator-result is-muted" aria-live="polite">
        <ResultHeading kicker="Your estimate" />
        <p className="pricing-calculator-headline is-sentence">—</p>
        <p className="pricing-calculator-subline">
          Enter at least {formatMoney(PRICING.vault.minimumPurchaseUsd).replace(".00", "")} to see an estimate.
        </p>
        <Button className="pricing-calculator-cta" disabled aria-disabled="true">Join the waitlist to buy →</Button>
      </div>
    );
  }

  if (notEnough && minimumItem) {
    return (
      <div className="pricing-calculator-result is-muted" aria-live="polite">
        <ResultHeading kicker="Not quite enough" />
        <p className="pricing-calculator-headline is-sentence">
          {formatMoney(budget).replace(".00", "")} does not cover the smallest {deliveryKind}.
        </p>
        <p className="pricing-calculator-subline">
          The smallest {deliveryKind} is a {minimumItem.label} {minimumItem.name}, about {formatMoney(minimumPrice)}.
          Raise your budget, or store gold in the vault from {formatMoney(PRICING.vault.minimumPurchaseUsd).replace(".00", "")}.
        </p>
        <Button className="pricing-calculator-cta is-outline" onClick={onSwitchToVault} variant="outline">
          Store in the vault instead →
        </Button>
      </div>
    );
  }

  if (vaultEstimate) {
    const laterStorage = vaultEstimate.storage.slice(1);
    const storageLines = holdDays === 1825 && laterStorage.length > 0
      ? [{
          label: "Storage · years 2–5",
          value: formatMoney(laterStorage.reduce((sum, year) => sum + year.amount, 0)),
          minimum: laterStorage.every((year) => year.minimumApplied),
        }]
      : laterStorage.map((year) => ({
          label: `Storage · year ${year.year}`,
          value: formatMoney(year.amount),
          minimum: year.minimumApplied,
        }));
    return (
      <div className="pricing-calculator-result" aria-live="polite">
        <ResultHeading kicker="Your estimate" sample />
        <p className="pricing-calculator-headline">{formatWeight(vaultEstimate.ounces)} oz</p>
        <p className="pricing-calculator-subline">of gold allocated in your name</p>
        <div className="pricing-calculator-lines">
          <ResultLine label={`Gold at spot · ${formatWeight(vaultEstimate.ounces)} oz`} value={formatMoney(vaultEstimate.atSpot)} />
          <ResultLine label={`Product premium · ${(PRICING.sample.vaultPremiumRate * 100).toFixed(0)}%`} value={formatMoney(vaultEstimate.premium)} />
          <ResultLine label={`Purchase fee · ${(PRICING.vault.purchaseFeeRate * 100).toFixed(2)}% of ${formatMoney(budget).replace(".00", "")}`} value={formatMoney(vaultEstimate.purchaseFee)} />
          <ResultLine label="Storage · year 1" value={formatMoney(0)} />
          {storageLines.map((line) => (
            <ResultLine key={line.label} label={`${line.label}${line.minimum ? ` (${formatMoney(PRICING.vault.storageMinimumPerYearUsd).replace(".00", "")} minimum)` : ""}`} value={line.value} />
          ))}
        </div>
        <ResultTotal label={`Total fees, ${holdLabel(holdDays)}`} value={formatMoney(vaultEstimate.totalFees)} />
        <ResultAction />
        <p className="pricing-calculator-note">
          Updates as you type. Sample spot {formatMoney(PRICING.sample.spotUsdPerOz)}/oz. Premium is part of the price, not a fee. Not an offer.
        </p>
      </div>
    );
  }

  if (!deliveryEstimate) return null;
  const typeWord = deliveryKind === "coin" ? "coin" : "bar";
  return (
    <div className="pricing-calculator-result" aria-live="polite">
      <ResultHeading kicker="Your estimate" sample />
      <p className="pricing-calculator-headline is-sentence">{deliveryEstimate.quantity} × {deliveryEstimate.item.label}</p>
      <p className="pricing-calculator-subline">
        {deliveryEstimate.item.name} — the largest whole {typeWord} your budget covers.
      </p>
      <div className="pricing-calculator-lines">
        <ResultLine label={`Gold at spot · ${formatWeight(deliveryEstimate.item.weightOz)} oz`} value={formatMoney(deliveryEstimate.atSpot)} />
        <ResultLine label={`Product premium · ${(deliveryEstimate.item.premiumRate * 100).toFixed(0)}%`} value={formatMoney(deliveryEstimate.premium)} />
        <ResultLine label="Purchase fee" value={formatMoney(PRICING.delivery.purchaseFeeRate)} />
        {deliveryKind === "coin" ? <ResultLine label="Storage" value="None — it is with you" subdued /> : null}
        {gift ? <ResultLine label="Engraving and gift packaging" value="Shown at checkout" subdued /> : null}
        <ResultLine label="Insured shipping" value="Shown at checkout" subdued />
        <ResultLine label="Left from your budget" value={formatMoney(deliveryEstimate.remainder)} />
      </div>
      <ResultTotal label="You pay before shipping" value={formatMoney(deliveryEstimate.total)} />
      <ResultAction />
      <p className="pricing-calculator-note">
        {deliveryKind === "bar" && gift
          ? "Gift options and shipping are priced at checkout, before you pay."
          : "Coins are sold whole. Shipping depends on your address and is shown before you pay."}
      </p>
    </div>
  );
}

function ResultHeading({ kicker, sample = false }: { kicker: string; sample?: boolean }) {
  return (
    <div className="pricing-calculator-result-heading">
      <p>{kicker}</p>
      {sample ? <span>Sample</span> : null}
    </div>
  );
}

function ResultLine({ label, value, subdued = false }: { label: string; value: string; subdued?: boolean }) {
  return <div className={subdued ? "is-subdued" : undefined}><span>{label}</span><strong>{value}</strong></div>;
}

function ResultTotal({ label, value }: { label: string; value: string }) {
  return <div className="pricing-calculator-total"><span>{label}</span><strong>{value}</strong></div>;
}

function ResultAction() {
  return (
    <Button asChild className="pricing-calculator-cta">
      <Link to="/early-access">Join the waitlist to buy →</Link>
    </Button>
  );
}