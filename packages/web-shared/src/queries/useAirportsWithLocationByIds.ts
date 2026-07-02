import { useQuery } from "@tanstack/react-query";
import { adminBackend } from "../api/httpBackend";
import type { Airport } from "@auction/core";
import { queryKeys } from "./keys";

export const useAirportsWithLocationByIds = (ids: Airport["id"][]) =>
  useQuery({
    queryKey: queryKeys.airportsWithLocationByIds(ids),
    queryFn: () => adminBackend.airports.findWithLocationByIds(ids),
    enabled: ids.length > 0,
  });
