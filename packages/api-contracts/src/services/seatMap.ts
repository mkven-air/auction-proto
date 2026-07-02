import type { Flight, SeatMapLayout } from "@auction/core";

export type SeatMapService = {
  getBusinessClass: (flightId: Flight["id"]) => Promise<SeatMapLayout>;
};
