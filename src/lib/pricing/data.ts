import allocatedImage from "@/assets/pricing/card-allocated.png.asset.json";
import allocatedWebp from "@/assets/pricing/card-allocated.webp.asset.json";
import allocatedWebp2x from "@/assets/pricing/card-allocated-2x.webp.asset.json";
import barsImage from "@/assets/pricing/card-bars.png.asset.json";
import barsWebp from "@/assets/pricing/card-bars.webp.asset.json";
import barsWebp2x from "@/assets/pricing/card-bars-2x.webp.asset.json";
import coinsImage from "@/assets/pricing/card-coins.png.asset.json";
import coinsWebp from "@/assets/pricing/card-coins.webp.asset.json";
import coinsWebp2x from "@/assets/pricing/card-coins-2x.webp.asset.json";
import { Lock, Shield, Sprout, type LucideIcon } from "lucide-react";

export type HeroChip = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type ProductCard = {
  id: "coins" | "bars" | "allocated";
  title: string;
  kicker: string;
  description: string;
  image: string;
  imageWebp: string;
  imageWebp2x: string;
  imageAlt: string;
  ctaLabel: string;
  ctaHref: string;
};

export const HERO_CHIPS: HeroChip[] = [
  { icon: Shield, title: "Transparent costs", description: "All costs shown upfront" },
  { icon: Lock, title: "Secure storage", description: "Held in insured, segregated vaults" },
  { icon: Sprout, title: "Flexible options", description: "Buy, store, gift or take delivery" },
];

export const PRODUCT_CARDS: ProductCard[] = [
  {
    id: "coins",
    title: "Coins",
    kicker: "Own a coin",
    description: "Iconic, globally recognised coins in a range of weights.",
    image: coinsImage.url,
    imageWebp: coinsWebp.url,
    imageWebp2x: coinsWebp2x.url,
    imageAlt: "Gold Canada Maple Leaf coin",
    ctaLabel: "View coins",
    ctaHref: "/products/coins",
  },
  {
    id: "bars",
    title: "Bars",
    kicker: "Own a bar",
    description: "High-purity bars from trusted mints in a range of sizes.",
    image: barsImage.url,
    imageWebp: barsWebp.url,
    imageWebp2x: barsWebp2x.url,
    imageAlt: "PAMP Suisse 1oz gold bar",
    ctaLabel: "View bars",
    ctaHref: "/products/bars",
  },
  {
    id: "allocated",
    title: "Allocated metal",
    kicker: "Start from US$25",
    description: "A flexible way to own gold in secure vault storage.",
    image: allocatedImage.url,
    imageWebp: allocatedWebp.url,
    imageWebp2x: allocatedWebp2x.url,
    imageAlt: "Stack of gold coins",
    ctaLabel: "View allocated metal",
    ctaHref: "/products/allocated",
  },
];
export const PURCHASE_PRICE_TOOLTIP =
  "The product premium reflects minting, refining and handling and varies by product. It is always shown before you confirm.";

// Contextual per-product pricing. Each product owns its full fee list so the
// Pricing page renders exactly one table for the selected product — never a
// three-way comparison. Update figures here; the page reads this data only.
export type PricingFeeRow = {
  label: string;
  /** Supporting note under the cost label. */
  note?: string;
  /** Bold figure in the Amount column; omit for descriptive rows. */
  amount?: string;
  /** Secondary note under the amount. */
  amountNote?: string;
  /** Muted descriptive sentence in the Amount column (no figure). */
  description?: string;
  /** Small badge beside the amount, e.g. "FREE". */
  badge?: string;
};

export type ProductPricing = {
  id: ProductCard["id"];
  heading: string;
  copy: string;
  columns: [string, string];
  rows: PricingFeeRow[];
};

const PURCHASE_PRICE_ROW: PricingFeeRow = {
  label: "Purchase price",
  description: "Weight × live spot price, plus product premium",
};

const COST_AMOUNT_COLUMNS: [string, string] = ["Cost", "Amount"];

export const PRODUCT_PRICING: ProductPricing[] = [
  {
    id: "allocated",
    heading: "Allocated metal — stored in the vault",
    copy: "Own from US$25. Allocated to you, insured and segregated.",
    columns: COST_AMOUNT_COLUMNS,
    rows: [
      PURCHASE_PRICE_ROW,
      {
        label: "Purchase fee",
        note: "One-off, at the time you buy",
        amount: "3.00%",
        amountNote: "of purchase amount",
      },
      {
        label: "Storage & insurance — year 1",
        note: "From your first purchase",
        amount: "US$0.00",
        badge: "FREE",
      },
      {
        label: "Storage & insurance — after year 1",
        note: "Charged pro-rata for the exact number of days held",
        amount: "0.45%",
        amountNote:
          "of value per year — insurance included, there is no separate insurance charge",
      },
      {
        label: "Minimum storage fee",
        note: "Applies only after your first 12 months",
        amount: "US$3.00",
        amountNote: "per year",
      },
      {
        label: "Selling",
        description: "Your sale price is shown in full before you confirm.",
      },
      {
        label: "Taking delivery later",
        description: "Insured delivery — cost varies by location and weight.",
      },
    ],
  },
  {
    id: "coins",
    heading: "Coins — delivered to you",
    copy: "Whole coins from trusted mints, shipped insured.",
    columns: COST_AMOUNT_COLUMNS,
    rows: [
      PURCHASE_PRICE_ROW,
      { label: "Purchase fee", amount: "None" },
      { label: "Storage & insurance", amount: "None — you hold it" },
      { label: "Minimum storage fee", amount: "None" },
      {
        label: "Insured delivery",
        description: "Varies by location and weight, shown before you pay.",
      },
      {
        label: "Engraving",
        note: "Optional gift service",
        amount: "Shown at checkout",
      },
      {
        label: "Premium gift packaging",
        note: "Optional gift service",
        amount: "Shown at checkout",
      },
    ],
  },
  {
    id: "bars",
    heading: "Bars — delivered to you",
    copy: "High-purity bars from trusted mints, shipped insured.",
    columns: COST_AMOUNT_COLUMNS,
    rows: [
      PURCHASE_PRICE_ROW,
      { label: "Purchase fee", amount: "None" },
      { label: "Storage & insurance", amount: "None — you hold it" },
      { label: "Minimum storage fee", amount: "None" },
      {
        label: "Insured delivery",
        description: "Varies by location and weight, shown before you pay.",
      },
      {
        label: "Engraving",
        note: "Optional gift service",
        amount: "Shown at checkout",
      },
      {
        label: "Premium gift packaging",
        note: "Optional gift service",
        amount: "Shown at checkout",
      },
    ],
  },
];

