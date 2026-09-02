import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Eye, ShieldCheck, UserRound } from "lucide-react";
import { Eyebrow, GoldButton, GoldRule, STD, SiteFooter } from "@/components/site-chrome";
import { AboutUsHeader } from "@/components/about-us-header";
import { cn } from "@/lib/utils";
import aboutHeroBg from "@/assets/about-hero-velvet-bg.jpg.asset.json";
import aboutHeroGoldBar from "@/assets/about-hero-gold-bar-v2.png.asset.json";

export const Route = createFileRoute("/about-us")({
  head: () => ({
    meta: [
      { title: "About Us — SQOOT Pure" },
      {
        name: "description",
        content:
          "SQOOT Pure exists to make real gold ownership simple, transparent and verifiable — physical metal, allocated in your name, insured in US vaults.",
      },
      { property: "og:title", content: "About Us — SQOOT Pure" },
      {
        property: "og:description",
        content: "Why we built SQOOT Pure: real gold, real ownership, no fine print.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const principles = [
  { icon: UserRound, title: "Ownership first", copy: "Metal is allocated in your name — never pooled, never on our balance sheet." },
  { icon: Eye, title: "Radical transparency", copy: "Clear fees, verifiable records, custody documentation you can actually read." },
  { icon: ShieldCheck, title: "Protection by default", copy: "Insured US vaults, insured delivery, and redemption on your schedule." },
] as const;

function AboutPage() {
  return (
    <main id="top" className="bg-background text-charcoal">
      <AboutUsHeader />

      {/* Hero */}
      <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden bg-[#0A1A12]">
        {/* Background image */}
        <img
          src={aboutHeroBg.url}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-8 py-16">
          {/* Left column */}
          <div className="lg:col-span-7 flex flex-col justify-center lg:pr-8">
            <span className="text-xs md:text-sm font-semibold tracking-[0.25em] text-[#C9A24D] uppercase mb-6">
              FOUNDER-LED. COMPLIANCE-FIRST.
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[64px] text-[#F4EFE6] font-normal leading-[1.12] tracking-tight max-w-2xl">
              Forty years in the gold market. One platform built to get it right.
            </h1>
          </div>

          {/* Right column */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            <img
              src={aboutHeroGoldBar.url}
              alt="SQOOT Pure gold bar"
              width={480}
              height={480}
              className="w-full max-w-[420px] lg:max-w-[480px] h-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)]"
            />
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-background py-14 lg:py-20">
        <div className={cn(STD, "grid gap-10 lg:grid-cols-2")}>
          <div>
            <Eyebrow>Why we exist</Eyebrow>
            <GoldRule />
            <h2 className="section-title mt-5 text-charcoal">Built for people who read the fine print.</h2>
          </div>
          <div className="space-y-4 text-[15px] leading-[1.7] text-[#2C332E]">
            <p>
              Too much of the gold industry is built on ambiguity: unallocated accounts,
              pooled holdings, fees buried in spreads. We started SQOOT Pure to offer the
              opposite — a way to buy, hold, gift and redeem physical gold where every
              gram is accounted for and every fee is stated plainly.
            </p>
            <p>
              Whether you take delivery of a coin, build a fractional position from $25,
              or store bars in an insured US vault, the principle is the same: it’s real
              metal, and it’s yours.
            </p>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-ivory py-14 lg:py-20">
        <div className={STD}>
          <Eyebrow>Our principles</Eyebrow>
          <GoldRule />
          <h2 className="section-title mt-5 text-charcoal">What we won’t compromise on.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {principles.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="rounded-[10px] border border-beige bg-background p-7">
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

      {/* CTA */}
      <section className="bg-forest py-12 text-[#F8F5F1]">
        <div className={cn(STD, "flex flex-wrap items-center justify-between gap-8")}>
          <div>
            <h2 className="font-display text-[36px] font-semibold leading-[1.05] text-gold-soft">Join us at launch.</h2>
            <p className="mt-2 max-w-[420px] text-[14px] leading-[1.55] text-[#C8CFC9]">
              SQOOT Pure is launching soon. Be first in line for early access.
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
