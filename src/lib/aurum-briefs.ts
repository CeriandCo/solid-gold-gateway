import type { AurumEditorial } from "@/lib/aurum-editorial";

export const AURUM_BRIEF_REVIEW_LINE =
  "Drafted with AI assistance from approved sources, and reviewed by a person before publication and before sending.";

const BRIEFS: AurumEditorial[] = [
  {
    slug: "what-a-widening-premium-actually-tells-you",
    title: "What a widening premium actually tells you",
    summary:
      "Three mints reported longer lead times inside six days. Read together, that is a supply story — and here is what it does not tell you.",
    publishedAt: "2026-09-08",
    readMinutes: 6,
    body: [
      "Three large producers published longer lead times inside six days. The notices did not say that gold itself had become scarce. They described pressure at the point where refined metal becomes a finished retail product: blanks, presses, packaging and scheduled production capacity.",
      "That distinction matters because a retail premium is not the spot price. It is the amount paid above the wholesale metal value for fabrication, distribution and dealer inventory. When replacement stock takes longer to arrive, a dealer may widen that premium even while the underlying gold market is broadly unchanged.",
      "The notices also need to be read with restraint. A longer lead time at three producers does not establish a global shortage, and it does not predict where either spot prices or premiums will go next. It describes a temporary constraint in particular product lines at a particular moment.",
      "The useful conclusion is narrower: compare like with like. If sovereign coins widen while cast bars remain steady, the difference points toward product supply rather than a change in the value of the metal. The comparison explains the present spread; it does not forecast the next one.",
    ],
    pullQuote: "A wider retail premium can describe a production bottleneck without saying anything about tomorrow’s gold price.",
    reviewLine: AURUM_BRIEF_REVIEW_LINE,
    sources: [
      { publisher: "US Mint", title: "Bullion product schedule update", date: "8 Sep 2026", url: "https://www.usmint.gov/news" },
      { publisher: "Royal Canadian Mint", title: "Bullion operations statement", date: "7 Sep 2026", url: "https://www.mint.ca/en/discover/news" },
      { publisher: "PAMP", title: "Refinery delivery notice", date: "4 Sep 2026", url: "https://www.pamp.com/news" },
      { publisher: "LBMA", title: "Gold price benchmark data", date: "8 Sep 2026", url: "https://www.lbma.org.uk/prices-and-data/precious-metal-prices" },
      { publisher: "World Gold Council", title: "Gold demand trends, product mix", date: "4 Sep 2026", url: "https://www.gold.org/goldhub/research/gold-demand-trends" },
    ],
  },
  {
    slug: "three-mints-one-supply-story",
    title: "Three mints, one supply story",
    summary:
      "Production notices from the US Mint, the Royal Canadian Mint and PAMP, read together and stripped of the commentary around them.",
    publishedAt: "2026-09-01",
    readMinutes: 7,
    body: [
      "Production notices are operational documents. They describe schedules, maintenance and delivery windows, but they are often retold as evidence about demand or the future price of gold. Reading the original notices side by side produces a more limited picture.",
      "Each producer referred to a constraint in turning refined metal into a specific finished item. Those constraints can affect availability and dealer replacement costs without changing the quantity of refined gold in existence.",
      "The common thread is therefore supply of particular products, not scarcity of gold. That difference is why premiums on two products containing the same weight of metal can move in different directions.",
      "None of the notices offers a timetable for normalisation or a signal about spot prices. The documents support an explanation of current availability, and no more.",
    ],
    pullQuote: "Product availability and metal scarcity are different claims supported by different evidence.",
    reviewLine: AURUM_BRIEF_REVIEW_LINE,
    sources: [
      { publisher: "US Mint", title: "Bullion production and sales figures", date: "31 Aug 2026", url: "https://www.usmint.gov/about/production-sales-figures" },
      { publisher: "Royal Canadian Mint", title: "Bullion operations statement", date: "31 Aug 2026", url: "https://www.mint.ca/en/discover/news" },
      { publisher: "PAMP", title: "Refinery delivery notice", date: "28 Aug 2026", url: "https://www.pamp.com/news" },
      { publisher: "LBMA", title: "Good Delivery current list", date: "1 Sep 2026", url: "https://www.lbma.org.uk/good-delivery" },
      { publisher: "World Gold Council", title: "Gold demand trends", date: "30 Jul 2026", url: "https://www.gold.org/goldhub/research/gold-demand-trends" },
    ],
  },
  {
    slug: "what-central-banks-reported-this-quarter",
    title: "What central banks actually reported this quarter",
    summary:
      "Reserve figures arrive quarterly and with a lag. Here is what was filed, and what the filing does not cover.",
    publishedAt: "2026-08-25",
    readMinutes: 5,
    body: [
      "Official reserve figures describe transactions that have already happened. They are reported on a schedule, revised when necessary and usually published after the period they cover. That lag is part of the data, not a footnote to ignore.",
      "The latest filings show the quantity of gold reported among reserve assets. They do not explain every institution’s motive, disclose every transaction date or connect a purchase to news that happened after the reporting period.",
      "Comparisons are also sensitive to whether a table reports tonnes, fine troy ounces or a currency value. Currency values move with the gold price even when the physical quantity is unchanged, so quantity is the cleaner measure of reserve activity.",
      "The filing supports a historical statement about reported holdings. It is not a live signal, a forecast or a recommendation for a household buyer.",
    ],
    pullQuote: "A quarterly filing is a record of reported holdings, not a live explanation of today’s market.",
    reviewLine: AURUM_BRIEF_REVIEW_LINE,
    sources: [
      { publisher: "International Monetary Fund", title: "International Financial Statistics, reserve assets", date: "21 Aug 2026", url: "https://data.imf.org" },
      { publisher: "World Gold Council", title: "Monthly central bank statistics", date: "20 Aug 2026", url: "https://www.gold.org/goldhub/data/monthly-central-bank-statistics" },
      { publisher: "Bank for International Settlements", title: "International banking and financial statistics", date: "24 Aug 2026", url: "https://www.bis.org/statistics/" },
    ],
  },
];

export const AURUM_BRIEFS = BRIEFS.filter((brief) => brief.sources.length > 0).sort((a, b) =>
  a.publishedAt < b.publishedAt ? 1 : -1,
);

export function getAurumBrief(slug: string): AurumEditorial | undefined {
  return AURUM_BRIEFS.find((brief) => brief.slug === slug);
}