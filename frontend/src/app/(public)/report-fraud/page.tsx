import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { FraudReportForm } from "@/components/fraud/fraud-report-form";

export const metadata: Metadata = {
  title: "Report Fraud / Impersonation | SAAF",
  description: "Report a suspected fraudulent, expired, or misused accreditation claim, or impersonation of SAAF.",
};

export default function ReportFraudPage() {
  return (
    <PageHeader
      breadcrumbs={[{ label: "Report Fraud / Impersonation" }]}
      title="Report Fraud / Impersonation"
      description="If you've seen an accreditation claim that looks fabricated, expired, or misused — or a website or document impersonating SAAF — tell us. Reports can be submitted anonymously."
    >
      <div className="mt-8 max-w-xl">
        <FraudReportForm />
      </div>
    </PageHeader>
  );
}
