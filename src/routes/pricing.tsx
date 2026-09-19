import { useId, useState } from "react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import pricingHeroAsset from "@/assets/pricing/pricing-hero.png.asset.json";
import barThumbnailAsset from "@/assets/pricing/thumb-bar.png.asset.json";
import coinThumbnailAsset from "@/assets/pricing/thumb-coin.png.asset.json";
import vaultThumbnailAsset from "@/assets/pricing/thumb-vault.png.asset.json";
import { Gift, Globe, Shield, User } from "lucide-react";
import { PRICING } from "@/config/pricing";
import { PricingCalculator } from "@/components/pricing-calculator";
import { createFileRoute } from "@tanstack/react-router";

const SITE_ORIGIN = "https://solid-gold-gateway.lovable.app";
const PRICING_URL = `${SITE_ORIGIN}/pricing`;
const OG_IMAGE = `${SITE_ORIGIN}/og/pricing.png`;

const currencyPrefix = PRICING.currency === "USD" ? "US$" : `${PRICING.currency} `;
const deliveryFee = `${(PRICING.delivery.purchaseFeeRate * 100).toFixed(0)}%`;
const vaultPurchaseFee = `${(PRICING.vault.purchaseFeeRate * 100).toFixed(2)}%`;
const vaultStorageFee = `${(PRICING.vault.storageRatePerYear * 100).toFixed(2)}%`;
const freeStorageMonths = Math.round((PRICING.vault.freeStorageDays / 365) * 12);
const storageMinimumLabel = `${currencyPrefix}${PRICING.vault.storageMinimumPerYearUsd.toFixed(2)}`;
const breakEvenUsd = Math.round(
  PRICING.vault.storageMinimumPerYearUsd / PRICING.vault.storageRatePerYear,
);

const sharedComparisonRows = [
  {
    label: "Purchase price",
    value: "Weight × live spot price, plus a product premium — shown before you confirm.",
  },
  {
    label: "Selling",
    value: "Your sale price is shown in full before you confirm.",
  },
] as const;

const otherFeeItems = [
  { label: "Account fee", value: PRICING.otherFees.account },
  { label: "Monthly fee", value: PRICING.otherFees.monthly },
  { label: "Inactivity fee", value: PRICING.otherFees.inactivity },
  { label: "Closing fee", value: PRICING.otherFees.closing },
] as const;

const trustItems = [
  {
    icon: Shield,
    title: "Insured, segregated storage",
    text: "Held in U.S. vaults at IDS or Vaultify PMC",
  },
  {
    icon: Globe,
    title: "Globally recognised products",
    text: "Coins and bars from trusted mints",
  },
  {
    icon: User,
    title: "Allocated to you",
    text: "Your metal is recorded in your name",
  },
  {
    icon: Gift,
    title: "Optional gifting service",
    text: "Engraving and premium packaging for delivery to friends or family",
  },
] as const;

type FaqItem = {
  readonly question: string;
  readonly answer: string;
};

const faqItems: readonly FaqItem[] = [
  {
    question: "What fees do I pay?",
    answer: `It depends on what you buy. Coins and bars: no purchase fee and no storage fee — just the product price and insured shipping. Allocated metal: a ${vaultPurchaseFee} one-off purchase fee, then storage and insurance free for your first ${freeStorageMonths} months and ${vaultStorageFee} of value per year after that, charged pro-rata for the exact days you hold.`,
  },
  {
    question: "How is the purchase price calculated?",
    answer:
      "Weight multiplied by the live spot price at the moment your order is placed, plus a product premium that reflects minting, refining and handling. The premium varies by product and is always shown before you confirm.",
  },
  {
    question: 'What does "allocated metal" mean?',
    answer:
      "When your purchase completes, a specific quantity of metal is allocated to you and recorded in your name in our ledger, which is reconciled to the depository. It is your property, held in custody for you — not a claim on the company, and never lent, pledged or used as collateral.",
  },
  {
    question: "How are storage fees charged?",
    answer: `Storage and insurance are free for your first ${freeStorageMonths} months. After that they are charged pro-rata, for the exact number of days you hold — not a flat annual charge — at ${vaultStorageFee} of value per year, with insurance included. There is no separate insurance charge.`,
  },
  {
    question: "What is the minimum storage fee?",
    answer: `${storageMinimumLabel} per year, applied only after your first ${freeStorageMonths} months and only if the calculated pro-rata fee is lower. On balances above roughly ${currencyPrefix}${breakEvenUsd} the ${vaultStorageFee} rate exceeds the minimum, so the minimum no longer applies.`,
  },
  {
    question: "Can I take physical delivery?",
    answer:
      "Yes. You can convert your allocated metal into a coin or bar and have it shipped, insured, at any time. Delivery cost depends on location and weight and is shown before you confirm.",
  },
  {
    question: "Can I gift gold?",
    answer:
      "Yes. Coins and bars can be shipped directly to a recipient with optional engraving and premium gift packaging, shown at checkout. Allocated metal can be transferred as a gift on request.",
  },
  {
    question: "Are there any other fees?",
    answer:
      "No. There is no account fee, no monthly subscription, no inactivity fee and no fee to close your account. The costs on this page are the complete list.",
  },
];

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
  }),
  component: PricingPage,
});

function PricingPage() {
  const heroFigures = [
    {
      value: `${(PRICING.delivery.purchaseFeeRate * 100).toFixed(0)}%`,
      caption: "purchase fee on coins and bars",
    },
    {
      value: `${(PRICING.vault.purchaseFeeRate * 100).toFixed(2)}%`,
      caption: "one-off purchase fee on allocated metal",
    },
    {
      value: `${(PRICING.vault.storageRatePerYear * 100).toFixed(2)}%`,
      caption: "a year to store allocated metal — year one free",
    },
  ];

  const deliveryRows = [
    { label: "Minimum", value: "One coin or bar" },
    { label: "Purchase fee", value: deliveryFee, numeric: true },
    { label: "Storage & insurance", value: "None — the gold is with you" },
    { label: "Delivery", value: "Insured shipping, shown at checkout" },
    { label: "Gifting", value: "Engraving and gift packaging" },
  ] as const;

  const vaultRows = [
    {
      label: "Minimum",
      value: `From ${currencyPrefix}${PRICING.vault.minimumPurchaseUsd}`,
    },
    { label: "Purchase fee", value: vaultPurchaseFee, caption: "one-off", numeric: true },
    {
      label: "Storage & insurance",
      value: `Free for ${freeStorageMonths} months, then ${vaultStorageFee} a year (min. ${currencyPrefix}${PRICING.vault.storageMinimumPerYearUsd})`,
    },
    { label: "Delivery", value: "Convert to a coin or bar and ship any time" },
    { label: "Gifting", value: "Transfer as a gift on request" },
  ] as const;

  return (
    <div className="min-h-screen bg-cream text-ink">
      <SiteHeader />
      <main className="bg-cream">
        <section id="pricing-hero" className="pricing-v2-hero">
          <img
            src={pricingHeroAsset.url}
            alt=""
            className="pricing-v2-hero-image"
            fetchPriority="high"
            loading="eager"
          />
          <div className="pricing-v2-hero-scrim" aria-hidden="true" />
          <div className="pricing-v2-hero-inner">
            <div className="pricing-v2-hero-copy">
              <p className="pricing-v2-hero-eyebrow">Pricing &amp; fees</p>
              <h1 className="pricing-v2-hero-title">
                <span>Every fee, shown</span>
                <em>before you confirm.</em>
              </h1>
              <p className="pricing-v2-hero-description">
                What it costs to buy, store, gift or take delivery of gold — in U.S. dollars,
                with nothing added after checkout.
              </p>
            </div>

            <dl className="pricing-v2-hero-figures">
              {heroFigures.map((figure) => (
                <div className="pricing-v2-hero-figure" key={figure.caption}>
                  <dt className="pricing-v2-hero-number">{figure.value}</dt>
                  <dd className="pricing-v2-hero-caption">{figure.caption}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="pricing-compare" className="pricing-v2-compare">
          <div className="pricing-v2-compare-inner">
            <div className="pricing-v2-compare-heading">
              <div>
                <p className="pricing-v2-compare-eyebrow">Compare</p>
                <h2>Two ways to own. One clear list of costs.</h2>
              </div>
              <p className="pricing-v2-compare-currency">All prices in {PRICING.currency}</p>
            </div>

            <div className="pricing-v2-compare-grid">
              <div className="pricing-v2-table-column">
                <div className="pricing-v2-table-wrap">
                  <table className="pricing-v2-table">
                    <caption className="sr-only">Costs for each way to own gold</caption>
                    <colgroup>
                      <col className="pricing-v2-table-label-col" />
                      <col className="pricing-v2-table-value-col" />
                      <col className="pricing-v2-table-value-col" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th scope="col" aria-label="Cost" />
                        <th scope="col">
                          <div className="pricing-v2-table-thumbnails">
                            <img src={coinThumbnailAsset.url} alt="" />
                            <img src={barThumbnailAsset.url} alt="" />
                          </div>
                          <span className="pricing-v2-table-title">Take delivery</span>
                          <span className="pricing-v2-table-subtitle">
                            Coins or bars, shipped to you insured.
                          </span>
                        </th>
                        <th scope="col">
                          <div className="pricing-v2-table-thumbnails">
                            <img src={vaultThumbnailAsset.url} alt="" />
                          </div>
                          <span className="pricing-v2-table-title">Store in the vault</span>
                          <span className="pricing-v2-table-subtitle">
                            Allocated metal, recorded in your name.
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">Minimum</th>
                        <td>One coin or bar</td>
                        <td>From {currencyPrefix}{PRICING.vault.minimumPurchaseUsd}</td>
                      </tr>
                      <tr>
                        <th scope="row">{sharedComparisonRows[0].label}</th>
                        <td colSpan={2}>{sharedComparisonRows[0].value}</td>
                      </tr>
                      <tr>
                        <th scope="row">Purchase fee</th>
                        <td><span className="pricing-v2-table-number">{deliveryFee}</span></td>
                        <td>
                          <span className="pricing-v2-table-number">{vaultPurchaseFee}</span>
                          <span className="pricing-v2-table-note">one-off</span>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">Storage &amp; insurance</th>
                        <td>None — the gold is with you</td>
                        <td>
                          Free for {freeStorageMonths} months, then {vaultStorageFee} a year
                          (min. {currencyPrefix}{PRICING.vault.storageMinimumPerYearUsd})
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">Delivery</th>
                        <td>Insured shipping, shown at checkout</td>
                        <td>Convert to a coin or bar and ship any time</td>
                      </tr>
                      <tr>
                        <th scope="row">{sharedComparisonRows[1].label}</th>
                        <td colSpan={2}>{sharedComparisonRows[1].value}</td>
                      </tr>
                      <tr>
                        <th scope="row">Gifting</th>
                        <td>Engraving and gift packaging</td>
                        <td>Transfer as a gift on request</td>
                      </tr>
                      <tr className="pricing-v2-table-final-row">
                        <th scope="row">Nothing else</th>
                        <td colSpan={2}>
                          <div className="pricing-v2-other-fees">
                            {otherFeeItems.map((fee) => (
                              <div key={fee.label}>
                                <span>{currencyPrefix}{fee.value}</span>
                                <small>{fee.label}</small>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="pricing-v2-mobile-comparison">
                  <div className="pricing-v2-mobile-shared">
                    {sharedComparisonRows.map((row) => (
                      <div key={row.label}>
                        <h3>{row.label}</h3>
                        <p>{row.value}</p>
                      </div>
                    ))}
                  </div>

                  <ComparisonCard
                    description="Coins or bars, shipped to you insured."
                    images={[coinThumbnailAsset.url, barThumbnailAsset.url]}
                    rows={deliveryRows}
                    title="Take delivery"
                  />
                  <ComparisonCard
                    description="Allocated metal, recorded in your name."
                    images={[vaultThumbnailAsset.url]}
                    rows={vaultRows}
                    title="Store in the vault"
                  />

                  <div className="pricing-v2-mobile-other">
                    <h3>Nothing else</h3>
                    <div className="pricing-v2-other-fees">
                      {otherFeeItems.map((fee) => (
                        <div key={fee.label}>
                          <span>{currencyPrefix}{fee.value}</span>
                          <small>{fee.label}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="pricing-v2-calculator-column">
                <PricingCalculator />
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-[1248px] px-6 min-[1440px]:max-w-[1440px] min-[1440px]:px-[120px]">
          <section id="pricing-trust" className="pricing-v2-trust">
            <h2 className="sr-only">Why customers trust SQOOT Pure</h2>
            <ul className="pricing-v2-trust-list">
              {trustItems.map((item) => (
                <li className="pricing-v2-trust-item" key={item.title}>
                  <item.icon aria-hidden="true" strokeWidth={1.5} size={28} />
                  <h3 className="pricing-v2-trust-title">{item.title}</h3>
                  <p className="pricing-v2-trust-text">{item.text}</p>
                </li>
              ))}
            </ul>
          </section>
          <section id="pricing-faq" />
          <section id="pricing-cta" />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

type ComparisonRow = {
  readonly label: string;
  readonly value: string;
  readonly caption?: string;
  readonly numeric?: boolean;
};

function ComparisonCard({
  description,
  images,
  rows,
  title,
}: {
  description: string;
  images: readonly string[];
  rows: readonly ComparisonRow[];
  title: string;
}) {
  return (
    <article className="pricing-v2-mobile-card">
      <div className="pricing-v2-mobile-card-head">
        <div className="pricing-v2-table-thumbnails">
          {images.map((image) => <img src={image} alt="" key={image} />)}
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <dl>
        {rows.map((row) => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd>
              <span className={row.numeric ? "pricing-v2-table-number" : undefined}>
                {row.value}
              </span>
              {row.caption ? <span className="pricing-v2-table-note">{row.caption}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
