import Link from "next/link";
import type { Metadata } from "next";
import { ApplicationRequestForm } from "@/components/accreditation/application-request-form";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Application Request Form | SAAF Accreditation",
  description: "Submit an official Conformity Assessment Body (CAB) accreditation request to SAAF.",
};

export default function ApplyPage() {
  return (
    <div className="bg-slate-50/60 pb-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
        {/* Left column: intro. Sticks while the longer form scrolls on desktop. */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Application Request Form
          </h1>
          <p className="mt-3 font-sans text-sm leading-relaxed text-slate-600">
            Conformity Assessment Bodies (CABs), laboratories, and inspection authorities can initiate their
            accreditation process by submitting the Application Request Form below.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link href="/login" className={cn(buttonVariants({ variant: "primary", size: "sm" }), "bg-blue-600 font-bold text-white hover:bg-blue-700")}>
              Already have an account? Sign In
            </Link>
            <Link href="/accreditation/programs" className={cn(buttonVariants({ variant: "tertiary", size: "sm" }))}>
              Browse Programs & Standards →
            </Link>
          </div>
        </aside>

        {/* Right column: the form, stacked in a single column. */}
        <ApplicationRequestForm />
      </div>
    </div>
  );
}
