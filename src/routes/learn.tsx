import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Coins, Scale, ShieldCheck, Warehouse } from "lucide-react";
import { Eyebrow, GoldButton, GoldRule, STD, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn — Gold Ownership, Explained | SQOOT Pure" },
      {
        name: "description",
        content:
          "Plain-language guides to buying, storing and owning physical gold — allocation, vault storage, fees and redemption explained.",
      },
      { property: "og:title", content: "Learn — Gold Ownership, Explained | SQOOT Pure" },
      {
        property: "og:description",
        content: "Plain-language guides to real gold ownership, storage and fees.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LearnPage,
});

const topics = [
  {
    icon: Coins,
    tag: "Getting started",
    title: "What does it mean to actually own gold?",
    copy: "The difference between physical metal, ETFs and unallocated accounts — and why it matters.",
  },
  {
    icon: Scale,
    tag: "Ownership",
    title: "Allocated vs. pooled: the distinction that protects you",
    copy: "Why metal recorded in your name behaves very differently from a share of a pool.",
  },
  {
    icon: Warehouse,
    tag: "Storage",
    title: "Inside an insured US vault",
    copy: "How professional depositories store, insure and document your holdings.",
  },
  {
    icon: ShieldCheck,
    tag: "Fees",
    title: "Storage fees, explained without the fine print",
    copy: "Pro-rata billing, minimum charges and what you actually pay — with worked examples.",
  },
  {
    icon: BookOpen,
    tag: "Redemption",
    title: "Selling back or taking delivery",
    copy: "How redemption works, how long it takes, and what to expect at each step.",
  },
  {
    icon: Coins,
    tag: "Fractional",
    title: "Starting small: gold from $25",
    copy: "How fractional ownership lets you build a real position over time.",
  },
] as const;

function LearnPage() {
  return (
    <main id="top" className="bg-background text-charcoal">
      <SiteHeader />

      {/* Hero */}
      <section className="bg-ivory">
        <div className={cn(STD, "max-w-[860px] py-16 lg:py-24")}>
          <Eyebrow>Learn</Eyebrow>
          <GoldRule />
          <h1
            className="mt-5 font-display font-semibold text-charcoal"
            style={{ fontSize: "clamp(36px, 4vw, 58px)", lineHeight: "1.04", letterSpacing: "-0.02em" }}
          >
            Gold ownership,
            <em className="font-semibold italic text-gold"> explained plainly.</em>
          </h1>
          <p className="mt-6 max-w-[640px] text-[17px] font-medium leading-[30px] text-[#2C332E]">
            No jargon, no fine print. Short guides to how buying, storing and redeeming
            physical gold actually works — so you can decide with confidence.
          </p>
        </div>
      </section>

      {/* Topics */}
      <section className="bg-background py-14 lg:py-20">
        <div className={STD}>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {topics.map(({ icon: Icon, tag, title, copy }) => (
              <article key={title} className="flex flex-col rounded-[10px] border border-beige bg-ivory p-7">
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-gold">{tag}</span>
                  <Icon size={22} strokeWidth={1.4} className="text-gold" />
                </div>
                <h2 className="card-title mt-4 text-charcoal">{title}</h2>
                <p className="mt-3 text-[13px] leading-[1.55] text-[#444A45]">{copy}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-gold">
                  Read guide <ArrowRight size={15} strokeWidth={1.5} />
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-12 text-[#F8F5F1]">
        <div className={cn(STD, "flex flex-wrap items-center justify-between gap-8")}>
          <div>
            <h2 className="font-display text-[36px] font-semibold leading-[1.05] text-gold-soft">Knowledge first. Then gold.</h2>
            <p className="mt-2 max-w-[420px] text-[14px] leading-[1.55] text-[#C8CFC9]">
              Join the waitlist for early access and new guides as they’re published.
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
