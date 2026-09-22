"use server";

import { findUserByEmail, createLoginOtp, type Role } from "./store";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";

/**
 * Generates and "sends" a one-time login code for the given email — the
 * only step before the real sign-in (`signIn("credentials", { email, otp })`,
 * which consumes the code server-side in auth.ts's `authorize()`; that's the
 * real trust boundary, rate-limited independently of this action since the
 * NextAuth endpoint can be called directly).
 *
 * `allowedRoles`, when given, restricts this to the login page the user
 * landed on (Certification Body vs. Accreditation Body) — an account whose
 * role isn't in the list gets `wrongPortal` instead of a code, so a CB user
 * can't request a code through the AB page or vice versa. This is a UX
 * guardrail, not the real security boundary: the `/portal` subtree RBAC in
 * middleware.ts is what actually enforces access regardless of which login
 * page a session was created through.
 *
 * No real email/SMS provider is wired up yet (Phase 11: vendor TBD) — the
 * code is returned directly for local development/demo purposes only,
 * same pattern as the dev-only password-reset link this replaced.
 */
export async function requestLoginOtp(email: string, allowedRoles?: Role[]) {
  try {
    const ip = await getClientIp();
    const limit = checkRateLimit(`login-otp:${ip}:${email.toLowerCase()}`, 5, 15 * 60 * 1000);
    if (!limit.allowed) {
      return { ok: false as const, error: "Too many attempts. Wait 15 minutes and try again." };
    }

    const user = await findUserByEmail(email);
    if (!user || user.status !== "ACTIVE") {
      return { ok: false as const, error: "No account found for that email." };
    }
    if (allowedRoles && !allowedRoles.includes(user.primaryRole)) {
      return { ok: false as const, wrongPortal: true as const };
    }

    const code = await createLoginOtp(email);
    return { ok: true as const, devCode: code };
  } catch (err) {
    console.error("[requestLoginOtp Error]", err);
    return {
      ok: false as const,
      error: "Unable to connect to authentication server. Please verify BACKEND_URL environment variable on Vercel.",
    };
  }
}

