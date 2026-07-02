import { useQuery } from "@tanstack/react-query";
import { adminBackend } from "../api/httpBackend";
import type { FlightStatusRow } from "@auction/core";
import { queryKeys } from "./keys";

export const useFlightStatuses = () =>
  useQuery({
    queryKey: queryKeys.flightStatuses,
    queryFn: () => adminBackend.flightStatuses.list(),
    staleTime: Number.POSITIVE_INFINITY,
  });

export const useFlightStatusesById = () => {
  const q = useFlightStatuses();
  const byId: Partial<Record<FlightStatusRow["id"], FlightStatusRow>> = {};
  for (const r of q.data ?? []) byId[r.id] = r;
  return { ...q, byId };
};
