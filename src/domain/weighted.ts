import type { Bid } from "../types";

export const weighted = (b: Bid) => Math.round(b.bid * b.mult);
