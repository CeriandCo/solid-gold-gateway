import { Fragment, useEffect, useId, useRef, useState } from "react";
import heroImage from "@/assets/pricing/hero-vault.png.asset.json";
import heroWebp from "@/assets/pricing/hero-vault.webp.asset.json";
import heroWebp2x from "@/assets/pricing/hero-vault-2x.webp.asset.json";
import { track } from "@/lib/analytics";
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
import { FAQ_ITEMS, TRUST_ITEMS } from "@/lib/pricing/trust-and-faq";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Info, Minus, Plus } from "lucide-react";

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
          "Simple pricing for gold and silver. See fees for coins, bars, and allocated metal, plus a purchase calculator that estimates your total cost.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Pricing & Fees — SQOOT Pure" },
      {
        property: "og:description",
        content:
          "Transparent fees for gold and silver: coins, bars, and allocated metal. Storage, delivery, and gifting costs shown upfront.",
      },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:url", content: PRICING_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Pricing & Fees — SQOOT Pure" },
      {
        name: "twitter:description",
        content:
          "Transparent fees for gold and silver. Storage, delivery, and gifting costs shown upfront.",
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
        className="max-h-[140px] w-auto max-w-full object-contain object-center md:max-h-[120px] md:object-right lg:max-h-[140px]"
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
    if (rect && typeof window !== "undefined" && window.innerWidth < 768) {
      const vw = window.innerWidth;
      const center = rect.left + rect.width / 2;
      const width = Math.min(280, vw - 32);
      const left = Math.min(Math.max(16, center - width / 2), vw - 16 - width);
      const arrowX = Math.min(Math.max(8, center - left - 6), width - 20);
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
          className="pricing-tooltip absolute top-full left-1/2 z-20 mt-1.5 w-max max-w-[min(280px,calc(100vw-32px))] -translate-x-1/2 rounded-[4px] bg-forest-black p-3 text-left font-sans text-[12px] font-normal leading-[1.45] text-white shadow-[0_4px_16px_rgba(0,0,0,0.14)]"
          style={
            mobilePos
              ? ({
                  left: mobilePos.left,
                  width: mobilePos.width,
                  right: "auto",
                  transform: "none",
                  "--tip-arrow-x": `${mobilePos.arrowX}px`,
                } as React.CSSProperties)
              : undefined
          }
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
    <section aria-labelledby="transaction-costs-heading" className="pb-6 pt-4 md:pb-4 md:pt-2.5 lg:pb-5 lg:pt-3">
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
        className="hidden w-full border-collapse border border-beige font-sans text-[13.5px] font-normal sm:table"
      >
        <thead>
          <tr className="bg-wash-green">
            {table.columns.map((column, index) => (
              <th
                key={column}
                scope="col"
                className={`border-b border-beige px-3.5 py-3 font-sans text-[12.5px] font-semibold tracking-[0.4px] text-charcoal md:px-4 ${
                  index === 0 ? "text-left" : "border-l border-beige text-center"
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
                  className="border-l border-beige px-3.5 py-3.5 text-center align-top text-muted-ink md:px-4"
                >
                  <SpanCellContent cell={row.cells} />
                </td>
              ) : (
                row.cells.map((cell, index) => (
                  <td
                    key={table.columns[index + 1]}
                    className="border-l border-beige px-3.5 py-3.5 text-center align-top md:px-4"
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
    <section aria-labelledby="storage-heading" className="pb-6 pt-4 md:pb-4 md:pt-2.5 lg:pb-5 lg:pt-3">
      <h2 id="storage-heading" className="text-display-h4 mb-1.5 text-forest-black">
        {table.title}
      </h2>
      <p className="mb-5 font-sans text-[14.5px] font-normal leading-[1.55] text-muted-ink">
        {table.subtitle}
      </p>
      <table
        aria-labelledby="storage-heading"
        className="w-full border-collapse border border-beige font-sans text-[13px] font-normal md:text-[13.5px]"
      >
        <thead>
          <tr className="bg-wash-green">
            {table.columns.map((column, index) => (
              <th
                key={column}
                scope="col"
                className={`border-b border-beige px-3 py-3 text-left font-sans text-[12.5px] font-semibold tracking-[0.4px] text-charcoal md:px-4 ${
                  index === 0 ? "" : "border-l border-beige"
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
                className="px-3 py-3 text-left align-top font-sans text-[13px] font-medium text-forest-black md:px-4 md:py-3.5 md:text-[13.5px]"
              >
                <RowLabel label={row.label} hint={row.hint} />
              </th>
              <td className="border-l border-beige px-3 py-3 text-left align-top text-muted-ink md:px-4 md:py-3.5">
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

const AMOUNT_PRESETS = [100, 500, 1000, 5000];
const AMOUNT_MAX = 1_000_000;

function PurchaseCalculator() {
  const [amount, setAmount] = useState<number | null>(500);
  const [amountFocused, setAmountFocused] = useState(false);
  const [capHint, setCapHint] = useState(false);
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
          <div className="flex items-center gap-1.5 rounded-[4px] border border-beige bg-paper px-3 py-2.5 motion-safe:transition-[border-color,box-shadow] motion-safe:duration-[120ms] motion-safe:ease-standard focus-within:border-gold-dark has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[3px] has-[:focus-visible]:outline-gold">
            <span className="font-sans text-[15px] font-medium text-muted-ink">US$</span>
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
              className="w-full min-w-0 bg-transparent font-sans text-[15px] font-medium text-forest-black outline-none"
            />
          </div>
          <p className="mt-0.5 font-sans text-[12px] font-normal text-muted-ink">
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
                className={`rounded-[4px] border px-2.5 py-1 font-sans text-[12px] font-medium motion-safe:transition-colors motion-safe:duration-[120ms] motion-safe:ease-standard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold hover:border-gold-dark ${
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
            <p className="mt-1.5 font-sans text-[12px] font-normal text-muted-ink">
              Amounts above US$1,000,000 — please contact us for private-client pricing.
            </p>
          )}
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

        <div
          inert={receive !== "vault" ? true : undefined}
          className={`grid motion-safe:transition-[grid-template-rows,opacity] motion-safe:duration-200 motion-safe:ease-standard ${
            receive === "vault" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
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
        </div>

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
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-[6px] bg-forest-black py-3.5 font-sans text-[14.5px] font-semibold text-paper motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-standard hover:bg-forest-black-deep ${FOCUS_RING}`}
        >
          Show my estimate
          <ArrowRight size={16} aria-hidden="true" focusable="false" />
        </button>

        {error && (
          <p
            id={errorId}
            role="alert"
            className="estimate-fade mt-2 font-sans text-[12.5px] font-medium text-error"
          >
            {error}
          </p>
        )}

        <div role="status" aria-live="polite">
          {estimate && (
            <div className="estimate-enter mt-3.5 rounded-[6px] border border-beige bg-paper p-4">
              <p className="text-display-h5 text-[22px] text-forest-black">
                {OZ.format(estimate.oz)} oz {estimate.metal}
              </p>
              <p className="mt-1.5 font-sans text-[12.5px] font-normal text-muted-ink">
                You&apos;d pay approximately
              </p>
              <p className="font-sans text-[14px] font-semibold text-forest-black">
                {USD.format(estimate.total)} in fees over the period
              </p>
              <button
                type="button"
                onClick={() => {
                  setEstimate(null);
                  amountRef.current?.focus();
                }}
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

function TrustBar() {
  return (
    <section
      aria-labelledby="trust-heading"
      className="mt-6 border-y border-beige py-7 md:mt-7 md:py-10 lg:mt-10"
    >
      <h2 id="trust-heading" className="sr-only">
        Why customers trust us
      </h2>
      <ul className="grid grid-cols-1 items-start gap-y-[22px] md:grid-cols-4 md:gap-7 lg:gap-12">
        {TRUST_ITEMS.map(({ icon: Icon, title, description }) => (
          <li key={title} className="flex min-w-0 items-start gap-3.5 lg:gap-4">
            <Icon
              strokeWidth={1.6}
              aria-hidden="true"
              focusable="false"
              className="mt-0.5 size-[26px] shrink-0 text-forest-black md:size-7 lg:size-8"
            />
            <span className="flex min-w-0 flex-col gap-1">
              <strong className="font-sans text-[13px] font-semibold leading-[1.35] text-forest-black lg:text-[13.5px]">
                {title}
              </strong>
              <span className="font-sans text-[12px] font-normal leading-[1.45] text-muted-ink lg:text-[12.5px]">
                {description}
              </span>
            </span>
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
        className={`flex cursor-pointer list-none items-center justify-between gap-4 py-4 md:py-4 lg:py-[18px] [&::-webkit-details-marker]:hidden ${FOCUS_RING}`}
      >
        <span className="font-sans text-[14px] font-medium leading-[1.4] text-forest-black lg:text-[14.5px]">
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
          <p className="max-w-none pb-5 pr-6 font-sans text-[13.8px] font-normal leading-[1.6] text-muted-ink md:max-w-[36em] md:pr-7 lg:max-w-[40em] lg:pr-9">
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
      className="pb-10 pt-5 md:pb-11 md:pt-5 lg:pb-14 lg:pt-6"
    >
      <h2
        id="faq-heading"
        className="text-display-h4 mb-8 text-forest-black md:text-[34px] md:leading-[1.08] lg:text-display-h2"
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
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-8 lg:gap-x-14">
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
      className="pb-12 pt-9 md:pb-14 md:pt-11 lg:pb-[72px] lg:pt-14"
    >
      <div className="mx-auto max-w-[36em] text-center">
        <h2
          id="cta-heading"
          className="text-display-h4 mb-3 text-forest-black md:text-[34px] md:leading-[1.08] lg:text-display-h2"
        >
          Ready to start?
        </h2>
        <p className="mx-auto mb-7 max-w-none font-sans text-[15px] font-normal leading-[1.55] text-muted-ink md:max-w-[30em] lg:text-base">
          Own your first fraction of gold or silver in minutes — from US$25, no minimum, no
          monthly subscription.
        </p>
        <Link
          to="/early-access"
          onClick={() => track("bottom_cta_click", { target: "get_started" })}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-forest-black px-6 py-3.5 font-sans text-[15px] font-semibold text-background no-underline motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-standard hover:bg-forest-black-deep md:w-auto md:px-6 md:py-3.5 lg:px-7 lg:py-4 ${FOCUS_RING}`}
        >
          Get started
          <ArrowRight size={18} aria-hidden="true" focusable="false" className="shrink-0" />
        </Link>
        <div className="mt-4">
          <Link
            to="/precious-metal"
            onClick={() => track("bottom_cta_click", { target: "explore_products" })}
            className={`inline-block border-b-[1.5px] border-gold-dark pb-[3px] font-sans text-[13.5px] font-medium text-forest-black no-underline motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-standard hover:text-gold-dark ${FOCUS_RING}`}
          >
            Or explore products first →
          </Link>
        </div>
      </div>
    </section>
  );
}

function PricingPage() {
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
          className="grid grid-cols-1 items-start gap-7 pb-6 pt-8 md:grid-cols-[1.05fr_1fr] md:gap-9 md:pb-4 md:pt-11 lg:gap-14 lg:pb-5 lg:pt-14"
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
                  <li className="flex min-w-0 flex-1 items-start gap-3 lg:max-w-[15em] lg:gap-3.5">
                    <Icon
                      strokeWidth={1.6}
                      aria-hidden="true"
                      focusable="false"
                      className="mt-0.5 size-6 shrink-0 text-forest-black md:size-[26px] lg:size-7"
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
            <picture>
              <source
                type="image/webp"
                srcSet={`${heroWebp.url} 1x, ${heroWebp2x.url} 2x`}
              />
              <img
                src={heroImage.url}
                alt="Allocated PAMP Suisse gold bar with a Canada Maple Leaf gold coin and a Walking Liberty silver coin on a marble surface"
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
            <section aria-labelledby="choose-heading" className="pb-6 pt-3 md:pb-4 md:pt-1.5 lg:pb-5 lg:pt-2">
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
                    className="flex min-w-0 flex-col border-beige px-0 pb-6 pt-6 max-md:not-first:border-t md:border-l md:px-5 md:pb-7 md:pt-7 md:first:border-l-0 md:first:pl-0 md:last:pr-0 lg:px-6 lg:pb-7 lg:pt-8"
                  >
                    <div className="min-w-0">
                      <h3 className="text-display-h5 md:text-display-h5-md md:whitespace-nowrap lg:text-display-h5-lg text-forest-black">
                        {card.title}
                      </h3>
                      <p className="mb-2 font-sans text-[13.5px] font-medium leading-normal text-forest-black md:whitespace-nowrap lg:text-sm">
                        {card.kicker}
                      </p>
                    </div>

                    <div className="mb-2 grid min-w-0 grid-cols-1 items-center gap-3 md:grid-cols-[1fr_46%] md:gap-4">
                      <p className="font-sans text-[13.5px] font-normal leading-[1.55] text-muted-ink">
                        {card.description}
                      </p>
                      <div className="flex items-center justify-center md:justify-end">
                        <ProductImage
                          image={card.image}
                          webp={card.imageWebp}
                          webp2x={card.imageWebp2x}
                          alt={card.imageAlt}
                        />
                      </div>
                    </div>

                    <a
                      href={card.ctaHref}
                      onClick={() => track("pricing_cta_click", { product: card.id })}
                      className={`group inline-flex self-start items-center gap-2 whitespace-nowrap font-sans text-[13.5px] font-medium leading-normal text-forest-black no-underline motion-safe:transition-colors motion-safe:ease-standard hover:text-gold-dark max-md:whitespace-normal ${FOCUS_RING}`}
                    >
                      {card.ctaLabel}
                      <ArrowRight
                        size={14}
                        aria-hidden="true"
                        focusable="false"
                        className="shrink-0 motion-safe:transition-transform motion-safe:ease-standard motion-safe:group-hover:translate-x-[3px]"
                      />
                    </a>
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

        <TrustBar />
        <FaqSection />
        <BottomCta />
      </main>
      <SiteFooter />
    </div>
  );
}
