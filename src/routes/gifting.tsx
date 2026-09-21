import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  createGiftCardCheckout,
  getGiftCardCheckoutStatus,
  getGiftCardOffering,
} from "@/lib/commerce.functions";


import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Award,
  Baby,
  Check,
  Gem,
  Gift,
  Globe2,
  GraduationCap,
  HandHeart,
  Heart,
  LockKeyhole,
  PartyPopper,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { CtaRow, GoldButton, SiteFooter, SiteHeader } from "@/components/site-chrome";
import { InnerPageHero } from "@/components/inner-page-hero";
import heroGift from "@/assets/gifting-hero-v2.png.asset.json";
import weddingPhoto from "@/assets/occasion-weddings.jpg";
import arrivalsPhoto from "@/assets/occasion-new-arrivals.jpg";
import birthdayPhoto from "@/assets/occasion-birthdays.jpg";
import achievementPhoto from "@/assets/occasion-achievements.jpg";
import festivalPhoto from "@/assets/occasion-festivals.jpg";
import familyPhoto from "@/assets/occasion-family.jpg";
import giftCardBackground from "@/assets/gifting-gift-card-background.jpg";
import sqootLogo from "@/assets/sqoot-pure-logo.png";
import sqootMandala from "@/assets/sqoot-mandala.png";
import closingGift from "@/assets/gifting-closing-v2.png.asset.json";

export const Route = createFileRoute("/gifting")({
  loader: () => getGiftCardOffering(),
  head: () => ({
    meta: [
      { title: "Gift Real Gold — SQOOT Pure" },
      {
        name: "description",
        content:
          "Celebrate life's most precious moments with real gold, thoughtfully and beautifully delivered by SQOOT Pure.",
      },
      { property: "og:title", content: "Gift Real Gold — SQOOT Pure" },
      {
        property: "og:description",
        content: "A thoughtful, meaningful and timeless gift of real gold.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://solid-gold-gateway.lovable.app/gifting" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://solid-gold-gateway.lovable.app/gifting" }],
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
  { icon: HandHeart, title: "Flexible", description: "Choose an amount and let them pick the gift" },
  { icon: Truck, title: "Beautifully Delivered", description: "Premium packaging, ready to gift" },
  { icon: RefreshCw, title: "Redeemable", description: "Redeem or upgrade anytime" },
  { icon: Globe2, title: "Vaulted Gifting", description: "Gift allocated gold held securely in insured U.S. vaults" },
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
  { icon: Gem, title: "100% Real Gold", description: "Allocated, audited and insured" },
  { icon: ShieldCheck, title: "Secure Vaulted", description: "Stored in fully insured U.S. vaults" },
  { icon: LockKeyhole, title: "Fully Insured", description: "Your gold is protected every step of the way" },
  { icon: RefreshCw, title: "Redeem or Upgrade", description: "Redeem, sell or upgrade at any time" },
  { icon: Send, title: "Simple to Gift", description: "Allocated to the recipient — no international shipping" },
];

function formatGiftCardAmount(amountCents: number, currency: string | null) {
  const amount = amountCents / 100;
  const fractionDigits = amountCents % 100 === 0 ? 0 : 2;
  if (!currency) {
    return `$${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(amount)}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}

function formatGiftCardNumeral(amountCents: number) {
  const amount = amountCents / 100;
  const fractionDigits = amountCents % 100 === 0 ? 0 : 2;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}

function giftCardCurrencyMark(currency: string | null) {
  if (!currency) return "$";
  const parts = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).formatToParts(1);
  return parts.find((part) => part.type === "currency")?.value ?? "$";
}

const CHECKOUT_MESSAGES: Record<string, string> = {
  unavailable: "Secure checkout is not available yet. Please try again shortly.",
  rate_limited: "Too many attempts. Please wait a few minutes and try again.",
  failed: "We couldn't start checkout. Please try again.",
  cancelled: "Checkout was cancelled. You have not been charged.",
  confirming: "Confirming your payment…",
  paid: "Thank you. Your payment is confirmed. The gift card will be sent to your recipient once it clears our standard security checks.",
  pending:
    "Your payment is being confirmed. You'll receive an email receipt from Stripe.",
};

function GiftingNewPage() {
  const scope = useReveal<HTMLElement>();
  const offering = Route.useLoaderData();
  const { currency, denominations } = offering;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const attemptIdRef = useRef<string | null>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const giftCardRef = useRef<HTMLDivElement>(null);
  const startCheckout = useServerFn(createGiftCardCheckout);
  const readCheckoutStatus = useServerFn(getGiftCardCheckoutStatus);
  const selected = denominations.find((option) => option.id === selectedId) ?? null;
  const currencyMark = giftCardCurrencyMark(currency);

  const handleCardPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const card = giftCardRef.current;
    if (
      !card ||
      event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    const bounds = card.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
    card.style.setProperty("--card-tilt-x", `${(-vertical * 5).toFixed(2)}deg`);
    card.style.setProperty("--card-tilt-y", `${(horizontal * 6).toFixed(2)}deg`);
    card.style.setProperty("--card-gloss-x", `${(horizontal + 0.5) * 100}%`);
    card.dataset["interacting"] = "true";
  };

  const resetCardTilt = () => {
    const card = giftCardRef.current;
    if (!card) return;
    card.style.removeProperty("--card-tilt-x");
    card.style.removeProperty("--card-tilt-y");
    card.style.removeProperty("--card-gloss-x");
    delete card.dataset["interacting"];
  };

  const announce = (message: string) => {
    setCheckoutMessage(message);
    window.requestAnimationFrame(() => messageRef.current?.focus());
  };

  const handleCheckout = async () => {
    if (!selected || checkoutBusy) return;
    if (!attemptIdRef.current) attemptIdRef.current = crypto.randomUUID();
    setCheckoutBusy(true);
    setCheckoutMessage("");
    try {
      const result = await startCheckout({
        data: { denominationId: selected.id, attemptId: attemptIdRef.current },
      });
      if (result.ok) {
        // Trust nothing but the expected Stripe host, on this side too.
        if (new URL(result.url).host === "checkout.stripe.com") {
          window.location.assign(result.url);
          return;
        }
        announce(CHECKOUT_MESSAGES["failed"]!);
      } else {
        announce(
          CHECKOUT_MESSAGES[result.code] ?? CHECKOUT_MESSAGES["failed"]!,
        );
      }
    } catch {
      announce(CHECKOUT_MESSAGES["failed"]!);
    }
    setCheckoutBusy(false);
  };

  // Return from Stripe: confirm against our own records, never the redirect.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const outcome = params.get("checkout");
    if (!outcome) return;
    const sessionId = params.get("session_id");

    const clean = () => {
      const url = new URL(window.location.href);
      url.searchParams.delete("checkout");
      url.searchParams.delete("session_id");
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    };

    if (outcome === "cancelled" || !sessionId) {
      announce(CHECKOUT_MESSAGES[outcome === "cancelled" ? "cancelled" : "pending"]!);
      clean();
      return;
    }

    let cancelled = false;
    announce(CHECKOUT_MESSAGES["confirming"]!);
    void (async () => {
      for (let attempt = 0; attempt < 6 && !cancelled; attempt += 1) {
        try {
          const status = await readCheckoutStatus({ data: { sessionId } });
          if (cancelled) return;
          if (status.status === "paid") {
            announce(CHECKOUT_MESSAGES["paid"]!);
            clean();
            return;
          }
        } catch {
          /* keep polling; the final message covers it */
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
      if (!cancelled) {
        announce(CHECKOUT_MESSAGES["pending"]!);
        clean();
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  return (
    <main ref={scope} id="top" className="gifting-new">
      <SiteHeader />

      <InnerPageHero
        titleId="gift-hero-title"
        eyebrow="Gifting gold"
        title={<>Celebrate love<span>with a gift</span><span>that lasts.</span></>}
        body={<>Thoughtful, meaningful and timeless. Real gold that marks life&apos;s most precious moments.</>}
        actions={<CtaRow><GoldButton href="#gift-card">Buy a Gift Card</GoldButton><GoldButton href="#occasions" variant="secondary">Explore Gold Gifts</GoldButton></CtaRow>}
        imageSrc={heroGift.url}
        imageAlt="Dark green gift box tied with bronze ribbon beside a SQOOT Pure 10g gold bar"
        imageWidth={1920}
        imageHeight={720}
        imageLoading="eager"
        imageVariant="gifting"
      />

      <section className="gift-benefits" aria-label="Gifting benefits">
        <div className="gift-benefits-inner site-container">
          {features.map(({ icon: Icon, title, description }) => (
            <article key={title} className="gift-benefit" data-reveal>
              <Icon size={32} strokeWidth={1.5} absoluteStrokeWidth />
              <h2>{title}</h2>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="occasions" className="gift-occasions">
        <div className="gift-occasions-inner site-container">
          <header data-reveal>
            <div className="gift-section-overline">
              <span />
              <p>For every occasion</p>
              <Mandala />
              <span />
            </div>
            <h2>Mark life&apos;s most precious moments</h2>
          </header>

          <div className="gift-occasion-grid">
            {occasions.map(({ label, image, icon: Icon }) => (
              <article key={label} className="gift-occasion-card" data-reveal>
                <div className="gift-occasion-image">
                  <img
                    src={image}
                    alt={`${label} gold gifting inspiration`}
                    width={1024}
                    height={1024}
                    loading="lazy"
                  />
                </div>
                <div className="gift-occasion-label"><h3>{label}</h3></div>
                 <span className="gift-occasion-icon"><Icon size={18} strokeWidth={1.25} absoluteStrokeWidth /></span>
              </article>
            ))}
          </div>

          <a href="#gift-card" className="gift-view-all" data-reveal>View all occasions <ArrowRight /></a>
        </div>
      </section>

      <section id="gift-card" className="gift-card-section" aria-labelledby="gift-card-title">
        <div className="gift-card-copy">
          <div className="gift-card-copy-inner">
            <div className="gift-card-overline" data-reveal><span /><p>SQOOT Pure Gift Card</p><Mandala /></div>
            <h2 id="gift-card-title" data-reveal><span>Give them the freedom</span><span>to choose.</span></h2>
            <p className="gift-card-intro" data-reveal>
              A meaningful gift for every occasion. Choose an amount and let someone special begin their journey with SQOOT Pure.
            </p>

            <fieldset className="gift-amount-fieldset" data-reveal>
              <legend>Choose your gift amount</legend>
              <div className="gift-amount-grid">
                {denominations.map(({ id, amountCents }) => {
                  const formattedAmount = formatGiftCardAmount(amountCents, currency);
                  return (
                    <label key={id} className="gift-amount-option">
                      <input
                        type="radio"
                        name="gift-card-amount"
                        value={id}
                        aria-label={formattedAmount}
                        checked={selectedId === id}
                        onChange={() => {
                          setSelectedId(id);
                          setCheckoutMessage("");
                          attemptIdRef.current = null;
                        }}

                      />
                      <span className="gift-amount-label">
                        <span className="gift-amount-price" aria-hidden="true">
                          <span className="gift-amount-currency">{currencyMark}</span>
                          <span>{formatGiftCardNumeral(amountCents)}</span>
                        </span>
                        <Check className="gift-amount-check" aria-hidden="true" />
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="gift-card-value" aria-hidden="true" data-reveal>
              <span>Gift card value</span>
              <strong className={selected === null ? "is-placeholder" : ""}>
                {selected === null ? "Select an amount" : formatGiftCardAmount(selected.amountCents, currency)}
              </strong>
            </div>

            <div className="gift-card-action-group" data-reveal>
              <GoldButton
                type="button"
                disabled={selected === null || checkoutBusy}
                aria-busy={checkoutBusy}
                className="gift-card-checkout"
                onClick={() => void handleCheckout()}
              >
                {checkoutBusy ? "Starting secure checkout…" : "Continue to Secure Checkout"}
              </GoldButton>
              <p className="gift-card-security"><LockKeyhole aria-hidden="true" />Secure payment powered by Stripe</p>
            </div>
            <p
              ref={messageRef}
              tabIndex={-1}
              className="gift-card-message"
              data-reveal
              role="status"
              aria-live="polite"
            >
              {checkoutMessage}
            </p>

          </div>
        </div>

        <div
          className="gift-card-visual"
          data-reveal
          role="img"
          aria-label="SQOOT Pure gift card resting on green velvet with cream paper and ribbon"
        >
          <img
            className="gift-card-background"
            src={giftCardBackground}
            alt=""
            width={1536}
            height={1280}
            loading="lazy"
          />
          <div
            ref={giftCardRef}
            className="gift-card-object"
            aria-hidden="true"
            onPointerMove={handleCardPointerMove}
            onPointerLeave={resetCardTilt}
            onPointerCancel={resetCardTilt}
          >
            <img className="gift-card-logo" src={sqootLogo} alt="" width={567} height={200} draggable={false} />
            <img className="gift-card-mandala" src={sqootMandala} alt="" width={767} height={768} draggable={false} />
            <div className="gift-card-object-copy">
              <p>Gift Card</p>
              <span key={selected?.id ?? "placeholder"} className={selected === null ? "is-placeholder" : ""}>
                {selected === null ? "Select amount" : formatGiftCardAmount(selected.amountCents, currency)}
              </span>
            </div>
          </div>
          <span className="sr-only" aria-live="polite">
            {selected === null
              ? "No gift card amount selected"
              : `${formatGiftCardAmount(selected.amountCents, currency)} gift card selected`}
          </span>
        </div>

      </section>

      <section className="gift-trust" aria-label="Gold ownership assurances">
        <div className="gift-trust-inner site-container">
          {assurances.map(({ icon: Icon, title, description }) => (
            <article key={title} data-reveal>
              <Icon strokeWidth={1.5} absoluteStrokeWidth />
              <h2>{title}</h2>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="closing-gift" className="gift-closing" data-reveal="trigger">
        <img
          src={closingGift.url}
          alt="SQOOT Pure 10g gold bar in an ivory presentation box with forest green velvet and olive branches"
          width={1942}
          height={809}
          loading="lazy"
          decoding="async"
        />
        <div className="gift-closing-shade" />
        <div className="gift-closing-inner site-container">
          <div>
            <div className="gift-closing-overline" data-reveal><span /><p>A gift that lasts generations</p></div>
            <h2 data-reveal>More than a gift.<span>A legacy of love.</span></h2>
            <p data-reveal>
              Give real gold that will be cherished today and passed down through generations.
            </p>
            <GoldButton href="#top" className="mt-8" data-reveal>Start Gifting Gold</GoldButton>
          </div>
        </div>
      </section>

      <SiteFooter />
      <style>{giftingStyles}</style>
    </main>
  );
}

const giftingStyles = `
.gifting-new {
  --gift-cream-soft: color-mix(in oklab,var(--cream-2) 82%,var(--gold) 18%);
  --gift-gold-light: color-mix(in oklab,var(--gold) 78%,var(--warm-white));
  color: var(--muted-ink); background: var(--warm-white); font-family: var(--font-sans);
  font-synthesis: none; -webkit-font-smoothing: antialiased; overflow-x: clip;
}
html:has(.gifting-new) { scroll-behavior: smooth; }
.gifting-new h1,.gifting-new h2,.gifting-new h3 { font-family: var(--font-display); letter-spacing: 0; }
.gifting-new .inner-page-hero-image--gifting { object-position: 66% 50%; }
.gifting-new .inner-page-hero-overlay { background: linear-gradient(90deg,rgba(8,34,24,.90) 0%,rgba(8,34,24,.78) 28%,rgba(8,34,24,.36) 49%,rgba(8,34,24,0) 70%); }
.gift-section-overline,.gift-card-overline,.gift-closing-overline { display: flex; align-items: center; text-transform: uppercase; }
.gift-benefits { height: auto; padding-block: clamp(32px,3.5vw,48px); background: var(--gift-cream-soft); }
.gift-benefits-inner { display: grid; grid-template-columns: repeat(6,minmax(0,1fr)); align-items: stretch; }
.gift-benefit { min-width: 0; min-height: 112px; padding-inline: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; border-left: 1px solid color-mix(in oklab,var(--gold-dark) 22%,transparent); }
.gift-benefit:first-child { border-left: 0; }.gift-benefit > svg { width: 32px; height: 32px; flex: 0 0 32px; color: var(--forest); }
.gift-benefit h2 { margin-top: 12px; color: var(--ink); font-size: 17px; font-weight: 600; line-height: 1.15; }
.gift-benefit p { max-width: 18ch; margin-top: 5px; font-size: 13px; font-weight: 400; line-height: 1.45; }
.gift-occasions { height: auto; padding-block: clamp(72px,7vw,104px); background-color: var(--cream-2); background-image: radial-gradient(color-mix(in oklab,var(--gold-dark) 4%,transparent) .6px,transparent .7px); background-size: 5px 5px; }
.gift-occasions-inner { display: flex; flex-direction: column; align-items: center; }
.gift-occasions header { text-align: center; }.gift-section-overline { justify-content: center; gap:8px; }
.gift-section-overline > span { width: 27px; height: 1px; background: var(--gold); opacity: .8; }.gift-section-overline p { color: var(--gold-dark); font-size: 12px; font-weight: 600; letter-spacing: .2em; }.gift-section-overline svg { width: 15px; height: 15px; color: var(--gold-dark); }
.gift-occasions h2 { margin-top: 12px; margin-bottom: 32px; color: var(--ink); font-size: clamp(36px,3.6vw,52px); font-weight: 500; line-height: 1.05; }
.gift-occasion-grid { width: 100%; display: grid; grid-template-columns: repeat(6,minmax(0,1fr)); gap: 12px; }
.gift-occasion-card { position: relative; height: clamp(240px,20vw,288px); overflow: hidden; border-radius: 8px; background: var(--forest); transition: transform .42s var(--reveal-ease),box-shadow .42s var(--reveal-ease); }
.gift-occasion-image { height: 67.57%; overflow: hidden; }.gift-occasion-image img { width: 100%; height: 100%; object-fit: cover; transition: transform .42s var(--reveal-ease); }
.gift-occasion-label { height: 32.43%; display: grid; place-items: center; padding: 13px 5px 2px; color: var(--warm-white); background: var(--forest); text-align: center; }.gift-occasion-label h3 { font-size: 16px; font-weight: 500; line-height: 1.1; }
.gift-occasion-icon { position: absolute; left: 50%; top: 67.57%; width: 40px; height: 40px; display: grid; flex: none; place-items: center; border: 1px solid var(--gold); border-radius: 50%; color: var(--gift-gold-light); background: var(--forest); transform: translate(-50%,-50%); transition: border-color .42s var(--reveal-ease); }.gift-occasion-icon svg { width: 18px; height: 18px; flex: none; }
@media (hover:hover) and (pointer:fine) { .gift-occasion-card.is-visible:hover { transform: translateY(-4px); box-shadow: 0 18px 38px color-mix(in oklab,var(--forest) 16%,transparent); }.gift-occasion-card:hover img { transform: scale(1.045); }.gift-occasion-card:hover .gift-occasion-icon { border-color: var(--gift-gold-light); } }
.gift-view-all { display: inline-flex; align-items: center; gap:4px; margin-top: 28px; color: var(--gold-dark); font-size: 12px; font-weight: 500; text-decoration: underline; text-underline-offset: 4px; }.gift-view-all svg { width: 15px; height: 15px; }
.gift-card-section { display: grid; grid-template-columns: minmax(0,52%) minmax(0,48%); background: color-mix(in oklab,var(--cream-2) 72%,var(--gold) 28%); }
.gift-card-copy { min-width: 0; display: flex; align-items: center; padding-block: clamp(72px,7.5vw,112px); padding-left: max(var(--gutter),calc((100vw - var(--container))/2 + var(--gutter))); padding-right: clamp(32px,4vw,64px); }
.gift-card-copy-inner { width: min(100%,600px); }
.gift-card-overline { gap:8px; color: var(--gold-dark); }.gift-card-overline > span { width: 28px; height: 1px; background: var(--gold); }.gift-card-overline p { font-size: 12px; line-height: 1; font-weight: 600; letter-spacing: .2em; }.gift-card-overline svg { width: 14px; height: 14px; }
.gift-card-copy h2 { max-width: 620px; margin-top: 16px; color: var(--forest); font-size: clamp(36px,3.6vw,52px); font-weight: 500; line-height: 1.04; text-wrap: balance; }.gift-card-copy h2 span { display: block; white-space: nowrap; }.gift-card-copy h2 span:last-child { color: var(--gold-dark); }
.gift-card-intro { max-width: 46ch; margin-top: 20px; color: var(--muted-ink); font-size: clamp(15px,1.2vw,17px); line-height: 1.6; }
.gift-amount-fieldset { margin-top: 40px; border: 0; padding: 0; }.gift-amount-fieldset legend { width: 100%; margin-bottom: 16px; color: var(--muted-ink); font-size: 10px; font-weight: 600; line-height: 1; letter-spacing: .18em; text-transform: uppercase; opacity: .7; }.gift-amount-fieldset legend::after { content:""; display: inline-block; width: calc(100% - 190px); height: 1px; margin-left: 14px; vertical-align: middle; background: color-mix(in oklab,var(--gold-dark) 22%,transparent); }
.gift-amount-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 12px; }
.gift-amount-option { position: relative; min-width: 0; cursor: pointer; }.gift-amount-option input { position: absolute; width: 1px; height: 1px; opacity: 0; }
.gift-amount-label { position: relative; height: 76px; display: flex; align-items: center; justify-content: center; border: 1px solid color-mix(in oklab,var(--gold-dark) 22%,transparent); border-radius: 2px; color: var(--forest); background: transparent; transition: border-color .18s,background-color .18s,box-shadow .18s; }
.gift-amount-price { display: inline-flex; align-items: flex-start; justify-content: center; font-family: var(--font-display); font-size: 30px; font-weight: 500; line-height: 1; font-variant-numeric: lining-nums tabular-nums; }
.gift-amount-currency { margin-right: 2px; padding-top: .08em; color: var(--gold-dark); font-size: .55em; line-height: 1; }
.gift-amount-check { position: absolute; top: 9px; right: 9px; width: 12px; height: 12px; visibility: hidden; color: var(--gold-dark); stroke-width: 2; }
.gift-amount-option input:checked + .gift-amount-label { border-color: var(--gold-dark); background: var(--warm-white); box-shadow: inset 0 0 0 1px var(--gold-dark); }.gift-amount-option input:checked + .gift-amount-label .gift-amount-check { visibility: visible; }
.gift-amount-option input:focus-visible + .gift-amount-label { outline: 2px solid var(--forest); outline-offset: 3px; }
@media (hover:hover) and (pointer:fine) { .gift-amount-option:hover .gift-amount-label { border-color: var(--gold-dark); background: var(--warm-white); } }
.gift-card-value { height: 46px; margin-top: 28px; border-block: 1px solid color-mix(in oklab,var(--gold-dark) 22%,transparent); display: flex; align-items: center; justify-content: space-between; gap: 16px; }.gift-card-value > span { color: var(--muted-ink); font-size: 10px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; opacity: .7; }.gift-card-value strong { color: var(--forest); font-family: var(--font-display); font-size: 23px; font-weight: 500; line-height: 1; font-variant-numeric: lining-nums tabular-nums; }.gift-card-value strong.is-placeholder { color: var(--muted-ink); font-family: var(--font-sans); font-size: 12px; font-weight: 400; opacity: .58; }
.gift-card-action-group { margin-top: 24px; }.gift-card-checkout { width: auto; }.gift-card-checkout:disabled { transform: none; }
.gift-card-security { display: flex; align-items: center; justify-content: flex-start; gap: 6px; margin-top: 14px; color: var(--muted-ink); font-size: 12px; opacity: .68; }.gift-card-security svg { width: 14px; height: 14px; color: var(--gold-dark); }
.gift-card-message { min-height: 38px; padding-top: 8px; color: var(--forest); font-size: 13px; line-height: 1.4; text-align: left; }
.gift-card-visual { position: relative; min-width: 0; min-height: 610px; overflow: hidden; display: grid; place-items: center; padding: clamp(44px,5vw,72px); isolation: isolate; perspective: 1100px; }
.gift-card-background { position: absolute; inset: 0; z-index: -1; width: 100%; height: 100%; object-fit: cover; object-position: center; }
.gift-card-object { --card-tilt-x: 1deg; --card-tilt-y: -3deg; --card-gloss-x: 50%; position: relative; width: min(100%,560px); aspect-ratio: 1.63; overflow: hidden; border: 1px solid var(--gold); border-radius: 7px; color: var(--gift-gold-light); background: var(--forest); box-shadow: -8px 22px 42px color-mix(in oklab,var(--forest-deep) 32%,transparent),0 6px 13px color-mix(in oklab,var(--forest-deep) 20%,transparent); transform: perspective(1100px) rotateX(var(--card-tilt-x)) rotateY(var(--card-tilt-y)) rotateZ(-1.3deg); transform-style: preserve-3d; will-change: transform; transition: transform .48s var(--reveal-ease),box-shadow .48s var(--reveal-ease); touch-action: pan-y; }
.gift-card-object::before { content:""; position:absolute; z-index:3; inset:-45% -70%; pointer-events:none; background:linear-gradient(105deg,transparent 41%,color-mix(in oklab,var(--warm-white) 3%,transparent) 45%,color-mix(in oklab,var(--warm-white) 20%,transparent) 49%,color-mix(in oklab,var(--warm-white) 4%,transparent) 53%,transparent 58%); transform:translateX(-38%) rotate(2deg); }
.gift-card-visual.is-visible .gift-card-object::before { animation:giftCardSheen 8s ease-in-out infinite; }
.gift-card-object::after { content:""; position:absolute; z-index:4; inset:8px; border:1px solid color-mix(in oklab,var(--gold) 34%,transparent); border-radius:4px; box-shadow:inset 1px 1px 0 color-mix(in oklab,var(--warm-white) 12%,transparent),inset -1px -1px 0 color-mix(in oklab,var(--forest-deep) 30%,transparent); pointer-events:none; }
.gift-card-object[data-interacting="true"] { box-shadow: -12px 28px 48px color-mix(in oklab,var(--forest-deep) 35%,transparent),0 8px 16px color-mix(in oklab,var(--forest-deep) 22%,transparent); transition-duration: .12s; }
.gift-card-object[data-interacting="true"]::before { animation-play-state:paused; transform:translateX(calc(var(--card-gloss-x) - 88%)) rotate(2deg); }
.gift-card-logo { position:absolute; z-index:2; top:9%; left:7%; width:38%; height:auto; object-fit:contain; image-rendering:auto; user-select:none; }
.gift-card-mandala { position:absolute; z-index:1; right:-8%; top:-15%; width:58%; height:92%; object-fit:contain; opacity:.12; mix-blend-mode:screen; user-select:none; }
.gift-card-object-copy { position: absolute; left: 8%; right: 8%; bottom: 12%; display: flex; align-items: flex-end; justify-content: space-between; gap: 18px; }.gift-card-object-copy p { font-size: 11px; font-weight: 600; letter-spacing: .22em; text-transform: uppercase; }.gift-card-object-copy > span { min-width: 145px; color: var(--warm-white); font-family: var(--font-display); font-size: clamp(31px,3vw,43px); font-weight: 500; line-height: 1; text-align: right; animation: giftCardAmount .2s ease-out both; }.gift-card-object-copy > span.is-placeholder { color: color-mix(in oklab,var(--warm-white) 76%,transparent); font-family: var(--font-sans); font-size: 13px; font-weight: 400; }
.gift-trust { height: auto; padding-block: clamp(40px,4vw,56px); color: var(--warm-white); background: var(--forest-deep); }
.gift-trust-inner { display: grid; grid-template-columns: repeat(5,minmax(0,1fr)); align-items: stretch; }.gift-trust article { min-width: 0; min-height: 112px; padding-inline: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; border-left: 1px solid color-mix(in oklab,var(--gold) 35%,transparent); }.gift-trust article:first-child { border-left: 0; }.gift-trust svg { width: 32px; height: 32px; color: var(--gift-gold-light); }.gift-trust h2 { margin-top: 8px; color: var(--gift-gold-light); font-family: var(--font-sans); font-size: 14px; font-weight: 600; line-height: 1.15; }.gift-trust p { max-width: 20ch; margin-top: 5px; color: color-mix(in oklab,var(--warm-white) 82%,transparent); font-size: 12px; line-height: 1.4; }
.gift-closing { position: relative; min-height: clamp(480px,41.67vw,620px); overflow: hidden; color: var(--warm-white); }.gift-closing > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 67% center; transform: scale(1.025); transition: transform 1.1s var(--reveal-ease); }.gift-closing.is-visible > img { transform: scale(1); }.gift-closing-shade { position: absolute; inset: 0; background: linear-gradient(90deg,rgba(63,31,12,.92) 0%,rgba(63,31,12,.79) 31%,rgba(25,39,26,.34) 57%,rgba(15,31,22,.06) 78%); }.gift-closing-inner { position: relative; min-height: inherit; display: flex; align-items: center; }.gift-closing-inner > div { width: 100%; max-width: 500px; }.gift-closing-overline { gap:8px; color: var(--gift-gold-light); }.gift-closing-overline > span { width: 42px; height: 1px; background: var(--gold); }.gift-closing-overline p { font-size: 12px; font-weight: 600; letter-spacing: .18em; }.gift-closing h2 { margin-top: 12px; color: var(--warm-white); font-size: clamp(36px,3.6vw,52px); font-weight: 500; line-height: 1.04; }.gift-closing h2 span { display: block; }.gift-closing-inner > div > p { max-width: 46ch; margin-top: 16px; color: color-mix(in oklab,var(--warm-white) 86%,transparent); font-size: clamp(15px,1.2vw,17px); line-height: 1.6; }
@keyframes giftCardAmount { from{opacity:.15}to{opacity:1} } @keyframes giftCardSheen { 0%,18%{transform:translateX(-38%) rotate(2deg)} 55%,100%{transform:translateX(38%) rotate(2deg)} }
@media (max-width: 1023px) {
  .gifting-new .inner-page-hero-image--gifting { object-position: 76% 50%; }
  .gift-benefits-inner { grid-template-columns: repeat(3,minmax(0,1fr)); }.gift-benefit { min-height: 106px; border-bottom: 1px solid color-mix(in oklab,var(--gold-dark) 22%,transparent); }.gift-benefit:nth-child(3n+1) { border-left: 0; }.gift-benefit:nth-child(n+4) { border-bottom: 0; }
  .gift-occasion-grid { grid-template-columns: repeat(3,minmax(0,1fr)); gap: 12px; }.gift-occasion-card { height: 280px; }
  .gift-card-section { grid-template-columns: repeat(2,minmax(0,1fr)); }.gift-card-copy { padding-left: var(--gutter); padding-right: 28px; }.gift-card-visual { min-height: 570px; padding: 36px; }.gift-card-copy h2 { font-size: 42px; }
  .gift-trust-inner { grid-template-columns: repeat(3,minmax(0,1fr)); }.gift-trust article { min-height: 112px; }.gift-trust article:nth-child(4) { border-left: 0; }
  .gift-closing { min-height: 480px; }
}
@media (max-width: 767px) {
  .gifting-new .inner-page-hero-image--gifting { object-position: 83% 100%; }
  .gifting-new .inner-page-hero-overlay { background: linear-gradient(180deg,rgba(8,34,24,.98) 0%,rgba(8,34,24,.91) 45%,rgba(8,34,24,.42) 68%,rgba(8,34,24,.08) 100%); }
  .gift-benefits-inner { grid-template-columns: repeat(2,minmax(0,1fr)); }.gift-benefit { min-height: 122px; }.gift-benefit:nth-child(3n+1) { border-left: 1px solid color-mix(in oklab,var(--gold-dark) 22%,transparent); }.gift-benefit:nth-child(odd) { border-left: 0; }.gift-benefit:nth-child(n+4) { border-bottom: 1px solid color-mix(in oklab,var(--gold-dark) 22%,transparent); }.gift-benefit:nth-child(n+5) { border-bottom: 0; }
  .gift-occasions { padding-block: 72px; }.gift-occasions-inner { padding-inline: 0; }.gift-occasions header { padding-inline: var(--gutter); }.gift-occasions h2 { font-size: 36px; margin-bottom: 28px; }.gift-occasion-grid { width: 100%; display: flex; gap: 10px; overflow-x: auto; padding: 0 var(--gutter) 18px; scroll-padding-inline: var(--gutter); scroll-snap-type: x mandatory; scrollbar-width: none; }.gift-occasion-grid::-webkit-scrollbar { display:none; }.gift-occasion-card { flex: 0 0 calc(82% - var(--gutter)); height: 330px; scroll-snap-align: start; }.gift-view-all { align-self: stretch; justify-content: flex-end; margin: 2px var(--gutter) 0; }
  .gift-card-section { display: flex; flex-direction: column; }.gift-card-visual { order: -1; min-height: 360px; padding: 34px 28px; }.gift-card-copy { padding: 72px var(--gutter); }.gift-card-copy-inner { width: min(100%,520px); margin-inline: auto; }.gift-card-copy h2 { font-size: 38px; }.gift-card-intro { font-size: 15px; }.gift-amount-label { height: 64px; }.gift-amount-price { font-size: 24px; }.gift-card-checkout { width: 100%; min-height: 54px; }.gift-card-security { justify-content: center; }.gift-card-message { text-align: center; }.gift-card-object-copy > span { min-width: 120px; font-size: 34px; }
  .gift-trust-inner { grid-template-columns: repeat(2,minmax(0,1fr)); }.gift-trust article { min-height: 125px; }.gift-trust article:nth-child(odd) { border-left: 0; }.gift-trust article:nth-child(4) { border-left: 1px solid color-mix(in oklab,var(--gold) 35%,transparent); }.gift-trust article:last-child { grid-column: 1/-1; }
  .gift-closing { min-height: 540px; }.gift-closing > img { object-position: 68% 100%; }.gift-closing-shade { background: linear-gradient(180deg,rgba(63,31,12,.94) 0%,rgba(63,31,12,.78) 46%,rgba(25,39,26,.22) 73%,rgba(15,31,22,.04) 100%); }.gift-closing-inner { align-items: flex-start; padding-top: 64px; }.gift-closing-inner > div { max-width: 340px; }.gift-closing h2 { font-size: 40px; }
}
@media (max-width: 359px) { .gift-amount-grid { grid-template-columns: repeat(2,minmax(0,1fr)); } }
@media (hover:none),(pointer:coarse) { .gift-card-object { --card-tilt-x: 0deg; --card-tilt-y: 0deg; transform:perspective(1100px) rotateZ(-1.3deg); will-change:auto; } }
@media (prefers-reduced-motion: reduce) { html:has(.gifting-new) { scroll-behavior: auto; } .gift-closing > img { transform:none; transition:none; } .gift-card-object { --card-tilt-x:0deg !important; --card-tilt-y:0deg !important; transform:perspective(1100px) rotateZ(-1.3deg) !important; transition:none; will-change:auto; } .gift-card-object::before { display:none; } }
`;