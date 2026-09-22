import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Bell, ExternalLink, AlertCircle, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Notice Of Change(s) | SAAF Publications",
  description: "Official notices of accreditation requirements, standard updates, transition roadmaps, and international resolutions.",
};

export default function NoticeOfChangesPage() {
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
            <span className="text-blue-600 font-semibold">Notice Of Change(s)</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/60 px-3 py-1 text-xs font-semibold text-blue-700 mb-2">
            <ShieldCheck className="size-3.5 text-blue-600" />
            <span>Official Policy & Transition Notices</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Notice Of Change(s)
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-4xl leading-relaxed font-medium">
            It is imperative for all SAAF accredited conformity assessment bodies to comply with following accreditation requirements and IAF requirements which are applicable to the scope of accreditation, as per the accreditation agreement.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <Bell className="size-5 text-blue-600 shrink-0" />
              <h2 className="text-lg font-bold text-slate-900">Mandatory Transition & Change Requirements</h2>
            </div>
            <p>
              It is imperative that all SAAF-accredited Conformity Assessment Bodies (CABs) comply with all applicable accreditation requirements specified in the SAAF Accreditation Agreement, applicable SAAF accreditation criteria, mandatory documents, policies, procedures, technical requirements, and transition arrangements relevant to their accredited scope.
            </p>
            <p>
              SAAF will notify accredited CABs of changes to accreditation requirements, transition arrangements, and other applicable obligations through email and other official SAAF communications. CABs shall implement such changes within the specified implementation or transition period.
            </p>
            <p>
              Before deciding on the precise form and effective date of changed accreditation requirements, SAAF will obtain and take into account the views expressed by interested parties, as applicable. Draft documents and proposed changes made available for stakeholder consultation may be accessed at:
            </p>

            <div className="pt-1">
              <Link
                href="/publications/stakeholder-comments"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <FileText className="size-4 text-blue-600" />
                <span>View Documents For Stakeholders&apos; Comments</span>
                <ChevronRight className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <ExternalLink className="size-5 text-blue-600 shrink-0" />
              <h2 className="text-lg font-bold text-slate-900">International Mandatory Documents & Resolutions</h2>
            </div>
            <p>
              CABs are also responsible for remaining informed of all applicable international mandatory documents, resolutions, decisions, and transition policies issued by the relevant international organizations. The latest documents may be accessed through the following official websites:
            </p>

            <div className="grid gap-3 pt-2">
              {[
                {
                  title: "Global ACI Documents",
                  url: "https://global-aci.org/en/global-aci-documents/",
                },
                {
                  title: "Global ACI General Assembly Resolutions",
                  url: "https://global-aci.org/en/global-aci-documents/resolutions/",
                },
                {
                  title: "ILAC General Assembly Resolutions",
                  url: "https://ilac.org/publications-and-resources/ga-resolutions/",
                },
                {
                  title: "IAF General Assembly Resolutions",
                  url: "https://iaf.nu/en/iaf-documents/resolutions/",
                },
              ].map((res) => (
                <a
                  key={res.title}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-300 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="size-2 rounded-full bg-blue-600" />
                    <div>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-blue-700 transition-colors">{res.title}</span>
                      <p className="text-[11px] font-mono text-slate-500">{res.url}</p>
                    </div>
                  </div>
                  <ExternalLink className="size-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
                </a>
              ))}
            </div>

            <p className="pt-2">
              CABs shall ensure that the latest applicable international requirements, mandatory documents, resolutions, decisions, and transition policies are reviewed and implemented within the prescribed implementation or transition periods.
            </p>

            <p>
              Following the decision on and publication of changed accreditation requirements, SAAF will review and verify their effective implementation by each accredited CAB during subsequent office assessments, witness assessments, remote assessments, special assessments, document reviews, or other surveillance activities, as applicable, to confirm continued conformity with the applicable accreditation requirements.
            </p>

            <p>
              Furthermore, CABs shall notify SAAF without delay of any significant changes affecting their accredited activities, as required under the SAAF Accreditation Agreement.
            </p>
          </div>

          {/* Section 3 */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-5 text-xs text-slate-700 leading-relaxed space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
              <AlertCircle className="size-4 text-blue-600" />
              <span>Official SAAF Policy Obligation Notice:</span>
            </div>
            <p>
              SAAF shall notify CABs about any changes or applicable transitions by updating the above requirements. CABs shall have to abide and implement the required changes before the deadlines as per SAAF and IAF policies.
            </p>
            <p>
              Furthermore, CABs shall also notify SAAF about any significant change(s), as detailed in accreditation agreement, without any delay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
