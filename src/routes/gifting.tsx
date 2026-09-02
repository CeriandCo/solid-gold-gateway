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
import giftingLegacyImage from "@/assets/gifting-legacy-gold-refined.jpg";
import giftingPackagedImage from "@/assets/gifting-phone-gold-bar.png.asset.json";

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

const occasionIcons: { label: string; paths: React.ReactNode }[] = [
  {
    label: "Weddings",
    paths: (
      <>
        <circle cx="9.5" cy="14" r="4" />
        <circle cx="14.5" cy="14" r="4" />
        <path d="M12 6.5c-1.2-1.4-3.3-.9-3.3.8 0 1.2 1.8 2.4 3.3 3.3 1.5-.9 3.3-2.1 3.3-3.3 0-1.7-2.1-2.2-3.3-.8z" />
      </>
    ),
  },
  {
    label: "Anniversaries",
    paths: (
      <>
        <path d="M12 5.5C9.8 2.8 6 4.2 6 8c0 3.8 6 8.5 6 8.5s6-4.7 6-8.5c0-3.8-3.8-5.2-6-2.5z" />
        <path d="M12 7.5c-1.3-1.3-3-.5-3 1.3 0 1.6 1.7 3.3 3 4.5 1.3-1.2 3-2.9 3-4.5 0-1.8-1.7-2.6-3-1.3z" />
        <path d="M8.5 10l3.5 2.5 3.5-2.5" />
      </>
    ),
  },
  {
    label: "New Arrivals",
    paths: (
      <>
        <path d="M7 8.5v5.5c0 3.5 2.2 6 5 7 2.8-1 5-3.5 5-7V8.5" />
        <path d="M7 8.5h10" />
        <path d="M10 8.5a2 2 0 0 1 4 0" />
        <path d="M6.5 8.5l-2-2.5M17.5 8.5l2-2.5" />
      </>
    ),
  },
  {
    label: "Birthdays",
    paths: (
      <>
        <rect x="8" y="13" width="8" height="3.5" rx="0.3" />
        <rect x="6" y="16.5" width="12" height="4.5" rx="0.3" />
        <path d="M12 21v2M8 23h8" />
        <path d="M9.5 13V10M12 13V9.5M14.5 13V10" />
        <path d="M9.5 9.5c0 .5-.3.8-.6.8s-.6-.3-.6-.8.3-1 .6-1 .6.5.6 1z" />
        <path d="M12 9c0 .5-.3.8-.6.8s-.6-.3-.6-.8.3-1 .6-1 .6.5.6 1z" />
        <path d="M14.5 9.5c0 .5-.3.8-.6.8s-.6-.3-.6-.8.3-1 .6-1 .6.5.6 1z" />
      </>
    ),
  },
  {
    label: "Graduations",
    paths: (
      <>
        <path d="M12 5 4 9.5l8 4.5 8-4.5-8-4.5z" />
        <path d="M8 12.5v3.5c0 2 3 3.5 8 1.5" />
        <path d="M12 9.5v5.5c0 2.2 2.5 3.5 5 2" />
        <circle cx="17" cy="17" r="0.9" />
      </>
    ),
  },
  {
    label: "Festivals",
    paths: (
      <>
        <circle cx="12" cy="12" r="2.2" />
        <path d="M12 4v2.5M12 17.5V20M4 12h2.5M17.5 12H20" />
        <path d="M6.3 6.3l1.8 1.8M15.9 15.9l1.8 1.8M17.7 6.3l-1.8 1.8M8.1 15.9l-1.8 1.8" />
        <path d="M12 2.5l.7 1.4-.7 1.4-.7-1.4z" />
        <path d="M12 21.5l.7-1.4-.7-1.4-.7 1.4z" />
        <path d="M2.5 12l1.4.7 1.4-.7-1.4-.7z" />
        <path d="M21.5 12l-1.4.7-1.4-.7 1.4-.7z" />
      </>
    ),
  },
  {
    label: "Achievements",
    paths: (
      <>
        <path d="M7 4.5h10v5c0 3.2-2.2 5.5-5 5.5s-5-2.3-5-5.5v-5z" />
        <path d="M7 6.5H5v2c0 2 1.5 3.5 3 4M17 6.5h2v2c0 2-1.5 3.5-3 4" />
        <path d="M12 15v4.5" />
        <path d="M9 19.5h6" />
        <path d="M8 22h8" />
      </>
    ),
  },
  {
    label: "Housewarmings",
    paths: (
      <>
        <path d="M3 11l9-6.5 9 6.5" />
        <path d="M5 10.5v10.5h14V10.5" />
        <path d="M17 6.5V4.5h2.5v4" />
        <path d="M10 21v-5.5h4V21" />
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
      <section className="bg-[#FAF7F2] py-10 md:py-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <span className="mb-1 block text-center font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#B89758]">
            PERFECT FOR LIFE&apos;S SPECIAL MOMENTS
          </span>
          <svg
            viewBox="0 0 24 24"
            className="mx-auto mb-1.5 h-5 w-5 text-[#B89758] opacity-90 fill-current md:h-6 md:w-6"
            aria-hidden="true"
          >
            <g fill="currentColor">
              <circle cx="12" cy="12" r="1.4" />
              <circle cx="12" cy="7.4" r="2.3" />
              <circle cx="15.6" cy="8.6" r="2.3" />
              <circle cx="16.8" cy="12.2" r="2.3" />
              <circle cx="15.6" cy="15.8" r="2.3" />
              <circle cx="12" cy="17" r="2.3" />
              <circle cx="8.4" cy="15.8" r="2.3" />
              <circle cx="7.2" cy="12.2" r="2.3" />
              <circle cx="8.4" cy="8.6" r="2.3" />
            </g>
          </svg>
          <h2 className="mb-2 text-center font-serif text-4xl font-normal tracking-tight text-[#1C1917] md:text-5xl">
            Celebrate what matters most.
          </h2>
          <p className="mx-auto mb-8 max-w-xl whitespace-pre-line text-center font-sans text-sm leading-snug text-[#57534E] md:text-base">
            From joyous occasions to life&apos;s biggest milestones,{"\n"}SQOOT Pure makes gifting gold simple, meaningful, and memorable.
          </p>

          <div className="grid grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6 items-start justify-center w-full">
            {occasionIcons.map(({ label, paths }) => (
              <div key={label} className="flex flex-col items-center justify-start text-center group cursor-pointer">
                <span className="mx-auto mb-3 flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full border border-[#D8CCB2]/60 bg-transparent md:h-[88px] md:w-[88px]">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-10 w-10 fill-none stroke-[#B89758] stroke-[1.25] stroke-linecap-round stroke-linejoin-round md:h-12 md:w-12"
                    aria-hidden="true"
                  >
                    {paths}
                  </svg>
                </span>
                <span className="text-center font-sans text-xs font-medium tracking-tight text-[#292524] md:text-sm">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legacy / A Gift That Grows */}
      <section className="relative bg-[#EAE4D8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="w-full py-16 lg:mr-auto lg:w-1/2 lg:py-24 lg:pr-12">
            <span className="mb-3 block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#57534E] md:text-sm">
              A GIFT THAT GROWS
            </span>
            <h2 className="mb-6 font-serif text-4xl leading-[1.15] text-[#1C1917] whitespace-pre-line md:text-5xl lg:text-[52px]">
              More than a gift.{"\n"}A legacy in the making.
            </h2>

            <div className="mb-6 flex w-3/4 max-w-xs items-center gap-4">
              <span className="h-[1px] flex-1 bg-[#D8CCB2]" />
              <svg
                viewBox="0 0 24 24"
                className="mx-2 h-5 w-5 shrink-0 fill-current text-[#B89758] md:h-6 md:w-6"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="1.6" />
                <circle cx="12" cy="7.8" r="2.2" />
                <circle cx="15.8" cy="9" r="2.2" />
                <circle cx="17" cy="12.8" r="2.2" />
                <circle cx="15.8" cy="16.6" r="2.2" />
                <circle cx="12" cy="17.8" r="2.2" />
                <circle cx="8.2" cy="16.6" r="2.2" />
                <circle cx="7" cy="12.8" r="2.2" />
                <circle cx="8.2" cy="9" r="2.2" />
              </svg>
              <span className="h-[1px] flex-1 bg-[#D8CCB2]" />
            </div>

            <p className="mb-6 font-sans text-base leading-relaxed text-[#57534E]">
              Gold is a lasting symbol of love, blessings, and prosperity. Whether it&apos;s for a loved one or a future they&apos;re building, your gift stays with them—today, tomorrow, always.
            </p>

            <div className="flex flex-col gap-3">
              {[
                "Real gold, real value",
                "Secure, transparent, and easy to send",
                "Redeemable anytime, anywhere",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 shrink-0 fill-[#15241C]"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="12" />
                    <path
                      d="M7 12l3 3 6-6"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="font-sans text-sm font-medium text-[#292524] md:text-base">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-96 sm:h-[400px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-1/2">
          <img
            src={giftingLegacyImage}
            alt="Luxurious gold bar and presentation card in a dark green velvet box"
            width={1200}
            height={1000}
            loading="lazy"
            className="h-full w-full rounded-none object-cover shadow-none"
          />
        </div>
      </section>

      {/* How Gifting Works */}
      <section className="bg-[#FAF7F2]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <span className="mb-4 block text-center font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#57534E] md:text-sm">
            HOW GIFTING WORKS
          </span>
          <h2 className="mb-10 text-center font-serif text-4xl text-[#1C1917] md:text-5xl">
            Simple steps. Lasting impact.
          </h2>

          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {[
              {
                title: "Choose Your Gift",
                description: "Select the gold weight and add a personal message.",
                icon: (
                  <svg viewBox="0 0 24 24" className="h-12 w-12" aria-hidden="true">
                    <rect x="5" y="9" width="14" height="11" rx="1" />
                    <path d="M5 9h14V7a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v2z" />
                    <path d="M12 6V4M8 9c0-2.2 1.8-4 4-4s4 1.8 4 4" />
                    <path d="M12 9v11" />
                    <path d="M8 9v11M16 9v11" />
                  </svg>
                ),
              },
              {
                title: "We Deliver Securely",
                description: "We'll notify your recipient and deliver your gift digitally or physically.",
                icon: (
                  <svg viewBox="0 0 24 24" className="h-12 w-12" aria-hidden="true">
                    <rect x="7" y="8" width="10" height="8" rx="1" />
                    <path d="M7 10l5 3 5-3" />
                    <path d="M4 11h2M3 9h3M4 13h2" />
                    <path d="M17 11h3" />
                  </svg>
                ),
              },
              {
                title: "Safely Vaulted",
                description: "Their gold is securely stored in insured U.S. vaults under their name.",
                icon: (
                  <svg viewBox="0 0 24 24" className="h-12 w-12" aria-hidden="true">
                    <path d="M4 20h16" />
                    <path d="M5 20V12h3v8M11 20V12h2v8M16 20V12h3v8" />
                    <path d="M3 12l9-8 9 8" />
                  </svg>
                ),
              },
              {
                title: "They Redeem Anytime",
                description: "Your loved one can sell or take delivery of their gold anytime.",
                icon: (
                  <svg viewBox="0 0 24 24" className="h-12 w-12" aria-hidden="true">
                    <ellipse cx="10" cy="15" rx="4" ry="5" transform="rotate(-25 10 15)" />
                    <ellipse cx="14" cy="15" rx="4" ry="5" transform="rotate(25 14 15)" />
                    <path d="M12 6c-1.4 0-2.5 1.1-2.5 2.5S10.6 11 12 11s2.5-1.1 2.5-2.5S13.4 6 12 6z" />
                  </svg>
                ),
              },
            ].map(({ title, description, icon }, index) => (
              <div key={title} className="relative z-10 flex w-full flex-col items-center text-center">
                {index < 3 && (
                  <div className="hidden lg:block absolute top-[44px] left-[calc(50%+44px+16px)] w-[calc(100%-88px-32px)] border-t border-dashed border-[#D8CCB2]"></div>
                )}
                <div className="relative z-10 mb-6 inline-flex h-[88px] w-[88px] items-center justify-center rounded-full border border-[#D8CCB2]/80 bg-[#FAF7F2]">
                  <span className="absolute -top-2 -left-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-[#15241C] text-xs font-bold text-white shadow-sm">
                    {index + 1}
                  </span>
                  <span className="h-12 w-12 stroke-[#3A352F] stroke-[1.25] fill-none stroke-linecap-round stroke-linejoin-round">
                    {icon}
                  </span>
                </div>
                <h3 className="mb-2 font-sans text-base font-semibold text-[#1C1917]">{title}</h3>
                <p className="max-w-[220px] font-sans text-sm leading-relaxed text-[#57534E]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beautifully Packaged */}
      <section className="w-full bg-[#0B1C14]">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col overflow-hidden lg:flex-row">
          {/* Left Column (Faded Image) */}
          <div className="relative h-[400px] w-full sm:h-[500px] lg:h-[600px] lg:w-1/2">
            <img
              src={giftingPackagedImage.url}
              alt="Luxury smartphone and 10g SQOOT Pure gold bar on dark green velvet"
              width={1536}
              height={1024}
              loading="lazy"
              className="h-full w-full object-cover object-left-center"
            />
            {/* Right-edge fade into background */}
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#0B1C14] to-transparent lg:w-1/2"></div>
            {/* Bottom fade for mobile */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0B1C14] to-transparent lg:hidden"></div>
          </div>

          {/* Right Column (Text Content) */}
          <div className="z-10 flex w-full flex-col justify-center px-6 py-16 lg:w-1/2 lg:py-24 lg:pl-8 lg:pr-12 xl:pl-16">
            <span className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A24D] md:mb-6 md:text-sm">
              BEAUTIFULLY PACKAGED. SECURELY DELIVERED.
            </span>
            <h2 className="mb-6 max-w-lg font-serif text-4xl font-normal leading-[1.15] text-[#F4EFE6] md:mb-8 md:text-5xl lg:text-[56px]">
              Every detail designed to impress.
            </h2>
            <p className="mb-10 max-w-xl font-sans text-base leading-relaxed text-[#C4CFC9] md:text-lg">
              Premium packaging, a personal message, and the confidence of real gold—because how you give matters just as much as what you give.
            </p>
            <Link
              to="/precious-metal"
              className="inline-flex w-fit items-center justify-center rounded-[2px] bg-[#C9A24D] px-8 py-3.5 text-sm font-medium text-[#0B1C14] transition-colors hover:bg-[#B89758] md:text-base"
            >
              Explore Gifts
            </Link>
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
