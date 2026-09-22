"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, ShieldAlert, ExternalLink } from "lucide-react";

export default function FalseClaimsPage() {
  return (
    <div className="bg-slate-50/50 min-h-screen pb-16">
      {/* Header Banner */}
      <div className="border-b border-slate-200 bg-white py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <nav className="mb-4 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-slate-800 transition-colors">Home</Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-slate-500">Directory</span>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-blue-600 font-semibold">False Claims Of Accreditation</span>
          </nav>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            False Claims Of Accreditation
          </h1>
        </div>
      </div>

      {/* Main Table Content - Matching Image 3 */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b-2 border-slate-800 bg-white text-slate-900 font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4 sm:px-6 w-28">Date</th>
                <th className="py-4 px-4 sm:px-6 w-48">Organization Name</th>
                <th className="py-4 px-4 sm:px-6 w-56">Location</th>
                <th className="py-4 px-4 sm:px-6">Relevant Information</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              <tr className="hover:bg-amber-50/30 transition-colors">
                <td className="py-5 px-4 sm:px-6 font-bold text-slate-900 align-top">
                  August-2025
                </td>
                <td className="py-5 px-4 sm:px-6 align-top space-y-1">
                  <div className="font-bold text-slate-900">
                    American Quality Standards Registrars
                  </div>
                  <a
                    href="https://aqsr.us/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline"
                  >
                    <span>https://aqsr.us/</span>
                    <ExternalLink className="size-3" />
                  </a>
                </td>
                <td className="py-5 px-4 sm:px-6 text-xs text-slate-600 align-top leading-relaxed">
                  1699 L Street NW, Suite 1700-A Washington, DC 20036 Port Angeles WA 20001
                </td>
                <td className="py-5 px-4 sm:px-6 text-xs text-slate-700 leading-relaxed align-top">
                  <p>
                    <strong className="text-slate-900">American Quality Standards Registrars (AQSR)</strong> has published a falsified version of SAAF&apos;s <em>International Recognition</em> certificate on its website. The document has been modified to misrepresent AQSR&apos;s status while still displaying the signature of SAAF&apos;s Chief Technical Officer, without authorization. This constitutes a deliberate act of misrepresentation and forgery. SAAF confirms that AQSR has <strong className="text-slate-900">no accreditation or recognition from SAAF</strong>. Any claims made by AQSR using SAAF&apos;s name, logo, or signatures are false and misleading.
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Reporting Callout */}
        <div className="mt-8 rounded-xl border border-rose-200 bg-rose-50/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="size-6 text-rose-600 shrink-0" />
            <div>
              <p className="font-bold text-rose-900 text-sm">Report Fraudulent Accreditation Certificates</p>
              <p className="text-xs text-slate-600">If you suspect an organization is falsely claiming SAAF accreditation, report it directly to SAAF Secretariat.</p>
            </div>
          </div>
          <Link
            href="/report-fraud"
            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-rose-700 transition-colors shrink-0"
          >
            <span>Report Impersonation</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

