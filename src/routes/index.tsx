import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import homeHero from "@/assets/home/home-hero.png.asset.json";
import heroPhone from "@/assets/home/phone-hero-vault-holdings.png.asset.json";

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
  change: "▲ 0.42%",
  note: "Sample data — not a real price",
} as const;

function SectionContainer() {
  return <div className="site-container" />;
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
              Buy a coin delivered to your door, build a holding by weight, or keep allocated gold in an insured vault — all from one app, priced live and held in your name.
            </p>

            <div className="home-hero-actions">
              <Link to="/early-access" className="home-hero-button home-hero-button-primary">
                Join the waitlist <span aria-hidden="true">→</span>
              </Link>
              <a href="#how-it-works" className="home-hero-button home-hero-button-secondary">
                How it works
              </a>
            </div>

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
              <span>{HERO_SPOT.change}</span>
            </div>
            <small>{HERO_SPOT.note}</small>
          </aside>
        </div>
      </section>

      <main>
        <section id="proof" className="bg-forest-2" aria-label="Why SQOOT gold">
          <div className="site-container">
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
          <SectionContainer />
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
