import type { SeatCell } from "../types";

export const SEAT_MAP_BC: Array<Array<SeatCell | null>> = [
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
