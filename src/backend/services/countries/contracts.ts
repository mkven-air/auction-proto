import type { Country } from "../../../types";

export type CountriesService = {
  list: () => Promise<Country[]>;
  findByIds: (ids: Country["id"][]) => Promise<Country[]>;
};
