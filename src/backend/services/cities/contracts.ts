import type { City } from "../../../types";

export type CitiesService = {
  list: () => Promise<City[]>;
  findByIds: (ids: City["id"][]) => Promise<City[]>;
};
