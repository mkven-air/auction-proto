import type { Country } from "@auction/core";

export type CountriesService = {
  list: () => Promise<Country[]>;
  findByIds: (ids: Country["id"][]) => Promise<Country[]>;
};
