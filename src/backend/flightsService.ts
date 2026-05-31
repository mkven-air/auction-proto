import type { Flight } from "../types";
import type { FlightsService } from "./contracts";
import type { DbEmulator } from "./db/emulator";
import { toDbFilters, toFlightQueryParams, toFlightSummaryQueryParams } from "./serviceUtils";

function summarizeFlights(flights: Flight[]) {
  return {
    active: flights.filter((f) => f.status === "active").length,
    bids: flights.reduce((sum, f) => sum + f.bids, 0),
    revenue: flights.reduce((sum, f) => sum + f.revenue, 0),
    freeSeats: flights.reduce((sum, f) => sum + f.bcFree, 0),
  };
}

function toFlightsPage(
  result: { items: Flight[]; total: number; page: number; pageSize: number },
  filteredForSummary: Flight[],
) {
  return {
    items: result.items,
    total: result.total,
    page: result.page,
    pageSize: result.pageSize,
    summary: summarizeFlights(filteredForSummary),
  };
}

export function createFlightsService(db: DbEmulator): FlightsService {
  return {
    async listFlights() {
      return db.list<Flight>("flights");
    },

    async queryFlights(query) {
      const mappedFilters = toDbFilters(query);
      const queryParams = toFlightQueryParams(query, mappedFilters);
      const result = db.query<Flight>("flights", queryParams);
      const filteredForSummary = db.queryAll<Flight>(
        "flights",
        toFlightSummaryQueryParams(query, mappedFilters),
      );
      return toFlightsPage(result, filteredForSummary);
    },

    async getFlightsSummary() {
      return summarizeFlights(db.list<Flight>("flights"));
    },

    async getFlightById(flightId) {
      return db.findOne<Flight>("flights", [{ field: "id", op: "eq", value: flightId }]);
    },
  };
}
