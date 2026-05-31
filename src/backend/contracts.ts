import type { DbRow } from "./db/contracts";
import type { AirportsService } from "./services/airports/contracts";
import type { BidsService } from "./services/bids/contracts";
import type { CitiesService } from "./services/cities/contracts";
import type { CountriesService } from "./services/countries/contracts";
import type { FlightsService } from "./services/flights/contracts";

export type {
  FlightFilter,
  FlightQuery,
  FlightsPage,
  FlightsService,
  FlightsSummary,
} from "./services/flights/contracts";
export type { BidsService } from "./services/bids/contracts";
export type { AirportsService } from "./services/airports/contracts";
export type { CitiesService } from "./services/cities/contracts";
export type { CountriesService } from "./services/countries/contracts";

export type EntityTable = {
  name: string;
  rows: DbRow[];
};

export type EntitiesService = {
  listAll: () => Promise<EntityTable[]>;
};

export type BackendClient = {
  flights: FlightsService;
  bids: BidsService;
  airports: AirportsService;
  cities: CitiesService;
  countries: CountriesService;
  entities: EntitiesService;
};
