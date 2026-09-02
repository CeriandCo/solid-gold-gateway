import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
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
  Menu,
  X,
} from "lucide-react";

function AppleIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M17.05 12.536c-.049-2.744 2.252-4.057 2.353-4.12-1.29-1.868-3.295-2.124-4.002-2.15-1.677-.174-3.298.994-4.158.994-.878 0-2.205-.973-3.634-.945-1.858.029-3.597 1.091-4.55 2.763-1.952 3.369-.504 8.329 1.375 11.043.93 1.33 2.03 2.818 3.474 2.765 1.399-.057 1.925-.9 3.614-.9 1.67 0 2.158.9 3.61.865 1.499-.024 2.45-1.35 3.35-2.69.91-1.31 1.28-2.59 1.298-2.655-.03-.011-2.49-.95-2.53-3.77zm-2.39-6.78c.76-.933 1.274-2.218 1.132-3.506-1.096-.046-2.44.72-3.23 1.65-.703.826-1.32 2.155-1.155 3.438 1.223.095 2.477-.616 3.253-1.582z"
      />
    </svg>
  );
}

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M3 20.5V3.5c0-.83.94-1.3 1.6-.82l14.57 8.5c.6.35.6 1.18 0 1.53L4.6 21.32c-.66.48-1.6.01-1.6-.82z"
      />
    </svg>
  );
}

function AppStoreBadge({ store }: { store: "apple" | "google" }) {
  const isApple = store === "apple";
  return (
    <a
      href="#"
      className="flex items-center gap-2 rounded-sm border border-warm-white/30 bg-warm-white/5 px-3 py-2 text-warm-white transition-colors hover:border-gold hover:text-gold"
    >
      {isApple ? (
        <AppleIcon className="h-5 w-5 shrink-0" />
      ) : (
        <PlayIcon className="h-5 w-5 shrink-0" />
      )}
      <div className="leading-none">
        <p className="text-[0.55rem] opacity-75">
          {isApple ? "Download on the" : "Get it on"}
        </p>
        <p className="mt-0.5 text-[0.75rem] font-medium">
          {isApple ? "App Store" : "Google Play"}
        </p>
      </div>
    </a>
  );
}

import heroBackground from "@/assets/hero-with-mandala.png.asset.json";
import appShowcase from "@/assets/app-showcase.png.asset.json";
import pathCoin from "@/assets/path-coin.jpg";
import pathFractional from "@/assets/path-fractional.jpg";
import pathVault from "@/assets/path-vault.jpg";
import bandGold from "@/assets/band-gold.jpg";
import logoUrl from "@/assets/sqoot-pure-logo.png";

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

const nav = [
  { label: "Buy Gold", to: "/precious-metal" },
  { label: "Vault", to: "/vault" },
  { label: "Fractional", to: "/fractional-gold" },
  { label: "Learn", to: "/learn" },
] as const;

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

const faqs = [
  {
    q: "Is the gold real physical gold?",
    a: "Yes. All gold purchased through SQOOT Pure is real, allocated physical gold, stored in insured U.S. vaults or shipped to you. This is not an ETF, a token, or paper exposure.",
  },
  {
    q: 'What does "allocated" gold mean?',
    a: "Allocated gold means the metal is specifically assigned to you and held in your name. You own the physical bullion directly rather than a share of a pooled holding.",
  },
  {
    q: "Can I request delivery of my gold?",
    a: "Yes. Vaulted gold can be redeemed and shipped on demand. SQOOT Pure combines the convenience of secure vault storage with the finality of physical ownership.",
  },
  {
    q: "Where is the gold stored?",
    a: "All gold is stored in fully insured, institutional-grade vaults located within the United States and protected through third-party audited custody infrastructure.",
  },
  {
    q: "How is pricing calculated?",
    a: "SQOOT Pure uses transparent live spot pricing with a simple, flat fee structure. No hidden dealer markups and no complicated pricing models.",
  },
  {
    q: "How small can a fractional purchase be?",
    a: "Fractional purchases start at ½ oz at live spot pricing, and you can add to your holding in the increments that suit you.",
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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="legacy-home min-h-screen bg-warm-white">
      {/* Header + Hero */}
      <header className="relative isolate overflow-hidden bg-forest-deep text-warm-white">
        <img
          src={heroBackground.url}
          alt="Gold coin, bars and SQOOT Pure presentation box on a marble table with white flowers"
          width={1920}
          height={1280}
          className="absolute inset-0 -z-20 h-full w-full object-cover object-left"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(95deg,color-mix(in_oklab,var(--forest-deep)_72%,transparent)_0%,color-mix(in_oklab,var(--forest-deep)_45%,transparent)_32%,color-mix(in_oklab,var(--forest-deep)_18%,transparent)_54%,transparent_78%)]" />

        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-5">
          <img src={logoUrl} alt="SQOOT Pure" className="h-12 w-auto" />
          <nav className="hidden items-center gap-9 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-[0.8rem] text-warm-white/85 transition-colors hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 lg:flex">
              <AppStoreBadge store="apple" />
              <AppStoreBadge store="google" />
            </div>
            <button
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-sm border border-warm-white/25 p-2.5 text-warm-white/80 transition-colors hover:border-gold hover:text-gold lg:hidden"
            >
              {menuOpen ? (
                <X strokeWidth={1.25} className="h-5 w-5" />
              ) : (
                <Menu strokeWidth={1.25} className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="border-t border-warm-white/10 bg-forest-deep/80 backdrop-blur-sm lg:hidden">
            <ul className="mx-auto max-w-[1200px] px-6 py-2">
              {nav.map((item) => (
                <li key={item} className="border-b border-warm-white/10 last:border-b-0">
                  <a
                    href="#paths"
                    onClick={() => setMenuOpen(false)}
                    className="block py-4 text-sm text-warm-white/85 transition-colors hover:text-gold"
                  >
                    {item}
                  </a>
                </li>
              ))}
              <li className="border-b border-warm-white/10 py-4">
                <div className="flex flex-wrap gap-2">
                  <AppStoreBadge store="apple" />
                  <AppStoreBadge store="google" />
                </div>
              </li>
            </ul>
          </nav>
        )}

        <div className="mx-auto max-w-[1200px] px-6 pb-24 pt-14 sm:pt-20 lg:pb-32">
          <div className="max-w-[36rem]">
            <p className="eyebrow text-gold">Real Gold. Real Ownership.</p>
            <h1 className="mt-6 overflow-hidden font-display text-[2.25rem] leading-[1.05] text-warm-white sm:text-[4.5rem]">
              Own gold <br className="hidden sm:inline" />
              the way it was <br className="hidden sm:inline" />
              <em className="not-italic font-display italic text-gold">meant to be.</em>
            </h1>
            <div className="rule-ornament mt-9 text-gold">
              <Mark className="h-4 w-4 shrink-0" />
            </div>
            <p className="mt-8 max-w-[30rem] text-[0.9rem] leading-[1.85] text-warm-white/75">
              Buy real allocated gold from ½ oz at live spot pricing. Take delivery of a coin, build a fractional
              holding, or keep it securely stored in insured U.S. vaults — redeemable on demand.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#paths"
                className="rounded-sm bg-gold px-7 py-3 text-[0.8rem] font-medium tracking-wide text-forest-deep transition-colors hover:bg-gold-soft"
              >
                Buy Gold
              </a>
              <a
                href="#vault"
                className="rounded-sm border border-warm-white/45 bg-warm-white/5 px-7 py-3 text-[0.8rem] tracking-wide text-warm-white transition-colors hover:border-gold hover:text-gold"
              >
                See the Vault
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Assurance strip */}
      <section className="border-b border-border bg-forest-deep">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 px-6 sm:grid-cols-2 lg:grid-cols-4">
          {assurances.map(({ icon: Icon, title, copy }) => (
            <div
              key={title}
              className="flex items-start gap-4 border-b border-warm-white/10 px-2 py-8 last:border-b-0 sm:px-7 sm:[&:nth-child(-n+2)]:border-b lg:border-b-0 lg:border-l lg:first:border-l-0 lg:py-9"
            >
              <Icon strokeWidth={1} className="mt-0.5 h-6 w-6 shrink-0 text-gold" />
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
        <div className="mx-auto max-w-[1200px] px-6 text-center">
          <img
            src={appShowcase.url}
            alt="SQOOT Pure app screens showing portfolio, buy gold, gold price, and vault views"
            loading="lazy"
            width={1920}
            height={1080}
            className="w-full rounded-lg"
          />
          <div className="mt-10 sm:mt-14">
            <p className="eyebrow text-gold">Early access</p>
            <h2 className="mt-4 font-display text-[2rem] leading-tight text-forest sm:text-[2.75rem]">
              Gold ownership, in your pocket.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Be the first to experience the SQOOT Pure app. Buy, track, and manage your gold from anywhere.
            </p>
            <a
              href="#"
              className="mt-8 inline-block rounded-sm bg-forest px-8 py-3 text-[0.8rem] font-medium tracking-wide text-warm-white transition-colors hover:bg-forest-deep"
            >
              Join for early access
            </a>
          </div>
        </div>
      </section>

      {/* Three paths */}
      {/* <section id="paths" className="bg-cream py-24">
        <div className="mx-auto max-w-[1200px] px-6">
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
      {/* <section className="bg-forest py-24">
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
                    isOpen ? "border-gold bg-gold-soft" : "border-warm-white/15 bg-forest-deep"
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
                      <Minus strokeWidth={1} className="mt-0.5 h-4 w-4 shrink-0 text-forest-deep" />
                    ) : (
                      <Plus strokeWidth={1} className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    )}
                  </button>
                  {isOpen && <p className="mt-4 text-xs leading-relaxed text-forest-deep/80">{f.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section> */}

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

      {/* Footer */}
      <footer className="bg-forest-deep py-16 text-warm-white">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <img src={logoUrl} alt="SQOOT Pure" className="h-14 w-auto" />
            <p className="mt-6 max-w-xs text-xs leading-relaxed text-warm-white/55">
              A compliance-first platform for buying, storing, and redeeming real physical gold.
            </p>
          </div>
          {[
            { h: "Discover More", l: ["Buy Gold", "Fractional", "Vault", "Learn"] },
            { h: "Company", l: ["About Us", "Security", "Trust Center", "Help Center"] },
            { h: "Legal", l: ["Terms of Service", "Data Privacy Policy", "Disclosures"] },
          ].map((col) => (
            <div key={col.h}>
              <p className="eyebrow text-gold">{col.h}</p>
              <ul className="mt-5 space-y-3">
                {col.l.map((l) => (
                  <li key={l}>
                    <a href="#paths" className="text-xs text-warm-white/65 hover:text-gold">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-14 max-w-[1200px] border-t border-warm-white/10 px-6 pt-6">
          <p className="text-xs text-warm-white/40">© {new Date().getFullYear()} SQOOT Pure. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
