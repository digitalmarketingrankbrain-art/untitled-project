import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { SaafLogo } from "@/components/ui/saaf-logo";

export const metadata: Metadata = {
  title: "Log In | South Asia Accreditation Foundation (SAAF)",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">
          <SaafLogo variant="emblem" size="lg" />
        </div>
        <h1 className="font-display text-2xl font-extrabold text-slate-900">
          SAAF Portal Sign In
        </h1>
        <p className="mt-1 text-xs text-slate-600">
          South Asia Accreditation Foundation — Authenticated Access
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <Suspense fallback={<div className="py-8 text-center text-xs text-slate-400">Loading sign in portal…</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
