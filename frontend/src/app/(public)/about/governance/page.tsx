import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Governance | SAAF",
  description: "Decision-making structure and oversight.",
};

export default function GovernancePage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "About", href: "/about/who-we-are" }, { label: "Governance" }]}
        title="Governance"
        meta="Last reviewed: 14 January 2026"
      />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="flex flex-col gap-6 font-sans text-base leading-relaxed text-text">
          <section>
            <h2 className="mb-2 font-sans text-lg font-semibold text-text">Decision-making structure</h2>
            <p>
              Accreditation decisions are made by an authorised decision-maker,
              independently of the assessor who conducts the assessment. This
              separation exists so the person recommending an outcome is never
              the same person deciding it — it is enforced in how applications
              are processed, not only stated as policy.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-sans text-lg font-semibold text-text">Oversight</h2>
            <p className="rounded-md border border-border bg-background-portal px-4 py-3 text-sm text-text-muted">
              Details of our oversight body and external review mechanism will be published here once
              finalized.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-sans text-lg font-semibold text-text">Conflict of interest</h2>
            <p>
              Assessors and decision-makers disclose any relationship with an
              applicant that could affect their judgement, and are recused
              from any case where such a relationship exists. See our{" "}
              <Link href="/resources/policies" className="text-secondary hover:underline">
                Impartiality Policy
              </Link>{" "}
              for the full requirements.
            </p>
          </section>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/resources/policies" className={cn(buttonVariants({ variant: "secondary" }))}>
              Read the full policy
            </Link>
            <Link href="/complaints-and-appeals" className={cn(buttonVariants({ variant: "tertiary" }))}>
              Raise a concern →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
