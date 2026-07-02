import { FLIGHT_STATUSES_DATA } from "../../../data/flightStatuses";
import type { FlightStatusRow, LocalizedString } from "@auction/core";
import type { DbEmulator, EntitySeed } from "../../db/contracts";
import type { FlightStatusesService } from "@auction/api-contracts/admin";

export const flightStatusesSeed: EntitySeed = {
  flightStatuses: FLIGHT_STATUSES_DATA,
};

export const flightStatusesTitle: LocalizedString = {
  en: "Flight Statuses",
  ru: "Статусы рейсов",
  uz: "Parvoz holatlari",
};

export function createFlightStatusesService(db: DbEmulator): FlightStatusesService {
  return {
    async list() {
      return db.list<FlightStatusRow>("flightStatuses");
    },
  };
}
