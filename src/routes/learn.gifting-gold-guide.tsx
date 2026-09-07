import { createFileRoute } from "@tanstack/react-router";
import { GoldButton, SiteFooter, SiteHeader, WIDE } from "@/components/site-chrome";

export const Route = createFileRoute("/learn/gifting-gold-guide")({
  head: () => ({
    meta: [
      { title: "Gifting Gold: A Guide for Weddings, Festivals, and Milestones | SQOOT Pure" },
      {
        name: "description",
        content:
          "A guide to gifting gold for weddings, festivals, births, graduations and milestones — and what to know before you buy.",
      },
      {
        property: "og:title",
        content: "Gifting Gold: A Guide for Weddings, Festivals, and Milestones | SQOOT Pure",
      },
      {
        property: "og:description",
        content:
          "Why gold has been given across cultures for generations, and how to make it part of a meaningful gift today.",
      },
      { property: "og:url", content: "https://solid-gold-gateway.lovable.app/learn/gifting-gold-guide" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://solid-gold-gateway.lovable.app/learn/gifting-gold-guide",
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
                Gifting Gold: A Guide for Weddings, Festivals, and Milestones
              </h1>
            </div>
          </div>
        </section>

        {/* Article body */}
        <article className="mx-auto max-w-[720px] px-5 py-14 sm:py-18 lg:py-22">
          <p className="body-copy text-charcoal/90">
            Flowers fade. Champagne gets drunk. Gift cards get forgotten.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">Gold is different.</p>
          <p className="body-copy mt-5 text-charcoal/90">
            Across cultures and generations, gold has been given to mark the moments that matter most. Weddings. Births. Graduations. Religious festivals. Anniversaries. New beginnings.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Part of its appeal is practical. Gold is a tangible asset that can be owned and kept for years. But there is something more emotional about giving gold. It says: this moment matters, and I wanted to give you something made to last.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Today, you don&apos;t necessarily need to walk into a jewellery store or buy an entire gold bar to make gold part of a meaningful gift.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">Here is what to know.</p>

          <h2 className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            Why do people give gold?
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            Gold has been used as a gift for thousands of years, often carrying meaning beyond its monetary value.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            In many cultures, it represents prosperity, good fortune, security and continuity between generations. That makes it particularly suited to occasions that mark a transition from one stage of life to another.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            A gold gift can say congratulations, welcome, good luck, thank you or this is something for your future.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Unlike many conventional gifts, physical gold is also something the recipient actually owns.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">That distinction matters.</p>

          <h2 className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            Weddings: a gift for the beginning of something
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            Gold and weddings have a long history together.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Across South Asian, Middle Eastern, Chinese and many other cultures, gold is traditionally given to newlyweds as a symbol of prosperity and security.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            But you don&apos;t need to come from a culture with an established gold-gifting tradition to appreciate the idea.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Instead of another appliance or set of wine glasses, gold can become a tangible reminder of the beginning of a marriage.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            For parents and grandparents, it can also be a way of passing something physical to the next generation.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            The gift doesn&apos;t have to be enormous to be meaningful. The significance can come from the occasion and the intention behind it, rather than simply the dollar amount.
          </p>

          <h2 className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            Festivals and cultural celebrations
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            Gold plays an important role in celebrations around the world.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            During Diwali and Dhanteras, buying and gifting gold has traditionally been associated with prosperity and good fortune.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            At Lunar New Year, gold and gold-coloured gifts are closely connected with ideas of wealth, luck and abundance.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Gold is also commonly given around Eid, births, baptisms, christenings, bar and bat mitzvahs, confirmations and other religious or cultural milestones, depending on family and community traditions.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            For families living away from their country or culture of origin, gifting gold can carry another layer of meaning.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            It can be a way of keeping a tradition alive.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            A grandmother&apos;s gold gift may look different today than it did 40 years ago, but the sentiment behind it can remain remarkably similar.
          </p>

          <h2 className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            Births and birthdays: something they can grow up with
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            Babies receive a lot of things they will outgrow surprisingly quickly.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">Gold isn&apos;t one of them.</p>
          <p className="body-copy mt-5 text-charcoal/90">
            Parents, grandparents, godparents and family friends may choose to give gold to mark a birth, first birthday or other childhood milestone.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Rather than being a toy for today, it becomes something that can be held for the child&apos;s future.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            That can make gold particularly meaningful as a recurring tradition.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Imagine giving a small amount of gold each birthday and, years later, showing them the collection that was built for them over their childhood.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            The individual gifts may have been modest.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Together, they tell a story.
          </p>

          <h2 className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            Graduations and coming of age
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            Graduation gifts often mark independence.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            A young person is finishing school or university, starting work, travelling, moving away from home or simply entering a very different stage of life.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Gold can be a fitting way to recognise that transition.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            It is not about telling someone what gold might be worth in ten or twenty years. Gold prices move and there are no guaranteed outcomes.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            It is about giving them something real that belongs to them.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            That can make the gift feel quite different from cash in an envelope.
          </p>

          <h2 className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            Anniversaries and major milestones
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            Some occasions deserve more than another thing.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            A significant anniversary, retirement, citizenship, major birthday, new business, new home or personal achievement can all be marked with gold.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            You can also attach your own meaning to the amount or timing of the gift.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Gold purchased to mark a 25th anniversary, for example, becomes connected to that particular point in a family&apos;s history.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Over time, its story can become as important as the gold itself.
          </p>

          <h2 className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            Jewellery or bullion: what&apos;s the difference?
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            When people think about gifting gold, they often think first about jewellery.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Jewellery can be beautiful and deeply personal, but it isn&apos;t the only way to give gold.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Gold jewellery combines the value of the metal with craftsmanship, design, branding and retail margins. Its purchase price may therefore be considerably higher than the value of the gold it contains.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Gold bullion, such as bars and coins, is primarily purchased for the gold itself. Its price is generally more closely connected to the underlying gold price, plus applicable premiums and fees.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Neither is inherently a better gift.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            They simply serve different purposes.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            If you want something the recipient can wear, jewellery may make sense.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            If your intention is to give gold primarily as a tangible asset they can own, bullion may be the more direct option.
          </p>

          <h2 className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            Do you need to buy a whole gold bar?
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            Not necessarily.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            One of the traditional barriers to owning physical gold has been the amount required to purchase a full bar or coin.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Fractional ownership can change that.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Instead of purchasing an entire bullion bar, a buyer can own a smaller portion of investment-grade gold. Depending on the provider and product, this can make it possible to start with a much smaller dollar amount.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            For gifting, that opens up some interesting possibilities.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            A family might gift gold every birthday. Friends could contribute towards gold for a wedding. Parents could mark graduations or other achievements without needing to purchase a full bar each time.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            The principle remains simple: the size of the gift doesn&apos;t determine its meaning.
          </p>

          <h2 className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            What should you check before gifting gold online?
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            If you are buying gold through an online platform, understand exactly what you are purchasing before you hand over your money.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Look for clear answers to questions such as:
          </p>
          <ul className="body-copy mt-5 list-disc space-y-2 pl-6 text-charcoal/90">
            <li>Is the recipient receiving ownership of physical gold or exposure to the gold price through another financial product?</li>
            <li>What type and purity of gold is being purchased?</li>
            <li>Where is the gold stored?</li>
            <li>Is it allocated or pooled?</li>
            <li>Is the gold independently audited?</li>
            <li>Is the stored gold insured?</li>
            <li>What fees apply when buying, holding, selling or taking delivery?</li>
            <li>Can the owner sell their gold if they choose?</li>
            <li>Can physical delivery be requested, and under what conditions?</li>
            <li>How does the provider verify the identity of gift recipients and transfer ownership?</li>
          </ul>
          <p className="body-copy mt-5 text-charcoal/90">
            A trustworthy provider should make these details easy to understand.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            If the ownership structure is difficult to explain in plain English, that is worth paying attention to.
          </p>

          <h2 className="font-display mt-12 text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest-deep sm:text-3xl">
            A gift with a story
          </h2>
          <p className="body-copy mt-5 text-charcoal/90">
            The best gifts aren&apos;t necessarily the biggest ones.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            They&apos;re the ones people remember.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Gold has survived as a gifting tradition for generations because it manages to be both practical and symbolic. It is physical, finite and recognisable across borders and cultures.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            But perhaps its greatest strength as a gift is simpler than that.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            You can attach a moment to it.
          </p>
          <blockquote className="mt-6 border-l-4 border-gold bg-cream/60 py-5 pr-6 pl-6">
            <p className="font-display text-xl font-medium italic leading-[1.25] tracking-[-0.01em] text-forest-deep sm:text-2xl">
              This was given to me when I was born.
            </p>
            <p className="font-display mt-4 text-xl font-medium italic leading-[1.25] tracking-[-0.01em] text-forest-deep sm:text-2xl">
              My grandparents gave us this when we got married.
            </p>
            <p className="font-display mt-4 text-xl font-medium italic leading-[1.25] tracking-[-0.01em] text-forest-deep sm:text-2xl">
              I received this when I graduated.
            </p>
            <p className="font-display mt-4 text-xl font-medium italic leading-[1.25] tracking-[-0.01em] text-forest-deep sm:text-2xl">
              My parents gave me a little gold every birthday.
            </p>
          </blockquote>
          <p className="body-copy mt-5 text-charcoal/90">
            Years later, the gold may still be there.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            And so is the story.
          </p>

          <h3 className="font-display mt-12 text-xl font-medium leading-[1.15] tracking-[-0.01em] text-forest-deep sm:text-2xl">
            A more accessible way to give gold
          </h3>
          <p className="body-copy mt-4 text-charcoal/90">
            SQOOT Pure is being built to make physical precious metal ownership simpler and more accessible.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Our aim is to allow everyday buyers to own investment-grade precious metals, including fractional amounts, with clear ownership, transparent fees and secure storage.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Whether you&apos;re buying for yourself or marking a moment for somebody you love, we believe owning precious metals should be easy to understand.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Because some gifts are for today. Others are meant to stay with you.
          </p>
          <p className="body-copy mt-5 text-charcoal/90">
            Join the SQOOT Pure waitlist to be among the first to know when gifting and precious metal ownership become available.
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
                Important: Gold and other precious metals can rise or fall in value. Nothing in this article is financial, investment, tax or legal advice. Before purchasing precious metals, consider your circumstances and make sure you understand the product, ownership structure, fees and risks involved.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
