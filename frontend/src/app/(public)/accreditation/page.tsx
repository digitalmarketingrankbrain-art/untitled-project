import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight, Award, Building2, FlaskConical, Users, PackageCheck, FileCheck2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Accreditation Services | SAAF",
  description: "Explore official SAAF accreditation schemes for management systems, testing labs, inspection bodies, and certifiers.",
};

const ACCREDITATION_SERVICES = [
  {
    title: "Management Systems Accreditation",
    href: "/accreditation/programs/management-systems",
    icon: Award,
    description: "ISO 9001, ISO 14001, ISO 45001, ISO 27001, ISO 22000 & FSSC 22000 certification bodies.",
  },
  {
    title: "Inspection Bodies Accreditation",
    href: "/accreditation/programs/inspection-bodies",
    icon: Building2,
    description: "ISO/IEC 17020 inspection agencies, engineering surveyors, and industrial quality auditors.",
  },
  {
    title: "Testing Laboratories Accreditation",
    href: "/accreditation/programs/laboratories",
    icon: FlaskConical,
    description: "ISO/IEC 17025 testing & calibration labs, and ISO 15189 medical diagnostic laboratories.",
  },
  {
    title: "Personnel Certification Bodies Accreditation",
    href: "/accreditation/programs/personnel-certification",
    icon: Users,
    description: "ISO/IEC 17024 professional certifiers, auditor qualification boards, and skill evaluators.",
  },
  {
    title: "Product Certification Bodies Accreditation",
    href: "/accreditation/programs/product-certification",
    icon: PackageCheck,
    description: "ISO/IEC 17065 product, process, and service certification authorities.",
  },
  {
    title: "Validation and Verification Bodies Accreditation",
    href: "/accreditation/programs/validation-and-verification",
    icon: FileCheck2,
    description: "ISO/IEC 17029 greenhouse gas emission verifiers, project validation, and ESG claims.",
  },
];

export default function AccreditationOverviewPage() {
  return (
    <div className="bg-slate-50/50 min-h-screen pb-16">
      {/* Header Banner */}
      <div className="border-b border-slate-200 bg-white py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <nav className="mb-4 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-slate-800 transition-colors">Home</Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-blue-600 font-semibold">Accreditation Services</span>
          </nav>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Accreditation Services
          </h1>
        </div>
      </div>

      {/* Main Grid - Matching Image 4 */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {ACCREDITATION_SERVICES.map((serv) => {
            const Icon = serv.icon;
            return (
              <div
                key={serv.title}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div>
                  <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="size-6" />
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {serv.title}
                  </h2>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {serv.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    href={serv.href}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-700 transition-colors"
                  >
                    <span>Explore &gt;&gt;</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
