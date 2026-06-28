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

  it("returns frozen objects that cannot be mutated", async () => {
    const client = createServiceClient();
    const layout = await client.seatMap.getBusinessClass("HY 602");

    // layout, each row, and each seat cell are all frozen
    expect(Object.isFrozen(layout)).toBe(true);
    expect(Object.isFrozen(layout[0])).toBe(true);
    const firstSeat = layout[0]?.[0];
    if (firstSeat) expect(Object.isFrozen(firstSeat)).toBe(true);

    // mutation attempt must throw in strict mode
    expect(() => {
      (firstSeat as { taken: boolean }).taken = false;
    }).toThrow();
  });

  it("two fetches return equal but distinct objects", async () => {
    const client = createServiceClient();
    const a = await client.seatMap.getBusinessClass("HY 602");
    const b = await client.seatMap.getBusinessClass("HY 602");

    expect(a).not.toBe(b);
    expect(a[0]?.[0]).not.toBe(b[0]?.[0]);
    expect(a[0]?.[0]?.taken).toBe(b[0]?.[0]?.taken);
  });
});
