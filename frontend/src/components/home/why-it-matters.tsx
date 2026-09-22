import Link from "next/link";
import { Shield, FileCheck, Award, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { HeroMotif } from "./hero-motif";

const POINTS = [
  {
    title: "Documented Technical Scopes",
    description: "Every SAAF accreditation is anchored in explicit ISO/IEC parameters, testing methods, and published criteria — never vague assertions.",
    icon: FileCheck,
  },
  {
    title: "Impartial Peer Assessment",
    description: "Qualified assessors without conflict of interest rigorously audit personnel, equipment, calibration, and operational governance.",
    icon: Shield,
  },
  {
    title: "Tamper-Proof Verification",
    description: "All valid accreditation certificates are indexed in real-time on the public SAAF Register for instant cross-border validation.",
    icon: Award,
  },
];

function WhyItMatters() {
  return (
    <section className="bg-slate-50 py-20 sm:py-28">
      <Reveal className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:items-center">
        
        {/* Left Visual Card */}
        <div className="lg:col-span-5">
          <div className="relative min-h-[360px] overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 text-white">
            <div className="pointer-events-none absolute -right-16 -top-16 opacity-40">
              <HeroMotif className="h-80 w-80" tone="dark" />
            </div>
            <div className="relative flex h-full flex-col justify-between">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
                Regional Oversight Principle
              </div>

              <div className="mt-20">
                <p className="font-display text-2xl font-extrabold leading-snug text-white sm:text-3xl">
                  One Rigorous Standard. Total South Asian Acceptance.
                </p>
                <p className="mt-3 text-xs leading-relaxed text-blue-100/80">
                  By adhering strictly to international evaluation protocols, SAAF eliminates technical barriers and fosters confidence across regional and global trade markets.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Feature List */}
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-900">
            Why SAAF Accreditation Matters
          </div>
          <h2 className="mt-4 font-display text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl">
            Independent Technical Competence, Verified.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Accreditation provides regulators, industries, and consumers with empirical proof that testing, calibration, and inspection results are technically sound, impartial, and compliant.
          </p>

          <div className="mt-8 space-y-6">
            {POINTS.map((point) => {
              const Icon = point.icon;
              return (
                <div key={point.title} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-500/40 hover:shadow-md">
                  <div className="rounded-xl bg-blue-50 p-3 text-blue-700 shrink-0">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-900">{point.title}</h3>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">{point.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <Link
              href="/about/who-we-are"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-800 hover:text-blue-900 hover:underline"
            >
              <span>Discover the SAAF Evaluation Philosophy</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

      </Reveal>
    </section>
  );
}

export { WhyItMatters };
