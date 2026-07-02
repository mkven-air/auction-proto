// Theme & i18n
export * from "./theme";
export * from "./i18n";
export * from "./locale";

// Domain helpers
export { colorToken } from "./domain/color";
export type { ColorTokenId } from "./domain/color";
export * from "./domain/channel";

// Formatters
export * from "./format/flightTime";
export * from "./format/bidDistribution";

// Utilities
export { cn } from "./lib/utils";

// Primitives
export * from "./primitives";

// UI components (shadcn layer)
export { Button } from "./components/ui/button";

// Low-level HTTP client only. Each app composes its OWN typed backend (endpoint
// paths, request/response contracts) on top of these primitives, so the admin
// API surface never ships in the public passenger bundle.
export { getJson, idsQuery, postJson, putJson } from "./api/client";
