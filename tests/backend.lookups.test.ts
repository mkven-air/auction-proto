import { describe, expect, it } from "vitest";
import { createServiceClient } from "../src/backend/serviceClient";
import { CURRENT_PASSENGER_ID } from "../src/backend/services/passengers/service";

describe("backend airports service", () => {
  it("lists all seeded airports", async () => {
    const client = createServiceClient();
    const airports = await client.airports.list();

    expect(airports.length).toBe(9);
    expect(airports.every((a) => a.id && a.cityId)).toBe(true);
  });

  it("finds airports by a subset of ids", async () => {
    const client = createServiceClient();
    const result = await client.airports.findByIds(["TAS", "IST"]);

    expect(result).toHaveLength(2);
    expect(result.map((a) => a.id).sort()).toEqual(["IST", "TAS"]);
  });

  it("returns empty array for empty id list", async () => {
    const client = createServiceClient();
    expect(await client.airports.findByIds([])).toEqual([]);
  });

  it("listWithLocation joins city and country onto each airport", async () => {
    const client = createServiceClient();
    const airports = await client.airports.listWithLocation();

    expect(airports.length).toBe(9);
    for (const a of airports) {
      expect(a.city).toBeDefined();
      expect(a.city.timezone.length).toBeGreaterThan(0);
      expect(a.country).toBeDefined();
      expect(a.country.id.length).toBeGreaterThan(0);
    }
  });

  it("findWithLocationByIds returns enriched entries for the requested ids", async () => {
    const client = createServiceClient();
    const result = await client.airports.findWithLocationByIds(["TAS"]);

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("TAS");
    expect(result[0]?.city).toBeDefined();
    expect(result[0]?.country).toBeDefined();
  });
});

describe("backend passengers service", () => {
  it("returns the pinned current passenger", async () => {
    const client = createServiceClient();
    const passenger = await client.passengers.getCurrent();

    expect(passenger).toBeDefined();
    expect(passenger?.id).toBe(CURRENT_PASSENGER_ID);
    expect(passenger?.tier).toBe("Platinum");
    expect(passenger?.name.length).toBeGreaterThan(0);
  });
});

describe("backend tiers service", () => {
  it("lists all loyalty tiers", async () => {
    const client = createServiceClient();
    const tiers = await client.tiers.list();

    expect(tiers).toHaveLength(4);
    expect(tiers.map((t) => t.id).sort()).toEqual(
      ["Gold", "Platinum", "Silver", "Standard"].sort(),
    );
  });

  it("each tier has a localized name and color tokens", async () => {
    const client = createServiceClient();
    const tiers = await client.tiers.list();

    for (const tier of tiers) {
      expect(typeof tier.name.en).toBe("string");
      expect(typeof tier.name.ru).toBe("string");
      expect(tier.colorId.length).toBeGreaterThan(0);
    }
  });
});
