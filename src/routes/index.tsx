import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteNav } from "@/components/site-chrome";

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

function SectionContainer() {
  return <div className="site-container" />;
}

function Index() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <section id="hero" className="bg-forest-black">
        <header>
          <SiteNav variant="overlay" />
        </header>
        <SectionContainer />
      </section>

      <main>
        <section id="proof" className="bg-forest-2">
          <SectionContainer />
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
