import { weighted } from "../data";
import type { BackendClient } from "./contracts";
import { createAppInMemoryDb } from "./db/appInMemoryDb";
import {
  composeBeforeCall,
  createJitterSleeper,
  createMockFailureInjector,
  getMockLatencyRange,
  withLatency,
} from "./latency";

export const createServiceClient = (): BackendClient => {
  const db = createAppInMemoryDb();

  const baseClient: BackendClient = {
    flights: {
      async listFlights() {
        return db.flights.listFlights();
      },

      async queryFlights(query) {
        return db.flights.queryFlights(query);
      },

      async getFlightsSummary() {
        return db.flights.getFlightsSummary();
      },

      async getFlightById(flightId) {
        return db.flights.getFlightById(flightId);
      },
    },
    bids: {
      async listBids(flightId) {
        return db.bids.listBids(flightId);
      },

      async approveBid(flightId, bidId) {
        return db.bids.setBidState(flightId, bidId, "approved");
      },

      async rejectBid(flightId, bidId) {
        return db.bids.setBidState(flightId, bidId, "rejected");
      },

      async autoSelect(flightId) {
        const mutable = await db.bids.listBids(flightId);
        const flight = await db.flights.getFlightById(flightId);
        const availableSeats = flight?.bcFree ?? 0;

        const winners = [...mutable]
          .filter((bid) => bid.state === "pending")
          .sort((a, b) => weighted(b) - weighted(a))
          .slice(0, availableSeats)
          .map((bid) => bid.id);

        await db.bids.setManyBidStates(flightId, winners, "approved");

        return winners;
      },
    },
  };

  const sleep = createJitterSleeper(getMockLatencyRange);
  const maybeFail = createMockFailureInjector();
  const beforeCall = composeBeforeCall(async () => sleep(), maybeFail);
  return withLatency(baseClient, beforeCall);
};
