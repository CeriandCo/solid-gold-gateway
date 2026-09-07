import { createFileRoute } from "@tanstack/react-router";
import { GoldButton, SiteFooter, SiteHeader, WIDE } from "@/components/site-chrome";

export const Route = createFileRoute("/learn/physical-gold-vs-gold-etf")({
  head: () => ({
    meta: [
      { title: "Physical Gold vs Gold ETF: What You Actually Own | SQOOT Pure" },
      {
        name: "description",
        content:
          "Understand the difference between owning physical gold and holding shares in a gold ETF — and why what you actually own matters.",
      },
      {
        property: "og:title",
        content: "Physical Gold vs Gold ETF: What You Actually Own | SQOOT Pure",
      },
      {
        property: "og:description",
        content:
          "Physical gold or gold ETF? Learn what each structure means for ownership, custody, and rights.",
      },
      { property: "og:url", content: "https://solid-gold-gateway.lovable.app/learn/physical-gold-vs-gold-etf" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://solid-gold-gateway.lovable.app/learn/physical-gold-vs-gold-etf",
      },
    ],
  }),
  component: ArticlePage,
});

function ArticlePage() {
  return (
    <div className="flex min-h-screen flex-col bg-warm-white">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero / title area */}
        <section className="bg-forest-deep py-16 text-warm-white sm:py-20 lg:py-24">
          <div className={WIDE}>
            <div className="max-w-[720px]">
              <p className="eyebrow text-gold mb-4">Learn</p>
              <h1 className="font-display text-3xl font-medium leading-[1.08] tracking-[-0.02em] sm:text-4xl lg:text-[2.75rem]">
                Physical Gold vs Gold ETF: What You Actually Own
              </h1>
            </div>
          </div>
        </section>

        {/* Article body */}
        <article className="mx-auto max-w-[720px] px-5 py-14 sm:py-18 lg:py-22">
          <p className="body-copy text-charcoal/90">
            Gold is gold, right?
          </p>
          <p className="body-copy mt-5 text-charcoal/90">Not quite.</p>
          <p className="body-copy mt-5 text-charcoal/90">
            You can buy physical gold. You can buy shares in a gold ETF. Both can give you exposure to the price of gold, but what you actually own is fundamentally different.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">That distinction matters.</p>
          <p className="body-copy mt-5 text-charcoal/90">
            If your goal is to understand where your money goes, what sits behind your purchase, and what rights you have once you own it, here is the difference.
          </p>

          <h2 className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            Physical gold: you own the metal
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            When you buy physical gold, you are buying a tangible asset.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            That might be a gold coin, a small bullion bar, or a fractional interest in a larger physical bar, depending on how the ownership arrangement is structured.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            The important point is that your ownership relates to actual gold.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Physical gold exists independently of a stock exchange. It does not represent shares in a company or units in an investment fund.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Depending on how you choose to own it, you may keep your gold yourself or have it held securely on your behalf.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            With professionally vaulted physical gold, it is important to understand exactly how that gold is held. Is it allocated to owners? Who is the custodian? How is it insured? Is it independently audited? And what rights do you have to sell or take delivery?
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            These details tell you what &quot;owning gold&quot; really means with a particular provider.
          </p>

          <h2 className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            A gold ETF: you own shares in a fund
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            A gold exchange-traded fund, or ETF, works differently.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Instead of purchasing gold directly, you purchase shares in a fund that is designed to provide exposure to the price of gold.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Many physically backed gold ETFs hold bullion as an underlying asset. Others may use different structures, so it is important to read the fund documentation.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Either way, as an everyday ETF holder, what you own is the ETF security, not a gold bar sitting in your name.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Your investment is governed by the structure and rules of the fund. You can generally buy and sell your shares through a brokerage account while the relevant market is open.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">For many people, that convenience is precisely the point.</p>
          <p className="body-copy mt-5 text-charcoal/90">But it is a different form of ownership.</p>

          <h2 className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            So what is the practical difference?
          </h2>
          <blockquote className="mt-6 border-l-4 border-gold bg-cream/60 py-5 pr-6 pl-6">
            <p className="font-display text-xl font-medium italic leading-[1.25] tracking-[-0.01em] text-forest-deep sm:text-2xl">
              Think of it this way:
            </p>
            <p className="body-copy mt-4 text-charcoal/90">
              Neither structure magically changes what gold is worth.
            </p>
            <p className="body-copy mt-4 text-charcoal/90">
              What changes is the relationship between you and the gold.
            </p>
          </blockquote>

          <h2 className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            Why would someone choose a gold ETF?
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            Gold ETFs can make sense for people who want convenient gold-price exposure inside a traditional investment portfolio.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            They can usually be bought and sold relatively easily through an existing brokerage account. There is no need to arrange personal storage, shipping or insurance for physical metal.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            For someone primarily interested in trading gold-price movements or managing investments within a brokerage portfolio, that can be useful.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            The trade-off is that you are participating through a financial product rather than directly owning physical metal.
          </p>

          <h2 className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            Why would someone choose physical gold?
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            For many physical gold buyers, direct ownership is part of the appeal.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            There is something fundamentally simple about owning an asset that exists in the physical world.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            You are not buying a company. You are not buying a promise of future earnings. And you are not buying shares in a fund.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">You are buying gold.</p>
          <p className="body-copy mt-5 text-charcoal/90">
            That does not mean physical gold is risk-free. The price can rise and fall, and buying, selling, storing, insuring or delivering physical metal can involve costs.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            But the underlying proposition is relatively straightforward: your ownership is tied to a real, physical asset.
          </p>

          <h2 className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            What about fractional physical gold?
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            Traditionally, one of the barriers to physical bullion ownership has been the amount required to purchase an entire bar.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">Fractional ownership changes that.</p>
          <p className="body-copy mt-5 text-charcoal/90">
            Instead of purchasing a whole large-format bullion bar, multiple buyers can own fractions of physical bullion.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Done properly, fractional physical ownership is still very different from buying an ETF. The important questions are not simply, &quot;Can I start with a smaller amount?&quot; but:
          </p>
          <ul className="body-copy mt-5 list-disc space-y-2 pl-6 text-charcoal/90">
            <li>What exactly do I own?</li>
            <li>Where is the gold?</li>
            <li>How is my ownership recorded?</li>
            <li>Who holds it?</li>
            <li>How is it verified?</li>
            <li>And what happens if I want to sell or take delivery?</li>
          </ul>
          <p className="body-copy mt-5 text-charcoal/90">
            Those are the questions worth asking of any fractional gold provider.
          </p>

          <h2 className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            Ownership first. Product second.
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            The choice between physical gold and a gold ETF does not need to begin with which one is &quot;better.&quot;
          </p>
          <p className="body-copy mt-5 text-charcoal/90">Start with a simpler question:</p>
          <p className="body-copy mt-5 text-charcoal/90">What do I actually want to own?</p>
          <p className="body-copy mt-5 text-charcoal/90">
            If you want financial exposure to gold within a brokerage portfolio, an ETF may suit that purpose.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            If you want your ownership connected to physical gold itself, then physical bullion, whether purchased outright or through an appropriately structured fractional ownership model, is a fundamentally different proposition.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Understanding that distinction is the first step.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Because two products can follow the same gold price while giving you two very different things to own.
          </p>

          <h3 className="font-display mt-12 text-xl font-medium leading-[1.15] tracking-[-0.01em] text-forest-deep sm:text-2xl">
            Explore physical gold ownership with SQOOT Pure
          </h3>
          <p className="body-copy mt-4 text-charcoal/90">
            SQOOT Pure is being built to make physical precious metal ownership more accessible, transparent and easier to understand.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Learn how fractional physical gold works, how bullion is held and verified, and what ownership means before you buy.
          </p>
        </article>

        {/* Closing CTA */}
        <section className="bg-forest-deep py-14 text-warm-white sm:py-18">
          <div className={WIDE}>
            <div className="mx-auto max-w-[720px] text-center">
              <p className="eyebrow text-gold mb-4">Get early access</p>
              <h2 className="font-display text-2xl font-medium leading-[1.1] tracking-[-0.015em] sm:text-3xl">
                Join the SQOOT Pure waitlist
              </h2>
              <p className="body-copy mx-auto mt-5 max-w-[600px] text-warm-white/80">
                Be among the first to explore fractional physical gold ownership when SQOOT Pure launches.
              </p>
              <div className="mt-8">
                <GoldButton to="/vault" className="h-[54px] px-8">Join the SQOOT Pure waitlist</GoldButton>
              </div>
              <p className="compact-copy mt-10 text-warm-white/60">
                Important information: This content is provided for general educational purposes only and does not constitute financial, investment, legal or tax advice. Gold prices can rise or fall, and you may receive less than you paid. Product structures, fees, custody arrangements and redemption rights vary. Always review the relevant terms and disclosures before making a financial decision.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
