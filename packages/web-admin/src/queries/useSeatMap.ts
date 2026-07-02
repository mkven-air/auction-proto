import { useQuery } from "@tanstack/react-query";
import type { Flight } from "@auction/core";
import { adminBackend } from "../api/backend";
import { queryKeys } from "./keys";

export const useSeatMap = (flightId: Flight["id"]) =>
  useQuery({
    queryKey: queryKeys.seatMap(flightId),
    queryFn: () => adminBackend.seatMap.getBusinessClass(flightId),
  });
