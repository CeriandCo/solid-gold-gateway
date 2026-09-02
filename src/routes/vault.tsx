import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  CircleCheck,
  Coins,
  Layers,
  CreditCard,
  FileText,
  Home,
  LockKeyhole,
  Package,
  Play,
  ShieldCheck,
  Truck,
  Umbrella,
  UserRound,
  Warehouse,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import vaultDoor from "@/assets/vault-door-hero.png.asset.json";
import laptopImage from "@/assets/walkthrough-laptop.jpg";
import mandalaImage from "@/assets/sqoot-mandala.png";

export const Route = createFileRoute("/vault")({
  head: () => ({
    meta: [
      { title: "Vaulted Gold Held in Your Name | SQOOT Pure" },
      {
        name: "description",
        content:
          "Physical gold and silver stored in an insured US vault and allocated to you individually — verify it, redeem it, or take delivery whenever you choose.",
      },
      { property: "og:title", content: "Vaulted Gold Held in Your Name | SQOOT Pure" },
      {
        property: "og:description",
        content: "Insured US vault storage with individual allocation, pro-rata billing and redemption on your schedule.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});


const faqs = [
  ["Is this actually real gold?", "Yes. Every allocation is backed by physical metal held at an insured depository in your name."],
  ["What happens if SQOOT disappears?", "Your metal is held at IDS in your name, not on our balance sheet, and remains yours."],
  ["Where is my gold stored?", "In insured US facilities — IDS in Dallas, Texas and Vaultify PMC in Sugar Land, Texas."],
  ["How is my gold insured?", "Holdings carry full value, all-risk insurance coverage through the depository."],
  ["Can I take physical delivery?", "Yes. Request delivery at any time and we ship your metal insured to your address."],
  ["How are fees calculated?", "Storage is billed pro-rata: full period fee × days held ÷ 90, with a $25 minimum charge."],
] as const;

const WIDE = "mx-auto w-full max-w-[1340px] px-5 sm:px-8 xl:px-0";
const STD = "mx-auto w-full max-w-[1240px] px-5 sm:px-8 xl:px-0";

function GoldRule() {
  return <span className="mt-3 block h-px w-9 bg-gold" />;
}

function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("eyebrow text-gold", className)}>{children}</p>;
}

function GoldButton({
  children,
  href,
  type,
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  type?: "button" | "submit";
  className?: string;
}) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2.5 rounded-[2px] bg-gold px-7 text-sm font-semibold leading-none tracking-[0.01em] text-[#0B2015] transition-colors hover:bg-gold-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
    className,
  );
  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <button type={type ?? "button"} className={classes}>
      {children}
    </button>
  );
}

function IconCircle({ size = 84, children }: { size?: number; children: React.ReactNode }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full border border-gold/55 text-gold"
      style={{ width: size, height: size }}
    >
      {children}
    </span>
  );
}

function ThinArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 8" aria-hidden="true" className={cn("h-2 w-full text-gold/70", className)} fill="none">
      <path d="M0 4h52" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="m52 1 6 3-6 3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DottedArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 8" aria-hidden="true" className={cn("h-2 w-full text-gold/80", className)} fill="none">
      <path d="M0 4h52" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 5" />
      <path d="m52 1 6 3-6 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TexasMap() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className="h-[120px] w-[150px]">
      <path
        d="M15 8h26v18h15l5 5 10 4 6 10 8 7-5 10-10 14-10 12-6 6-6-8-8-12-10-8-10-6-8-6-3-18Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
        className="text-gold/70"
      />
      <circle cx="52" cy="33" r="2.6" className="fill-gold" />
      <circle cx="57" cy="66" r="2.6" className="fill-gold" />
    </svg>
  );
}

function Index() {
  const [tab, setTab] = useState<"delivered" | "stored">("delivered");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<"idle" | "error" | "success">("idle");

  function submitWaitlist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && email.length <= 254;
    setFormState(valid ? "success" : "error");
  }

  return (
    <main id="top" className="bg-background text-charcoal">
      <SiteHeader />

      {/* Hero — full-bleed cinematic split */}
      <section id="vault" className="bg-ivory">
        <div className="hero-split grid w-full grid-cols-1 lg:grid-cols-[minmax(0,50fr)_minmax(0,50fr)] xl:grid-cols-[minmax(0,54fr)_minmax(0,46fr)]">
          {/* Content panel — first on mobile, second column on desktop */}
          <div className="relative order-1 flex items-center justify-center overflow-hidden bg-ivory lg:order-2 lg:border-l lg:border-gold/25">
            <img
              src={mandalaImage}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute right-[-84px] top-1/2 z-0 hidden h-[280px] w-[280px] -translate-y-1/2 object-contain opacity-[0.04] lg:block"
            />
            <div
              className="relative z-10 w-full max-w-[680px] px-8 py-14 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both lg:px-14 lg:py-[clamp(56px,5vw,72px)] 2xl:px-16"
            >
              <Eyebrow>Vaulted Gold</Eyebrow>
              <GoldRule />
              <h1 className="mt-6 max-w-[660px] text-balance font-display font-medium text-charcoal">
                <span
                  className="block text-balance"
                  style={{ fontSize: "clamp(36px, 3.55vw, 60px)", lineHeight: "1.0", letterSpacing: "-0.025em" }}
                >
                  <span className="block">Your gold.</span>
                  <span className="block">Held in your name.</span>
                </span>
                <span
                  className="mt-2 block text-balance"
                  style={{ fontSize: "clamp(29px, 2.85vw, 48px)", lineHeight: "1.04", letterSpacing: "-0.02em" }}
                >
                  <span className="block xl:whitespace-nowrap">
                    Real, insured, and <em className="font-medium italic text-gold">yours</em>
                  </span>
                  <span className="block xl:whitespace-nowrap">to redeem whenever you choose.</span>
                </span>
              </h1>
              <p className="mt-[34px] max-w-[620px] text-[17px] font-medium leading-[1.65] text-[#2C332E]">
                Physical gold and silver, stored in an insured US vault,
                <br className="hidden xl:block" /> allocated to you individually. Not a promise on a screen.
                <br className="hidden xl:block" /> A specific holding you can verify and reach.
              </p>
              <div className="mt-[36px] flex w-full flex-col items-start gap-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-7">
                <GoldButton
                  href="#early-access"
                  className="group h-[54px] bg-gradient-to-b from-gold-soft to-gold px-8 text-[15px] font-bold"
                >
                  Get Early Access
                  <ArrowRight
                    size={17}
                    strokeWidth={2.25}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </GoldButton>
                <a href="#walkthrough" className="group flex items-center gap-4">
                  <span className="grid h-[48px] w-[48px] place-items-center rounded-full border border-gold/70 text-gold transition-colors duration-300 group-hover:border-gold group-hover:bg-gold/10">
                    <Play size={16} fill="currentColor" />
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold leading-tight text-charcoal">See how it works</span>
                    <span className="mt-1 block text-[13px] leading-tight text-[#444A45]">2 min walkthrough</span>
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Image panel — full-bleed left column */}
          <div className="relative order-2 overflow-hidden lg:order-1">
            <img
              src={vaultDoor.url}
              alt="Steel vault door with circular locking mechanism"
              className="h-full w-full animate-vault-settle object-cover object-[58%_center] aspect-[5/4] sm:aspect-[16/10] lg:aspect-auto lg:absolute lg:inset-0"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-l from-charcoal/25 to-transparent lg:block" />
          </div>
        </div>
      </section>


      {/* Custody proof row */}
      <section className="border-t border-beige/70 bg-background" aria-label="Custody assurances">
        <div className={cn(STD, "grid gap-10 py-11 sm:grid-cols-3 sm:gap-0 sm:py-12")}>
          {[
            [ShieldCheck, "IDS custody", ["Third-party depository", "built for this purpose."]],
            [Umbrella, "Insured storage", ["Full value, all risk", "insurance coverage."]],
            [UserRound, "Individually allocated", ["Not pooled. Never", "commingled."]],
          ].map(([Icon, title, lines], index) => {
            const ProofIcon = Icon as typeof ShieldCheck;
            return (
              <div
                key={title as string}
                className={cn(
                  "flex items-center justify-center gap-5 px-6 sm:px-8 lg:px-12",
                  index > 0 && "sm:border-l sm:border-beige",
                )}
              >
                <ProofIcon size={46} strokeWidth={1.4} className="shrink-0 text-gold" />
                <div>
                  <p className="text-[15px] font-semibold leading-[1.2] text-charcoal">{title as string}</p>
                  <p className="mt-1.5 text-[13px] leading-[1.5] text-[#444A45]">
                    {(lines as string[])[0]}
                    <br />
                    {(lines as string[])[1]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* Allocation diagram */}
      <section className="bg-background pb-0 pt-16 sm:pt-20">
        <div className={WIDE}>
          <div className="grid gap-10 rounded-[10px] bg-forest-deep p-8 text-[#F8F5F1] lg:min-h-[358px] lg:grid-cols-[330px_1fr] lg:p-10">
            <div className="flex flex-col">
              <Eyebrow>Allocation, not pooling</Eyebrow>
              <GoldRule />
              <h2 className="section-title mt-5 text-[#F8F5F1]">
                One allocation.
                <br />
                One customer.
              </h2>
              <p className="compact-copy mt-4 max-w-[260px] text-[#C8CFC9]">
                Your gold is held at IDS and
                <br />
                recorded in your name. Your
                <br />
                allocation is never mixed with
                <br />
                someone else’s.
              </p>
              <a
                href="#how-it-works"
                className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-gold-soft underline underline-offset-4"
              >
                How allocation works <ArrowRight size={15} strokeWidth={1.5} />
              </a>
            </div>

            <div className="flex flex-col justify-center">
              <div className="grid items-center gap-5 md:grid-cols-[1fr_auto_1fr_auto_1.5fr]">
                <div className="flex flex-col items-center text-center">
                  <p className="eyebrow text-[11px] text-[#F8F5F1]">Physical gold</p>
                  <p className="mt-1 text-[12px] text-[#9FAAA2]">At IDS</p>
                  <IconCircle size={116}>
                    <Layers size={46} strokeWidth={1.4} className="text-gold-soft" />
                  </IconCircle>
                </div>
                <ThinArrow className="hidden w-10 md:block" />
                <div className="flex flex-col items-center text-center">
                  <p className="eyebrow text-[11px] text-[#F8F5F1]">IDS custody</p>
                  <p className="mt-1 text-[12px] text-[#9FAAA2]">Segregated storage</p>
                  <IconCircle size={116}>
                    <span className="font-display text-[34px] font-medium tracking-[0.02em] text-gold-soft">IDS</span>
                  </IconCircle>
                </div>
                <ThinArrow className="hidden w-10 md:block" />
                <div className="text-center">
                  <p className="eyebrow text-[11px] text-[#F8F5F1]">Individual allocations</p>
                  <p className="mt-1 text-[12px] text-[#9FAAA2]">In customer names</p>
                  <div className="mt-3 space-y-2">
                    {[
                      ["Sonja", "0.024 oz"],
                      ["Alex", "0.051 oz"],
                      ["Maya", "0.017 oz"],
                    ].map(([name, amount]) => (
                      <div
                        key={name}
                        className="flex items-center justify-between rounded-[6px] border border-gold/55 px-4 py-2.5"
                      >
                        <span className="flex items-center gap-2 text-[13px] text-[#F8F5F1]">
                          <UserRound size={15} strokeWidth={1.5} className="text-gold-soft" />
                          {name}
                        </span>
                        <span className="text-[13px] text-[#F8F5F1]">{amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <div className="inline-flex items-center gap-3 rounded-[4px] border border-gold/45 px-5 py-2.5">
                  <span className="eyebrow text-[11px] text-[#F8F5F1]">SQOOT Record</span>
                  <span className="text-gold-soft">↔</span>
                  <span className="eyebrow text-[11px] text-[#F8F5F1]">IDS Record</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two ways to hold your gold */}
      <section id="how-it-works" className="bg-background pb-0 pt-16 sm:pt-20">
        <div className={STD}>
          <Eyebrow>Two ways to hold your gold</Eyebrow>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
            <h2 className="section-title text-charcoal">Choose the path that works for you.</h2>
            <div role="tablist" aria-label="Holding options" className="flex w-full max-w-[550px] shrink-0">
              {(
                [
                  ["delivered", "Delivered to me", Package],
                  ["stored", "Stored for me", Building2],
                ] as const
              ).map(([key, label, Icon]) => {
                const active = tab === key;
                return (
                  <button
                    key={key}
                    role="tab"
                    aria-selected={active}
                    type="button"
                    onClick={() => setTab(key)}
                    className={cn(
                      "flex h-[58px] flex-1 items-center justify-center gap-2.5 rounded-[2px] text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
                      active
                        ? "bg-forest-deep text-[#F8F5F1]"
                        : "border border-beige bg-ivory text-charcoal",
                    )}
                  >
                    <Icon size={18} strokeWidth={1.5} className="text-gold" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 grid gap-8 rounded-[10px] border border-beige bg-ivory px-8 py-7 lg:min-h-[274px] lg:grid-cols-[1fr_300px]">
            <div className="flex flex-wrap items-start justify-center gap-6 lg:flex-nowrap lg:justify-between">
              {(tab === "delivered"
                ? ([
                    [Package, "Choose", ["Select physical gold", "or silver."]],
                    [Truck, "Ship insured", ["We ship it to your", "address."]],
                    [Home, "Receive", ["It arrives. It’s", "yours."]],
                  ] as const)
                : ([
                    [Package, "Choose", ["Select physical gold", "or silver."]],
                    [Warehouse, "We vault it", ["Stored insured at", "an IDS facility."]],
                    [FileText, "Verify", ["View your vault", "records anytime."]],
                  ] as const)
              ).map(([Icon, title, lines], index) => (
                <div key={title} className="flex items-center gap-6">
                  {index > 0 && <DottedArrow className="hidden w-16 lg:block" />}
                  <div className="w-[150px] text-center">
                    <IconCircle size={86}>
                      <Icon size={34} strokeWidth={1.5} />
                    </IconCircle>
                    <p className="mt-4 text-sm font-semibold leading-[1.2] text-charcoal">{title}</p>
                    <p className="mt-2 text-[13px] leading-[1.45] text-[#444A45]">
                      {lines[0]}
                      <br />
                      {lines[1]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:border-l lg:border-beige lg:pl-10">
              <h3 className="card-title text-charcoal">
                {tab === "delivered" ? "Physical delivery." : "Vault storage."}
              </h3>
              <p className="mt-4 text-[13px] leading-[1.5] text-[#444A45]">
                {tab === "delivered" ? (
                  <>
                    You receive and take direct
                    <br />
                    possession of your metals,
                    <br />
                    shipped to your door,
                    <br />
                    insured in transit.
                  </>
                ) : (
                  <>
                    We hold your metal in an
                    <br />
                    insured US depository,
                    <br />
                    allocated in your name and
                    <br />
                    ready to redeem.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Storage locations */}
      <section id="storage" className="bg-background pb-10 pt-16 sm:pb-14 sm:pt-20">
        <div className={cn(STD, "grid gap-8 lg:grid-cols-[31%_1fr_1fr]")}>
          <div>
            <Eyebrow>Storage locations</Eyebrow>
            <GoldRule />
            <h2 className="section-title mt-5 text-charcoal">
              Your gold is held
              <br />
              somewhere real.
            </h2>
            <p className="mt-4 max-w-[290px] text-[13px] leading-[1.5] text-[#444A45]">
              Choose from secure US locations.
              <br />
              Custody documentation, insurance
              <br />
              and access to your vault records
              <br />
              come standard.
            </p>
            <div className="relative mt-6 w-[240px]">
              <TexasMap />
              <span className="absolute left-[105px] top-[32px] text-[11px] font-medium text-charcoal">Dallas, TX</span>
              <span className="absolute left-[112px] top-[72px] text-[11px] font-medium text-charcoal">
                Sugar Land, TX
              </span>
            </div>
          </div>

          {(
            [
              [
                "IDS Partner Vault",
                ["IDS — Dallas, TX"],
                ["International Depository Services", "Dallas, Texas"],
                [
                  "Fully insured, segregated storage",
                  "IDS-issued custody receipts",
                  "LBMA-recognized facility",
                  "Available for IDS account holders",
                ],
              ],
              [
                "Vaultify HOU",
                ["Vaultify PMC —", "Sugar Land, TX"],
                ["10410 Corporate Dr, Suite 107", "Sugar Land, TX 77478"],
                [
                  "Operated by Vaultify PMC",
                  "Fully insured holdings",
                  "Houston metro access",
                  "Available to all SQOOT Pure clients",
                ],
              ],
            ] as const
          ).map(([label, title, address, bullets]) => (
            <article key={label} className="flex flex-col rounded-[10px] border border-beige bg-ivory p-5">
              <Eyebrow>{label}</Eyebrow>
              <h3 className="card-title mt-4 text-charcoal">
                {title.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h3>
              <p className="mt-4 text-[13px] leading-[1.5] text-[#444A45]">
                {address[0]}
                <br />
                {address[1]}
              </p>
              <ul className="mt-3 space-y-1.5">
                {bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2.5 text-[13px] leading-[1.42] text-charcoal">
                    <Check size={15} strokeWidth={2.5} className="mt-0.5 shrink-0 text-gold" />
                    {bullet}
                  </li>
                ))}
              </ul>
              <a
                href="#early-access"
                className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-semibold text-gold underline underline-offset-4"
              >
                View vault details <ArrowRight size={15} strokeWidth={1.5} />
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* Pro-rata billing */}
      <section id="fees" className="bg-ivory py-14 sm:py-20">
        <div className={cn(STD, "grid items-center gap-10 lg:grid-cols-[38%_1fr]")}>
          <div>
            <Eyebrow>Pro-rata billing</Eyebrow>
            <GoldRule />
            <h2 className="section-title mt-5 text-charcoal">
              You only pay for the
              <br />
              time your metal is stored.
            </h2>
            <p className="mt-4 max-w-[420px] text-[13px] leading-[1.5] text-[#444A45]">
              If you redeem or request physical delivery before the end of a billing period, your storage fee is
              calculated for the days your metal was held. The minimum storage fee still applies.
            </p>
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-center gap-6 lg:justify-between">
              <div className="text-center">
                <IconCircle size={86}>
                  <Layers size={34} strokeWidth={1.4} />
                </IconCircle>
                <p className="mt-3 text-sm font-semibold text-charcoal">$20,000</p>
                <p className="text-[12px] text-[#444A45]">Vault value</p>
              </div>
              <span className="text-lg text-[#444A45]">×</span>
              <div className="text-center">
                <IconCircle size={86}>
                  <CalendarDays size={34} strokeWidth={1.4} />
                </IconCircle>
                <p className="mt-3 text-sm font-semibold text-charcoal">45 / 90 days</p>
                <p className="text-[12px] text-[#444A45]">Held in vault</p>
              </div>
              <span className="text-lg text-[#444A45]">=</span>
              <div className="grid h-[88px] w-[88px] place-items-center rounded-full border border-gold/55 text-center">
                <span>
                  <span className="block text-sm font-semibold text-charcoal">$18.75</span>
                  <span className="block text-[11px] text-[#444A45]">Pro-rated fee</span>
                </span>
              </div>
              <ThinArrow className="w-10" />
              <div className="grid h-[92px] w-[92px] place-items-center rounded-full bg-gold px-2 text-center text-[#0B2015]">
                <span>
                  <span className="block text-[13px] font-semibold leading-tight">$25.00</span>
                  <span className="block text-[10px] leading-tight">Minimum fee</span>
                </span>
              </div>
            </div>
            <div className="mt-7 grid overflow-hidden rounded-[4px] border border-beige sm:grid-cols-[240px_1fr_auto]">
              <span className="eyebrow flex items-center bg-background px-5 py-3 text-gold sm:border-r sm:border-beige">
                Storage fee formula
              </span>
              <span className="flex items-center justify-center px-5 py-3 text-[13px] text-charcoal sm:border-r sm:border-beige">
                Full period fee × days held ÷ 90
              </span>
              <span className="flex items-center justify-center px-6 py-3 text-[13px] text-charcoal">
                Minimum charge: $25
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Redemption process */}
      <section className="bg-background pb-0 pt-16 sm:pt-20">
        <div className={cn(STD, "grid gap-10 lg:grid-cols-[28%_1fr]")}>
          <div>
            <Eyebrow>Redemption process</Eyebrow>
            <GoldRule />
            <h2 className="section-title mt-5 text-charcoal">Ready when you are.</h2>
            <p className="mt-4 max-w-[260px] text-[13px] leading-[1.5] text-[#444A45]">
              Request redemption anytime,
              <br />
              including weekends. Once pricing
              <br />
              is available and confirmed,
              <br />
              proceeds are sent to your
              <br />
              verified bank account.
            </p>
            <a
              href="#faq"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold underline underline-offset-4"
            >
              Learn more <ArrowRight size={15} strokeWidth={1.5} />
            </a>
          </div>
          <div className="flex flex-wrap items-start justify-center gap-6 lg:flex-nowrap lg:justify-between">
            {(
              [
                [FileText, "Request", ["Submit your request", "anytime."]],
                [CircleCheck, "Confirm", ["Review and confirm", "pricing and fees."]],
                [Building2, "Redeem", ["We send proceeds to", "your verified account."]],
                [CreditCard, "Received", ["Funds arrive based on", "your bank’s processing."]],
              ] as const
            ).map(([Icon, title, lines], index) => (
              <div key={title} className="flex items-center gap-5">
                {index > 0 && <ThinArrow className="hidden w-12 lg:block" />}
                <div className="w-[160px] text-center">
                  <div className="relative inline-block">
                    <IconCircle size={84}>
                      <Icon size={32} strokeWidth={1.4} />
                    </IconCircle>
                    <span className="absolute -bottom-1 left-1 grid h-[22px] w-[22px] place-items-center rounded-full bg-gold text-[11px] font-semibold text-[#0B2015]">
                      {index + 1}
                    </span>
                  </div>
                  <p className="mt-4 text-sm font-semibold leading-[1.2] text-charcoal">{title}</p>
                  <p className="mt-2 text-[13px] leading-[1.45] text-[#444A45]">
                    {lines[0]}
                    <br />
                    {lines[1]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder walkthrough */}
      <section className="bg-background pb-0 pt-16 sm:pt-20">
        <div className={STD}>
          <div className="grid gap-8 overflow-hidden rounded-[10px] bg-forest-deep lg:min-h-[214px] lg:grid-cols-[380px_1fr]">
            <div className="relative">
              <img
                src={laptopImage}
                alt="Laptop showing a SQOOT Pure vault record dashboard"
                loading="lazy"
                width={1024}
                height={640}
                className="h-full w-full object-cover"
              />
              <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-b from-gold-soft to-gold text-[#0B2015]">
                <Play size={20} fill="currentColor" />
              </span>
            </div>
            <div className="px-8 py-4 text-[#F8F5F1] lg:pl-4 lg:pr-12">
              <Eyebrow>Founder walkthrough</Eyebrow>
              <h2 className="card-title mt-2 text-[#F8F5F1]">See it, don’t just read about it.</h2>
              <p className="mt-2 max-w-[520px] text-[14px] leading-[1.5] text-[#C8CFC9]">
                Watch an actual vault record, an allocation certificate and a redemption request from start to finish.
                Nothing staged.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-7">
                <GoldButton href="#early-access" className="h-12 bg-gradient-to-b from-gold-soft to-gold px-7 text-[15px] font-bold">
                  Watch the walkthrough <ArrowRight size={16} strokeWidth={2} />
                </GoldButton>
                <span className="flex items-center gap-3 text-[13px] leading-[1.45] text-[#C8CFC9]">
                  <LockKeyhole size={16} strokeWidth={1.5} className="shrink-0 text-gold-soft" />
                  Join the waitlist to be
                  <br />
                  notified when the app opens.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-background pb-16 pt-16 sm:pb-20 sm:pt-20">
        <div className={cn(STD, "grid gap-8 lg:grid-cols-[28%_1fr]")}>
          <div>
            <Eyebrow>Common questions</Eyebrow>
            <GoldRule />
            <h2 className="section-title mt-5 text-charcoal">Questions worth asking.</h2>
          </div>
          <div className="grid gap-x-8 gap-y-2 md:grid-flow-col md:grid-cols-2 md:grid-rows-3">
            {faqs.map(([question, answer], index) => {
              const isOpen = openFaq === index;
              return (
                <div key={question} className="h-fit rounded-[4px] border border-beige bg-ivory">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-2.5 text-left text-sm font-medium leading-[1.2] text-charcoal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  >
                    {question}
                    <span className="relative block h-3.5 w-3.5 shrink-0 text-charcoal">
                      <span className="absolute left-0 top-[6px] h-[1.5px] w-3.5 rounded bg-current" />
                      <span
                        className={cn("absolute left-[6px] top-0 h-3.5 w-[1.5px] rounded bg-current", isOpen && "opacity-0")}
                      />
                    </span>
                  </button>
                  {isOpen && <p className="px-5 pb-4 text-[13px] leading-[1.5] text-[#444A45]">{answer}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Email waitlist CTA */}
      <section id="early-access" className="bg-forest py-8 text-[#F8F5F1] lg:py-0">
        <div className={cn(STD, "grid items-center gap-8 lg:h-[148px] lg:grid-cols-[1fr_auto]")}>
          <div className="flex items-center gap-6">
            <img src={mandalaImage} alt="" aria-hidden="true" className="hidden h-[92px] w-[92px] sm:block" />
            <div>
              <h2 className="font-display text-[36px] font-medium leading-[1.05] text-gold-soft">Be first in line.</h2>
              <p className="mt-2 text-[13px] leading-[1.45] text-[#C8CFC9]">
                SQOOT Pure is launching soon.
                <br />
                Get early access and updates.
              </p>
            </div>
          </div>
          <form onSubmit={submitWaitlist} noValidate className="w-full lg:w-auto">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="waitlist-email">
                Email address
              </label>
              <input
                id="waitlist-email"
                type="email"
                maxLength={254}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setFormState("idle");
                }}
                placeholder="Enter your email address"
                aria-invalid={formState === "error"}
                aria-describedby="email-status"
                className="h-[54px] w-full rounded-[2px] border border-transparent bg-background px-5 text-sm text-charcoal outline-none placeholder:text-[#7A817C] focus:border-gold sm:w-[420px]"
              />
              <GoldButton type="submit" className="h-[54px] w-full bg-gradient-to-b from-gold-soft to-gold text-[15px] font-bold sm:w-[235px]">
                Get Early Access
              </GoldButton>
            </div>
            <p
              id="email-status"
              className={cn(
                "mt-3 flex items-center gap-2 text-[12px] leading-[1.45]",
                formState === "error" ? "text-error" : "text-[#C8CFC9]",
              )}
            >
              <LockKeyhole size={13} strokeWidth={1.5} className="text-gold-soft" />
              {formState === "error"
                ? "Please enter a valid email address."
                : formState === "success"
                  ? "You’re on the list. We’ll be in touch."
                  : "We respect your privacy. Your information is safe with us."}
            </p>
          </form>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
