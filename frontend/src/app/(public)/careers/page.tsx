import React from "react";
import Link from "next/link";
import { ChevronRight, Briefcase } from "lucide-react";

export default function CareersPage() {
  const positions = [
    { title: "Lead ISO 9001 / 14001 Assessor", location: "Global (Remote / On-site)", type: "Contract / Full-Time" },
    { title: "Technical Auditor (Medical Devices - ISO 13485)", location: "Global", type: "Full-Time" },
    { title: "Quality & Compliance Officer", location: "Head Office", type: "Full-Time" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="bg-gradient-to-b from-slate-100 via-blue-50/40 to-white text-slate-900 py-12 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <nav className="mb-4 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-blue-700 transition-colors">Home</Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-blue-900 font-bold">Careers</span>
          </nav>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0b2341] sm:text-5xl">Careers at UASL</h1>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="space-y-4">
          {positions.map((p) => (
            <div key={p.title} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{p.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{p.location} • {p.type}</p>
              </div>
              <Link href="/get-in-touch" className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs">
                Apply Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
