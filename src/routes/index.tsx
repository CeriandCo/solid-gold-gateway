import { createFileRoute } from "@tanstack/react-router";
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

import heroGold from "@/assets/hero-gold.jpg";
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

const nav = ["Buy Gold", "Vault", "Fractional", "Learn", "For Advisors"];

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

function Wordmark({ tone = "light" }: { tone?: "light" | "dark" }) {
  const color = tone === "light" ? "text-warm-white" : "text-forest";
  return (
    <div className={`flex items-center gap-3 ${color}`}>
      <Mark className="h-9 w-9 text-gold" />
      <div className="leading-none">
        <div className="font-display text-xl tracking-[0.18em]">SQOOT</div>
        <div className="eyebrow mt-1 text-gold">Pure</div>
      </div>
    </div>
  );
}

function Index() {
  const [open, setOpen] = useState<number | null>(0);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Header + Hero */}
      <header className="bg-forest text-warm-white">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-6">
          <Wordmark />
          <nav className="hidden items-center gap-10 lg:flex">
            {nav.map((item) => (
              <a key={item} href="#paths" className="text-sm text-warm-white/80 transition-colors hover:text-gold">
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button className="rounded-sm border border-gold/60 px-5 py-2.5 text-sm text-gold transition-colors hover:bg-gold hover:text-forest-deep sm:px-6">
              Log In
            </button>
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
          <nav className="border-t border-warm-white/10 lg:hidden">
            <ul className="mx-auto max-w-[1200px] px-6 py-2">
              {nav.map((item) => (
                <li key={item} className="border-b border-warm-white/10 last:border-b-0">
                  <a
                    href="#paths"
                    onClick={() => setMenuOpen(false)}
                    className="block py-4 text-sm text-warm-white/80 transition-colors hover:text-gold"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-6 pb-24 pt-10 lg:grid-cols-[1fr_1.05fr] lg:pb-32">
          <div>
            <p className="eyebrow text-gold">Real Gold. Real Ownership.</p>
            <h1 className="mt-6 max-w-[14ch] font-display text-[2.75rem] leading-[1.05] text-warm-white sm:max-w-none sm:text-[4.25rem]">
              Own gold the way <br className="hidden sm:inline" />
              it was meant <br className="hidden sm:inline" />
              to be owned.
            </h1>
            <div className="rule-ornament mt-8 text-gold">
              <Mark className="h-4 w-4 shrink-0" />
            </div>
            <p className="mt-8 max-w-md text-[0.95rem] leading-relaxed text-warm-white/70">
              Buy real allocated gold from ½ oz at live spot pricing. Take delivery of a coin, build a fractional
              holding, or keep it securely stored in insured U.S. vaults — redeemable on demand.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#paths"
                className="rounded-sm bg-gold px-8 py-3.5 text-sm font-medium text-forest-deep transition-colors hover:bg-gold-soft"
              >
                Buy Gold
              </a>
              <a
                href="#vault"
                className="rounded-sm border border-warm-white/40 px-8 py-3.5 text-sm text-warm-white transition-colors hover:border-gold hover:text-gold"
              >
                See the Vault
              </a>
            </div>
          </div>

          <img
            src={heroGold}
            alt="Fine gold bars and a bullion coin resting on deep green velvet"
            width={1280}
            height={960}
            className="rounded-lg object-cover shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]"
          />
        </div>
      </header>

      {/* Assurance strip */}
      <section className="border-b border-border bg-forest-deep">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-px px-6 lg:grid-cols-4">
          {assurances.map(({ icon: Icon, title, copy }) => (
            <div
              key={title}
              className="flex flex-col items-center gap-3 border-b border-warm-white/10 px-6 py-10 text-center odd:border-r last:border-b-0 lg:border-b-0 lg:border-l lg:odd:border-r-0 lg:last:border-r"
            >
              <Icon strokeWidth={1} className="h-7 w-7 text-gold" />
              <p className="text-sm text-gold">{title}</p>
              <p className="max-w-[16rem] text-xs leading-relaxed text-warm-white/60">{copy}</p>
            </div>
          ))}
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
            <Wordmark />
            <p className="mt-6 max-w-xs text-xs leading-relaxed text-warm-white/55">
              A compliance-first platform for buying, storing, and redeeming real physical gold.
            </p>
          </div>
          {[
            { h: "Discover More", l: ["Buy Gold", "Fractional", "Vault", "Learn"] },
            { h: "Company", l: ["About Us", "Security", "For Advisors", "Help Center"] },
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
