import { SEED_BIDS, weighted } from "../../../data";
import type { Bid, BidState, Flight } from "../../../types";
import type { DbEmulator, EntitySeed } from "../../db/contracts";
import type { BidsService } from "./contracts";
import { toBidFilters } from "./utils";

export const bidsSeed: EntitySeed = {
  bids: SEED_BIDS,
};

function selectWinningBidIds(rows: Bid[], availableSeats: number): Bid["id"][] {
  return [...rows]
    .filter((bid) => bid.state === "pending")
    .sort((a, b) => weighted(b) - weighted(a))
    .slice(0, availableSeats)
    .map((bid) => bid.id);
}

export function createBidsService(db: DbEmulator): BidsService {
  return {
    async list(flightId, product) {
      return db.queryAll<Bid>("bids", {
        filters: [
          { field: "flightId", op: "eq", value: flightId },
          { field: "product", op: "eq", value: product },
        ],
      });
    },

    async approve(flightId, bidId) {
      return db.updateOne<Bid>("bids", toBidFilters(flightId, bidId), {
        state: "approved",
      });
    },

    async reject(flightId, bidId) {
      return db.updateOne<Bid>("bids", toBidFilters(flightId, bidId), {
        state: "rejected",
      });
    },

    async autoSelect(flightId) {
      const mutable = db.queryAll<Bid>("bids", {
        filters: [
          { field: "flightId", op: "eq", value: flightId },
          { field: "product", op: "eq", value: "businessClass" },
        ],
      });

      const flight = db.findOne<Flight>("flights", [{ field: "id", op: "eq", value: flightId }]);
      const availableSeats = flight?.bcFree ?? 0;

      const winners = selectWinningBidIds(mutable, availableSeats);

      if (winners.length > 0) {
        db.updateMany<Bid>(
          "bids",
          [
            { field: "flightId", op: "eq", value: flightId },
            { field: "product", op: "eq", value: "businessClass" },
            { field: "id", op: "in", value: winners },
          ],
          { state: "approved" as BidState },
        );
      }

      return winners;
    },
  };
}
