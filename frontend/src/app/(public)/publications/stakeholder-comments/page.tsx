import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Inbox } from "lucide-react";

export const metadata: Metadata = {
  title: "Documents For Stakeholders' Comments | SAAF Publications",
  description: "Draft policies and proposals open for public stakeholder feedback and review.",
};

export default function StakeholderCommentsPage() {
  return (
    <div className="bg-slate-50/50 min-h-[70vh] pb-16">
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
            <span className="text-blue-600 font-semibold">Documents For Stakeholders&apos; Comments</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/60 px-3 py-1 text-xs font-semibold text-blue-700 mb-2">
            <ShieldCheck className="size-3.5 text-blue-600" />
            <span>Official SAAF Public Consultation</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Documents For Stakeholders&apos; Comments
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 text-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-12 shadow-sm">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Inbox className="size-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Notice</h2>
          <p className="mt-3 text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            At the moment, there is no document for which the stakeholders&apos; comments are to be requested.
          </p>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center gap-4 text-xs font-semibold text-slate-500">
            <span>Official SAAF Secretariat</span>
            <span>•</span>
            <span>Public Consultation Registry</span>
          </div>
        </div>
      </div>
    </div>
  );
}
