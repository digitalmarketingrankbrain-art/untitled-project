import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ShieldCheck, CheckCircle2, FileCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Impartiality Policy | SAAF Publications",
  description: "Official SAAF Impartiality Commitment, Conflict of Interest Policy, and Safeguard Statements.",
};

export default function ImpartialityPolicyPage() {
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
            <span className="text-blue-600 font-semibold">Impartiality Policy</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/60 px-3 py-1 text-xs font-semibold text-blue-700 mb-2">
            <ShieldCheck className="size-3.5 text-blue-600" />
            <span>Official Policy Statement</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Impartiality Policy
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm leading-relaxed text-slate-700 text-sm sm:text-base space-y-6">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100 text-xs font-semibold text-slate-500">
            <FileCheck className="size-5 text-blue-600" />
            <span>Document Code: SAAF-POL-IMP-01</span>
            <span>•</span>
            <span>Compliance: ISO/IEC 17011 Clause 4.4</span>
          </div>

          <p>
            Impartiality is one of the most important means of confidence-building. SAAF also understands that Impartiality is of utmost importance to maintain the interest of all stakeholders while rendering its accreditation services. SAAF provides accreditation services on a non-profitable basis, it is structured and organized in a way to safeguard impartiality and does not get affected by means of any commercial, financial or other pressures.
          </p>

          <p>
            SAAF strives to comply with all requirements of ISO 17011 thereby SAAF is committed to and fully responsible for the performance of all its accreditation activities impartiality and objectively.
          </p>

          <p>
            SAAF ensures impartiality and objectivity of its services thereof all personnel (including externally contracted assessors/ experts, all committee members) involved in the accreditation process are required to be free from any undue pressures which may compromise their ability to act impartially and objectively. All personnel are required to declare any potential conflict of interest whenever it may arise.
          </p>

          <p>
            SAAF does not compromise, offer or provide any service that affects its impartiality. SAAF evaluates the potential risks to impartiality on an ongoing basis to safeguarding impartiality through Risk Analysis, internal audit, management review and impartiality committee meeting. When an unacceptable risk to impartiality is identified and which cannot be mitigated to an acceptable level, then accreditation is not awarded.
          </p>

          <p>
            SAAF ensures that its policies, processes, and procedures are non-discriminatory and are applied in a non-discriminatory manner. SAAF makes its services accessible to all Conformity Assessment Bodies, whose application for accreditation falls within the scope of its accreditation activities as defined within its policies and rules. Access is not conditional upon the size of the applicant conformity assessment body or capital, nor accreditation is conditional upon the number of conformity assessment bodies already accredited.
          </p>

          <p>
            SAAF refuses services to a conformity assessment body because of proven evidence of fraudulent behavior, falsification of information or deliberate violation of accreditation requirements.
          </p>

          <p>
            In the event that any customer or other stakeholder has concerns regarding impartiality or objectivity of SAAF, SAAF has a procedure for handling complaints and appeals publicly available on its official website.
          </p>

          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-slate-900 text-sm">Issued by Director Accreditation</p>
              <p className="text-xs text-slate-500">South Asia Accreditation Foundation (SAAF)</p>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>Verified Official Statement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
