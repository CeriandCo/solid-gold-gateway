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
import introPhoneScreen from "@/assets/home/phone-screen-intro-priced.png.asset.json";
import homePhoneScreen from "@/assets/home/phone-screen-home-full.png.asset.json";
import giftPhoneScreen from "@/assets/home/phone-screen-gift-preview.png.asset.json";
import goldPriceBackground from "@/assets/home/gold-price-background.png.asset.json";
import giftWeddings from "@/assets/home/gift-tile-weddings.png.asset.json";
import giftNewArrivals from "@/assets/home/gift-tile-new-arrivals.png.asset.json";
import giftFestivals from "@/assets/home/gift-tile-festivals.png.asset.json";
import trustBackground from "@/assets/home/trust-background.png.asset.json";

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

const GOLD_PRICE = {
  price: "$3,412.80",
  changePercent: "0.42%",
  changeAmount: "$14.27",
  asOf: "09:41",
  stats: [
    { label: "24-hour high", value: "$3,421.06" },
    { label: "24-hour low", value: "$3,389.44" },
    { label: "Previous close", value: "$3,398.53" },
  ],
} as const;

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

const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "Join the waitlist",
    body: "Free, with no bank details. We email you the day accounts open.",
  },
  {
    number: "02",
    title: "Create your account",
    body: "Verify your email and identity from your phone in a few minutes.",
  },
  {
    number: "03",
    title: "Buy your way",
    body: "A coin, a weight, or both. Spot, premium and fees are shown before you confirm.",
  },
  {
    number: "04",
    title: "Keep, deliver or sell",
    body: "Store it in the vault, ship it home, gift it, or sell it back in the app.",
  },
] as const;

const GIFT_TILES = [
  {
    image: giftWeddings.url,
    alt: "A couple's hands with a gold coin at a wedding",
    title: "Weddings",
    body: "A coin for the couple, kept in their name for the years ahead.",
  },
  {
    image: giftNewArrivals.url,
    alt: "A newborn's hand resting on a parent's palm",
    title: "New arrivals",
    body: "Start a holding on the day they arrive.",
  },
  {
    image: giftFestivals.url,
    alt: "Festival lamps lit beside gold coins",
    title: "Festivals",
    body: "Akshaya Tritiya, Diwali, Lunar New Year and more.",
  },
] as const;

const TRUST_SAFEGUARDS = [
  {
    title: "Sourced",
    body: "Supplied through Dillon Gage, a precious-metals wholesaler and refiner applying OECD-aligned due diligence.",
    status: "confirmed",
    statusLabel: "Confirmed",
  },
  {
    title: "Stored",
    body: "Allocated, segregated storage with a professional vault operator, recorded in your name.",
    status: "pending",
    statusLabel: "Partner named before launch",
  },
  {
    title: "Insured",
    body: "Covered in transit and while it sits in storage, for its full replacement value.",
    status: "pending",
    statusLabel: "Policy published before launch",
  },
  {
    title: "Audited",
    body: "Independent checks of every bar and coin against our records.",
    status: "pending",
    statusLabel: "First report after launch",
  },
] as const;

function SectionContainer() {
  return <div className="site-container" />;
}

function GiftTile({
  tile,
  className,
}: {
  tile: (typeof GIFT_TILES)[number];
  className?: string;
}) {
  return (
    <figure className={className ? `home-gift-tile ${className}` : "home-gift-tile"}>
      <img src={tile.image} alt={tile.alt} loading="lazy" className="home-gift-tile-image" />
      <span className="home-gift-tile-scrim" aria-hidden="true" />
      <figcaption className="home-gift-tile-caption">
        <p className="home-gift-tile-title">{tile.title}</p>
        <p className="home-gift-tile-body">{tile.body}</p>
      </figcaption>
    </figure>
  );
}

function TrustStatus({
  variant,
  children,
}: {
  variant: "confirmed" | "pending";
  children: string;
}) {
  return (
    <span className={`home-trust-status home-trust-status-${variant}`}>
      <span className="home-trust-status-dot" aria-hidden="true">
        {variant === "confirmed" ? "●" : "○"}
      </span>
      <span>{children}</span>
    </span>
  );
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
        <section id="app" className="bg-forest-black" aria-labelledby="app-heading">
          <div className="home-app">
            <div className="home-app-head">
              <p className="home-app-eyebrow">THE SQOOT PURE APP</p>
              <h2 id="app-heading" className="home-app-title">
                All of your gold, <em>in your pocket.</em>
              </h2>
              <p className="home-app-body">
                Buy, store, gift, deliver and sell back — every step priced in the open and confirmed with Face ID.
              </p>
            </div>

            <div className="home-app-showcase">
              <ul className="home-app-features home-app-features-left">
                {APP_FEATURES_LEFT.map((feature) => (
                  <li key={feature.title}>
                    <span className="home-app-feature-rule" aria-hidden="true" />
                    <h3>{feature.title}</h3>
                    <p>{feature.body}</p>
                  </li>
                ))}
              </ul>

              <div className="home-app-stage">
                <span className="home-app-glow" aria-hidden="true" />
                <PhoneMockup screen={introPhoneScreen.url} className="home-app-phone home-app-phone-left" />
                <PhoneMockup screen={giftPhoneScreen.url} className="home-app-phone home-app-phone-right" />
                <PhoneMockup screen={homePhoneScreen.url} className="home-app-phone home-app-phone-center" />
              </div>

              <ul className="home-app-features home-app-features-right">
                {APP_FEATURES_RIGHT.map((feature) => (
                  <li key={feature.title}>
                    <span className="home-app-feature-rule" aria-hidden="true" />
                    <h3>{feature.title}</h3>
                    <p>{feature.body}</p>
                  </li>
                ))}
              </ul>
            </div>

            <CtaRow className="home-app-ctas">
              <GoldButton to="/early-access" className="h-[50px] min-h-[50px]">
                Join the waitlist
              </GoldButton>
              <div className="home-hero-stores" aria-label="Mobile apps coming soon">
                {(["App Store", "Google Play"] as const).map((store) => (
                  <div key={store} className="home-hero-store-badge">
                    <span>Coming soon on</span>
                    <strong>{store}</strong>
                  </div>
                ))}
              </div>
            </CtaRow>
          </div>
        </section>
        <section id="how-it-works" className={`bg-cream-2 home-how ${STANDARD_SECTION}`}>
          <div className="home-how-head">
            <p className="home-how-eyebrow">HOW IT WORKS</p>
            <h2 className="home-how-title">From waitlist to your first ounce.</h2>
          </div>
          <ol className="home-how-steps">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <li key={step.number}>
                <span className="home-how-number" aria-hidden="true">
                  {step.number}
                </span>
                <h3 className="home-how-step-title">{step.title}</h3>
                <p className="home-how-step-body">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>
        <section id="gold-price" className="bg-forest-black home-price">
          <img
            src={goldPriceBackground.url}
            alt=""
            width={1920}
            height={1080}
            loading="lazy"
            className="home-price-background"
          />
          <div className="home-price-scrim" aria-hidden="true" />
          <div className="site-container home-price-inner">
            <div className="home-price-copy">
              <div className="home-price-labels">
                <p className="home-price-eyebrow">TODAY&rsquo;S GOLD PRICE</p>
                <span className="home-price-chip">Sample data — not a real price</span>
              </div>
              <p className="home-price-value">{GOLD_PRICE.price}</p>
              <div className="home-price-change">
                <span className="home-price-delta">
                  <span aria-hidden="true">▲</span> +{GOLD_PRICE.changePercent}
                </span>
                <span className="home-price-delta">+{GOLD_PRICE.changeAmount}</span>
                <span className="home-price-meta">per troy ounce · USD · as of {GOLD_PRICE.asOf}</span>
              </div>
              <dl className="home-price-stats">
                {GOLD_PRICE.stats.map((stat) => (
                  <div key={stat.label}>
                    <dt>{stat.label}</dt>
                    <dd>{stat.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="home-price-links">
                <Link
                  to="/aurum"
                  search={{ range: "1Y", note: undefined, brief: undefined, priceState: undefined }}
                  className="home-price-link"
                >
                  Read what moved it in AURUM
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <p className="home-price-disclaimer">
                  Figures are indicative. Not an offer to buy or sell.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="gifting" className={`bg-cream ${STANDARD_SECTION}`} aria-labelledby="gifting-heading">
          <div className="home-gift site-container">
            <div className="home-gift-head">
              <div className="home-gift-intro">
                <p className="home-gift-eyebrow">GOLD GIFTS THAT LAST</p>
                <h2 id="gifting-heading">
                  Gold marks the moments
                  <br />
                  that matter.
                </h2>
                <p className="home-gift-copy">
                  Send a coin or a few grams with a note, straight from the app. They open a gift — not a price tag.
                </p>
              </div>
              <Link to="/gifting" className="home-three-ways-link">
                <span>Explore gifting</span>
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>

            <div className="home-gift-mosaic">
              <GiftTile tile={GIFT_TILES[0]} className="home-gift-tile-tall" />
              <div className="home-gift-column">
                <GiftTile tile={GIFT_TILES[1]} />
                <GiftTile tile={GIFT_TILES[2]} />
              </div>
            </div>
          </div>
        </section>
        <section id="trust" className={`home-trust ${STANDARD_SECTION}`} aria-labelledby="trust-heading">
          <img
            src={trustBackground.url}
            alt=""
            width={1697}
            height={927}
            loading="lazy"
            className="home-trust-background"
          />
          <div className="home-trust-inner site-container">
            <div className="home-trust-head">
              <div className="home-trust-intro">
                <p className="home-trust-eyebrow">TRUST, IN THE OPEN</p>
                <h2 id="trust-heading">
                  Where your gold comes from —
                  <br />
                  and where it lives.
                </h2>
                <p className="home-trust-copy">
                  We publish each safeguard as it is confirmed, and say plainly what is still pending.
                </p>
              </div>
              <Link to="/trust-center" className="home-three-ways-link home-trust-link">
                <span>Visit the Trust Center</span>
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>

            <div className="home-trust-safeguards">
              {TRUST_SAFEGUARDS.map((safeguard) => (
                <article key={safeguard.title} className="home-trust-card">
                  <h3>{safeguard.title}</h3>
                  <p>{safeguard.body}</p>
                  <span className="home-trust-spacer" aria-hidden="true" />
                  <TrustStatus variant={safeguard.status}>{safeguard.statusLabel}</TrustStatus>
                </article>
              ))}
            </div>
          </div>
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
