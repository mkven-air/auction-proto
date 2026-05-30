import type { Bid, Flight } from "../types";
import type { BidsDb, FlightsDb } from "./db/contracts";

export type { FlightFilter, FlightQuery, FlightsPage, FlightsSummary } from "./db/contracts";

export type FlightsService = FlightsDb;

export type BidsService = Pick<BidsDb, "listBids"> & {
  approveBid: (flightId: Flight["id"], bidId: Bid["id"]) => Promise<Bid | undefined>;
  rejectBid: (flightId: Flight["id"], bidId: Bid["id"]) => Promise<Bid | undefined>;
  autoSelect: (flightId: Flight["id"]) => Promise<Bid["id"][]>;
};

export type BackendClient = {
  flights: FlightsService;
  bids: BidsService;
};
