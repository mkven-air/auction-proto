import { SEED_BIDS } from "../../../data/bids";
import { weighted } from "@auction/core";
import type {
  Bid,
  BidState,
  BidWithPassenger,
  Flight,
  LocalizedString,
  Passenger,
} from "@auction/core";
import type { DbEmulator, EntitySeed } from "../../db/contracts";
import type { BidsService } from "@auction/api-contracts/admin";
import { toBidFilters } from "./utils";

export const bidsSeed: EntitySeed = {
  bids: SEED_BIDS,
};

export const bidsTitle: LocalizedString = { en: "Bids", ru: "Заявки", uz: "Takliflar" };

function joinPassenger(db: DbEmulator, bids: Bid[]): BidWithPassenger[] {
  if (bids.length === 0) return [];
  const ids = Array.from(new Set(bids.map((b) => b.passengerId)));
  const passengers = db.queryAll<Passenger>("passengers", {
    filters: [{ field: "id", op: "in", value: ids }],
  });
  const byId = new Map(passengers.map((p) => [p.id, p]));
  return bids.flatMap((bid) => {
    const passenger = byId.get(bid.passengerId);
    if (!passenger) return [];
    return [{ ...bid, passenger }];
  });
}

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
      const rows = db.queryAll<Bid>("bids", {
        filters: [
          { field: "flightId", op: "eq", value: flightId },
          { field: "product", op: "eq", value: product },
        ],
      });
      return joinPassenger(db, rows);
    },

    async approve(flightId, bidId) {
      const updated = db.updateOne<Bid>("bids", toBidFilters(flightId, bidId), {
        state: "approved",
      });
      if (!updated) return undefined;
      return joinPassenger(db, [updated])[0];
    },

    async reject(flightId, bidId) {
      const updated = db.updateOne<Bid>("bids", toBidFilters(flightId, bidId), {
        state: "rejected",
      });
      if (!updated) return undefined;
      return joinPassenger(db, [updated])[0];
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
