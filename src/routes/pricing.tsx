import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import heroImage from "@/assets/pricing/hero-vault.png.asset.json";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Lock,
  Shield,
  Sprout,
  type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Gold & Silver Pricing and Fees | SQOOT Pure" },
      {
        name: "description",
        content:
          "See transparent pricing for vaulted fractional gold and silver, coins, bars, insured storage, and delivery.",
      },
      { property: "og:title", content: "Gold & Silver Pricing and Fees | SQOOT Pure" },
      {
        property: "og:description",
        content: "Clear, upfront costs for owning gold and silver in the vault or in your hands.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

type HeroChip = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type PathCard = {
  kicker: string;
  title: string;
  subtitle: string;
  freeNote: { bold: string; rest: string };
  freeNoteTone: "gold" | "green";
  bullets: { label: string; value: string }[];
  ctaLabel: string;
  ctaHref: string;
  footnote: string;
  isLead: boolean;
};

const HERO_CHIPS: HeroChip[] = [
  { icon: Shield, title: "Transparent costs", description: "Every fee shown upfront" },
  { icon: Lock, title: "Insured storage", description: "Segregated U.S. depository" },
  { icon: Sprout, title: "Start from $25", description: "Own a fraction, not a whole coin" },
];

const PATH_CARDS: PathCard[] = [
  {
    kicker: "Own it in the vault",
    title: "Fractional gold & silver from $25",
    subtitle:
      "Buy any dollar amount. Your metal is allocated to you, held in an insured, segregated U.S. depository, and never lent or pledged. Sell or take delivery whenever you choose.",
    freeNote: {
      bold: "Storage is free for your first 12 months.",
      rest: "No storage fee, no minimum — for a full year from your first purchase.",
    },
    freeNoteTone: "gold",
    bullets: [
      { label: "Purchase price", value: "live spot price × weight, plus product premium" },
      { label: "One-off purchase fee", value: "3.00% of the amount you spend" },
      {
        label: "Storage & insurance",
        value: "0.45% per year after year one, charged pro-rata for the exact days you hold. $3 per year minimum",
      },
      { label: "Take delivery any time", value: "convert to a coin or bar and have it shipped, insured" },
    ],
    ctaLabel: "Start from $25",
    ctaHref: "/products?category=fractional",
    footnote: "No minimum balance. No monthly subscription. You can stop, start or sell at any time.",
    isLead: true,
  },
  {
    kicker: "Have it delivered",
    title: "Buy a coin or bar",
    subtitle:
      "Whole coins and bars from trusted mints, in a range of weights and sizes. Shipped insured to your door — yours to hold, store or gift.",
    freeNote: {
      bold: "No storage fee, ever.",
      rest: "Once it ships, there is nothing further to pay us.",
    },
    freeNoteTone: "green",
    bullets: [
      { label: "Purchase price", value: "live spot price × weight, plus product premium" },
      { label: "Purchase fee", value: "None" },
      { label: "Storage", value: "None — it lives with you" },
      { label: "Insured delivery", value: "cost varies by location and weight, shown before you pay" },
      { label: "Gift options", value: "engraving and premium packaging available at checkout" },
    ],
    ctaLabel: "Browse coins & bars",
    ctaHref: "/products?category=coins-bars",
    footnote:
      "Prefer to start smaller? Fractional lets you own gold for $25 instead of the price of a whole ounce.",
    isLead: false,
  },
];

function PathLeadBadge() {
  return (
    <span className="absolute -top-2.5 left-5 rounded-sm bg-forest-black px-[11px] py-[5px] font-sans text-[10px] font-bold uppercase leading-none tracking-[1.6px] text-gold md:-top-[11px] md:left-6 lg:-top-3 lg:left-7 lg:px-[13px] lg:py-1.5 lg:text-[10.5px]">
      Start here
    </span>
  );
}

function BulletValue({ value }: { value: string }) {
  if (value === "None") {
    return <strong className="font-sans font-bold text-gold-dark">None</strong>;
  }

  if (value.startsWith("None ")) {
    return (
      <>
        <strong className="font-sans font-bold text-gold-dark">None</strong>
        {value.slice(4)}
      </>
    );
  }

  return value;
}

function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-charcoal">
      <SiteHeader />
      <main>
        <section aria-labelledby="pricing-hero-heading">
          <div className="mx-auto grid max-w-[1120px] grid-cols-1 items-center gap-7 px-5 pb-7 pt-8 md:grid-cols-2 md:gap-8 md:px-7 md:pb-8 md:pt-11 lg:gap-12 lg:px-8 lg:pb-11 lg:pt-14">
            <div>
              <p className="font-sans text-[11px] font-semibold uppercase leading-none tracking-[2px] text-muted-ink">
                Pricing &amp; Fees
              </p>
              <h1 id="pricing-hero-heading" className="text-display-h1-sm my-3.5 mb-4 text-charcoal md:text-display-h1-md lg:text-display-h1">
                Simple pricing.<br className="max-lg:hidden" /> Greater confidence.
              </h1>
              <p className="max-w-none font-sans text-[15px] font-normal leading-[1.55] text-muted-ink md:max-w-[31em] md:text-[16.5px]">
                Know exactly what it costs to own gold and silver — whether you keep it in the vault or have it delivered. All prices and fees are shown in U.S. dollars.
              </p>
              <ul className="mt-5 flex flex-wrap gap-[14px] md:mt-[26px] md:flex-nowrap md:gap-0 md:border-t md:border-beige md:pt-5">
                {HERO_CHIPS.map(({ icon: Icon, title, description }) => (
                  <li key={title} className="min-w-0 flex-[1_1_45%] p-0 md:py-2 md:pr-3 md:border-r md:border-beige md:pl-[18px] md:first:pl-0 md:last:border-r-0 md:last:pr-0 lg:pr-[18px]">
                    <Icon size={19} strokeWidth={1.6} aria-hidden="true" focusable="false" className="mb-[7px] block text-forest-black" />
                    <strong className="mb-0.5 block font-sans text-[13.5px] font-semibold leading-tight text-charcoal">{title}</strong>
                    <span className="block font-sans text-[12.5px] font-normal leading-[1.4] text-muted-ink">{description}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="max-h-[320px] min-h-[240px] w-full overflow-hidden rounded-[6px] md:max-h-none md:min-h-[280px] lg:min-h-[330px]">
              <img src={heroImage.url} alt="Allocated PAMP Suisse gold bar with a Canada Maple Leaf gold coin and a Walking Liberty silver coin on a marble surface" className="h-full min-h-[240px] w-full object-cover object-center md:min-h-[280px] lg:min-h-[330px]" />
            </div>
          </div>
        </section>

        <section aria-labelledby="paths-heading" className="pb-0 pt-[54px]">
          <div className="mx-auto max-w-[1120px] px-5 md:px-7 lg:px-8">
            <div className="mb-[30px] max-w-[44em]">
              <h2 id="paths-heading" className="text-display-h3 mb-[9px] text-charcoal">Two ways to own it</h2>
              <p className="font-sans text-base font-normal leading-normal text-muted-ink">
                Everything comes down to one question: do you want it in the vault, or in your hands?
              </p>
            </div>

            <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-[1.15fr_1fr] md:gap-4 lg:grid-cols-[1.22fr_1fr] lg:gap-[22px]">
              {PATH_CARDS.map((card) => (
                <article
                  key={card.title}
                  className={`relative flex flex-col rounded-lg bg-paper px-[22px] pb-[22px] pt-6 md:px-6 md:pt-[26px] lg:px-[30px] lg:pb-[26px] lg:pt-[30px] ${
                    card.isLead
                      ? "border-2 border-forest-black bg-gradient-to-b from-wash-forest to-paper [background-size:100%_42%] [background-repeat:no-repeat]"
                      : "border border-beige"
                  }`}
                >
                  {card.isLead ? <PathLeadBadge /> : null}
                  <p className="mb-[9px] font-sans text-[11px] font-bold uppercase leading-none tracking-[1.8px] text-gold-dark">{card.kicker}</p>
                  <h3 className="text-display-h5 mb-[7px] text-charcoal">{card.title}</h3>
                  <p className="mb-[18px] font-sans text-[14.5px] font-normal leading-[1.5] text-muted-ink lg:min-h-[44px]">{card.subtitle}</p>
                  <p
                    className={`mb-[18px] rounded-r-[4px] border-l-[3px] px-3.5 py-[11px] font-sans text-[13.5px] font-normal leading-[1.45] ${
                      card.freeNoteTone === "gold"
                        ? "border-gold-dark bg-parchment text-warm-ink-soft"
                        : "border-forest-black bg-wash-green text-muted-ink"
                    }`}
                  >
                    <strong className={card.freeNoteTone === "gold" ? "font-semibold text-warm-ink" : "font-semibold text-charcoal"}>{card.freeNote.bold}</strong>{" "}
                    {card.freeNote.rest}
                  </p>
                  <ul className="mb-5 list-none p-0">
                    {card.bullets.map((bullet) => (
                      <li key={bullet.label} className="relative border-b border-beige py-2 pl-6 font-sans text-sm font-normal leading-[1.5] text-muted-ink last:border-b-0 before:absolute before:left-0.5 before:top-3.5 before:h-[9px] before:w-[9px] before:rounded-full before:border-[1.5px] before:border-gold-dark before:content-['']">
                        <b className="font-sans font-semibold text-charcoal">{bullet.label}:</b>{" "}
                        <BulletValue value={bullet.value} />
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={card.ctaHref}
                    className="group mt-auto inline-flex self-start items-center gap-[9px] border-b-[1.5px] border-gold-dark pb-1 font-sans text-[14.5px] font-semibold leading-none text-forest-black no-underline motion-safe:transition-colors motion-safe:ease-standard hover:border-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                  >
                    {card.ctaLabel}
                    <ArrowRight size={14} aria-hidden="true" className="shrink-0 motion-safe:transition-transform motion-safe:ease-standard group-hover:translate-x-0.5" />
                  </Link>
                  <p className="mt-3.5 font-sans text-[12.5px] font-normal leading-[1.5] text-muted-ink">{card.footnote}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}