import type { Airport, AirportWithLocation } from "@auction/core";

export type AirportsService = {
  list: () => Promise<Airport[]>;
  findByIds: (ids: Airport["id"][]) => Promise<Airport[]>;
  listWithLocation: () => Promise<AirportWithLocation[]>;
  findWithLocationByIds: (ids: Airport["id"][]) => Promise<AirportWithLocation[]>;
};
