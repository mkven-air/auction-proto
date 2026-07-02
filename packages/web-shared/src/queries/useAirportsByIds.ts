import { useQuery } from "@tanstack/react-query";
import { adminBackend } from "../api/httpBackend";
import type { Airport } from "@auction/core";
import { queryKeys } from "./keys";

export const useAirportsByIds = (ids: Airport["id"][]) =>
  useQuery({
    queryKey: queryKeys.airportsByIds(ids),
    queryFn: () => adminBackend.airports.findByIds(ids),
    enabled: ids.length > 0,
  });
