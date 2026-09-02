import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Coins, Home, Package, ShieldCheck, Truck } from "lucide-react";
import { Eyebrow, GoldButton, GoldRule, STD, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { cn } from "@/lib/utils";
import coinImage from "@/assets/path-coin.jpg";

export const Route = createFileRoute("/precious-metal")({
  head: () => ({
    meta: [
      { title: "Precious Metal — Physical Gold & Silver Delivered | SQOOT Pure" },
      {
        name: "description",
        content:
          "Buy physical gold and silver coins and bars, shipped insured directly to your door. Real metal, direct possession.",
      },
      { property: "og:title", content: "Precious Metal — Physical Gold & Silver Delivered | SQOOT Pure" },
      {
        property: "og:description",
        content: "Physical gold and silver, insured in transit, delivered to your address.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PreciousMetalPage,
});

const steps = [
  { icon: Package, title: "Choose", copy: "Select physical gold or silver from the collection." },
  { icon: Truck, title: "Ship insured", copy: "Every order is fully insured in transit, door to door." },
  { icon: Home, title: "Receive", copy: "It arrives at your address. It’s yours — entirely." },
] as const;

const assurances = [
  "Investment-grade coins and bars",
  "Fully insured, tracked delivery",
  "Discreet, secure packaging",
  "Direct possession — no intermediaries",
] as const;

function PreciousMetalPage() {
  return (
    <main id="top" className="bg-background text-charcoal">
      <SiteHeader />

      {/* Hero */}
      <section className="bg-ivory">
        <div className={cn(STD, "grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20")}>
          <div>
            <Eyebrow>Precious Metal</Eyebrow>
            <GoldRule />
            <h1
              className="mt-5 font-display font-semibold text-charcoal"
              style={{ fontSize: "clamp(36px, 4vw, 58px)", lineHeight: "1.04", letterSpacing: "-0.02em" }}
            >
              Physical gold,
              <br />
              delivered to <em className="font-semibold italic text-gold">your door.</em>
            </h1>
            <p className="mt-6 max-w-[480px] text-[17px] font-medium leading-[30px] text-[#2C332E]">
              Buy real gold and silver coins and bars and take direct possession.
              Shipped insured, packaged discreetly, owned outright.
            </p>
            <div className="mt-8">
              <GoldButton href="/vault#early-access" className="h-[54px] bg-gradient-to-b from-gold-soft to-gold px-8 text-[15px] font-bold">
                Get Early Access <ArrowRight size={17} strokeWidth={2.25} />
              </GoldButton>
            </div>
          </div>
          <img
            src={coinImage}
            alt="Gold coin held in hand"
            className="h-[280px] w-full rounded-[10px] object-cover sm:h-[380px]"
          />
        </div>
      </section>

      {/* How it works */}
      <section className="bg-background py-14 lg:py-20">
        <div className={STD}>
          <Eyebrow>How it works</Eyebrow>
          <GoldRule />
          <h2 className="section-title mt-5 text-charcoal">Three steps. Then it’s in your hands.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, copy }, index) => (
              <article key={title} className="rounded-[10px] border border-beige bg-ivory p-7">
                <div className="relative inline-block">
                  <span className="grid h-[84px] w-[84px] place-items-center rounded-full border border-gold/55 text-gold">
                    <Icon size={32} strokeWidth={1.4} />
                  </span>
                  <span className="absolute -bottom-1 left-0 grid h-[22px] w-[22px] place-items-center rounded-full bg-gold text-[11px] font-semibold text-[#0B2015]">
                    {index + 1}
                  </span>
                </div>
                <h3 className="card-title mt-5 text-charcoal">{title}</h3>
                <p className="mt-3 text-[13px] leading-[1.55] text-[#444A45]">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Assurances */}
      <section className="bg-ivory py-14 lg:py-20">
        <div className={cn(STD, "grid gap-10 lg:grid-cols-[38%_1fr]")}>
          <div>
            <Eyebrow>The SQOOT standard</Eyebrow>
            <GoldRule />
            <h2 className="section-title mt-5 text-charcoal">Metal you can hold. Standards you can check.</h2>
            <p className="mt-4 max-w-[420px] text-[13px] leading-[1.5] text-[#444A45]">
              Every piece we sell is sourced from recognized mints and refiners, verified
              before it ships, and insured until it is in your hands.
            </p>
          </div>
          <ul className="grid content-center gap-4 sm:grid-cols-2">
            {assurances.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-[6px] border border-beige bg-background p-5 text-sm font-medium text-charcoal">
                <ShieldCheck size={18} strokeWidth={1.6} className="mt-0.5 shrink-0 text-gold" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-12 text-[#F8F5F1]">
        <div className={cn(STD, "flex flex-wrap items-center justify-between gap-8")}>
          <div>
            <h2 className="font-display text-[36px] font-semibold leading-[1.05] text-gold-soft">
              Own it. Hold it. <Coins className="mb-1 inline" size={30} strokeWidth={1.4} />
            </h2>
            <p className="mt-2 max-w-[420px] text-[14px] leading-[1.55] text-[#C8CFC9]">
              Join the waitlist for early access to the SQOOT Pure precious metal collection.
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
