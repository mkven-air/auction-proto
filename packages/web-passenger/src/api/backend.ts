import type { Flight, Passenger, PassengerConfig, FlightWithRoute, TierRow } from "@auction/core";
import { getJson } from "@auction/web-shared";

/** HTTP client for the passenger API surface (`/api/passenger/*`). */
export const passengerBackend = {
  passengers: {
    getCurrent: async (): Promise<Passenger | undefined> =>
      (await getJson<Passenger | null>("/passenger/me")) ?? undefined,
  },
  passengerConfig: {
    get: (): Promise<PassengerConfig> => getJson("/passenger/config"),
  },
  tiers: {
    list: (): Promise<TierRow[]> => getJson("/passenger/tiers"),
  },
  flights: {
    findDetailById: async (flightId: Flight["id"]): Promise<FlightWithRoute | undefined> =>
      (await getJson<FlightWithRoute | null>(`/passenger/flights/${flightId}/detail`)) ?? undefined,
  },
};
