export type AurumNoteSource = {
  publisher: string;
  title: string;
  date: string;
  url: string;
};

export type AurumNote = {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  readMinutes: number;
  body: string[];
  pullQuote?: string;
  sources: AurumNoteSource[];
};

const NOTES: AurumNote[] = [
  {
    slug: "spread-on-a-one-ounce-coin",
    title: "Why the spread on a one ounce coin moved this week",
    summary:
      "Dealer premiums widened across three US mints while cast bars stayed flat. Supply, not sentiment.",
    publishedAt: "2026-09-10",
    readMinutes: 3,
    body: [
      "The gap between what a dealer pays for a one ounce sovereign coin and what a buyer pays for the same coin widened this week, while the spread on cast bars of the same weight did not move at all. That split is the useful detail: a change that shows up in one product and not another is usually a supply story rather than a demand story.",
      "Minting capacity is scheduled months in advance. When blank supply tightens or a press goes down for maintenance, the coins already in dealer inventory become the only coins available, and the premium attached to them rises. Cast bars are produced on a different line with different inputs, so they are insulated from the same bottleneck.",
      "None of this describes the metal itself. The spot price of gold is set in a wholesale market that does not care which shape the metal ends up in. The premium is a manufacturing and distribution cost, and it is the part of the retail price most likely to move for reasons that have nothing to do with the commodity.",
      "What this note does not say: it does not say the premium will keep rising, and it does not say a coin is a better or worse thing to own than a bar. Both statements would require a forecast, and AURUM does not make them.",
    ],
    pullQuote:
      "A change that shows up in one product and not another is usually a supply story rather than a demand story.",
    sources: [
      {
        publisher: "US Mint",
        title: "American Eagle production report",
        date: "8 Sep 2026",
        url: "https://www.usmint.gov/about/production-sales-figures",
      },
      {
        publisher: "LBMA",
        title: "Gold price benchmark data",
        date: "9 Sep 2026",
        url: "https://www.lbma.org.uk/prices-and-data/precious-metal-prices",
      },
      {
        publisher: "World Gold Council",
        title: "Gold demand trends, product mix",
        date: "4 Sep 2026",
        url: "https://www.gold.org/goldhub/research/gold-demand-trends",
      },
    ],
  },
  {
    slug: "three-mints-longer-lead-times",
    title: "Three mints reported longer lead times",
    summary:
      "Production schedules slipped at the US Mint, the Royal Canadian Mint and PAMP. Here is what that does to availability.",
    publishedAt: "2026-09-09",
    readMinutes: 2,
    body: [
      "Three refiners and mints published revised delivery schedules in the same week. In each case the change was measured in weeks, not months, and in each case the reason given was scheduled maintenance or blank supply rather than a change in orders.",
      "Longer lead times reach a retail buyer indirectly. Dealers hold inventory; when replacement stock is slower to arrive, they price the inventory they hold more conservatively. That shows up as a higher premium on newly struck product and, occasionally, as a temporary preference for secondary market coins.",
      "Availability is not the same as scarcity. The quantity of refined gold in the world did not change this week. What changed is how quickly a particular finished product can be replaced on a particular shelf.",
    ],
    pullQuote: "Availability is not the same as scarcity.",
    sources: [
      {
        publisher: "US Mint",
        title: "Bullion product schedule update",
        date: "9 Sep 2026",
        url: "https://www.usmint.gov/news",
      },
      {
        publisher: "Royal Canadian Mint",
        title: "Bullion operations statement",
        date: "8 Sep 2026",
        url: "https://www.mint.ca/en/discover/news",
      },
      {
        publisher: "PAMP",
        title: "Refinery delivery notice",
        date: "8 Sep 2026",
        url: "https://www.pamp.com/news",
      },
      {
        publisher: "LBMA",
        title: "Good delivery refiner list",
        date: "1 Sep 2026",
        url: "https://www.lbma.org.uk/good-delivery",
      },
    ],
  },
  {
    slug: "what-a-central-bank-purchase-signals",
    title: "What a central bank purchase actually signals",
    summary:
      "Reserve buying is reported quarterly and with a lag. Reading it as a live signal is a mistake.",
    publishedAt: "2026-09-08",
    readMinutes: 4,
    body: [
      "Central bank gold purchases are reported to the International Monetary Fund and summarised by the World Gold Council on a quarterly basis. By the time a purchase appears in a published table, the transaction itself is usually weeks or months old.",
      "That lag matters for how the number should be read. A headline describing reserve buying as a reaction to this week's news is describing a decision that was taken, settled and recorded before the news happened. The data is real; the timing attached to it in the retelling often is not.",
      "Reserve managers also buy for reasons that have little in common with a household buying a coin. Currency composition, sanctions exposure and treaty obligations all sit behind those decisions and none of them are visible in the headline figure.",
      "The honest summary is narrow: central banks continued to hold and add gold in the last reported quarter. Anything beyond that, in either direction, is interpretation rather than fact.",
    ],
    pullQuote:
      "The data is real; the timing attached to it in the retelling often is not.",
    sources: [
      {
        publisher: "World Gold Council",
        title: "Central bank statistics, Q2 2026",
        date: "31 Jul 2026",
        url: "https://www.gold.org/goldhub/data/monthly-central-bank-statistics",
      },
      {
        publisher: "International Monetary Fund",
        title: "International Financial Statistics, reserve assets",
        date: "28 Aug 2026",
        url: "https://data.imf.org",
      },
    ],
  },
  {
    slug: "why-assay-cards-matter",
    title: "Why an assay card is part of the product",
    summary:
      "A sealed assay card is a chain of custody document, not packaging. Breaking it changes how a bar is resold.",
    publishedAt: "2026-09-05",
    readMinutes: 3,
    body: [
      "A small cast or minted bar usually arrives sealed in a card carrying a serial number, a weight, a fineness and a refiner mark. The card is a record that the bar left the refinery in a known state.",
      "Because the card is a record, removing the bar from it changes what a future buyer has to verify. Many dealers will still buy an unsealed bar, and some will test it at their own cost, but the process is slower and the quoted price often reflects that.",
      "This is a documentation question, not a purity question. A genuine bar is genuine whether or not the plastic is intact. The difference is how cheaply the next person can confirm it.",
    ],
    sources: [
      {
        publisher: "LBMA",
        title: "Responsible sourcing and good delivery rules",
        date: "1 Jul 2026",
        url: "https://www.lbma.org.uk/good-delivery",
      },
      {
        publisher: "PAMP",
        title: "Veriscan authentication overview",
        date: "12 Aug 2026",
        url: "https://www.pamp.com/veriscan",
      },
    ],
  },
  {
    slug: "troy-ounces-and-grams",
    title: "The troy ounce, and why the number on the invoice looks odd",
    summary:
      "A troy ounce is 31.1035 grams, not 28.35. Most confusion about gold weights starts here.",
    publishedAt: "2026-09-04",
    readMinutes: 2,
    body: [
      "Gold is priced per troy ounce, a unit of 31.1034768 grams. The avoirdupois ounce used for groceries is 28.3495 grams. The two share a name and differ by about ten percent, which is enough to make a conversion error look like a pricing error.",
      "Invoices compound this by mixing units: a bar may be sold in grams, priced against a per troy ounce benchmark, and settled in a currency converted on the day. Each step is ordinary, and each step is a place where a figure can be misread.",
      "The practical check is to convert everything into one unit before comparing two quotes. A quote that looks better in grams sometimes is not once the benchmark and the premium are expressed the same way.",
    ],
    pullQuote:
      "Convert everything into one unit before comparing two quotes.",
    sources: [
      {
        publisher: "National Institute of Standards and Technology",
        title: "Handbook 44, units of weight",
        date: "1 Jan 2026",
        url: "https://www.nist.gov/pml/owm/nist-handbook-44",
      },
      {
        publisher: "LBMA",
        title: "Precious metal price methodology",
        date: "1 Jun 2026",
        url: "https://www.lbma.org.uk/prices-and-data",
      },
    ],
  },
  {
    slug: "allocated-and-unallocated",
    title: "Allocated and unallocated storage are different legal arrangements",
    summary:
      "One is specific metal held for you. The other is a claim on a pool. The distinction is contractual.",
    publishedAt: "2026-09-03",
    readMinutes: 4,
    body: [
      "In an allocated arrangement, identified bars or coins are recorded as belonging to one owner and held by a custodian. In an unallocated arrangement, the holder has a claim against the provider for a quantity of metal, and the provider decides how that claim is backed.",
      "The difference is invisible in a price quote and decisive in an insolvency. Allocated metal is normally outside the estate of a failed custodian. An unallocated claim normally is not.",
      "Storage fees usually reflect the distinction, because allocated metal has to be segregated, recorded and audited individually. A lower fee is not automatically a better arrangement; it may be a different arrangement.",
      "Anyone comparing two storage offers should read what the contract says about title and about audit, and should treat those two clauses as the substance of the product.",
    ],
    pullQuote:
      "The difference is invisible in a price quote and decisive in an insolvency.",
    sources: [
      {
        publisher: "LBMA",
        title: "Guide to the London precious metals market",
        date: "1 Mar 2026",
        url: "https://www.lbma.org.uk/publications",
      },
      {
        publisher: "World Gold Council",
        title: "Investment guidance on storage structures",
        date: "18 Jun 2026",
        url: "https://www.gold.org/goldhub/research",
      },
    ],
  },
];

/** A note with no sources never renders. */
export const AURUM_NOTES: AurumNote[] = NOTES.filter((note) => note.sources.length > 0).sort(
  (a, b) => (a.publishedAt < b.publishedAt ? 1 : -1),
);

export const AURUM_NOTE_COUNT = AURUM_NOTES.length;

export function getAurumNote(slug: string): AurumNote | undefined {
  return AURUM_NOTES.find((note) => note.slug === slug);
}

export function formatNoteDate(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00Z`));
}
