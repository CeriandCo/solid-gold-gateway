import { Fragment, useEffect, useId, useRef, useState } from "react";
import heroImage from "@/assets/pricing/hero-vault.png.asset.json";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import {
  HERO_CHIPS,
  PRODUCT_CARDS,
  PURCHASE_PRICE_TOOLTIP,
  STORAGE_TABLE,
  TRANSACTION_COSTS_TABLE,
  type RowCell,
  type SpanCell,
  type TransactionRow,
} from "@/lib/pricing/data";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Info } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Gold & Silver Pricing and Fees | SQOOT Pure" },
      {
        name: "description",
        content:
          "See transparent pricing for allocated gold and silver, coins, bars, secure storage, and delivery.",
      },
      { property: "og:title", content: "Gold & Silver Pricing and Fees | SQOOT Pure" },
      {
        property: "og:description",
        content: "Clear, upfront costs and flexible ways to own gold and silver.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-gold rounded-[3px]";

function ProductImage({ image, alt }: { image: string; alt: string }) {
  return (
    <img
      src={image}
      alt={alt}
      className="h-auto max-h-[110px] w-full object-contain object-center"
    />
  );
}

function InfoTooltip({ label, text }: { label: string; text: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label={label}
        aria-describedby={open ? id : undefined}
        className={`inline-flex items-center text-muted-ink ${FOCUS_RING}`}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
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
          className="absolute left-1/2 top-full z-20 mt-2 w-[240px] -translate-x-1/2 rounded-[6px] border border-beige bg-paper p-3 text-left font-sans text-[12px] font-normal leading-[1.5] text-muted-ink"
        >
          {text}
        </span>
      )}
    </span>
  );
}

function RowLabel({ label, hint }: { label: string; hint?: string | undefined }) {
  return (
    <>
      {label}
      {hint ? (
        <span className="font-sans text-[12.5px] font-normal text-muted-ink"> {hint}</span>
      ) : null}
    </>
  );
}

function CellValue({ cell }: { cell: RowCell }) {
  if (cell.kind === "dash") {
    return <span className="text-muted-ink">—</span>;
  }
  return (
    <span className="block">
      <span className="block font-sans text-[13.5px] font-bold text-forest-black">
        {cell.value}
      </span>
      {cell.suffix ? (
        <span className="mt-1 block font-sans text-[12.5px] font-normal text-muted-ink">
          {cell.suffix}
        </span>
      ) : null}
    </span>
  );
}

function isSpanCell(cells: TransactionRow["cells"]): cells is SpanCell {
  return !Array.isArray(cells);
}

function SpanCellContent({ cell }: { cell: SpanCell }) {
  return (
    <span className="inline-flex items-center justify-center gap-2 text-muted-ink">
      <span>{cell.value}</span>
      {cell.info ? (
        <InfoTooltip
          label="More information about purchase price"
          text={PURCHASE_PRICE_TOOLTIP}
        />
      ) : null}
    </span>
  );
}

function TransactionCostsSection() {
  const table = TRANSACTION_COSTS_TABLE;
  return (
    <section aria-labelledby="transaction-costs-heading" className="pb-0 pt-12">
      <h2
        id="transaction-costs-heading"
        className="text-display-h4 mb-1.5 text-forest-black"
      >
        {table.title}
      </h2>
      <p className="mb-5 font-sans text-[14.5px] font-normal leading-[1.55] text-muted-ink">
        {table.subtitle}
      </p>

      {/* Stacked view on narrow screens */}
      <dl className="border-t border-beige sm:hidden">
        {table.rows.map((row) => (
          <div key={row.label} className="border-b border-beige py-3.5">
            <dt className="font-sans text-[13.5px] font-medium text-forest-black">
              <RowLabel label={row.label} hint={row.hint} />
            </dt>
            <dd className="mt-2 font-sans text-[13px] font-normal text-muted-ink">
              {isSpanCell(row.cells) ? (
                <SpanCellContent cell={row.cells} />
              ) : (
                <span className="grid grid-cols-3 gap-2 text-center">
                  {row.cells.map((cell, index) => (
                    <span key={table.columns[index + 1]} className="block">
                      <span className="mb-1 block font-sans text-[11.5px] font-semibold text-charcoal">
                        {table.columns[index + 1]}
                      </span>
                      <CellValue cell={cell} />
                    </span>
                  ))}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>

      <table
        aria-labelledby="transaction-costs-heading"
        className="hidden w-full border-collapse border-y border-beige font-sans text-[13.5px] font-normal sm:table"
      >
        <thead>
          <tr className="bg-wash-green">
            {table.columns.map((column, index) => (
              <th
                key={column}
                scope="col"
                className={`border-b border-beige px-3.5 py-3 font-sans text-[12.5px] font-semibold tracking-[0.4px] text-charcoal md:px-4 ${
                  index === 0 ? "text-left" : "text-center"
                }`}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr
              key={row.label}
              className={rowIndex < table.rows.length - 1 ? "border-b border-beige" : ""}
            >
              <th
                scope="row"
                className="px-3.5 py-3.5 text-left align-top font-sans text-[13.5px] font-medium text-forest-black md:px-4"
              >
                <RowLabel label={row.label} hint={row.hint} />
              </th>
              {isSpanCell(row.cells) ? (
                <td
                  colSpan={3}
                  className="px-3.5 py-3.5 text-center align-top text-muted-ink md:px-4"
                >
                  <SpanCellContent cell={row.cells} />
                </td>
              ) : (
                row.cells.map((cell, index) => (
                  <td
                    key={table.columns[index + 1]}
                    className="px-3.5 py-3.5 text-center align-top md:px-4"
                  >
                    <CellValue cell={cell} />
                  </td>
                ))
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function StorageSection() {
  const table = STORAGE_TABLE;
  return (
    <section aria-labelledby="storage-heading" className="pb-0 pt-12">
      <h2 id="storage-heading" className="text-display-h4 mb-1.5 text-forest-black">
        {table.title}
      </h2>
      <p className="mb-5 font-sans text-[14.5px] font-normal leading-[1.55] text-muted-ink">
        {table.subtitle}
      </p>
      <table
        aria-labelledby="storage-heading"
        className="w-full border-collapse border-y border-beige font-sans text-[13px] font-normal md:text-[13.5px]"
      >
        <thead>
          <tr className="bg-wash-green">
            {table.columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="border-b border-beige px-3 py-3 text-left font-sans text-[12.5px] font-semibold tracking-[0.4px] text-charcoal md:px-4"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr
              key={row.label}
              className={rowIndex < table.rows.length - 1 ? "border-b border-beige" : ""}
            >
              <th
                scope="row"
                className="px-3 py-3 text-left align-top font-sans text-[13px] font-medium text-forest-black md:px-4 md:py-3.5 md:text-[13.5px]"
              >
                <RowLabel label={row.label} hint={row.hint} />
              </th>
              <td className="px-3 py-3 text-left align-top text-muted-ink md:px-4 md:py-3.5">
                {row.highlight ? (
                  <span className="font-bold text-forest-black">{row.highlight} </span>
                ) : null}
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

const SPOT_GOLD = 4310;
const SPOT_SILVER = 63.23;
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
      <legend className="mb-2 flex items-center gap-1.5 font-sans text-[13.5px] font-medium text-forest-black">
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
              className={`flex-1 max-md:min-w-[calc(50%-3px)] cursor-pointer rounded-[4px] border border-beige text-center font-sans font-medium ${
                compact ? "px-1 py-[9px] text-[12.5px]" : "px-0 py-2.5 text-[13.5px]"
              } ${
                selected
                  ? "border-forest-black bg-forest-black text-paper"
                  : "bg-paper text-forest-black"
              } has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[3px] has-[:focus-visible]:outline-gold`}
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

function StepRow({
  index,
  children,
  last,
}: {
  index: number;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={`flex items-start gap-3.5 ${last ? "" : "mb-[22px]"}`}>
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest-black font-sans text-[12px] font-bold text-paper"
      >
        {index}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-2">{children}</div>
    </div>
  );
}

type Estimate = { oz: number; total: number; metal: string };

function PurchaseCalculator() {
  const [amount, setAmount] = useState("500");
  const [metal, setMetal] = useState("gold");
  const [product, setProduct] = useState<string | null>(null);
  const [receive, setReceive] = useState("vault");
  const [hold, setHold] = useState("30d");
  const [gift, setGift] = useState("no");
  const [error, setError] = useState<string | null>(null);
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const amountId = useId();
  const errorId = useId();
  const submitRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (receive !== "vault") setHold("30d");
  }, [receive]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const value = Number(amount);
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
    const spot = metal === "gold" ? SPOT_GOLD : SPOT_SILVER;
    const purchaseFee = product === "allocated" ? value * 0.03 : 0;
    const toMetal = value - purchaseFee;
    const oz = toMetal / (spot * (1 + PREMIUM));
    let storageCost = 0;
    if (receive === "vault") {
      const days = HOLD_DAYS[hold] ?? 30;
      const annual = value * (0.0035 + 0.0045);
      storageCost = Math.max(annual * (days / 365), (25 * days) / 365);
    }
    setEstimate({ oz, total: purchaseFee + storageCost, metal });
  }

  return (
    <section
      aria-labelledby="calculator-heading"
      className="mx-auto w-full max-w-none rounded-[8px] bg-wash-green px-[22px] pb-7 pt-6 md:max-w-[560px] md:px-7 md:pb-8 md:pt-7 lg:max-w-none"
    >
      <p className="mb-2.5 font-sans text-[10.5px] font-bold uppercase leading-none tracking-[2px] text-gold-dark">
        Purchase calculator
      </p>
      <h2 id="calculator-heading" className="text-display-h4 mb-2 text-forest-black">
        See what your money could buy
      </h2>
      <p className="mb-[26px] font-sans text-[13.5px] font-normal leading-[1.5] text-muted-ink">
        Explore your gold or silver options and see the estimated costs, including fees,
        storage and delivery.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <StepRow index={1}>
          <label
            htmlFor={amountId}
            className="font-sans text-[13.5px] font-medium text-forest-black"
          >
            How much do you want to spend? (USD)
          </label>
          <div className="flex items-center gap-1.5 rounded-[4px] border border-beige bg-paper px-3 py-2.5 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[3px] has-[:focus-visible]:outline-gold">
            <span className="font-sans text-[15px] font-medium text-muted-ink">US$</span>
            <input
              id={amountId}
              type="number"
              min={25}
              step={25}
              value={amount}
              aria-describedby={error ? errorId : undefined}
              onChange={(event) => setAmount(event.target.value)}
              className="w-full min-w-0 bg-transparent font-sans text-[15px] font-medium text-forest-black outline-none"
            />
          </div>
          <p className="mt-0.5 font-sans text-[12px] font-normal text-muted-ink">
            Try an amount like US$500 or US$1,000.
          </p>
        </StepRow>

        <StepRow index={2}>
          <SegmentedGroup
            name="metal"
            legend="Choose metal"
            value={metal}
            onChange={setMetal}
            options={[
              { value: "gold", label: "Gold" },
              { value: "silver", label: "Silver" },
            ]}
          />
        </StepRow>

        <StepRow index={3}>
          <SegmentedGroup
            name="product"
            legend="Choose product"
            value={product}
            onChange={setProduct}
            compact
            describedBy={error ? errorId : undefined}
            options={[
              { value: "coins", label: "Coins" },
              { value: "bars", label: "Bars" },
              { value: "allocated", label: "Allocated metal" },
            ]}
          />
        </StepRow>

        <StepRow index={4}>
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

        {receive === "vault" && (
          <div className="motion-safe:transition-all motion-safe:duration-100 motion-safe:ease-standard">
            <StepRow index={5}>
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
        )}

        <StepRow index={6} last>
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

        <button
          ref={submitRef}
          type="submit"
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-[6px] bg-forest-black py-3.5 font-sans text-[14.5px] font-semibold text-paper motion-safe:transition-colors motion-safe:ease-standard hover:bg-forest-black-deep ${FOCUS_RING}`}
        >
          Show my estimate
          <ArrowRight size={16} aria-hidden="true" focusable="false" />
        </button>

        {error && (
          <p
            id={errorId}
            role="alert"
            className="mt-2 font-sans text-[12.5px] font-medium text-error"
          >
            {error}
          </p>
        )}

        <div role="status" aria-live="polite">
          {estimate && (
            <div className="mt-3.5 rounded-[6px] border border-beige bg-paper p-4">
              <p className="text-display-h5 text-[22px] text-forest-black">
                {estimate.oz.toFixed(4)} oz {estimate.metal}
              </p>
              <p className="mt-1.5 font-sans text-[12.5px] font-normal text-muted-ink">
                You&apos;d pay approximately
              </p>
              <p className="font-sans text-[14px] font-semibold text-forest-black">
                ${estimate.total.toFixed(2)} in fees over the period
              </p>
              <button
                type="button"
                onClick={() => setEstimate(null)}
                className={`mt-2 font-sans text-[12px] font-medium text-gold-dark underline motion-safe:transition-colors motion-safe:ease-standard hover:text-gold ${FOCUS_RING}`}
              >
                Recalculate
              </button>
            </div>
          )}
        </div>
      </form>

      <p className="mt-4 font-sans text-[11.5px] font-normal leading-[1.5] text-muted-ink">
        This is an estimate only. Live market prices, product availability and shipping
        costs may affect your total cost.
      </p>
    </section>
  );
}

function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-forest-black">
      <SiteHeader />
      <main className="site-container">
        <section
          aria-labelledby="pricing-hero-heading"
          className="grid grid-cols-1 items-start gap-7 pb-7 pt-8 md:grid-cols-[1.05fr_1fr] md:gap-9 md:pb-8 md:pt-11 lg:gap-14 lg:pb-10 lg:pt-14"
        >
          <div>
            <p className="mb-5 font-sans text-[11px] font-bold uppercase leading-none tracking-[2.4px] text-gold-dark">
              Pricing &amp; Fees
            </p>
            <h1
              id="pricing-hero-heading"
              className="text-display-h1-sm mb-[22px] text-forest-black md:text-display-h1-md lg:text-display-h1"
            >
              Simple pricing.<br className="hidden lg:block" /> Greater confidence.
            </h1>
            <p className="mb-[34px] max-w-none font-sans text-[15px] font-normal leading-[1.6] text-muted-ink md:max-w-[38em] lg:text-[15.5px]">
              Know exactly what it costs to buy, store, gift or take delivery of gold and silver. All prices and fees are shown in U.S. dollars (USD), so you can invest with clarity.
            </p>
            <ul className="flex flex-col gap-[18px] md:flex-row md:items-stretch md:gap-5">
              {HERO_CHIPS.map(({ icon: Icon, title, description }, index) => (
                <Fragment key={title}>
                  {index > 0 && (
                    <span
                      aria-hidden="true"
                      className="hidden w-px self-stretch bg-beige md:block"
                    />
                  )}
                  <li className="flex min-w-0 flex-1 items-start gap-3 lg:max-w-[15em]">
                    <Icon
                      size={22}
                      strokeWidth={1.6}
                      aria-hidden="true"
                      focusable="false"
                      className="mt-0.5 shrink-0 text-forest-black"
                    />
                    <span className="flex min-w-0 flex-col gap-[3px]">
                      <strong className="font-sans text-[13.5px] font-semibold leading-[1.35] text-forest-black">
                        {title}
                      </strong>
                      <span className="font-sans text-[12.5px] font-normal leading-[1.45] text-muted-ink">
                        {description}
                      </span>
                    </span>
                  </li>
                </Fragment>
              ))}
            </ul>
          </div>

          <div className="relative aspect-[4/3] min-h-[260px] w-full overflow-hidden rounded-[6px] md:min-h-[320px]">
            <img
              src={heroImage.url}
              alt="Allocated PAMP Suisse gold bar with a Canada Maple Leaf gold coin and a Walking Liberty silver coin on a marble surface"
              className="h-full w-full object-cover object-center"
            />
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
            <section aria-labelledby="choose-heading" className="pb-0 pt-10">
              <h2 id="choose-heading" className="text-display-h2 mb-2.5 text-forest-black">
                Choose what works for you
              </h2>
              <p className="mb-7 font-sans text-[15.5px] font-normal leading-[1.55] text-muted-ink">
                Three ways to own gold and silver. Store it securely or have it delivered to you.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3">
                {PRODUCT_CARDS.map((card) => (
                  <article
                    key={card.title}
                    className="grid min-w-0 grid-cols-[1fr_auto] items-start gap-4 border-beige px-0 pb-7 pt-6 max-md:not-first:border-t md:border-l md:px-[22px] md:pb-7 md:pt-6 md:first:border-l-0 md:first:pl-0 md:last:pr-0 lg:grid-cols-1 lg:gap-3 lg:px-5 lg:pb-6 lg:pt-5"
                  >
                    <div className="flex h-full min-w-0 flex-col">
                      <h3 className="text-display-h5 mb-1.5 text-[26px] text-forest-black lg:text-[24px]">
                        {card.title}
                      </h3>
                      <p className="mb-2.5 font-sans text-[13.5px] font-medium leading-normal text-forest-black lg:text-sm">
                        {card.kicker}
                      </p>
                      <p className="mb-6 max-w-[16em] font-sans text-[13.5px] font-normal leading-[1.5] text-muted-ink md:text-[13px] lg:text-[13.5px]">
                        {card.description}
                      </p>
                      <a
                        href={card.ctaHref}
                        className={`group mt-auto inline-flex self-start items-center gap-2 font-sans text-[13.5px] font-medium leading-normal text-forest-black no-underline motion-safe:transition-colors motion-safe:ease-standard hover:text-gold-dark ${FOCUS_RING}`}
                      >
                        {card.ctaLabel}
                        <ArrowRight
                          size={14}
                          aria-hidden="true"
                          focusable="false"
                          className="shrink-0 motion-safe:transition-transform motion-safe:ease-standard motion-safe:group-hover:translate-x-[3px]"
                        />
                      </a>
                    </div>
                    <div className="w-24 shrink-0 md:w-28 lg:order-first lg:w-[100px] lg:justify-self-end">
                      <ProductImage image={card.image} alt={card.imageAlt} />
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <TransactionCostsSection />
            <StorageSection />
          </div>

          <div className="min-w-0 lg:sticky lg:top-6 lg:self-start">
            <PurchaseCalculator />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
