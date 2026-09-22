import { headers } from "next/headers";

/**
 * Best-effort client IP from the standard proxy headers. There's no reverse
 * proxy configured in this environment to guarantee x-forwarded-for hasn't
 * been spoofed by the caller directly, so this is used for rate-limiting
 * keys and audit attribution, not as an access-control decision on its own.
 */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  const real = h.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
