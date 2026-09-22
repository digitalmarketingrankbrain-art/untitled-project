import React from "react";
import Link from "next/link";
import { ChevronRight, MessageSquare } from "lucide-react";

export default function FeedbackPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="bg-[#0b2341] text-white py-12 border-b border-blue-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <nav className="mb-4 flex items-center justify-center gap-2 text-xs text-slate-300 font-medium">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-amber-400 font-semibold">Feedback</span>
          </nav>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">UASL Feedback & Appeals</h1>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-md space-y-4 text-slate-700">
          <p className="text-sm leading-relaxed">
            UASL welcomes constructive feedback, service evaluations, and formal inquiries from CABs, certified client organizations, and public stakeholders.
          </p>
          <div className="pt-4">
            <Link href="/get-in-touch" className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs">
              Submit Online Feedback
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
