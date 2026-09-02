import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Coins, Gift, Layers, Warehouse } from "lucide-react";
import { Eyebrow, GoldButton, GoldRule, STD, SiteFooter, SiteHeader, WIDE } from "@/components/site-chrome";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/gold-bar-velvet-marble-branded.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SQOOT Pure — Real Gold, Real Ownership" },
      {
        name: "description",
        content:
          "Buy physical gold delivered to your door, own fractional gold, or store allocated metal in an insured US vault. Real ownership, your way.",
      },
      { property: "og:title", content: "SQOOT Pure — Real Gold, Real Ownership" },
      {
        property: "og:description",
        content: "Physical gold delivered, fractional gold, and insured vault storage — real metal, held in your name.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const paths = [
  {
    icon: Coins,
    title: "Precious Metal",
    copy: "Buy physical gold and silver coins and bars, shipped insured to your door.",
    to: "/precious-metal",
  },
  {
    icon: Layers,
    title: "Fractional Gold",
    copy: "Own real gold from $25. Fully allocated, never pooled, always yours.",
    to: "/fractional-gold",
  },
  {
    icon: Warehouse,
    title: "Vault",
    copy: "Physical metal stored in an insured US vault, allocated in your name.",
    to: "/vault",
  },
  {
    icon: Gift,
    title: "Gifting",
    copy: "Give real gold. A gift that holds its value long after the moment.",
    to: "/gifting",
  },
] as const;

function HomePage() {
  return (
    <main id="top" className="bg-background text-charcoal">
      <SiteHeader />

      {/* Hero */}
      <section className="bg-ivory">
        <div className="grid lg:min-h-[628px] lg:grid-cols-[39%_61%]">
          <img
            src={heroImage}
            alt="SQOOT Pure gold bar resting on dark velvet and marble"
            className="h-[280px] w-full object-cover object-center sm:h-[380px] lg:h-full"
          />
          <div className="flex flex-col justify-center px-5 py-12 sm:px-8 lg:py-0 lg:pl-[84px] lg:pr-10">
            <Eyebrow>SQOOT Pure</Eyebrow>
            <GoldRule />
            <h1
              className="mt-5 max-w-[560px] font-display font-semibold text-charcoal"
              style={{ fontSize: "clamp(38px, 4.72vw, 68px)", lineHeight: "1.02", letterSpacing: "-0.025em" }}
            >
              Real gold.
              <br />
              Real <em className="font-semibold italic text-gold">ownership.</em>
            </h1>
            <p className="mt-6 max-w-[520px] text-[17px] font-medium leading-[30px] text-[#2C332E]">
              Buy physical gold and have it delivered, own it fractionally, or hold it
              allocated in an insured US vault. However you choose to own it — it’s real,
              and it’s yours.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-8">
              <GoldButton href="/vault#early-access" className="h-[54px] bg-gradient-to-b from-gold-soft to-gold px-8 text-[15px] font-bold">
                Get Early Access <ArrowRight size={17} strokeWidth={2.25} />
              </GoldButton>
            </div>
          </div>
        </div>
      </section>

      {/* Four paths */}
      <section className="bg-background py-14 lg:py-20">
        <div className={STD}>
          <Eyebrow>Ways to own</Eyebrow>
          <GoldRule />
          <h2 className="section-title mt-5 text-charcoal">Four paths to real gold.</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {paths.map(({ icon: Icon, title, copy, to }) => (
              <Link
                key={title}
                to={to}
                className="group flex flex-col rounded-[10px] border border-beige bg-ivory p-7 transition-colors hover:border-gold/60"
              >
                <span className="grid h-[72px] w-[72px] place-items-center rounded-full border border-gold/55 text-gold">
                  <Icon size={30} strokeWidth={1.4} />
                </span>
                <h3 className="card-title mt-6 text-charcoal">{title}</h3>
                <p className="mt-3 text-[13px] leading-[1.55] text-[#444A45]">{copy}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-gold">
                  Explore <ArrowRight size={15} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-forest py-12 text-[#F8F5F1]">
        <div className={cn(WIDE, "flex flex-wrap items-center justify-between gap-8")}>
          <div>
            <h2 className="font-display text-[36px] font-semibold leading-[1.05] text-gold-soft">Be first in line.</h2>
            <p className="mt-2 max-w-[420px] text-[14px] leading-[1.55] text-[#C8CFC9]">
              SQOOT Pure is launching soon. Join the waitlist to get early access and updates.
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
