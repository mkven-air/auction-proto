import type { FlightStatusRow } from "@auction/core";

export type FlightStatusesService = {
  list: () => Promise<FlightStatusRow[]>;
};
