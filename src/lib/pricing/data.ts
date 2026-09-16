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
  category: string;
  subtitle: string;
  columns: string[];
  rows: TransactionRow[];
};

// Group 1 — PAY TODAY: one-off costs charged at the moment of purchase.
export const PAY_TODAY_TABLE: TransactionCostsTableData = {
  title: "1. Pay today",
  category: "ONE-OFF",
  subtitle: "What you pay at the moment of purchase.",
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
  category: string;
  subtitle: string;
  columns: string[];
  rows: StorageRow[];
};

// Group 2 — ONGOING OWNERSHIP COSTS: charged while metal stays in the vault.
export const ONGOING_TABLE: StorageTableData = {
  title: "2. Ongoing ownership costs",
  category: "ANNUAL",
  subtitle: "Storage costs while your metal remains in the vault, charged pro-rata.",
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
  ],
};

// Group 3 — OPTIONAL SERVICES: only charged if the service is chosen.
export const OPTIONAL_TABLE: StorageTableData = {
  title: "3. Optional services",
  category: "OPTIONAL",
  subtitle: "Costs that only apply if you choose these services.",
  columns: ["Service", "Cost (applies to all products)"],
  rows: [
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
    {
      label: "Selling fee",
      hint: "",
      value: "To confirm (applies to all products)",
      highlight: "",
    },
  ],
};
