import allocatedImage from "@/assets/pricing/card-allocated.png.asset.json";
import barsImage from "@/assets/pricing/card-bars.png.asset.json";
import coinsImage from "@/assets/pricing/card-coins.png.asset.json";
import { Lock, Shield, Sprout, type LucideIcon } from "lucide-react";

export type HeroChip = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type ProductCard = {
  title: string;
  kicker: string;
  description: string;
  image: string;
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
    title: "Coins",
    kicker: "Own a coin",
    description: "Iconic, globally recognised coins in a range of weights.",
    image: coinsImage.url,
    imageAlt: "Silver Walking Liberty coin overlapping a gold Canada Maple Leaf coin",
    ctaLabel: "View coins",
    ctaHref: "/products/coins",
  },
  {
    title: "Bars",
    kicker: "Own a bar",
    description: "High-purity bars from trusted mints in a range of sizes.",
    image: barsImage.url,
    imageAlt: "PAMP Suisse 1oz gold bar",
    ctaLabel: "View bars",
    ctaHref: "/products/bars",
  },
  {
    title: "Allocated metal",
    kicker: "Start from US$25",
    description: "A flexible way to own gold or silver in secure vault storage.",
    image: allocatedImage.url,
    imageAlt: "Stack of gold and silver coins",
    ctaLabel: "View allocated metal",
    ctaHref: "/products/allocated",
  },
];
export type RowCell =
  | { kind: "dash" }
  | { kind: "highlight"; value: string; suffix?: string };

export type SpanCell = { spanAllProducts: true; value: string; info?: boolean };

export type TransactionRow = {
  label: string;
  hint?: string;
  cells: RowCell[] | SpanCell;
};

export type TransactionCostsTableData = {
  title: string;
  subtitle: string;
  columns: string[];
  rows: TransactionRow[];
};

export const TRANSACTION_COSTS_TABLE: TransactionCostsTableData = {
  title: "1. Transaction costs",
  subtitle: "The costs that apply when you buy or sell gold and silver.",
  columns: ["Cost", "Coins", "Bars", "Allocated metal"],
  rows: [
    {
      label: "Purchase price",
      cells: {
        spanAllProducts: true,
        value: "Based on weight and live spot price, plus a product premium",
        info: true,
      },
    },
    {
      label: "Allocated metal purchase fee",
      hint: "(one-off, at purchase)",
      cells: [
        { kind: "dash" },
        { kind: "dash" },
        { kind: "highlight", value: "3.00%", suffix: "of purchase amount" },
      ],
    },
    {
      label: "Selling fee",
      cells: { spanAllProducts: true, value: "To confirm (applies to all products)" },
    },
  ],
};

export const PURCHASE_PRICE_TOOLTIP =
  "The product premium reflects minting, refining and handling and varies by product. It is always shown before you confirm.";

export type StorageRow = {
  label: string;
  hint?: string;
  value: string;
  highlight?: string;
};

export type StorageTableData = {
  title: string;
  subtitle: string;
  columns: string[];
  rows: StorageRow[];
};

export const STORAGE_TABLE: StorageTableData = {
  title: "2. Storage, delivery & gifting",
  subtitle: "Optional costs depending on what you choose to do with your metal.",
  columns: ["Service", "Cost (applies to all products)"],
  rows: [
    {
      label: "Annual storage fee",
      hint: "(pro-rata)",
      value: "of value per year (charged for the exact number of days)",
      highlight: "0.35%",
    },
    {
      label: "Insured storage fee",
      hint: "(pro-rata)",
      value: "of value per year (charged for the exact number of days)",
      highlight: "0.45%",
    },
    {
      label: "Minimum storage fee",
      hint: "",
      value: "(if calculated fee is lower)",
      highlight: "US$25",
    },
    {
      label: "Physical delivery",
      hint: "(if selected)",
      value: "Insured delivery. Cost varies by location and weight.",
      highlight: "",
    },
    { label: "Engraving", hint: "(gift option)", value: "To confirm", highlight: "" },
    {
      label: "Premium gift packaging",
      hint: "(gift option)",
      value: "To confirm",
      highlight: "",
    },
  ],
};
