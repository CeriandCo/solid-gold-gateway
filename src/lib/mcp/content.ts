// Public marketing content published on the SQOOT Pure landing page.

export const product = {
  name: "SQOOT Pure",
  summary:
    "SQOOT Pure lets you allocate a fraction of real physical gold, starting from $25, with secure U.S. storage, professional custody and insurance.",
  minimumAllocationUsd: 25,
  approxOuncesAtMinimum: 0.0104,
  region: "United States only",
  status: "Launching soon — waitlist open for early access.",
  trustPartners: [
    "Dillon Gage (est. 1976)",
    "IDS — International Depository Services",
    "Lloyd's",
  ],
} as const;

export const fees = [
  { name: "Allocation Fee", amount: "$3 per $100 allocated (3.00%)" },
  { name: "Annual Storage Fee", amount: "0.35% of value" },
  { name: "Insured Storage", amount: "0.45% of value" },
] as const;

export const feesNote =
  "One simple fee. No hidden costs, no surprises. Fees are subject to change; see the full fee schedule in the FAQ.";

export const steps = [
  { title: "Create an account", detail: "Join the waitlist and create your account in under a minute." },
  { title: "Verify your identity", detail: "Complete a secure identity check to protect your account." },
  { title: "Choose an amount", detail: "Start with as little as $25 and allocate at your own pace." },
  { title: "Purchase your gold", detail: "Confirm your order with clear, transparent pricing." },
  { title: "Track your holding", detail: "See your allocated gold and its value from your account." },
] as const;

export const faqs = [
  {
    question: "What is fractional gold?",
    answer:
      "Fractional gold lets you own a precise portion of real physical gold without purchasing a whole bar.",
  },
  {
    question: "Is my gold really allocated to me?",
    answer:
      "Yes. Your purchased gold is allocated to you and recorded as part of your personal holding.",
  },
  {
    question: "How is my gold stored and insured?",
    answer: "Gold is held in secure U.S. vaults with professional custody and insurance.",
  },
  {
    question: "Can I redeem physical gold?",
    answer:
      "Eligible holdings can be redeemed for physical gold, subject to the applicable minimums and fees.",
  },
  {
    question: "How do I buy or sell my gold?",
    answer: "Buy or sell from your account using transparent current pricing.",
  },
  {
    question: "What are the fees?",
    answer:
      "SQOOT Pure uses straightforward allocation and storage fees shown before you confirm a transaction.",
  },
] as const;
