import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import heroAsset from "@/assets/precious-metal-hero.png.asset.json";
import eagleAsset from "@/assets/american-eagle.png.asset.json";
import pampAsset from "@/assets/pamp-bar.png.asset.json";
import mapleAsset from "@/assets/maple-leaf.png.asset.json";
import leafAsset from "@/assets/pricing-leaf.png.asset.json";

const heroImage = heroAsset.url;

export const Route = createFileRoute("/precious-metal")({
  head: () => ({
    meta: [
      { title: "Precious Metal — Physical Gold & Silver Delivered | SQOOT Pure" },
      {
        name: "description",
        content:
          "Buy physical gold and silver coins and bars, shipped insured directly to your door. Real metal, direct possession.",
      },
      { property: "og:title", content: "Precious Metal — Physical Gold & Silver Delivered | SQOOT Pure" },
      {
        property: "og:description",
        content: "Physical gold and silver, insured in transit, delivered to your address.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PreciousMetalPage,
});

const products = [
  {
    title: <>American Gold<br />Eagles</>,
    purity: ".9167",
    sizes: ["1 oz", "1/2 oz", "1/4 oz", "1/10 oz"],
    art: <AmericanEagleArt />,
  },
  {
    title: <>Canadian Maple<br />Leafs</>,
    purity: ".9999",
    sizes: ["1 oz", "1/2 oz", "1/4 oz", "1/10 oz"],
    art: <MapleLeafArt />,
  },
  {
    title: <>PAMP Bars</>,
    purity: ".9999",
    sizes: ["1 g", "2.5 g", "5 g", "10 g", "1 oz"],
    art: <PampBarArt />,
  },
] as const;

function AmericanEagleArt() {
  return (
    <img
      className="pm-product-art pm-coin-art"
      src={eagleAsset.url}
      alt="American Gold Eagle coin"
    />
  );
}

function MapleLeafArt() {
  return (
    <img
      className="pm-product-art pm-maple-art"
      src={mapleAsset.url}
      alt="Canadian Maple Leaf coin"
    />
  );
}

function PampBarArt() {
  return (
    <img
      className="pm-product-art pm-bar-art"
      src={pampAsset.url}
      alt="PAMP Suisse gold bar"
    />
  );
}

function ProductsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      section.classList.add("pm-products-visible");
      observer.disconnect();
    }, { threshold: 0.14 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="pm-products" aria-labelledby="pm-products-title">
      <div className="pm-products-heading-row">
        <span aria-hidden="true" />
        <h2 id="pm-products-title">What&apos;s available</h2>
        <span aria-hidden="true" />
      </div>
      <div className="pm-products-grid">
        {products.map((product, index) => (
          <article className="pm-product-card" key={product.purity + index}>
            <div className="pm-product-art-area">{product.art}</div>
            <h3>{product.title}</h3>
            <span className="pm-product-divider" aria-hidden="true" />
            <p className="pm-product-purity">Purity : {product.purity}</p>
            <p className="pm-product-label">Available sizes:</p>
            <div className="pm-product-sizes" aria-label={`Available sizes: ${product.sizes.join(", ")}`}>
              {product.sizes.map((size, sizeIndex) => (
                <span key={size}>
                  {sizeIndex > 0 && <i aria-hidden="true" />}
                  <b>{size}</b>
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const steps = [
  { title: "Order", icon: <OrderIcon /> },
  { title: "Insured Shipping", icon: <ShippingIcon /> },
  { title: <>Arrives at Your<br />Address</>, icon: <AddressIcon /> },
  { title: "Full Ownership", icon: <OwnershipIcon /> },
] as const;

function OrderIcon() {
  return (
    <svg viewBox="0 0 72 72" aria-hidden="true">
      <path d="M17 24h38l-3.3 37H20.3L17 24Z" />
      <path d="M27 28v-8.5C27 14.3 31 10 36 10s9 4.3 9 9.5V28M27 38c2.3 2 5.3 3 9 3s6.7-1 9-3" />
      <path d="M24 31h24" opacity=".55" />
    </svg>
  );
}

function ShippingIcon() {
  return (
    <svg viewBox="0 0 72 72" aria-hidden="true">
      <path d="m11 24 25-12 25 12-25 12-25-12Z" />
      <path d="M11 24v28l25 12 25-12V24M36 36v28M22 18l25 12v12" />
      <path d="m50 46 3 3 6-7" />
      <circle cx="53" cy="46" r="11" />
    </svg>
  );
}

function AddressIcon() {
  return (
    <svg viewBox="0 0 72 72" aria-hidden="true">
      <path d="M9 35 36 12l27 23M16 31v31h40V31" />
      <path d="M29 62V44h14v18M24 27h24M52 18v9" />
      <circle cx="39" cy="53" r="1" />
    </svg>
  );
}

function OwnershipIcon() {
  return (
    <svg viewBox="0 0 72 72" aria-hidden="true">
      <circle cx="26" cy="29" r="15" />
      <circle cx="26" cy="29" r="7" />
      <path d="m37 40 24 24M47 50l7-7M53 56l7-7" />
    </svg>
  );
}

function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      section.classList.add("pm-process-visible");
      observer.disconnect();
    }, { threshold: 0.18 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="pm-process" aria-labelledby="pm-process-title">
      <div className="pm-process-heading-row">
        <span aria-hidden="true" />
        <h2 id="pm-process-title">How it works</h2>
        <span aria-hidden="true" />
      </div>
      <div className="pm-steps">
        {steps.map((step, index) => (
          <article className="pm-step" key={index}>
            <div className="pm-step-circle">{step.icon}</div>
            <h3>{step.title}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}

function BotanicalLeafIcon() {
  return (
    <img
      className="pm-pricing-leaf"
      src={leafAsset.url}
      alt=""
      aria-hidden="true"
    />
  );
}

function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      section.classList.add("pm-pricing-visible");
      observer.disconnect();
    }, { threshold: 0.25 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="pm-pricing" aria-labelledby="pm-pricing-title">
      <div className="pm-pricing-panel">
        <BotanicalLeafIcon />
        <span className="pm-pricing-divider" aria-hidden="true" />
        <div className="pm-pricing-copy">
          <h2 id="pm-pricing-title">Live spot + premium, varies by product.</h2>
          <p>Exact pricing and purchasing available in the SQOOT Pure app October 1.</p>
        </div>
      </div>
    </section>
  );
}

const benefits = [
  {
    title: "Shipping",
    description: "Insured delivery to your address.",
    icon: <ShippingBenefitIcon />,
  },
  {
    title: "Insurance",
    description: "Fully insured from our vault to your door.",
    icon: <InsuranceBenefitIcon />,
  },
  {
    title: "Storage",
    description: "You control it. We don't store it.",
    icon: <StorageBenefitIcon />,
  },
  {
    title: "Liquidity",
    description: "Globally recognized. Always in demand.",
    icon: <LiquidityBenefitIcon />,
  },
] as const;

function ShippingBenefitIcon() {
  return (
    <svg viewBox="0 0 82 82" aria-hidden="true">
      <path d="M18 28h46v40H18z" />
      <path d="M18 28 41 12l23 16" />
      <path d="M28 44h26M28 54h20" />
    </svg>
  );
}

function InsuranceBenefitIcon() {
  return (
    <svg viewBox="0 0 82 82" aria-hidden="true">
      <path d="M41 11c8 4 16 7 25 8v17c0 15-8 28-25 37-17-9-25-22-25-37V19c9-1 17-4 25-8Z" />
      <path d="m30 41 7 7 15-17" />
    </svg>
  );
}

function StorageBenefitIcon() {
  return (
    <svg viewBox="0 0 82 82" aria-hidden="true">
      <rect x="14" y="18" width="54" height="50" rx="4" />
      <circle cx="41" cy="43" r="11" />
      <circle cx="41" cy="43" r="3" />
      <path d="M41 32v6M41 48v6M30 43h6M46 43h6" />
      <path d="M22 18v-4a3 3 0 0 1 3-3h32a3 3 0 0 1 3 3v4" />
    </svg>
  );
}

function LiquidityBenefitIcon() {
  return (
    <svg viewBox="0 0 82 82" aria-hidden="true">
      <path d="M57 25c10 6 12 19 5 28" />
      <path d="m52 21 9 4-3 9" />
      <path d="M25 57c-10-6-12-19-5-28" />
      <path d="m30 61-9-4 3-9" />
    </svg>
  );
}

function BenefitsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      section.classList.add("pm-benefits-visible");
      observer.disconnect();
    }, { threshold: 0.16 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="pm-benefits" aria-label="Benefits">
      <div className="pm-benefits-grid">
        {benefits.map((benefit) => (
          <article className="pm-benefit" key={benefit.title}>
            <div className="pm-benefit-icon">{benefit.icon}</div>
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function CtaBranchWatermark() {
  return (
    <svg className="pm-cta-branch" viewBox="0 0 420 520" aria-hidden="true">
      <path d="M380 520c-12-48-26-94-48-136-22-42-52-78-90-104" />
      <path d="M342 384c-28-18-58-28-90-30M320 332c-22-26-48-48-78-64M296 280c-14-32-34-60-60-82" />
      <path d="M342 384c18 8 36 6 52-6M320 332c16 4 32 0 46-12M296 280c14 2 28-4 40-16M258 212c12 0 24-6 34-16" />
      <path d="M260 280c-26-22-56-38-88-48M232 236c-18-28-40-52-66-70M206 198c-10-30-26-56-46-78" />
      <path d="M260 280c16 14 34 18 52 12M232 236c14 18 30 26 50 22M206 198c12 16 26 24 44 20M160 120c10 14 22 20 38 16" />
      <path d="M180 200c-24-16-50-26-78-30M154 158c-20-24-44-44-70-58M130 124c-12-28-28-52-48-72" />
      <path d="M180 200c14 10 30 12 46 6M154 158c12 14 26 20 44 16M130 124c10 12 22 18 38 14M82 52c8 10 18 14 32 10" />
      <path d="M126 140c-22-12-46-18-70-18M98 104c-18-18-38-34-60-46M74 74c-10-22-22-42-38-58" />
      <path d="M126 140c12 8 26 10 40 6M98 104c10 12 22 16 36 12M74 74c8 10 18 14 32 10M36 16c6 8 14 10 24 8" />
      <path d="M74 86c-18-8-36-12-54-10M52 58c-14-14-28-26-44-34M32 32c-6-16-14-30-24-42" />
      <path d="M74 86c10 6 20 6 30 2M52 58c8 10 18 12 30 8M32 32c6 8 12 10 22 6M8 8c4 4 8 6 14 4" />
      <ellipse cx="388" cy="504" rx="10" ry="6" transform="rotate(-25 388 504)" />
      <ellipse cx="354" cy="372" rx="9" ry="5" transform="rotate(-20 354 372)" />
      <ellipse cx="330" cy="320" rx="8" ry="5" transform="rotate(-30 330 320)" />
      <ellipse cx="304" cy="268" rx="8" ry="5" transform="rotate(-15 304 268)" />
      <ellipse cx="268" cy="204" rx="7" ry="4" transform="rotate(-22 268 204)" />
      <ellipse cx="268" cy="272" rx="8" ry="5" transform="rotate(-28 268 272)" />
      <ellipse cx="240" cy="228" rx="7" ry="4" transform="rotate(-18 240 228)" />
      <ellipse cx="214" cy="190" rx="7" ry="4" transform="rotate(-32 214 190)" />
      <ellipse cx="166" cy="112" rx="7" ry="4" transform="rotate(-20 166 112)" />
      <ellipse cx="188" cy="192" rx="8" ry="5" transform="rotate(-24 188 192)" />
      <ellipse cx="162" cy="150" rx="7" ry="4" transform="rotate(-16 162 150)" />
      <ellipse cx="136" cy="116" rx="7" ry="4" transform="rotate(-30 136 116)" />
      <ellipse cx="88" cy="56" rx="6" ry="4" transform="rotate(-22 88 56)" />
      <ellipse cx="134" cy="132" rx="7" ry="4" transform="rotate(-26 134 132)" />
      <ellipse cx="106" cy="96" rx="7" ry="4" transform="rotate(-14 106 96)" />
      <ellipse cx="80" cy="62" rx="6" ry="4" transform="rotate(-34 80 62)" />
      <ellipse cx="40" cy="20" rx="6" ry="4" transform="rotate(-20 40 20)" />
      <ellipse cx="80" cy="78" rx="7" ry="4" transform="rotate(-28 80 78)" />
      <ellipse cx="56" cy="50" rx="6" ry="4" transform="rotate(-18 56 50)" />
      <ellipse cx="30" cy="24" rx="6" ry="4" transform="rotate(-32 30 24)" />
    </svg>
  );
}

function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      section.classList.add("pm-cta-visible");
      observer.disconnect();
    }, { threshold: 0.25 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="pm-cta" aria-labelledby="pm-cta-title">
      <CtaBranchWatermark />
      <div className="pm-cta-inner">
        <h2 id="pm-cta-title">Join the waitlist to buy coins and bars when the app launches.</h2>
        <a href="/vault#early-access">Join the Waitlist</a>
      </div>
    </section>
  );
}

function PreciousMetalPage() {

  return (
    <>
      <SiteHeader />
      <main id="top" className="precious-metals-page">
        <section className="pm-hero" aria-labelledby="pm-hero-title">
          <img
            className="pm-hero-image"
            src={heroImage}
            alt="Gold bars and coins arranged on a dark emerald surface"
          />
          <div className="pm-hero-overlay" aria-hidden="true" />
          <div className="pm-hero-copy">
            <h1 id="pm-hero-title">
              <span>Own physical</span>
              <span>gold in your hands.</span>
            </h1>
            <span className="pm-hero-rule" aria-hidden="true" />
            <p>
              <span>No vault fees. Direct control.</span>
              <span>Insured shipping to your address.</span>
            </p>
          </div>
        </section>

        <ProductsSection />
        <HowItWorksSection />
        <PricingSection />
        <BenefitsSection />
        <CTASection />

        <style>{`

          .precious-metals-page {
            --pm-forest-black: #08150D;
            --pm-forest-950: #0A1A10;
            --pm-forest-900: #0F2113;
            --pm-forest-850: #132A1C;
            --pm-cream: #F5EEE3;
            --pm-cream-warm: #F4ECDE;
            --pm-cream-light: #FAF5EC;
            --pm-gold: #B8872D;
            --pm-gold-medium: #C6973D;
            --pm-gold-light: #D9AC52;
            --pm-gold-muted: #A77B31;
            --pm-ink: #12251B;
            --pm-body: #243027;
            --pm-cream-text: #F7F0E5;
            --pm-border: rgba(168, 119, 43, 0.35);
            --pm-divider: rgba(157, 111, 39, 0.42);
            box-sizing: border-box;
            width: 100%;
            overflow-x: clip;
            font-synthesis: none;
            -webkit-font-smoothing: antialiased;
            text-rendering: optimizeLegibility;
          }

          .precious-metals-page *,
          .precious-metals-page *::before,
          .precious-metals-page *::after { box-sizing: inherit; }

          .pm-hero {
            position: relative;
            width: 100%;
            height: clamp(300px, 29.1667vw, 767px);
            overflow: hidden;
            background: var(--pm-forest-black);
          }

          .pm-hero-image {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
            object-position: right center;
            animation: pmHeroSettle 1200ms cubic-bezier(.22, 1, .36, 1) both;
          }

          .pm-hero-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(90deg, rgba(7,25,15,.98) 0%, rgba(7,25,15,.94) 26%, rgba(7,25,15,.77) 40%, rgba(7,25,15,.37) 54%, rgba(7,25,15,.06) 69%, transparent 80%);
          }

          .pm-hero-copy {
            position: absolute;
            z-index: 1;
            top: clamp(72px, 10.7639vw, 276px);
            left: clamp(48px, 4.5139vw, 116px);
            max-width: clamp(476px, 46.5278vw, 1191px);
          }

          .pm-hero-copy h1 {
            margin: 0;
            max-width: clamp(484px, 47.2222vw, 1209px);
            color: var(--pm-cream-text);
            font-family: "Cormorant Garamond", Georgia, serif;
            font-size: clamp(40px, 4.0278vw, 103px);
            font-weight: 500;
            line-height: .98;
            letter-spacing: -.025em;
          }

          .pm-hero-copy h1 span,
          .pm-hero-copy p span { display: block; }

          .pm-hero-copy h1 span,
          .pm-hero-rule,
          .pm-hero-copy p {
            opacity: 0;
            transform: translateY(18px);
            animation: pmHeroRise 680ms cubic-bezier(.22, 1, .36, 1) forwards;
          }

          .pm-hero-copy h1 span:nth-child(1) { animation-delay: 90ms; }
          .pm-hero-copy h1 span:nth-child(2) { animation-delay: 180ms; }
          .pm-hero-rule { animation-delay: 270ms; }
          .pm-hero-copy p { animation-delay: 360ms; }

          .pm-hero-rule {
            display: block;
            width: clamp(41px, 4.0278vw, 103px);
            height: 2px;
            margin-top: clamp(26px, 2.5vw, 64px);
            margin-bottom: clamp(17px, 1.6667vw, 43px);
            background: var(--pm-gold);
          }

          .pm-hero-copy p {
            margin: 0;
            color: rgba(247,240,229,.94);
            font-family: "DM Sans", Arial, sans-serif;
            font-size: clamp(18px, 1.7361vw, 44px);
            font-weight: 400;
            line-height: 1.55;
            letter-spacing: 0;
          }

          .pm-products {
            position: relative;
            isolation: isolate;
            height: clamp(386px, 37.6389vw, 964px);
            padding: clamp(24px, 2.3611vw, 60px) clamp(48px, 4.7222vw, 121px) clamp(9px, .8333vw, 21px);
            overflow: hidden;
            background-color: var(--pm-cream);
          }

          .pm-products::before {
            content: "";
            position: absolute;
            z-index: -1;
            inset: 0;
            opacity: .07;
            background-image:
              radial-gradient(ellipse at 14% 22%, rgba(139, 100, 40, .34), transparent 38%),
              radial-gradient(ellipse at 78% 67%, rgba(255, 255, 255, .72), transparent 42%),
              radial-gradient(ellipse at 49% 92%, rgba(158, 112, 45, .22), transparent 35%),
              linear-gradient(112deg, transparent 22%, rgba(134, 94, 35, .15) 48%, transparent 72%);
            background-size: 480px 460px, 510px 490px, 440px 500px, 500px 470px;
            background-position: 0 0, 160px 80px, 300px -130px, 70px 190px;
          }

          .pm-products-heading-row {
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
            align-items: center;
            column-gap: clamp(27px, 2.6389vw, 68px);
            width: 100%;
            margin-inline: auto;
          }

          .pm-products-heading-row > span {
            width: 100%;
            height: 1px;
            background: var(--pm-gold-muted);
            opacity: .78;
          }

          .pm-products-heading-row h2 {
            margin: 0;
            color: var(--pm-ink);
            font-family: "Cormorant Garamond", Georgia, serif;
            font-size: clamp(32px, 3.125vw, 80px);
            font-weight: 500;
            line-height: 1;
            letter-spacing: -.015em;
            white-space: nowrap;
          }

          .pm-products-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: clamp(21px, 2.0139vw, 52px);
            width: 100%;
            max-width: clamp(918px, 89.6528vw, 2295px);
            margin: clamp(19px, 1.875vw, 48px) auto 0;
          }

          .pm-product-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            height: clamp(304px, 29.6528vw, 759px);
            padding: clamp(14px, 1.3889vw, 36px) clamp(14px, 1.3889vw, 36px) clamp(13px, 1.25vw, 32px);
            border: 1px solid var(--pm-border);
            border-radius: 4px;
            background: rgba(250,245,236,.28);
            color: var(--pm-ink);
            text-align: center;
            opacity: 0;
            transform: translateY(18px);
            transition: transform 350ms cubic-bezier(.22,1,.36,1), border-color 350ms ease, box-shadow 350ms ease;
          }

          .pm-products-visible .pm-product-card {
            animation: pmProductRise 620ms cubic-bezier(.22,1,.36,1) forwards;
          }
          .pm-products-visible .pm-product-card:nth-child(2) { animation-delay: 90ms; }
          .pm-products-visible .pm-product-card:nth-child(3) { animation-delay: 180ms; }

          .pm-product-card:hover {
            transform: translateY(-5px);
            border-color: rgba(168,119,43,.55);
            box-shadow: 0 16px 34px rgba(41,30,12,.08);
          }

          .pm-product-art-area {
            display: grid;
            place-items: center;
            width: 100%;
            height: clamp(107px, 10.7639vw, 276px);
            flex: 0 0 auto;
          }

          .pm-product-art {
            overflow: visible;
            fill: none;
            stroke: #26362D;
            stroke-width: 1.2;
            stroke-linecap: round;
            stroke-linejoin: round;
            transition: transform 350ms cubic-bezier(.22,1,.36,1);
          }
          .pm-product-art text {
            fill: #26362D;
            stroke: none;
            font-family: "DM Sans", Arial, sans-serif;
            font-size: 7px;
            letter-spacing: .08em;
          }
          .pm-product-card:hover .pm-product-art { transform: scale(1.025); }
          .pm-coin-art { width: clamp(98px, 9.8611vw, 252px); height: clamp(98px, 9.8611vw, 252px); }
          .pm-coin-art[src] { object-fit: contain; border-radius: 50%; }
          .pm-maple-art { width: clamp(103px, 10.4167vw, 267px); height: clamp(103px, 10.4167vw, 267px); }
          .pm-maple-art[src] { object-fit: contain; border-radius: 50%; }
          .pm-bar-art { width: clamp(74px, 7.6389vw, 196px); height: clamp(107px, 10.7639vw, 276px); }
          .pm-bar-art[src] { object-fit: contain; }

          .pm-product-card h3 {
            display: grid;
            place-items: center;
            width: 100%;
            height: clamp(56px, 5.4861vw, 140px);
            margin: 0;
            color: var(--pm-ink);
            font-family: "Cormorant Garamond", Georgia, serif;
            font-size: clamp(28px, 2.7083vw, 69px);
            font-weight: 500;
            line-height: 1.02;
            letter-spacing: -.015em;
          }

          .pm-product-divider {
            width: clamp(34px, 3.3333vw, 85px);
            height: 1.5px;
            margin: clamp(12px, 1.1806vw, 30px) auto clamp(10px, .9722vw, 25px);
            background: var(--pm-gold);
          }

          .pm-product-purity,
          .pm-product-label {
            margin: 0;
            color: var(--pm-body);
            font-family: "DM Sans", Arial, sans-serif;
            font-size: clamp(13.5px, 1.3194vw, 34px);
            font-weight: 400;
            line-height: 1.4;
            letter-spacing: 0;
          }

          .pm-product-sizes {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: clamp(5px, .4861vw, 12px);
            color: var(--pm-body);
            font-family: "DM Sans", Arial, sans-serif;
            font-size: clamp(12.5px, 1.25vw, 32px);
            font-weight: 400;
            line-height: 1;
            white-space: nowrap;
          }

          .pm-product-sizes > span { display: flex; align-items: center; }
          .pm-product-sizes b { font: inherit; }
          .pm-product-sizes i {
            display: inline-block;
            width: 1px;
            height: clamp(16px, 1.5278vw, 39px);
            margin-inline: clamp(9px, .9722vw, 25px);
            background: rgba(140,94,28,.55);
          }

          .pm-process {
            position: relative;
            isolation: isolate;
            height: clamp(208px, 20.3472vw, 521px);
            padding: clamp(6px, .625vw, 16px) clamp(51px, 5vw, 128px) clamp(16px, 1.5278vw, 39px);
            overflow: hidden;
            background-color: var(--pm-cream);
          }

          .pm-process::before {
            content: "";
            position: absolute;
            z-index: -1;
            inset: 0;
            opacity: .07;
            background-image:
              radial-gradient(ellipse at 14% 22%, rgba(139,100,40,.34), transparent 38%),
              radial-gradient(ellipse at 78% 67%, rgba(255,255,255,.72), transparent 42%),
              radial-gradient(ellipse at 49% 92%, rgba(158,112,45,.22), transparent 35%),
              linear-gradient(112deg, transparent 22%, rgba(134,94,35,.15) 48%, transparent 72%);
            background-size: 480px 460px, 510px 490px, 440px 500px, 500px 470px;
            background-position: 0 -542px, 160px -462px, 300px -672px, 70px -352px;
          }

          .pm-process-heading-row {
            display: grid;
            grid-template-columns: minmax(0,1fr) auto minmax(0,1fr);
            align-items: center;
            column-gap: clamp(27px, 2.6389vw, 68px);
            width: 100%;
            opacity: 0;
            transform: translateY(14px);
          }

          .pm-process-heading-row > span {
            width: 100%;
            height: 1px;
            background: var(--pm-gold-muted);
            opacity: .78;
          }

          .pm-process-heading-row h2 {
            margin: 0;
            color: var(--pm-ink);
            font-family: "Cormorant Garamond", Georgia, serif;
            font-size: clamp(32px, 3.125vw, 80px);
            font-weight: 500;
            line-height: 1;
            letter-spacing: -.015em;
            white-space: nowrap;
          }

          .pm-steps {
            display: grid;
            grid-template-columns: repeat(4, minmax(0,1fr));
            width: 100%;
            max-width: clamp(902px, 88.0556vw, 2254px);
            margin: clamp(17px, 1.7361vw, 44px) auto 0;
          }

          .pm-step {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-width: 0;
            opacity: 0;
            transform: translateY(12px);
          }

          .pm-step:not(:last-child)::after {
            content: "";
            position: absolute;
            z-index: 0;
            top: clamp(40px, 3.8889vw, 100px);
            left: calc(50% + clamp(62px, 6.0764vw, 156px));
            width: clamp(101px, 9.8611vw, 252px);
            height: 1px;
            background: rgba(167,123,49,.72);
            transform: scaleX(0);
            transform-origin: left center;
          }

          .pm-step-circle {
            position: relative;
            z-index: 1;
            display: grid;
            place-items: center;
            width: clamp(80px, 7.7778vw, 199px);
            height: clamp(80px, 7.7778vw, 199px);
            border: 2.2px solid var(--pm-gold);
            border-radius: 50%;
            background: transparent;
          }

          .pm-step-circle svg {
            width: clamp(46px, 4.5833vw, 117px);
            height: clamp(46px, 4.5833vw, 117px);
            fill: none;
            stroke: var(--pm-gold);
            stroke-width: 1.7;
            stroke-linecap: round;
            stroke-linejoin: round;
            transform: scale(.95);
          }

          .pm-step h3 {
            margin: clamp(11px, 1.1111vw, 28px) 0 0;
            color: var(--pm-ink);
            font-family: "Cormorant Garamond", Georgia, serif;
            font-size: clamp(21px, 2.0139vw, 52px);
            font-weight: 500;
            line-height: 1.02;
            letter-spacing: 0;
            text-align: center;
          }

          .pm-process-visible .pm-process-heading-row {
            animation: pmProcessRise 600ms cubic-bezier(.22,1,.36,1) forwards;
          }
          .pm-process-visible .pm-step {
            animation: pmProcessRise 600ms cubic-bezier(.22,1,.36,1) forwards;
          }
          .pm-process-visible .pm-step:nth-child(1) { animation-delay: 80ms; }
          .pm-process-visible .pm-step:nth-child(2) { animation-delay: 160ms; }
          .pm-process-visible .pm-step:nth-child(3) { animation-delay: 240ms; }
          .pm-process-visible .pm-step:nth-child(4) { animation-delay: 320ms; }
          .pm-process-visible .pm-step-circle svg {
            animation: pmIconSettle 600ms cubic-bezier(.22,1,.36,1) forwards;
          }
          .pm-process-visible .pm-step:nth-child(1)::after { animation: pmLineDraw 600ms ease 200ms forwards; }
          .pm-process-visible .pm-step:nth-child(2)::after { animation: pmLineDraw 600ms ease 280ms forwards; }
          .pm-process-visible .pm-step:nth-child(3)::after { animation: pmLineDraw 600ms ease 360ms forwards; }

          @keyframes pmHeroSettle {
            from { transform: scale(1.025); }
            to { transform: scale(1); }
          }

          @keyframes pmHeroRise {
            from { opacity: 0; transform: translateY(18px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes pmProductRise {
            from { opacity: 0; transform: translateY(18px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes pmProcessRise {
            from { opacity: 0; transform: translateY(14px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes pmLineDraw { to { transform: scaleX(1); } }
          @keyframes pmIconSettle { to { transform: scale(1); } }
          @keyframes pmPricingRise {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pmLeafDraw {
            from { stroke-dashoffset: 300; }
            to { stroke-dashoffset: 0; }
          }
          @keyframes pmLeafFade {
            from { opacity: 0; transform: scale(.92); }
            to { opacity: 1; transform: scale(1); }
          }

          .pm-pricing {
            position: relative;
            isolation: isolate;
            height: clamp(84px, 8.125vw, 208px);
            padding: 0 clamp(48px, 4.7222vw, 121px);
            overflow: hidden;
            background-color: var(--pm-cream);
          }

          .pm-pricing::before {
            content: "";
            position: absolute;
            z-index: -1;
            inset: 0;
            opacity: .07;
            background-image:
              radial-gradient(ellipse at 14% 22%, rgba(139,100,40,.34), transparent 38%),
              radial-gradient(ellipse at 78% 67%, rgba(255,255,255,.72), transparent 42%),
              radial-gradient(ellipse at 49% 92%, rgba(158,112,45,.22), transparent 35%),
              linear-gradient(112deg, transparent 22%, rgba(134,94,35,.15) 48%, transparent 72%);
            background-size: 480px 460px, 510px 490px, 440px 500px, 500px 470px;
            background-position: 0 -835px, 160px -755px, 300px -965px, 70px -645px;
          }

          .pm-pricing-panel {
            display: flex;
            align-items: center;
            width: 100%;
            height: clamp(82px, 7.9167vw, 203px);
            padding-right: clamp(24px, 2.4306vw, 62px);
            border: 1px solid rgba(199, 169, 115, 0.52);
            border-radius: 5px;
            background: #F2EADC;
            opacity: 0;
            transform: translateY(12px);
          }

          .pm-pricing-visible .pm-pricing-panel {
            animation: pmPricingRise 600ms cubic-bezier(.22,1,.36,1) forwards;
          }

          .pm-pricing-leaf {
            width: clamp(46px, 4.7222vw, 121px);
            height: clamp(46px, 4.7222vw, 121px);
            margin-left: clamp(160px, 16.32vw, 418px);
            flex: 0 0 auto;
            fill: none;
            stroke: var(--pm-ink);
            stroke-width: 1.3;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: 300;
            stroke-dashoffset: 300;
          }

          .pm-pricing-visible .pm-pricing-leaf {
            animation: pmLeafDraw 900ms ease 200ms forwards;
          }
          .pm-pricing-leaf[src] { object-fit: contain; }
          .pm-pricing-visible .pm-pricing-leaf[src] {
            opacity: 0;
            animation: pmLeafFade 700ms ease 200ms forwards;
          }

          .pm-pricing-divider {
            width: 1px;
            height: clamp(46px, 4.7222vw, 121px);
            margin-inline: clamp(24px, 2.4306vw, 62px);
            background: rgba(140,94,28,.56);
            flex: 0 0 auto;
          }

          .pm-pricing-copy {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 0 1 auto;
            min-width: 0;
          }

          .pm-pricing-copy h2,
          .pm-pricing-copy p {
            margin: 0;
            color: var(--pm-ink);
            font-family: "Cormorant Garamond", Georgia, serif;
            font-size: clamp(17px, 1.7361vw, 44px);
            font-weight: 500;
            line-height: 1.18;
            text-align: left;
          }

          .pm-benefits {
            position: relative;
            isolation: isolate;
            height: clamp(260px, 22vw, 564px);
            padding: clamp(30px, 2.9167vw, 75px) clamp(48px, 4.7222vw, 121px) clamp(30px, 2.9167vw, 75px);
            overflow: hidden;
            background-color: var(--pm-cream);
          }

          .pm-benefits::before {
            content: "";
            position: absolute;
            z-index: -1;
            inset: 0;
            opacity: .07;
            background-image:
              radial-gradient(ellipse at 14% 22%, rgba(139,100,40,.34), transparent 38%),
              radial-gradient(ellipse at 78% 67%, rgba(255,255,255,.72), transparent 42%),
              radial-gradient(ellipse at 49% 92%, rgba(158,112,45,.22), transparent 35%),
              linear-gradient(112deg, transparent 22%, rgba(134,94,35,.15) 48%, transparent 72%);
            background-size: 480px 460px, 510px 490px, 440px 500px, 500px 470px;
            background-position: 0 -952px, 160px -872px, 300px -1082px, 70px -762px;
          }

          .pm-benefits-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0,1fr));
            width: 100%;
            max-width: clamp(944px, 91.6667vw, 2347px);
            margin: 0 auto;
          }

          .pm-benefit {
            display: flex;
            min-width: 0;
            flex-direction: column;
            align-items: center;
            padding-inline: clamp(3px, .2778vw, 7px);
            text-align: center;
            opacity: 0;
            transform: translateY(16px);
          }

          .pm-benefit + .pm-benefit { border-left: 1px solid var(--pm-divider); }

          .pm-benefit-icon {
            display: grid;
            place-items: center;
            width: clamp(72px, 5.6944vw, 146px);
            height: clamp(72px, 5.6944vw, 146px);
            border: 2px solid rgba(167,123,49,.78);
            border-radius: 50%;
          }

          .pm-benefit-icon svg {
            width: clamp(52px, 4.1667vw, 107px);
            height: clamp(52px, 4.1667vw, 107px);
            fill: none;
            stroke: color-mix(in oklab, var(--pm-ink) 78%, var(--pm-gold-muted));
            stroke-width: 1.9;
            stroke-linecap: round;
            stroke-linejoin: round;
            transition: transform 350ms cubic-bezier(.22,1,.36,1);
          }

          .pm-benefit h3 {
            margin: clamp(14px, 1.3194vw, 34px) 0 0;
            color: var(--pm-ink);
            font-family: "Cormorant Garamond", Georgia, serif;
            font-size: clamp(22px, 1.6667vw, 43px);
            font-weight: 500;
            line-height: 1;
            letter-spacing: -.01em;
          }

          .pm-benefit > p {
            margin: clamp(8px, .6944vw, 18px) 0 0;
            color: var(--pm-body);
            font-family: "DM Sans", Arial, sans-serif;
            font-size: clamp(13px, 1.0417vw, 27px);
            font-weight: 400;
            line-height: 1.42;
            letter-spacing: 0;
            white-space: nowrap;
          }

          @media (max-width: 1100px) {
            .pm-benefit > p { white-space: normal; }
          }

          .pm-benefits-visible .pm-benefit {
            animation: pmBenefitRise 620ms cubic-bezier(.22,1,.36,1) forwards;
          }
          .pm-benefits-visible .pm-benefit:nth-child(1) { animation-delay: 90ms; }
          .pm-benefits-visible .pm-benefit:nth-child(2) { animation-delay: 180ms; }
          .pm-benefits-visible .pm-benefit:nth-child(3) { animation-delay: 270ms; }
          .pm-benefits-visible .pm-benefit:nth-child(4) { animation-delay: 360ms; }
          .pm-benefit:hover .pm-benefit-icon svg { transform: scale(1.045); }

          @keyframes pmBenefitRise {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @media (max-width: 1023px) {
            .pm-benefits {
              height: auto;
              min-height: 300px;
              padding-bottom: 44px;
              overflow: visible;
            }
            .pm-benefits-grid {
              grid-template-columns: repeat(2, minmax(0,1fr));
              row-gap: 34px;
              max-width: 720px;
            }
            .pm-benefit:nth-child(3) { border-left: 0; }
            .pm-benefit-icon { width: 78px; height: 78px; }
            .pm-benefit-icon svg { width: 56px; height: 56px; }
            .pm-benefit h3 { font-size: 24px; }
            .pm-benefit > p { white-space: normal; }
          }

          .pm-cta {
            position: relative;
            isolation: isolate;
            height: clamp(220px, 21vw, 538px);
            display: grid;
            place-items: center;
            overflow: hidden;
            background: var(--pm-forest-950);
          }
          .pm-cta-branch {
            position: absolute;
            left: clamp(-40px, -2.7778vw, -12px);
            bottom: clamp(-60px, -4.1667vw, -20px);
            width: clamp(260px, 29.1667vw, 420px);
            height: auto;
            opacity: .10;
            pointer-events: none;
            fill: none;
            stroke: var(--pm-gold-light);
            stroke-width: 1.3;
            stroke-linecap: round;
            stroke-linejoin: round;
          }
          .pm-cta-branch ellipse {
            fill: none;
            stroke: var(--pm-gold-light);
            stroke-width: 1.1;
            opacity: .85;
          }
          .pm-cta-inner {
            position: relative;
            z-index: 1;
            width: 100%;
            max-width: clamp(944px, 91.6667vw, 2347px);
            margin-inline: auto;
            padding-inline: clamp(48px, 4.7222vw, 121px);
            text-align: center;
            opacity: 0;
            transform: translateY(16px);
          }
          .pm-cta h2 {
            margin: 0 auto;
            max-width: clamp(680px, 47.2222vw, 1209px);
            color: var(--pm-cream-text);
            font-family: "Cormorant Garamond", Georgia, serif;
            font-size: clamp(30px, 2.7778vw, 70px);
            font-weight: 500;
            line-height: 1.08;
            letter-spacing: -.015em;
          }
          .pm-cta a {
            display: inline-grid;
            place-items: center;
            width: clamp(220px, 17.7083vw, 255px);
            height: clamp(48px, 3.8889vw, 58px);
            margin-top: clamp(22px, 2.0833vw, 53px);
            border-radius: 3px;
            color: var(--pm-forest-950);
            background: linear-gradient(135deg, var(--pm-gold-light) 0%, var(--pm-gold) 50%, var(--pm-gold-medium) 100%);
            font-family: "DM Sans", Arial, sans-serif;
            font-size: clamp(12px, .9028vw, 14px);
            font-weight: 600;
            letter-spacing: .14em;
            text-transform: uppercase;
            white-space: nowrap;
            transition: background 220ms ease, transform 220ms ease;
          }
          .pm-cta a:hover {
            background: linear-gradient(135deg, #E6C070 0%, var(--pm-gold-light) 55%, var(--pm-gold) 100%);
            transform: translateY(-1px);
          }
          .pm-cta-visible .pm-cta-inner {
            animation: pmCtaRise 620ms cubic-bezier(.22,1,.36,1) forwards;
          }
          @keyframes pmCtaRise {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @media (max-width: 767px) {

            .pm-hero { height: 320px; }
            .pm-hero-image { object-position: 75% center; }
            .pm-hero-overlay {
              background: linear-gradient(90deg, rgba(7,25,15,.98) 0%, rgba(7,25,15,.91) 54%, rgba(7,25,15,.48) 78%, rgba(7,25,15,.18) 100%);
            }
            .pm-hero-copy {
              top: 86px;
              left: 24px;
              right: 20px;
              max-width: none;
            }
            .pm-hero-copy h1 {
              max-width: 300px;
              font-size: clamp(32px, 9.2vw, 42px);
            }
            .pm-hero-rule { margin-top: 22px; margin-bottom: 16px; }
            .pm-hero-copy p { font-size: 15px; }

            .pm-products {
              height: auto;
              padding: 38px 20px 42px;
              overflow: visible;
            }
            .pm-products-heading-row { column-gap: 14px; }
            .pm-products-heading-row h2 { font-size: 34px; }
            .pm-products-grid {
              grid-template-columns: 1fr;
              gap: 18px;
              max-width: 420px;
              margin-top: 28px;
            }
            .pm-product-card {
              height: 390px;
              padding: 20px;
            }
            .pm-product-art-area { height: 145px; }
            .pm-coin-art { width: 138px; height: 138px; }
            .pm-maple-art { width: 145px; height: 145px; }
            .pm-bar-art { width: 94px; height: 145px; }
            .pm-product-card h3 { min-height: 66px; font-size: 36px; }
            .pm-product-divider { width: 48px; margin: 13px auto 10px; }
            .pm-product-purity, .pm-product-label { font-size: 17px; }
            .pm-product-sizes { font-size: 15px; }
            .pm-product-sizes i { height: 20px; margin-inline: 9px; }

            .pm-process {
              height: auto;
              padding: 38px 20px 46px;
              overflow: visible;
            }
            .pm-process-heading-row { column-gap: 14px; }
            .pm-process-heading-row h2 { font-size: 34px; }
            .pm-steps {
              grid-template-columns: 1fr 1fr;
              gap: 34px 12px;
              max-width: 390px;
              margin-top: 30px;
            }
            .pm-step:not(:last-child)::after { display: none; }
            .pm-step-circle { width: 94px; height: 94px; }
            .pm-step-circle svg { width: 54px; height: 54px; }
            .pm-step h3 { margin-top: 12px; font-size: 24px; }

            .pm-pricing { height: auto; padding: 0 20px 40px; overflow: visible; }
            .pm-pricing-panel { height: auto; padding: 20px 18px; }
            .pm-pricing-leaf { width: 44px; height: 44px; margin-left: 0; }
            .pm-pricing-divider { height: 44px; margin-inline: 16px; }
            .pm-pricing-copy h2, .pm-pricing-copy p { font-size: 18px; }

            .pm-benefits { padding: 38px 20px 46px; }
            .pm-benefits-heading-row { column-gap: 12px; }
            .pm-benefits-heading-row p { font-size: 10px; }
            .pm-benefits-heading-row h2 { font-size: 31px; white-space: normal; }
            .pm-benefits-grid {
              grid-template-columns: 1fr;
              gap: 0;
              max-width: 420px;
              margin-top: 30px;
            }
            .pm-benefit {
              padding: 28px 12px;
              border-left: 0 !important;
              border-top: 1px solid var(--pm-divider);
            }
            .pm-benefit:first-child { padding-top: 0; border-top: 0; }
            .pm-benefit-icon { width: 84px; height: 84px; }
            .pm-benefit-icon svg { width: 60px; height: 60px; }
            .pm-benefit h3 { margin-top: 14px; font-size: 28px; }
            .pm-benefit > p { margin-top: 8px; font-size: 15px; }

            .pm-cta { height: auto; min-height: 220px; padding: 48px 20px; }
            .pm-cta-branch { width: 220px; left: -50px; bottom: -40px; opacity: .08; }
            .pm-cta-inner { padding-inline: 0; }
            .pm-cta h2 { font-size: 28px; }
            .pm-cta a { width: min(260px, 100%); height: 54px; font-size: 12px; }
          }


          @media (prefers-reduced-motion: reduce) {
            .pm-hero-image,
            .pm-hero-copy h1 span,
            .pm-hero-rule,
            .pm-hero-copy p,
            .pm-products-visible .pm-product-card {
              animation: none;
              opacity: 1;
              transform: none;
            }
            .pm-process-heading-row,
            .pm-step,
            .pm-step-circle svg,
            .pm-step:not(:last-child)::after {
              animation: none !important;
              opacity: 1;
              transform: none;
            }
            .pm-pricing-panel,
            .pm-pricing-leaf {
              animation: none !important;
              opacity: 1;
              transform: none;
              stroke-dashoffset: 0;
            }
            .pm-benefits-heading-row,
            .pm-benefit {
              animation: none !important;
              opacity: 1;
              transform: none;
            }
            .pm-benefit-icon svg { transition: none; }
            .pm-cta,
            .pm-cta-inner {
              animation: none !important;
              opacity: 1;
              transform: none;
            }
            .pm-cta a { transition: none; }
          }

        `}</style>

      </main>
      <SiteFooter />
    </>
  );
}
