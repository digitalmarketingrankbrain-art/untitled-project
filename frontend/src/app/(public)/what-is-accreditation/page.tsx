import React from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, CheckCircle2, Award } from "lucide-react";

export default function WhatIsAccreditationPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="bg-[#0b2341] text-white py-12 border-b border-blue-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <nav className="mb-4 flex items-center justify-center gap-2 text-xs text-slate-300 font-medium">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-amber-400 font-semibold">What is Accreditation</span>
          </nav>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            What is Accreditation?
          </h1>
          <p className="mt-3 text-base text-slate-300 max-w-3xl mx-auto font-normal">
            Independent third-party evaluation demonstrating technical competence, impartiality, and operating integrity.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-md space-y-6 text-slate-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-900">Defining Accreditation</h2>
          <p>
            Accreditation is an independent third-party evaluation of Conformity Assessment Bodies (CABs) — such as testing laboratories, inspection agencies, and certification bodies. It provides formal recognition that an organization is competent, impartial, and compliant with internationally recognized standards.
          </p>
          <p>
            While certification demonstrates that a product, process, or organization meets specified standards, <strong>accreditation demonstrates that the body performing the certification or assessment is itself reliable, competent, and authorized to do so.</strong>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 not-prose">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
              <ShieldCheck className="size-8 text-amber-500 mb-2" />
              <h3 className="font-bold text-slate-900 text-sm">Impartiality</h3>
              <p className="text-xs text-slate-600 mt-1">Free from commercial, financial, or political pressures.</p>
            </div>
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
              <Award className="size-8 text-blue-600 mb-2" />
              <h3 className="font-bold text-slate-900 text-sm">Technical Rigor</h3>
              <p className="text-xs text-slate-600 mt-1">Evaluated by qualified subject matter auditors.</p>
            </div>
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
              <CheckCircle2 className="size-8 text-emerald-600 mb-2" />
              <h3 className="font-bold text-slate-900 text-sm">Global Recognition</h3>
              <p className="text-xs text-slate-600 mt-1">Fosters international trade and mutual acceptance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
