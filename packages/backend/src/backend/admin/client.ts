import type { LocalizedString } from "@auction/core";
import type { DbEmulator } from "../db/emulator";
import { createAirportsService } from "../services/airports/service";
import { createBidsService } from "../services/bids/service";
import { createBidStatesService } from "../services/bidStates/service";
import { createCitiesService } from "../services/cities/service";
import { createCountriesService } from "../services/countries/service";
import { createFlightHaulsService } from "../services/flightHauls/service";
import { createFlightStatusesService } from "../services/flightStatuses/service";
import { createFlightsService } from "../services/flights/service";
import { createPassengersService } from "../services/passengers/service";
import { createRulesService } from "../services/rules/service";
import { createSeatMapService } from "../services/seatMap/service";
import { createTiersService } from "../services/tiers/service";
import type { AdminBackendClient, EntitiesService } from "./contracts";

function createEntitiesService(
  db: DbEmulator,
  titles: Record<string, LocalizedString>,
): EntitiesService {
  return {
    async listAll() {
      return db.tableNames().map((name) => ({
        name,
        title: titles[name] ?? { en: name, ru: name },
        rows: db.list(name),
      }));
    },
  };
}

export function createAdminClient(
  db: DbEmulator,
  entityTitles: Record<string, LocalizedString>,
): AdminBackendClient {
  return {
    flights: createFlightsService(db),
    bids: createBidsService(db),
    rules: createRulesService(),
    entities: createEntitiesService(db, entityTitles),
    airports: createAirportsService(db),
    cities: createCitiesService(db),
    countries: createCountriesService(db),
    passengers: createPassengersService(db),
    tiers: createTiersService(db),
    bidStates: createBidStatesService(db),
    flightStatuses: createFlightStatusesService(db),
    flightHauls: createFlightHaulsService(db),
    seatMap: createSeatMapService(),
  };
}
