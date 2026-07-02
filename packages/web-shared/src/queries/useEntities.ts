import { useQuery } from "@tanstack/react-query";
import { adminBackend } from "../api/httpBackend";
import { queryKeys } from "./keys";

export const useEntities = () =>
  useQuery({
    queryKey: queryKeys.entities,
    queryFn: () => adminBackend.entities.listAll(),
  });
