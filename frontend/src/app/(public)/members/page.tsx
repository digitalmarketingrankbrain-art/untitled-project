import React from "react";
import Link from "next/link";
import { ChevronRight, Users } from "lucide-react";

export default function MembersPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="bg-gradient-to-b from-slate-100 via-blue-50/40 to-white text-slate-900 py-12 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <nav className="mb-4 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-blue-700 transition-colors">Home</Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-blue-900 font-bold">Members</span>
          </nav>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#0b2341] sm:text-5xl">Board & Committee Members</h1>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-md space-y-4 text-slate-700">
          <p className="text-sm leading-relaxed">
            The governance of UASL is guided by an independent Board of Directors, Impartiality Committee, and technical evaluation panels comprised of industry experts.
          </p>
        </div>
      </div>
    </div>
  );
}
