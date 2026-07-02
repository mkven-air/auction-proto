import type { Flight, SeatCell, SeatMapLayout } from "@auction/core";
import type { SeatMapService } from "@auction/api-contracts/admin";

const DEFAULT_SEAT_MAP_BC: SeatMapLayout = [
  [
    { id: "1A", taken: true },
    { id: "1C", taken: true },
    null,
    { id: "1D", taken: true },
    { id: "1F", taken: true },
  ],
  [
    { id: "2A", taken: true },
    { id: "2C", taken: true },
    null,
    { id: "2D", taken: true },
    { id: "2F", taken: true },
  ],
  [
    { id: "3A", taken: true },
    { id: "3C", taken: true },
    null,
    { id: "3D", taken: true },
    { id: "3F", taken: true },
  ],
  [
    { id: "4A", taken: false, bid: true },
    { id: "4C", taken: true },
    null,
    { id: "4D", taken: true },
    { id: "4F", taken: false, bid: true },
  ],
];

function cloneSeat(seat: SeatCell | null): SeatCell | null {
  return seat ? Object.freeze({ ...seat }) : null;
}

function cloneLayout(layout: SeatMapLayout): SeatMapLayout {
  return Object.freeze(layout.map((row) => Object.freeze(row.map(cloneSeat))));
}

export function createSeatMapService(
  seed: Record<Flight["id"], SeatMapLayout> = { "HY 602": DEFAULT_SEAT_MAP_BC },
): SeatMapService {
  return {
    async getBusinessClass(flightId) {
      return cloneLayout(seed[flightId] ?? DEFAULT_SEAT_MAP_BC);
    },
  };
}
