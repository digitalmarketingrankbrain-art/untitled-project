"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Download, FileText } from "lucide-react";

const PROCEDURES_TABLE = [
  { sr: 1, number: "SAAF-QM", title: "Quality Manual" },
  { sr: 2, number: "SAAF-PR-01", title: "Procedure for Document control" },
  { sr: 3, number: "SAAF-PR-02", title: "Procedure for Record control" },
  { sr: 4, number: "SAAF-PR-03", title: "Procedure for Control of NCP, CA" },
  { sr: 5, number: "SAAF-PR-04", title: "Procedure for PA & CI" },
  { sr: 6, number: "SAAF-PR-05", title: "Procedure for IA & MRM" },
  { sr: 7, number: "SAAF-PR-06", title: "Procedure for Complaints / Appeals / Disputes" },
  { sr: 8, number: "SAAF-PR-07", title: "Procedure for Selection, Training & Monitoring of Assessors and Experts" },
  { sr: 9, number: "SAAF-PR-08", title: "Procedure for Conducting Assessment Process" },
  { sr: 10, number: "SAAF-PR-09", title: "Procedure for Assessment Reporting" },
  { sr: 11, number: "SAAF-PR-10", title: "Procedure for formation of Impartiality and Policy Review Committee" },
  { sr: 12, number: "SAAF-PR-11", title: "Procedure for New Program Scheme Development" },
  { sr: 13, number: "SAAF-PR-12", title: "Procedure for Accreditation in Foreign Country" },
  { sr: 14, number: "SAAF-PR-13", title: "Procedure for Accreditation Review Committee (ARC)" },
  { sr: 15, number: "SAAF-PR-14", title: "Procedure for Risk Analysis" },
  { sr: 16, number: "SAAF-PR-15", title: "Procedure for Assessment and Accreditation Process of Product Certification Bodies" },
  { sr: 17, number: "SAAF-PR-16", title: "Procedure for Assessment and Accreditation Process of Persons Certification Bodies" },
  { sr: 18, number: "SAAF-PR-17", title: "Procedure for Accreditation Requirements of Testing Labs" },
  { sr: 19, number: "SAAF-PR-18", title: "Procedure for Assessment and Accreditation Process of Validation/Verification Bodies" },
];

export default function SaafManualAndProceduresPage() {
  return (
    <div className="bg-slate-50/50 min-h-screen pb-16">
      {/* Header Banner */}
      <div className="border-b border-slate-200 bg-white py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav className="mb-4 flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-slate-800 transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <Link href="/publications" className="hover:text-slate-800 transition-colors">
              Publications
            </Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-blue-600 font-semibold">SAAF Manual And Procedures</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/60 px-3 py-1 text-xs font-semibold text-blue-700 mb-2">
            <ShieldCheck className="size-3.5 text-blue-600" />
            <span>Official Register</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            List Of Manual & Procedures
          </h1>
        </div>
      </div>

      {/* Main Content Table */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
              <FileText className="size-4 text-blue-600" />
              <span>Official SAAF Standard Procedures (19 Items)</span>
            </div>
            <span className="text-xs font-semibold text-slate-500">ISO/IEC 17011 Aligned</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-slate-200 bg-blue-700 text-white font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6 w-16 text-center">SR. No.</th>
                  <th className="py-3.5 px-4 sm:px-6 w-44">Document Number</th>
                  <th className="py-3.5 px-4 sm:px-6">Document Title</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right w-28">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {PROCEDURES_TABLE.map((row) => (
                  <tr key={row.sr} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-4 sm:px-6 text-center font-semibold text-slate-500">
                      {row.sr}
                    </td>
                    <td className="py-3 px-4 sm:px-6 font-mono font-bold text-blue-700">
                      {row.number}
                    </td>
                    <td className="py-3 px-4 sm:px-6 font-medium text-slate-900">
                      {row.title}
                    </td>
                    <td className="py-3 px-4 sm:px-6 text-right">
                      <button
                        onClick={() => alert(`Downloading document: ${row.number} - ${row.title}`)}
                        className="inline-flex items-center gap-1 rounded bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        <Download className="size-3" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
