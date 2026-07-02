import { useQuery } from "@tanstack/react-query";
import type { TierRow } from "@auction/core";
import { passengerBackend } from "../api/backend";
import { queryKeys } from "./keys";

export const usePassengerTiers = () =>
  useQuery({
    queryKey: queryKeys.tiers,
    queryFn: () => passengerBackend.tiers.list(),
    staleTime: Number.POSITIVE_INFINITY,
  });

export const usePassengerTiersById = () => {
  const q = usePassengerTiers();
  const byId: Partial<Record<TierRow["id"], TierRow>> = {};
  for (const r of q.data ?? []) byId[r.id] = r;
  return { ...q, byId };
};
