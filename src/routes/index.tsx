import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Truck,
  PieChart,
  Landmark,
  ShieldCheck,
  BadgeCheck,
  Scale,
  FileText,
  Plus,
  Minus,
} from "lucide-react";
import { GoldButton, SiteFooter, SiteNav } from "@/components/site-chrome";

import heroBackground from "@/assets/hero-v1-goc.png.asset.json";
import appShowcase from "@/assets/app-showcase.png.asset.json";
import pathCoin from "@/assets/path-coin.jpg";
import pathFractional from "@/assets/path-fractional.jpg";
import pathVault from "@/assets/path-vault.jpg";
import bandGold from "@/assets/band-gold.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SQOOT Pure — Own Real Gold, Three Ways" },
      {
        name: "description",
        content:
          "Buy a physical coin delivered home, buy fractional gold from ½ oz, or store allocated gold in insured U.S. vaults. Real ownership, at live spot pricing.",
      },
      { property: "og:title", content: "SQOOT Pure — Own Real Gold, Three Ways" },
      {
        property: "og:description",
        content:
          "Coins delivered home, fractional gold, or insured vault storage. Allocated, audited, redeemable on demand.",
      },
    ],
  }),
  component: Index,
});

const paths = [
  {
    n: "01",
    icon: Truck,
    title: "Coin, delivered home",
    image: pathCoin,
    copy: "Choose a sovereign-minted coin, insured and discreetly shipped to your door in premium packaging. Yours to hold, from the moment it arrives.",
    points: ["Sovereign-minted bullion", "Insured, discreet delivery", "Certificate of authenticity"],
    cta: "Browse coins",
  },
  {
    n: "02",
    icon: PieChart,
    title: "Fractional gold",
    image: pathFractional,
    copy: "Own real gold from ½ oz at live spot pricing. Build a position in the increments that suit you, with no dealer markups or hidden structure.",
    points: ["From ½ oz at spot", "Transparent live pricing", "Add to your holding anytime"],
    cta: "Start fractional",
  },
  {
    n: "03",
    icon: Landmark,
    title: "Vaulted storage",
    image: pathVault,
    copy: "Buy physical gold and leave it in institutional-grade custody. Allocated in your name, fully insured, third-party audited, redeemable on demand.",
    points: ["Allocated in your name", "Insured U.S. vaults", "Redeem or deliver anytime"],
    cta: "Explore the vault",
  },
];

const assurances = [
  { icon: BadgeCheck, title: "100% Real Gold", copy: "Physical bullion, never a note or an ETF." },
  { icon: ShieldCheck, title: "Fully Insured", copy: "Covered in transit and in storage." },
  { icon: Scale, title: "Live Spot Pricing", copy: "No dealer markups or hidden spreads." },
  { icon: FileText, title: "Third-Party Audited", copy: "Independently verified holdings." },
];

const faqs: { q: string; a: ReactNode }[] = [
  {
    q: "Is Sqoot available now?",
    a: "Not yet. Sqoot is currently in pre-launch mode. You can join the waitlist, but accounts, payments, gold purchases, and other transactions are not available yet.",
  },
  {
    q: "Is the gold real?",
    a: "Yes. Sqoot is built around real physical gold held in professional vault storage, not cryptocurrency, a digital token, or an ETF. Full ownership and custody details will be published before launch.",
  },
  {
    q: "Where does the gold come from?",
    a: "Sqoot's gold is supplied through Dillon Gage, a U.S. precious-metals wholesaler and refiner. Dillon Gage applies OECD-aligned due diligence to its suppliers, prohibits sourcing connected to conflict or serious human-rights abuses, and reviews its precious-metals supply chain annually.",
  },
  {
    q: "What happens when I join the waitlist?",
    a: "We save the contact details you provide so we can send relevant product updates, educational content, surveys, and launch information. Joining the waitlist does not create a transactional account and does not mean you have purchased gold.",
  },
  {
    q: "Do I need to pay or provide bank details to join?",
    a: "No. Joining the waitlist is free. We will not ask you to fund an account or provide bank details while Sqoot remains in waitlist mode.",
  },
  {
    q: "Do I need to complete identity verification now?",
    a: "No. Identity verification is not required just to join the waitlist. Eligible customers will be asked to complete the required checks when account access and transactions become available.",
  },
  {
    q: "Does joining the waitlist guarantee access at launch?",
    a: "No. Waitlist members will receive launch updates, but access may depend on eligibility, identity verification, location, and product availability.",
  },
  {
    q: "When will Sqoot launch?",
    a: "We are working toward launch, but we will not promise a date before the product and its safeguards are ready. Waitlist members will receive an update when access begins.",
  },
  {
    q: "How will Sqoot protect my information?",
    a: (
      <>
        We handle waitlist information in accordance with our{" "}
        <Link to="/privacy" className="underline hover:text-forest">
          Privacy Policy
        </Link>
        , which covers the categories of data, recipients, retention, choices, and contact details.
      </>
    ),
  },
  {
    q: "Can I leave the waitlist?",
    a: (
      <>
        Yes. Use the unsubscribe link in any marketing email. For a privacy or deletion request, contact support@getsqoot.com or see our{" "}
        <Link to="/privacy" className="underline hover:text-forest">
          Privacy Policy
        </Link>
        {" "}for contact details.
      </>
    ),
  },
  {
    q: "Where can I ask another question?",
    a: "Contact support@getsqoot.com. Sqoot will never ask for a password, one-time code, or full bank credentials by email.",
  },
];

function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className}>
      <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="20" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <path
        d="M20 6 L24 20 L20 34 L16 20 Z M6 20 L20 16 L34 20 L20 24 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      />
    </svg>
  );
}


function Index() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="legacy-home min-h-screen bg-warm-white">
      {/* Header + Hero */}
      <header className="relative isolate overflow-hidden bg-forest-deep text-warm-white">
        <img
          src={heroBackground.url}
          alt="Gold bullion bars and a family photograph in a brass frame on a marble table in warm sunlight"
          width={1536}
          height={1024}
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[75%_center] lg:object-left"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(95deg,color-mix(in_oklab,var(--forest-deep)_78%,transparent)_0%,color-mix(in_oklab,var(--forest-deep)_58%,transparent)_30%,color-mix(in_oklab,var(--forest-deep)_34%,transparent)_52%,transparent_78%)]" />

        <SiteNav variant="overlay" />

        <div className="site-container pb-24 pt-14 sm:pt-20 lg:pb-32">
          <div className="max-w-[36rem]">
            <p className="eyebrow text-gold">GOLD, MADE PERSONAL.</p>
            <h1 className="mt-6 overflow-hidden font-display text-[2.25rem] leading-[1.05] text-warm-white sm:text-[4.5rem]">
              Own gold <br className="hidden sm:inline" />
              the way it was <br className="hidden sm:inline" />
              <em className="not-italic font-display italic text-gold">meant to be.</em>
            </h1>
            <div className="rule-ornament mt-9 text-gold">
              <Mark className="h-4 w-4 shrink-0" />
            </div>
            <p className="mt-8 max-w-[30rem] text-[0.9rem] leading-[1.85] text-warm-white/95 [text-shadow:0_1px_3px_rgba(0,0,0,0.45)]">
              Buy real gold, your way. Build your holding over time, keep it securely stored, take delivery when you
              choose, or gift gold to someone special.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <GoldButton href="#paths" className="h-[54px] px-8">Buy Gold</GoldButton>
              <a
                href="#vault"
                className="rounded-[2px] border border-warm-white/45 bg-warm-white/5 px-8 py-3 text-sm font-semibold tracking-[0.01em] text-warm-white shadow-[0_2px_8px_rgba(0,0,0,0.25)] transition-all hover:-translate-y-px hover:border-gold hover:text-gold hover:shadow-[0_4px_12px_rgba(0,0,0,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                See the Vault
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Value prop strip */}
      <section className="border-b border-warm-white/10 bg-forest-deep">
        <div className="site-container flex flex-wrap items-center justify-center gap-x-2 gap-y-3 py-4 sm:gap-x-4 sm:py-5">
          {[
            "START FROM US$25",
            "100% REAL GOLD",
            "LIVE SPOT PRICING",
            "SECURE U.S. STORAGE",
            "SELL WHEN YOU CHOOSE",
          ].map((item, i, arr) => (
            <div key={item} className="flex items-center gap-2 sm:gap-4">
              <span className="whitespace-nowrap text-[0.7rem] font-semibold tracking-[0.12em] text-gold sm:text-[0.75rem]">
                {item}
              </span>
              {i < arr.length - 1 && (
                <span className="hidden h-1 w-1 rounded-full bg-gold/40 sm:inline-block" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Assurance strip */}
      <section className="border-b border-border bg-forest-deep">
        <div className="site-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {assurances.map(({ icon: Icon, title, copy }) => (
            <div
              key={title}
              className="flex items-start gap-4 border-b border-warm-white/10 px-2 py-8 last:border-b-0 sm:px-7 sm:[&:nth-child(-n+2)]:border-b lg:border-b-0 lg:border-l lg:first:border-l-0 lg:py-9"
            >
              <Icon strokeWidth={1.5} className="mt-0.5 h-6 w-6 shrink-0 text-gold" />
              <div>
                <p className="text-[0.85rem] text-gold">{title}</p>
                <p className="mt-1.5 max-w-[15rem] text-[0.72rem] leading-relaxed text-warm-white/55">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* App showcase */}
      <section className="bg-cream py-16 sm:py-24">
        <img
          src={appShowcase.url}
          alt="SQOOT Pure app screens showing portfolio, buy gold, gold price, and vault views"
          loading="lazy"
          width={1920}
          height={1080}
          className="w-full"
        />
        <div className="site-container pt-10 text-center sm:pt-14">
          <p className="eyebrow text-gold">Early access</p>
          <h2 className="mt-4 font-display text-[2rem] leading-tight text-forest sm:text-[2.75rem]">
            Gold ownership, in your pocket.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Be the first to experience the SQOOT Pure app. Buy, track, and manage your gold from anywhere.
          </p>
          <GoldButton to="/early-access" className="mt-8 h-[54px] px-8">
            Join for early access
          </GoldButton>
        </div>
      </section>

      {/* Three paths */}
      {/* <section id="paths" className="bg-cream py-24">
        <div className="site-container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-gold">Three ways to own</p>
            <h2 className="mt-5 font-display text-[2.75rem] leading-tight text-forest">
              Choose how you hold it.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Every path is the same real, allocated metal — bought at live spot pricing and fully
              insured. The only difference is where it rests.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {paths.map(({ n, icon: Icon, title, image, copy, points, cta }) => (
              <article
                key={n}
                className="flex flex-col overflow-hidden rounded-lg border border-border bg-card"
              >
                <img
                  src={image}
                  alt={title}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="h-56 w-full object-cover"
                />
                <div className="flex flex-1 flex-col p-8">
                  <div className="flex items-center justify-between">
                    <Icon strokeWidth={1} className="h-8 w-8 text-forest" />
                    <span className="font-display text-2xl text-gold">{n}</span>
                  </div>
                  <h3 className="mt-6 font-display text-2xl text-forest">{title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{copy}</p>
                  <ul className="mt-6 space-y-2.5 border-t border-border pt-6">
                    {points.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-sm text-forest/80">
                        <span className="mt-2 h-px w-4 shrink-0 bg-gold" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#vault"
                    className="mt-8 inline-flex w-fit rounded-sm border border-forest px-6 py-3 text-sm text-forest transition-colors hover:bg-forest hover:text-warm-white"
                  >
                    {cta}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section> */}

      {/* Vault band */}
      {/* <section id="vault" className="relative isolate">
        <img
          src={bandGold}
          alt="Close detail of polished gold bullion under warm light"
          loading="lazy"
          width={1600}
          height={704}
          className="h-[26rem] w-full object-cover"
        />
        <div className="absolute inset-0 bg-forest-deep/70" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <p className="eyebrow text-gold">Institutional custody</p>
            <h2 className="mt-5 font-display text-[2.75rem] leading-tight text-warm-white">The Vault</h2>
            <p className="mt-5 text-sm leading-relaxed text-warm-white/75">
              Your gold is securely stored in fully insured U.S. vaults with institutional-grade custody and third-party
              auditing. Allocated, protected, and redeemable on demand.
            </p>
          </div>
        </div>
      </section> */}

      {/* FAQ */}
      <section className="bg-forest py-24">
        <div className="mx-auto max-w-[1000px] px-6">
          <div className="text-center">
            <p className="eyebrow text-gold">FAQs</p>
            <h2 className="mt-5 font-display text-[2.75rem] leading-tight text-warm-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={f.q}
                  className={`h-fit rounded-lg border p-6 transition-colors ${
                    isOpen ? "border-gold bg-gold-soft" : "border-warm-white/25 bg-warm-white/5"
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-start justify-between gap-4 text-left"
                  >
                    <span className={`text-sm font-medium ${isOpen ? "text-forest-deep" : "text-warm-white"}`}>
                      {f.q}
                    </span>
                    {isOpen ? (
                      <Minus strokeWidth={1.25} className="mt-0.5 h-4 w-4 shrink-0 text-forest-deep" />
                    ) : (
                      <Plus strokeWidth={1.25} className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    )}
                  </button>
                  {isOpen && <div className="mt-6 text-sm leading-relaxed text-forest-deep">{f.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing */}
      {/* <section className="bg-cream py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <p className="eyebrow text-gold">Built for modern wealth preservation</p>
          <h2 className="mt-5 font-display text-[2.75rem] leading-tight text-forest">Preserve what matters.</h2>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            Real gold, real ownership, and a modern way to hold it. Start with a coin, a fraction, or a vaulted
            position.
          </p>
          <a
            href="#paths"
            className="mt-10 inline-flex rounded-sm bg-forest px-9 py-3.5 text-sm text-warm-white transition-colors hover:bg-forest-deep"
          >
            Buy Gold
          </a>
        </div>
      </section> */}

      <SiteFooter />
    </div>
  );
}
