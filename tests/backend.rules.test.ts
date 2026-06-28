import { describe, expect, it } from "vitest";
import { createServiceClient } from "../src/backend/serviceClient";

describe("backend rules service", () => {
  it("returns default rules on fresh client", async () => {
    const client = createServiceClient();
    const rules = await client.rules.get();

    expect(rules.inviteDaysBefore).toBe(14);
    expect(rules.chaserHoursBefore).toBe(48);
    expect(rules.closureHoursBefore).toBe(4);
    expect(rules.autoFulfillment).toBe(true);
    expect(rules.blindBids).toBe(true);
    expect(rules.channels.email).toBe(true);
    expect(rules.paymentMethods.jcb).toBe(false);
  });

  it("persists updates and returns the updated rules", async () => {
    const client = createServiceClient();
    const current = await client.rules.get();

    const updated = await client.rules.update({
      ...current,
      inviteDaysBefore: 7,
      blindBids: false,
      channels: { ...current.channels, web: false },
    });

    expect(updated.inviteDaysBefore).toBe(7);
    expect(updated.blindBids).toBe(false);
    expect(updated.channels.web).toBe(false);
    // unchanged fields survive
    expect(updated.chaserHoursBefore).toBe(48);
    expect(updated.channels.email).toBe(true);
  });

  it("get reflects the last update", async () => {
    const client = createServiceClient();
    const current = await client.rules.get();

    await client.rules.update({ ...current, multiplierGold: 99 });
    const refreshed = await client.rules.get();

    expect(refreshed.multiplierGold).toBe(99);
  });

  it("returns independent clones so mutations do not affect stored state", async () => {
    const client = createServiceClient();
    const first = await client.rules.get();

    // mutate the returned object directly
    (first as { inviteDaysBefore: number }).inviteDaysBefore = 999;

    const second = await client.rules.get();
    expect(second.inviteDaysBefore).toBe(14);
  });
});
