import { createFileRoute } from "@tanstack/react-router";
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

          @keyframes pmHeroSettle {
            from { transform: scale(1.025); }
            to { transform: scale(1); }
          }

          @keyframes pmHeroRise {
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
          }

          @media (prefers-reduced-motion: reduce) {
            .pm-hero-image,
            .pm-hero-copy h1 span,
            .pm-hero-rule,
            .pm-hero-copy p {
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
