import React from "react";
import Link from "next/link";
import { ChevronRight, ArrowRight, CheckCircle2, FileText, UserCheck, ShieldCheck } from "lucide-react";

export default function HowToBecomeAccreditatedPage() {
  const steps = [
    { step: "01", title: "Application & Documentation", desc: "Submit formal application forms, quality manuals, organizational structure, and operational procedures." },
    { step: "02", title: "Document Review", desc: "UASL lead assessors review submitted documentation for compliance against relevant ISO/IEC standards." },
    { step: "03", title: "Initial Assessment / On-site Audit", desc: "On-site and remote evaluation of CAB operations, witness assessments, and staff interviews." },
    { step: "04", title: "Corrective Action & Decision", desc: "Closure of any non-conformities, followed by review by the UASL Accreditation Decision Committee." },
    { step: "05", title: "Accreditation Award & Listing", desc: "Issuance of formal Accreditation Certificate and public directory listing on the UASL Register." },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="bg-[#0b2341] text-white py-12 border-b border-blue-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <nav className="mb-4 flex items-center justify-center gap-2 text-xs text-slate-300 font-medium">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-amber-400 font-semibold">How to Become Accredited</span>
          </nav>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            How to Become Accredited?
          </h1>
          <p className="mt-3 text-base text-slate-300 max-w-3xl mx-auto font-normal">
            A transparent 5-step accreditation process for Conformity Assessment Bodies (CABs).
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-md">
          <div className="space-y-6">
            {steps.map((s) => (
              <div key={s.step} className="flex gap-4 items-start p-4 rounded-xl border border-slate-100 bg-slate-50">
                <span className="text-xl font-extrabold text-amber-500 bg-slate-900 px-3 py-1 rounded-lg">
                  {s.step}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                  <p className="text-xs text-slate-600 mt-1">{s.desc}</p>
                </div>
              </div>
            ))}

            <div className="pt-6 text-center">
              <Link
                href="/apply"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-3 text-sm font-bold shadow-lg transition-all"
              >
                <span>Start Application Process</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
