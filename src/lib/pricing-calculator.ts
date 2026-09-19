import { PRICING, type PricingSampleProduct } from "@/config/pricing";

export type Ownership = "vault" | "delivery";
export type HoldPeriod = 90 | 365 | 730 | 1825;
export type DeliveryKind = "coin" | "bar";

export type EstimateLine = {
  label: string;
  value: string;
  subdued?: boolean;
};

export type VaultEstimate = {
  kind: "vault";
  ounces: number;
  atSpot: number;
  premium: number;
  purchaseFee: number;
  storage: readonly { year: number; amount: number; minimumApplied: boolean }[];
  totalFees: number;
};

export type DeliveryEstimate = {
  kind: "delivery";
  item: PricingSampleProduct;
  quantity: number;
  atSpot: number;
  premium: number;
  itemPrice: number;
  total: number;
  remainder: number;
};

export function roundMoney(value: number) {
  return Math.floor((value + Number.EPSILON) * 100 + 0.5) / 100;
}

export function roundWeight(value: number) {
  return Math.floor((value + Number.EPSILON) * 10_000 + 0.5) / 10_000;
}

export function formatMoney(value: number) {
  return `US$${roundMoney(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatWeight(value: number) {
  return roundWeight(value).toFixed(4);
}

export function calculateVaultEstimate(budget: number, holdDays: HoldPeriod): VaultEstimate {
  const purchaseFee = roundMoney(budget * PRICING.vault.purchaseFeeRate);
  const invested = roundMoney(budget - purchaseFee);
  const ounces = invested / (PRICING.sample.spotUsdPerOz * (1 + PRICING.sample.vaultPremiumRate));
  const atSpot = roundMoney(ounces * PRICING.sample.spotUsdPerOz);
  const premium = roundMoney(invested - atSpot);
  const storage: { year: number; amount: number; minimumApplied: boolean }[] = [];
  const years = Math.ceil(holdDays / PRICING.vault.freeStorageDays);

  for (let year = 1; year <= years; year += 1) {
    const elapsedDays = PRICING.vault.freeStorageDays * (year - 1);
    const days = Math.min(PRICING.vault.freeStorageDays, holdDays - elapsedDays);
    if (days <= 0) continue;
    if (elapsedDays < PRICING.vault.freeStorageDays) {
      storage.push({ year, amount: 0, minimumApplied: false });
      continue;
    }
    const rateAmount = atSpot * PRICING.vault.storageRatePerYear;
    const minimumApplied = rateAmount < PRICING.vault.storageMinimumPerYearUsd;
    const annualAmount = Math.max(rateAmount, PRICING.vault.storageMinimumPerYearUsd);
    storage.push({
      year,
      amount: roundMoney((annualAmount * days) / PRICING.vault.freeStorageDays),
      minimumApplied,
    });
  }

  return {
    kind: "vault",
    ounces,
    atSpot,
    premium,
    purchaseFee,
    storage,
    totalFees: roundMoney(purchaseFee + storage.reduce((sum, year) => sum + year.amount, 0)),
  };
}

function deliveryProducts(kind: DeliveryKind) {
  return kind === "coin" ? PRICING.sample.coins : PRICING.sample.bars;
}

export function getDeliveryItemPrice(item: PricingSampleProduct) {
  return roundMoney(item.weightOz * PRICING.sample.spotUsdPerOz * (1 + item.premiumRate));
}

export function getCheapestDeliveryItem(kind: DeliveryKind) {
  return [...deliveryProducts(kind)].sort(
    (a, b) => getDeliveryItemPrice(a) - getDeliveryItemPrice(b),
  )[0];
}

export function calculateDeliveryEstimate(
  budget: number,
  kind: DeliveryKind,
): DeliveryEstimate | null {
  const candidates = deliveryProducts(kind)
    .map((item) => ({ item, price: getDeliveryItemPrice(item) }))
    .filter(({ price }) => price <= budget)
    .sort((a, b) => b.price - a.price);
  const selected = candidates[0];
  if (!selected) return null;

  const quantity = Math.floor(budget / selected.price);
  const total = roundMoney(quantity * selected.price);
  const atSpot = roundMoney(quantity * selected.item.weightOz * PRICING.sample.spotUsdPerOz);
  const premium = roundMoney(total - atSpot);

  return {
    kind: "delivery",
    item: selected.item,
    quantity,
    atSpot,
    premium,
    itemPrice: selected.price,
    total,
    remainder: roundMoney(budget - total),
  };
}

export function holdLabel(days: HoldPeriod) {
  if (days === 90) return "90 days";
  if (days === 365) return "1 year";
  return `${days / PRICING.vault.freeStorageDays} years`;
}