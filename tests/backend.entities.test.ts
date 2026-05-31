import { describe, expect, it } from "vitest";
import { createServiceClient } from "../src/backend/serviceClient";

describe("backend entities service", () => {
  it("auto-discovers every seeded table with row counts", async () => {
    const client = createServiceClient();

    const tables = await client.entities.listAll();
    const byName = new Map(tables.map((t) => [t.name, t.rows]));

    expect(new Set(byName.keys())).toEqual(
      new Set(["flights", "bids", "airports", "cities", "countries"]),
    );
    expect(byName.get("flights")?.length).toBe(8);
    expect(byName.get("airports")?.length).toBe(9);
    expect(byName.get("bids")?.length).toBe(70);
    expect(byName.get("cities")?.length).toBe(9);
    expect(byName.get("countries")?.length).toBe(9);
  });

  it("returns rows containing the expected fields", async () => {
    const client = createServiceClient();

    const tables = await client.entities.listAll();
    const airports = tables.find((t) => t.name === "airports");
    expect(airports).toBeDefined();
    const first = airports?.rows[0];
    expect(first).toBeDefined();
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("cityId");

    const cities = tables.find((t) => t.name === "cities");
    expect(cities?.rows[0]).toHaveProperty("countryId");
  });
});
