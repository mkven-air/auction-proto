import { BID_STATES_DATA } from "../../../data/bidStates";
import type { BidStateRow, LocalizedString } from "@auction/core";
import type { DbEmulator, EntitySeed } from "../../db/contracts";
import type { BidStatesService } from "@auction/api-contracts/admin";

export const bidStatesSeed: EntitySeed = {
  bidStates: BID_STATES_DATA,
};

export const bidStatesTitle: LocalizedString = {
  en: "Bid States",
  ru: "Состояния заявок",
  uz: "Taklif holatlari",
};

export function createBidStatesService(db: DbEmulator): BidStatesService {
  return {
    async list() {
      return db.list<BidStateRow>("bidStates");
    },
  };
}
