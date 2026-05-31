import type { FlightHaul } from "../types";

export const HAUL_LABELS: Record<FlightHaul, string> = {
  "ultra-short": "Ультракороткий (<1.5ч)",
  short: "Короткий (1.5–3ч)",
  medium: "Средний (3–5ч)",
  long: "Длинный (5–8ч)",
  ultra: "Ультрадальний (8ч+)",
};
