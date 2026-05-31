import type { FlightStatus } from "../types";
import type { ColorTokenId } from "./color";

export const STATUS_META: Record<
  FlightStatus,
  { label: string; colorId: ColorTokenId; bgId: ColorTokenId }
> = {
  active: {
    label: "Активен",
    colorId: "statusSuccessFg",
    bgId: "statusSuccessBg",
  },
  sold: { label: "Нет мест", colorId: "statusDangerFg", bgId: "statusDangerBg" },
  upcoming: {
    label: "Скоро",
    colorId: "statusWarningFg",
    bgId: "statusWarningBg",
  },
};
