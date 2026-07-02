import { CITIES_DATA } from "../../../data/cities";
import type { City, LocalizedString } from "@auction/core";
import type { DbEmulator, EntitySeed } from "../../db/contracts";
import type { CitiesService } from "@auction/api-contracts/admin";

export const citiesSeed: EntitySeed = {
  cities: CITIES_DATA,
};

export const citiesTitle: LocalizedString = { en: "Cities", ru: "Города", uz: "Shaharlar" };

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
