import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import pricingHeroAsset from "@/assets/pricing/pricing-hero.png.asset.json";
import { PRICING } from "@/config/pricing";
import { createFileRoute } from "@tanstack/react-router";

const SITE_ORIGIN = "https://solid-gold-gateway.lovable.app";
const PRICING_URL = `${SITE_ORIGIN}/pricing`;
const OG_IMAGE = `${SITE_ORIGIN}/og/pricing.png`;

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

        <div className="mx-auto w-full max-w-[1248px] px-6 min-[1440px]:max-w-[1440px] min-[1440px]:px-[120px]">
          <section id="pricing-compare" />
          <section id="pricing-trust" />
          <section id="pricing-faq" />
          <section id="pricing-cta" />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
