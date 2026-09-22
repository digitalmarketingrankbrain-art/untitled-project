import Link from "next/link";
import { Quote, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

function LeadershipSection() {
  return (
    <section className="bg-slate-50 py-20 sm:py-28">
      <Reveal className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-900">
            Institutional Leadership &amp; Oversight
          </div>
          <h2 className="mt-4 font-display text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl">
            Governed by Technical Integrity and Independence.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            SAAF is directed by an independent accreditation council bringing together technical experts, industry leaders, and quality specialists dedicated to upholding rigorous conformity assessment across South Asia.
          </p>
          <div className="mt-6">
            <Link
              href="/about/governance"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-800 hover:text-blue-900 hover:underline"
            >
              <span>Explore SAAF Governance Council &amp; Structure</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative rounded-3xl border border-slate-200 border-l-8 border-l-amber-500 bg-white p-8 sm:p-10 shadow-xl">
            <Quote className="size-10 text-amber-500/40" strokeWidth={1.5} />
            <p className="mt-4 font-display text-2xl font-bold leading-snug text-slate-900">
              &ldquo;Technical trust cannot be claimed through marketing. It is built strictly through verifiable competence, absolute impartiality, and unyielding empirical evidence.&rdquo;
            </p>
            <div className="mt-8 border-t border-slate-100 pt-6">
              <p className="font-display text-base font-extrabold text-slate-900">Dr. Meera Raghunathan</p>
              <p className="text-xs font-semibold text-blue-800">Chair, SAAF Technical Governance Board</p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export { LeadershipSection };
