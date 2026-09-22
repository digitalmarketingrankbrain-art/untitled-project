"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { CertifiedOrgSearch } from "@/components/verification/certified-org-search";

export default function CertifiedOrganizationPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* UASL Styled Page Header */}
      <div className="bg-gradient-to-b from-slate-100 via-blue-50/40 to-white text-slate-900 py-10 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <nav className="mb-4 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-blue-700 transition-colors">Home</Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-blue-900 font-bold">Certified Organisation</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3.5 py-1 text-blue-900 text-xs font-bold mb-3 border border-blue-200">
            <ShieldCheck className="size-4 text-blue-700" />
            <span>UASL Public Registry Verification</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#0b2341] sm:text-4xl">
            Certified Organisation Lookup
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl mx-auto font-normal">
            Check and verify the current certification status of any organization assessed by UASL accredited Bodies.
          </p>
        </div>
      </div>

      {/* Main Search Component */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-lg">
          <CertifiedOrgSearch />
        </div>
      </div>
    </div>
  );
}
