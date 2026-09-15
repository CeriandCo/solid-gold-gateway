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