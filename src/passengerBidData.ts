import type { ProductActiveMap, ProductBidMap, ProductKey, Tier } from "./types";

type PassengerProfile = {
  name: string;
  tier: Tier;
  initials: string;
};

type PassengerProductSpec = {
  icon: string;
  min: number;
  max: number;
  defaultVal: number;
};

type PassengerFlightInfo = {
  number: string;
  departureLabel: string;
  fromIata: string;
  toIata: string;
  routeLabel: string;
  aircraftLine: string;
  statusBarTime: string;
  statusBarHost: string;
  submittedRoute: string;
  closingIn: string;
};

export const PASSENGER_PROFILE: PassengerProfile = {
  name: "Азиз Каримов",
  tier: "Platinum",
  initials: "АК",
};

export const PASSENGER_MULTIPLIER = 1.1;

export const PASSENGER_PRODUCT_SPECS: Record<ProductKey, PassengerProductSpec> = {
  bc: {
    icon: "🛋",
    min: 262,
    max: 750,
    defaultVal: 350,
  },
  ex: {
    icon: "🦵",
    min: 32,
    max: 85,
    defaultVal: 46,
  },
  sb: {
    icon: "🪑",
    min: 8,
    max: 45,
    defaultVal: 18,
  },
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

export const PASSENGER_FLIGHT: PassengerFlightInfo = {
  number: "HY 602",
  departureLabel: "15 июн · 08:45",
  fromIata: "TAS",
  toIata: "IST",
  routeLabel: "HY 602 · TAS → IST",
  aircraftLine: "Airbus A321 · 5ч 35м · Эконом → Бизнес",
  statusBarTime: "09:41",
  statusBarHost: "uzbekistanairways.uz",
  submittedRoute: "HY 602 · TAS → IST",
  closingIn: "3ч 20м",
};
