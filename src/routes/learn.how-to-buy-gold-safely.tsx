import { createFileRoute } from "@tanstack/react-router";
import { GoldButton, SiteFooter, SiteHeader, WIDE } from "@/components/site-chrome";

export const Route = createFileRoute("/learn/how-to-buy-gold-safely")({
  head: () => ({
    meta: [
      { title: "How to Buy Physical Gold Online Safely | SQOOT Pure" },
      {
        name: "description",
        content:
          "A practical guide to buying physical gold online safely: what to check, who to trust, how pricing works, and how to verify storage and ownership.",
      },
      {
        property: "og:title",
        content: "How to Buy Physical Gold Online Safely | SQOOT Pure",
      },
      {
        property: "og:description",
        content:
          "What to check before buying gold online, from product structure and pricing to storage, insurance, audits, and exit options.",
      },
      { property: "og:url", content: "https://solid-gold-gateway.lovable.app/learn/how-to-buy-gold-safely" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://solid-gold-gateway.lovable.app/learn/how-to-buy-gold-safely",
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
                How to Buy Physical Gold Online Safely
              </h1>
            </div>
          </div>
        </section>

        {/* Article body */}
        <article className="mx-auto max-w-[720px] px-5 py-14 sm:py-18 lg:py-22">
          <p className="body-copy text-charcoal/90">
            Buying physical gold online can feel surprisingly simple.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Choose a product. Enter your details. Pay. Your gold is either delivered to you or stored on your behalf.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            But the simplicity of the checkout can hide an important fact: not every way of buying gold online gives you the same thing.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Before you buy, it is worth understanding who you are buying from, what you are actually buying, how the price is calculated and what happens to your gold after you pay.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">Here is what to check.</p>

          <h2 className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            1. Start with what you are actually buying
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            &quot;Buying gold&quot; can mean several different things.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">You might be buying:</p>
          <ul className="body-copy mt-4 list-disc space-y-2 pl-6 text-charcoal/90">
            <li>a physical gold bar or coin that will be delivered to you</li>
            <li>physical gold that is stored in a vault on your behalf</li>
            <li>fractional ownership of a larger physical gold bar</li>
            <li>a financial product designed to track the price of gold</li>
          </ul>
          <p className="body-copy mt-5 text-charcoal/90">These are not interchangeable.</p>
          <p className="body-copy mt-5 text-charcoal/90">
            If your intention is to own physical gold, look for clear information confirming that actual physical metal sits behind your purchase and explaining your ownership rights.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            For stored or fractional gold, ask an additional question:
          </p>
          <blockquote className="mt-6 border-l-4 border-gold bg-cream/60 py-5 pr-6 pl-6">
            <p className="font-display text-xl font-medium italic leading-[1.25] tracking-[-0.01em] text-forest-deep sm:text-2xl">
              Is specific physical gold allocated to customers, or is my purchase simply represented as a balance on an account?
            </p>
          </blockquote>
          <p className="body-copy mt-5 text-charcoal/90">The answer matters.</p>

          <h2 className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            2. Know who you are buying from
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            A polished website is not proof that a gold dealer is legitimate.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Before transferring money, look beyond the homepage.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            A credible provider should make it reasonably easy to establish who operates the business, where it is based, how to contact it and what terms apply to your purchase.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            The U.S. Commodity Futures Trading Commission recommends checking an online dealer&apos;s physical address, how long it has operated and whether its owners or salespeople have been associated with complaints or allegations of misconduct.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Be particularly cautious if you encounter a seller through an unsolicited phone call, email, social media message or high-pressure sales pitch. Regulators specifically identify these tactics as warning signs associated with precious metals scams.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">Good gold doesn&apos;t need a countdown timer.</p>

          <h2 className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            3. Check where the gold comes from
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            Not all gold bars are produced to the same standards.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            One useful reference point is the London Bullion Market Association (LBMA) Good Delivery system.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            The LBMA maintains a list of accredited refiners whose gold bars meet its standards around areas including purity, weight, physical appearance and responsible sourcing. Refiners also undergo checks relating to their history, financial standing and production capabilities.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            That does not mean every retail gold product itself is an &quot;LBMA Good Delivery bar.&quot; The formal Good Delivery standard applies to the large bars used in the wholesale London market.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            But knowing that your gold comes from a recognised refiner can give you another piece of information when assessing its provenance and quality.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Check the LBMA Good Delivery List:{" "}
            <a
              href="https://www.lbma.org.uk/good-delivery/gold-current-list"
              className="text-gold underline underline-offset-4 hover:text-gold-dark"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.lbma.org.uk/good-delivery/gold-current-list
            </a>
          </p>

          <h2 className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            4. Understand the price before you click buy
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            Gold has a market price, but that isn&apos;t necessarily the price you will pay.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Physical gold typically involves costs above the underlying metal value. Depending on the provider and product, these may include premiums, transaction fees, shipping, insurance or storage.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">Before purchasing, look for a clear breakdown of:</p>
          <p className="body-copy mt-5 text-charcoal/90">
            Gold value + premium or transaction fee + delivery/storage costs = your actual purchase price
          </p>
          <p className="body-copy mt-5 text-charcoal/90">Also look at the other side of the transaction.</p>
          <p className="body-copy mt-5 text-charcoal/90">
            If you later want to sell, how is the sale price determined? Does the provider offer a buyback service? Are there additional fees?
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            A provider should make these costs understandable before you commit.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Be wary of anyone who makes the purchase sound urgent while making the pricing difficult to understand. The FTC warns that precious metals scams commonly use urgency to push people into acting quickly.
          </p>

          <h2 className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            5. Decide where your gold will live
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            If you buy physical gold online, there are generally two paths: take delivery or use professional storage.
          </p>

          <h3 className="font-display mt-8 text-xl font-medium leading-[1.15] tracking-[-0.01em] text-forest-deep sm:text-2xl">
            Taking delivery
          </h3>
          <p className="body-copy mt-4 text-charcoal/90">Having the gold delivered gives you direct possession.</p>
          <p className="body-copy mt-5 text-charcoal/90">Before choosing this option, check:</p>
          <ul className="body-copy mt-4 list-disc space-y-2 pl-6 text-charcoal/90">
            <li>whether the shipment is insured</li>
            <li>whether tracking is provided</li>
            <li>whether a signature is required</li>
            <li>when responsibility for the gold transfers to you</li>
            <li>whether packaging is discreet</li>
            <li>what happens if the package is lost or damaged</li>
          </ul>
          <p className="body-copy mt-5 text-charcoal/90">
            Once it arrives, secure storage becomes your responsibility.
          </p>

          <h3 className="font-display mt-8 text-xl font-medium leading-[1.15] tracking-[-0.01em] text-forest-deep sm:text-2xl">
            Professional vault storage
          </h3>
          <p className="body-copy mt-4 text-charcoal/90">
            Vaulting can remove the need to keep valuable metal at home, but it creates a different set of questions.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">Find out:</p>
          <ul className="body-copy mt-4 list-disc space-y-2 pl-6 text-charcoal/90">
            <li>who operates the vault</li>
            <li>where the gold is stored</li>
            <li>whether your gold is allocated</li>
            <li>whether customer gold is kept separate from company assets</li>
            <li>what insurance applies</li>
            <li>whether holdings are independently audited</li>
            <li>whether you can request physical delivery</li>
            <li>what happens to your gold if the provider stops operating</li>
          </ul>
          <p className="body-copy mt-5 text-charcoal/90">
            Don&apos;t settle for a picture of a very impressive vault door. Look for the details behind it.
          </p>

          <h2 className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            6. Look for evidence, not just trust badges
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            Gold businesses naturally talk about security and trust.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">What matters is what sits behind those claims.</p>
          <p className="body-copy mt-5 text-charcoal/90">
            If a company says its gold is independently audited, look for information about who conducts the audit and how frequently it happens.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            If it says the gold is insured, understand who provides the coverage and what it covers.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            If it references regulatory registrations or industry memberships, check what those registrations actually mean rather than assuming they guarantee your purchase.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            And if a provider makes claims about the refinery that produced its gold, you can independently check recognised sources such as the LBMA Good Delivery List.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">Trust is stronger when you can verify it.</p>

          <h2 className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            7. Be suspicious of pressure
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            Gold has a long history, but unfortunately so do gold scams.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">Some warning signs are fairly straightforward:</p>
          <ul className="body-copy mt-4 list-disc space-y-2 pl-6 text-charcoal/90">
            <li>promises of guaranteed returns</li>
            <li>claims that gold cannot fall in value</li>
            <li>aggressive salespeople</li>
            <li>pressure to buy immediately</li>
            <li>unusually large discounts</li>
            <li>unclear or complicated fees</li>
            <li>requests to send money to an individual</li>
            <li>sellers approaching you unsolicited through social media</li>
            <li>reluctance to explain where the gold comes from or where it will be stored</li>
          </ul>
          <p className="body-copy mt-5 text-charcoal/90">
            The CFTC specifically advises consumers not to respond to unsolicited precious-metals offers or buy from individuals selling metals through social media and discussion boards.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            A legitimate purchase should give you enough information and enough time to make your own decision.
          </p>

          <h2 className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            8. Understand how you get your gold back out
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            This is particularly important when buying stored or fractional gold.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">Buying is only half the process.</p>
          <p className="body-copy mt-5 text-charcoal/90">
            Before you purchase, understand what happens when you eventually want to sell it, withdraw it or take physical delivery.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            For fractional ownership, check whether there is a minimum amount required before physical delivery becomes available.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            For vaulted gold, check withdrawal fees and delivery requirements.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            For physical bars and coins already in your possession, understand how the provider&apos;s buyback process works, if one is offered.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            A good buying experience should have a clear exit route.
          </p>

          <h2 className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            A simple checklist before buying gold online
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            Before making a purchase, you should be able to answer these questions:
          </p>
          <ul className="body-copy mt-5 list-disc space-y-3 pl-6 text-charcoal/90">
            <li><strong>What exactly am I buying?</strong> Physical gold, fractional physical gold or something that simply tracks its price?</li>
            <li><strong>Who am I buying it from?</strong> Can I verify the company behind the website?</li>
            <li><strong>Who produced the gold?</strong> Is the refinery identifiable and reputable?</li>
            <li><strong>What am I paying?</strong> Are premiums, fees, shipping and storage clearly disclosed?</li>
            <li><strong>Who owns the gold?</strong> If it is stored, are my ownership rights clearly explained?</li>
            <li><strong>Where is it kept?</strong> Can I identify the vault or storage arrangement?</li>
            <li><strong>Is it insured and independently verified?</strong> Can I find evidence supporting those claims?</li>
            <li><strong>Can I take delivery?</strong> If so, how and at what cost?</li>
            <li><strong>Can I sell it again?</strong> What does the process cost and how is the price determined?</li>
          </ul>
          <p className="body-copy mt-5 text-charcoal/90">
            If a provider makes those questions difficult to answer, that is useful information in itself.
          </p>

          <h2 className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            Buying gold online shouldn&apos;t require blind trust
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            The internet has made physical gold considerably easier to access.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            That convenience is valuable, but it shouldn&apos;t come at the expense of understanding what you own.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Take the time to verify the provider. Understand the product. Check where the gold comes from. Read the fees. Know how it is stored or delivered. And make sure you understand how you can sell or withdraw it later.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            The safest gold purchase isn&apos;t necessarily the one with the slickest website or the loudest promise.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            It&apos;s the one you can understand and verify.
          </p>

          <h3 className="font-display mt-12 text-xl font-medium leading-[1.15] tracking-[-0.01em] text-forest-deep sm:text-2xl">
            A different way to own physical gold
          </h3>
          <p className="body-copy mt-4 text-charcoal/90">
            SQOOT Pure is being built around a simple idea: make physical precious metal ownership easier to understand and more accessible.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            We believe you should know what you own, how much you&apos;re paying and what happens to your metal after you buy it.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Join the SQOOT Pure waitlist to be among the first to know when we launch.
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
                <GoldButton to="/vault">Join the SQOOT Pure waitlist</GoldButton>
              </div>
              <p className="compact-copy mt-10 text-warm-white/60">
                Important: This content is provided for general educational purposes only and does not constitute financial, investment, legal or tax advice. Gold prices can rise or fall, and you should consider your own circumstances before making a purchase.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
