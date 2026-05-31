import { createBidsService } from "./bidsService";
import type { BackendClient } from "./contracts";
import { createFlightsService } from "./flightsService";
import {
  composeBeforeCall,
  createJitterSleeper,
  createMockFailureInjector,
  getMockLatencyRange,
  withLatency,
} from "./latency";
import { seedDb } from "./serviceUtils";

export const createServiceClient = (): BackendClient => {
  const db = seedDb();

  const baseClient: BackendClient = {
    flights: createFlightsService(db),
    bids: createBidsService(db),
  };

  const sleep = createJitterSleeper(getMockLatencyRange);
  const maybeFail = createMockFailureInjector();
  const beforeCall = composeBeforeCall(async () => sleep(), maybeFail);
  return withLatency(baseClient, beforeCall);
};
