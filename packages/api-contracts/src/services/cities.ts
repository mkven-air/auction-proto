import type { City } from "@auction/core";

export type CitiesService = {
  list: () => Promise<City[]>;
  findByIds: (ids: City["id"][]) => Promise<City[]>;
};
