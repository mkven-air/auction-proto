import { useQuery } from "@tanstack/react-query";
import { adminBackend } from "../api/backend";
import type { City } from "@auction/core";
import { queryKeys } from "./keys";

export const useCitiesByIds = (ids: City["id"][]) =>
  useQuery({
    queryKey: queryKeys.citiesByIds(ids),
    queryFn: () => adminBackend.cities.findByIds(ids),
    enabled: ids.length > 0,
  });
