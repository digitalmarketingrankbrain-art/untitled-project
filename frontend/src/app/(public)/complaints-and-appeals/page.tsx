import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Complaints & Appeals | SAAF",
  description: "How to appeal an accreditation decision or raise a complaint about conduct or impartiality.",
};

const STEPS = [
  { title: "Submit", body: "Tell us what you're appealing or complaining about, with any supporting evidence." },
  { title: "Acknowledgement", body: "We confirm receipt of your submission. Our specific acknowledgement-time commitment will be published here once finalized." },
  { title: "Review", body: "Your submission is reviewed by staff not involved in the original decision or conduct in question." },
  { title: "Outcome", body: "You receive a written outcome once our review is complete." },
  { title: "Escalation", body: "If you're not satisfied with the outcome, an escalation path is available — details will be published here once finalized." },
];

export default function ComplaintsAndAppealsPage() {
  return (
    <PageHeader
      breadcrumbs={[{ label: "Complaints & Appeals" }]}
      title="Complaints & Appeals"
      description="You may appeal an accreditation decision or raise a complaint about the conduct of an assessor or staff member."
    >
      <ol className="mt-8 flex flex-col gap-6">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex gap-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-xs text-text-inverse">
              {i + 1}
            </div>
            <div>
              <p className="font-sans text-sm font-semibold text-text">{step.title}</p>
              <p className="mt-1 font-sans text-sm text-text-muted">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <Button variant="primary" className="mt-8">
        Submit a complaint or appeal
      </Button>
    </PageHeader>
  );
}
