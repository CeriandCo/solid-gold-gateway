import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleDollarSign,
  FileCheck2,
  LockKeyhole,
  Menu,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import heroAsset from "@/assets/hero-with-mandala.png.asset.json";
import goldBarImage from "@/assets/hero-gold.jpg";
import fractionalImage from "@/assets/path-fractional.jpg";

export const Route = createFileRoute("/")({
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

const nav = [
  ["Why Gold", "#why-gold"],
  ["How It Works", "#how-it-works"],
  ["Fees", "#fees"],
  ["FAQ", "#faq"],
  ["About Us", "#about"],
] as const;

const steps = [
  ["Create an account", "Join the waitlist and create your account in under a minute."],
  ["Verify your identity", "Complete a secure identity check to protect your account."],
  ["Choose an amount", "Start with as little as $25 and allocate at your own pace."],
  ["Purchase your gold", "Confirm your order with clear, transparent pricing."],
  ["Track your holding", "See your allocated gold and its value from your account."],
] as const;

const faqs = [
  ["What is fractional gold?", "Fractional gold lets you own a precise portion of real physical gold without purchasing a whole bar."],
  ["Is my gold really allocated to me?", "Yes. Your purchased gold is allocated to you and recorded as part of your personal holding."],
  ["How is my gold stored and insured?", "Gold is held in secure U.S. vaults with professional custody and insurance."],
  ["Can I redeem physical gold?", "Eligible holdings can be redeemed for physical gold, subject to the applicable minimums and fees."],
  ["How do I buy or sell my gold?", "Buy or sell from your account using transparent current pricing."],
  ["What are the fees?", "SQOOT Pure uses straightforward allocation and storage fees shown before you confirm a transaction."],
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

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#top" className="flex shrink-0 items-center gap-2.5" aria-label="SQOOT Pure home">
      <Mandala className={cn("text-gold", compact ? "h-10 w-10" : "h-12 w-12")} />
      <span className="leading-none">
        <span className="block font-display text-[1.7rem] font-medium leading-none text-forest-deep">SQOOT</span>
        <span className="mt-1 block text-[0.66rem] font-medium tracking-[0.38em] text-gold">PURE</span>
      </span>
    </a>
  );
}

function PrimaryButton({ children, className = "", type = "button", disabled = false }: { children: React.ReactNode; className?: string; type?: "button" | "submit"; disabled?: boolean }) {
  return (
    <button type={type} disabled={disabled} className={cn("inline-flex min-h-12 items-center justify-center gap-3 rounded-sm bg-forest px-7 text-sm font-semibold text-gold transition-colors hover:bg-charcoal focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60", className)}>
      {children}
    </button>
  );
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
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
    <main id="top" className="overflow-hidden bg-background">
      <header className="relative z-30 bg-background">
        <div className="mx-auto grid h-[88px] max-w-[1320px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 sm:px-7 lg:flex lg:px-14">
          <Brand />
          <nav className="ml-auto hidden items-center gap-10 lg:flex" aria-label="Primary navigation">
            {nav.map(([label, href]) => <a key={label} href={href} className="text-[0.8rem] font-medium text-charcoal transition-colors hover:text-gold">{label}</a>)}
          </nav>
          <a href="#early-access" className="ml-4 hidden min-h-12 items-center rounded-sm bg-forest px-7 text-sm font-semibold text-gold transition-colors hover:bg-charcoal focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold lg:inline-flex">Get Early Access</a>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-sm border border-beige text-forest lg:hidden" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label="Toggle navigation menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {menuOpen && (
          <nav aria-label="Mobile navigation" className="absolute inset-x-0 top-[88px] border-t border-beige bg-background px-5 py-4 shadow-sm lg:hidden">
            {nav.map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)} className="block border-b border-beige py-3 text-sm font-medium text-charcoal">{label}</a>)}
            <a href="#early-access" onClick={() => setMenuOpen(false)} className="mt-4 flex min-h-12 items-center justify-center rounded-sm bg-forest px-6 text-sm font-semibold text-gold">Get Early Access</a>
          </nav>
        )}
      </header>

      <section id="why-gold" className="relative min-h-[560px] bg-ivory">
        <img src={heroAsset.url} alt="SQOOT Pure gold, presentation box and white flowers on marble" className="h-[360px] w-full object-cover object-[68%_center] sm:h-[440px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-[67%] lg:object-cover" />
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[54%] bg-ivory lg:block [clip-path:polygon(0_0,76%_0,100%_100%,0_100%)]" />
        <div className="relative mx-auto flex max-w-[1320px] px-5 py-14 sm:px-7 lg:min-h-[560px] lg:items-center lg:px-14 lg:py-16">
          <div className="max-w-[470px]">
            <p className="eyebrow text-gold">Real Gold. Real Allocation.</p>
            <h1 className="mt-6 max-w-[450px] font-display text-[2.75rem] leading-[1.02] text-forest sm:text-[3.6rem] lg:text-[4.15rem]">
              Gold allocation,<br />made more<br /><em className="font-normal text-gold">accessible.</em>
            </h1>
            <p className="mt-6 max-w-[390px] text-[1rem] leading-[1.65] text-charcoal">Allocate a fraction of physical gold.<br className="hidden sm:block" /> It’s simple, secure, and built for how<br className="hidden sm:block" /> you want to save in gold.</p>
            <a href="#early-access" className="mt-7 inline-flex min-h-14 items-center gap-5 rounded-sm bg-forest px-8 text-sm font-semibold text-gold transition-colors hover:bg-charcoal focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold">Get Early Access <ArrowRight size={17} /></a>
            <p className="mt-5 flex items-center gap-2 text-xs text-charcoal"><LockKeyhole size={15} className="text-gold" />No obligation. Be the first to access.</p>
          </div>
        </div>
        <div className="absolute bottom-10 right-[5%] hidden h-40 w-40 place-items-center rounded-full border border-background bg-forest/80 text-center text-background backdrop-blur-sm lg:grid">
          <div><p className="text-[0.62rem] font-semibold tracking-[0.18em]">START FROM</p><p className="mt-1 font-display text-4xl">$25</p><p className="mt-1 text-xs">≈ 0.0104 oz</p></div>
        </div>
      </section>

      <section className="bg-background py-12 sm:py-14" aria-label="Trusted partners">
        <div className="mx-auto max-w-[1120px] px-5 sm:px-7">
          <p className="eyebrow text-center text-gold">Backed by trust. Built for you.</p>
          <div className="mt-8 grid grid-cols-2 items-center gap-y-8 sm:grid-cols-4">
            <div className="flex items-center justify-center gap-3 border-r border-beige px-3"><Mandala className="h-9 w-9 text-gold" /><div><b className="font-display text-lg">DILLON GAGE</b><small className="block text-[0.55rem] tracking-[0.16em] text-gold">EST. 1976</small></div></div>
            <div className="flex items-center justify-center gap-2 px-3 sm:border-r sm:border-beige"><b className="font-display text-3xl text-forest">IDS</b><span className="text-[0.5rem] leading-tight">INTERNATIONAL<br />DEPOSITORY<br />SERVICES</span></div>
            <div className="flex items-center justify-center border-r border-beige px-3"><span className="bg-charcoal px-5 py-2 font-display text-base text-background">LLOYD’S</span></div>
            <div className="flex items-center justify-center gap-3 px-3"><span className="text-3xl" aria-hidden="true">🇺🇸</span><div><b className="text-sm">US-ONLY</b><small className="block text-[0.6rem] leading-tight">We operate exclusively<br />in the United States.</small></div></div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-ivory py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-5 sm:px-7 lg:grid-cols-[280px_1fr] lg:px-14">
          <div><p className="eyebrow text-gold">How it works</p><h2 className="mt-5 text-[2.45rem] leading-[1.08] text-forest">Five steps.<br />All online.<br />All simple.</h2><p className="mt-5 max-w-[220px] text-sm leading-relaxed text-charcoal">From sign up to gold allocation in minutes.</p></div>
          <div>
            <div className="relative rounded-[18px] border border-beige bg-background px-8 py-10 sm:min-h-[310px] sm:px-20 sm:py-14">
              <button type="button" aria-label="Previous step" onClick={() => setStep((step + 4) % 5)} className="absolute left-0 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-forest text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"><ArrowLeft size={18} /></button>
              <div className="grid items-center gap-10 sm:grid-cols-[1fr_250px]">
                <div><p className="text-xs font-semibold text-forest">{String(step + 1).padStart(2, "0")} <span className="text-muted-foreground">/ 05</span></p><h3 className="mt-7 text-3xl text-forest">{currentStep[0]}</h3><p className="mt-4 max-w-[245px] text-sm leading-[1.75] text-charcoal">{currentStep[1]}</p></div>
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
          <div><h2 className="text-[2.25rem] leading-[1.08]">A whole bar<br />asks you to buy<br />all of it.</h2><List bad items={["High upfront cost", "Less flexibility", "Storage and insurance to arrange", "Harder to sell small amounts"]} /></div>
          <div className="relative my-10 min-h-[280px] lg:my-0"><img src={goldBarImage} alt="Premium gold bar" className="absolute left-[10%] top-0 h-full w-[48%] rounded-lg object-cover object-center shadow-xl" /><img src={fractionalImage} alt="Smaller fractional gold pieces" className="absolute bottom-2 right-0 h-[64%] w-[58%] rounded-lg object-cover shadow-xl" /></div>
          <div className="lg:pl-8"><h2 className="text-[2.25rem] leading-[1.08]">With SQOOT Pure,<br /><em className="text-gold">allocate</em> only what<br />you want.</h2><List items={["Start from as little as $25", "Buy or sell any amount", "Stored, insured and managed for you"]} /></div>
        </div>
      </section>

      <section id="fees" className="bg-background py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1240px] gap-14 px-5 sm:px-7 lg:grid-cols-2 lg:px-10">
          <div className="lg:border-r lg:border-beige lg:pr-10"><h2 className="text-2xl uppercase text-forest">Simple, transparent fees</h2><p className="mt-3 text-sm">One simple fee. No hidden costs, no surprises.</p><div className="mt-8 grid rounded-lg border border-beige bg-ivory sm:grid-cols-3">{[[CircleDollarSign,"Allocation Fee","$3 per $100 allocated (3.00%)"],[ShieldCheck,"Annual Storage Fee","0.35% of value"],[FileCheck2,"Insured Storage","0.45% of value"]].map(([Icon,title,copy], i) => { const FeeIcon = Icon as typeof CircleDollarSign; return <div key={title as string} className={cn("px-5 py-7 text-center", i > 0 && "border-t border-beige sm:border-l sm:border-t-0")}><FeeIcon className="mx-auto text-gold" strokeWidth={1.4} /><p className="mt-4 text-xs font-semibold">{title as string}</p><p className="mt-3 text-[0.68rem] leading-relaxed">{copy as string}</p></div>})}</div><p className="mt-5 text-[0.66rem]">*Fees are subject to change. See full Fee Schedule in FAQ.</p></div>
          <div id="faq"><h2 className="text-2xl uppercase text-forest">Frequently asked questions</h2><div className="mt-6">{faqs.map(([question, answer], index) => { const isOpen = openFaq === index; return <div key={question} className="border-b border-beige"><button type="button" onClick={() => setOpenFaq(isOpen ? null : index)} className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3 text-left text-sm font-medium focus-visible:outline-2 focus-visible:outline-gold" aria-expanded={isOpen}><span>{question}</span><PlusIcon open={isOpen} /></button>{isOpen && <p className="pb-4 pr-8 text-sm leading-relaxed text-muted-foreground">{answer}</p>}</div>})}</div></div>
        </div>
      </section>

      <section id="early-access" className="bg-forest py-10 text-background">
        <div className="mx-auto grid max-w-[1240px] items-center gap-8 px-5 sm:px-7 lg:grid-cols-[1fr_1.35fr] lg:px-10">
          <div className="flex items-center gap-7"><Mandala className="h-20 w-20 shrink-0 text-gold" /><div><h2 className="text-3xl text-gold">Be first in line.</h2><p className="mt-2 text-sm leading-relaxed">SQOOT Pure is launching soon.<br />Join the waitlist to get early access.</p></div></div>
          <form onSubmit={submitWaitlist} noValidate>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]"><label className="sr-only" htmlFor="waitlist-email">Email address</label><input id="waitlist-email" type="email" maxLength={254} value={email} onChange={(e) => { setEmail(e.target.value); setFormState("idle"); }} placeholder="Enter your email address" className="min-h-14 rounded-sm border border-transparent bg-background px-5 text-sm text-forest outline-none transition-shadow focus:border-gold focus:ring-2 focus:ring-gold" aria-invalid={formState === "error"} aria-describedby="email-status" /><PrimaryButton type="submit" className="min-h-14 bg-gold px-9 text-background hover:bg-gold-dark">Get Early Access</PrimaryButton></div>
            <p id="email-status" className={cn("mt-3 flex items-center gap-2 text-xs", formState === "error" && "text-error", formState === "success" && "text-gold")}><LockKeyhole size={14} className="text-gold" />{formState === "error" ? "Please enter a valid email address." : formState === "success" ? "You’re on the list. We’ll be in touch." : "We respect your privacy. Your information is safe with us."}</p>
          </form>
        </div>
      </section>

      <footer id="about" className="bg-background py-8"><div className="mx-auto grid max-w-[1240px] items-center gap-8 px-5 sm:px-7 lg:grid-cols-[auto_1fr_auto] lg:px-10"><Brand compact /><nav className="flex flex-wrap justify-center gap-x-8 gap-y-3" aria-label="Footer navigation">{nav.map(([label,href]) => <a key={label} href={href} className="text-xs hover:text-gold">{label}</a>)}</nav><div className="text-xs leading-relaxed lg:text-right"><p>© 2026 Fortress Gold Inc. All rights reserved.</p><p className="mt-2"><a href="#privacy" className="hover:text-gold">Privacy Policy</a><span className="mx-4">Terms of Service</span></p></div></div></footer>
    </main>
  );
}

function List({ items, bad = false }: { items: string[]; bad?: boolean }) {
  return <ul className="mt-7 space-y-3">{items.map((item) => <li key={item} className="flex items-start gap-3 text-xs leading-relaxed"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-gold text-gold">{bad ? <X size={11} /> : <Check size={11} />}</span>{item}</li>)}</ul>;
}

function PlusIcon({ open }: { open: boolean }) {
  return <span className="relative block h-4 w-4 text-gold"><span className="absolute left-0 top-[7px] h-px w-4 bg-current" /><span className={cn("absolute left-[7px] top-0 h-4 w-px bg-current transition-transform", open && "rotate-90 opacity-0")} /></span>;
}