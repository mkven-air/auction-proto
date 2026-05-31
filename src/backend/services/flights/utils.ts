import type { DbFilter, DbQuery } from "../../db/contracts";
import type { FlightQuery } from "./contracts";

const SEARCH_FIELDS = ["id", "fromAirportId", "toAirportId", "aircraft"];

export function toDbFilters(query: FlightQuery): DbFilter[] | undefined {
  return query.filters?.map((filter) => ({
    field: String(filter.field),
    op: filter.op,
    value: filter.value,
  }));
}

export function toFlightQueryParams(query: FlightQuery, filters: DbFilter[] | undefined): DbQuery {
  return {
    searchFields: SEARCH_FIELDS,
    ...(query.search !== undefined ? { search: query.search } : {}),
    ...(filters !== undefined ? { filters } : {}),
    ...(query.sortBy !== undefined ? { sortBy: query.sortBy } : {}),
    ...(query.sortDir !== undefined ? { sortDir: query.sortDir } : {}),
    ...(query.page !== undefined ? { page: query.page } : {}),
    ...(query.pageSize !== undefined ? { pageSize: query.pageSize } : {}),
  };
}

export function toFlightSummaryQueryParams(
  query: FlightQuery,
  filters: DbFilter[] | undefined,
): Omit<DbQuery, "page" | "pageSize"> {
  return {
    searchFields: SEARCH_FIELDS,
    ...(query.search !== undefined ? { search: query.search } : {}),
    ...(filters !== undefined ? { filters } : {}),
    ...(query.sortBy !== undefined ? { sortBy: query.sortBy } : {}),
    ...(query.sortDir !== undefined ? { sortDir: query.sortDir } : {}),
  };
}
