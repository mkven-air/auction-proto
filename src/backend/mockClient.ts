import { FLIGHTS_DATA } from "../data";
import { INITIAL_BIDS, weighted } from "../data";
import type { Bid, Flight } from "../types";
import type {
  BackendClient,
  FlightFilter,
  FlightQuery,
  FlightsPage,
  FlightsSummary,
} from "./contracts";
import {
  composeBeforeCall,
  createJitterSleeper,
  createMockFailureInjector,
  getMockLatencyRange,
  withLatency,
} from "./latency";

function cloneBids(bids: Bid[]): Bid[] {
  return bids.map((bid) => ({ ...bid }));
}

function createInitialBidsByFlightId(flights: Flight[]): Map<Flight["id"], Bid[]> {
  const entries = flights.map((flight) => [flight.id, cloneBids(INITIAL_BIDS)] as const);
  return new Map(entries);
}

function summarizeFlights(flights: Flight[]): FlightsSummary {
  return {
    active: flights.filter((f) => f.status === "active").length,
    bids: flights.reduce((sum, f) => sum + f.bids, 0),
    revenue: flights.reduce((sum, f) => sum + f.revenue, 0),
    freeSeats: flights.reduce((sum, f) => sum + f.bcFree, 0),
  };
}

function queryFlightsData(query: FlightQuery): FlightsPage {
  const search = (query.search ?? "").trim().toLowerCase();
  const filters = query.filters ?? [];
  const sortBy = query.sortBy ?? "dep";
  const sortDir = query.sortDir ?? "asc";
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.max(1, query.pageSize ?? 6);

  const toComparableString = (value: unknown) => String(value ?? "").toLowerCase();
  const matchesFilter = (flight: Flight, filter: FlightFilter): boolean => {
    const fieldValue = flight[filter.field];

    if (filter.op === "eq") {
      return String(fieldValue) === String(filter.value);
    }

    if (filter.op === "contains") {
      return toComparableString(fieldValue).includes(toComparableString(filter.value));
    }

    if (!Array.isArray(filter.value)) return false;
    return filter.value.map((v) => String(v)).includes(String(fieldValue));
  };

  const filtered = FLIGHTS_DATA.filter((flight) => {
    const filtersOk = filters.every((filter) => matchesFilter(flight, filter));
    if (!filtersOk) return false;
    if (!search) return true;

    const haystack = [flight.id, flight.from, flight.to, flight.aircraft].join(" ").toLowerCase();
    return haystack.includes(search);
  }).sort((a, b) => {
    const vals = {
      dep: [a.dep, b.dep],
      bids: [a.bids, b.bids],
      revenue: [a.revenue, b.revenue],
      topBid: [a.topBid, b.topBid],
    } as const;
    const [va, vb] = vals[sortBy];
    return sortDir === "asc" ? (va > vb ? 1 : -1) : vb > va ? 1 : -1;
  });

  const total = filtered.length;
  const offset = (page - 1) * pageSize;
  const items = filtered.slice(offset, offset + pageSize);

  return {
    items: [...items],
    total,
    page,
    pageSize,
    summary: summarizeFlights(filtered),
  };
}

export const createMockBackendClient = (): BackendClient => {
  const bidsByFlightId = createInitialBidsByFlightId(FLIGHTS_DATA);

  const getMutableBids = (flightId: Flight["id"]): Bid[] => {
    const existing = bidsByFlightId.get(flightId);
    if (existing) return existing;
    const seeded = cloneBids(INITIAL_BIDS);
    bidsByFlightId.set(flightId, seeded);
    return seeded;
  };

  const baseClient: BackendClient = {
    flights: {
      async listFlights() {
        // Return a cloned array to avoid accidental in-place mutation by consumers.
        return [...FLIGHTS_DATA];
      },

      async queryFlights(query) {
        return queryFlightsData(query);
      },

      async getFlightsSummary() {
        return summarizeFlights(FLIGHTS_DATA);
      },

      async getFlightById(flightId) {
        return FLIGHTS_DATA.find((flight) => flight.id === flightId);
      },
    },
    bids: {
      async listBids(flightId) {
        return cloneBids(getMutableBids(flightId));
      },

      async approveBid(flightId, bidId) {
        const mutable = getMutableBids(flightId);
        const found = mutable.find((bid) => bid.id === bidId);
        if (!found) return undefined;
        found.state = "approved";
        return { ...found };
      },

      async rejectBid(flightId, bidId) {
        const mutable = getMutableBids(flightId);
        const found = mutable.find((bid) => bid.id === bidId);
        if (!found) return undefined;
        found.state = "rejected";
        return { ...found };
      },

      async autoSelect(flightId) {
        const mutable = getMutableBids(flightId);
        const flight = FLIGHTS_DATA.find((item) => item.id === flightId);
        const availableSeats = flight?.bcFree ?? 0;

        const winners = [...mutable]
          .filter((bid) => bid.state === "pending")
          .sort((a, b) => weighted(b) - weighted(a))
          .slice(0, availableSeats)
          .map((bid) => bid.id);

        for (const bid of mutable) {
          if (winners.includes(bid.id)) {
            bid.state = "approved";
          }
        }

        return winners;
      },
    },
  };

  const sleep = createJitterSleeper(getMockLatencyRange);
  const maybeFail = createMockFailureInjector();
  const beforeCall = composeBeforeCall(async () => sleep(), maybeFail);
  return withLatency(baseClient, beforeCall);
};
