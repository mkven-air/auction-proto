import type { PassengerConfig } from "@auction/core";

export type PassengerConfigService = {
  get: () => Promise<PassengerConfig>;
};
