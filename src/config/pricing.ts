export type PricingConfig = {
  currency: "USD";
  vault: {
    minimumPurchaseUsd: number;
    purchaseFeeRate: number;
    freeStorageDays: number;
    storageRatePerYear: number;
    storageMinimumPerYearUsd: number;
  };
  delivery: {
    purchaseFeeRate: number;
    storage: "none";
  };
  otherFees: {
    account: number;
    monthly: number;
    inactivity: number;
    closing: number;
  };
  maxBudgetUsd: number;
  sample: {
    spotUsdPerOz: number;
    vaultPremiumRate: number;
    coins: readonly PricingSampleProduct[];
    bars: readonly PricingSampleProduct[];
  };
};

export type PricingSampleProduct = {
  id: string;
  name: string;
  label: string;
  weightOz: number;
  premiumRate: number;
};

export const PRICING = {
  currency: "USD",
  vault: {
    minimumPurchaseUsd: 25,
    purchaseFeeRate: 0.03,
    freeStorageDays: 365,
    storageRatePerYear: 0.0045,
    storageMinimumPerYearUsd: 3,
  },
  delivery: {
    purchaseFeeRate: 0,
    storage: "none",
  },
  otherFees: {
    account: 0,
    monthly: 0,
    inactivity: 0,
    closing: 0,
  },
  maxBudgetUsd: 1_000_000,
  sample: {
    spotUsdPerOz: 3412.8,
    vaultPremiumRate: 0.04,
    coins: [
      {
        id: "maple-1-10",
        name: "Gold Maple Leaf",
        label: "1/10 oz coin",
        weightOz: 0.1,
        premiumRate: 0.07,
      },
    ],
    bars: [
      {
        id: "bar-2-5g",
        name: "Cast gold bar",
        label: "2.5 g bar",
        weightOz: 0.080375,
        premiumRate: 0.08,
      },
    ],
  },
} as const satisfies PricingConfig;