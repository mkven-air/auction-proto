import type {
  AirportsService,
  BidsService,
  BidStatesService,
  CitiesService,
  CountriesService,
  EntitiesService,
  FlightHaulsService,
  FlightStatusesService,
  FlightsService,
  PassengersService,
  RulesService,
  SeatMapService,
  TiersService,
} from "@auction/api-contracts/admin";
import type { PassengerConfigService } from "@auction/api-contracts/passenger";

export type * from "@auction/api-contracts";

/**
 * Combined admin ∪ passenger surface used by `createServiceClient()` so backend
 * tests can exercise every capability through a single entry point.
 */
export type BackendClient = {
  flights: FlightsService;
  bids: BidsService;
  airports: AirportsService;
  cities: CitiesService;
  countries: CountriesService;
  passengers: PassengersService;
  tiers: TiersService;
  rules: RulesService;
  passengerConfig: PassengerConfigService;
  seatMap: SeatMapService;
  bidStates: BidStatesService;
  flightStatuses: FlightStatusesService;
  flightHauls: FlightHaulsService;
  entities: EntitiesService;
};
