"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AccreditedBodySearch } from "@/components/verification/accredited-body-search";

export default function AccreditedCabsPage() {
  return (
    <div className="bg-slate-50/50 min-h-screen pb-16">
      {/* Header Banner */}
      <div className="border-b border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <nav className="mb-4 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-slate-800 transition-colors">Home</Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-slate-500">Directory</span>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-blue-600 font-semibold">List Of Accredited CABs</span>
          </nav>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            List Of Accredited CABs
          </h1>
        </div>
      </div>

      {/* Main Content - Accredited Body Search Matching Screenshots 1 & 2 */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs">
          <AccreditedBodySearch />
        </div>
      </div>
    </div>
  );
}
