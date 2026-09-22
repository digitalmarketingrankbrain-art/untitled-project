import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ShieldCheck, CheckCircle2, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "About Accreditation | SAAF",
  description: "Learn about the benefits of accreditation, confidence-building, and international acceptance.",
};

export default function AboutAccreditationPage() {
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
            <span className="text-blue-600 font-semibold">About Accreditation</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 mb-2">
            <ShieldCheck className="size-3.5 text-blue-600" />
            <span>Value & Benefits</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            The Benefits Of Accreditation
          </h1>
        </div>
      </div>

      {/* Main Content Card - Matching Image 2 */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
          <p>
            Accreditation helps CABs deliver services with confidence. Accreditation demonstrates a CAB&apos;s competence to succeed and accomplish activities defined by its specific program scope of accreditation. CABs are able to obtain independent, third-party, credible outputs for themselves and for their customers.
          </p>

          <p>
            SAAF Accreditation procedures and criteria&apos;s are strictly applied as per international standards and guidelines, Hence SAAF Accreditation Programs are internationally accepted.
          </p>

          <p>
            Accreditation makes easier acceptance of products or services easier. Accreditation increases assurance to consumers that product or services confirms to applicable specifications.
          </p>

          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 border border-slate-200">
                <Award className="size-4 text-blue-600" />
                <span>Third-Party Credibility</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 border border-slate-200">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span>Global Market Acceptance</span>
              </div>
            </div>

            <Link
              href="/accreditation/programs"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-700 transition-colors"
            >
              <span>Explore Accreditation Programs</span>
              <ChevronRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

