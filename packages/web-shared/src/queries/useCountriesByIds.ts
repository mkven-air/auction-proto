import { useQuery } from "@tanstack/react-query";
import { adminBackend } from "../api/httpBackend";
import type { Country } from "@auction/core";
import { queryKeys } from "./keys";

export const useCountriesByIds = (ids: Country["id"][]) =>
  useQuery({
    queryKey: queryKeys.countriesByIds(ids),
    queryFn: () => adminBackend.countries.findByIds(ids),
    enabled: ids.length > 0,
  });
