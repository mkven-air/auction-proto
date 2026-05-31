import type { Airport, ProductActiveMap, ProductBidMap, ProductKey, Tier } from "./types";

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
  fromAirportId: Airport["id"];
  toAirportId: Airport["id"];
  aircraftLine: string;
  statusBarTime: string;
  statusBarHost: string;
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
  fromAirportId: "TAS",
  toAirportId: "IST",
  aircraftLine: "Airbus A321 · 5ч 35м · Эконом → Бизнес",
  statusBarTime: "09:41",
  statusBarHost: "uzbekistanairways.uz",
  closingIn: "3ч 20м",
};

export function passengerRouteLabel(flight: PassengerFlightInfo): string {
  return `${flight.number} · ${flight.fromAirportId} → ${flight.toAirportId}`;
}
