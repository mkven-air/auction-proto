import { createPassengerConfigService } from "../services/passengerConfig/service";
import type { AdminBackendClient } from "../admin/contracts";
import type { PassengerBackendClient } from "./contracts";

/**
 * Builds the passenger backend on top of the admin backend, the way a passenger-facing
 * BFF would call internal admin services in a real system. Passenger-owned capabilities
 * are created here; shared reads are delegated to (and narrowed from) the admin client.
 */
export function createPassengerClient(admin: AdminBackendClient): PassengerBackendClient {
  return {
    passengerConfig: createPassengerConfigService(),
    passengers: admin.passengers,
    flights: { findDetailById: admin.flights.findDetailById },
    rules: { get: admin.rules.get },
    tiers: admin.tiers,
    flightHauls: admin.flightHauls,
    airports: admin.airports,
    cities: admin.cities,
    countries: admin.countries,
  };
}
