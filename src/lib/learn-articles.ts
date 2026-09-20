import type { AurumEditorial, AurumEditorialSource } from "@/lib/aurum-editorial";

export type LearnArticleBlock =
  | { type: "p" | "h2" | "h3" | "blockquote"; text: string }
  | { type: "ul"; text: string; items: string[] };

export type PublishedLearnArticle = {
  slug: string;
  title: string;
  summary: string;
  ogDescription: string;
  publishedAt: string;
  blocks: LearnArticleBlock[];
  sources: AurumEditorialSource[];
  disclaimer: string;
};

export const PUBLISHED_LEARN_ARTICLES: PublishedLearnArticle[] = [
{
  slug: "physical-gold-vs-gold-etf",
  title: "Physical Gold vs Gold ETF: What You Actually Own",
  summary: "Understand the difference between owning physical gold and holding shares in a gold ETF — and why what you actually own matters.",
  ogDescription: "Physical gold or gold ETF? Learn what each structure means for ownership, custody, and rights.",
  publishedAt: "2026-09-10",
  blocks: [
    {
      type: "p",
      text: "Gold is gold, right?"
    },
    {
      type: "p",
      text: "Not quite."
    },
    {
      type: "p",
      text: "You can buy physical gold. You can buy shares in a gold ETF. Both can give you exposure to the price of gold, but what you actually own is fundamentally different."
    },
    {
      type: "p",
      text: "That distinction matters."
    },
    {
      type: "p",
      text: "If your goal is to understand where your money goes, what sits behind your purchase, and what rights you have once you own it, here is the difference."
    },
    {
      type: "h2",
      text: "Physical gold: you own the metal"
    },
    {
      type: "p",
      text: "When you buy physical gold, you are buying a tangible asset."
    },
    {
      type: "p",
      text: "That might be a gold coin, a small bullion bar, or a fractional interest in a larger physical bar, depending on how the ownership arrangement is structured."
    },
    {
      type: "p",
      text: "The important point is that your ownership relates to actual gold."
    },
    {
      type: "p",
      text: "Physical gold exists independently of a stock exchange. It does not represent shares in a company or units in an investment fund."
    },
    {
      type: "p",
      text: "Depending on how you choose to own it, you may keep your gold yourself or have it held securely on your behalf."
    },
    {
      type: "p",
      text: "With professionally vaulted physical gold, it is important to understand exactly how that gold is held. Is it allocated to owners? Who is the custodian? How is it insured? Is it independently audited? And what rights do you have to sell or take delivery?"
    },
    {
      type: "p",
      text: "These details tell you what \"owning gold\" really means with a particular provider."
    },
    {
      type: "h2",
      text: "A gold ETF: you own shares in a fund"
    },
    {
      type: "p",
      text: "A gold exchange-traded fund, or ETF, works differently."
    },
    {
      type: "p",
      text: "Instead of purchasing gold directly, you purchase shares in a fund that is designed to provide exposure to the price of gold."
    },
    {
      type: "p",
      text: "Many physically backed gold ETFs hold bullion as an underlying asset. Others may use different structures, so it is important to read the fund documentation."
    },
    {
      type: "p",
      text: "Either way, as an everyday ETF holder, what you own is the ETF security, not a gold bar sitting in your name."
    },
    {
      type: "p",
      text: "Your investment is governed by the structure and rules of the fund. You can generally buy and sell your shares through a brokerage account while the relevant market is open."
    },
    {
      type: "p",
      text: "For many people, that convenience is precisely the point."
    },
    {
      type: "p",
      text: "But it is a different form of ownership."
    },
    {
      type: "h2",
      text: "So what is the practical difference?"
    },
    {
      type: "blockquote",
      text: "Think of it this way:Neither structure magically changes what gold is worth.What changes is the relationship between you and the gold."
    },
    {
      type: "h2",
      text: "Why would someone choose a gold ETF?"
    },
    {
      type: "p",
      text: "Gold ETFs can make sense for people who want convenient gold-price exposure inside a traditional investment portfolio."
    },
    {
      type: "p",
      text: "They can usually be bought and sold relatively easily through an existing brokerage account. There is no need to arrange personal storage, shipping or insurance for physical metal."
    },
    {
      type: "p",
      text: "For someone primarily interested in trading gold-price movements or managing investments within a brokerage portfolio, that can be useful."
    },
    {
      type: "p",
      text: "The trade-off is that you are participating through a financial product rather than directly owning physical metal."
    },
    {
      type: "h2",
      text: "Why would someone choose physical gold?"
    },
    {
      type: "p",
      text: "For many physical gold buyers, direct ownership is part of the appeal."
    },
    {
      type: "p",
      text: "There is something fundamentally simple about owning an asset that exists in the physical world."
    },
    {
      type: "p",
      text: "You are not buying a company. You are not buying a promise of future earnings. And you are not buying shares in a fund."
    },
    {
      type: "p",
      text: "You are buying gold."
    },
    {
      type: "p",
      text: "That does not mean physical gold is risk-free. The price can rise and fall, and buying, selling, storing, insuring or delivering physical metal can involve costs."
    },
    {
      type: "p",
      text: "But the underlying proposition is relatively straightforward: your ownership is tied to a real, physical asset."
    },
    {
      type: "h2",
      text: "What about fractional physical gold?"
    },
    {
      type: "p",
      text: "Traditionally, one of the barriers to physical bullion ownership has been the amount required to purchase an entire bar."
    },
    {
      type: "p",
      text: "Fractional ownership changes that."
    },
    {
      type: "p",
      text: "Instead of purchasing a whole large-format bullion bar, multiple buyers can own fractions of physical bullion."
    },
    {
      type: "p",
      text: "Done properly, fractional physical ownership is still very different from buying an ETF. The important questions are not simply, \"Can I start with a smaller amount?\" but:"
    },
    {
      type: "ul",
      text: "What exactly do I own?Where is the gold?How is my ownership recorded?Who holds it?How is it verified?And what happens if I want to sell or take delivery?",
      items: [
        "What exactly do I own?",
        "Where is the gold?",
        "How is my ownership recorded?",
        "Who holds it?",
        "How is it verified?",
        "And what happens if I want to sell or take delivery?"
      ]
    },
    {
      type: "p",
      text: "Those are the questions worth asking of any fractional gold provider."
    },
    {
      type: "h2",
      text: "Ownership first. Product second."
    },
    {
      type: "p",
      text: "The choice between physical gold and a gold ETF does not need to begin with which one is \"better.\""
    },
    {
      type: "p",
      text: "Start with a simpler question:"
    },
    {
      type: "p",
      text: "What do I actually want to own?"
    },
    {
      type: "p",
      text: "If you want financial exposure to gold within a brokerage portfolio, an ETF may suit that purpose."
    },
    {
      type: "p",
      text: "If you want your ownership connected to physical gold itself, then physical bullion, whether purchased outright or through an appropriately structured fractional ownership model, is a fundamentally different proposition."
    },
    {
      type: "p",
      text: "Understanding that distinction is the first step."
    },
    {
      type: "p",
      text: "Because two products can follow the same gold price while giving you two very different things to own."
    },
    {
      type: "h3",
      text: "Explore physical gold ownership with SQOOT Pure"
    },
    {
      type: "p",
      text: "SQOOT Pure is being built to make physical precious metal ownership more accessible, transparent and easier to understand."
    },
    {
      type: "p",
      text: "Learn how fractional physical gold works, how bullion is held and verified, and what ownership means before you buy."
    }
  ],
  sources: [],
  disclaimer: "Important information: This content is provided for general educational purposes only and does not constitute financial, investment, legal or tax advice. Gold prices can rise or fall, and you may receive less than you paid. Product structures, fees, custody arrangements and redemption rights vary. Always review the relevant terms and disclosures before making a financial decision."
},
{
  slug: "how-to-buy-gold-safely",
  title: "How to Buy Physical Gold Online Safely",
  summary: "A practical guide to buying physical gold online safely: what to check, who to trust, how pricing works, and how to verify storage and ownership.",
  ogDescription: "What to check before buying gold online, from product structure and pricing to storage, insurance, audits, and exit options.",
  publishedAt: "2026-09-10",
  blocks: [
    {
      type: "p",
      text: "Buying physical gold online can feel surprisingly simple."
    },
    {
      type: "p",
      text: "Choose a product. Enter your details. Pay. Your gold is either delivered to you or stored on your behalf."
    },
    {
      type: "p",
      text: "But the simplicity of the checkout can hide an important fact: not every way of buying gold online gives you the same thing."
    },
    {
      type: "p",
      text: "Before you buy, it is worth understanding who you are buying from, what you are actually buying, how the price is calculated and what happens to your gold after you pay."
    },
    {
      type: "p",
      text: "Here is what to check."
    },
    {
      type: "h2",
      text: "1. Start with what you are actually buying"
    },
    {
      type: "p",
      text: "\"Buying gold\" can mean several different things."
    },
    {
      type: "p",
      text: "You might be buying:"
    },
    {
      type: "ul",
      text: "a physical gold bar or coin that will be delivered to youphysical gold that is stored in a vault on your behalffractional ownership of a larger physical gold bara financial product designed to track the price of gold",
      items: [
        "a physical gold bar or coin that will be delivered to you",
        "physical gold that is stored in a vault on your behalf",
        "fractional ownership of a larger physical gold bar",
        "a financial product designed to track the price of gold"
      ]
    },
    {
      type: "p",
      text: "These are not interchangeable."
    },
    {
      type: "p",
      text: "If your intention is to own physical gold, look for clear information confirming that actual physical metal sits behind your purchase and explaining your ownership rights."
    },
    {
      type: "p",
      text: "For stored or fractional gold, ask an additional question:"
    },
    {
      type: "blockquote",
      text: "Is specific physical gold allocated to customers, or is my purchase simply represented as a balance on an account?"
    },
    {
      type: "p",
      text: "The answer matters."
    },
    {
      type: "h2",
      text: "2. Know who you are buying from"
    },
    {
      type: "p",
      text: "A polished website is not proof that a gold dealer is legitimate."
    },
    {
      type: "p",
      text: "Before transferring money, look beyond the homepage."
    },
    {
      type: "p",
      text: "A credible provider should make it reasonably easy to establish who operates the business, where it is based, how to contact it and what terms apply to your purchase."
    },
    {
      type: "p",
      text: "The U.S. Commodity Futures Trading Commission recommends checking an online dealer's physical address, how long it has operated and whether its owners or salespeople have been associated with complaints or allegations of misconduct."
    },
    {
      type: "p",
      text: "Be particularly cautious if you encounter a seller through an unsolicited phone call, email, social media message or high-pressure sales pitch. Regulators specifically identify these tactics as warning signs associated with precious metals scams."
    },
    {
      type: "p",
      text: "Good gold doesn't need a countdown timer."
    },
    {
      type: "h2",
      text: "3. Check where the gold comes from"
    },
    {
      type: "p",
      text: "Not all gold bars are produced to the same standards."
    },
    {
      type: "p",
      text: "One useful reference point is the London Bullion Market Association (LBMA) Good Delivery system."
    },
    {
      type: "p",
      text: "The LBMA maintains a list of accredited refiners whose gold bars meet its standards around areas including purity, weight, physical appearance and responsible sourcing. Refiners also undergo checks relating to their history, financial standing and production capabilities."
    },
    {
      type: "p",
      text: "That does not mean every retail gold product itself is an \"LBMA Good Delivery bar.\" The formal Good Delivery standard applies to the large bars used in the wholesale London market."
    },
    {
      type: "p",
      text: "But knowing that your gold comes from a recognised refiner can give you another piece of information when assessing its provenance and quality."
    },
    {
      type: "p",
      text: "Check the LBMA Good Delivery List: https://www.lbma.org.uk/good-delivery/gold-current-list"
    },
    {
      type: "h2",
      text: "4. Understand the price before you click buy"
    },
    {
      type: "p",
      text: "Gold has a market price, but that isn't necessarily the price you will pay."
    },
    {
      type: "p",
      text: "Physical gold typically involves costs above the underlying metal value. Depending on the provider and product, these may include premiums, transaction fees, shipping, insurance or storage."
    },
    {
      type: "p",
      text: "Before purchasing, look for a clear breakdown of:"
    },
    {
      type: "p",
      text: "Gold value + premium or transaction fee + delivery/storage costs = your actual purchase price"
    },
    {
      type: "p",
      text: "Also look at the other side of the transaction."
    },
    {
      type: "p",
      text: "If you later want to sell, how is the sale price determined? Does the provider offer a buyback service? Are there additional fees?"
    },
    {
      type: "p",
      text: "A provider should make these costs understandable before you commit."
    },
    {
      type: "p",
      text: "Be wary of anyone who makes the purchase sound urgent while making the pricing difficult to understand. The FTC warns that precious metals scams commonly use urgency to push people into acting quickly."
    },
    {
      type: "h2",
      text: "5. Decide where your gold will live"
    },
    {
      type: "p",
      text: "If you buy physical gold online, there are generally two paths: take delivery or use professional storage."
    },
    {
      type: "h3",
      text: "Taking delivery"
    },
    {
      type: "p",
      text: "Having the gold delivered gives you direct possession."
    },
    {
      type: "p",
      text: "Before choosing this option, check:"
    },
    {
      type: "ul",
      text: "whether the shipment is insuredwhether tracking is providedwhether a signature is requiredwhen responsibility for the gold transfers to youwhether packaging is discreetwhat happens if the package is lost or damaged",
      items: [
        "whether the shipment is insured",
        "whether tracking is provided",
        "whether a signature is required",
        "when responsibility for the gold transfers to you",
        "whether packaging is discreet",
        "what happens if the package is lost or damaged"
      ]
    },
    {
      type: "p",
      text: "Once it arrives, secure storage becomes your responsibility."
    },
    {
      type: "h3",
      text: "Professional vault storage"
    },
    {
      type: "p",
      text: "Vaulting can remove the need to keep valuable metal at home, but it creates a different set of questions."
    },
    {
      type: "p",
      text: "Find out:"
    },
    {
      type: "ul",
      text: "who operates the vaultwhere the gold is storedwhether your gold is allocatedwhether customer gold is kept separate from company assetswhat insurance applieswhether holdings are independently auditedwhether you can request physical deliverywhat happens to your gold if the provider stops operating",
      items: [
        "who operates the vault",
        "where the gold is stored",
        "whether your gold is allocated",
        "whether customer gold is kept separate from company assets",
        "what insurance applies",
        "whether holdings are independently audited",
        "whether you can request physical delivery",
        "what happens to your gold if the provider stops operating"
      ]
    },
    {
      type: "p",
      text: "Don't settle for a picture of a very impressive vault door. Look for the details behind it."
    },
    {
      type: "h2",
      text: "6. Look for evidence, not just trust badges"
    },
    {
      type: "p",
      text: "Gold businesses naturally talk about security and trust."
    },
    {
      type: "p",
      text: "What matters is what sits behind those claims."
    },
    {
      type: "p",
      text: "If a company says its gold is independently audited, look for information about who conducts the audit and how frequently it happens."
    },
    {
      type: "p",
      text: "If it says the gold is insured, understand who provides the coverage and what it covers."
    },
    {
      type: "p",
      text: "If it references regulatory registrations or industry memberships, check what those registrations actually mean rather than assuming they guarantee your purchase."
    },
    {
      type: "p",
      text: "And if a provider makes claims about the refinery that produced its gold, you can independently check recognised sources such as the LBMA Good Delivery List."
    },
    {
      type: "p",
      text: "Trust is stronger when you can verify it."
    },
    {
      type: "h2",
      text: "7. Be suspicious of pressure"
    },
    {
      type: "p",
      text: "Gold has a long history, but unfortunately so do gold scams."
    },
    {
      type: "p",
      text: "Some warning signs are fairly straightforward:"
    },
    {
      type: "ul",
      text: "promises of guaranteed returnsclaims that gold cannot fall in valueaggressive salespeoplepressure to buy immediatelyunusually large discountsunclear or complicated feesrequests to send money to an individualsellers approaching you unsolicited through social mediareluctance to explain where the gold comes from or where it will be stored",
      items: [
        "promises of guaranteed returns",
        "claims that gold cannot fall in value",
        "aggressive salespeople",
        "pressure to buy immediately",
        "unusually large discounts",
        "unclear or complicated fees",
        "requests to send money to an individual",
        "sellers approaching you unsolicited through social media",
        "reluctance to explain where the gold comes from or where it will be stored"
      ]
    },
    {
      type: "p",
      text: "The CFTC specifically advises consumers not to respond to unsolicited precious-metals offers or buy from individuals selling metals through social media and discussion boards."
    },
    {
      type: "p",
      text: "A legitimate purchase should give you enough information and enough time to make your own decision."
    },
    {
      type: "h2",
      text: "8. Understand how you get your gold back out"
    },
    {
      type: "p",
      text: "This is particularly important when buying stored or fractional gold."
    },
    {
      type: "p",
      text: "Buying is only half the process."
    },
    {
      type: "p",
      text: "Before you purchase, understand what happens when you eventually want to sell it, withdraw it or take physical delivery."
    },
    {
      type: "p",
      text: "For fractional ownership, check whether there is a minimum amount required before physical delivery becomes available."
    },
    {
      type: "p",
      text: "For vaulted gold, check withdrawal fees and delivery requirements."
    },
    {
      type: "p",
      text: "For physical bars and coins already in your possession, understand how the provider's buyback process works, if one is offered."
    },
    {
      type: "p",
      text: "A good buying experience should have a clear exit route."
    },
    {
      type: "h2",
      text: "A simple checklist before buying gold online"
    },
    {
      type: "p",
      text: "Before making a purchase, you should be able to answer these questions:"
    },
    {
      type: "ul",
      text: "What exactly am I buying? Physical gold, fractional physical gold or something that simply tracks its price?Who am I buying it from? Can I verify the company behind the website?Who produced the gold? Is the refinery identifiable and reputable?What am I paying? Are premiums, fees, shipping and storage clearly disclosed?Who owns the gold? If it is stored, are my ownership rights clearly explained?Where is it kept? Can I identify the vault or storage arrangement?Is it insured and independently verified? Can I find evidence supporting those claims?Can I take delivery? If so, how and at what cost?Can I sell it again? What does the process cost and how is the price determined?",
      items: [
        "What exactly am I buying? Physical gold, fractional physical gold or something that simply tracks its price?",
        "Who am I buying it from? Can I verify the company behind the website?",
        "Who produced the gold? Is the refinery identifiable and reputable?",
        "What am I paying? Are premiums, fees, shipping and storage clearly disclosed?",
        "Who owns the gold? If it is stored, are my ownership rights clearly explained?",
        "Where is it kept? Can I identify the vault or storage arrangement?",
        "Is it insured and independently verified? Can I find evidence supporting those claims?",
        "Can I take delivery? If so, how and at what cost?",
        "Can I sell it again? What does the process cost and how is the price determined?"
      ]
    },
    {
      type: "p",
      text: "If a provider makes those questions difficult to answer, that is useful information in itself."
    },
    {
      type: "h2",
      text: "Buying gold online shouldn't require blind trust"
    },
    {
      type: "p",
      text: "The internet has made physical gold considerably easier to access."
    },
    {
      type: "p",
      text: "That convenience is valuable, but it shouldn't come at the expense of understanding what you own."
    },
    {
      type: "p",
      text: "Take the time to verify the provider. Understand the product. Check where the gold comes from. Read the fees. Know how it is stored or delivered. And make sure you understand how you can sell or withdraw it later."
    },
    {
      type: "p",
      text: "The safest gold purchase isn't necessarily the one with the slickest website or the loudest promise."
    },
    {
      type: "p",
      text: "It's the one you can understand and verify."
    },
    {
      type: "h3",
      text: "A different way to own physical gold"
    },
    {
      type: "p",
      text: "SQOOT Pure is being built around a simple idea: make physical precious metal ownership easier to understand and more accessible."
    },
    {
      type: "p",
      text: "We believe you should know what you own, how much you're paying and what happens to your metal after you buy it."
    },
    {
      type: "p",
      text: "Join the SQOOT Pure waitlist to be among the first to know when we launch."
    }
  ],
  sources: [
    {
      publisher: "London Bullion Market Association",
      title: "Good Delivery Current List — Gold",
      url: "https://www.lbma.org.uk/good-delivery/gold-current-list"
    }
  ],
  disclaimer: "Important: This content is provided for general educational purposes only and does not constitute financial, investment, legal or tax advice. Gold prices can rise or fall, and you should consider your own circumstances before making a purchase."
},
{
  slug: "gifting-gold-guide",
  title: "Gifting Gold: A Guide for Weddings, Festivals, and Milestones",
  summary: "A guide to gifting gold for weddings, festivals, births, graduations and milestones — and what to know before you buy.",
  ogDescription: "Why gold has been given across cultures for generations, and how to make it part of a meaningful gift today.",
  publishedAt: "2026-09-10",
  blocks: [
    {
      type: "p",
      text: "Flowers fade. Champagne gets drunk. Gift cards get forgotten."
    },
    {
      type: "p",
      text: "Gold is different."
    },
    {
      type: "p",
      text: "Across cultures and generations, gold has been given to mark the moments that matter most. Weddings. Births. Graduations. Religious festivals. Anniversaries. New beginnings."
    },
    {
      type: "p",
      text: "Part of its appeal is practical. Gold is a tangible asset that can be owned and kept for years. But there is something more emotional about giving gold. It says: this moment matters, and I wanted to give you something made to last."
    },
    {
      type: "p",
      text: "Today, you don't necessarily need to walk into a jewellery store or buy an entire gold bar to make gold part of a meaningful gift."
    },
    {
      type: "p",
      text: "Here is what to know."
    },
    {
      type: "h2",
      text: "Why do people give gold?"
    },
    {
      type: "p",
      text: "Gold has been used as a gift for thousands of years, often carrying meaning beyond its monetary value."
    },
    {
      type: "p",
      text: "In many cultures, it represents prosperity, good fortune, security and continuity between generations. That makes it particularly suited to occasions that mark a transition from one stage of life to another."
    },
    {
      type: "p",
      text: "A gold gift can say congratulations, welcome, good luck, thank you or this is something for your future."
    },
    {
      type: "p",
      text: "Unlike many conventional gifts, physical gold is also something the recipient actually owns."
    },
    {
      type: "p",
      text: "That distinction matters."
    },
    {
      type: "h2",
      text: "Weddings: a gift for the beginning of something"
    },
    {
      type: "p",
      text: "Gold and weddings have a long history together."
    },
    {
      type: "p",
      text: "Across South Asian, Middle Eastern, Chinese and many other cultures, gold is traditionally given to newlyweds as a symbol of prosperity and security."
    },
    {
      type: "p",
      text: "But you don't need to come from a culture with an established gold-gifting tradition to appreciate the idea."
    },
    {
      type: "p",
      text: "Instead of another appliance or set of wine glasses, gold can become a tangible reminder of the beginning of a marriage."
    },
    {
      type: "p",
      text: "For parents and grandparents, it can also be a way of passing something physical to the next generation."
    },
    {
      type: "p",
      text: "The gift doesn't have to be enormous to be meaningful. The significance can come from the occasion and the intention behind it, rather than simply the dollar amount."
    },
    {
      type: "h2",
      text: "Festivals and cultural celebrations"
    },
    {
      type: "p",
      text: "Gold plays an important role in celebrations around the world."
    },
    {
      type: "p",
      text: "During Diwali and Dhanteras, buying and gifting gold has traditionally been associated with prosperity and good fortune."
    },
    {
      type: "p",
      text: "At Lunar New Year, gold and gold-coloured gifts are closely connected with ideas of wealth, luck and abundance."
    },
    {
      type: "p",
      text: "Gold is also commonly given around Eid, births, baptisms, christenings, bar and bat mitzvahs, confirmations and other religious or cultural milestones, depending on family and community traditions."
    },
    {
      type: "p",
      text: "For families living away from their country or culture of origin, gifting gold can carry another layer of meaning."
    },
    {
      type: "p",
      text: "It can be a way of keeping a tradition alive."
    },
    {
      type: "p",
      text: "A grandmother's gold gift may look different today than it did 40 years ago, but the sentiment behind it can remain remarkably similar."
    },
    {
      type: "h2",
      text: "Births and birthdays: something they can grow up with"
    },
    {
      type: "p",
      text: "Babies receive a lot of things they will outgrow surprisingly quickly."
    },
    {
      type: "p",
      text: "Gold isn't one of them."
    },
    {
      type: "p",
      text: "Parents, grandparents, godparents and family friends may choose to give gold to mark a birth, first birthday or other childhood milestone."
    },
    {
      type: "p",
      text: "Rather than being a toy for today, it becomes something that can be held for the child's future."
    },
    {
      type: "p",
      text: "That can make gold particularly meaningful as a recurring tradition."
    },
    {
      type: "p",
      text: "Imagine giving a small amount of gold each birthday and, years later, showing them the collection that was built for them over their childhood."
    },
    {
      type: "p",
      text: "The individual gifts may have been modest."
    },
    {
      type: "p",
      text: "Together, they tell a story."
    },
    {
      type: "h2",
      text: "Graduations and coming of age"
    },
    {
      type: "p",
      text: "Graduation gifts often mark independence."
    },
    {
      type: "p",
      text: "A young person is finishing school or university, starting work, travelling, moving away from home or simply entering a very different stage of life."
    },
    {
      type: "p",
      text: "Gold can be a fitting way to recognise that transition."
    },
    {
      type: "p",
      text: "It is not about telling someone what gold might be worth in ten or twenty years. Gold prices move and there are no guaranteed outcomes."
    },
    {
      type: "p",
      text: "It is about giving them something real that belongs to them."
    },
    {
      type: "p",
      text: "That can make the gift feel quite different from cash in an envelope."
    },
    {
      type: "h2",
      text: "Anniversaries and major milestones"
    },
    {
      type: "p",
      text: "Some occasions deserve more than another thing."
    },
    {
      type: "p",
      text: "A significant anniversary, retirement, citizenship, major birthday, new business, new home or personal achievement can all be marked with gold."
    },
    {
      type: "p",
      text: "You can also attach your own meaning to the amount or timing of the gift."
    },
    {
      type: "p",
      text: "Gold purchased to mark a 25th anniversary, for example, becomes connected to that particular point in a family's history."
    },
    {
      type: "p",
      text: "Over time, its story can become as important as the gold itself."
    },
    {
      type: "h2",
      text: "Jewellery or bullion: what's the difference?"
    },
    {
      type: "p",
      text: "When people think about gifting gold, they often think first about jewellery."
    },
    {
      type: "p",
      text: "Jewellery can be beautiful and deeply personal, but it isn't the only way to give gold."
    },
    {
      type: "p",
      text: "Gold jewellery combines the value of the metal with craftsmanship, design, branding and retail margins. Its purchase price may therefore be considerably higher than the value of the gold it contains."
    },
    {
      type: "p",
      text: "Gold bullion, such as bars and coins, is primarily purchased for the gold itself. Its price is generally more closely connected to the underlying gold price, plus applicable premiums and fees."
    },
    {
      type: "p",
      text: "Neither is inherently a better gift."
    },
    {
      type: "p",
      text: "They simply serve different purposes."
    },
    {
      type: "p",
      text: "If you want something the recipient can wear, jewellery may make sense."
    },
    {
      type: "p",
      text: "If your intention is to give gold primarily as a tangible asset they can own, bullion may be the more direct option."
    },
    {
      type: "h2",
      text: "Do you need to buy a whole gold bar?"
    },
    {
      type: "p",
      text: "Not necessarily."
    },
    {
      type: "p",
      text: "One of the traditional barriers to owning physical gold has been the amount required to purchase a full bar or coin."
    },
    {
      type: "p",
      text: "Fractional ownership can change that."
    },
    {
      type: "p",
      text: "Instead of purchasing an entire bullion bar, a buyer can own a smaller portion of investment-grade gold. Depending on the provider and product, this can make it possible to start with a much smaller dollar amount."
    },
    {
      type: "p",
      text: "For gifting, that opens up some interesting possibilities."
    },
    {
      type: "p",
      text: "A family might gift gold every birthday. Friends could contribute towards gold for a wedding. Parents could mark graduations or other achievements without needing to purchase a full bar each time."
    },
    {
      type: "p",
      text: "The principle remains simple: the size of the gift doesn't determine its meaning."
    },
    {
      type: "h2",
      text: "What should you check before gifting gold online?"
    },
    {
      type: "p",
      text: "If you are buying gold through an online platform, understand exactly what you are purchasing before you hand over your money."
    },
    {
      type: "p",
      text: "Look for clear answers to questions such as:"
    },
    {
      type: "ul",
      text: "Is the recipient receiving ownership of physical gold or exposure to the gold price through another financial product?What type and purity of gold is being purchased?Where is the gold stored?Is it allocated or pooled?Is the gold independently audited?Is the stored gold insured?What fees apply when buying, holding, selling or taking delivery?Can the owner sell their gold if they choose?Can physical delivery be requested, and under what conditions?How does the provider verify the identity of gift recipients and transfer ownership?",
      items: [
        "Is the recipient receiving ownership of physical gold or exposure to the gold price through another financial product?",
        "What type and purity of gold is being purchased?",
        "Where is the gold stored?",
        "Is it allocated or pooled?",
        "Is the gold independently audited?",
        "Is the stored gold insured?",
        "What fees apply when buying, holding, selling or taking delivery?",
        "Can the owner sell their gold if they choose?",
        "Can physical delivery be requested, and under what conditions?",
        "How does the provider verify the identity of gift recipients and transfer ownership?"
      ]
    },
    {
      type: "p",
      text: "A trustworthy provider should make these details easy to understand."
    },
    {
      type: "p",
      text: "If the ownership structure is difficult to explain in plain English, that is worth paying attention to."
    },
    {
      type: "h2",
      text: "A gift with a story"
    },
    {
      type: "p",
      text: "The best gifts aren't necessarily the biggest ones."
    },
    {
      type: "p",
      text: "They're the ones people remember."
    },
    {
      type: "p",
      text: "Gold has survived as a gifting tradition for generations because it manages to be both practical and symbolic. It is physical, finite and recognisable across borders and cultures."
    },
    {
      type: "p",
      text: "But perhaps its greatest strength as a gift is simpler than that."
    },
    {
      type: "p",
      text: "You can attach a moment to it."
    },
    {
      type: "blockquote",
      text: "This was given to me when I was born.My grandparents gave us this when we got married.I received this when I graduated.My parents gave me a little gold every birthday."
    },
    {
      type: "p",
      text: "Years later, the gold may still be there."
    },
    {
      type: "p",
      text: "And so is the story."
    },
    {
      type: "h3",
      text: "A more accessible way to give gold"
    },
    {
      type: "p",
      text: "SQOOT Pure is being built to make physical precious metal ownership simpler and more accessible."
    },
    {
      type: "p",
      text: "Our aim is to allow everyday buyers to own investment-grade precious metals, including fractional amounts, with clear ownership, transparent fees and secure storage."
    },
    {
      type: "p",
      text: "Whether you're buying for yourself or marking a moment for somebody you love, we believe owning precious metals should be easy to understand."
    },
    {
      type: "p",
      text: "Because some gifts are for today. Others are meant to stay with you."
    },
    {
      type: "p",
      text: "Join the SQOOT Pure waitlist to be among the first to know when gifting and precious metal ownership become available."
    }
  ],
  sources: [],
  disclaimer: "Important: Gold and other precious metals can rise or fall in value. Nothing in this article is financial, investment, tax or legal advice. Before purchasing precious metals, consider your circumstances and make sure you understand the product, ownership structure, fees and risks involved."
},
];

export function learnArticleToEditorial(article: PublishedLearnArticle): AurumEditorial {
  const body = article.blocks.flatMap((block) => block.type === "ul" ? block.items : [block.text]);
  const words = body.join(" ").trim().split(/\s+/).filter(Boolean).length;
  return {
    slug: article.slug,
    title: article.title,
    summary: article.summary,
    publishedAt: article.publishedAt,
    readMinutes: Math.max(1, Math.ceil(words / 200)),
    body,
    blocks: article.blocks,
    sources: article.sources,
  };
}

export function getPublishedLearnArticles(): AurumEditorial[] {
  return PUBLISHED_LEARN_ARTICLES.map(learnArticleToEditorial);
}

export function getPublishedLearnArticle(slug: string): AurumEditorial | null {
  const article = PUBLISHED_LEARN_ARTICLES.find((candidate) => candidate.slug === slug);
  return article ? learnArticleToEditorial(article) : null;
}
