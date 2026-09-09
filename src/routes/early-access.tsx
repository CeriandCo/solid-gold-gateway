import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Check, Coins, LockKeyhole, ShieldCheck, Smartphone, Vault } from "lucide-react";
import { cn } from "@/lib/utils";
import { Eyebrow, GoldButton, SiteFooter, SiteHeader, WIDE } from "@/components/site-chrome";
import sqootPureMandala from "@/assets/sqoot-pure-mandala.png.asset.json";

export const Route = createFileRoute("/early-access")({
  head: () => ({
    meta: [
      { title: "Early Access — Join the Waitlist | SQOOT Pure" },
      {
        name: "description",
        content:
          "Join the SQOOT Pure waitlist and be notified when the app launches. Real physical gold from US$25, with secure storage and delivery options.",
      },
      { property: "og:title", content: "Early Access — Join the Waitlist | SQOOT Pure" },
      {
        property: "og:description",
        content:
          "Be first in line. Join the SQOOT Pure waitlist and be notified when the app launches.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://solid-gold-gateway.lovable.app/early-access" }],
  }),
  component: EarlyAccessPage,
});

type FormState = "idle" | "invalid" | "submitting" | "error" | "success";

const steps = [
  {
    n: "1",
    title: "Join the waitlist",
    copy: "Enter your email address to register your interest.",
  },
  {
    n: "2",
    title: "Receive updates",
    copy: "We’ll share launch news and important information.",
  },
  {
    n: "3",
    title: "Get notified",
    copy: "We’ll let you know when access becomes available.",
  },
];

const benefits = [
  { Icon: Coins, text: "Real physical gold" },
  { Icon: Vault, text: "Start from US$25" },
  { Icon: ShieldCheck, text: "Secure storage and delivery options" },
  { Icon: Smartphone, text: "Manage your holding through the SQOOT Pure app" },
];

const faqs = [
  {
    q: "Is SQOOT Pure available now?",
    a: "Not yet. SQOOT Pure is currently in pre-launch. Joining the waitlist is the best way to be notified as soon as the app becomes available.",
  },
  {
    q: "What happens when I join the waitlist?",
    a: "We register your email address and add you to the launch notification list. You’ll receive occasional updates and an email when access becomes available.",
  },
  {
    q: "Do I need to pay or provide bank details?",
    a: "No. Joining the waitlist is free and requires only your email address. We will never ask for payment or bank details as part of waitlist registration.",
  },
  {
    q: "Does joining guarantee access at launch?",
    a: "Joining the waitlist registers your interest and ensures you are notified, but it does not guarantee account approval or access at launch. Access may be subject to eligibility and availability.",
  },
  {
    q: "How will SQOOT Pure protect my information?",
    a: <>Your email address is used only for waitlist communications and handled in line with our <Link to="/privacy" className="font-medium text-gold underline underline-offset-4">Privacy Policy</Link>. We do not sell your personal information.</>,
  },
  {
    q: "Can I leave the waitlist?",
    a: "Yes. Every email we send includes an unsubscribe option, and you can ask us to remove your details at any time. There is no obligation.",
  },
];

function EarlyAccessPage() {
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  async function submitWaitlist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) && trimmed.length <= 254;
    if (!valid) {
      setFormState("invalid");
      return;
    }
    setFormState("submitting");
    try {
      // Waitlist storage is not connected yet; registration completes locally.
      await new Promise((resolve) => setTimeout(resolve, 600));
      setFormState("success");
    } catch {
      setFormState("error");
    }
  }

  return (
    <div className="early-access-page min-h-screen bg-background text-charcoal">
      <SiteHeader />

      <main>
        {/* Hero — form above the fold */}
        <section className="relative overflow-hidden bg-ivory">
          <img
            src={sqootPureMandala.url}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 top-1/2 hidden w-[420px] -translate-y-1/2 opacity-[0.12] mix-blend-multiply sm:block lg:-right-10 lg:w-[520px]"
          />
          <div className={cn(WIDE, "relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-24")}>
            <div className="max-w-[560px]">
              <Eyebrow>Early access</Eyebrow>
              <h1 className="mt-4 font-display text-[2.75rem] font-medium leading-[1.05] tracking-[-0.015em] text-forest sm:text-[3.5rem]">
                Be first in line.
              </h1>
              <p className="mt-5 max-w-[460px] text-[15px] leading-relaxed text-charcoal/80 sm:text-base">
                Join the SQOOT Pure waitlist and be notified when the app launches.
              </p>

              {formState === "success" ? (
                <div
                  role="status"
                  className="mt-8 max-w-[520px] rounded-[8px] border border-gold bg-gold/10 px-6 py-6"
                >
                  <p className="flex items-center gap-3 font-display text-xl font-medium text-forest">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-gold text-gold">
                      <Check size={14} strokeWidth={2.5} />
                    </span>
                    You’re on the list.
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/80">
                    Thank you for joining the SQOOT Pure waitlist. We’ll let you know when access
                    becomes available.
                  </p>
                </div>
              ) : (
                <form onSubmit={submitWaitlist} noValidate className="mt-8 max-w-[520px]">
                  <label
                    htmlFor="early-access-email"
                    className="block text-sm font-semibold text-forest"
                  >
                    Email address
                  </label>
                  <div className="mt-2.5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                    <input
                      id="early-access-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      maxLength={254}
                      required
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (formState !== "submitting") setFormState("idle");
                      }}
                      placeholder="Enter your email address"
                      aria-invalid={formState === "invalid"}
                      aria-describedby="early-access-status"
                      className="h-[54px] w-full rounded-[2px] border border-beige bg-warm-white px-5 text-sm text-charcoal outline-none transition-shadow placeholder:text-muted-foreground focus:border-gold focus:ring-2 focus:ring-gold/60"
                    />
                    <GoldButton
                      type="submit"
                      className={cn("h-[54px] w-full px-8 sm:w-auto", formState === "submitting" && "opacity-70")}
                    >
                      {formState === "submitting" ? "Joining…" : "Join the Waitlist"}
                    </GoldButton>
                  </div>
                  <p
                    id="early-access-status"
                    role={formState === "invalid" || formState === "error" ? "alert" : undefined}
                    className={cn(
                      "mt-3 flex items-center gap-2 text-[12px] leading-[1.5]",
                      formState === "invalid" || formState === "error"
                        ? "text-error"
                        : "text-charcoal/70",
                    )}
                  >
                    <LockKeyhole size={13} strokeWidth={1.5} className="shrink-0 text-gold" />
                    {formState === "invalid"
                      ? "Please enter a valid email address."
                      : formState === "error"
                        ? "Something went wrong. Please try again."
                        : "No payment or bank details required. No obligation."}
                  </p>
                </form>
              )}

              <p className="mt-4 text-[12px] leading-[1.5] text-charcoal/60">
                Currently available to U.S. residents only.
              </p>
            </div>

            {/* Calm brand panel instead of a large hero image */}
            <div className="relative hidden lg:block" aria-hidden="true">
              <div className="rounded-[8px] border border-beige bg-forest-deep px-10 py-12 text-warm-white">
                <img src={sqootPureMandala.url} alt="" className="h-16 w-16 object-contain" />
                <p className="mt-8 font-display text-[1.75rem] font-medium leading-[1.15] text-gold-soft">
                  Real gold, real ownership — launching soon.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-warm-white/75">
                  Buy physical gold from US$25, keep it securely stored in insured U.S. vaults, or
                  take delivery when you choose.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What happens next */}
        <section className="bg-background py-16 sm:py-20">
          <div className={WIDE}>
            <div className="max-w-[560px]">
              <Eyebrow>What happens next</Eyebrow>
              <h2 className="mt-4 font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.015em] text-forest sm:text-[2.5rem]">
                Three simple steps.
              </h2>
            </div>
            <ol className="mt-12 grid gap-6 sm:grid-cols-3">
              {steps.map((step) => (
                <li
                  key={step.n}
                  className="rounded-[8px] border border-beige bg-ivory px-7 py-8"
                >
                  <span className="font-display text-3xl font-medium text-gold">{step.n}</span>
                  <h3 className="mt-4 font-display text-xl font-medium text-forest">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-charcoal/75">{step.copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-forest-deep py-16 text-warm-white sm:py-20">
          <div className={WIDE}>
            <div className="max-w-[560px]">
              <Eyebrow>Why SQOOT Pure</Eyebrow>
              <h2 className="mt-4 font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.015em] text-warm-white sm:text-[2.5rem]">
                A simpler way to own gold.
              </h2>
            </div>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map(({ Icon, text }) => (
                <li
                  key={text}
                  className="rounded-[8px] border border-warm-white/15 bg-warm-white/5 px-6 py-7"
                >
                  <Icon strokeWidth={1.5} className="h-7 w-7 text-gold" aria-hidden="true" />
                  <p className="mt-4 text-sm font-medium leading-relaxed text-warm-white/90">
                    {text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-background py-16 sm:py-20">
          <div className={cn(WIDE, "max-w-[860px]")}>
            <div className="text-center">
              <Eyebrow>Questions</Eyebrow>
              <h2 className="mt-4 font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.015em] text-forest sm:text-[2.5rem]">
                Waitlist FAQ
              </h2>
            </div>
            <div className="mt-10">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={faq.q} className="border-b border-beige first:border-t">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={`early-access-faq-${index}`}
                      className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-5 text-left focus-visible:outline-2 focus-visible:outline-gold"
                    >
                      <span className={cn("text-[15px] font-semibold", isOpen ? "text-gold-dark" : "text-forest")}>
                        {faq.q}
                      </span>
                      <span className="relative block h-4 w-4 text-gold" aria-hidden="true">
                        <span className="absolute left-0 top-[7px] h-px w-4 bg-current" />
                        <span
                          className={cn(
                            "absolute left-[7px] top-0 h-4 w-px bg-current transition-transform",
                            isOpen && "rotate-90 opacity-0",
                          )}
                        />
                      </span>
                    </button>
                    {isOpen && (
                      <div id={`early-access-faq-${index}`} role="region">
                        <p className="pb-5 pr-10 text-sm leading-relaxed text-charcoal/80">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
