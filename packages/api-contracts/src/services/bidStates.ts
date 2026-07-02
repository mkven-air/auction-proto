import type { BidStateRow } from "@auction/core";

export type BidStatesService = {
  list: () => Promise<BidStateRow[]>;
};
