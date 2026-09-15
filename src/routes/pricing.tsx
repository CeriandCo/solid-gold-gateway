import heroImage from "@/assets/pricing/hero-vault.png.asset.json";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { HERO_CHIPS, PRODUCT_CARDS, type ImageSource } from "@/lib/pricing/data";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

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

function ProductImage({ image, alt }: { image: ImageSource; alt: string }) {
  const [failed, setFailed] = useState(!image.url);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="aspect-square w-full bg-beige"
      />
    );
  }

  return (
    <img
      src={image.url}
      alt={alt}
      className="h-auto max-h-[150px] w-full object-contain object-center"
      onError={() => setFailed(true)}
    />
  );
}

function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-forest-black">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1180px] px-5 md:px-8 lg:px-10">
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
            <ul className="flex flex-col gap-[18px] md:flex-row md:gap-6 lg:gap-10">
              {HERO_CHIPS.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex max-w-none flex-1 items-start gap-3 lg:max-w-[15em]">
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

        <section aria-labelledby="choose-heading" className="pb-0 pt-10">
          <h2 id="choose-heading" className="text-display-h2 mb-2.5 text-forest-black">
            Choose what works for you
          </h2>
          <p className="mb-7 font-sans text-[15.5px] font-normal leading-[1.55] text-muted-ink">
            Three ways to own gold and silver. Store it securely or have it delivered to you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3">
            {PRODUCT_CARDS.map((card, index) => (
              <article
                key={card.title}
                className="grid min-w-0 grid-cols-[1fr_auto] items-start gap-4 border-beige px-0 pb-7 pt-6 first:pt-6 max-md:not-first:border-t md:border-l md:px-[22px] md:pb-7 md:pt-6 md:first:border-l-0 md:first:pl-0 md:last:pr-0 lg:px-8 lg:pb-8 lg:pt-7"
              >
                <div className="flex h-full min-w-0 flex-col">
                  <h3 className="text-display-h4 mb-1.5 text-[26px] text-forest-black lg:text-[30px]">
                    {card.title}
                  </h3>
                  <p className="mb-2.5 font-sans text-[13.5px] font-medium leading-normal text-forest-black lg:text-sm">
                    {card.kicker}
                  </p>
                  <p className="mb-6 max-w-[18em] font-sans text-[13.5px] font-normal leading-[1.5] text-muted-ink md:text-[13px] lg:text-[13.5px]">
                    {card.description}
                  </p>
                  <a
                    href={card.ctaHref}
                    className="group mt-auto inline-flex self-start items-center gap-2 rounded-[3px] font-sans text-[13.5px] font-medium leading-normal text-forest-black no-underline motion-safe:transition-colors motion-safe:ease-standard hover:text-gold-dark focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-gold"
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
                <div className="w-24 shrink-0 md:w-28 lg:w-[140px]">
                  <ProductImage image={card.image} alt={card.imageAlt} />
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}