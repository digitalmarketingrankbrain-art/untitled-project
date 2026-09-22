"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Building2, CheckCircle2 } from "lucide-react";
import { AccreditedBodySearch } from "@/components/verification/accredited-body-search";
import { CertifiedOrgSearch } from "@/components/verification/certified-org-search";

export default function VerifyPage() {
  const [activeTab, setActiveTab] = useState<"CAB" | "ORG">("CAB");

  return (
    <div className="bg-slate-50/50 min-h-screen pb-16">
      {/* Header Banner */}
      <div className="border-b border-slate-200 bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <nav className="mb-3 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-slate-800 transition-colors">Home</Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-blue-600 font-semibold">Verify Certificate</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700 mb-2">
            <ShieldCheck className="size-3.5 text-blue-600" />
            <span>Official SAAF Verification Register</span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Verify Accreditation & Certificate Status
          </h1>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Tab Switcher */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 pb-4">
          <button
            onClick={() => setActiveTab("CAB")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "CAB"
                ? "bg-[#006699] text-white shadow"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Building2 className="size-4" />
            <span>Accredited Body Search</span>
          </button>

          <button
            onClick={() => setActiveTab("ORG")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "ORG"
                ? "bg-[#006699] text-white shadow"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <CheckCircle2 className="size-4" />
            <span>Certified Organization Search</span>
          </button>
        </div>

        {/* Tab Panels */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs">
          {activeTab === "CAB" ? <AccreditedBodySearch /> : <CertifiedOrgSearch />}
        </div>
      </div>
    </div>
  );
}
