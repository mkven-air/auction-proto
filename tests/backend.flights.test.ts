import { describe, expect, it } from "vitest";
import { createServiceClient } from "../src/backend/serviceClient";

describe("backend flights service", () => {
  it("returns seeded flights and summary data", async () => {
    const client = createServiceClient();

    const allFlights = await client.flights.listFlights();
    const summary = await client.flights.getFlightsSummary();

    expect(allFlights).toHaveLength(8);
    expect(summary).toEqual({
      active: 5,
      bids: 146,
      revenue: 23780,
      freeSeats: 47,
    });
  });

  it("queries flights with filters and summary shaping", async () => {
    const client = createServiceClient();

    const page = await client.flights.queryFlights({
      search: "TAS",
      filters: [{ field: "status", op: "eq", value: "active" }],
      sortBy: "revenue",
      sortDir: "desc",
      page: 1,
      pageSize: 2,
    });

    expect(page.total).toBe(5);
    expect(page.page).toBe(1);
    expect(page.pageSize).toBe(2);
    expect(page.items.map((flight) => flight.id)).toEqual(["HY 814", "HY 409"]);
    expect(page.summary).toEqual({
      active: 5,
      bids: 96,
      revenue: 10080,
      freeSeats: 23,
    });
  });

  it("looks up a flight by id", async () => {
    const client = createServiceClient();

    const flight = await client.flights.getFlightById("HY 602");
    expect(flight?.fromAirportId).toBe("TAS");
  });

  it("returns undefined for missing flights", async () => {
    const client = createServiceClient();

    await expect(client.flights.getFlightById("HY 999")).resolves.toBeUndefined();
  });
});
