import { useQuery } from "@tanstack/react-query";
import type { Flight } from "@auction/core";
import { adminBackend } from "../api/backend";
import { queryKeys } from "./keys";

export const useFlightDetail = (flightId?: Flight["id"]) =>
  useQuery({
    queryKey: queryKeys.flightDetail(flightId ?? "__pending__"),
    queryFn: () => adminBackend.flights.findDetailById(flightId as Flight["id"]),
    enabled: Boolean(flightId),
  });
