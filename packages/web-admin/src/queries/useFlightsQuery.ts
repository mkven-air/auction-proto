import { useQuery } from "@tanstack/react-query";
import type { FlightQuery } from "@auction/api-contracts/admin";
import { adminBackend } from "../api/backend";
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
    queryFn: () => adminBackend.flights.query(query),
  });
