import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteFooter, SiteHeader, STD } from "@/components/site-chrome";
import { hasGpcSignal, isAdOptOut, pushCcpaStatus, setAdOptOut } from "@/lib/analytics/ccpa";

export const Route = createFileRoute("/do-not-sell-or-share")({
  head: () => ({
    meta: [
      { title: "Do Not Sell or Share | TRUNK" },
      { name: "description", content: "Opt out of TRUNK selling or sharing your personal information for cross-context behavioural advertising." },
      { property: "og:title", content: "Do Not Sell or Share | TRUNK" },
      { property: "og:description", content: "Set your California privacy opt-out preference for TRUNK on this browser." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DoNotSellPage,
});

const P = "body-copy mt-5 text-charcoal/90";
const H2 = "font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl";

function DoNotSellPage() {
  const [optOut, setOptOut] = useState(false);
  const [gpc, setGpc] = useState(false);

  useEffect(() => {
    setGpc(hasGpcSignal());
    setOptOut(isAdOptOut());
    pushCcpaStatus();
  }, []);

  const toggle = () => {
    if (gpc) return;
    const next = !optOut;
    setAdOptOut(next);
    setOptOut(next);
  };

  return (
    <div className="flex min-h-screen flex-col bg-warm-white">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-forest-deep py-16 text-warm-white sm:py-20 lg:py-24">
          <div className={STD}>
            <div className="mx-auto max-w-[760px]">
              <p className="eyebrow text-gold mb-4">Legal</p>
              <h1 className="font-display text-3xl font-medium leading-[1.08] tracking-[-0.02em] sm:text-4xl lg:text-[2.75rem]">
                Do Not Sell or Share My Personal Information
              </h1>
            </div>
          </div>
        </section>

        <article className="mx-auto max-w-[760px] px-5 py-14 text-forest-deep sm:py-18 lg:py-22">
          <p className="body-copy text-charcoal/90">TRUNK does not sell your personal information for money. Like many websites, we may use advertising technologies from partners such as Meta, LinkedIn and Google to measure our marketing and show you relevant TRUNK ads on other sites. Under California law, this may be considered "sharing" personal information for cross-context behavioural advertising.</p>
          <p className={P}>You can opt out at any time. You don't need an account to do this.</p>

          <h2 className={H2}>Opt out on this browser</h2>
          <div className="mt-5 flex items-center justify-between gap-4 rounded-[8px] border border-beige bg-cream/60 p-5">
            <span id="ccpa-toggle-label" className="body-copy font-medium text-forest-deep">Do not sell or share my personal information</span>
            <button
              type="button"
              role="switch"
              aria-checked={optOut}
              aria-labelledby="ccpa-toggle-label"
              aria-disabled={gpc}
              disabled={gpc}
              onClick={toggle}
              className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border-2 border-forest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed ${optOut ? "bg-forest" : "bg-warm-white"}`}
            >
              <span className={`inline-block h-5 w-5 rounded-full transition-transform ${optOut ? "translate-x-5 bg-warm-white" : "translate-x-0.5 bg-forest"}`} />
            </button>
          </div>
          <p className="body-copy mt-3 text-charcoal/90" role="status" aria-live="polite">
            {optOut ? (gpc ? "Opt-out request honoured. Your browser's Global Privacy Control signal is on." : "Opt-out request honoured") : ""}
          </p>
          <p className={P}>Your choice is saved on this browser and device. If you clear your cookies or use a different browser or device, please set your preference again.</p>

          <h2 className={H2}>Global Privacy Control</h2>
          <p className={P}>If your browser sends a Global Privacy Control (GPC) signal, we automatically treat it as a request to opt out of selling or sharing for that browser.</p>

          <h2 className={H2}>Other ways to opt out</h2>
          <p className={P}>You can also email compliance@trunk.gold with the subject "Do Not Sell or Share". If you have a TRUNK account, include the email address linked to it so we can apply your choice to your account. We will process your request within 15 business days.</p>

          <h2 className={H2}>Authorised agents</h2>
          <p className={P}>You can use an authorised agent to submit a request on your behalf. We may ask the agent for proof that you have given them permission.</p>

          <h2 className={H2}>No discrimination</h2>
          <p className={P}>We will not deny you services, charge you a different price or provide a different level of service because you opted out.</p>
          <p className={P}>For more information, see our <Link to="/privacy" className="text-forest underline underline-offset-2 hover:text-gold">Privacy Policy</Link>.</p>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
