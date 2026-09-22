const BACKEND_URL = process.env.BACKEND_URL;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

interface BufferMarker {
  __rpcBuffer: true;
  base64: string;
}

function isBufferMarker(value: unknown): value is BufferMarker {
  return typeof value === "object" && value !== null && (value as { __rpcBuffer?: unknown }).__rpcBuffer === true;
}

/** Converts real Buffers in call arguments into {__rpcBuffer, base64} markers so they survive JSON.stringify over the wire to the backend. */
function markBuffers(value: unknown): unknown {
  if (Buffer.isBuffer(value)) return { __rpcBuffer: true, base64: value.toString("base64") } satisfies BufferMarker;
  if (value instanceof Date) return value;
  if (Array.isArray(value)) return value.map(markBuffers);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, markBuffers(v)]));
  }
  return value;
}

/** Reverses markBuffers on a response's result, so callers that expect a real Buffer (document downloads) get one back. */
function reviveBuffers(value: unknown): unknown {
  if (isBufferMarker(value)) return Buffer.from(value.base64, "base64");
  if (Array.isArray(value)) return value.map(reviveBuffers);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, reviveBuffers(v)]));
  }
  return value;
}

/** Thrown when the backend (or the database behind it) can't be reached, so callers can degrade gracefully instead of crashing. */
export class BackendUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BackendUnavailableError";
  }
}

/**
 * Calls one exported function of a backend/src/data/*.ts module over the
 * internal RPC bridge (see backend/src/rpc.ts) — the only way the frontend
 * process touches application data now that DATABASE_URL lives on the
 * backend only. `module` matches a backend/src/data/<module>.ts filename,
 * `fn` one of its exports; args/return value round-trip through JSON, with
 * Buffers specially marked so binary document content survives the trip.
 */
export async function rpc<T = unknown>(module: string, fn: string, args: unknown[] = []): Promise<T> {
  if (!BACKEND_URL) {
    throw new Error("BACKEND_URL is not configured — the frontend can't reach the backend for data access.");
  }

  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}/rpc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(INTERNAL_API_KEY ? { "x-internal-key": INTERNAL_API_KEY } : {}),
      },
      body: JSON.stringify({ module, fn, args: markBuffers(args) }),
      cache: "no-store",
    });
  } catch {
    throw new BackendUnavailableError("Could not reach the backend server.");
  }

  const body = (await res.json().catch(() => null)) as
    | { ok: boolean; result?: unknown; error?: string; code?: string }
    | null;

  if (body?.code === "DATABASE_UNAVAILABLE") {
    throw new BackendUnavailableError(body.error ?? "Database connection issue.");
  }

  if (!res.ok || !body?.ok) {
    throw new Error(body?.error ?? `Backend RPC call ${module}.${fn} failed with status ${res.status}.`);
  }

  return reviveBuffers(body.result) as T;
}
