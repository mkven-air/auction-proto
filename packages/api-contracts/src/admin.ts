import type { LocalizedString } from "@auction/core";
import type { AirportsService } from "./services/airports";
import type { BidStatesService } from "./services/bidStates";
import type { BidsService } from "./services/bids";
import type { CitiesService } from "./services/cities";
import type { CountriesService } from "./services/countries";
import type { FlightHaulsService } from "./services/flightHauls";
import type { FlightStatusesService } from "./services/flightStatuses";
import type { FlightsService } from "./services/flights";
import type { PassengersService } from "./services/passengers";
import type { RulesService } from "./services/rules";
import type { TiersService } from "./services/tiers";

/** Raw table row shape exposed by the entities inspector endpoint. */
export type EntityRow = Record<string, unknown>;

export type EntityTable = {
  name: string;
  title: LocalizedString;
  rows: EntityRow[];
};

export type EntitiesService = {
  listAll: () => Promise<EntityTable[]>;
};

/**
 * Admin API surface: full authority over flight operations, bid moderation,
 * global rules and raw entity tables, plus ownership of all reference data.
 */
export type AdminBackendClient = {
  flights: FlightsService;
  bids: BidsService;
  rules: RulesService;
  entities: EntitiesService;
  airports: AirportsService;
  cities: CitiesService;
  countries: CountriesService;
  passengers: PassengersService;
  tiers: TiersService;
  bidStates: BidStatesService;
  flightStatuses: FlightStatusesService;
  flightHauls: FlightHaulsService;
};

export type {
  AirportsService,
  BidStatesService,
  BidsService,
  CitiesService,
  CountriesService,
  FlightHaulsService,
  FlightStatusesService,
  FlightsService,
  PassengersService,
  RulesService,
  TiersService,
};
export type {
  FlightFilter,
  FlightQuery,
  FlightsPage,
  FlightsSummary,
} from "./services/flights";
