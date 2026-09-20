export const PRICE_CHANGE_TOLERANCE = 0.01;

export type PriceChange = {
  amount: number;
  percent: number;
};

type PriceChangeInput = {
  price: unknown;
  baseline: unknown;
  priceSource: unknown;
  baselineSource: unknown;
  suppliedAmount?: unknown;
  suppliedPercent?: unknown;
};

function finite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * The only AURUM day-change calculation. A change is valid only when both
 * values identify the exact same provider feed and any persisted derivatives
 * agree with the unrounded calculation.
 */
export function derivePriceChange(input: PriceChangeInput): PriceChange | null {
  if (!finite(input.price) || input.price <= 0 || !finite(input.baseline) || input.baseline <= 0) return null;
  if (typeof input.priceSource !== "string" || input.priceSource.length === 0) return null;
  if (input.priceSource !== input.baselineSource) return null;

  const amount = input.price - input.baseline;
  const percent = (amount / input.baseline) * 100;
  if (!Number.isFinite(amount) || !Number.isFinite(percent)) return null;

  if (input.suppliedAmount !== undefined) {
    if (!finite(input.suppliedAmount) || Math.abs(input.suppliedAmount - amount) > PRICE_CHANGE_TOLERANCE) return null;
  }
  if (input.suppliedPercent !== undefined) {
    if (!finite(input.suppliedPercent) || Math.abs(input.suppliedPercent - percent) > PRICE_CHANGE_TOLERANCE) return null;
  }

  return { amount, percent };
}
