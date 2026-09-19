import { SiteFooter, SiteHeader } from "@/components/site-chrome";
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
  return (
    <div className="min-h-screen bg-cream text-ink">
      <SiteHeader />
      <main className="bg-cream">
        <div className="mx-auto w-full max-w-[1440px] px-6 min-[1440px]:px-[120px]">
          <section id="pricing-hero" />
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
