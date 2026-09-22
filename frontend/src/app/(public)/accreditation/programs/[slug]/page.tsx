import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { PROGRAMS } from "@/lib/programs";


export function generateStaticParams() {
  return PROGRAMS.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = PROGRAMS.find((p) => p.slug === slug);
  if (!program) return {};
  return {
    title: `${program.name} | SAAF`,
    description: program.scopeDescription,
  };
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = PROGRAMS.find((p) => p.slug === slug);
  if (!program) notFound();

  return (
    <div className="bg-slate-50/50 min-h-screen pb-16">
      {/* Header Banner */}
      <div className="border-b border-slate-200 bg-white py-8 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <nav className="mb-4 flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-slate-800 transition-colors">Home</Link>
            <ChevronRight className="size-3 text-slate-400" />
            <Link href="/accreditation" className="hover:text-slate-800 transition-colors">Accreditation</Link>
            <ChevronRight className="size-3 text-slate-400" />
            <span className="text-blue-600 font-semibold">{program.name}</span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 mb-2">
            <ShieldCheck className="size-3.5 text-blue-600" />
            <span>SAAF Official Accreditation Scheme</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {program.name}
          </h1>
          <div className="mt-2 font-mono text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-md inline-block border border-blue-200">
            Standard Reference: {program.standardReference}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
          {/* Main Overview Paragraphs */}
          <div className="space-y-4">
            <p className="font-medium text-slate-800">
              {program.details?.overview || program.scopeDescription}
            </p>

            {program.details?.fullDescription && (
              <div className="space-y-4 pt-2 whitespace-pre-line text-slate-600 text-sm">
                {program.details.fullDescription}
              </div>
            )}
          </div>

          {/* Sub-Heading & Inspection Scopes List (If Inspection Bodies) */}
          {program.details?.subHeading && (
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h2 className="text-xl font-bold text-slate-900">
                {program.details.subHeading}
              </h2>
              {program.details.inspectionScopes && (
                <div className="space-y-2 pt-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Types of Inspection, Surveys and Risk Assessments Covered:
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-2 text-xs font-medium text-slate-700">
                    {program.details.inspectionScopes.map((scope, idx) => (
                      <li key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <CheckCircle2 className="size-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{scope}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Sub-Cards for Validation and Verification Bodies */}
          {program.details?.subCards && (
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">
                Validation & Verification Sub-Program Schemes
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {program.details.subCards.map((card) => (
                  <div key={card.title} className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-5 shadow-sm">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm mb-2">{card.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-200/80">
                      <Link
                        href={card.href}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-800"
                      >
                        <span>Explore &gt;&gt;</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Application Request Callout Box - Matching all reference images */}
          <div className="pt-6 border-t border-slate-200">
            <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-900 text-sm">Documents for Accreditation & Application Request</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Conformity Assessment Bodies interested in applying for the Accreditation Scheme can request the application form online.
                </p>
              </div>

              <Link
                href="/apply"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-blue-700 transition-colors shrink-0"
              >
                <span>Application Request &gt;&gt;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
