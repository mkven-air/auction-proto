import { FLIGHTS_DATA } from "../data";
import type { BackendClient } from "./contracts";

export const createMockBackendClient = (): BackendClient => ({
  flights: {
    async listFlights() {
      // Return a cloned array to avoid accidental in-place mutation by consumers.
      return [...FLIGHTS_DATA];
    },
  },
});
