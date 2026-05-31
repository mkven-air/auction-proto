import type { Airport, AirportWithLocation } from "../../../types";

export type AirportsService = {
  list: () => Promise<Airport[]>;
  findByIds: (ids: Airport["id"][]) => Promise<Airport[]>;
  listWithLocation: () => Promise<AirportWithLocation[]>;
  findWithLocationByIds: (ids: Airport["id"][]) => Promise<AirportWithLocation[]>;
};
