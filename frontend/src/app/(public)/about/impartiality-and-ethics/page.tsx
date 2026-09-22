import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Impartiality & Ethics | SAAF",
  description: "Impartiality policy, conflict-of-interest handling, and how to raise a concern.",
};

export default function ImpartialityPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "About", href: "/about/who-we-are" }, { label: "Impartiality & Ethics" }]}
        title="Impartiality & Ethics"
      />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="flex flex-col gap-6 font-sans text-base leading-relaxed text-text">
          <p>
            Assessors and decision-makers disclose any relationship with an
            applicant that could affect their judgement, and are recused from
            any case where such a relationship exists.
          </p>
          <p>
            If you believe a decision was affected by a conflict of interest,
            you can raise it through our{" "}
            <Link href="/complaints-and-appeals" className="text-secondary hover:underline">
              Complaints &amp; Appeals
            </Link>{" "}
            process.
          </p>
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
