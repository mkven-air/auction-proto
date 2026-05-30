import { createMockBackendClient } from "./mockClient";

// Composition root for data access; swap this with a real API-backed client incrementally.
export const backendClient = createMockBackendClient();
