import { useQuery } from "@tanstack/react-query";
import type { BidProduct, Flight } from "../types";
import { backendClient } from "../backend/client";
import { queryKeys } from "./keys";

export const useFlightBids = (flightId: Flight["id"], product: BidProduct) =>
  useQuery({
    queryKey: queryKeys.flightBids(flightId, product),
    queryFn: () => backendClient.bids.list(flightId, product),
  });
