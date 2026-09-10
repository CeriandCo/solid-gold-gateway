import { useReveal } from "@/hooks/use-reveal";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChartNoAxesCombined,
  Check,
  CircleDollarSign,
  Coins,
  FileCheck2,
  ShieldCheck,
  UserPlus,
  Wallet,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GoldButton, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { InnerPageHero } from "@/components/inner-page-hero";
import fractionalGoldHero from "@/assets/fractional-gold-hero.png.asset.json";
import comparisonImage from "@/assets/sqoot-pure-product-comparison.png.asset.json";
import sqootPureMandala from "@/assets/sqoot-pure-mandala.png.asset.json";
import jbtMemberBadge from "@/assets/jbt-retail-member-badge.png.asset.json";
import ncbaMemberBadge from "@/assets/ncba-member-badge.png.asset.json";
import idsLogoClean from "@/assets/ids-logo-clean.png.asset.json";

export const Route = createFileRoute("/fractional-gold")({
  head: () => ({
    meta: [
      { title: "Fractional Gold Allocation | SQOOT Pure" },
      {
        name: "description",
        content: "Own allocated physical gold from $25 with secure U.S. storage and transparent fees.",
      },
      { property: "og:title", content: "Fractional Gold Allocation | SQOOT Pure" },
      {
        property: "og:description",
        content: "A simple, secure way to allocate and own physical gold from $25.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const steps = [
  {
    title: "Create an account",
    summary: "Join the waitlist now; account access will follow when available.",
    detail:
      "SQOOT Pure is currently in pre-launch. You will be prompted to set up a transactional account after launch.",
    icon: UserPlus,
  },
  {
    title: "Verify your identity",
    summary: "Complete the required identity checks before transactions become available.",
    detail:
      "Identity verification is not required to join the waitlist. Eligible customers will complete the required checks when account access and transactions become available, helping protect their account.",
    icon: ShieldCheck,
  },
  {
    title: "Choose an amount",
    summary: "When access becomes available, start with as little as US$25.",
    detail:
      "Choose an amount that suits you, starting from US$25. SQOOT Pure is still pre-launch, so gold purchases are not available yet.",
    icon: Coins,
  },
  {
    title: "Fund and purchase",
    summary: "Review clear pricing before confirming your purchase.",
    detail:
      "When transactions become available, you will see the applicable price and fees before confirming. Once purchased, your physical gold allocation is recorded to your account.",
    icon: Wallet,
  },
  {
    title: "Track your holding",
    summary: "See your allocated gold and its value from your account.",
    detail:
      "Track your allocated gold and its value from your account. When transactions become available, you can choose to sell; fractional holdings redeem to cash first, while buying a physical coin is a separate purchase.",
    icon: ChartNoAxesCombined,
  },
] as const;

const faqs = [
  [
    "What are the fees?",
    "SQOOT Pure keeps fees simple and transparent. You'll always see the applicable fees before confirming a transaction. For fractional gold ownership, the current fees are: Allocation fee: 3.00% of the amount allocated ($3 per $100). This is charged when you purchase and allocate gold to your account. Annual storage fee: 0.35% of the value of your allocated gold per year. Insurance: 0.45% of the value of your allocated gold per year, covering your gold while it is held in secure storage. There are no hidden fees. Any applicable charges will be clearly disclosed before you complete a transaction. Fees may change from time to time. Please refer to our Fee Schedule for the current fees and full terms."
  ],
  [
    "Do I pay a fee when I sell my gold?",
    "Yes. The $3 per $100 transaction fee applies whether you're buying or selling. There's no separate sell-only or hidden spread."
  ],
  [
    "Are there additional fees if I redeem physical gold?",
    "Fractional holdings redeem to cash first. If you then want a physical coin, that's a separate purchase, subject to the coin's current price, product premium, shipping, insurance, and any applicable taxes, all shown before you confirm."
  ],
] as const;

function Mandala({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true" className={className}>
      <g fill="none" stroke="currentColor" strokeWidth="1.25">
        <path d="M40 3 49 9l11-1 5 10 10 5-1 11 6 9-6 9 1 11-10 5-5 10-11-1-9 6-9-6-11 1-5-10-10-5 1-11-6-9 6-9-1-11 10-5 5-10 11 1Z" />
        <circle cx="40" cy="40" r="27" /><circle cx="40" cy="40" r="20" /><circle cx="40" cy="40" r="13" /><circle cx="40" cy="40" r="6" />
        <path d="m40 13 7 14 16-2-10 13 10 12-16-1-7 15-7-15-16 1 10-12-10-13 16 2Z" />
      </g>
    </svg>
  );
}

function OfficialMandala({ className }: { className?: string }) {
  return <img src={sqootPureMandala.url} alt="" aria-hidden="true" className={cn("object-contain", className)} />;
}


function Index() {
  const [step, setStep] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const currentStep = steps[step] ?? steps[0];
  const scope = useReveal<HTMLElement>();

  return (
    <main ref={scope} id="top" className="fractional-legacy overflow-hidden bg-background">
      <SiteHeader />

      <InnerPageHero
        id="why-gold"
        titleId="fractional-hero-title"
        eyebrow="Real Gold. Real Allocation."
        title={<>Gold allocation,<br />made more<br /><em>accessible.</em></>}
        body={<>Allocate a fraction of physical gold.<br />It’s simple, secure, and built for how<br />you want to save in gold.</>}
        actions={<GoldButton to="/early-access">Get Early Access</GoldButton>}
        imageSrc={fractionalGoldHero.url}
        imageAlt="SQOOT Pure gold bars and a coin arranged on a deep green velvet tray over marble"
        imageVariant="fractional"
        media={
          <div aria-hidden="true" className="fg-price-badge">
            <div>
              <p className="fg-price-label">START FROM</p>
              <p className="fg-price-value">$25</p>
              <p className="fg-price-detail">≈ 0.0104 oz</p>
            </div>
            <style>{`
.fg-price-badge{position:absolute;z-index:3;right:5%;bottom:40px;display:grid;place-items:center;width:clamp(112px,11.1vw,160px);height:clamp(112px,11.1vw,160px);border:2px solid rgba(250,245,234,.8);border-radius:9999px;background:transparent;color:var(--warm-white);text-align:center}
.fg-price-badge>div{display:flex;flex-direction:column;align-items:center}
.fg-price-label{margin:0;font-family:var(--font-sans);font-size:clamp(.525rem,.52vw,.75rem);font-weight:700;line-height:normal;letter-spacing:.12em}
.fg-price-value{margin:clamp(6px,.55vw,8px) 0 0;font-family:var(--font-display);font-size:clamp(1.925rem,1.91vw,2.75rem);font-weight:600;line-height:normal}
.fg-price-detail{margin:clamp(8px,.83vw,12px) 0 0;font-family:var(--font-sans);font-size:clamp(.569rem,.56vw,.8125rem);font-weight:500;line-height:normal}
@media(max-width:767px){.fg-price-badge{right:6%;bottom:28px}}
`}</style>
          </div>
        }
      />

      <section data-reveal className="bg-background py-12 sm:py-14" aria-label="Memberships and custody credentials">
        <div className="site-container">
          <p className="eyebrow text-center text-gold">Credentials you can verify.</p>
          <div className="mt-8 grid grid-cols-2 items-start gap-y-9 sm:mt-9 lg:grid-cols-4 lg:gap-y-0">
            {/* JBT — SQOOT Pure industry membership */}
            <a
              href="https://www.jewelersboard.com/were-legit"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center px-4 text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              <span className="flex h-[72px] items-center justify-center">
                <img
                  src={jbtMemberBadge.url}
                  alt="Jewelers Board of Trade — Retail Member"
                  className="h-[68px] w-auto object-contain mix-blend-multiply"
                />
              </span>
              <span className="mt-4 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-forest">
                JBT Member
              </span>
              <span className="mt-1 text-[0.66rem] leading-[1.5] text-charcoal/70 transition-colors group-hover:text-gold">
                Jewelers Board of Trade
              </span>
            </a>
            {/* NCBA — SQOOT Pure industry membership */}
            <a
              href="https://www.ncbassoc.org/membership"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col items-center px-4 text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold lg:before:absolute lg:before:left-0 lg:before:top-1/2 lg:before:h-[72px] lg:before:w-px lg:before:-translate-y-1/2 lg:before:bg-beige lg:before:content-['']"
            >
              <span className="flex h-[72px] items-center justify-center">
                <img
                  src={ncbaMemberBadge.url}
                  alt="National Coin &amp; Bullion Association — Member"
                  className="h-[72px] w-auto object-contain"
                />
              </span>
              <span className="mt-4 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-forest">
                NCBA Member
              </span>
              <span className="mt-1 text-[0.66rem] leading-[1.5] text-charcoal/70 transition-colors group-hover:text-gold">
                National Coin &amp; Bullion Association
              </span>
            </a>
            {/* IDS — custody service provider */}
            <div className="relative flex flex-col items-center px-4 text-center lg:before:absolute lg:before:left-0 lg:before:top-1/2 lg:before:h-[72px] lg:before:w-px lg:before:-translate-y-1/2 lg:before:bg-beige lg:before:content-['']">
              <span className="flex h-[72px] items-center justify-center">
                <img
                  src={idsLogoClean.url}
                  alt="International Depository Services"
                  className="h-9 w-auto max-w-[190px] object-contain"
                />
              </span>
              <span className="mt-4 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-forest">
                Securely vaulted with IDS
              </span>
              <span className="mt-1 text-[0.66rem] leading-[1.5] text-charcoal/70">
                Institutional precious metals storage
              </span>
            </div>
            {/* LBMA — bullion sourcing standard (typographic treatment, no badge) */}
            <div className="relative flex flex-col items-center px-4 text-center lg:before:absolute lg:before:left-0 lg:before:top-1/2 lg:before:h-[72px] lg:before:w-px lg:before:-translate-y-1/2 lg:before:bg-beige lg:before:content-['']">
              <span className="flex h-[72px] items-center justify-center">
                <span className="font-display text-[1.05rem] leading-[1.2] tracking-[0.08em] text-forest">
                  LBMA
                  <span className="mx-2 inline-block h-[26px] w-px translate-y-[6px] bg-gold/70" aria-hidden="true" />
                  <span className="text-[0.8rem] tracking-[0.12em] text-forest/80">
                    GOOD DELIVERY
                  </span>
                </span>
              </span>
              <span className="mt-4 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-forest">
                LBMA Good Delivery sourced
              </span>
              <span className="mt-1 text-[0.66rem] leading-[1.5] text-charcoal/70">
                Sourced through recognised refiners
              </span>
              <a
                href="https://www.lbma.org.uk/good-delivery"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 text-[0.66rem] font-medium text-gold underline-offset-4 transition-colors hover:text-forest hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                Learn about the standard →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section data-reveal className="relative overflow-hidden bg-background" aria-label="Our philosophy">
        <div className="pointer-events-none absolute right-[-10%] top-1/2 h-[520px] w-[520px] -translate-y-1/2 opacity-[0.18] mix-blend-multiply sm:h-[620px] sm:w-[620px] lg:right-[-8%] lg:h-[760px] lg:w-[760px]">
          <OfficialMandala className="h-full w-full" />
        </div>
        <div className="site-container relative grid gap-10 py-20 sm:py-24 lg:grid-cols-[0.6fr_0.4fr] lg:items-center lg:py-32">
          <div>
            <p className="eyebrow text-gold">Our Philosophy</p>
            <h2 className="mt-5 font-display text-[2.6rem] leading-[1.08] tracking-[-0.01em] text-forest sm:text-[3.2rem] lg:text-[3.8rem]">
              Buy to Build™
            </h2>
            <p className="mt-6 font-display text-[1.35rem] leading-[1.35] text-forest/90 sm:text-[1.55rem] lg:text-[1.75rem]">
              Gold reserves have been built one purchase at a time for generations.
            </p>
            <p className="mt-5 max-w-[540px] font-['DM_Sans',_sans-serif] text-base leading-relaxed text-charcoal/80 sm:text-[1.05rem]">
              Each purchase may be small, but together they can become something durable: a personal reserve, family wealth and an asset recognised across borders.
            </p>
            <p className="mt-5 max-w-[540px] font-['DM_Sans',_sans-serif] text-base leading-relaxed text-charcoal/80 sm:text-[1.05rem]">
              SQOOT brings this established behaviour into a modern fractional-purchase experience. Build a vaulted precious-metal balance through purchases that fit your budget, without waiting until you can afford an entire coin or bar.
            </p>
            <p className="mt-8 max-w-[560px] font-['DM_Sans',_sans-serif] text-[0.8rem] leading-[1.6] text-charcoal/55 sm:text-[0.85rem]">
              Gold is not presented as guaranteed appreciation or a replacement for productive investments. It is a distinct reserve, built gradually, held for the long term and available for sale or eligible physical redemption when needed.
            </p>
          </div>
          <div className="hidden lg:block" aria-hidden="true" />
        </div>
      </section>

      <section data-reveal id="how-it-works" className="bg-ivory py-16 sm:py-20">
        <div className="site-container grid gap-10 lg:grid-cols-[28%_1fr] lg:gap-12">
          <div className="self-start">
            <p className="eyebrow text-gold">How it works</p>
            <h2 className="section-title mt-5 text-forest">Five steps. All online. All simple.</h2>
            <p className="mt-4 max-w-[280px] text-[13px] leading-[1.6] text-charcoal/75">A clear path from joining the waitlist to managing an allocated gold holding when access becomes available.</p>
          </div>

          <div aria-label="Five-step gold allocation process">
            {/* Desktop: all five steps in one horizontal row */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-5 gap-6" role="tablist" aria-label="Select a process step">
                {steps.map(({ title, summary, icon: Icon }, index) => {
                  const isSelected = step === index;
                  return (
                    <button
                      key={title}
                      type="button"
                      role="tab"
                      id={`fractional-step-tab-${index}`}
                      aria-selected={isSelected}
                      aria-controls="fractional-step-detail"
                      tabIndex={isSelected ? 0 : -1}
                      onClick={() => setStep(index)}
                      onKeyDown={(event) => {
                        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
                        event.preventDefault();
                        const next = event.key === "Home" ? 0 : event.key === "End" ? steps.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + steps.length) % steps.length;
                        setStep(next);
                        document.getElementById(`fractional-step-tab-${next}`)?.focus();
                      }}
                      className="group flex flex-col items-center text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                    >
                      <span className="relative inline-block">
                        <span className={cn("grid h-[84px] w-[84px] place-items-center rounded-full border transition-colors", isSelected ? "border-gold bg-forest-deep text-gold" : "border-gold/55 bg-warm-white text-gold group-hover:border-gold")}>
                          <Icon size={32} strokeWidth={1.4} aria-hidden="true" />
                        </span>
                        <span className="absolute -bottom-1 left-1 grid h-[22px] w-[22px] place-items-center rounded-full bg-gold text-[11px] font-semibold text-forest-deep">
                          {index + 1}
                        </span>
                      </span>
                      <span className={cn("mt-4 inline-block min-h-[2.4em] border-b-2 pb-1 text-sm font-semibold leading-[1.2] text-charcoal", isSelected ? "border-gold" : "border-transparent")}>{title}</span>
                      <span className="mt-2 block min-h-[76px] text-[13px] leading-[1.45] text-charcoal/70">{summary}</span>
                    </button>
                  );
                })}
              </div>

              <div id="fractional-step-detail" role="tabpanel" aria-labelledby={`fractional-step-tab-${step}`} className="mt-10 flex h-[188px] items-center gap-8 rounded-[8px] border border-beige bg-warm-white px-9 py-6">
                <div className="w-[220px] shrink-0 border-r border-beige pr-8">
                  <p className="step-number text-gold">STEP {String(step + 1).padStart(2, "0")} / 05</p>
                  <p className="mt-2 font-display text-[1.4rem] font-semibold leading-[1.15] text-forest">{currentStep.title}</p>
                </div>
                <p className="max-w-[720px] text-[0.95rem] leading-relaxed text-charcoal">{currentStep.detail}</p>
              </div>
            </div>

            {/* Mobile: intro above, steps vertical, detail beneath the selected step */}
            <div className="space-y-0 lg:hidden">
              {steps.map(({ title, summary, detail, icon: Icon }, index) => {
                const isSelected = step === index;
                return (
                  <div key={title} className={cn("relative border-b border-beige", index === 0 && "border-t")}>
                    <button
                      type="button"
                      aria-expanded={isSelected}
                      aria-controls={`fractional-step-mobile-detail-${index}`}
                      onClick={() => setStep(index)}
                      className="grid w-full grid-cols-[64px_minmax(0,1fr)] items-center gap-4 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                    >
                      <span className="relative inline-block h-[64px] w-[64px]">
                        <span className={cn("grid h-full w-full place-items-center rounded-full border transition-colors", isSelected ? "border-gold bg-forest-deep text-gold" : "border-gold/55 bg-warm-white text-gold")}>
                          <Icon size={26} strokeWidth={1.4} aria-hidden="true" />
                        </span>
                        <span className="absolute -bottom-1 left-0 grid h-[20px] w-[20px] place-items-center rounded-full bg-gold text-[10px] font-semibold text-forest-deep">
                          {index + 1}
                        </span>
                      </span>
                      <span>
                        <span className={cn("inline-block min-h-[1.2em] border-b-2 pb-0.5 text-sm font-semibold leading-[1.2] text-charcoal", isSelected ? "border-gold" : "border-transparent")}>{title}</span>
                        <span className="mt-1.5 block min-h-[3em] text-[0.82rem] leading-[1.5] text-charcoal/70">{summary}</span>
                      </span>
                    </button>
                    {isSelected && (
                      <div id={`fractional-step-mobile-detail-${index}`} role="region" aria-label={`${title} details`} className="mb-5 ml-[80px] flex h-[188px] items-center rounded-[8px] border border-beige bg-warm-white px-5 py-4">
                        <p className="text-sm leading-relaxed text-charcoal">{detail}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section data-reveal className="bg-ivory px-5 pb-16 sm:px-7 sm:pb-20">
        <div className="site-container grid overflow-hidden rounded-[26px] bg-forest py-10 text-background lg:grid-cols-[1fr_1.25fr_1fr] lg:items-center lg:py-12">
          <div><h2 className="comparison-left-title">A whole bar<br />asks you to buy<br />all of it.</h2><List bad items={["High upfront cost", "Less flexibility", "Storage and insurance to arrange", "Harder to sell small amounts"]} /></div>
          <div className="relative my-10 min-h-[280px] lg:my-0"><img src={comparisonImage.url} alt="SQOOT PURE green suede box, gold bar, display card, flowers and velvet cloth" className="h-full w-full rounded-lg object-cover object-center shadow-xl" /></div>
          <div className="lg:pl-8"><h2 className="comparison-right-title">With SQOOT Pure,<br /><em className="comparison-emphasis text-gold">allocate</em> only what<br />you want.</h2><List items={["Start from as little as $25", "Buy or sell any amount", "Stored, insured and managed for you"]} /></div>
        </div>
      </section>

      <section data-reveal id="fees" className="bg-background py-16 sm:py-20">
        <div className="site-container grid gap-14 lg:grid-cols-2">
          <div className="lg:border-r lg:border-beige lg:pr-10"><h2 className="fees-faq-title mt-3 text-forest">Simple, transparent fees</h2><p className="fee-intro mt-3 text-muted-foreground">One simple fee. No hidden costs, no surprises.</p><div className="mt-7 grid rounded-lg border border-beige bg-ivory sm:grid-cols-3">{[[CircleDollarSign,"Allocation Fee","$3 per $100 allocated (3.00%)"],[ShieldCheck,"Annual Storage Fee","0.35% of value"],[FileCheck2,"Insured Storage","0.45% of value"]].map(([Icon,title,copy], i) => { const FeeIcon = Icon as typeof CircleDollarSign; return <div key={title as string} className={cn("px-5 py-7 text-center", i > 0 && "border-t border-beige sm:border-l sm:border-t-0")}><FeeIcon className="mx-auto text-gold" strokeWidth={1.5} /><p className="fee-card-label mt-4 min-h-[2.5rem] text-forest">{title as string}</p><p className="fee-card-value mt-3 text-muted-foreground">{copy as string}</p></div>})}</div><p className="fee-footnote mt-4 text-muted-foreground">*Fees are subject to change. See full Fee Schedule in FAQ.</p></div>
          <div id="faq"><h2 className="fees-faq-title mt-3 text-forest">Frequently asked questions</h2><div className="mt-5">{faqs.map(([question, answer], index) => { const isOpen = openFaq === index; return <div key={question} className="border-b border-beige"><button type="button" onClick={() => setOpenFaq(isOpen ? null : index)} className="faq-question grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3.5 text-left focus-visible:outline-2 focus-visible:outline-gold" aria-expanded={isOpen}><span>{question}</span><PlusIcon open={isOpen} /></button>{isOpen && <p className="step-body pb-4 pr-8 text-muted-foreground">{answer}</p>}</div>})}</div></div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function List({ items, bad = false }: { items: string[]; bad?: boolean }) {
  return <ul className="mt-6 space-y-3">{items.map((item) => <li key={item} className={cn("flex items-start gap-3", bad ? "comparison-left-list" : "comparison-right-list")}><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-[3px] border-gold text-gold">{bad ? <X size={12} strokeWidth={2.5} /> : <Check size={12} strokeWidth={2.5} />}</span>{item}</li>)}</ul>;
}

function PlusIcon({ open }: { open: boolean }) {
  return <span className="relative block h-4 w-4 text-gold"><span className="absolute left-0 top-[7px] h-px w-4 bg-current" /><span className={cn("absolute left-[7px] top-0 h-4 w-px bg-current transition-transform", open && "rotate-90 opacity-0")} /></span>;
}