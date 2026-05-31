import type { Bid, Flight } from "../../../types";
import type { DbFilter } from "../../db/contracts";

export type BidRow = Bid & { flightId: Flight["id"] };

export function bidRowsToBids(rows: BidRow[]): Bid[] {
  return rows.map(({ flightId: _flightId, ...bid }) => bid);
}

export function toBidRowFilters(flightId: Flight["id"], bidId?: Bid["id"]): DbFilter[] {
  const filters: DbFilter[] = [{ field: "flightId", op: "eq", value: flightId }];
  if (bidId !== undefined) {
    filters.push({ field: "id", op: "eq", value: bidId });
  }
  return filters;
}
