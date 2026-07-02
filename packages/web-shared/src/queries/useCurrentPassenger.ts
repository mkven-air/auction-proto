import { useQuery } from "@tanstack/react-query";
import { passengerBackend } from "../api/httpBackend";
import { queryKeys } from "./keys";

export const useCurrentPassenger = () =>
  useQuery({
    queryKey: queryKeys.currentPassenger,
    queryFn: () => passengerBackend.passengers.getCurrent(),
  });
