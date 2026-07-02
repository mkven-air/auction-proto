import { FLIGHTS_DATA } from "../../../data/flights";
import type {
  Bid,
  Flight,
  FlightListSortCol,
  FlightWithStats,
  LocalizedString,
  SortDir,
} from "@auction/core";
import type { DbEmulator, EntitySeed } from "../../db/contracts";
import { findAirportsWithLocationByIds } from "../airports/utils";
import type { FlightsService, FlightsSummary } from "@auction/api-contracts/admin";
import { toDbFilters, toFlightQueryParams, toFlightSummaryQueryParams } from "./utils";

export const flightsSeed: EntitySeed = {
  flights: FLIGHTS_DATA,
};

export const flightsTitle: LocalizedString = { en: "Flights", ru: "Рейсы", uz: "Reyslar" };

function computeStats(db: DbEmulator, flight: Flight) {
  const bids = db.queryAll<Bid>("bids", {
    filters: [
      { field: "flightId", op: "eq", value: flight.id },
      { field: "product", op: "eq", value: "businessClass" },
    ],
  });
  const topBid = bids.reduce((max, row) => (row.bid > max ? row.bid : max), 0);
  return {
    bids: bids.length,
    topBid,
    revenue: flight.bcFree * topBid,
  };
}

function enrichFlight(db: DbEmulator, flight: Flight): FlightWithStats {
  return { ...flight, ...computeStats(db, flight) };
}

function summarizeFlights(flights: FlightWithStats[]): FlightsSummary {
  return {
    active: flights.filter((f) => f.status === "active").length,
    bids: flights.reduce((sum, f) => sum + f.bids, 0),
    revenue: flights.reduce((sum, f) => sum + f.revenue, 0),
    freeSeats: flights.reduce((sum, f) => sum + f.bcFree, 0),
  };
}

const STAT_SORT_COLS: ReadonlyArray<FlightListSortCol> = ["bids", "topBid", "revenue"];

function sortFlights(
  flights: FlightWithStats[],
  sortBy: FlightListSortCol | undefined,
  sortDir: SortDir | undefined,
): FlightWithStats[] {
  if (!sortBy) return flights;
  const dir = sortDir === "desc" ? -1 : 1;
  return [...flights].sort((a, b) => {
    const va = a[sortBy];
    const vb = b[sortBy];
    if (va === vb) return 0;
    return va > vb ? dir : -dir;
  });
}

export function createFlightsService(db: DbEmulator): FlightsService {
  const enrich = (flight: Flight) => enrichFlight(db, flight);

  return {
    async list() {
      return db.list<Flight>("flights").map(enrich);
    },

    async query(query) {
      const mappedFilters = toDbFilters(query);
      const sortByStat = query.sortBy !== undefined && STAT_SORT_COLS.includes(query.sortBy);

      if (sortByStat) {
        const summaryParams = toFlightSummaryQueryParams(query, mappedFilters);
        const { sortBy: _ignoredSortBy, sortDir: _ignoredSortDir, ...withoutSort } = summaryParams;
        const all = db.queryAll<Flight>("flights", withoutSort).map(enrich);
        const sorted = sortFlights(all, query.sortBy, query.sortDir);
        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? sorted.length;
        const start = (page - 1) * pageSize;
        return {
          items: sorted.slice(start, start + pageSize),
          total: sorted.length,
          page,
          pageSize,
          summary: summarizeFlights(all),
        };
      }

      const result = db.query<Flight>("flights", toFlightQueryParams(query, mappedFilters));
      const filteredForSummary = db
        .queryAll<Flight>("flights", toFlightSummaryQueryParams(query, mappedFilters))
        .map(enrich);
      return {
        items: result.items.map(enrich),
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        summary: summarizeFlights(filteredForSummary),
      };
    },

    async getSummary() {
      return summarizeFlights(db.list<Flight>("flights").map(enrich));
    },

    async findById(flightId) {
      const flight = db.findOne<Flight>("flights", [{ field: "id", op: "eq", value: flightId }]);
      return flight ? enrich(flight) : undefined;
    },

    async findDetailById(flightId) {
      const flight = db.findOne<Flight>("flights", [{ field: "id", op: "eq", value: flightId }]);
      if (!flight) return undefined;
      const enriched = enrich(flight);
      const airports = findAirportsWithLocationByIds(db, [
        flight.fromAirportId,
        flight.toAirportId,
      ]);
      const fromAirport = airports.find((a) => a.id === flight.fromAirportId);
      const toAirport = airports.find((a) => a.id === flight.toAirportId);
      if (!fromAirport || !toAirport) return undefined;
      return { ...enriched, fromAirport, toAirport };
    },
  };
}
