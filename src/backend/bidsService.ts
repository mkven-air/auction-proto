import { weighted } from "../data";
import type { Bid, BidState, Flight } from "../types";
import type { BidsService } from "./contracts";
import type { DbEmulator } from "./db/emulator";
import { bidRowsToBids, toBidRowFilters, type BidRow } from "./serviceUtils";

function selectWinningBidIds(rows: Bid[], availableSeats: number): Bid["id"][] {
  return [...rows]
    .filter((bid) => bid.state === "pending")
    .sort((a, b) => weighted(b) - weighted(a))
    .slice(0, availableSeats)
    .map((bid) => bid.id);
}

export function createBidsService(db: DbEmulator): BidsService {
  return {
    async listBids(flightId) {
      const all = db.queryAll<BidRow>("bids", {
        filters: [{ field: "flightId", op: "eq", value: flightId }],
      });
      return bidRowsToBids(all);
    },

    async approveBid(flightId, bidId) {
      const updated = db.updateOne<BidRow>("bids", toBidRowFilters(flightId, bidId), {
        state: "approved",
      });
      if (!updated) return undefined;
      return bidRowsToBids([updated])[0];
    },

    async rejectBid(flightId, bidId) {
      const updated = db.updateOne<BidRow>("bids", toBidRowFilters(flightId, bidId), {
        state: "rejected",
      });
      if (!updated) return undefined;
      return bidRowsToBids([updated])[0];
    },

    async autoSelect(flightId) {
      const mutable = bidRowsToBids(
        db.queryAll<BidRow>("bids", {
          filters: [{ field: "flightId", op: "eq", value: flightId }],
        }),
      );

      const flight = db.findOne<Flight>("flights", [{ field: "id", op: "eq", value: flightId }]);
      const availableSeats = flight?.bcFree ?? 0;

      const winners = selectWinningBidIds(mutable, availableSeats);

      if (winners.length > 0) {
        db.updateMany<BidRow>(
          "bids",
          [
            { field: "flightId", op: "eq", value: flightId },
            { field: "id", op: "in", value: winners },
          ],
          { state: "approved" as BidState },
        );
      }

      return winners;
    },
  };
}
