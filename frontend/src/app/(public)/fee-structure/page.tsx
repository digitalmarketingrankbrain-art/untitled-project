import React from "react";
import Link from "next/link";
import { ChevronRight, CreditCard, ShieldCheck } from "lucide-react";

export default function FeeStructurePage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="bg-[#0b2341] text-white py-12 border-b border-blue-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <nav className="mb-4 flex items-center justify-center gap-2 text-xs text-slate-300 font-medium">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-amber-400 font-semibold">Fee Structure</span>
          </nav>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">Accreditation Fee Structure</h1>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-md space-y-6">
          <p className="text-sm text-slate-600">
            UASL maintains a transparent, non-discriminatory fee schedule calculated on a cost-recovery basis to support high-quality assessment operations.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-amber-400 font-bold border-b border-slate-700">
                  <th className="p-3">Fee Category</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Schedule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="p-3 font-bold">Application Fee</td>
                  <td className="p-3">Initial filing & documentation review</td>
                  <td className="p-3">One-time</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Assessment Fee</td>
                  <td className="p-3">On-site audit per assessor per day</td>
                  <td className="p-3">Per Assessment</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Annual Maintenance Fee</td>
                  <td className="p-3">Ongoing directory maintenance & compliance tracking</td>
                  <td className="p-3">Annual</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
