import { AIRPORTS_DATA } from "../../../data/airports";
import type { Airport, LocalizedString } from "@auction/core";
import type { DbEmulator, EntitySeed } from "../../db/contracts";
import type { AirportsService } from "@auction/api-contracts/admin";
import { findAirportsWithLocationByIds, loadAirportsWithLocation } from "./utils";

export const airportsSeed: EntitySeed = {
  airports: AIRPORTS_DATA,
};

export const airportsTitle: LocalizedString = {
  en: "Airports",
  ru: "Аэропорты",
  uz: "Aeroportlar",
};

export function createAirportsService(db: DbEmulator): AirportsService {
  return {
    async list() {
      return db.list<Airport>("airports");
    },
    async findByIds(ids) {
      if (ids.length === 0) return [];
      return db.queryAll<Airport>("airports", {
        filters: [{ field: "id", op: "in", value: ids }],
      });
    },
    async listWithLocation() {
      return loadAirportsWithLocation(db, db.list<Airport>("airports"));
    },
    async findWithLocationByIds(ids) {
      return findAirportsWithLocationByIds(db, ids);
    },
  };
}
