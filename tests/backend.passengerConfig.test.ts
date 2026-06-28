import { describe, expect, it } from "vitest";
import { createServiceClient } from "../src/backend/serviceClient";

describe("backend passengerConfig service", () => {
  it("returns default passenger config", async () => {
    const client = createServiceClient();
    const config = await client.passengerConfig.get();

    expect(config.flightId).toBe("HY 602");
    expect(config.multiplier).toBe(1.1);
    expect(config.frame.statusBarTime).toBe("09:41");
    expect(config.frame.statusBarHost).toBe("uzbekistanairways.uz");
  });

  it("exposes all three product specs with valid min/max ranges", async () => {
    const client = createServiceClient();
    const config = await client.passengerConfig.get();

    for (const key of ["bc", "ex", "sb"] as const) {
      const spec = config.productSpecs[key];
      expect(spec.min).toBeGreaterThan(0);
      expect(spec.max).toBeGreaterThan(spec.min);
      expect(spec.defaultVal).toBeGreaterThanOrEqual(spec.min);
      expect(spec.defaultVal).toBeLessThanOrEqual(spec.max);
    }
  });

  it("default bids match the product spec defaultVal values", async () => {
    const client = createServiceClient();
    const config = await client.passengerConfig.get();

    expect(config.defaultBids.bc).toBe(config.productSpecs.bc.defaultVal);
    expect(config.defaultBids.ex).toBe(config.productSpecs.ex.defaultVal);
    expect(config.defaultBids.sb).toBe(config.productSpecs.sb.defaultVal);
  });

  it("returns independent clones so mutations do not affect stored config", async () => {
    const client = createServiceClient();
    const first = await client.passengerConfig.get();

    (first.frame as { statusBarTime: string }).statusBarTime = "00:00";

    const second = await client.passengerConfig.get();
    expect(second.frame.statusBarTime).toBe("09:41");
  });
});
