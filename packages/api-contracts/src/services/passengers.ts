import type { Passenger } from "@auction/core";

export type PassengersService = {
  getCurrent: () => Promise<Passenger | undefined>;
};
