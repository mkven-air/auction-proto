import { COUNTRIES_DATA } from "../../../data/countries";
import type { Country, LocalizedString } from "@auction/core";
import type { DbEmulator, EntitySeed } from "../../db/contracts";
import type { CountriesService } from "@auction/api-contracts/admin";

export const countriesSeed: EntitySeed = {
  countries: COUNTRIES_DATA,
};

export const countriesTitle: LocalizedString = { en: "Countries", ru: "Страны", uz: "Mamlakatlar" };

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
