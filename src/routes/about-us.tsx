import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { GoldButton, STD, SiteFooter, SiteHeader } from "@/components/site-chrome";
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


function AboutPage() {
  return (
    <main id="top" className="bg-background text-charcoal">
      <SiteHeader />

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
              width={390}
              height={780}
              className="w-full max-w-[340px] lg:max-w-[390px] h-auto object-contain mx-auto lg:ml-auto lg:mr-0 drop-shadow-[0_25px_35px_rgba(0,0,0,0.7)]"
            />
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
