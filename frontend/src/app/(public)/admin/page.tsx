import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { SaafLogo } from "@/components/ui/saaf-logo";

// Not linked from anywhere public and kept out of search results.
export const metadata: Metadata = {
  title: "Admin Sign In | SAAF",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="relative mx-auto min-h-[calc(100dvh-110px)] max-w-md px-4 py-14 sm:py-20">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">
          <SaafLogo variant="emblem" size="lg" />
        </div>
        <h1 className="font-display text-3xl font-extrabold tracking-[-.04em] text-slate-900">Admin Sign In</h1>
        <p className="mt-1 text-xs text-slate-600">South Asia Accreditation Foundation — Administrators only</p>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200/80 bg-white/95 p-7 shadow-[0_24px_70px_rgba(7,26,47,.14)] backdrop-blur-xl sm:p-8">
        <Suspense fallback={<div className="py-8 text-center text-xs text-slate-400">Loading sign in…</div>}>
          <LoginForm portals={["admin"]} />
        </Suspense>
      </div>
    </div>
  );
}
