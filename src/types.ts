import type { ColorTokenId } from "./domain/color";

export type Tier = "Platinum" | "Gold" | "Silver" | "Standard";
export type BidState = "pending" | "approved" | "rejected";
export type FlightStatus = "active" | "sold" | "upcoming";
export type FlightHaul = "ultra-short" | "short" | "medium" | "long" | "ultra";
export type Channel = "Email" | "App" | "MMB" | "Web";

export type LocaleCode = "en" | "ru" | "uz";
export type LocalizedString = Partial<Record<LocaleCode, string>>;

export type Country = {
  id: string;
  name: LocalizedString;
};

export type City = {
  id: string;
  name: LocalizedString;
  countryId: Country["id"];
  timezone: string;
};

export type Airport = {
  id: string;
  name: LocalizedString;
  cityId: City["id"];
};

export type AirportWithLocation = Airport & {
  city: City;
  country: Country;
};

export type TierRow = {
  id: Tier;
  name: LocalizedString;
  multLabel: LocalizedString;
  colorId: ColorTokenId;
  bgId: ColorTokenId;
};

export type BidStateRow = {
  id: BidState;
  name: LocalizedString;
  colorId: ColorTokenId;
  bgId: ColorTokenId;
};

export type FlightStatusRow = {
  id: FlightStatus;
  name: LocalizedString;
  colorId: ColorTokenId;
  bgId: ColorTokenId;
};

export type FlightHaulRow = {
  id: FlightHaul;
  name: LocalizedString;
};

export type Flight = {
  id: string;
  fromAirportId: Airport["id"];
  toAirportId: Airport["id"];
  depAt: string;
  arrAt: string;
  aircraft: string;
  bcFree: number;
  bcTotal: number;
  status: FlightStatus;
  haul: FlightHaul;
};

export type FlightStats = {
  bids: number;
  topBid: number;
  revenue: number;
};

export type FlightWithStats = Flight & FlightStats;

export type FlightWithRoute = FlightWithStats & {
  fromAirport: AirportWithLocation;
  toAirport: AirportWithLocation;
};

export type Passenger = {
  id: string;
  name: string;
  initials: string;
  tier: Tier;
};

export type BidProduct = "businessClass" | "exitRows";

export type Bid = {
  id: number;
  flightId: Flight["id"];
  product: BidProduct;
  passengerId: Passenger["id"];
  bid: number;
  mult: number;
  channel: Channel;
  time: string;
  state: BidState;
};

export type BidWithPassenger = Bid & { passenger: Passenger };

export type ProductKey = "bc" | "ex" | "sb";

export type ProductConfig = {
  label: string;
  desc: string;
  icon: string;
  min: number;
  max: number;
  defaultVal: number;
  color: string;
  trackColor: string;
};

export type ProductBidMap = Record<ProductKey, number>;
export type ProductActiveMap = Record<ProductKey, boolean>;

export type PassengerProductSpec = {
  icon: string;
  min: number;
  max: number;
  defaultVal: number;
};

export type PassengerConfig = {
  flightId: Flight["id"];
  frame: {
    statusBarTime: string;
    statusBarHost: string;
    closingIn: string;
  };
  multiplier: number;
  productSpecs: Record<ProductKey, PassengerProductSpec>;
  defaultBids: ProductBidMap;
  defaultActive: ProductActiveMap;
};

export type SeatCell = {
  id: string;
  taken: boolean;
  bid?: boolean;
};

export type SeatMapLayout = Array<Array<SeatCell | null>>;

export type RuleSectionId = "timing" | "pricing" | "loyalty" | "channels" | "payment" | "features";

export const EMAIL_TEMPLATE_TYPE = {
  pte: "pte",
  chaser: "chaser",
  win: "win",
} as const;
export type EmailTemplateType = (typeof EMAIL_TEMPLATE_TYPE)[keyof typeof EMAIL_TEMPLATE_TYPE];

export const MAIN_TAB = {
  flights: "flights",
  flight: "flight",
  rules: "rules",
  email: "email",
  passenger: "passenger",
  entities: "entities",
} as const;
export type MainTab = (typeof MAIN_TAB)[keyof typeof MAIN_TAB];

export type FlightListFilter = "all" | FlightStatus;
export type FlightListSortCol = "depAt" | "bids" | "revenue" | "topBid";
export type SortDir = "asc" | "desc";

export type FlightDetailFilter = "all" | BidState;
export type FlightDetailSortCol = "name" | "tier" | "bid" | "weighted" | "channel" | "time";

export type Rules = {
  inviteDaysBefore: number;
  chaserHoursBefore: number;
  closureHoursBefore: number;
  autoFulfillment: boolean;
  requirePurchased: boolean;
  blindBids: boolean;
  maxUpgradesPerFlight: number;
  multiplierPlatinum: number;
  multiplierGold: number;
  multiplierSilver: number;
  minBcUltraShort: number;
  minBcShort: number;
  minBcMedium: number;
  minBcLong: number;
  minBcUltraLong: number;
  minExitShort: number;
  minExitMedium: number;
  minExitLong: number;
  minSeatBlockShort: number;
  minSeatBlockMedium: number;
  minSeatBlockLong: number;
  channels: {
    email: boolean;
    mmb: boolean;
    app: boolean;
    web: boolean;
    webcheckin: boolean;
    pushNotif: boolean;
  };
  paymentMethods: {
    visa: boolean;
    mastercard: boolean;
    amex: boolean;
    jcb: boolean;
    diners: boolean;
  };
  use3ds: boolean;
  continuousPricing: boolean;
  crossAirlineUpgrades: boolean;
  payWithPoints: boolean;
  seatBlocker: boolean;
  onlyUpgrade: boolean;
};

export type RulesBooleanKey = {
  [K in keyof Rules]: Rules[K] extends boolean ? K : never;
}[keyof Rules];

export type RulesNumberKey = {
  [K in keyof Rules]: Rules[K] extends number ? K : never;
}[keyof Rules];

export type ChannelRuleKey = keyof Rules["channels"];
export type PaymentMethodKey = keyof Rules["paymentMethods"];
export type PricingHaulKey = "UltraShort" | "Short" | "Medium" | "Long" | "UltraLong";

export type TimingRow = {
  key: RulesNumberKey;
  label: string;
  desc: string;
  min: number;
  max: number;
  unit: string;
};

export type PricingRow = {
  product: string;
  keys: Record<PricingHaulKey, RulesNumberKey>;
};

export type EmailOffer = {
  name: string;
  desc: string;
  from: string;
};

export type EmailTemplateConfig = {
  subject: string;
  to: string;
  tag: string;
  tagC: string;
  tagBg: string;
  hBg: string;
  hLine: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaBg: string;
  footer: string;
  urgency?: boolean;
  offers?: EmailOffer[];
  booking?: Record<string, string>;
};
