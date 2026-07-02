import { useQuery } from "@tanstack/react-query";
import type { BidProduct, Flight } from "@auction/core";
import { adminBackend } from "../api/backend";
import { queryKeys } from "./keys";

export const useFlightBids = (flightId: Flight["id"], product: BidProduct) =>
  useQuery({
    queryKey: queryKeys.flightBids(flightId, product),
    queryFn: () => adminBackend.bids.list(flightId, product),
  });
