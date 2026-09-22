import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SaafLogo } from "@/components/ui/saaf-logo";
import { ShieldCheck, ArrowRight } from "lucide-react";

function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-slate-200/80 bg-slate-50 py-16 text-slate-900">
      <Reveal className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm lg:flex-row lg:p-10">
          <div className="flex flex-col items-start gap-3">
            <SaafLogo variant="horizontal" size="lg" lightMode={false} />
            <h2 className="mt-2 font-display text-2xl font-extrabold text-[#0b2341] sm:text-3xl">
              Demonstrate Technical Competence Worldwide
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-slate-600 font-normal">
              Join leading testing laboratories, inspection bodies, and certification authorities accredited under the UASL independent assessment framework.
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row w-full lg:w-auto">
            <Link
              href="/apply"
              className={cn(
                buttonVariants({ variant: "primary", size: "lg" }),
                "bg-[#0b2341] text-white font-bold hover:bg-blue-900 justify-center rounded-xl px-6 shadow-md"
              )}
            >
              <span>Apply for Accreditation</span>
              <ArrowRight className="size-4 text-amber-400" />
            </Link>
            <Link
              href="/certifiedorganization"
              className={cn(
                buttonVariants({ variant: "tertiary", size: "lg" }),
                "border border-slate-300 text-slate-700 hover:bg-slate-50 justify-center rounded-xl px-5 font-semibold"
              )}
            >
              <ShieldCheck className="size-4 text-blue-700" />
              <span>Verify Register</span>
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export { FinalCta };
