import type {
  EntityTable,
  FlightQuery,
  FlightsPage,
  FlightsSummary,
} from "@auction/api-contracts/admin";
import type {
  Airport,
  AirportWithLocation,
  Bid,
  BidProduct,
  BidStateRow,
  BidWithPassenger,
  City,
  Country,
  Flight,
  FlightHaulRow,
  FlightStatusRow,
  FlightWithRoute,
  FlightWithStats,
  Passenger,
  PassengerConfig,
  Rules,
  SeatMapLayout,
  TierRow,
} from "@auction/core";

const API_BASE = `${(import.meta.env.VITE_API_TARGET ?? "").replace(/\/$/, "")}/api`;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "content-type": "application/json" },
    ...init,
  });
  if (!response.ok) {
    throw new Error(`API ${init?.method ?? "GET"} ${path} failed with ${response.status}`);
  }
  const text = await response.text();
  return (text.length > 0 ? JSON.parse(text) : undefined) as T;
}

const getJson = <T>(path: string): Promise<T> => request<T>(path);

const postJson = <T>(path: string, body?: unknown): Promise<T> =>
  request<T>(path, {
    method: "POST",
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

const putJson = <T>(path: string, body: unknown): Promise<T> =>
  request<T>(path, { method: "PUT", body: JSON.stringify(body) });

const idsQuery = (ids: ReadonlyArray<string>): string =>
  `?ids=${encodeURIComponent(ids.join(","))}`;

export const adminBackend = {
  flights: {
    getSummary: (): Promise<FlightsSummary> => getJson("/admin/flights/summary"),
    query: (query: FlightQuery): Promise<FlightsPage> => postJson("/admin/flights/query", query),
    findById: async (flightId: Flight["id"]): Promise<FlightWithStats | undefined> =>
      (await getJson<FlightWithStats | null>(`/admin/flights/${flightId}`)) ?? undefined,
    findDetailById: async (flightId: Flight["id"]): Promise<FlightWithRoute | undefined> =>
      (await getJson<FlightWithRoute | null>(`/admin/flights/${flightId}/detail`)) ?? undefined,
  },
  bids: {
    list: (flightId: Flight["id"], product: BidProduct): Promise<BidWithPassenger[]> =>
      getJson(`/admin/flights/${flightId}/bids?product=${encodeURIComponent(product)}`),
    approve: async (
      flightId: Flight["id"],
      bidId: Bid["id"],
    ): Promise<BidWithPassenger | undefined> =>
      (await postJson<BidWithPassenger | null>(
        `/admin/flights/${flightId}/bids/${bidId}/approve`,
      )) ?? undefined,
    reject: async (
      flightId: Flight["id"],
      bidId: Bid["id"],
    ): Promise<BidWithPassenger | undefined> =>
      (await postJson<BidWithPassenger | null>(
        `/admin/flights/${flightId}/bids/${bidId}/reject`,
      )) ?? undefined,
    autoSelect: (flightId: Flight["id"]): Promise<Bid["id"][]> =>
      postJson(`/admin/flights/${flightId}/bids/auto-select`),
  },
  rules: {
    get: (): Promise<Rules> => getJson("/admin/rules"),
    update: (rules: Rules): Promise<Rules> => putJson("/admin/rules", rules),
  },
  entities: {
    listAll: (): Promise<EntityTable[]> => getJson("/admin/entities"),
  },
  airports: {
    findByIds: (ids: Airport["id"][]): Promise<Airport[]> =>
      getJson(`/admin/airports${idsQuery(ids)}`),
    findWithLocationByIds: (ids: Airport["id"][]): Promise<AirportWithLocation[]> =>
      getJson(`/admin/airports/with-location${idsQuery(ids)}`),
  },
  cities: {
    findByIds: (ids: City["id"][]): Promise<City[]> => getJson(`/admin/cities${idsQuery(ids)}`),
  },
  countries: {
    findByIds: (ids: Country["id"][]): Promise<Country[]> =>
      getJson(`/admin/countries${idsQuery(ids)}`),
  },
  tiers: {
    list: (): Promise<TierRow[]> => getJson("/admin/tiers"),
  },
  bidStates: {
    list: (): Promise<BidStateRow[]> => getJson("/admin/bid-states"),
  },
  flightStatuses: {
    list: (): Promise<FlightStatusRow[]> => getJson("/admin/flight-statuses"),
  },
  flightHauls: {
    list: (): Promise<FlightHaulRow[]> => getJson("/admin/flight-hauls"),
  },
};

export const passengerBackend = {
  passengers: {
    getCurrent: async (): Promise<Passenger | undefined> =>
      (await getJson<Passenger | null>("/passenger/me")) ?? undefined,
  },
  passengerConfig: {
    get: (): Promise<PassengerConfig> => getJson("/passenger/config"),
  },
  tiers: {
    list: (): Promise<TierRow[]> => getJson("/passenger/tiers"),
  },
  flights: {
    findDetailById: async (flightId: Flight["id"]): Promise<FlightWithRoute | undefined> =>
      (await getJson<FlightWithRoute | null>(`/passenger/flights/${flightId}/detail`)) ?? undefined,
  },
  seatMap: {
    getBusinessClass: (flightId: Flight["id"]): Promise<SeatMapLayout> =>
      getJson(`/passenger/seat-map/${flightId}/business`),
  },
};
