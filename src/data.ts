import { T } from "./theme";
import type {
  Airport,
  Bid,
  BidState,
  Channel,
  Flight,
  FlightHaul,
  FlightStatus,
  Rules,
  SeatCell,
  Tier,
} from "./types";

export const AIRPORTS_DATA: Airport[] = [
  {
    id: "TAS",
    name: { en: "Tashkent International Airport", ru: "Международный аэропорт Ташкент" },
    city: { en: "Tashkent", ru: "Ташкент" },
    country: { en: "Uzbekistan", ru: "Узбекистан" },
  },
  {
    id: "IST",
    name: { en: "Istanbul Airport", ru: "Аэропорт Стамбул" },
    city: { en: "Istanbul", ru: "Стамбул" },
    country: { en: "Turkey", ru: "Турция" },
  },
  {
    id: "DXB",
    name: { en: "Dubai International Airport", ru: "Международный аэропорт Дубай" },
    city: { en: "Dubai", ru: "Дубай" },
    country: { en: "United Arab Emirates", ru: "ОАЭ" },
  },
  {
    id: "MOW",
    name: { en: "Moscow Sheremetyevo Airport", ru: "Шереметьево" },
    city: { en: "Moscow", ru: "Москва" },
    country: { en: "Russia", ru: "Россия" },
  },
  {
    id: "FRA",
    name: { en: "Frankfurt Airport", ru: "Аэропорт Франкфурт" },
    city: { en: "Frankfurt", ru: "Франкфурт" },
    country: { en: "Germany", ru: "Германия" },
  },
  {
    id: "PEK",
    name: { en: "Beijing Capital International Airport", ru: "Пекин Столичный" },
    city: { en: "Beijing", ru: "Пекин" },
    country: { en: "China", ru: "Китай" },
  },
  {
    id: "ICN",
    name: { en: "Incheon International Airport", ru: "Аэропорт Инчхон" },
    city: { en: "Seoul", ru: "Сеул" },
    country: { en: "South Korea", ru: "Южная Корея" },
  },
  {
    id: "LHR",
    name: { en: "London Heathrow Airport", ru: "Хитроу" },
    city: { en: "London", ru: "Лондон" },
    country: { en: "United Kingdom", ru: "Великобритания" },
  },
  {
    id: "ALA",
    name: { en: "Almaty International Airport", ru: "Международный аэропорт Алматы" },
    city: { en: "Almaty", ru: "Алматы" },
    country: { en: "Kazakhstan", ru: "Казахстан" },
  },
];

const AIRPORTS_BY_ID = new Map(AIRPORTS_DATA.map((airport) => [airport.id, airport]));

export function getAirport(id: Airport["id"]): Airport {
  const airport = AIRPORTS_BY_ID.get(id);
  if (!airport) {
    throw new Error(`Unknown airport id: ${id}`);
  }
  return airport;
}

export const FLIGHTS_DATA: Flight[] = [
  {
    id: "HY 602",
    fromAirportId: "TAS",
    toAirportId: "IST",
    dep: "15 июн 08:45",
    arr: "11:20",
    duration: "5ч 35м",
    aircraft: "A321",
    bcFree: 2,
    bcTotal: 16,
    bids: 28,
    topBid: 620,
    revenue: 1180,
    status: "active",
    haul: "medium",
  },
  {
    id: "HY 814",
    fromAirportId: "TAS",
    toAirportId: "DXB",
    dep: "15 июн 14:30",
    arr: "17:15",
    duration: "4ч 45м",
    aircraft: "B787",
    bcFree: 8,
    bcTotal: 24,
    bids: 11,
    topBid: 480,
    revenue: 3840,
    status: "active",
    haul: "medium",
  },
  {
    id: "HY 233",
    fromAirportId: "TAS",
    toAirportId: "MOW",
    dep: "15 июн 11:15",
    arr: "13:30",
    duration: "3ч 15м",
    aircraft: "A320",
    bcFree: 0,
    bcTotal: 8,
    bids: 43,
    topBid: 390,
    revenue: 0,
    status: "sold",
    haul: "short",
  },
  {
    id: "HY 177",
    fromAirportId: "TAS",
    toAirportId: "FRA",
    dep: "16 июн 06:00",
    arr: "09:45",
    duration: "7ч 45м",
    aircraft: "B767",
    bcFree: 14,
    bcTotal: 20,
    bids: 5,
    topBid: 550,
    revenue: 7700,
    status: "upcoming",
    haul: "long",
  },
  {
    id: "HY 409",
    fromAirportId: "TAS",
    toAirportId: "PEK",
    dep: "16 июн 09:20",
    arr: "15:50",
    duration: "5ч 30м",
    aircraft: "A330",
    bcFree: 6,
    bcTotal: 18,
    bids: 19,
    topBid: 510,
    revenue: 3060,
    status: "active",
    haul: "medium",
  },
  {
    id: "HY 551",
    fromAirportId: "TAS",
    toAirportId: "ICN",
    dep: "16 июн 13:00",
    arr: "22:15",
    duration: "6ч 15м",
    aircraft: "B787",
    bcFree: 3,
    bcTotal: 20,
    bids: 31,
    topBid: 540,
    revenue: 1620,
    status: "active",
    haul: "long",
  },
  {
    id: "HY 088",
    fromAirportId: "TAS",
    toAirportId: "LHR",
    dep: "17 июн 00:30",
    arr: "05:20",
    duration: "8ч 50м",
    aircraft: "B767",
    bcFree: 10,
    bcTotal: 16,
    bids: 2,
    topBid: 600,
    revenue: 6000,
    status: "upcoming",
    haul: "ultra",
  },
  {
    id: "HY 312",
    fromAirportId: "TAS",
    toAirportId: "ALA",
    dep: "15 июн 16:45",
    arr: "17:35",
    duration: "1ч 05м",
    aircraft: "A319",
    bcFree: 4,
    bcTotal: 8,
    bids: 7,
    topBid: 95,
    revenue: 380,
    status: "active",
    haul: "ultra-short",
  },
];

export const INITIAL_BIDS: Bid[] = [
  {
    id: 1,
    name: "Иванов А.П.",
    tier: "Platinum",
    bid: 620,
    mult: 1.1,
    channel: "Email",
    time: "09:14",
    state: "pending",
  },
  {
    id: 2,
    name: "Ли Вэй",
    tier: "Gold",
    bid: 520,
    mult: 1.05,
    channel: "App",
    time: "13:07",
    state: "pending",
  },
  {
    id: 3,
    name: "Петрова М.С.",
    tier: "Silver",
    bid: 490,
    mult: 1.03,
    channel: "Email",
    time: "10:21",
    state: "pending",
  },
  {
    id: 4,
    name: "Smith J.",
    tier: "Standard",
    bid: 580,
    mult: 1.0,
    channel: "MMB",
    time: "11:32",
    state: "pending",
  },
  {
    id: 5,
    name: "Karimov B.",
    tier: "Platinum",
    bid: 400,
    mult: 1.1,
    channel: "Web",
    time: "08:55",
    state: "pending",
  },
  {
    id: 6,
    name: "Ahmadov F.",
    tier: "Standard",
    bid: 470,
    mult: 1.0,
    channel: "Email",
    time: "14:45",
    state: "pending",
  },
  {
    id: 7,
    name: "Brown T.",
    tier: "Gold",
    bid: 380,
    mult: 1.05,
    channel: "MMB",
    time: "07:30",
    state: "pending",
  },
  {
    id: 8,
    name: "Назаров О.",
    tier: "Standard",
    bid: 310,
    mult: 1.0,
    channel: "Web",
    time: "16:02",
    state: "pending",
  },
  {
    id: 9,
    name: "Юсупова Д.",
    tier: "Silver",
    bid: 345,
    mult: 1.03,
    channel: "Email",
    time: "15:18",
    state: "pending",
  },
  {
    id: 10,
    name: "Kim S.",
    tier: "Gold",
    bid: 430,
    mult: 1.05,
    channel: "App",
    time: "12:00",
    state: "pending",
  },
];

export const SEAT_MAP_BC: Array<Array<SeatCell | null>> = [
  [
    { id: "1A", taken: true },
    { id: "1C", taken: true },
    null,
    { id: "1D", taken: true },
    { id: "1F", taken: true },
  ],
  [
    { id: "2A", taken: true },
    { id: "2C", taken: true },
    null,
    { id: "2D", taken: true },
    { id: "2F", taken: true },
  ],
  [
    { id: "3A", taken: true },
    { id: "3C", taken: true },
    null,
    { id: "3D", taken: true },
    { id: "3F", taken: true },
  ],
  [
    { id: "4A", taken: false, bid: true },
    { id: "4C", taken: true },
    null,
    { id: "4D", taken: true },
    { id: "4F", taken: false, bid: true },
  ],
];

export const DEFAULT_RULES: Rules = {
  inviteDaysBefore: 14,
  chaserHoursBefore: 48,
  closureHoursBefore: 4,
  autoFulfillment: true,
  requirePurchased: true,
  blindBids: true,
  maxUpgradesPerFlight: 0,
  multiplierPlatinum: 10,
  multiplierGold: 5,
  multiplierSilver: 3,
  minBcUltraShort: 93,
  minBcShort: 118,
  minBcMedium: 262,
  minBcLong: 500,
  minBcUltraLong: 569,
  minExitShort: 8,
  minExitMedium: 32,
  minExitLong: 35,
  minSeatBlockShort: 8,
  minSeatBlockMedium: 32,
  minSeatBlockLong: 35,
  channels: { email: true, mmb: true, app: true, web: true, webcheckin: true, pushNotif: true },
  paymentMethods: { visa: true, mastercard: true, amex: true, jcb: false, diners: false },
  use3ds: false,
  continuousPricing: true,
  crossAirlineUpgrades: false,
  payWithPoints: false,
  seatBlocker: true,
};

export const weighted = (b: Bid) => Math.round(b.bid * b.mult);

export type ColorTokenId = keyof typeof T;

export const colorToken = (id: ColorTokenId): string => T[id];

export const DIST_DATA: Array<{
  range: string;
  count: number;
  pct: number;
  colorId: ColorTokenId;
}> = [
  { range: "$500–750", count: 7, pct: 25, colorId: "brandPrimary" },
  { range: "$400–499", count: 10, pct: 36, colorId: "brandPrimarySoft" },
  { range: "$300–399", count: 8, pct: 29, colorId: "brandPrimaryMuted" },
  { range: "$262–299", count: 3, pct: 10, colorId: "brandPrimaryPale" },
];

export const EXIT_DATA: Array<{
  range: string;
  count: number;
  pct: number;
  colorId: ColorTokenId;
}> = [
  { range: "$60–85", count: 9, pct: 64, colorId: "statusSuccess" },
  { range: "$32–59", count: 5, pct: 36, colorId: "statusSuccessSoft" },
];

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

export const HAUL_LABELS: Record<FlightHaul, string> = {
  "ultra-short": "Ультракороткий (<1.5ч)",
  short: "Короткий (1.5–3ч)",
  medium: "Средний (3–5ч)",
  long: "Длинный (5–8ч)",
  ultra: "Ультрадальний (8ч+)",
};

export const CH_ICONS: Record<Channel, string> = {
  Email: "✉",
  App: "◉",
  MMB: "⊞",
  Web: "◈",
};
