import { z } from "zod";
import { FLIGHT_FILTER_FIELDS, type FlightQuery } from "../services/flights";

const FLIGHT_SORT_COL = ["depAt", "bids", "revenue", "topBid"] as const;
const SORT_DIR = ["asc", "desc"] as const;
const FILTER_OP = ["eq", "contains", "in"] as const;

const FlightFilterValueSchema = z.union([
  z.string(),
  z.number(),
  z.array(z.union([z.string(), z.number()])),
]);

const FlightFilterSchema = z
  .object({
    field: z.enum(FLIGHT_FILTER_FIELDS),
    op: z.enum(FILTER_OP),
    value: FlightFilterValueSchema,
  })
  .strict();

/**
 * Runtime schema for `POST /api/admin/flights/query` request body.
 * The inferred type matches `FlightQuery` from `@auction/core` at compile time
 * via `satisfies`.
 */
export const FlightQuerySchema = z
  .object({
    search: z.string().optional(),
    filters: z.array(FlightFilterSchema).optional(),
    sortBy: z.enum(FLIGHT_SORT_COL).optional(),
    sortDir: z.enum(SORT_DIR).optional(),
    page: z.number().int().min(0).optional(),
    pageSize: z.number().int().min(1).max(1000).optional(),
  })
  .strict() satisfies z.ZodType<FlightQuery>;
