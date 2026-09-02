import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CreditCard,
  Gift,
  HeartHandshake,
  Landmark,
  Package,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { Eyebrow, GoldButton, GoldRule, STD, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { cn } from "@/lib/utils";
import giftingHeroImage from "@/assets/gifting-hero-product-final.jpg";

export const Route = createFileRoute("/gifting")({
  head: () => ({
    meta: [
      { title: "Gifting — Give Real Gold | SQOOT Pure" },
      {
        name: "description",
        content:
          "Give a gift that holds its value. Send real, physical gold to the people who matter — beautifully presented, genuinely theirs.",
      },
      { property: "og:title", content: "Gifting — Give Real Gold | SQOOT Pure" },
      {
        property: "og:description",
        content: "Real gold, given properly. A gift with lasting value.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GiftingPage,
});

const occasions = [
  { icon: Gift, title: "Milestones", copy: "Weddings, graduations, anniversaries — mark them with something permanent." },
  { icon: Sparkles, title: "New beginnings", copy: "A first piece of gold for a child, a grandchild, a new chapter." },
  { icon: HeartHandshake, title: "Thank you", copy: "A gift with substance, for the people who deserve more than a gesture." },
] as const;

const occasionIcons: { label: string; paths: JSX.Element }[] = [
  {
    label: "Weddings",
    paths: (
      <>
        <circle cx="13" cy="19" r="7" />
        <circle cx="19" cy="19" r="7" />
        <path d="M16 10.4c-1.1-1.9-4-1.3-4 .9 0 1.6 2.4 3.1 4 4.2 1.6-1.1 4-2.6 4-4.2 0-2.2-2.9-2.8-4-.9z" />
      </>
    ),
  },
  {
    label: "Anniversaries",
    paths: (
      <>
        <path d="M16 27s-10-6.3-10-13a5.6 5.6 0 0 1 10-3.4A5.6 5.6 0 0 1 26 14c0 6.7-10 13-10 13z" />
        <path d="M16 12.5v9M16 14.5l-4 3M16 14.5l4 3M16 18l-3.4 2.6M16 18l3.4 2.6" />
      </>
    ),
  },
  {
    label: "New Arrivals",
    paths: (
      <>
        <path d="M11 8h10M16 8v3" />
        <path d="M14.4 6.6c-1.4-1.1-3.4-.2-3.4 1.4M17.6 6.6c1.4-1.1 3.4-.2 3.4 1.4" />
        <path d="M12 11h8a7 7 0 0 1 7 7 8 8 0 0 1-8 8h-6a8 8 0 0 1-8-8 7 7 0 0 1 7-7z" />
        <circle cx="16" cy="18.5" r="3" />
      </>
    ),
  },
  {
    label: "Birthdays",
    paths: (
      <>
        <path d="M12 8.5V6M16 8.5V5.5M20 8.5V6" />
        <path d="M11 12h10v4H11zM9 16h14v5H9z" />
        <path d="M16 21v3M11 27h10M13.5 27c0-1.6 1.1-3 2.5-3s2.5 1.4 2.5 3" />
      </>
    ),
  },
  {
    label: "Graduations",
    paths: (
      <>
        <path d="M16 7 3.5 12.5 16 18l12.5-5.5L16 7z" />
        <path d="M8 15.2V21c0 2.2 3.6 4 8 4s8-1.8 8-4v-5.8" />
        <path d="M27 13v6.5" />
        <circle cx="27" cy="21" r="1.4" />
      </>
    ),
  },
  {
    label: "Festivals",
    paths: (
      <>
        <circle cx="16" cy="16" r="5" />
        <path d="M16 3.5v4M16 24.5v4M3.5 16h4M24.5 16h4M7.2 7.2l2.8 2.8M22 22l2.8 2.8M24.8 7.2 22 10M10 22l-2.8 2.8" />
        <path d="M16 8.4c1.6 0 2.6 1.1 2.6 2.2M16 23.6c-1.6 0-2.6-1.1-2.6-2.2" />
      </>
    ),
  },
  {
    label: "Achievements",
    paths: (
      <>
        <path d="M11 5h10v7a5 5 0 0 1-10 0V5z" />
        <path d="M11 7H7.5v2A4.5 4.5 0 0 0 12 13.5M21 7h3.5v2a4.5 4.5 0 0 1-4.5 4.5" />
        <path d="M16 17v4M12.5 21h7M10.5 24.5h11M9.5 27.5h13" />
      </>
    ),
  },
  {
    label: "Housewarmings",
    paths: (
      <>
        <path d="M4.5 15 16 5.5 27.5 15" />
        <path d="M7.5 13v13h17V13" />
        <path d="M21 8.2V5.5h3v5.2" />
        <path d="M13 26v-7h6v7" />
      </>
    ),
  },
];


function GiftingPage() {
  return (
    <main id="top" className="bg-background text-charcoal">
      <SiteHeader />

      {/* Hero */}
      <section className="relative isolate mt-0 overflow-hidden bg-forest-deep text-warm-white lg:min-h-[560px]">
        <img
          src={giftingHeroImage}
          alt="Emerald gift box with a gold bar, gold coin and satin ribbon"
          width={1920}
          height={1024}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-center max-lg:hidden"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,var(--forest-deep)_0%,color-mix(in_oklab,var(--forest-deep)_97%,transparent)_29%,color-mix(in_oklab,var(--forest-deep)_66%,transparent)_48%,transparent_69%),linear-gradient(0deg,color-mix(in_oklab,var(--forest-deep)_32%,transparent),transparent_45%)] max-lg:hidden"
        />

        <div className="relative mx-auto grid min-h-[560px] w-full max-w-[1440px] grid-cols-[44%_56%] lg:px-[60px] xl:px-[64px]">
          <div className="flex items-start pt-8 pb-14 max-lg:col-span-2 max-lg:px-5 sm:max-lg:px-8 lg:pt-10 lg:pb-16">
            <div className="w-full max-w-[520px]">
              <nav aria-label="Breadcrumb" className="mb-12 flex items-center gap-3 font-sans text-[12px] font-medium text-warm-white/70">
                <Link to="/" className="transition-colors hover:text-gold-soft">Home</Link>
                <span aria-hidden="true" className="text-gold-soft/70">›</span>
                <span aria-current="page" className="text-warm-white/85">Gifting</span>
              </nav>

              <p className="font-sans text-[12px] font-semibold uppercase leading-none tracking-[0.16em] text-gold-soft">
                Give what lasts
              </p>

              <h1 className="mt-5 font-display text-[42px] font-medium leading-[0.98] tracking-[0] text-warm-white sm:text-[52px] lg:text-[58px] xl:text-[62px]">
                <span className="block whitespace-nowrap">Meaningful gold</span>
                <span className="mt-1 block whitespace-nowrap">for every milestone.</span>
              </h1>

              <div className="mt-5 flex w-[154px] items-center gap-2.5 text-gold" aria-hidden="true">
                <span className="h-px flex-1 bg-gold/55" />
                <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] shrink-0" fill="none">
                  <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="0.8" />
                  <path d="M12 3.5 14.1 8l4.4 1.9-4.4 2.1L12 16.5 9.9 12l-4.4-2.1L9.9 8 12 3.5Z" stroke="currentColor" strokeWidth="0.8" />
                  <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="0.8" />
                </svg>
                <span className="h-px flex-1 bg-gold/55" />
              </div>

              <p className="mt-5 max-w-[385px] font-sans text-[14px] font-normal leading-[1.58] text-warm-white/80 sm:text-[15px]">
                SQOOT Pure gold gifts are real, secure, and made to be remembered. Perfect for weddings, new beginnings, achievements, and the people who matter most.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <GoldButton to="/precious-metal" className="h-[42px] min-w-[132px] bg-gold-soft px-6 text-[13px] font-semibold text-forest-deep hover:bg-gold">
                  Explore Gifts
                </GoldButton>
                <GoldButton href="#gifting-process" className="h-[42px] min-w-[154px] border border-gold/65 bg-transparent px-6 text-[13px] font-medium text-warm-white hover:bg-gold/10">
                  How Gifting Works
                </GoldButton>
              </div>
            </div>
          </div>

          <div className="relative min-h-[360px] max-lg:col-span-2 lg:hidden">
            <img
              src={giftingHeroImage}
              alt=""
              width={1920}
              height={1024}
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover object-[69%_center]"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,var(--forest-deep)_0%,transparent_24%,transparent_82%,color-mix(in_oklab,var(--forest-deep)_28%,transparent)_100%)]" />
          </div>
        </div>
      </section>

      {/* Value Proposition / Trust Features */}
      <section className="border-y border-gold-soft/20 bg-forest-deep text-warm-white">
        <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-gold-soft/20">
            {[
              { icon: Gift, title: "Thoughtful & Timeless", description: "A gift they'll value today and for generations." },
              { icon: ShieldCheck, title: "100% Real Gold", description: "Allocated, insured, and fully backed." },
              { icon: Landmark, title: "Securely Vaulted", description: "Stored in insured U.S. vaults you can trust." },
              { icon: CreditCard, title: "Beautifully Presented", description: "Premium packaging with a personal touch." },
              { icon: Smartphone, title: "Digital Convenience", description: "Send instantly or schedule for later." },
            ].map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex flex-col items-center justify-start px-6 py-4 text-center">
                <Icon className="mb-3 h-8 w-8 text-gold-soft md:mb-4 md:h-9 md:w-9" strokeWidth={1.5} />
                <h3 className="mb-1.5 font-sans text-sm font-medium tracking-tight text-gold-soft md:text-base">{title}</h3>
                <p className="max-w-[200px] font-sans text-xs leading-relaxed text-warm-white/80 md:text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Occasions / Celebrate What Matters Most */}
      <section className="bg-[#FAF7F2] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <span className="font-sans text-xs font-semibold tracking-[0.25em] text-[#B89758] uppercase mb-2 block text-center">
            PERFECT FOR LIFE&apos;S SPECIAL MOMENTS
          </span>
          <svg
            viewBox="0 0 32 32"
            className="w-4 h-4 text-[#B89758] mx-auto mb-4 opacity-85"
            aria-hidden="true"
          >
            <g fill="currentColor">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                <ellipse key={a} cx="16" cy="9" rx="3.1" ry="5.4" transform={`rotate(${a} 16 16)`} />
              ))}
            </g>
            <circle cx="16" cy="16" r="3.2" fill="#FAF7F2" />
            <circle cx="16" cy="16" r="1.6" fill="currentColor" />
          </svg>
          <h2 className="font-display font-normal text-4xl md:text-5xl text-[#1C1917] tracking-tight text-center mb-3">
            Celebrate what matters most.
          </h2>
          <p className="font-sans text-sm md:text-base text-[#57534E] leading-relaxed text-center max-w-xl mx-auto whitespace-pre-line mb-14">
            From joyous occasions to life&apos;s biggest milestones,{"\n"}SQOOT Pure makes gifting gold simple, meaningful, and memorable.
          </p>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-6 items-start justify-center">
            {occasionIcons.map(({ label, paths }) => (
              <div key={label} className="flex flex-col items-center text-center group cursor-pointer">
                <span className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-[#D8CCB2]/50 bg-[#FAF7F2]/60 flex items-center justify-center transition-transform hover:scale-105 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                  <svg
                    viewBox="0 0 32 32"
                    fill="none"
                    stroke="#B89758"
                    strokeWidth={1.25}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-7 h-7 md:w-8 md:h-8"
                    aria-hidden="true"
                  >
                    {paths}
                  </svg>
                </span>
                <span className="font-sans text-xs md:text-sm font-medium text-[#292524] text-center mt-3 tracking-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section className="bg-background py-14 lg:py-20">
        <div className={STD}>
          <Eyebrow>For the moments that matter</Eyebrow>
          <GoldRule />
          <h2 className="section-title mt-5 text-charcoal">A gift with weight behind it.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {occasions.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="rounded-[10px] border border-beige bg-ivory p-7">
                <span className="grid h-[84px] w-[84px] place-items-center rounded-full border border-gold/55 text-gold">
                  <Icon size={32} strokeWidth={1.4} />
                </span>
                <h3 className="card-title mt-5 text-charcoal">{title}</h3>
                <p className="mt-3 text-[13px] leading-[1.55] text-[#444A45]">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How gifting works */}
      <section className="bg-ivory py-14 lg:py-20">
        <div className={cn(STD, "grid gap-10 lg:grid-cols-[38%_1fr]")}>
          <div>
            <Eyebrow>How it works</Eyebrow>
            <GoldRule />
            <h2 className="section-title mt-5 text-charcoal">Choose. Personalize. Send.</h2>
            <p className="mt-4 max-w-[420px] text-[13px] leading-[1.5] text-[#444A45]">
              Select a piece or an amount, add a personal message, and we handle the rest —
              presentation, insured delivery, and transfer of ownership.
            </p>
          </div>
          <div className="grid content-center gap-3">
            {[
              "Choose a coin, bar or fractional amount",
              "Add a personal message and presentation",
              "We ship insured — ownership transfers to them",
            ].map((step, index) => (
              <div key={step} className="flex items-center gap-4 rounded-[6px] border border-beige bg-background px-5 py-4">
                <span className="grid h-[28px] w-[28px] shrink-0 place-items-center rounded-full bg-gold text-[12px] font-semibold text-[#0B2015]">
                  {index + 1}
                </span>
                <p className="text-sm font-medium text-charcoal">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-12 text-[#F8F5F1]">
        <div className={cn(STD, "flex flex-wrap items-center justify-between gap-8")}>
          <div>
            <h2 className="font-display text-[36px] font-semibold leading-[1.05] text-gold-soft">
              <Package className="mb-1 mr-2 inline" size={30} strokeWidth={1.4} />
              The gift that keeps its value.
            </h2>
            <p className="mt-2 max-w-[420px] text-[14px] leading-[1.55] text-[#C8CFC9]">
              Join the waitlist to be notified when SQOOT Pure gifting opens.
            </p>
          </div>
          <GoldButton href="/vault#early-access" className="h-[54px] bg-gradient-to-b from-gold-soft to-gold px-8 text-[15px] font-bold">
            Get Early Access <ArrowRight size={17} strokeWidth={2.25} />
          </GoldButton>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
