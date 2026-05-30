import { FLIGHTS_DATA, INITIAL_BIDS } from "../../data";
import type { Bid, Flight } from "../../types";
import type { FlightsPage, FlightsSummary } from "./contracts";
import type { AppDb } from "./contracts";
import { createDbEmulator } from "./emulator";

function cloneBids(bids: Bid[]): Bid[] {
  return bids.map((bid) => ({ ...bid }));
}

function summarizeFlights(flights: Flight[]): FlightsSummary {
  return {
    active: flights.filter((f) => f.status === "active").length,
    bids: flights.reduce((sum, f) => sum + f.bids, 0),
    revenue: flights.reduce((sum, f) => sum + f.revenue, 0),
    freeSeats: flights.reduce((sum, f) => sum + f.bcFree, 0),
  };
}

type BidRow = Bid & { flightId: Flight["id"] };

export const createAppInMemoryDb = (): AppDb => {
  const bidRows: BidRow[] = FLIGHTS_DATA.flatMap((flight) =>
    cloneBids(INITIAL_BIDS).map((bid) => ({ ...bid, flightId: flight.id })),
  );
  const db = createDbEmulator({
    flights: FLIGHTS_DATA,
    bids: bidRows,
  });

  return {
    flights: {
      async listFlights() {
        return db.list<Flight>("flights");
      },

      async queryFlights(query) {
        const mappedFilters = query.filters?.map((filter) => ({
          field: String(filter.field),
          op: filter.op,
          value: filter.value,
        }));

        const result = db.query<Flight>("flights", {
          searchFields: ["id", "from", "to", "aircraft"],
          ...(query.search !== undefined ? { search: query.search } : {}),
          ...(mappedFilters !== undefined ? { filters: mappedFilters } : {}),
          ...(query.sortBy !== undefined ? { sortBy: query.sortBy } : {}),
          ...(query.sortDir !== undefined ? { sortDir: query.sortDir } : {}),
          ...(query.page !== undefined ? { page: query.page } : {}),
          ...(query.pageSize !== undefined ? { pageSize: query.pageSize } : {}),
        });

        const filteredForSummary = db.queryAll<Flight>("flights", {
          searchFields: ["id", "from", "to", "aircraft"],
          ...(query.search !== undefined ? { search: query.search } : {}),
          ...(mappedFilters !== undefined ? { filters: mappedFilters } : {}),
          ...(query.sortBy !== undefined ? { sortBy: query.sortBy } : {}),
          ...(query.sortDir !== undefined ? { sortDir: query.sortDir } : {}),
        });

        const page: FlightsPage = {
          items: result.items,
          total: result.total,
          page: result.page,
          pageSize: result.pageSize,
          summary: summarizeFlights(filteredForSummary),
        };

        return page;
      },

      async getFlightsSummary() {
        const allFlights = db.list<Flight>("flights");
        return summarizeFlights(allFlights);
      },

      async getFlightById(flightId) {
        return db.findOne<Flight>("flights", (flight) => flight.id === flightId);
      },
    },
    bids: {
      async listBids(flightId) {
        const all = db.list<BidRow>("bids");
        return all
          .filter((bid) => bid.flightId === flightId)
          .map(({ flightId: _flightId, ...bid }) => bid);
      },

      async setBidState(flightId, bidId, state) {
        const updated = db.updateOne<BidRow>(
          "bids",
          (bid) => bid.flightId === flightId && bid.id === bidId,
          (bid) => ({ ...bid, state }),
        );
        if (!updated) return undefined;
        const { flightId: _flightId, ...bid } = updated;
        return bid;
      },

      async setManyBidStates(flightId, bidIds, state) {
        if (bidIds.length === 0) return;
        const target = new Set(bidIds);
        db.updateMany<BidRow>(
          "bids",
          (bid) => bid.flightId === flightId && target.has(bid.id),
          (bid) => ({ ...bid, state }),
        );
      },
    },
  };
};
