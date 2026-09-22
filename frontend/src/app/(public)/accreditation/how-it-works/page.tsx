import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "How Accreditation Works | SAAF",
  description: "The full accreditation process, stage by stage, including what happens on a negative decision.",
};

const STAGES = [
  {
    id: "apply",
    title: "1. Apply",
    body: "Submit your application with the required supporting documents for the program you're seeking. Required documents are listed against your application so nothing is ambiguous.",
  },
  {
    id: "review",
    title: "2. Review",
    body: "We confirm your application is complete and eligible. If anything is missing, you'll see exactly what's needed directly in your application — not buried in an email thread.",
  },
  {
    id: "assessment",
    title: "3. Assessment",
    body: "An assigned assessor evaluates your organisation against the relevant scope's criteria, based on documented evidence and, where applicable, on-site or remote observation.",
  },
  {
    id: "decision",
    title: "4. Decision",
    body: "An authorised decision-maker reviews the assessment and makes a determination — independently of the assessor who conducted it. The assessor recommends; a separate role decides.",
  },
  {
    id: "accreditation",
    title: "5. Accreditation",
    body: "Once granted, your accreditation is published and becomes publicly verifiable through our Verify tool, with your defined scope and effective date.",
  },
  {
    id: "ongoing",
    title: "6. Ongoing",
    body: "Accreditation is maintained through periodic surveillance and renewal — not granted once and forgotten. Deadlines are tracked and flagged well in advance.",
  },
  {
    id: "if-declined",
    title: "If your application is declined",
    body: "You'll receive a stated reason for the decision. You may appeal through Complaints & Appeals, or address the findings and reapply where eligible. A negative outcome is not the end of the process without recourse.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Accreditation", href: "/accreditation" }, { label: "How It Works" }]}
        title="A process you can follow, start to finish"
      />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <ol className="flex flex-col gap-10">
          {STAGES.map((stage) => (
            <li key={stage.id} id={stage.id} className="scroll-mt-24">
              <h2 className="font-sans text-lg font-semibold text-text">{stage.title}</h2>
              <p className="mt-2 font-sans text-base text-text-muted">{stage.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 flex flex-wrap gap-3 border-t border-border pt-8">
          <Link href="/accreditation/programs" className={cn(buttonVariants({ variant: "primary" }))}>
            View programs
          </Link>
          <Link href="/apply" className={cn(buttonVariants({ variant: "secondary" }))}>
            Start an application
          </Link>
        </div>
      </div>
    </>
  );
}
