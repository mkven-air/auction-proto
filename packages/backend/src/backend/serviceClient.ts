import type { LocalizedString } from "@auction/core";
import { createAdminClient } from "./admin/client";
import type { AdminBackendClient } from "./admin/contracts";
import type { BackendClient } from "./contracts";
import { createDbEmulator } from "./db/emulator";
import { createPassengerClient } from "./passenger/client";
import type { PassengerBackendClient } from "./passenger/contracts";
import { airportsSeed, airportsTitle } from "./services/airports/service";
import { bidsSeed, bidsTitle } from "./services/bids/service";
import { bidStatesSeed, bidStatesTitle } from "./services/bidStates/service";
import { citiesSeed, citiesTitle } from "./services/cities/service";
import { countriesSeed, countriesTitle } from "./services/countries/service";
import { flightHaulsSeed, flightHaulsTitle } from "./services/flightHauls/service";
import { flightStatusesSeed, flightStatusesTitle } from "./services/flightStatuses/service";
import { flightsSeed, flightsTitle } from "./services/flights/service";
import { passengersSeed, passengersTitle } from "./services/passengers/service";
import { tiersSeed, tiersTitle } from "./services/tiers/service";

function buildBaseClients(): {
  admin: AdminBackendClient;
  passenger: PassengerBackendClient;
} {
  const db = createDbEmulator({
    ...flightsSeed,
    ...bidsSeed,
    ...airportsSeed,
    ...citiesSeed,
    ...countriesSeed,
    ...passengersSeed,
    ...tiersSeed,
    ...bidStatesSeed,
    ...flightStatusesSeed,
    ...flightHaulsSeed,
  });

  const entityTitles: Record<string, LocalizedString> = {
    flights: flightsTitle,
    bids: bidsTitle,
    airports: airportsTitle,
    cities: citiesTitle,
    countries: countriesTitle,
    passengers: passengersTitle,
    tiers: tiersTitle,
    bidStates: bidStatesTitle,
    flightStatuses: flightStatusesTitle,
    flightHauls: flightHaulsTitle,
  };

  const admin = createAdminClient(db, entityTitles);
  const passenger = createPassengerClient(admin);
  return { admin, passenger };
}

/**
 * Composition root for the split backend. Returns the admin and passenger
 * clients; the passenger client delegates shared reads to admin.
 */
export const createBackend = (): {
  admin: AdminBackendClient;
  passenger: PassengerBackendClient;
} => buildBaseClients();

/**
 * Combined client exposing the full admin + passenger surface. Used by backend
 * tests so each capability can be exercised through a single entry point.
 */
export const createServiceClient = (): BackendClient => {
  const { admin, passenger } = buildBaseClients();
  return { ...passenger, ...admin };
};
