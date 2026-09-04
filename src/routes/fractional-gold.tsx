import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleDollarSign,
  FileCheck2,
  LockKeyhole,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GoldButton, SiteFooter, SiteHeader } from "@/components/site-chrome";
import goldBarVelvetMarbleBranded from "@/assets/gold-bar-velvet-marble-branded.png";
import comparisonImage from "@/assets/fractional-gold-comparison.png.asset.json";
import sqootPureMandala from "@/assets/sqoot-pure-mandala.png.asset.json";
import dillonGageLogo from "@/assets/dillon-gage-logo.png.asset.json";
import idsLogo from "@/assets/ids-logo.png.asset.json";
import lloydsLogo from "@/assets/lloyds-logo.png.asset.json";
import dillonGageLogoClean from "@/assets/dillon-gage-logo-clean.png.asset.json";
import idsLogoClean from "@/assets/ids-logo-clean.png.asset.json";
import lloydsLogoClean from "@/assets/lloyds-logo-clean.png.asset.json";

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
  ["Create an account", "Join the waitlist and create your account in under a minute."],
  ["Verify your identity", "Complete a secure identity check to protect your account."],
  ["Choose an amount", "Start with as little as $25 and allocate at your own pace."],
  ["Purchase your gold", "Confirm your order with clear, transparent pricing."],
  ["Track your holding", "See your allocated gold and its value from your account."],
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

function USFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 24" aria-hidden="true" className={className}>
      <rect width="36" height="24" rx="0.75" className="fill-background" />
      <path d="M0 0h36v2H0zm0 4h36v2H0zm0 4h36v2H0zm0 4h36v2H0zm0 4h36v2H0zm0 4h36v2H0z" className="fill-error" />
      <path d="M0 0h16v13H0z" className="fill-forest" />
      <g className="fill-background">
        <circle cx="2.5" cy="2.25" r="0.55" /><circle cx="6" cy="2.25" r="0.55" /><circle cx="9.5" cy="2.25" r="0.55" /><circle cx="13" cy="2.25" r="0.55" />
        <circle cx="4.25" cy="4.65" r="0.55" /><circle cx="7.75" cy="4.65" r="0.55" /><circle cx="11.25" cy="4.65" r="0.55" /><circle cx="14.25" cy="4.65" r="0.55" />
        <circle cx="2.5" cy="7.05" r="0.55" /><circle cx="6" cy="7.05" r="0.55" /><circle cx="9.5" cy="7.05" r="0.55" /><circle cx="13" cy="7.05" r="0.55" />
        <circle cx="4.25" cy="9.45" r="0.55" /><circle cx="7.75" cy="9.45" r="0.55" /><circle cx="11.25" cy="9.45" r="0.55" /><circle cx="14.25" cy="9.45" r="0.55" />
      </g>
    </svg>
  );
}



function Index() {
  const [step, setStep] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<"idle" | "error" | "success">("idle");
  const currentStep = steps[step] ?? ["Create an account", "Join the waitlist and create your account in under a minute."];

  function submitWaitlist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && email.length <= 254;
    setFormState(valid ? "success" : "error");
  }

  return (
    <main id="top" className="fractional-legacy overflow-hidden bg-background">
      <SiteHeader />

      <section id="why-gold" className="relative min-h-[560px] bg-ivory">
        <img src={goldBarVelvetMarbleBranded} alt="SQOOT Pure 1kg gold bar with branded mandala on dark green velvet and marble" className="h-[360px] w-full object-cover object-[68%_center] sm:h-[440px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-[67%] lg:object-cover" />
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[54%] bg-ivory lg:block [clip-path:polygon(0_0,76%_0,100%_100%,0_100%)]" />
        <div className="relative mx-auto flex max-w-[1320px] px-5 py-14 sm:px-7 lg:min-h-[560px] lg:items-center lg:px-14 lg:py-16">
          <div className="max-w-[500px]">
            <p className="eyebrow text-gold">Real Gold. Real Allocation.</p>
            <h1 className="hero-title mt-8 max-w-[500px] text-forest">
              Gold allocation,<br />made more<br /><em className="hero-emphasis text-gold">accessible.</em>
            </h1>
            <p className="hero-body mt-7 max-w-[370px] text-charcoal">Allocate a fraction of physical gold.<br className="hidden sm:block" /> It’s simple, secure, and built for how<br className="hidden sm:block" /> you want to save in gold.</p>
            <GoldButton href="#early-access" className="mt-8 h-[54px] px-8">Get Early Access <ArrowRight size={17} strokeWidth={2.5} /></GoldButton>
            <p className="hero-note mt-4 flex items-center gap-2 text-charcoal"><LockKeyhole size={14} className="text-gold" />No obligation. Be the first to access.</p>
          </div>
        </div>
        <div className="absolute bottom-10 right-[5%] hidden h-40 w-40 place-items-center rounded-full border-2 border-background/80 bg-transparent text-center text-background lg:grid">
          <div className="flex flex-col items-center">
            <p className="price-label">START FROM</p>
            <p className="price-value mt-2">$25</p>
            <p className="price-detail mt-3">≈ 0.0104 oz</p>
          </div>
        </div>
      </section>

      <section className="bg-background py-12 sm:py-14" aria-label="Trusted partners">
        <div className="mx-auto max-w-[1060px] px-5 sm:px-7">
          <p className="eyebrow text-center text-gold">Backed by trust. Built for you.</p>
          <div className="mt-8 grid grid-cols-1 items-center gap-y-7 min-[430px]:grid-cols-2 sm:gap-y-9 lg:mt-9 lg:grid-cols-4 lg:gap-y-0">
            <div className="flex items-center justify-center px-4">
              <img
                src={dillonGageLogoClean.url}
                alt="Dillon Gage"
                className="h-11 w-auto max-w-[186px] object-contain sm:h-12"
              />
            </div>
            <div className="flex items-center justify-center relative px-4 lg:before:absolute lg:before:left-0 lg:before:top-1/2 lg:before:h-[60px] lg:before:w-px lg:before:-translate-y-1/2 lg:before:bg-beige lg:before:content-['']">
              <img
                src={idsLogoClean.url}
                alt="International Depository Services"
                className="h-8 w-auto max-w-[190px] object-contain sm:h-9"
              />
            </div>
            <div className="flex items-center justify-center relative px-4 lg:before:absolute lg:before:left-0 lg:before:top-1/2 lg:before:h-[60px] lg:before:w-px lg:before:-translate-y-1/2 lg:before:bg-beige lg:before:content-['']">
              <img
                src={lloydsLogoClean.url}
                alt="Lloyd's"
                className="h-10 w-auto max-w-[180px] object-contain sm:h-11"
              />
            </div>
            <div className="flex items-center justify-center gap-3 relative px-4 lg:before:absolute lg:before:left-0 lg:before:top-1/2 lg:before:h-[60px] lg:before:w-px lg:before:-translate-y-1/2 lg:before:bg-beige lg:before:content-['']">
              <USFlag className="h-7 w-10 shrink-0" />
              <div className="min-w-0 leading-none">
                <b className="block whitespace-nowrap text-[0.75rem] font-bold tracking-[0.02em] text-charcoal">US-ONLY</b>
                <small className="mt-1.5 block text-[0.62rem] leading-[1.4] text-charcoal/80">
                  We operate exclusively<br className="hidden min-[430px]:block" /> in the United States.
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-ivory py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-5 sm:px-7 lg:grid-cols-[280px_1fr] lg:px-14">
          <div><p className="eyebrow text-gold">How it works</p><h2 className="section-title mt-4 text-forest">Five steps.<br />All online.<br />All simple.</h2><p className="section-body mt-4 max-w-[220px] text-charcoal">From sign up to gold allocation in minutes.</p></div>
          <div>
            <div className="relative rounded-[18px] border border-beige bg-background px-8 py-10 sm:min-h-[310px] sm:px-20 sm:py-14">
              <button type="button" aria-label="Previous step" onClick={() => setStep((step + 4) % 5)} className="absolute left-0 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-forest text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"><ArrowLeft size={18} /></button>
              <div className="grid items-center gap-10 sm:grid-cols-[1fr_250px]">
                 <div><p className="step-number text-forest">{String(step + 1).padStart(2, "0")} <span className="text-muted-foreground">/ 05</span></p><h3 className="step-title mt-6 text-forest">{currentStep[0]}</h3><p className="step-body mt-4 max-w-[245px] text-charcoal">{currentStep[1]}</p></div>
                <div className="mx-auto grid h-44 w-44 place-items-center rounded-full border border-dashed border-gold/60 text-forest"><div className="relative grid h-24 w-24 place-items-center rounded-full border-2 border-forest"><UserRound size={52} strokeWidth={1.3} /><span className="absolute -bottom-2 -right-2 grid h-10 w-10 place-items-center rounded-full bg-gold text-background"><Check size={22} /></span></div></div>
              </div>
              <button type="button" aria-label="Next step" onClick={() => setStep((step + 1) % 5)} className="absolute right-0 top-1/2 grid h-12 w-12 translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-forest text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"><ArrowRight size={18} /></button>
            </div>
            <div className="mt-6 flex justify-center gap-3" aria-label={`Step ${step + 1} of 5`}>{steps.map((_, index) => <button key={index} type="button" onClick={() => setStep(index)} aria-label={`Show step ${index + 1}`} className={cn("h-2.5 w-2.5 rounded-full", index === step ? "bg-gold" : "bg-beige")} />)}</div>
          </div>
        </div>
      </section>

      <section className="bg-ivory px-5 pb-16 sm:px-7 sm:pb-20">
        <div className="mx-auto grid max-w-[1240px] overflow-hidden rounded-[26px] bg-forest px-7 py-10 text-background sm:px-12 lg:grid-cols-[1fr_1.25fr_1fr] lg:items-center lg:py-12">
          <div><h2 className="comparison-left-title">A whole bar<br />asks you to buy<br />all of it.</h2><List bad items={["High upfront cost", "Less flexibility", "Storage and insurance to arrange", "Harder to sell small amounts"]} /></div>
          <div className="relative my-10 min-h-[280px] lg:my-0"><img src={comparisonImage.url} alt="Premium gold bar and fractional gold pieces" className="h-full w-full rounded-lg object-cover object-center shadow-xl" /></div>
          <div className="lg:pl-8"><h2 className="comparison-right-title">With SQOOT Pure,<br /><em className="comparison-emphasis text-gold">allocate</em> only what<br />you want.</h2><List items={["Start from as little as $25", "Buy or sell any amount", "Stored, insured and managed for you"]} /></div>
        </div>
      </section>

      <section id="fees" className="bg-background py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1240px] gap-14 px-5 sm:px-7 lg:grid-cols-2 lg:px-10">
          <div className="lg:border-r lg:border-beige lg:pr-10"><h2 className="fees-faq-title mt-3 text-forest">Simple, transparent fees</h2><p className="fee-intro mt-3 text-muted-foreground">One simple fee. No hidden costs, no surprises.</p><div className="mt-7 grid rounded-lg border border-beige bg-ivory sm:grid-cols-3">{[[CircleDollarSign,"Allocation Fee","$3 per $100 allocated (3.00%)"],[ShieldCheck,"Annual Storage Fee","0.35% of value"],[FileCheck2,"Insured Storage","0.45% of value"]].map(([Icon,title,copy], i) => { const FeeIcon = Icon as typeof CircleDollarSign; return <div key={title as string} className={cn("px-5 py-7 text-center", i > 0 && "border-t border-beige sm:border-l sm:border-t-0")}><FeeIcon className="mx-auto text-gold" strokeWidth={1.4} /><p className="fee-card-label mt-4 min-h-[2.5rem] text-forest">{title as string}</p><p className="fee-card-value mt-3 text-muted-foreground">{copy as string}</p></div>})}</div><p className="fee-footnote mt-4 text-muted-foreground">*Fees are subject to change. See full Fee Schedule in FAQ.</p></div>
          <div id="faq"><h2 className="fees-faq-title mt-3 text-forest">Frequently asked questions</h2><div className="mt-5">{faqs.map(([question, answer], index) => { const isOpen = openFaq === index; return <div key={question} className="border-b border-beige"><button type="button" onClick={() => setOpenFaq(isOpen ? null : index)} className="faq-question grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3.5 text-left focus-visible:outline-2 focus-visible:outline-gold" aria-expanded={isOpen}><span>{question}</span><PlusIcon open={isOpen} /></button>{isOpen && <p className="step-body pb-4 pr-8 text-muted-foreground">{answer}</p>}</div>})}</div></div>
        </div>
      </section>

      <section id="early-access" className="relative bg-background">
        <svg className="block h-[30px] w-full" viewBox="0 0 1440 31" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path fill="currentColor" className="text-forest" d="M0 0 C 120 10, 220 12, 300 12 S 440 15, 500 15 S 640 10, 700 10 S 840 24, 900 24 S 1040 31, 1100 31 S 1240 27, 1300 27 S 1400 14, 1440 14 L 1440 31 L 0 31 Z" />
        </svg>
        <div className="bg-forest text-background">
          <div className="mx-auto grid max-w-[1240px] items-center gap-8 px-5 py-10 sm:px-7 lg:min-h-[224px] lg:grid-cols-[1fr_1.35fr] lg:px-10 lg:py-0">
            <div className="flex items-center gap-6"><OfficialMandala className="h-20 w-20 shrink-0 lg:h-[110px] lg:w-[110px]" /><div><h2 className="early-title text-gold">Be first in line.</h2><p className="early-body mt-2">SQOOT Pure is launching soon.<br />Join the waitlist to get early access.</p></div></div>
            <form onSubmit={submitWaitlist} noValidate>
              <div className="grid gap-3 sm:grid-cols-[minmax(0,387px)_auto] sm:gap-[18px]"><label className="sr-only" htmlFor="waitlist-email">Email address</label><input id="waitlist-email" type="email" maxLength={254} value={email} onChange={(e) => { setEmail(e.target.value); setFormState("idle"); }} placeholder="Enter your email address" className="early-input min-h-14 rounded-sm border border-transparent bg-background px-5 text-forest outline-none transition-shadow placeholder:text-muted-foreground focus:border-gold focus:ring-2 focus:ring-gold" aria-invalid={formState === "error"} aria-describedby="email-status" /><GoldButton type="submit" className="h-[54px] w-full px-8 lg:w-[253px]">Get Early Access</GoldButton></div>
              <p id="email-status" className={cn("privacy-note mt-3 flex items-center gap-2", formState === "error" && "text-error", formState === "success" && "text-gold")}><LockKeyhole size={18} className="shrink-0 text-gold" />{formState === "error" ? "Please enter a valid email address." : formState === "success" ? "You’re on the list. We’ll be in touch." : "We respect your privacy. Your information is safe with us."}</p>
            </form>
          </div>
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