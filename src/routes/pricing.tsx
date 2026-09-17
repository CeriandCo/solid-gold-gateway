import { forwardRef, Fragment, useEffect, useId, useRef, useState, type CSSProperties } from "react";
import heroImage from "@/assets/pricing/hero-vault.png.asset.json";
import sqootMandala from "@/assets/sqoot-pure-mandala.png.asset.json";
import heroWebp from "@/assets/pricing/hero-vault.webp.asset.json";
import heroWebp2x from "@/assets/pricing/hero-vault-2x.webp.asset.json";
import { track } from "@/lib/analytics";
import { GoldButton, SiteFooter, SiteHeader } from "@/components/site-chrome";
import {
  HERO_CHIPS,
  PRODUCT_CARDS,
  PRODUCT_PRICING,
  PURCHASE_PRICE_TOOLTIP,
  type PricingFeeRow,
  type ProductPricing,
} from "@/lib/pricing/data";
import { FAQ_ITEMS, TRUST_ITEMS } from "@/lib/pricing/trust-and-faq";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Info, Minus, Plus } from "lucide-react";

const SITE_ORIGIN = "https://solid-gold-gateway.lovable.app";
const PRICING_URL = `${SITE_ORIGIN}/pricing`;
const OG_IMAGE = `${SITE_ORIGIN}/og/pricing.png`;

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing & Fees | SQOOT Pure" },
      {
        name: "description",
        content:
          "Simple pricing for gold. See fees for coins, bars, and allocated metal, plus a purchase calculator that estimates your total cost.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Pricing & Fees — SQOOT Pure" },
      {
        property: "og:description",
        content:
          "Transparent fees for gold: coins, bars, and allocated metal. Storage, delivery, and gifting costs shown upfront.",
      },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:url", content: PRICING_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Pricing & Fees — SQOOT Pure" },
      {
        name: "twitter:description",
        content:
          "Transparent fees for gold. Storage, delivery, and gifting costs shown upfront.",
      },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: PRICING_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(FAQ_SCHEMA),
      },
    ],
  }),
  component: PricingPage,
});

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-gold rounded-[3px]";

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const OZ = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});
const PLAIN = new Intl.NumberFormat("en-US");

function ProductImage({
  image,
  webp,
  webp2x,
  alt,
}: {
  image: string;
  webp: string;
  webp2x: string;
  alt: string;
}) {
  return (
    <picture>
      <source type="image/webp" srcSet={`${webp} 1x, ${webp2x} 2x`} />
      <img
        src={image}
        alt={alt}
        width={280}
        height={280}
        loading="lazy"
        decoding="async"
        className="max-h-[100px] w-auto max-w-full object-contain object-center md:max-h-[120px] md:object-right"
      />
    </picture>
  );
}

function InfoTooltip({ label, text }: { label: string; text: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const btnRef = useRef<HTMLButtonElement>(null);
  // Below md the tooltip is width-clamped and horizontally clamped to the
  // viewport (measured from the trigger on open) so it can never overflow
  // either edge, wherever the icon sits. Desktop keeps the CSS center anchor.
  const [mobilePos, setMobilePos] = useState<{
    left: number;
    width: number;
    arrowX: number;
  } | null>(null);

  function openWithClamp() {
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect && typeof window !== "undefined") {
      const vw = window.innerWidth;
      const center = rect.left + rect.width / 2;
      const width = Math.min(280, vw - 32);
      // left is relative to the icon wrapper (the tooltip's containing
      // block), so convert the viewport-clamped position into wrapper space.
      const left =
        Math.min(Math.max(16, center - width / 2), vw - 16 - width) - rect.left;
      // The ::before triangle is centered on its `left` via translateX(-50%),
      // so arrowX is the icon center's offset inside the tooltip directly.
      const arrowX = Math.min(
        Math.max(8, center - (rect.left + left)),
        width - 12,
      );
      setMobilePos({ left, width, arrowX });
    } else {
      setMobilePos(null);
    }
  }

  function handleOpen() {
    openWithClamp();
    setOpen(true);
  }

  return (
    <span className="relative inline-flex">
      <button
        ref={btnRef}
        type="button"
        aria-label={label}
        aria-describedby={open ? id : undefined}
        className={`inline-flex items-center text-muted-ink ${FOCUS_RING}`}
        onMouseEnter={handleOpen}
        onMouseLeave={() => setOpen(false)}
        onFocus={handleOpen}
        onBlur={() => setOpen(false)}
        onClick={() => {
          if (open) setOpen(false);
          else handleOpen();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
      >
        <Info size={14} aria-hidden="true" focusable="false" />
      </button>
      {open && (
        <span
          role="tooltip"
          id={id}
          className="pricing-tooltip absolute top-full left-1/2 z-20 mt-1.5 w-[280px] max-w-[min(280px,calc(100vw-32px))] -translate-x-1/2 rounded-[4px] bg-forest-black p-3 text-left font-sans text-xs font-normal leading-[1.45] text-paper shadow-tooltip"
          style={
            mobilePos
              ? ({
                  left: mobilePos.left,
                  width: mobilePos.width,
                  right: "auto",
                  transform: "none",
                  translate: "none",
                  "--tip-arrow-x": `${mobilePos.arrowX}px`,
                } as CSSProperties)
              : undefined
          }
        >
          {text}
        </span>
      )}
    </span>
  );
}

function AmountCell({ row }: { row: PricingFeeRow }) {
  if (row.description) {
    return (
      <span className="font-sans text-ui-sm font-normal text-muted-ink">
        {row.description}
      </span>
    );
  }
  return (
    <span className="block">
      <span className="inline-flex flex-wrap items-center gap-2 sm:justify-center">
        <span className="font-sans text-ui-sm font-bold text-forest-black">
          {row.amount}
        </span>
        {row.badge ? (
          <span className="rounded-[3px] bg-gold px-1.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[1.2px] text-forest-deep">
            {row.badge}
          </span>
        ) : null}
      </span>
      {row.amountNote ? (
        <span className="mt-1 block font-sans text-ui-xs font-normal text-muted-ink">
          {row.amountNote}
        </span>
      ) : null}
    </span>
  );
}

function CostLabel({ row }: { row: PricingFeeRow }) {
  return (
    <>
      <span className="font-sans text-ui-sm font-medium text-forest-black">
        {row.label}
        {row.label === "Purchase price" ? (
          <>
            {" "}
            <InfoTooltip
              label="More information about purchase price"
              text={PURCHASE_PRICE_TOOLTIP}
            />
          </>
        ) : null}
      </span>
      {row.note ? (
        <span className="mt-1 block font-sans text-ui-xs font-normal text-muted-ink">
          {row.note}
        </span>
      ) : null}
    </>
  );
}

// One contextual pricing table for the selected product — replaces the old
// three-way comparison tables. Keyed by product so the fade replays on change.
const ProductPricingSection = forwardRef<HTMLElement, { pricing: ProductPricing }>(
  function ProductPricingSection({ pricing }, ref) {
    return (
      <section
        ref={ref}
        aria-labelledby="product-pricing-heading"
        aria-live="polite"
        className="scroll-mt-[132px] pb-4 pt-1 md:pb-2.5 md:pt-1.5 lg:pb-3 lg:pt-2"
      >
        <div key={pricing.id} className="estimate-fade">
          <p className="pricing-label mb-1 text-muted-ink">Pricing</p>
          <h2
            id="product-pricing-heading"
            className="text-display-h4 mb-1.5 text-forest-black md:text-display-h4-sm"
          >
            {pricing.heading}
          </h2>
          <p className="mb-5 font-sans text-ui-md font-normal leading-[1.55] text-muted-ink md:mb-3.5">
            {pricing.copy}
          </p>

          {/* Stacked view on narrow screens: cost label above its amount */}
          <dl className="border-t border-beige sm:hidden">
            {pricing.rows.map((row) => (
              <div key={row.label} className="border-b border-beige py-3.5">
                <dt>
                  <CostLabel row={row} />
                </dt>
                <dd className="mt-2">
                  <AmountCell row={row} />
                </dd>
              </div>
            ))}
          </dl>

          <table
            aria-labelledby="product-pricing-heading"
            className="hidden w-full border-collapse border border-beige font-sans text-ui-sm font-normal sm:table"
          >
            <thead>
              <tr className="bg-wash-green">
                <th
                  scope="col"
                  className="w-[42%] border-b border-beige px-3 py-2.5 text-left font-sans text-ui-xs font-semibold tracking-[0.4px] text-charcoal lg:px-3.5"
                >
                  {pricing.columns[0]}
                </th>
                <th
                  scope="col"
                  className="border-b border-l border-beige px-3 py-2.5 text-center font-sans text-ui-xs font-semibold tracking-[0.4px] text-charcoal lg:px-3.5"
                >
                  {pricing.columns[1]}
                </th>
              </tr>
            </thead>
            <tbody>
              {pricing.rows.map((row, rowIndex) => (
                <tr
                  key={row.label}
                  className={rowIndex < pricing.rows.length - 1 ? "border-b border-beige" : ""}
                >
                  <th
                    scope="row"
                    className="px-3 py-3.5 text-left align-top font-normal lg:px-3.5"
                  >
                    <CostLabel row={row} />
                  </th>
                  <td className="border-l border-beige px-3 py-3.5 text-center align-top lg:px-3.5">
                    <AmountCell row={row} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  },
);

const SPOT_GOLD = 4310;
const PREMIUM = 0.04;

const HOLD_DAYS: Record<string, number> = {
  "30d": 30,
  "90d": 90,
  "6mo": 182,
  "1yr": 365,
};

type Option = { value: string; label: string };

function SegmentedGroup({
  legend,
  options,
  value,
  onChange,
  name,
  compact,
  describedBy,
  legendExtra,
}: {
  legend: string;
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
  name: string;
  compact?: boolean;
  describedBy?: string | undefined;
  legendExtra?: React.ReactNode;
}) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className="mb-2 flex items-center gap-1.5 font-sans text-ui-sm font-medium text-forest-black">
        {legend}
        {legendExtra}
      </legend>
      <div
        className={`flex flex-wrap ${compact ? "gap-1.5" : "gap-2"}`}
        role="radiogroup"
        aria-label={legend}
      >
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              className={`flex-1 max-md:min-w-[calc(50%-4px)] cursor-pointer rounded-[4px] border border-beige text-center font-sans font-medium ${
                compact ? "px-1 py-2 text-ui-xs" : "px-0 py-2.5 text-ui-sm"
              } ${
                selected
                  ? "border-gold bg-gradient-to-b from-gold-soft to-gold text-forest-deep"
                  : "bg-paper text-forest-black"
              } motion-safe:transition-[background-color,color,border-color] motion-safe:duration-[120ms] motion-safe:ease-standard has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[3px] has-[:focus-visible]:outline-gold`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                aria-describedby={describedBy}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function StepRow({ children, last }: { children: React.ReactNode; last?: boolean }) {
  return (
    <div className={`flex min-w-0 flex-col gap-2 ${last ? "" : "mb-3.5"}`}>{children}</div>
  );
}

type Estimate = {
  oz: number;
  total: number;
  metal: string;
  purchaseFee: number;
  storageBreakdown: {
    annualStorage: number;
    annualInsurance: number;
    flooredAt25: boolean;
  } | null;
};

const AMOUNT_PRESETS = [100, 500, 1000, 5000];
const AMOUNT_MAX = 1_000_000;

function PurchaseCalculator({
  product,
  onProductChange,
}: {
  product: string | null;
  onProductChange: (value: string) => void;
}) {
  const [amount, setAmount] = useState<number | null>(500);
  const [amountFocused, setAmountFocused] = useState(false);
  const [capHint, setCapHint] = useState(false);
  const [metal, setMetal] = useState("gold");
  const [receive, setReceive] = useState("vault");
  const [hold, setHold] = useState("30d");
  const [gift, setGift] = useState("no");
  const [error, setError] = useState<string | null>(null);
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const amountId = useId();
  const errorId = useId();
  const submitRef = useRef<HTMLButtonElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  const amountDisplay =
    amount === null ? "" : amountFocused ? String(amount) : PLAIN.format(amount);

  function commitAmount(raw: string) {
    const digits = raw.replace(/[^\d]/g, "");
    if (digits === "") {
      setAmount(null);
      setCapHint(false);
      return;
    }
    const next = Number(digits);
    if (next > AMOUNT_MAX) {
      setCapHint(true);
      return;
    }
    setCapHint(false);
    setAmount(next);
  }

  useEffect(() => {
    if (receive !== "vault") setHold("30d");
  }, [receive]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const value = amount ?? Number.NaN;
    if (!product) {
      setEstimate(null);
      setError("Please pick a product.");
      return;
    }
    if (!Number.isFinite(value) || value < 25) {
      setEstimate(null);
      setError("The minimum is US$25.");
      return;
    }
    setError(null);
    const spot = SPOT_GOLD;
    const purchaseFee = product === "allocated" ? value * 0.03 : 0;
    const toMetal = value - purchaseFee;
    const oz = toMetal / (spot * (1 + PREMIUM));
    let storageCost = 0;
    let storageBreakdown: Estimate["storageBreakdown"] = null;
    if (receive === "vault") {
      const days = HOLD_DAYS[hold] ?? 30;
      const annualStorageRaw = value * 0.0035 * (days / 365);
      const annualInsuranceRaw = value * 0.0045 * (days / 365);
      const combinedRaw = annualStorageRaw + annualInsuranceRaw;
      const minimum = (25 * days) / 365;
      const flooredAt25 = combinedRaw < minimum;
      // Same math as before — the $25 floor applies to the combined amount.
      storageCost = Math.max(combinedRaw, minimum);
      storageBreakdown = {
        annualStorage: annualStorageRaw,
        annualInsurance: annualInsuranceRaw,
        flooredAt25,
      };
    }
    setEstimate({
      oz,
      total: purchaseFee + storageCost,
      metal,
      purchaseFee,
      storageBreakdown,
    });
    track("calculator_estimate_shown", {
      amount: value,
      metal,
      product,
      receive,
      hold: receive === "vault" ? hold : "n/a",
      gift,
    });
  }

  return (
    <section
      aria-labelledby="calculator-heading"
      className="pricing-page mx-auto w-full max-w-none rounded-[var(--pricing-radius-large)] border border-[var(--pricing-gold-border)] bg-[var(--pricing-paper)] px-5 pb-5 pt-4 shadow-[var(--pricing-shadow)] md:max-w-[560px] md:px-6 md:pb-6 md:pt-5 lg:max-w-none lg:sticky lg:top-[132px] lg:px-6 lg:pb-6.5 lg:pt-5.5"
    >
      <p className="pricing-label mb-2 text-gold-dark">Purchase calculator</p>
      <h2 id="calculator-heading" className="pricing-card-title mb-1.5 text-forest-black">
        See what your money could buy
      </h2>
      <p className="mb-1.5 font-sans text-ui-sm font-normal leading-[1.5] text-muted-ink">
        Explore your gold options and see the estimated costs, including fees,
        storage and delivery.
      </p>
      <p className="mb-4.5 font-sans text-ui-xs font-normal text-muted-ink">
        Estimate in USD · Fees shown separately
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3.5">
          <p className="pricing-label mb-2 text-muted-ink">Budget</p>
          <StepRow>
          <label
            htmlFor={amountId}
            className="font-sans text-ui-sm font-medium text-forest-black"
          >
            How much do you want to spend? (USD)
          </label>
          <div className="flex items-center gap-1.5 rounded-[4px] border border-beige bg-paper px-3 py-2.5 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 motion-safe:transition-shadow motion-safe:duration-120 motion-safe:ease-standard">
            <span className="font-sans text-ui-lg font-medium text-muted-ink">US$</span>
            <input
              id={amountId}
              ref={amountRef}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={amountDisplay}
              aria-describedby={error ? errorId : undefined}
              onFocus={() => setAmountFocused(true)}
              onBlur={() => setAmountFocused(false)}
              onKeyDown={(event) => {
                const allowed = [
                  "Backspace",
                  "Delete",
                  "Tab",
                  "Enter",
                  "Escape",
                  "Home",
                  "End",
                  "ArrowLeft",
                  "ArrowRight",
                  "ArrowUp",
                  "ArrowDown",
                ];
                if (
                  event.metaKey ||
                  event.ctrlKey ||
                  allowed.includes(event.key) ||
                  /^\d$/.test(event.key)
                ) {
                  return;
                }
                event.preventDefault();
              }}
              onPaste={(event) => {
                const text = event.clipboardData.getData("text");
                event.preventDefault();
                commitAmount(text);
              }}
              onChange={(event) => commitAmount(event.target.value)}
              className="w-full min-w-0 bg-transparent font-sans text-ui-lg font-medium text-forest-black outline-none"
            />
          </div>
          <p className="mt-0.5 font-sans text-xs font-normal text-muted-ink">
            Or pick a common amount:
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {AMOUNT_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setAmount(preset);
                  setCapHint(false);
                  track("calculator_amount_preset_clicked", { amount: preset });
                }}
                className={`rounded-[4px] border px-2.5 py-1 font-sans text-xs font-medium motion-safe:transition-colors motion-safe:duration-[120ms] motion-safe:ease-standard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold hover:border-gold-dark ${
                  amount === preset
                    ? "border-forest-black bg-wash-forest text-forest-black"
                    : "border-beige bg-paper text-charcoal"
                }`}
              >
                US${PLAIN.format(preset)}
              </button>
            ))}
          </div>
          {capHint && (
            <p className="mt-1.5 font-sans text-xs font-normal text-muted-ink">
              Amounts above US$1,000,000 — please contact us for private-client pricing.
            </p>
          )}
        </StepRow>
        </div>

        <div className="mb-3.5">
          <p className="pricing-label mb-2 text-muted-ink">Ownership</p>
          <StepRow>
          <SegmentedGroup
            name="metal"
            legend="Choose metal"
            value={metal}
            onChange={setMetal}
            options={[{ value: "gold", label: "Gold" }]}
          />
        </StepRow>

        <StepRow>
          <SegmentedGroup
            name="product"
            legend="Choose product"
            value={product}
            onChange={onProductChange}
            compact
            describedBy={error ? errorId : undefined}
            options={[
              { value: "coins", label: "Coins" },
              { value: "bars", label: "Bars" },
              { value: "allocated", label: "Allocated metal" },
            ]}
          />
        </StepRow>

        <StepRow>
          <SegmentedGroup
            name="receive"
            legend="How would you like to receive it?"
            value={receive}
            onChange={setReceive}
            options={[
              { value: "vault", label: "Store in a vault" },
              { value: "delivery", label: "Take physical delivery" },
            ]}
          />
        </StepRow>
        </div>

        <div className="mb-3.5">
          <p className="pricing-label mb-2 text-muted-ink">Fulfilment</p>
          <div
          inert={receive !== "vault" ? true : undefined}
          className={`grid motion-safe:transition-[grid-template-rows,opacity] motion-safe:duration-200 motion-safe:ease-standard ${
            receive === "vault" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <StepRow>
              <SegmentedGroup
                name="hold"
                legend="How long will you store it?"
                value={hold}
                onChange={setHold}
                compact
                legendExtra={
                  <InfoTooltip
                    label="More information about storage length"
                    text="Storage fees are pro-rated for the exact number of days you hold your metal."
                  />
                }
                options={[
                  { value: "30d", label: "30 days" },
                  { value: "90d", label: "90 days" },
                  { value: "6mo", label: "6 months" },
                  { value: "1yr", label: "1 year" },
                ]}
              />
            </StepRow>
          </div>
        </div>

        <StepRow last>
          <SegmentedGroup
            name="gift"
            legend="Is this a gift? (optional)"
            value={gift}
            onChange={setGift}
            options={[
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ]}
          />
        </StepRow>
        </div>

        <GoldButton
          ref={submitRef}
          type="submit"
          variant="forest"
          size="md"
          className="mt-6 w-full"
        >
          Show my estimate
        </GoldButton>

        {error && (
          <p
            id={errorId}
            role="alert"
            className="estimate-fade mt-2 font-sans text-ui-xs font-medium text-error"
          >
            {error}
          </p>
        )}

        <div role="status" aria-live="polite">
          {estimate && (
            <div className="estimate-enter mt-2.5 rounded-[var(--pricing-radius-card)] border border-[var(--pricing-gold-border)] bg-[var(--pricing-paper-deep)] p-4">
              <p className="pricing-label text-gold-dark">Your estimate</p>
              <p className="pricing-card-title mt-1.5 text-forest-black">
                {OZ.format(estimate.oz)} oz {estimate.metal}
              </p>
              <p className="mt-1 font-sans text-ui-xs font-normal text-muted-ink">
                Selected product:{" "}
                <span className="font-medium text-forest-black">
                  {PRODUCT_CARDS.find((card) => card.id === product)?.title ??
                    product}
                </span>
              </p>
              <div className="mt-2 space-y-1 font-sans text-ui-xs font-normal text-muted-ink">
                {estimate.purchaseFee > 0 && (
                  <p>Purchase fee: {USD.format(estimate.purchaseFee)}</p>
                )}
                {estimate.storageBreakdown !== null &&
                  (estimate.storageBreakdown.flooredAt25 ? (
                    // The US$25/yr minimum applies to storage + insurance
                    // combined, not to each part — so a split here would
                    // misrepresent the fee. Show the combined amount only.
                    <p>
                      Storage &amp; insurance (US$25/year minimum applies):{" "}
                      {USD.format(estimate.total - estimate.purchaseFee)}
                    </p>
                  ) : (
                    <>
                      <p>
                        Annual storage:{" "}
                        {USD.format(estimate.storageBreakdown.annualStorage)}
                      </p>
                      <p>
                        Annual insurance:{" "}
                        {USD.format(estimate.storageBreakdown.annualInsurance)}
                      </p>
                    </>
                  ))}
              </div>
              <div className="my-3 h-px w-full bg-[var(--pricing-gold-border)]" />
              <p className="font-sans text-sm font-semibold text-forest-black">
                Estimated total fees: {USD.format(estimate.total)}
              </p>
              <p className="mt-1 font-sans text-ui-xs font-normal text-muted-ink">
                Final price shown before confirmation
              </p>
              <button
                type="button"
                onClick={() => {
                  setEstimate(null);
                  amountRef.current?.focus();
                }}
                className={`mt-3 font-sans text-xs font-medium text-gold-dark underline motion-safe:transition-colors motion-safe:ease-standard hover:text-gold ${FOCUS_RING}`}
              >
                Recalculate
              </button>
            </div>
          )}
        </div>
      </form>

      <p className="mt-3 font-sans text-[11.5px] font-normal leading-[1.5] text-muted-ink">
        This is an estimate only. Live market prices, product availability and shipping
        costs may affect your total cost.
      </p>
    </section>
  );
}

function TrustBar() {
  return (
    <section aria-labelledby="trust-heading" className="pricing-page pricing-trust-band">
      <h2 id="trust-heading" className="sr-only">
        Why customers trust us
      </h2>
      <img src={sqootMandala.url} alt="" aria-hidden="true" className="pricing-trust-motif left-[-40px]" />
      <img
        src={sqootMandala.url}
        alt=""
        aria-hidden="true"
        className="pricing-trust-motif right-[-40px]"
        style={{ transform: "translateY(-50%) scaleX(-1)" }}
      />
      <ul className="pricing-trust-grid">
        {TRUST_ITEMS.map(({ icon: Icon, title, description }) => (
          <li key={title} className="pricing-trust-item">
            <Icon
              strokeWidth={1.6}
              aria-hidden="true"
              focusable="false"
              className="size-7 shrink-0 text-[var(--pricing-gold)]"
            />
            <strong className="font-sans text-sm font-semibold leading-[1.35] text-ivory">{title}</strong>
            <span className="font-sans text-[13px] font-normal leading-[1.45] text-ivory/65">{description}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function FaqRow({ question, answer }: { question: string; answer: string }) {
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const toggle = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (timer.current) clearTimeout(timer.current);
    if (!mounted) {
      setMounted(true);
      track("faq_open", { question });
      requestAnimationFrame(() => setExpanded(true));
    } else {
      setExpanded(false);
      timer.current = setTimeout(() => setMounted(false), 200);
    }
  };

  return (
    <details open={mounted} className="group border-b border-beige first:border-t">
      <summary
        onClick={toggle}
        className={`flex cursor-pointer list-none items-center justify-between gap-4 py-3 md:py-3 lg:py-3.5 [&::-webkit-details-marker]:hidden ${FOCUS_RING}`}
      >
        <span className="font-sans text-sm font-medium leading-[1.4] text-forest-black lg:text-ui-md">
          {question}
        </span>
        <span className="relative inline-flex size-5 shrink-0 items-center justify-center" aria-hidden="true">
          <Plus
            size={20}
            strokeWidth={1.75}
            focusable="false"
            className="absolute text-muted-ink motion-safe:transition-opacity motion-safe:duration-120 motion-safe:ease-standard group-open:opacity-0"
          />
          <Minus
            size={20}
            strokeWidth={1.75}
            focusable="false"
            className="absolute text-muted-ink opacity-0 motion-safe:transition-opacity motion-safe:duration-120 motion-safe:ease-standard group-open:opacity-100"
          />
        </span>
      </summary>
      <div
        className={`grid motion-safe:transition-[grid-template-rows,opacity] motion-safe:duration-200 motion-safe:ease-standard ${
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="max-w-none pb-3.5 pr-6 font-sans text-ui-sm font-normal leading-[1.6] text-muted-ink md:max-w-[36em] md:pr-7 lg:max-w-[40em] lg:pr-9">
            {answer}
          </p>
        </div>
      </div>
    </details>
  );
}

function FaqSection() {
  return (
    <section
      aria-labelledby="faq-heading"
      className="pricing-page pb-4 pt-4 md:pb-4 md:pt-4 lg:pb-4 lg:pt-4"
    >
      <h2
        id="faq-heading"
        className="pricing-section-title mb-5 text-forest-black"
      >
        Frequently asked questions
      </h2>
      {/*

        FAQ uses native <details>, which is multi-open by default.

        This is intentional — users often compare answers side by side.

        Do not add JS to auto-close other items when one opens.

        If single-open is ever requested, add name="pricing-faq" to every

        <details> instead of JS — unsupported browsers fall back to multi-open.

      */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-6 lg:gap-x-10">
        <div>
          {FAQ_ITEMS.slice(0, 4).map((item) => (
            <FaqRow key={item.question} {...item} />
          ))}
        </div>
        <div>
          {FAQ_ITEMS.slice(4).map((item) => (
            <FaqRow key={item.question} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BottomCta() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="pricing-page relative overflow-hidden bg-[var(--pricing-forest-900)] py-10 md:py-12 lg:py-8"
    >
      {/* Subtle radial gold glow behind the heading */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[420px] max-w-[900px]"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--pricing-gold) 7%, transparent), transparent)",
        }}
      />
      <div className="relative mx-auto max-w-[36em] text-center">
        <h2
          id="cta-heading"
          className="text-display-h4 mb-2 text-warm-white md:text-[34px] md:leading-[1.08] lg:text-display-h2"
        >
          Ready to own gold with confidence?
        </h2>
        <p className="mx-auto mb-5 max-w-none font-sans text-ui-lg font-normal leading-[1.55] text-warm-white/70 md:max-w-[30em] lg:text-base">
          Start from US$25 and see every applicable fee before you confirm.
        </p>
        <GoldButton
          to="/early-access"
          variant="primary"
          size="lg"
          onClick={() => track("bottom_cta_click", { target: "get_started" })}
          className="w-full no-underline md:w-auto"
        >
          Get Early Access
        </GoldButton>
        <div className="mt-3">
          <Link
            to="/precious-metal"
            onClick={() => track("bottom_cta_click", { target: "explore_products" })}
            className={`inline-block border-b-[1.5px] border-gold pb-1 font-sans text-ui-sm font-medium text-warm-white no-underline motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-standard hover:text-gold ${FOCUS_RING}`}
          >
            Or explore products first →
          </Link>
        </div>
      </div>
    </section>
  );
}

function PricingPage() {
  // Allocated metal is the default selection; the same state drives the cards,
  // the contextual pricing table and the calculator.
  const [product, setProduct] = useState<string>("allocated");
  const pricingSectionRef = useRef<HTMLElement>(null);

  // Clicking a product card selects that product. The cards are pure
  // selectors — they never navigate away from the page.
  function handleCardSelect(id: string) {
    setProduct(id);
    track("pricing_product_selected", { product: id, source: "card" });
    // Below the lg breakpoint the table sits under the cards, so bring it
    // into view after a selection.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 1023px)").matches
    ) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      pricingSectionRef.current?.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
    }
  }

  const activePricing =
    PRODUCT_PRICING.find((entry) => entry.id === product) ?? PRODUCT_PRICING[0];

  return (
    <div className="min-h-screen bg-background text-forest-black">
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-forest-black focus-visible:px-4 focus-visible:py-2 focus-visible:text-background focus-visible:shadow-lg"
      >
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content" className="site-container">

        <section
          aria-labelledby="pricing-hero-heading"
          className="pricing-page grid grid-cols-1 items-start gap-7 pb-5 pt-6 md:grid-cols-[1.05fr_1fr] md:gap-9 md:pb-5 md:pt-8 lg:gap-14 lg:pb-4 lg:pt-9"
        >
          <div>
            <p className="mb-5 font-sans text-[11px] font-bold uppercase leading-none tracking-[2.4px] text-gold-dark">
              Pricing &amp; Fees
            </p>
            <h1
              id="pricing-hero-heading"
              className="pricing-hero-title mb-5 text-forest-black md:mb-3 lg:mb-3.5"
            >
              Simple pricing.<br className="hidden lg:block" /> Greater confidence.
            </h1>
            <p className="mb-6 max-w-none font-sans text-ui-lg font-normal leading-[1.6] text-muted-ink md:mb-4 md:max-w-[38em] lg:mb-5 lg:text-[15.5px]">
              Know exactly what it costs to buy, store, gift or take delivery of gold. All prices and fees are shown in U.S. dollars (USD), so you can invest with clarity.
            </p>
            <ul className="flex flex-col gap-4 md:flex-row md:items-stretch md:gap-5">
              {HERO_CHIPS.map(({ icon: Icon, title, description }, index) => (
                <Fragment key={title}>
                  {index > 0 && (
                    <span
                      aria-hidden="true"
                      className="hidden w-px self-stretch bg-beige md:block"
                    />
                  )}
                  <li className="flex min-w-0 flex-1 items-start gap-3 lg:max-w-[15em] lg:gap-3.5">
                    <Icon
                      strokeWidth={1.6}
                      aria-hidden="true"
                      focusable="false"
                      className="mt-0.5 size-6 shrink-0 text-forest-black md:size-[26px] lg:size-7"
                    />
                    <span className="flex min-w-0 flex-col gap-1">
                      <strong className="font-sans text-ui-sm font-semibold leading-[1.35] text-forest-black">
                        {title}
                      </strong>
                      <span className="font-sans text-ui-xs font-normal leading-[1.45] text-muted-ink">
                        {description}
                      </span>
                    </span>
                  </li>
                </Fragment>
              ))}
            </ul>
          </div>

          <div className="relative aspect-[4/3] min-h-[200px] w-full overflow-hidden rounded-[6px] md:min-h-[280px]">
            <picture>
              <source
                type="image/webp"
                srcSet={`${heroWebp.url} 1x, ${heroWebp2x.url} 2x`}
              />
              <img
                src={heroImage.url}
                alt="Allocated PAMP Suisse gold bar with a Canada Maple Leaf gold coin on a marble surface"
                width={560}
                height={420}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover object-center"
              />
            </picture>
            <div
              role="text"
              aria-label="Real value for what matters"
              className="absolute right-4 top-4 font-sans text-[10px] font-semibold uppercase leading-[2] tracking-[2px] text-gold-dark md:right-5 md:top-5 md:text-[10.5px] md:tracking-[2.4px] lg:right-6 lg:top-6 lg:tracking-[3px]"
            >
              <span aria-hidden="true" className="mb-2 block h-px w-6 bg-gold-dark" />
              <span aria-hidden="true" className="block">Real</span>
              <span aria-hidden="true" className="block">Value</span>
              <span aria-hidden="true" className="block">For what</span>
              <span aria-hidden="true" className="block">Matters</span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.7fr_1fr] lg:gap-12">
          <div className="min-w-0">
            <section aria-labelledby="choose-heading" className="pricing-page pb-4 pt-3 md:pb-2.5 md:pt-1.5 lg:pb-3 lg:pt-2">
              <h2 id="choose-heading" className="pricing-section-title mb-2.5 text-forest-black">
                Choose what works for you
              </h2>
              <p className="mb-7 font-sans text-[15.5px] font-normal leading-[1.55] text-muted-ink md:mb-5">
                Three ways to own gold. Store it securely or have it delivered to you.
              </p>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
                {PRODUCT_CARDS.map((card) => {
                  const selected = product === card.id;
                  return (
                    <article
                      key={card.title}
                      role="button"
                      tabIndex={0}
                      aria-pressed={selected}
                      aria-label={`${card.title} — show ${card.title.toLowerCase()} pricing`}
                      onClick={() => handleCardSelect(card.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          handleCardSelect(card.id);
                        }
                      }}
                      className={`relative flex min-h-[240px] min-w-0 cursor-pointer flex-col overflow-hidden rounded-[var(--pricing-radius-card)] border p-7 motion-safe:transition-[transform,box-shadow,border-color,background-color] motion-safe:duration-[220ms] motion-safe:ease-standard ${
                        selected
                          ? "border-[var(--pricing-forest-900)] bg-wash-green shadow-[inset_0_0_0_1px_var(--pricing-forest-900)]"
                          : "group/tile border-[var(--pricing-border)] bg-[var(--pricing-paper)] motion-safe:hover:-translate-y-[2px] motion-safe:hover:shadow-[var(--pricing-shadow-hover)]"
                      } ${FOCUS_RING}`}
                    >
                      {selected && (
                        <span
                          aria-hidden="true"
                          className="absolute right-5 top-5 z-10 flex size-6 items-center justify-center rounded-full bg-[var(--pricing-gold)]"
                        >
                          <Check
                            size={13}
                            strokeWidth={3}
                            className="text-[var(--pricing-forest-900)]"
                          />
                        </span>
                      )}

                      <div className="relative min-w-0">
                        <h3 className="pricing-card-title text-forest-black">{card.title}</h3>
                        <p className="mt-1.5 font-sans text-ui-sm font-medium leading-normal text-forest-black">
                          {card.kicker}
                        </p>
                      </div>

                      <p className="relative mb-4 mt-2.5 font-sans text-ui-sm font-normal leading-[1.55] text-muted-ink">
                        {card.description}
                      </p>

                      {selected ? (
                        <span className="relative inline-flex items-center gap-2 self-start font-sans text-ui-sm font-semibold leading-normal text-forest-black">
                          <Check size={14} strokeWidth={3} aria-hidden="true" focusable="false" className="shrink-0 text-[var(--pricing-forest-900)]" />
                          Selected
                        </span>
                      ) : (
                        <span className="group relative inline-flex self-start items-center gap-2 whitespace-nowrap font-sans text-ui-sm font-medium leading-normal text-forest-black no-underline motion-safe:transition-colors motion-safe:ease-standard group-hover/tile:text-gold-dark max-md:whitespace-normal">
                          {card.ctaLabel}
                          <ArrowRight
                            size={14}
                            aria-hidden="true"
                            focusable="false"
                            className="shrink-0 motion-safe:transition-transform motion-safe:ease-standard motion-safe:group-hover/tile:translate-x-[3px]"
                          />
                        </span>
                      )}

                      <div className="relative mt-auto flex justify-end pt-2">
                        <div
                          className={`origin-bottom-right motion-safe:transition-transform motion-safe:duration-[220ms] motion-safe:ease-standard ${
                            selected ? "" : "motion-safe:group-hover/tile:scale-[1.025]"
                          }`}
                        >
                          <ProductImage
                            image={card.image}
                            webp={card.imageWebp}
                            webp2x={card.imageWebp2x}
                            alt={card.imageAlt}
                          />
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <TransactionCostsSection />
            <FeeListSection table={ONGOING_TABLE} idSuffix="ongoing" />
            <FeeListSection table={OPTIONAL_TABLE} idSuffix="optional" />
          </div>

          <div className="min-w-0 lg:self-start">
            <PurchaseCalculator product={product} onProductChange={setProduct} />
          </div>
        </div>

        <TrustBar />
        <FaqSection />
        <BottomCta />
      </main>
      <SiteFooter />
    </div>
  );
}
