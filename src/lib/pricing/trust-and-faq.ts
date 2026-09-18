import { Gift, Globe, Shield, User, type LucideIcon } from "lucide-react";

export type TrustItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const TRUST_ITEMS: TrustItem[] = [
  {
    icon: Shield,
    title: "Insured, segregated storage",
    description: "Held in U.S. vaults at IDS or Vaultify PMC",
  },
  {
    icon: Globe,
    title: "Globally recognised products",
    description: "Coins and bars from trusted mints",
  },
  {
    icon: User,
    title: "Allocated to you",
    description: "Your metal is recorded in your name",
  },
  {
    icon: Gift,
    title: "Optional gifting service",
    description: "Engraving and premium packaging for delivery to friends or family",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What fees do I pay?",
    answer:
      "It depends on what you buy. Coins and bars: no purchase fee and no storage fee — just the product price and insured shipping. Allocated metal: a 3.00% one-off purchase fee, then storage and insurance free for your first 12 months and 0.45% of value per year after that, charged pro-rata for the exact days you hold.",
  },
  {
    question: "How is the purchase price calculated?",
    answer:
      "Weight multiplied by the live spot price at the moment your order is placed, plus a product premium that reflects minting, refining and handling. The premium varies by product and is always shown before you confirm.",
  },
  {
    question: 'What does "allocated metal" mean?',
    answer:
      "When your purchase completes, a specific quantity of metal is allocated to you and recorded in your name in our ledger, which is reconciled to the depository. It is your property, held in custody for you — not a claim on the company, and never lent, pledged or used as collateral.",
  },
  {
    question: "How are storage fees charged?",
    answer:
      "Storage and insurance are free for your first 12 months. After that they are charged pro-rata, for the exact number of days you hold — not a flat annual charge — at 0.45% of value per year, with insurance included. There is no separate insurance charge.",
  },
  {
    question: "What is the minimum storage fee?",
    answer:
      "US$25 per year, applied only if the calculated pro-rata storage fee is lower. On balances above roughly US$3,125 the 0.80% combined rate exceeds the minimum, so the minimum no longer applies.",
  },
  {
    question: "Can I take physical delivery?",
    answer:
      "Yes. You can convert your allocated metal into a coin or bar and have it shipped, insured, at any time. Delivery cost depends on location and weight and is shown before you confirm.",
  },
  {
    question: "Can I gift gold?",
    answer:
      "Yes. Coins and bars can be shipped directly to a recipient with optional engraving and premium gift packaging, shown at checkout. Allocated metal can be transferred as a gift on request.",
  },
  {
    question: "Are there any other fees?",
    answer:
      "No. There is no account fee, no monthly subscription, no inactivity fee and no fee to close your account. The costs on this page are the complete list.",
  },
];
