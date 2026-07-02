export const queryKeys = {
  currentPassenger: ["current-passenger"] as const,
  passengerConfig: ["passenger-config"] as const,
  tiers: ["tiers"] as const,
  flightDetail: (flightId: string) => ["flight-detail", flightId] as const,
};
