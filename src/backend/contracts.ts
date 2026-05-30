import type { Bid, Flight, FlightListSortCol, SortDir } from "../types";

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

export type FlightsPage = {
  items: Flight[];
  total: number;
  page: number;
  pageSize: number;
  summary: FlightsSummary;
};

export type FlightsSummary = {
  active: number;
  bids: number;
  revenue: number;
  freeSeats: number;
};

export type FlightsService = {
  listFlights: () => Promise<Flight[]>;
  queryFlights: (query: FlightQuery) => Promise<FlightsPage>;
  getFlightsSummary: () => Promise<FlightsSummary>;
  getFlightById: (flightId: Flight["id"]) => Promise<Flight | undefined>;
};

export type BidsService = {
  listBids: (flightId: Flight["id"]) => Promise<Bid[]>;
  approveBid: (flightId: Flight["id"], bidId: Bid["id"]) => Promise<Bid | undefined>;
  rejectBid: (flightId: Flight["id"], bidId: Bid["id"]) => Promise<Bid | undefined>;
  autoSelect: (flightId: Flight["id"]) => Promise<Bid["id"][]>;
};

export type BackendClient = {
  flights: FlightsService;
  bids: BidsService;
};
