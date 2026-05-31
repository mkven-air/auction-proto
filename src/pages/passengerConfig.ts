import type { ProductActiveMap, ProductBidMap, ProductKey } from "../types";

type PassengerProductSpec = {
  icon: string;
  min: number;
  max: number;
  defaultVal: number;
};

export const PASSENGER_FLIGHT_ID = "HY 602";

// Decorative phone-frame chrome — pure presentation, not data.
export const PASSENGER_FRAME = {
  statusBarTime: "09:41",
  statusBarHost: "uzbekistanairways.uz",
  closingIn: "3ч 20м",
};

export const PASSENGER_MULTIPLIER = 1.1;

export const PASSENGER_PRODUCT_SPECS: Record<ProductKey, PassengerProductSpec> = {
  bc: { icon: "🛋", min: 262, max: 750, defaultVal: 350 },
  ex: { icon: "🦵", min: 32, max: 85, defaultVal: 46 },
  sb: { icon: "🪑", min: 8, max: 45, defaultVal: 18 },
};

export const PASSENGER_DEFAULT_BIDS: ProductBidMap = {
  bc: PASSENGER_PRODUCT_SPECS.bc.defaultVal,
  ex: PASSENGER_PRODUCT_SPECS.ex.defaultVal,
  sb: PASSENGER_PRODUCT_SPECS.sb.defaultVal,
};

export const PASSENGER_DEFAULT_ACTIVE: ProductActiveMap = {
  bc: true,
  ex: true,
  sb: false,
};
