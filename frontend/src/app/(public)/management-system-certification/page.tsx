import React from "react";
import Link from "next/link";
import { ChevronRight, CheckCircle2, ShieldCheck, Award, FileText, ArrowRight } from "lucide-react";

export default function ManagementSystemCertificationPage() {
  const schemes = [
    {
      code: "ISO 9001",
      title: "Quality Management Systems (QMS)",
      desc: "Demonstrates consistent quality standards, operational efficiency, and customer satisfaction.",
    },
    {
      code: "ISO 14001",
      title: "Environmental Management Systems (EMS)",
      desc: "Ensures legal environmental compliance, waste reduction, and sustainable resource management.",
    },
    {
      code: "ISO 27001",
      title: "Information Security Management Systems (ISMS)",
      desc: "Comprehensive framework for managing information security, data privacy, and risk mitigation.",
    },
    {
      code: "ISO 45001",
      title: "Occupational Health & Safety (OH&SMS)",
      desc: "Protects worker safety, reduces workplace hazards, and promotes employee wellness.",
    },
    {
      code: "ISO 22000",
      title: "Food Safety Management Systems (FSMS)",
      desc: "Covers the entire food chain from farm to fork, ensuring food safety and quality assurance.",
    },
    {
      code: "ISO 13485",
      title: "Medical Devices Quality Management",
      desc: "Rigorous quality framework specifically designed for medical device design and manufacturing.",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-slate-100 via-blue-50/40 to-white text-slate-900 py-12 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <nav className="mb-4 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-blue-700 transition-colors">Home</Link>
            <ChevronRight className="size-3 text-slate-400" />
            <Link href="/accreditation" className="hover:text-blue-700 transition-colors">Accreditation</Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-blue-900 font-bold">Management System Certification</span>
          </nav>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#0b2341] sm:text-5xl">
            Management System Certification Accreditation
          </h1>
          <p className="mt-3 text-base text-slate-600 max-w-3xl mx-auto font-normal">
            Accreditation for Certification Bodies operating under ISO/IEC 17021-1 standards across international Management Systems.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-md">
          <div className="prose max-w-none text-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Assessment for Conformity Assessment Bodies (CABs)</h2>
            <p className="text-base leading-relaxed text-slate-600 mb-8">
              UASL assesses certification bodies offering management system certification against international standards. Assessment by an independent authority means that when you choose a certification body evaluated by UASL, you choose an organization with validated operational procedures, technical competence, and documented quality systems.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mb-6">Key Certification Schemes Assessed by UASL</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose mb-10">
              {schemes.map((scheme) => (
                <div key={scheme.code} className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 transition-all hover:border-blue-600 hover:shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded-md bg-blue-900 text-amber-300 font-bold text-xs uppercase tracking-wider">
                      {scheme.code}
                    </span>
                    <h4 className="font-bold text-slate-900 text-base">{scheme.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{scheme.desc}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-gradient-to-r from-[#0b2341] to-blue-900 text-white p-8 border border-blue-900 flex flex-col md:flex-row items-center justify-between gap-6 not-prose shadow-lg">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Are you a Certification Body seeking UASL Accreditation?</h3>
                <p className="text-xs text-slate-200 max-w-xl font-normal">
                  Submit an application for management system accreditation or verify existing accredited bodies on our public directory.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/apply"
                  className="rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2.5 text-xs font-bold transition-all shadow-md"
                >
                  Apply Online
                </Link>
                <Link
                  href="/certifiedorganization"
                  className="rounded-xl bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 text-xs font-bold border border-white/20 transition-all"
                >
                  Verify Status
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
