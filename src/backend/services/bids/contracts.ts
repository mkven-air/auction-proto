import type { Bid, BidProduct, BidWithPassenger, Flight } from "../../../types";

export type BidsService = {
  list: (flightId: Flight["id"], product: BidProduct) => Promise<BidWithPassenger[]>;
  approve: (flightId: Flight["id"], bidId: Bid["id"]) => Promise<BidWithPassenger | undefined>;
  reject: (flightId: Flight["id"], bidId: Bid["id"]) => Promise<BidWithPassenger | undefined>;
  autoSelect: (flightId: Flight["id"]) => Promise<Bid["id"][]>;
};
