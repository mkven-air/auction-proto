import { AIRPORTS_DATA } from "../../../data";
import type { Airport, AirportWithLocation, City, Country } from "../../../types";
import type { DbEmulator, EntitySeed } from "../../db/contracts";
import type { AirportsService } from "./contracts";

export const airportsSeed: EntitySeed = {
  airports: AIRPORTS_DATA,
};

function joinWithLocation(
  airports: Airport[],
  cities: City[],
  countries: Country[],
): AirportWithLocation[] {
  const cityById = new Map(cities.map((city) => [city.id, city]));
  const countryById = new Map(countries.map((country) => [country.id, country]));
  return airports.flatMap((airport) => {
    const city = cityById.get(airport.cityId);
    if (!city) return [];
    const country = countryById.get(city.countryId);
    if (!country) return [];
    return [{ ...airport, city, country }];
  });
}

export function createAirportsService(db: DbEmulator): AirportsService {
  const loadLocations = (airports: Airport[]) => {
    if (airports.length === 0) return [];
    const cityIds = Array.from(new Set(airports.map((a) => a.cityId)));
    const cities = db.queryAll<City>("cities", {
      filters: [{ field: "id", op: "in", value: cityIds }],
    });
    const countryIds = Array.from(new Set(cities.map((c) => c.countryId)));
    const countries = db.queryAll<Country>("countries", {
      filters: [{ field: "id", op: "in", value: countryIds }],
    });
    return joinWithLocation(airports, cities, countries);
  };

  return {
    async list() {
      return db.list<Airport>("airports");
    },
    async findByIds(ids) {
      if (ids.length === 0) return [];
      return db.queryAll<Airport>("airports", {
        filters: [{ field: "id", op: "in", value: ids }],
      });
    },
    async listWithLocation() {
      return loadLocations(db.list<Airport>("airports"));
    },
    async findWithLocationByIds(ids) {
      if (ids.length === 0) return [];
      const airports = db.queryAll<Airport>("airports", {
        filters: [{ field: "id", op: "in", value: ids }],
      });
      return loadLocations(airports);
    },
  };
}
