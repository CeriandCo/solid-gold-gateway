import { createFileRoute } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  Award,
  Baby,
  Check,
  Gift,
  Globe2,
  GraduationCap,
  Heart,
  HeartHandshake,
  Landmark,
  LockKeyhole,
  PartyPopper,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import heroGift from "@/assets/gifting-hero-product-final.jpg";
import engravedGold from "@/assets/gold-bar-velvet-marble-branded.png";
import giftCard from "@/assets/gifting-phone-gold-bar-enhanced.png";
import boxedGold from "@/assets/gifting-legacy-gold-refined.jpg";
import weddingPhoto from "@/assets/gifting-beautifully-packaged.jpg";
import arrivalsPhoto from "@/assets/gifting-hero-product-refined.jpg";
import birthdayPhoto from "@/assets/path-coin.jpg";
import achievementPhoto from "@/assets/path-fractional.jpg";
import festivalPhoto from "@/assets/band-gold.jpg";
import familyPhoto from "@/assets/path-vault.jpg";

export const Route = createFileRoute("/gifting-new")({
  head: () => ({
    meta: [
      { title: "Gift Real Gold — SQOOT Pure" },
      {
        name: "description",
        content:
          "Celebrate life's most precious moments with real gold, personalised and beautifully delivered by SQOOT Pure.",
      },
      { property: "og:title", content: "Gift Real Gold — SQOOT Pure" },
      {
        property: "og:description",
        content: "A thoughtful, meaningful and timeless gift of real gold.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://solid-gold-gateway.lovable.app/gifting-new" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://solid-gold-gateway.lovable.app/gifting-new" }],
  }),
  component: GiftingNewPage,
});

function Mandala({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="none">
      <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="1" />
      <path
        d="M16 2.5c2.7 3.7 3.5 6.7 0 10-3.5-3.3-2.7-6.3 0-10ZM16 29.5c-2.7-3.7-3.5-6.7 0-10 3.5 3.3 2.7 6.3 0 10ZM2.5 16c3.7-2.7 6.7-3.5 10 0-3.3 3.5-6.3 2.7-10 0ZM29.5 16c-3.7 2.7-6.7 3.5-10 0 3.3-3.5 6.3-2.7 10 0ZM6.45 6.45c4.5.7 7.2 2.25 7.1 7.1-4.85.1-6.4-2.6-7.1-7.1ZM25.55 25.55c-4.5-.7-7.2-2.25-7.1-7.1 4.85-.1 6.4 2.6 7.1 7.1ZM25.55 6.45c-.7 4.5-2.25 7.2-7.1 7.1-.1-4.85 2.6-6.4 7.1-7.1ZM6.45 25.55c.7-4.5 2.25-7.2 7.1-7.1.1 4.85-2.6 6.4-7.1 7.1Z"
        stroke="currentColor"
        strokeWidth="0.85"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="12.75" stroke="currentColor" strokeWidth="0.55" />
    </svg>
  );
}

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const features: Feature[] = [
  { icon: Gift, title: "Meaningful", description: "A timeless symbol of love and blessings" },
  { icon: ShieldCheck, title: "Real & Secure", description: "Real gold, fully insured in U.S. vaults" },
  { icon: HeartHandshake, title: "Personalised", description: "Add a name, message or special date" },
  { icon: Truck, title: "Beautifully Delivered", description: "Premium packaging, ready to gift" },
  { icon: RefreshCw, title: "Redeemable", description: "Redeem or upgrade anytime" },
  { icon: Globe2, title: "Global Access", description: "Send love anywhere in the world" },
];

const occasions = [
  { label: "Weddings", image: weddingPhoto, icon: Heart },
  { label: "New Arrivals", image: arrivalsPhoto, icon: Baby },
  { label: "Birthdays", image: birthdayPhoto, icon: PartyPopper },
  { label: "Achievements", image: achievementPhoto, icon: GraduationCap },
  { label: "Festivals", image: festivalPhoto, icon: Sparkles },
  { label: "Family Milestones", image: familyPhoto, icon: Award },
];

const assurances: Feature[] = [
  { icon: Landmark, title: "100% Real Gold", description: "Allocated, audited and insured" },
  { icon: ShieldCheck, title: "Secure Vaulted", description: "Stored in fully insured U.S. vaults" },
  { icon: LockKeyhole, title: "Fully Insured", description: "Your gold is protected every step of the way" },
  { icon: RefreshCw, title: "Redeem or Upgrade", description: "Redeem, sell or upgrade at any time" },
  { icon: Globe2, title: "Send Anywhere", description: "Delivered globally with care and discretion" },
];

function GiftingNewPage() {
  return (
    <main className="bg-warm-white font-['DM_Sans'] text-charcoal">
      <SiteHeader />

      <section className="bg-forest-deep text-warm-white">
        <div className="mx-auto grid min-h-[650px] max-w-[1440px] lg:grid-cols-[55%_45%]">
          <div className="flex items-center px-5 py-16 sm:px-10 lg:px-16 lg:py-20 xl:px-24">
            <div className="max-w-[590px]">
              <div className="flex items-center gap-3 text-gold-soft">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">Gifting gold</p>
                <Mandala className="h-5 w-5" />
              </div>
              <h1 className="mt-6 font-display text-[52px] font-semibold leading-[0.93] text-warm-white sm:text-[66px] lg:text-[76px] xl:text-[84px]">
                Celebrate love
                <span className="block">with a gift</span>
                <span className="block italic text-gold-soft">that lasts.</span>
              </h1>
              <p className="mt-7 max-w-[470px] text-[15px] leading-[1.75] text-warm-white/75 sm:text-base">
                Thoughtful, meaningful and timeless. Real gold that marks life&apos;s most precious moments.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="#occasions"
                  className="inline-flex h-12 items-center justify-center rounded-sm bg-gold px-7 text-[13px] font-semibold text-forest-deep transition-colors hover:bg-gold-soft"
                >
                  Explore Gifting <span className="ml-2">→</span>
                </a>
                <a
                  href="#personalise"
                  className="inline-flex h-12 items-center justify-center rounded-sm border border-gold/60 px-7 text-[13px] font-medium text-warm-white transition-colors hover:border-gold hover:text-gold-soft"
                >
                  How it Works <span className="ml-2 text-[10px]">▶</span>
                </a>
              </div>
            </div>
          </div>
          <div className="relative min-h-[440px] overflow-hidden lg:min-h-full">
            <img
              src={heroGift}
              alt="SQOOT Pure green gift box with ribbon, gold bar and white flowers"
              width={1600}
              height={1200}
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-28 bg-linear-to-r from-forest-deep to-transparent lg:block" />
          </div>
        </div>
      </section>

      <section className="border-b border-beige bg-ivory">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 px-5 sm:grid-cols-3 sm:px-8 lg:grid-cols-6 lg:px-10">
          {features.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="flex min-h-[174px] flex-col items-center justify-center border-b border-beige px-3 py-7 text-center even:border-l sm:[&:nth-child(3n+2)]:border-l sm:[&:nth-child(3n+3)]:border-l lg:border-b-0 lg:border-l lg:first:border-l-0"
            >
              <Icon className="h-7 w-7 text-gold" strokeWidth={1.35} />
              <h2 className="mt-3 font-sans text-[13px] font-semibold text-forest-deep">{title}</h2>
              <p className="mt-1.5 max-w-[165px] text-[11px] leading-[1.55] text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="occasions" className="bg-warm-white px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1320px]">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 text-gold">
              <span className="h-px w-8 bg-gold/50" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em]">For every occasion</p>
              <Mandala className="h-5 w-5" />
              <span className="h-px w-8 bg-gold/50" />
            </div>
            <h2 className="mt-5 font-display text-[40px] font-medium leading-tight text-forest-deep sm:text-[52px]">
              Mark life&apos;s most precious moments
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
            {occasions.map(({ label, image, icon: Icon }, index) => (
              <article key={label} className="min-w-0">
                <div className="relative aspect-[4/5] overflow-visible">
                  <img
                    src={image}
                    alt={`${label} gold gifting inspiration`}
                    width={520}
                    height={650}
                    loading="lazy"
                    className="h-full w-full rounded-sm object-cover"
                  />
                  <span className="absolute -bottom-5 left-4 grid h-10 w-10 place-items-center rounded-full border border-gold/35 bg-warm-white text-gold shadow-sm">
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.35} />
                  </span>
                </div>
                <h3 className="mt-8 truncate font-sans text-[13px] font-semibold text-forest-deep">{label}</h3>
                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">0{index + 1}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a href="#personalise" className="border-b border-gold/40 pb-1 text-[13px] font-semibold text-gold transition-colors hover:text-gold-dark">
              View all occasions →
            </a>
          </div>
        </div>
      </section>

      <section id="personalise" className="grid bg-ivory lg:grid-cols-2">
        <div className="flex items-center px-5 py-16 sm:px-10 lg:px-16 lg:py-24 xl:px-24">
          <div className="max-w-[540px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">Make it personal</p>
            <h2 className="mt-5 font-display text-[40px] font-medium leading-[1.05] text-forest-deep sm:text-[50px]">
              Add a personal touch that will be remembered forever.
            </h2>
            <p className="mt-6 max-w-[485px] text-[14px] leading-[1.75] text-muted-foreground sm:text-[15px]">
              Engrave a name, date or message to make your gift truly unique and unforgettable.
            </p>
            <ul className="mt-7 space-y-3">
              {["Name, initial, date or short message", "Beautiful engraving on gold", "Premium gift packaging", "Include a personalised note"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[13px] font-medium text-forest-deep sm:text-sm">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-forest-deep text-warm-white">
                    <Check className="h-3 w-3" strokeWidth={2} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="#closing-gift"
              className="mt-9 inline-flex h-12 items-center justify-center rounded-sm bg-forest-deep px-7 text-[13px] font-semibold text-warm-white transition-colors hover:bg-forest"
            >
              Personalise Your Gift <span className="ml-2">→</span>
            </a>
          </div>
        </div>

        <div className="grid min-h-[620px] grid-cols-[62%_38%] grid-rows-2 gap-2 bg-forest-deep p-2 sm:gap-3 sm:p-3">
          <img
            src={engravedGold}
            alt="Personalised engraved gold bar on dark velvet"
            width={900}
            height={1200}
            loading="lazy"
            className="row-span-2 h-full w-full rounded-sm object-cover"
          />
          <img
            src={giftCard}
            alt="SQOOT Pure personalised gift card and presentation"
            width={700}
            height={520}
            loading="lazy"
            className="h-full w-full rounded-sm object-cover object-left"
          />
          <img
            src={boxedGold}
            alt="Gold bar in premium SQOOT Pure gift packaging"
            width={700}
            height={520}
            loading="lazy"
            className="h-full w-full rounded-sm object-cover"
          />
        </div>
      </section>

      <section className="border-y border-gold/20 bg-forest-deep text-warm-white">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-5 lg:px-0">
          {assurances.map(({ icon: Icon, title, description }) => (
            <article key={title} className="flex min-h-[185px] items-start gap-4 border-b border-gold/15 px-5 py-9 sm:border-l sm:first:border-l-0 lg:border-b-0 lg:first:border-l-0">
              <Icon className="mt-0.5 h-7 w-7 shrink-0 text-gold-soft" strokeWidth={1.25} />
              <div>
                <h2 className="font-sans text-[13px] font-semibold text-gold-soft">{title}</h2>
                <p className="mt-2 text-[11px] leading-[1.6] text-warm-white/65">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="closing-gift" className="relative isolate min-h-[590px] overflow-hidden text-warm-white">
        <img
          src={boxedGold}
          alt="Boxed gold bar with ribbon arranged as a lasting gift"
          width={1800}
          height={1100}
          loading="lazy"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-forest-deep/70" />
        <div className="mx-auto flex min-h-[590px] max-w-[1320px] items-center px-5 py-20 sm:px-8 lg:px-16">
          <div className="max-w-[650px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-soft">A gift that lasts generations</p>
            <h2 className="mt-5 font-display text-[48px] font-medium leading-[0.98] text-warm-white sm:text-[64px]">
              More than a gift.
              <span className="block italic text-gold-soft">A legacy of love.</span>
            </h2>
            <p className="mt-6 max-w-[510px] text-[15px] leading-[1.75] text-warm-white/75">
              Give real gold that will be cherished today and passed down through generations.
            </p>
            <a
              href="#top"
              className="mt-9 inline-flex h-12 items-center justify-center rounded-sm bg-gold px-7 text-[13px] font-semibold text-forest-deep transition-colors hover:bg-gold-soft"
            >
              Start Gifting Gold <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}