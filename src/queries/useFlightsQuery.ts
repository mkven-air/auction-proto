import { useQuery } from "@tanstack/react-query";
import type { FlightQuery } from "../backend/contracts";
import { backendClient } from "../backend/client";
import { queryKeys } from "./keys";

export const useFlightsQuery = (query: FlightQuery) =>
  useQuery({
    queryKey: queryKeys.flightsQuery({
      ...(query.search !== undefined ? { search: query.search } : {}),
      ...(query.filters !== undefined ? { filters: JSON.stringify(query.filters) } : {}),
      ...(query.sortBy !== undefined ? { sortBy: query.sortBy } : {}),
      ...(query.sortDir !== undefined ? { sortDir: query.sortDir } : {}),
      ...(query.page !== undefined ? { page: query.page } : {}),
      ...(query.pageSize !== undefined ? { pageSize: query.pageSize } : {}),
    }),
    queryFn: () => backendClient.flights.queryFlights(query),
  });
