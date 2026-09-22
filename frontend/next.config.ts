import type { NextConfig } from "next";

/**
 * Content-Security-Policy is set per-request in middleware.ts instead of
 * here: Next.js's App Router streams RSC payloads through inline <script>
 * tags on every route, so script-src can only be locked down with a nonce
 * issued fresh per request, not a static header.
 */
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The apply page moved from /accreditation/apply to /apply; keep old links working.
  async redirects() {
    return [
      { source: "/accreditation/apply", destination: "/apply", permanent: true },
      // Admin area moved from /portal/admin to /admin.
      { source: "/portal/admin", destination: "/admin/dashboard", permanent: true },
      { source: "/portal/admin/:path*", destination: "/admin/:path*", permanent: true },
      // Self-registration was removed; organisations now apply and are approved by an admin.
      { source: "/register", destination: "/apply", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
