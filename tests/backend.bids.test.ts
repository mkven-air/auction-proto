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
});
