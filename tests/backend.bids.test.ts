import { describe, expect, it } from "vitest";
import { createServiceClient } from "../src/backend/serviceClient";

describe("backend bids service", () => {
  it("lists, approves, rejects, and auto-selects bids", async () => {
    const client = createServiceClient();

    const bids = await client.bids.list("HY 602", "businessClass");
    expect(bids).toHaveLength(10);

    const approved = await client.bids.approve("HY 602", 2);
    expect(approved?.state).toBe("approved");

    const rejected = await client.bids.reject("HY 602", 3);
    expect(rejected?.state).toBe("rejected");

    const winners = await client.bids.autoSelect("HY 602");
    expect(winners).toEqual([1, 4]);

    const refreshed = await client.bids.list("HY 602", "businessClass");
    expect(refreshed.find((bid) => bid.id === 1)?.state).toBe("approved");
    expect(refreshed.find((bid) => bid.id === 4)?.state).toBe("approved");
    expect(refreshed.find((bid) => bid.id === 3)?.state).toBe("rejected");
  });

  it("returns undefined for missing bids", async () => {
    const client = createServiceClient();

    await expect(client.bids.approve("HY 999", 1)).resolves.toBeUndefined();
    await expect(client.bids.reject("HY 999", 1)).resolves.toBeUndefined();
  });

  it("auto-selects nothing when no seats are available", async () => {
    const client = createServiceClient();

    const winners = await client.bids.autoSelect("HY 233");

    expect(winners).toEqual([]);
    const bids = await client.bids.list("HY 233", "businessClass");
    expect(bids.every((bid) => bid.state === "pending")).toBe(true);
  });

  it("scopes list by product", async () => {
    const client = createServiceClient();

    const bcBids = await client.bids.list("HY 602", "businessClass");
    const exitBids = await client.bids.list("HY 602", "exitRows");

    expect(bcBids).toHaveLength(10);
    expect(exitBids).toHaveLength(14);
    expect(bcBids.every((b) => b.product === "businessClass")).toBe(true);
    expect(exitBids.every((b) => b.product === "exitRows")).toBe(true);
  });

  it("auto-select only considers business-class bids", async () => {
    const client = createServiceClient();

    const winners = await client.bids.autoSelect("HY 602");

    // Top exit-row bid on HY 602 has id 11 ($82) — must NOT be picked.
    expect(winners).toEqual([1, 4]);
    const exitBids = await client.bids.list("HY 602", "exitRows");
    expect(exitBids.every((bid) => bid.state === "pending")).toBe(true);
  });

  it("joins passenger profile onto each bid", async () => {
    const client = createServiceClient();
    const bids = await client.bids.list("HY 602", "businessClass");

    expect(bids.every((b) => b.passenger.id === b.passengerId)).toBe(true);
    const top = bids.find((b) => b.id === 1);
    expect(top?.passenger.tier).toBe("Platinum");
    expect(top?.passenger.name.length).toBeGreaterThan(0);
  });
});
