import { useQuery } from "@tanstack/react-query";
import { adminBackend } from "../api/httpBackend";
import { queryKeys } from "./keys";

export const useFlightsSummary = () =>
  useQuery({
    queryKey: queryKeys.flightsSummary,
    queryFn: () => adminBackend.flights.getSummary(),
  });
