import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    // Nonces only cover <style> elements, not inline style="" attributes or
    // JS `el.style.x =` assignments — and Next/React's own internals (dev
    // overlay, route announcer) rely on those. A nonce here would silently
    // void 'unsafe-inline' (CSP ignores it once any nonce/hash is present),
    // so style-src stays nonce-free and keeps 'unsafe-inline' working.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
  ].join("; ");

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("Content-Security-Policy", csp);

  const withCsp = (response: NextResponse) => {
    response.headers.set("Content-Security-Policy", csp);
    return response;
  };

  // Dedicated admin sign-in page: an admin who is already signed in goes straight to their portal.
  if (pathname === "/admin" && session?.user?.role === "ADMIN") {
    return withCsp(NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl.origin)));
  }

  // "/admin" itself is the public sign-in page; everything under "/admin/" is the protected admin area.
  const isAdminArea = pathname.startsWith("/admin/");

  if (pathname.startsWith("/portal") || pathname.startsWith("/cab") || pathname.startsWith("/assessor") || isAdminArea) {
    if (!session?.user) {
      // Admin pages send visitors to the dedicated admin sign-in, everyone else to the shared /login.
      const loginUrl = new URL(isAdminArea ? "/admin" : "/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return withCsp(NextResponse.redirect(loginUrl));
    }

    const { role } = session.user;

    const roleHome: Record<string, string> = {
      APPLICANT: "/cab/applicant",
      ASSESSOR: "/assessor",
      ADMIN: "/admin/dashboard",
    };

    const subtreesByRole: Record<string, string> = {
      "/cab/applicant": "APPLICANT",
      "/assessor": "ASSESSOR",
      "/admin/": "ADMIN",
    };
    for (const [prefix, requiredRole] of Object.entries(subtreesByRole)) {
      if (pathname.startsWith(prefix) && role !== requiredRole) {
        return withCsp(NextResponse.redirect(new URL(roleHome[role] ?? "/portal", req.nextUrl.origin)));
      }
    }
  }

  return withCsp(NextResponse.next({ request: { headers: requestHeaders } }));
});

export const config = {
  // /api/auth is deliberately excluded: NextAuth's own route handlers (used
  // by signIn/signOut) must not be re-wrapped by this middleware's auth()
  // HOC, which can interfere with the session cookie it writes.
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
  runtime: "nodejs",
};
