import type { TierRow } from "@auction/core";

export type TiersService = {
  list: () => Promise<TierRow[]>;
};
