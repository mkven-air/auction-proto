import type { Tier } from "../types";
import type { ColorTokenId } from "./color";

export const TIER_META: Record<
  Tier,
  { colorId: ColorTokenId; bgId: ColorTokenId; label: string; mult: string }
> = {
  Platinum: {
    colorId: "statusWarning",
    bgId: "statusWarningBg",
    label: "Platinum",
    mult: "+10%",
  },
  Gold: {
    colorId: "brandPrimary",
    bgId: "brandPrimaryBg",
    label: "Gold",
    mult: "+5%",
  },
  Silver: {
    colorId: "textSecondary",
    bgId: "neutralBgSoft",
    label: "Silver",
    mult: "+3%",
  },
  Standard: {
    colorId: "textMuted",
    bgId: "neutralBgPale",
    label: "Standard",
    mult: "—",
  },
};
