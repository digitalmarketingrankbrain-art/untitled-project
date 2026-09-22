import Link from "next/link";
import { FlaskConical, ClipboardCheck, ShieldCheck, PackageCheck, UserCheck, ArrowRight, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { PROGRAMS } from "@/lib/programs";

const PROGRAM_ICONS: Record<string, LucideIcon> = {
  "testing-calibration-laboratories": FlaskConical,
  "inspection-bodies": ClipboardCheck,
  "management-systems-certification-bodies": ShieldCheck,
  "product-certification-bodies": PackageCheck,
  "certification-bodies-for-persons": UserCheck,
};

function ProgramsSection() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-800">
              <span className="size-1.5 rounded-full bg-blue-600" />
              SAAF Accreditation Programs
            </div>
            <h2 className="mt-4 font-display text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl">
              Technical Evaluation Scopes & ISO Standards
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-600">
            SAAF accredits conformity assessment bodies (CABs) across South Asia against internationally recognised ISO/IEC requirements, establishing verifiable confidence in laboratory testing, inspection, and certification.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((program, i) => {
            const Icon = PROGRAM_ICONS[program.slug] ?? FlaskConical;
            return (
              <Reveal key={program.slug} delayMs={i * 50} className="h-full">
                <div className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/60 hover:bg-white hover:shadow-2xl hover:shadow-blue-900/10">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center rounded-lg bg-blue-900/5 px-2.5 py-1 text-xs font-bold font-mono text-blue-900">
                        {program.standardReference}
                      </span>
                      <div className="rounded-xl bg-blue-600/10 p-3 text-blue-700 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                        <Icon className="size-5" />
                      </div>
                    </div>

                    <h3 className="mt-5 font-display text-xl font-bold text-slate-900 group-hover:text-blue-800">
                      {program.name}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {program.scopeDescription}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-slate-200/80 pt-4">
                    <Link
                      href={`/accreditation/programs/${program.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 transition-all group-hover:translate-x-1"
                    >
                      <span>Explore Accreditation Scheme</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { ProgramsSection };
