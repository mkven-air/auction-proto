export const queryKeys = {
  flightsSummary: ["flights-summary"] as const,
  entities: ["entities"] as const,
  flightsQuery: (params: {
    search?: string;
    status?: string;
    sortBy?: string;
    sortDir?: string;
    page?: number;
    pageSize?: number;
  }) => ["flights-query", params] as const,
  flightById: (flightId: string) => ["flight", flightId] as const,
  flightBids: (flightId: string, product: string) => ["flight-bids", flightId, product] as const,
  airportsByIds: (ids: readonly string[]) => ["airports-by-ids", [...ids].sort()] as const,
  airportsWithLocationByIds: (ids: readonly string[]) =>
    ["airports-with-location-by-ids", [...ids].sort()] as const,
  citiesByIds: (ids: readonly string[]) => ["cities-by-ids", [...ids].sort()] as const,
  countriesByIds: (ids: readonly string[]) => ["countries-by-ids", [...ids].sort()] as const,
};
