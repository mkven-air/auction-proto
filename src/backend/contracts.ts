import type { Flight } from "../types";

export type FlightsService = {
  listFlights: () => Promise<Flight[]>;
};

export type BackendClient = {
  flights: FlightsService;
};
