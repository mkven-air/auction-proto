import { useQuery } from "@tanstack/react-query";
import { adminBackend } from "../api/httpBackend";
import type { FlightHaulRow } from "@auction/core";
import { queryKeys } from "./keys";

export const useFlightHauls = () =>
  useQuery({
    queryKey: queryKeys.flightHauls,
    queryFn: () => adminBackend.flightHauls.list(),
    staleTime: Number.POSITIVE_INFINITY,
  });

export const useFlightHaulsById = () => {
  const q = useFlightHauls();
  const byId: Partial<Record<FlightHaulRow["id"], FlightHaulRow>> = {};
  for (const r of q.data ?? []) byId[r.id] = r;
  return { ...q, byId };
};
