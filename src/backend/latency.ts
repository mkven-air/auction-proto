type LatencyRange = {
  minMs: number;
  maxMs: number;
};

const DEFAULT_MOCK_LATENCY_MIN_MS = 120;
const DEFAULT_MOCK_LATENCY_MAX_MS = 800;

function toNumber(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
}

export function getMockLatencyRange(): LatencyRange {
  // Keep tests deterministic and fast unless explicitly overridden.
  if (import.meta.env.MODE === "test") {
    return { minMs: 0, maxMs: 0 };
  }

  const envEnabled = import.meta.env.VITE_MOCK_LATENCY_ENABLED;
  const enabled = envEnabled ? envEnabled.toLowerCase() !== "false" : true;
  if (!enabled) {
    return { minMs: 0, maxMs: 0 };
  }

  const minFromEnv = toNumber(import.meta.env.VITE_MOCK_LATENCY_MIN_MS);
  const maxFromEnv = toNumber(import.meta.env.VITE_MOCK_LATENCY_MAX_MS);

  const minMs = Math.max(0, minFromEnv ?? DEFAULT_MOCK_LATENCY_MIN_MS);
  const maxCandidate = maxFromEnv ?? DEFAULT_MOCK_LATENCY_MAX_MS;
  const maxMs = Math.max(minMs, maxCandidate);

  return { minMs, maxMs };
}

export function createJitterSleeper(getRange: () => LatencyRange): () => Promise<void> {
  return async () => {
    const { minMs, maxMs } = getRange();
    if (maxMs <= 0) return;
    const delayMs = Math.round(minMs + Math.random() * (maxMs - minMs));
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  };
}

type AsyncFn<TArgs extends unknown[] = unknown[], TResult = unknown> = (
  ...args: TArgs
) => Promise<TResult>;

type AnyObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is AnyObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function withAsyncLatency<TArgs extends unknown[], TResult>(
  fn: AsyncFn<TArgs, TResult>,
  sleep: () => Promise<void>,
): AsyncFn<TArgs, TResult> {
  return async (...args: TArgs) => {
    await sleep();
    return fn(...args);
  };
}

export function withLatency<TTarget extends AnyObject>(
  target: TTarget,
  sleep: () => Promise<void>,
): TTarget {
  const wrappedEntries = Object.entries(target).map(([key, value]) => {
    if (typeof value === "function") {
      return [key, withAsyncLatency(value as AsyncFn, sleep)];
    }
    if (isPlainObject(value)) {
      return [key, withLatency(value, sleep)];
    }
    return [key, value];
  });

  return Object.fromEntries(wrappedEntries) as TTarget;
}
