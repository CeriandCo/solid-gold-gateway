import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, Layers, ShieldCheck, UserRound, Warehouse } from "lucide-react";
import { Eyebrow, GoldButton, GoldRule, STD, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { cn } from "@/lib/utils";
import fractionalImage from "@/assets/path-fractional.jpg";

export const Route = createFileRoute("/fractional-gold")({
  head: () => ({
    meta: [
      { title: "Fractional Gold — Own Real Gold from $25 | SQOOT Pure" },
      {
        name: "description",
        content:
          "Start owning physical gold from $25. Fully allocated, insured and redeemable — never pooled, never a paper promise.",
      },
      { property: "og:title", content: "Fractional Gold — Own Real Gold from $25 | SQOOT Pure" },
      {
        property: "og:description",
        content: "Real, allocated gold from $25. Insured storage, redemption on your schedule.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FractionalGoldPage,
});

const points = [
  { icon: Layers, title: "From $25", copy: "Start with an amount that suits you. Add more whenever you choose." },
  { icon: UserRound, title: "Allocated to you", copy: "Your gold is recorded in your name. Never pooled, never lent out." },
  { icon: Warehouse, title: "Insured US vaults", copy: "Held at IDS facilities with full value, all-risk insurance." },
  { icon: ShieldCheck, title: "Redeem anytime", copy: "Sell back or request physical delivery whenever you’re ready." },
] as const;

const compare = [
  ["SQOOT Pure fractional gold", true],
  ["Backed by specific physical metal", true],
  ["Allocated in your name", true],
  ["Redeemable for physical delivery", true],
  ["Not an ETF or paper claim", true],
] as const;

function FractionalGoldPage() {
  return (
    <main id="top" className="bg-background text-charcoal">
      <SiteHeader />

      {/* Hero */}
      <section className="bg-ivory">
        <div className={cn(STD, "grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20")}>
          <div>
            <Eyebrow>Fractional Gold</Eyebrow>
            <GoldRule />
            <h1
              className="mt-5 font-display font-semibold text-charcoal"
              style={{ fontSize: "clamp(36px, 4vw, 58px)", lineHeight: "1.04", letterSpacing: "-0.02em" }}
            >
              Gold ownership,
              <br />
              made <em className="font-semibold italic text-gold">accessible.</em>
            </h1>
            <p className="mt-6 max-w-[480px] text-[17px] font-medium leading-[30px] text-[#2C332E]">
              Own real, physical gold from $25. Every fraction is backed by specific metal
              in an insured vault — allocated to you, redeemable on your schedule.
            </p>
            <div className="mt-8">
              <GoldButton href="/vault#early-access" className="h-[54px] bg-gradient-to-b from-gold-soft to-gold px-8 text-[15px] font-bold">
                Get Early Access <ArrowRight size={17} strokeWidth={2.25} />
              </GoldButton>
            </div>
          </div>
          <img
            src={fractionalImage}
            alt="Fractional gold pieces arranged on dark stone"
            className="h-[280px] w-full rounded-[10px] object-cover sm:h-[380px]"
          />
        </div>
      </section>

      {/* Why fractional */}
      <section className="bg-background py-14 lg:py-20">
        <div className={STD}>
          <Eyebrow>Why fractional</Eyebrow>
          <GoldRule />
          <h2 className="section-title mt-5 text-charcoal">Small amounts. Same real gold.</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {points.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="rounded-[10px] border border-beige bg-ivory p-7">
                <span className="grid h-[72px] w-[72px] place-items-center rounded-full border border-gold/55 text-gold">
                  <Icon size={30} strokeWidth={1.4} />
                </span>
                <h3 className="card-title mt-6 text-charcoal">{title}</h3>
                <p className="mt-3 text-[13px] leading-[1.55] text-[#444A45]">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Real vs paper */}
      <section className="bg-ivory py-14 lg:py-20">
        <div className={cn(STD, "grid gap-10 lg:grid-cols-[38%_1fr]")}>
          <div>
            <Eyebrow>Real, not paper</Eyebrow>
            <GoldRule />
            <h2 className="section-title mt-5 text-charcoal">Not an ETF. Not a claim. Metal.</h2>
            <p className="mt-4 max-w-[420px] text-[13px] leading-[1.5] text-[#444A45]">
              Fractional doesn’t mean fictional. Your balance corresponds to physical gold
              held in custody — documented, insured and yours.
            </p>
          </div>
          <ul className="grid content-center gap-3">
            {compare.map(([label]) => (
              <li key={label} className="flex items-center gap-3 rounded-[6px] border border-beige bg-background px-5 py-4 text-sm font-medium text-charcoal">
                <Check size={17} strokeWidth={2.5} className="shrink-0 text-gold" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-12 text-[#F8F5F1]">
        <div className={cn(STD, "flex flex-wrap items-center justify-between gap-8")}>
          <div>
            <h2 className="font-display text-[36px] font-semibold leading-[1.05] text-gold-soft">Start from $25.</h2>
            <p className="mt-2 max-w-[420px] text-[14px] leading-[1.55] text-[#C8CFC9]">
              Join the waitlist and be among the first to own fractional gold with SQOOT Pure.
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
