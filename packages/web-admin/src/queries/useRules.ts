import { useQuery } from "@tanstack/react-query";
import { adminBackend } from "../api/backend";
import { queryKeys } from "./keys";

export const useRules = () =>
  useQuery({
    queryKey: queryKeys.rules,
    queryFn: () => adminBackend.rules.get(),
  });
