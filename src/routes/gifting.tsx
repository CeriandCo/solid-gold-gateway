import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Gift, HeartHandshake, Package, Sparkles } from "lucide-react";
import { Eyebrow, GoldButton, GoldRule, STD, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { cn } from "@/lib/utils";
import giftingHeroImage from "@/assets/gifting-hero-product.jpg";

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

function GiftingPage() {
  return (
    <main id="top" className="bg-background text-charcoal">
      <SiteHeader />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-forest-deep text-warm-white lg:min-h-[560px]">
        <img
          src={giftingHeroImage}
          alt="Emerald gift box with a gold bar, gold coin and satin ribbon"
          width={1920}
          height={1024}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[68%_center] max-lg:hidden"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,var(--forest-deep)_0%,color-mix(in_oklab,var(--forest-deep)_97%,transparent)_29%,color-mix(in_oklab,var(--forest-deep)_66%,transparent)_48%,transparent_69%),linear-gradient(0deg,color-mix(in_oklab,var(--forest-deep)_32%,transparent),transparent_45%)] max-lg:hidden"
        />

        <div className="relative mx-auto grid min-h-[560px] w-full max-w-[1440px] grid-cols-[44%_56%] lg:px-[60px] xl:px-[64px]">
          <div className="flex items-center py-14 max-lg:col-span-2 max-lg:px-5 sm:max-lg:px-8 lg:py-16">
            <div className="w-full max-w-[520px]">
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
