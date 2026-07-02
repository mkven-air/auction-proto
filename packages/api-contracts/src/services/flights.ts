import type {
  Flight,
  FlightListSortCol,
  FlightWithRoute,
  FlightWithStats,
  SortDir,
} from "@auction/core";

export const FLIGHT_FILTER_FIELDS = [
  "id",
  "fromAirportId",
  "toAirportId",
  "depAt",
  "arrAt",
  "aircraft",
  "bcFree",
  "bcTotal",
  "status",
  "haul",
] as const satisfies ReadonlyArray<keyof Flight>;

export type FlightFilterField = (typeof FLIGHT_FILTER_FIELDS)[number];

export type FlightFilter = {
  field: FlightFilterField;
  op: "eq" | "contains" | "in";
  value: string | number | Array<string | number>;
};

export type FlightQuery = {
  search?: string | undefined;
  filters?: FlightFilter[] | undefined;
  sortBy?: FlightListSortCol | undefined;
  sortDir?: SortDir | undefined;
  page?: number | undefined;
  pageSize?: number | undefined;
};

export type FlightsSummary = {
  active: number;
  bids: number;
  revenue: number;
  freeSeats: number;
};

export type FlightsPage = {
  items: FlightWithStats[];
  total: number;
  page: number;
  pageSize: number;
  summary: FlightsSummary;
};

export type FlightsService = {
  list: () => Promise<FlightWithStats[]>;
  query: (query: FlightQuery) => Promise<FlightsPage>;
  getSummary: () => Promise<FlightsSummary>;
  findById: (flightId: Flight["id"]) => Promise<FlightWithStats | undefined>;
  findDetailById: (flightId: Flight["id"]) => Promise<FlightWithRoute | undefined>;
};
