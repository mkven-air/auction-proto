import type { Bid } from "../types";
import type { ColorTokenId } from "../domain/color";

export type DistributionRow = {
  range: string;
  count: number;
  pct: number;
  colorId: ColorTokenId;
};

export const BC_DIST_COLORS: ColorTokenId[] = [
  "brandPrimary",
  "brandPrimarySoft",
  "brandPrimaryMuted",
  "brandPrimaryPale",
];

export const EXIT_DIST_COLORS: ColorTokenId[] = ["statusSuccess", "statusSuccessSoft"];

export function computeBidDistribution(bids: Bid[], colors: ColorTokenId[]): DistributionRow[] {
  if (bids.length === 0) {
    return colors.map((colorId) => ({ range: "—", count: 0, pct: 0, colorId }));
  }

  const values = bids.map((b) => b.bid);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const n = colors.length;
  const step = Math.max(1, Math.ceil((max - min + 1) / n));
  const total = values.length;

  return colors.map((colorId, i) => {
    // i = 0 → top bucket (highest range)
    const lo = min + step * (n - 1 - i);
    const hi = i === 0 ? max : lo + step - 1;
    const count = values.filter((v) => v >= lo && v <= hi).length;
    const pct = Math.round((count / total) * 100);
    return { range: `$${lo}–${hi}`, count, pct, colorId };
  });
}
