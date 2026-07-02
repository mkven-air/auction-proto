const API_BASE = `${(import.meta.env.VITE_API_TARGET ?? "").replace(/\/$/, "")}/api`;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "content-type": "application/json" },
    ...init,
  });
  if (!response.ok) {
    throw new Error(`API ${init?.method ?? "GET"} ${path} failed with ${response.status}`);
  }
  const text = await response.text();
  return (text.length > 0 ? JSON.parse(text) : undefined) as T;
}

/** GET `path` and parse the JSON body. */
export const getJson = <T>(path: string): Promise<T> => request<T>(path);

/** POST `path` with an optional JSON body. */
export const postJson = <T>(path: string, body?: unknown): Promise<T> =>
  request<T>(path, {
    method: "POST",
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

/** PUT `path` with a JSON body. */
export const putJson = <T>(path: string, body: unknown): Promise<T> =>
  request<T>(path, { method: "PUT", body: JSON.stringify(body) });

/** Serialize a list of ids into a `?ids=a,b,c` query string. */
export const idsQuery = (ids: ReadonlyArray<string>): string =>
  `?ids=${encodeURIComponent(ids.join(","))}`;
