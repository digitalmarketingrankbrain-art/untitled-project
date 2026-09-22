import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StatusBadge } from "@/components/ui/status-badge";
import { Alert } from "@/components/ui/alert";
import { Tabs } from "@/components/ui/tabs";
import { ApplicationTimeline } from "@/components/portal/application-timeline";
import { ApplicationDocumentsList } from "@/components/portal/application-documents-list";
import { ApplicationMessagesThread } from "@/components/portal/application-messages-thread";
import { ApplicationInvoicesTab } from "@/components/portal/application-invoices-tab";
import { SubmitApplicationButton } from "@/components/portal/submit-application-button";
import { AssessorTeamPanel } from "@/components/portal/assessor-team-panel";
import { ApplicationDetailsForm } from "@/components/portal/application-details-form";
import {
  getApplicationById,
  getMessagesForApplication,
  getInvoicesForUser,
  STAGE_LABEL,
  type Application,
} from "@/lib/portal/applicant-data";
import { getApplicationDetails } from "@/lib/portal/application-details-data";
import { loadOrCreateTeamProposal } from "@/lib/portal/assessor-team-actions";
import { getWorkflowProgressForApplication, type WorkflowStep } from "@/lib/portal/workflow-progress-data";
import { WorkflowProgressTracker } from "@/components/portal/workflow-progress-tracker";
import { PROGRAMS } from "@/lib/programs";

const STAGE_TONE: Record<string, "success" | "warning" | "info" | "neutral"> = {
  DRAFT: "neutral",
  SUBMITTED: "info",
  INITIAL_REVIEW: "info",
  DOCUMENT_REVIEW: "warning",
  ASSESSMENT: "info",
  DECISION: "info",
  ACCREDITED: "success",
  DECLINED: "warning",
};

function OverviewTab({ application, workflowSteps }: { application: Application; workflowSteps: WorkflowStep[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-3 font-sans text-sm font-semibold text-text">Workflow progress</p>
        <WorkflowProgressTracker steps={workflowSteps} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div>
          <p className="font-sans text-xs text-text-muted">Program</p>
          <p className="font-sans text-sm text-text">{application.programName}</p>
        </div>
        <div>
          <p className="font-sans text-xs text-text-muted">Reference</p>
          <p className="font-mono text-sm text-text">{application.referenceNumber}</p>
        </div>
        <div>
          <p className="font-sans text-xs text-text-muted">Submitted</p>
          <p className="font-mono text-sm text-text">{application.submittedAt ?? "Not yet submitted"}</p>
        </div>
        {application.assessorName && (
          <div>
            <p className="font-sans text-xs text-text-muted">Assessor</p>
            <p className="font-sans text-sm text-text">{application.assessorName}</p>
          </div>
        )}
        {application.additionalScopeSlugs.length > 0 && (
          <div className="sm:col-span-3">
            <p className="font-sans text-xs text-text-muted">Additional schemes applied for</p>
            <p className="font-sans text-sm text-text">
              {application.additionalScopeSlugs
                .map((slug) => PROGRAMS.find((p) => p.slug === slug)?.name ?? slug)
                .join(", ")}
            </p>
          </div>
        )}
      </div>

      {application.stage === "DRAFT" && (
        <div>
          <p className="mb-2 font-sans text-sm text-text-muted">
            This application hasn&apos;t been submitted yet. Upload the required documents in the Documents tab, then submit for review.
          </p>
          <SubmitApplicationButton applicationId={application.id} />
        </div>
      )}

      <div>
        <p className="mb-2 font-sans text-sm font-medium text-text">History</p>
        <ul className="flex flex-col gap-2">
          {application.stageHistory.map((h, i) => (
            <li key={i} className="flex items-center gap-3 font-sans text-sm">
              <span className="font-mono text-xs text-text-muted">{h.changedAt}</span>
              <span className="text-text">{STAGE_LABEL[h.stage]}</span>
              {h.note && <span className="text-xs text-text-muted">— {h.note}</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AssessmentTab({ application }: { application: Application }) {
  const stageIndex = ["ASSESSMENT", "DECISION", "ACCREDITED"].indexOf(application.stage);
  if (stageIndex === -1) {
    return <p className="font-sans text-sm text-text-muted">Assessment has not started yet.</p>;
  }
  return (
    <div className="flex flex-col gap-3">
      <p className="font-sans text-sm text-text">
        Assessor: <span className="font-medium">{application.assessorName ?? "Not yet assigned"}</span>
      </p>
      <p className="font-sans text-sm text-text-muted">
        Internal assessor notes and working documents are not shared here — only the outcome and any
        requests for information from you.
      </p>
    </div>
  );
}


export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const application = await getApplicationById(id, session!.user.id);
  if (!application) notFound();

  const showAssessorTeamTab = !["DRAFT", "SUBMITTED", "INITIAL_REVIEW"].includes(application.stage);

  const [messages, userInvoices, teamProposalResult, workflowSteps, applicationDetails] = await Promise.all([
    getMessagesForApplication(application.id),
    getInvoicesForUser(session!.user.id),
    showAssessorTeamTab ? loadOrCreateTeamProposal(application.id) : Promise.resolve(null),
    getWorkflowProgressForApplication(application.id),
    getApplicationDetails(application.id, session!.user.id),
  ]);

  return (
    <div className="px-6 py-8">
      <Breadcrumbs
        items={[
          { label: "Applications", href: "/cab/applicant/applications" },
          { label: application.referenceNumber },
        ]}
      />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-semibold text-text">{application.programName}</h1>
        <StatusBadge tone={STAGE_TONE[application.stage] ?? "neutral"} label={STAGE_LABEL[application.stage]} />
      </div>

      {application.infoRequested && application.infoRequestNote && (
        <Alert tone="warning" title="Action needed" className="mt-4">
          {application.infoRequestNote}
        </Alert>
      )}

      <div className="mt-8 overflow-x-auto">
        <ApplicationTimeline stage={application.stage} />
      </div>

      <div className="mt-8">
        <Tabs
          items={[
            { value: "overview", label: "Overview", content: <OverviewTab application={application} workflowSteps={workflowSteps} /> },
            {
              value: "application-form",
              label: "Application Form",
              content: (
                <ApplicationDetailsForm
                  applicationId={application.id}
                  initialDetails={applicationDetails}
                  locked={application.stage !== "DRAFT"}
                />
              ),
            },
            {
              value: "documents",
              label: "Documents",
              content: <ApplicationDocumentsList application={application} />,
            },
            { value: "assessment", label: "Assessment", content: <AssessmentTab application={application} /> },
            ...(showAssessorTeamTab && teamProposalResult?.ok
              ? [{
                  value: "assessor-team",
                  label: "Assessor Team",
                  content: <AssessorTeamPanel applicationId={application.id} proposal={teamProposalResult.proposal} />,
                }]
              : []),
            {
              value: "messages",
              label: "Messages",
              content: <ApplicationMessagesThread applicationId={application.id} messages={messages} />,
            },
            {
              value: "invoices",
              label: "Invoices",
              content: <ApplicationInvoicesTab invoices={userInvoices.filter((i) => i.applicationId === application.id)} />,
            },
          ]}
          queryParam="tab"
        />
      </div>
    </div>
  );
}
