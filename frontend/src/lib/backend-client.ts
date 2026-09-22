const BACKEND_URL = process.env.BACKEND_URL;

export interface BackendHealth {
  ok: boolean;
  status?: number;
  latencyMs?: number;
  error?: string;
}

/**
 * Pings the standalone Express backend's /health route. Server-only — the
 * browser never has BACKEND_URL, so this must run in a Server Component or
 * Server Action, not client code.
 *
 * Timeout is 30s, not a more typical few seconds: Render's free tier spins
 * the service down after inactivity, and the first request after that has to
 * wait for a cold start (observed 20s+) before it gets a response at all.
 */
export async function getBackendHealth(): Promise<BackendHealth> {
  if (!BACKEND_URL) {
    return { ok: false, error: "BACKEND_URL is not configured." };
  }

  const startedAt = Date.now();
  try {
    const res = await fetch(`${BACKEND_URL}/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(30000),
    });
    const latencyMs = Date.now() - startedAt;
    if (!res.ok) {
      return { ok: false, status: res.status, latencyMs, error: `Backend responded with ${res.status}` };
    }
    return { ok: true, status: res.status, latencyMs };
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "TimeoutError";
    return {
      ok: false,
      error: timedOut ? "Backend didn't respond within 30s (may be cold-starting on Render's free tier)." : err instanceof Error ? err.message : "Could not reach backend.",
    };
  }
}
