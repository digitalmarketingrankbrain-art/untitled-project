import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ShieldCheck, CheckCircle2, Award, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "International Recognition | SAAF",
  description: "IAF Multilateral Recognition Arrangement (MLA), APAC MRA, and Global ACI international recognition status.",
};

export default function InternationalRecognitionPage() {
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
            <span className="text-blue-600 font-semibold">International Recognition</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 mb-2">
            <ShieldCheck className="size-3.5 text-blue-600" />
            <span>Global Equivalence & Mutual Recognition</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            International Recognition
          </h1>
        </div>
      </div>

      {/* Main Content Cards - Matching Images 3, 4, 5 */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 space-y-8">
        {/* IAF Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <Award className="size-6 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">
              International Accreditation Forum (IAF) MLA Status
            </h2>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            SAAF is an Accreditation Body member of International Accreditation Forum (IAF) and had adopted the IAF code of conduct on 03 November 2016.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            On May 17, 2022 - SAAF became a signatory of the Multilateral Recognition Arrangement for Main Scope: Management Systems Certification - ISO/IEC 17021-1 operated by IAF.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            On August 09, 2022 - SAAF became a signatory of the Multilateral Recognition Arrangement for following additional sub-scopes operated by IAF:
          </p>

          <ul className="grid sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-800">
            {[
              "1. Quality Management Systems QMS (ISO 9001)",
              "2. Environmental Management Systems EMS (ISO 14001)",
              "3. Food Safety Management Systems FSMS (ISO 22000)",
              "4. Information Security Systems ISMS (ISO 27001)",
              "5. Medical Device Quality MDQMS (ISO 13485)",
              "6. Occupational Health & Safety OHSMS (ISO 45001)",
            ].map((sub) => (
              <li key={sub} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                <CheckCircle2 className="size-3.5 text-blue-600 shrink-0" />
                <span>{sub}</span>
              </li>
            ))}
          </ul>

          <p className="text-sm text-slate-700 leading-relaxed pt-2">
            On May 13, 2025 - SAAF became a signatory of the Multilateral Recognition Arrangement for Main Scope: Certification of Persons - ISO/IEC 17024 operated by IAF.
          </p>
          <p className="text-xs text-slate-500 leading-relaxed pt-1">
            The International Accreditation Forum (IAF) is a worldwide association of accreditation bodies and other bodies interested in conformity assessment in the fields of management systems, products, processes, services, personnel, validation and verification and other similar programmes of conformity assessment.
          </p>
        </div>

        {/* APAC Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <Globe className="size-6 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Asia Pacific Accreditation Cooperation (APAC) MRA Status
            </h2>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            On April 29, 2022 - SAAF became a signatory of the Mutual Recognition Arrangement for Environmental management systems EMS (ISO/IEC 17021-2 / ISO 14001) & Quality management systems QMS (ISO/IEC 17021-3 / ISO 9001) operated by APAC.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            On June 02, 2022 - SAAF became a signatory of the Mutual Recognition Arrangement for additional sub-scopes (FSMS, ISMS, MDQMS, OHSMS).
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            On April 07, 2025 - SAAF became a signatory of the Mutual Recognition Arrangement for Persons (ISO/IEC 17024), Inspection (ISO/IEC 17020), and Testing (ISO/IEC 17025).
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            On April 14, 2025 - SAAF became a signatory for Anti-Bribery (ISO 37001), Compliance (ISO 37301), and Energy Management Systems (ISO 50001).
          </p>

          <p className="text-xs text-slate-500 leading-relaxed pt-2">
            The Asia Pacific Accreditation Cooperation (APAC) was established on 1 January 2019 by the amalgamation of APLAC and PAC. APAC&apos;s primary role is to manage and expand a mutual recognition arrangement (MRA) among accreditation bodies in the Asia Pacific region. Conformity assessment results produced by SAAF-accredited bodies are accepted by all APAC MRA signatories globally.
          </p>
        </div>

        {/* Global ACI Section */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-6 sm:p-8 shadow-sm space-y-3">
          <div className="flex items-center gap-3 font-bold text-blue-900 text-base">
            <ShieldCheck className="size-6 text-blue-600" />
            <span>Global Accreditation Cooperation Incorporated (Global ACI)</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            The Global Accreditation Cooperation Incorporated (Global ACI) is the international authority on the accreditation of laboratories, certification bodies, inspection bodies, proficiency testing providers, validation/verification bodies, reference material producers and biobanks. Its membership includes accreditation bodies, regional cooperation bodies and stakeholder organisations from around the world.
          </p>
          <p className="text-xs font-semibold text-blue-800">
            Effective 1 January 2026, Global ACI has assumed the former roles of the International Accreditation Forum (IAF) and the International Laboratory Accreditation Cooperation (ILAC).
          </p>
        </div>
      </div>
    </div>
  );
}

