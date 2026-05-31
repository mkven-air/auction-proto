import type { BidState } from "../types";
import type { ColorTokenId } from "./color";

export const STATE_META: Record<
  BidState,
  { label: string; colorId: ColorTokenId; bgId: ColorTokenId }
> = {
  pending: { label: "Ожидает", colorId: "textMuted", bgId: "neutralBgSoft" },
  approved: {
    label: "Принята",
    colorId: "statusSuccessFg",
    bgId: "statusSuccessBg",
  },
  rejected: {
    label: "Отклонена",
    colorId: "statusDangerFg",
    bgId: "statusDangerBg",
  },
};
