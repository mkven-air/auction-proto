import type { AirportsService } from "./services/airports";
import type { CitiesService } from "./services/cities";
import type { CountriesService } from "./services/countries";
import type { FlightHaulsService } from "./services/flightHauls";
import type { FlightsService } from "./services/flights";
import type { PassengerConfigService } from "./services/passengerConfig";
import type { PassengersService } from "./services/passengers";
import type { RulesService } from "./services/rules";
import type { SeatMapService } from "./services/seatMap";
import type { TiersService } from "./services/tiers";

/** Passengers may only read a single flight's detail, never the admin listing/query surface. */
export type PassengerFlightsService = Pick<FlightsService, "findDetailById">;

/** Passengers may read the active rules but never mutate them. */
export type PassengerRulesService = Pick<RulesService, "get">;

/**
 * Passenger API surface: a read-mostly facade tailored to the passenger app.
 * Owns passenger-specific services (bid config, seat map) and delegates shared
 * reads via a narrowed, safe subset.
 */
export type PassengerBackendClient = {
  passengerConfig: PassengerConfigService;
  seatMap: SeatMapService;
  passengers: PassengersService;
  flights: PassengerFlightsService;
  rules: PassengerRulesService;
  tiers: TiersService;
  flightHauls: FlightHaulsService;
  airports: AirportsService;
  cities: CitiesService;
  countries: CountriesService;
};

export type {
  AirportsService,
  CitiesService,
  CountriesService,
  FlightHaulsService,
  FlightsService,
  PassengerConfigService,
  PassengersService,
  RulesService,
  SeatMapService,
  TiersService,
};
