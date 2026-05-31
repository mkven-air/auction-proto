import type { Flight, FlightListSortCol, SortDir } from "../../../types";

export type FlightFilter = {
  field: keyof Flight;
  op: "eq" | "contains" | "in";
  value: string | number | Array<string | number>;
};

export type FlightQuery = {
  search?: string;
  filters?: FlightFilter[];
  sortBy?: FlightListSortCol;
  sortDir?: SortDir;
  page?: number;
  pageSize?: number;
};

export type FlightsSummary = {
  active: number;
  bids: number;
  revenue: number;
  freeSeats: number;
};

export type FlightsPage = {
  items: Flight[];
  total: number;
  page: number;
  pageSize: number;
  summary: FlightsSummary;
};

export type FlightsService = {
  list: () => Promise<Flight[]>;
  query: (query: FlightQuery) => Promise<FlightsPage>;
  getSummary: () => Promise<FlightsSummary>;
  findById: (flightId: Flight["id"]) => Promise<Flight | undefined>;
};
