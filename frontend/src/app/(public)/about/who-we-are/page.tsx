import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ShieldCheck, CheckCircle2, Award, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About SAAF | South Asia Accreditation Foundation",
  description: "Learn about South Asia Accreditation Foundation, our not-for-profit mandate, international recognition, and governance.",
};

export default function WhoWeArePage() {
  return (
    <div className="bg-slate-50/50 min-h-screen pb-16">
      {/* Header Banner */}
      <div className="border-b border-slate-200 bg-white py-8 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <nav className="mb-4 flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-slate-800 transition-colors">Home</Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-slate-500">About</span>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-blue-600 font-semibold">About SAAF</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 mb-2">
            <ShieldCheck className="size-3.5 text-blue-600" />
            <span>Independent Regional Accreditation Body</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            South Asia Accreditation Foundation
          </h1>
        </div>
      </div>

      {/* Main Content Card - Matching Image 1 */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
          <p>
            South Asia Accreditation Foundation (SAAF) is a not-for-profit organization. It operates in accordance with relevant international standards and requirements and maintains integrity and impartiality while taking into account national and public interest. SAAF has established an independent, impartial, and transparent accreditation system. As a not-for-profit accreditation body, decisions made by SAAF are not subject to any commercial or financial obligations.
          </p>

          <p>
            SAAF is internationally recognized by having a signatory status across multilateral recognition arrangement of Global ACI, mutual recognition arrangements of Asia Pacific Accreditation Cooperation (APAC). SAAF represents the interests of the stakeholders at international forums through membership and active participation with simultaneously ensuring measures to safeguard impartiality and objectivity of its accreditation process.
          </p>

          <p>
            South Asia Accreditation Foundation (SAAF) provides accreditation to Conformity Assessment Bodies for various management system schemes as per ISO/IEC 17021, Validation and Verification Bodies (VVB) as per ISO/IEC 17029, Product Certification Bodies (PrCB) as per ISO/IEC 17065, Certification Bodies for Person as per ISO/IEC 17024, Testing Laboratories as per ISO/IEC 17025, Inspection bodies as per ISO/IEC 17020, based on an assessment of their competence as per its criteria and in accordance with SAAF and international standards and guidelines.
          </p>

          <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 border border-slate-200">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span>Not-For-Profit Status</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 border border-slate-200">
              <Award className="size-4 text-blue-600" />
              <span>ISO/IEC 17011 Compliant</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 border border-slate-200">
              <Building2 className="size-4 text-blue-600" />
              <span>Global ACI & APAC Signatory</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
