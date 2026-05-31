import { CITIES_DATA } from "../../../data";
import type { City } from "../../../types";
import type { DbEmulator, EntitySeed } from "../../db/contracts";
import type { CitiesService } from "./contracts";

export const citiesSeed: EntitySeed = {
  cities: CITIES_DATA,
};

export function createCitiesService(db: DbEmulator): CitiesService {
  return {
    async list() {
      return db.list<City>("cities");
    },
    async findByIds(ids) {
      if (ids.length === 0) return [];
      return db.queryAll<City>("cities", {
        filters: [{ field: "id", op: "in", value: ids }],
      });
    },
  };
}
