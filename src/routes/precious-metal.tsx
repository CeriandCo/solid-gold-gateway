import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import heroImage from "@/assets/hero-gold.jpg";

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
    <svg className="pm-product-art pm-coin-art" viewBox="0 0 160 160" role="img" aria-label="Engraved American Gold Eagle coin illustration">
      <circle cx="80" cy="80" r="68" /><circle cx="80" cy="80" r="63" /><circle cx="80" cy="80" r="58" strokeDasharray="1.2 3.2" />
      <path d="M53 119c11-13 15-27 17-42l-9-8 13 1 6-27 7 27 13-1-9 9c2 15 7 29 17 41M66 99c10 5 19 5 29 0M70 111c7 3 14 3 21 0M80 43l-9-8m9 8 9-8M57 61l-12-6m58 6 12-6M52 80H37m71 0h15" />
      <path d="M51 127c18 8 39 8 58 0M48 39c19-15 45-15 64 0M62 31l3 5m13-10 1 6m16-4-2 6" />
    </svg>
  );
}

function MapleLeafArt() {
  return (
    <svg className="pm-product-art pm-maple-art" viewBox="0 0 170 170" role="img" aria-label="Engraved Canadian Maple Leaf coin illustration">
      <circle cx="85" cy="85" r="72" /><circle cx="85" cy="85" r="67" /><circle cx="85" cy="85" r="61" strokeDasharray="1 3" />
      <path d="M85 36l8 18 15-7-4 18 17 5-13 13 8 10-23 4 2 28-10-12-10 12 2-28-23-4 8-10-13-13 17-5-4-18 15 7 8-18Z" />
      <path d="M85 54v59M69 65l16 17 17-17M61 84l24 9 25-9M48 128c23 11 51 11 74 0M52 39c20-14 46-14 66 0" />
    </svg>
  );
}

function PampBarArt() {
  return (
    <svg className="pm-product-art pm-bar-art" viewBox="0 0 120 170" role="img" aria-label="Engraved PAMP gold bar illustration">
      <rect x="16" y="5" width="88" height="160" rx="5" /><rect x="22" y="11" width="76" height="148" rx="3" />
      <path d="M60 30c10 0 18 8 18 18S70 66 60 66s-18-8-18-18 8-18 18-18Zm0 4-5 9-10 2 7 8-2 10 10-5 10 5-2-10 7-8-10-2-5-9Z" />
      <path d="M42 78h36M38 85h44M46 123h28M42 130h36" />
      <text x="60" y="99" textAnchor="middle">PAMP</text><text x="60" y="111" textAnchor="middle">SUISSE</text><text x="60" y="145" textAnchor="middle">FINE GOLD</text>
    </svg>
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
            <p className="pm-product-purity">Purity: {product.purity}</p>
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
            height: clamp(424px, 41.4583vw, 1061px);
            overflow: hidden;
            background: var(--pm-forest-black);
          }

          .pm-hero-image {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: 58% center;
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
            top: clamp(68px, 6.6667vw, 171px);
            left: clamp(52px, 5.0694vw, 130px);
            max-width: clamp(476px, 46.5278vw, 1191px);
          }

          .pm-hero-copy h1 {
            margin: 0;
            max-width: clamp(484px, 47.2222vw, 1209px);
            color: var(--pm-cream-text);
            font-family: "Cormorant Garamond", Georgia, serif;
            font-size: clamp(58px, 5.6944vw, 146px);
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
          .pm-maple-art { width: clamp(103px, 10.4167vw, 267px); height: clamp(103px, 10.4167vw, 267px); }
          .pm-bar-art { width: clamp(74px, 7.6389vw, 196px); height: clamp(107px, 10.7639vw, 276px); }

          .pm-product-card h3 {
            min-height: clamp(56px, 5.4861vw, 140px);
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

          @media (max-width: 767px) {
            .pm-hero { height: 424px; }
            .pm-hero-image { object-position: 67% center; }
            .pm-hero-overlay {
              background: linear-gradient(90deg, rgba(7,25,15,.98) 0%, rgba(7,25,15,.91) 54%, rgba(7,25,15,.48) 78%, rgba(7,25,15,.18) 100%);
            }
            .pm-hero-copy {
              top: 64px;
              left: 24px;
              right: 20px;
              max-width: none;
            }
            .pm-hero-copy h1 {
              max-width: 350px;
              font-size: clamp(45px, 12.3vw, 58px);
            }
            .pm-hero-rule { margin-top: 28px; margin-bottom: 20px; }
            .pm-hero-copy p { font-size: 17px; }

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
          }
        `}</style>
      </main>
      <SiteFooter />
    </>
  );
}
