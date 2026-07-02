import { useQuery } from "@tanstack/react-query";
import { adminBackend, passengerBackend } from "../api/httpBackend";
import type { TierRow } from "@auction/core";
import { queryKeys } from "./keys";

export const useTiers = () =>
  useQuery({
    queryKey: queryKeys.tiers,
    queryFn: () => adminBackend.tiers.list(),
    staleTime: Number.POSITIVE_INFINITY,
  });

export const useTiersById = () => {
  const q = useTiers();
  const byId: Partial<Record<TierRow["id"], TierRow>> = {};
  for (const r of q.data ?? []) byId[r.id] = r;
  return { ...q, byId };
};

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
