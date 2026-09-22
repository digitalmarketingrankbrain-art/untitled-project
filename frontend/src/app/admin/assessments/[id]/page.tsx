import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StatusBadge, type StatusTone } from "@/components/ui/status-badge";
import { Tabs } from "@/components/ui/tabs";
import {
  getAllAssignments,
  ASSIGNMENT_STATUS_LABEL,
  FINDING_STATUS_LABEL,
  type AssignmentStatus,
} from "@/lib/portal/assessor-data";
import { getLatestNotificationForAssignment } from "@/lib/portal/assessment-notification-data";
import {
  SendNotificationButton,
  NotificationStatusCard,
  ReportReviewActions,
} from "@/components/portal/admin-assessment-detail-actions";

const STATUS_TONE: Record<AssignmentStatus, StatusTone> = {
  PENDING: "warning",
  ACCEPTED: "info",
  DECLINED: "neutral",
  IN_PROGRESS: "info",
  REPORT_SUBMITTED: "success",
  COMPLETED: "success",
};

export default async function AdminAssessmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const assignments = await getAllAssignments();
  const assignment = assignments.find((a) => a.id === id);
  if (!assignment) notFound();

  const notification = await getLatestNotificationForAssignment(id);

  const nonConformances = assignment.criteria
    .map((c) => ({ criterion: c, finding: assignment.findings[c.id] }))
    .filter((f) => f.finding && (f.finding.status === "NON_CONFORMANCE" || f.finding.status === "OBSERVATION"));

  return (
    <div className="px-6 py-8">
      <Breadcrumbs items={[{ label: "Assessments", href: "/admin/assessments" }, { label: assignment.organisationName }]} />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-semibold text-text">{assignment.organisationName}</h1>
        <StatusBadge tone={STATUS_TONE[assignment.status]} label={ASSIGNMENT_STATUS_LABEL[assignment.status]} />
      </div>
      <p className="font-sans text-sm text-text-muted">{assignment.programName} · {assignment.applicationReference}</p>

      <div className="mt-6">
        <Tabs
          items={[
            {
              value: "notification",
              label: "Assessment Notification",
              content: (
                <div className="flex flex-col gap-4">
                  <SendNotificationButton assignmentId={assignment.id} />
                  <NotificationStatusCard notification={notification} />
                </div>
              ),
            },
            {
              value: "findings",
              label: "Findings",
              content:
                nonConformances.length === 0 ? (
                  <p className="font-sans text-sm text-text-muted">No non-conformances or observations recorded yet.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {nonConformances.map(({ criterion, finding }) => (
                      <div key={criterion.id} className="rounded-lg border border-warning-text/30 bg-warning-surface p-4">
                        <p className="font-sans text-xs font-medium text-warning-text">
                          {FINDING_STATUS_LABEL[finding!.status]}
                          {finding!.severity && ` · ${finding!.severity}`}
                        </p>
                        <p className="mt-1 font-sans text-sm text-text">{criterion.requirementText}</p>
                        <p className="mt-1 font-sans text-sm text-text-muted">{finding!.notes}</p>
                      </div>
                    ))}
                  </div>
                ),
            },
            {
              value: "report",
              label: "Report",
              content: (
                <div className="flex flex-col gap-4">
                  <p className="font-sans text-sm text-text">Status: {assignment.reportStatus}</p>
                  {assignment.reportSummary && (
                    <div>
                      <p className="font-sans text-xs font-medium text-text-muted">Summary</p>
                      <p className="mt-1 font-sans text-sm text-text">{assignment.reportSummary}</p>
                    </div>
                  )}
                  {assignment.reportRecommendation && (
                    <div>
                      <p className="font-sans text-xs font-medium text-text-muted">Recommendation</p>
                      <p className="mt-1 font-sans text-sm text-text">{assignment.reportRecommendation}</p>
                    </div>
                  )}
                  <ReportReviewActions assignmentId={assignment.id} reportStatus={assignment.reportStatus} />
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
