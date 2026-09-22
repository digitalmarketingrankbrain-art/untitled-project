import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StatusBadge, type StatusTone } from "@/components/ui/status-badge";
import { Tabs } from "@/components/ui/tabs";
import { Alert } from "@/components/ui/alert";
import { AssignmentAcceptDecline } from "@/components/portal/assignment-accept-decline";
import { AssignmentChecklist } from "@/components/portal/assignment-checklist";
import { AssignmentMessagesThread } from "@/components/portal/assignment-messages-thread";
import { SubmitReportButton } from "@/components/portal/submit-report-button";
import { EvidenceUploadField, RaiseNcButton, ReportContentEditor } from "@/components/portal/assignment-report-tools";
import {
  getAssignmentById,
  ASSIGNMENT_STATUS_LABEL,
  FINDING_STATUS_LABEL,
  type AssignmentStatus,
} from "@/lib/portal/assessor-data";
import { getMessagesForApplicationByReference } from "@/lib/portal/applicant-data";

const STATUS_TONE: Record<AssignmentStatus, StatusTone> = {
  PENDING: "warning",
  ACCEPTED: "info",
  DECLINED: "neutral",
  IN_PROGRESS: "info",
  REPORT_SUBMITTED: "success",
  COMPLETED: "success",
};

export default async function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const assignment = await getAssignmentById(id, session!.user.id);
  if (!assignment) notFound();

  const messages = assignment.linkedApplicationId
    ? await getMessagesForApplicationByReference(assignment.linkedApplicationId)
    : [];

  const checklistComplete =
    assignment.criteria.length > 0 &&
    assignment.criteria.every((c) => assignment.findings[c.id]?.status && assignment.findings[c.id]?.status !== "UNANSWERED");

  const nonConformances = assignment.criteria
    .map((c) => ({ criterion: c, finding: assignment.findings[c.id] }))
    .filter(
      (f) =>
        f.finding &&
        (f.finding.status === "NON_CONFORMANCE" || f.finding.status === "OBSERVATION" || f.finding.status === "OPPORTUNITY_FOR_IMPROVEMENT"),
    );

  return (
    <div className="px-6 py-8">
      <Breadcrumbs items={[{ label: "Assignments", href: "/assessor/assignments" }, { label: assignment.organisationName }]} />

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        {/* Persistent left-hand context panel — Phase 9 */}
        <aside className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 lg:sticky lg:top-24 lg:self-start">
          <div>
            <p className="font-sans text-xs text-text-muted">Organisation</p>
            <p className="font-sans text-sm font-semibold text-text">{assignment.organisationName}</p>
          </div>
          <div>
            <p className="font-sans text-xs text-text-muted">Scope</p>
            <p className="font-sans text-sm text-text">{assignment.programName}</p>
          </div>
          <div>
            <p className="font-sans text-xs text-text-muted">Reference</p>
            <p className="font-mono text-sm text-text">{assignment.applicationReference}</p>
          </div>
          <div>
            <p className="font-sans text-xs text-text-muted">Due</p>
            <p className="font-mono text-sm text-text">{assignment.dueDate}</p>
          </div>
          <StatusBadge tone={STATUS_TONE[assignment.status]} label={ASSIGNMENT_STATUS_LABEL[assignment.status]} size="sm" />
        </aside>

        <div className="min-w-0">
          {assignment.status === "PENDING" && (
            <div className="mb-6">
              <AssignmentAcceptDecline assignmentId={assignment.id} />
            </div>
          )}
          {assignment.status === "DECLINED" && (
            <Alert tone="info" title="Assignment declined" className="mb-6">
              {assignment.declineReason}
            </Alert>
          )}

          <Tabs
            items={[
              {
                value: "overview",
                label: "Overview",
                content: (
                  <div className="flex flex-col gap-3">
                    <p className="font-sans text-sm text-text">
                      Assigned {assignment.assignedAt}
                      {assignment.respondedAt && ` · Responded ${assignment.respondedAt}`}
                      {assignment.reportSubmittedAt && ` · Report submitted ${assignment.reportSubmittedAt}`}
                    </p>
                    <p className="font-sans text-sm text-text-muted">
                      Evaluate {assignment.organisationName} against the {assignment.programName} scope using the
                      checklist tab. Findings compile automatically into the report.
                    </p>
                  </div>
                ),
              },
              {
                value: "documents",
                label: "Documents",
                content: (
                  <ul className="flex flex-col gap-2">
                    {assignment.sharedDocuments.map((d) => (
                      <li key={d.filename} className="flex items-center justify-between rounded-md border border-border bg-surface px-4 py-2">
                        <span className="font-sans text-sm text-text">{d.name}</span>
                        <span className="font-mono text-xs text-text-muted">{d.filename}</span>
                      </li>
                    ))}
                  </ul>
                ),
              },
              {
                value: "checklist",
                label: "Checklist",
                content: (
                  <AssignmentChecklist
                    assignmentId={assignment.id}
                    criteria={assignment.criteria}
                    findings={assignment.findings}
                  />
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
                          {finding!.status === "NON_CONFORMANCE" && (
                            <div className="mt-3">
                              <RaiseNcButton assignmentId={assignment.id} criterionId={criterion.id} requirementText={criterion.requirementText} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ),
              },
              {
                value: "evidence",
                label: "Evidence",
                content: (
                  <div className="flex flex-col gap-3">
                    {assignment.criteria
                      .filter((c) => assignment.findings[c.id]?.status && assignment.findings[c.id]?.status !== "UNANSWERED")
                      .map((c) => (
                        <div key={c.id} className="rounded-md border border-border bg-surface px-4 py-3">
                          <p className="font-sans text-xs text-text-muted">{c.requirementText}</p>
                          {assignment.findings[c.id]?.evidenceDocumentId ? (
                            <p className="mt-1 font-mono text-xs text-success-text">Evidence attached</p>
                          ) : (
                            <div className="mt-2">
                              <EvidenceUploadField assignmentId={assignment.id} criterionId={c.id} />
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ),
              },
              {
                value: "messages",
                label: "Messages",
                content: (
                  <AssignmentMessagesThread assignmentId={assignment.id} messages={messages} />
                ),
              },
              {
                value: "report",
                label: "Report",
                content: (
                  <div className="flex flex-col gap-4">
                    <p className="font-sans text-sm text-text-muted">
                      {assignment.criteria.filter((c) => assignment.findings[c.id]?.status && assignment.findings[c.id]?.status !== "UNANSWERED").length} of{" "}
                      {assignment.criteria.length} checklist items assessed. Report status: {assignment.reportStatus}.
                    </p>
                    <ReportContentEditor
                      assignmentId={assignment.id}
                      initialSummary={assignment.reportSummary}
                      initialRecommendation={assignment.reportRecommendation}
                      readOnly={assignment.reportStatus !== "DRAFT"}
                    />
                    {assignment.status === "REPORT_SUBMITTED" || assignment.status === "COMPLETED" ? (
                      <Alert tone="success" title="Report submitted">
                        Submitted {assignment.reportSubmittedAt}.
                      </Alert>
                    ) : assignment.status === "IN_PROGRESS" || assignment.status === "ACCEPTED" ? (
                      checklistComplete ? (
                        <SubmitReportButton assignmentId={assignment.id} />
                      ) : (
                        <p className="font-sans text-sm text-text-muted">Complete every checklist item before submitting.</p>
                      )
                    ) : (
                      <p className="font-sans text-sm text-text-muted">Accept this assignment to begin.</p>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
