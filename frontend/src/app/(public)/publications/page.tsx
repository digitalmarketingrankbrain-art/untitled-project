import { Metadata } from "next";
import Link from "next/link";
import { FileText, BookOpen, Info, ShieldAlert, MessageSquare, Bell, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Publications | South Asia Accreditation Foundation",
  description: "Browse official SAAF publications, documents, manuals, policies, stakeholder drafts, and notice of changes.",
};

const SECTIONS = [
  {
    title: "SAAF Documents",
    href: "/publications/documents",
    desc: "Official accreditation criteria, ISO compliance standards, symbol rules, and fee schedules.",
    icon: FileText,
    badge: "Criteria & Rules",
  },
  {
    title: "SAAF Manual And Procedures",
    href: "/publications/manual-and-procedures",
    desc: "Quality system manuals, standard operating procedures, and appeals resolution rules.",
    icon: BookOpen,
    badge: "Manuals & SOPs",
  },
  {
    title: "General Information",
    href: "/publications/general-information",
    desc: "Overview of publication rules, public register user guides, and document access policy.",
    icon: Info,
    badge: "General Guides",
  },
  {
    title: "Impartiality Policy",
    href: "/publications/impartiality-policy",
    desc: "Official declaration of impartiality, conflict of interest policy, and risk assessment framework.",
    icon: ShieldAlert,
    badge: "Ethics & Safeguards",
  },
  {
    title: "Documents For Stakeholder's Comments",
    href: "/publications/stakeholder-comments",
    desc: "Draft policies and proposed standards currently open for public industry feedback.",
    icon: MessageSquare,
    badge: "Public Consultation",
  },
  {
    title: "Notice Of Change(s)",
    href: "/publications/notice-of-changes",
    desc: "Mandatory standard revisions, transition roadmaps, and security notices.",
    icon: Bell,
    badge: "Official Notices",
  },
];

export default function PublicationsIndexPage() {
  return (
    <div className="bg-slate-50/50 min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 text-center sm:text-left">
          <span className="inline-block rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700 mb-2">
            Official Institutional Repository
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            SAAF Publications & Document Register
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            Access official standards, quality manuals, impartiality declarations, public stakeholder consultation drafts, and notices of change.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            return (
              <Link
                key={sec.title}
                href={sec.href}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="size-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      {sec.badge}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {sec.title}
                  </h2>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {sec.desc}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1 text-xs font-bold text-blue-700 group-hover:gap-2 transition-all">
                  <span>Explore Section</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
