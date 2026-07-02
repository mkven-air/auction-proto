import { useQuery } from "@tanstack/react-query";
import type { TierRow } from "@auction/core";
import { adminBackend } from "../api/backend";
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
