import { useQuery } from "@tanstack/react-query";
import { passengerBackend } from "../api/backend";
import { queryKeys } from "./keys";

export const usePassengerConfig = () =>
  useQuery({
    queryKey: queryKeys.passengerConfig,
    queryFn: () => passengerBackend.passengerConfig.get(),
  });
