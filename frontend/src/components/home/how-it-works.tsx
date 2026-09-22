import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { ArrowRight, CheckCircle } from "lucide-react";

const STEPS = [
  { title: "Enquiry & Application", description: "Submit your organizational profile and define the technical scope under ISO/IEC criteria." },
  { title: "Documentary Evaluation", description: "SAAF technical experts audit your quality manual, calibration logs, and operational procedures." },
  { title: "On-Site Assessment", description: "Qualified assessors evaluate practical staff competence, equipment accuracy, and impartiality." },
  { title: "Decision & Registration", description: "The independent SAAF Accreditation Committee awards formal accreditation and issues QR-verified credentials." },
];

function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-slate-50 border-y border-slate-200/80 py-16 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-900">
              The Accreditation Journey
            </div>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-slate-900 sm:text-4xl">
              A Transparent, Four-Stage Assessment Pathway
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-600">
            Every SAAF accreditation decision is grounded in empirical evidence, technical competence, and unyielding peer review.
          </p>
        </Reveal>

        <ol className="relative mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal as="li" key={step.title} delayMs={i * 60} className="relative">
              <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-500/50 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xl font-bold text-blue-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <CheckCircle className="size-4.5 text-emerald-600" />
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>

        <div className="mt-10 flex justify-start">
          <Link
            href="/accreditation/how-it-works"
            className={cn(
              buttonVariants({ variant: "primary", size: "default" }),
              "bg-blue-600 font-semibold text-white hover:bg-blue-700 rounded-xl px-5"
            )}
          >
            <span>View Accreditation Guidance</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export { HowItWorks };
