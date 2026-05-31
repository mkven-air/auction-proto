import type { Bid, Flight } from "../../../types";

export type BidsService = {
  list: (flightId: Flight["id"]) => Promise<Bid[]>;
  approve: (flightId: Flight["id"], bidId: Bid["id"]) => Promise<Bid | undefined>;
  reject: (flightId: Flight["id"], bidId: Bid["id"]) => Promise<Bid | undefined>;
  autoSelect: (flightId: Flight["id"]) => Promise<Bid["id"][]>;
};
