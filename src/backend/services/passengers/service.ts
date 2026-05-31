import { PASSENGERS_DATA } from "../../../data";
import type { Passenger } from "../../../types";
import type { DbEmulator, EntitySeed } from "../../db/contracts";
import type { PassengersService } from "./contracts";

// In a real backend this would be the authenticated user's id. For the prototype we
// pin it to a Platinum bidder so the mobile UI mirrors a real participant.
export const CURRENT_PASSENGER_ID = "p005";

export const passengersSeed: EntitySeed = {
  passengers: PASSENGERS_DATA,
};

export function createPassengersService(db: DbEmulator): PassengersService {
  return {
    async getCurrent() {
      return db.findOne<Passenger>("passengers", [
        { field: "id", op: "eq", value: CURRENT_PASSENGER_ID },
      ]);
    },
  };
}
