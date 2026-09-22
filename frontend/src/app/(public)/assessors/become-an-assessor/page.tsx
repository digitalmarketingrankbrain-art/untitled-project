import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Become an Assessor | SAAF",
  description: "Express interest in becoming an assessor.",
};

/**
 * An expression-of-interest entry point, not a full application — assessor
 * accounts are admin-provisioned after review (Phase 2/9 assumption).
 */
export default function BecomeAnAssessorPage() {
  return (
    <PageHeader
      breadcrumbs={[{ label: "Become an Assessor" }]}
      title="Become an Assessor"
      description="Assessors evaluate applicant organisations against defined criteria within a specific accreditation scope. If you have relevant technical competence and are interested in assessment work, tell us about your background."
    >
      <div className="mt-6 max-w-2xl font-sans text-sm text-text-muted">
        <p>
          This is an expression of interest, not a full application. If your
          background is a potential match, our team will follow up with next
          steps, including competence review and training.
        </p>
      </div>
      <Button variant="primary" className="mt-6">
        Express interest
      </Button>
    </PageHeader>
  );
}
