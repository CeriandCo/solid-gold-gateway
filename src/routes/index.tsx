import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CtaRow, GoldButton, SiteFooter, SiteHeader } from "@/components/site-chrome";
import homeHero from "@/assets/home/home-hero.png.asset.json";
import heroPhone from "@/assets/home/phone-hero-vault-holdings.png.asset.json";
import coinsCardBackground from "@/assets/home/card-bg-coins-delivered-home.png.asset.json";
import weightCardBackground from "@/assets/home/card-bg-buy-by-weight.png.asset.json";
import vaultCardBackground from "@/assets/home/card-bg-keep-it-in-the-vault.png.asset.json";
import coinsPhoneScreen from "@/assets/home/phone-screen-coins-delivered-home.png.asset.json";
import weightPhoneScreen from "@/assets/home/phone-screen-buy-by-weight.png.asset.json";
import vaultPhoneScreen from "@/assets/home/phone-screen-keep-it-in-the-vault.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SQOOT Pure — Own Real Gold, Three Ways" },
      {
        name: "description",
        content:
          "Buy a physical coin delivered home, buy fractional gold from ½ oz, or store allocated gold in insured U.S. vaults. Real ownership, at live spot pricing.",
      },
      { property: "og:title", content: "SQOOT Pure — Own Real Gold, Three Ways" },
      {
        property: "og:description",
        content:
          "Coins delivered home, fractional gold, or insured vault storage. Allocated, audited, redeemable on demand.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STANDARD_SECTION = "py-[clamp(72px,8.3vw,120px)]";

const HERO_SPOT = {
  price: "$3,412.80",
  changeGlyph: "▲",
  changeDirection: "Up",
  changePercent: "0.42%",
  note: "Sample data — not a real price",
} as const;

const PROOF_ITEMS = [
  {
    number: "01",
    title: "Real, physical gold",
    line: "Coins and bullion — never a token, note or ETF.",
  },
  {
    number: "02",
    title: "Held in your name",
    line: "Allocated to you and shown on every statement.",
  },
  {
    number: "03",
    title: "Priced live",
    line: "Spot and premium shown before you confirm.",
  },
  {
    number: "04",
    title: "Deliver or sell back",
    line: "Coins delivered to your door — sell back what you hold in the vault.",
  },
] as const;

const OWNERSHIP_WAYS = [
  {
    number: "01",
    title: "Coins, delivered home",
    description:
      "Gold Eagles, Britannias and Sovereigns, shipped insured with signature on delivery.",
    linkLabel: "Browse coins",
    to: "/precious-metal",
    background: coinsCardBackground.url,
    backgroundAlt: "Gold coins presented in a premium SQOOT Pure gift box",
    screen: coinsPhoneScreen.url,
    screenAlt: "SQOOT Pure app coin collection screen",
  },
  {
    number: "02",
    title: "Buy by weight",
    description:
      "Own from 1/10 oz. Enter an amount in dollars or ounces — your price holds for 90 seconds at checkout.",
    linkLabel: "How fractional works",
    to: "/fractional-gold",
    background: weightCardBackground.url,
    backgroundAlt: "Gold bars arranged by weight on cream linen",
    screen: weightPhoneScreen.url,
    screenAlt: "SQOOT Pure app buy-by-weight screen",
  },
  {
    number: "03",
    title: "Keep it in the vault",
    description:
      "Allocated, insured storage in your name, with statements, fees shown upfront and delivery on request.",
    linkLabel: "See the vault",
    to: "/vault",
    background: vaultCardBackground.url,
    backgroundAlt: "Gold bars and coins stored in a secure vault",
    screen: vaultPhoneScreen.url,
    screenAlt: "SQOOT Pure app vaulted holdings screen",
  },
] as const;

const APP_FEATURES_LEFT = [
  {
    title: "Priced live",
    body: "Spot from global markets plus a premium you see before you confirm — never after.",
  },
  {
    title: "Held in your name",
    body: "Allocated metal with serial-level records and a statement every month.",
  },
] as const;

const APP_FEATURES_RIGHT = [
  {
    title: "Deliver or sell back",
    body: "Ship coins from the vault to your door, or lock a price and sell back in two taps.",
  },
  {
    title: "Gift in a minute",
    body: "Send a coin or a gram with a note. They see the gift, not the price.",
  },
] as const;

function SectionContainer() {
  return <div className="site-container" />;
}

function PhoneMockup({ screen, className }: { screen: string; className?: string }) {
  return (
    <div className={className ? `home-own-phone ${className}` : "home-own-phone"} aria-hidden="true">
      <span className="home-own-phone-action" />
      <span className="home-own-phone-volume home-own-phone-volume-top" />
      <span className="home-own-phone-volume home-own-phone-volume-bottom" />
      <span className="home-own-phone-side" />
      <div className="home-own-phone-screen">
        <img src={screen} alt="" width={390} height={844} loading="lazy" />
        <span className="home-own-phone-island" />
        <span className="home-own-phone-glass" />
      </div>
    </div>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <SiteHeader />

      <section id="hero" className="home-hero">
        <img
          src={homeHero.url}
          alt=""
          width={1706}
          height={922}
          loading="eager"
          fetchPriority="high"
          className="home-hero-background"
        />
        <div className="home-hero-scrim" aria-hidden="true" />

        <div className="home-hero-inner site-container">
          <div className="home-hero-copy">
            <p className="home-hero-eyebrow">GOLD, MADE PERSONAL</p>
            <h1 className="home-hero-title">
              <span>Own gold</span>
              <span>the way it was</span>
              <em>meant to be.</em>
            </h1>
            <p className="home-hero-body">
              Two clear paths: buy, vault and sell your gold from the app — or buy a coin or bar and have it delivered to your door. Priced live, held in your name.
            </p>

            <CtaRow className="home-hero-ctas mt-7">
              <GoldButton to="/early-access">Join the waitlist</GoldButton>
              <GoldButton href="#how-it-works" variant="secondary" icon="none">
                How it works
              </GoldButton>
            </CtaRow>

            <div className="home-hero-stores" aria-label="Mobile apps coming soon">
              {(["App Store", "Google Play"] as const).map((store) => (
                <div key={store} className="home-hero-store-badge">
                  <span>Coming soon on</span>
                  <strong>{store}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="home-hero-phone-stage">
            <img
              src={heroPhone.url}
              alt="SQOOT Pure app showing allocated vaulted gold holdings"
              width={611}
              height={1262}
              className="home-hero-phone"
            />
          </div>

          <aside className="home-hero-spot-card" aria-label="Sample gold spot price">
            <p>GOLD SPOT · PER OZ</p>
            <div>
              <strong>{HERO_SPOT.price}</strong>
              <span>
                <span aria-hidden="true">{HERO_SPOT.changeGlyph} </span>
                <span className="sr-only">{HERO_SPOT.changeDirection} </span>
                {HERO_SPOT.changePercent}
              </span>
            </div>
            <small>{HERO_SPOT.note}</small>
          </aside>
        </div>
      </section>

      <main>
        <section id="proof" className="bg-forest-2" aria-labelledby="proof-heading">
          <div className="site-container">
            <h2 id="proof-heading" className="sr-only">
              Why SQOOT gold
            </h2>
            <ul className="home-proof">
              {PROOF_ITEMS.map((item) => (
                <li key={item.number}>
                  <span className="home-proof-number" aria-hidden="true">
                    {item.number}
                  </span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.line}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section id="three-ways" className={`bg-cream ${STANDARD_SECTION}`}>
          <div className="home-three-ways site-container">
            <div className="home-three-ways-head">
              <div className="home-three-ways-intro">
                <p className="home-three-ways-eyebrow">THREE WAYS TO OWN</p>
                <h2>
                  Start with a coin,
                  <br />
                  or buy gold by weight.
                </h2>
                <p className="home-three-ways-copy">
                  Pick the way that suits you today. Switch any time — everything you own sits in one account, in your name.
                </p>
              </div>
              <Link to="/pricing" hash="pricing-compare" className="home-three-ways-link">
                <span>Compare the three</span>
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>

            <div className="home-three-ways-cards">
              {OWNERSHIP_WAYS.map((way) => (
                <article key={way.number} className="home-own-card">
                  <div className="home-own-card-visual">
                    <img
                      src={way.background}
                      alt={way.backgroundAlt}
                      width={1205}
                      height={1305}
                      loading="lazy"
                      className="home-own-card-background"
                    />
                    <PhoneMockup screen={way.screen} />
                  </div>
                  <div className="home-own-card-copy">
                    <p className="home-own-card-number" aria-hidden="true">{way.number}</p>
                    <h3>{way.title}</h3>
                    <p>{way.description}</p>
                    <Link to={way.to} className="home-three-ways-link home-own-card-link">
                      <span>{way.linkLabel}</span>
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="app" className="bg-forest-black">
          <SectionContainer />
        </section>
        <section id="how-it-works" className={`bg-cream-2 ${STANDARD_SECTION}`}>
          <SectionContainer />
        </section>
        <section id="gold-price" className="bg-forest-black">
          <SectionContainer />
        </section>
        <section id="gifting" className={`bg-cream ${STANDARD_SECTION}`}>
          <SectionContainer />
        </section>
        <section id="trust" className="bg-forest">
          <SectionContainer />
        </section>
        <section id="from-aurum" className={`bg-cream-2 ${STANDARD_SECTION}`}>
          <SectionContainer />
        </section>
        <section id="faq" className={`bg-cream ${STANDARD_SECTION}`}>
          <SectionContainer />
        </section>
        <section id="cta" className="bg-forest-black">
          <SectionContainer />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
