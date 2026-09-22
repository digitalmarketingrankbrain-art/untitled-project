"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Download, Filter } from "lucide-react";


const SAAF_DOCUMENT_CATEGORIES = [
  "All Categories",
  "General Accreditation Criteria",
  "Inspection Bodies (ISO/IEC 17020)",
  "Management System Certification Bodies (ISO/IEC 17021-1)",
  "Product Certification Bodies (ISO/IEC 17065)",
  "Validation and Verification Bodies (ISO/IEC 17029)",
  "Testing & Calibration Laboratories (ISO/IEC 17025)",
  "Medical Laboratories (ISO 15189)",
  "Personnel Certification Bodies (ISO/IEC 17024)",
];

const DOCUMENTS_LIST = [
  {
    code: "SAAF-DOC-101",
    title: "SAAF General Accreditation Criteria for CABs",
    category: "General Accreditation Criteria",
    standard: "ISO/IEC 17011",
    size: "1.4 MB",
  },
  {
    code: "SAAF-DOC-102",
    title: "Rules for Use of SAAF Accreditation Symbol and Mark",
    category: "General Accreditation Criteria",
    standard: "SAAF Mark Policy",
    size: "890 KB",
  },
  {
    code: "SAAF-DOC-103",
    title: "Fee Schedule & Financial Guidelines for Accreditation Services",
    category: "General Accreditation Criteria",
    standard: "SAAF Fee Standard",
    size: "620 KB",
  },
  {
    code: "SAAF-DOC-201",
    title: "Accreditation Requirements for Inspection Bodies",
    category: "Inspection Bodies (ISO/IEC 17020)",
    standard: "ISO/IEC 17020:2012",
    size: "1.1 MB",
  },
  {
    code: "SAAF-DOC-202",
    title: "Accreditation Requirements for Management System Certification Bodies",
    category: "Management System Certification Bodies (ISO/IEC 17021-1)",
    standard: "ISO/IEC 17021-1:2015",
    size: "1.6 MB",
  },
  {
    code: "SAAF-DOC-203",
    title: "Accreditation Requirements for Product Certification Bodies",
    category: "Product Certification Bodies (ISO/IEC 17065)",
    standard: "ISO/IEC 17065:2012",
    size: "1.2 MB",
  },
  {
    code: "SAAF-DOC-204",
    title: "Accreditation Requirements for Validation and Verification Bodies",
    category: "Validation and Verification Bodies (ISO/IEC 17029)",
    standard: "ISO/IEC 17029:2019",
    size: "980 KB",
  },
  {
    code: "SAAF-DOC-205",
    title: "Accreditation Requirements for Testing & Calibration Laboratories",
    category: "Testing & Calibration Laboratories (ISO/IEC 17025)",
    standard: "ISO/IEC 17025:2017",
    size: "1.5 MB",
  },
  {
    code: "SAAF-DOC-206",
    title: "Accreditation Requirements for Medical Laboratories",
    category: "Medical Laboratories (ISO 15189)",
    standard: "ISO 15189:2022",
    size: "1.3 MB",
  },
  {
    code: "SAAF-DOC-207",
    title: "Accreditation Requirements for Personnel Certification Bodies",
    category: "Personnel Certification Bodies (ISO/IEC 17024)",
    standard: "ISO/IEC 17024:2012",
    size: "940 KB",
  },
];

export default function SaafDocumentsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("All Categories");

  const filteredDocs = DOCUMENTS_LIST.filter(
    (doc) => selectedCategory === "All Categories" || doc.category === selectedCategory
  );

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
            <span className="text-blue-600 font-semibold">SAAF Documents</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/60 px-3 py-1 text-xs font-semibold text-blue-700 mb-2">
            <ShieldCheck className="size-3.5 text-blue-600" />
            <span>Official Criteria & Standards</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            SAAF Documents & Scheme Specifications
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Category Filters */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            <Filter className="size-4 text-blue-600" />
            <span>Filter By Scheme / Body Category</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SAAF_DOCUMENT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Grid / Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-slate-200 bg-slate-100 text-slate-900 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Doc Code</th>
                  <th className="py-3.5 px-4 sm:px-6">Document Title</th>
                  <th className="py-3.5 px-4 sm:px-6">Category / Scheme</th>
                  <th className="py-3.5 px-4 sm:px-6">Standard</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredDocs.map((doc) => (
                  <tr key={doc.code} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-blue-700">
                      {doc.code}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900">
                      {doc.title}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-xs text-slate-600 font-medium">
                      {doc.category}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-xs font-semibold text-slate-500">
                      {doc.standard}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <button
                        onClick={() => alert(`Downloading official document: ${doc.code} - ${doc.title}`)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                      >
                        <Download className="size-3" />
                        <span>Download ({doc.size})</span>
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
