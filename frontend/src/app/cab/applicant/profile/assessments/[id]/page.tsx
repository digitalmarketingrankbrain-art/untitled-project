import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getAssessmentByIdForUser } from "@/lib/portal/cb-assessments-data";
import { STATUS_TONE, STATUS_LABEL, TYPE_LABEL } from "@/lib/portal/cb-assessments-status";
import { getLatestNotificationForAssignment } from "@/lib/portal/assessment-notification-data";
import { AssessmentAcknowledgementPanel } from "@/components/portal/assessment-acknowledgement-panel";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-3 last:border-b-0">
      <span className="font-sans text-sm text-text-muted">{label}</span>
      <span className="max-w-md text-right font-sans text-sm text-text">{value || "—"}</span>
    </div>
  );
}

export default async function AssessmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const assessment = await getAssessmentByIdForUser(id, session!.user.id);
  if (!assessment) notFound();
  const notification = await getLatestNotificationForAssignment(id);

  return (
    <div className="px-6 py-8">
      <Link href="/cab/applicant/profile" className="flex items-center gap-1.5 font-sans text-sm text-secondary hover:underline">
        <ArrowLeft className="size-3.5" strokeWidth={1.75} /> Back to Profile
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-text">Assessment {assessment.assessmentNumber}</h1>
          <p className="font-sans text-sm text-text-muted">{TYPE_LABEL[assessment.assessmentType]}</p>
        </div>
        <StatusBadge tone={STATUS_TONE[assessment.status]} label={STATUS_LABEL[assessment.status]} />
      </div>

      <div className="mt-6">
        <AssessmentAcknowledgementPanel notification={notification} />
      </div>

      {assessment.reportFinalized && (assessment.reportSummary || assessment.reportRecommendation) && (
        <div className="mb-6 rounded-lg border border-success-text/30 bg-success-surface p-5">
          <h2 className="font-sans text-sm font-semibold text-success-text">Finalized assessment report</h2>
          {assessment.reportSummary && <p className="mt-2 font-sans text-sm text-text">{assessment.reportSummary}</p>}
          {assessment.reportRecommendation && <p className="mt-2 font-sans text-sm text-text-muted">{assessment.reportRecommendation}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-border p-6 lg:col-span-2">
          <h2 className="font-sans text-sm font-semibold text-text">Findings</h2>
          {assessment.findings.length === 0 ? (
            <div className="mt-4">
              <EmptyState title="No findings recorded yet." description="Findings will appear here once the assessor submits their report." />
            </div>
          ) : (
            <ul className="mt-4 flex flex-col gap-4">
              {assessment.findings.map((f, i) => (
                <li key={i} className="rounded-lg border border-border p-4">
                  <p className="font-sans text-sm text-text">{f.criterion}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <StatusBadge tone={f.status === "CONFORMS" ? "success" : f.status === "NON_CONFORMANCE" ? "error" : "info"} label={f.status.replace(/_/g, " ")} size="sm" />
                    {f.severity && <StatusBadge tone="warning" label={f.severity} size="sm" />}
                  </div>
                  {f.notes && <p className="mt-2 font-sans text-sm text-text-muted">{f.notes}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-border p-6">
          <Row label="Scheme(s)" value={assessment.schemeNames.join(", ")} />
          <Row label="Lead Assessor" value={assessment.assessorName} />
          <Row label="Application" value={assessment.applicationReference} />
          <Row label="Due Date" value={assessment.dueDate} />
          <Row label="Assigned" value={assessment.assignedAt} />
          <Row label="Responded" value={assessment.respondedAt} />
          <Row label="Started" value={assessment.startedAt} />
          <Row label="Report Submitted" value={assessment.reportSubmittedAt} />
        </div>
      </div>
    </div>
  );
}
