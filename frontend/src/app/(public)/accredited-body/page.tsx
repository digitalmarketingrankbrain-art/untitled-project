"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Building2 } from "lucide-react";
import { AccreditedBodySearch } from "@/components/verification/accredited-body-search";

export default function AccreditedBodyPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* UASL Header Banner */}
      <div className="bg-[#0b2341] text-white py-10 border-b border-blue-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <nav className="mb-4 flex items-center justify-center gap-2 text-xs text-slate-300 font-medium">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-amber-400 font-semibold">Accredited Body</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-3.5 py-1 text-amber-300 text-xs font-bold mb-3 border border-amber-400/30">
            <Building2 className="size-4 text-amber-400" />
            <span>Assessed Body Directory</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Accredited Body Directory
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-2xl mx-auto font-normal">
            Search and verify the assessment criteria, scope, and accreditation status of Conformity Assessment Bodies (CABs) evaluated by UASL.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-lg">
          <AccreditedBodySearch />
        </div>
      </div>
    </div>
  );
}
