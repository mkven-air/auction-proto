import type { FlightHaulRow } from "@auction/core";

export type FlightHaulsService = {
  list: () => Promise<FlightHaulRow[]>;
};
