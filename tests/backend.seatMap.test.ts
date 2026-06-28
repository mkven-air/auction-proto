import { describe, expect, it } from "vitest";
import { createServiceClient } from "../src/backend/serviceClient";

describe("backend seatMap service", () => {
  it("returns a seat map layout for a known flight", async () => {
    const client = createServiceClient();
    const layout = await client.seatMap.getBusinessClass("HY 602");

    expect(layout.length).toBeGreaterThan(0);
    // each row is an array of seat cells or nulls
    for (const row of layout) {
      expect(Array.isArray(row)).toBe(true);
    }
  });

  it("seats with bid:true are not taken", async () => {
    const client = createServiceClient();
    const layout = await client.seatMap.getBusinessClass("HY 602");

    const bidSeats = layout.flat().filter((cell) => cell?.bid === true);
    expect(bidSeats.length).toBeGreaterThan(0);
    expect(bidSeats.every((seat) => seat?.taken === false)).toBe(true);
  });

  it("layout contains null gap entries for aisle columns", async () => {
    const client = createServiceClient();
    const layout = await client.seatMap.getBusinessClass("HY 602");

    const hasNulls = layout.some((row) => row.some((cell) => cell === null));
    expect(hasNulls).toBe(true);
  });

  it("falls back to default layout for an unknown flight", async () => {
    const client = createServiceClient();
    const layout = await client.seatMap.getBusinessClass("HY 999");

    // should still return a valid layout (not throw, not return empty)
    expect(layout.length).toBeGreaterThan(0);
  });

  it("returns independent clones so mutations do not affect stored layout", async () => {
    const client = createServiceClient();
    const first = await client.seatMap.getBusinessClass("HY 602");
    const originalTaken = first[0]?.[0]?.taken;

    // mutate the returned clone directly
    const firstSeat = first[0]?.[0];
    if (firstSeat) {
      (firstSeat as { taken: boolean }).taken = !firstSeat.taken;
    }

    // re-fetch should still have the original value
    const second = await client.seatMap.getBusinessClass("HY 602");
    expect(second[0]?.[0]?.taken).toBe(originalTaken);
  });
});
