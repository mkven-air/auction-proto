import type { Bid, BidState, Flight } from "../../types";
import type { FlightListSortCol, SortDir } from "../../types";

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

export type FlightsDb = {
  listFlights: () => Promise<Flight[]>;
  queryFlights: (query: FlightQuery) => Promise<FlightsPage>;
  getFlightsSummary: () => Promise<FlightsSummary>;
  getFlightById: (flightId: Flight["id"]) => Promise<Flight | undefined>;
};

export type BidsDb = {
  listBids: (flightId: Flight["id"]) => Promise<Bid[]>;
  setBidState: (
    flightId: Flight["id"],
    bidId: Bid["id"],
    state: BidState,
  ) => Promise<Bid | undefined>;
  setManyBidStates: (flightId: Flight["id"], bidIds: Bid["id"][], state: BidState) => Promise<void>;
};

export type AppDb = {
  flights: FlightsDb;
  bids: BidsDb;
};
