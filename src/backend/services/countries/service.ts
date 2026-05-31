import { COUNTRIES_DATA } from "../../../data";
import type { Country } from "../../../types";
import type { DbEmulator, EntitySeed } from "../../db/contracts";
import type { CountriesService } from "./contracts";

export const countriesSeed: EntitySeed = {
  countries: COUNTRIES_DATA,
};

export function createCountriesService(db: DbEmulator): CountriesService {
  return {
    async list() {
      return db.list<Country>("countries");
    },
    async findByIds(ids) {
      if (ids.length === 0) return [];
      return db.queryAll<Country>("countries", {
        filters: [{ field: "id", op: "in", value: ids }],
      });
    },
  };
}
