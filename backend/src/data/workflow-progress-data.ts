import { prisma } from "../prisma";

/**
 * Composes the spec's 10-step visual progress tracker (§19) from the real,
 * already-authoritative sub-entity statuses (Application.stage,
 * AssessorTeamProposal.status, AssessmentNotification/Acknowledgement,
 * Assignment.status, Assessment.reportStatus, NonConformity.status,
 * Decision, AccreditationCertificate) rather than storing a 24-value
 * redundant enum on Application itself — see the architecture proposal's
 * rationale: a single source of truth per sub-system, composed for display,
 * can't drift out of sync the way a parallel top-level status field could.
 */

export type WorkflowStepStatus = "COMPLETE" | "CURRENT" | "BLOCKED" | "PENDING" | "NOT_APPLICABLE";
export type WorkflowResponsibleRole = "ABCD" | "AB" | "ASSESSOR" | "-";

export interface WorkflowStep {
  key: string;
  label: string;
  status: WorkflowStepStatus;
  pendingAction: string | null;
  responsibleRole: WorkflowResponsibleRole;
}

const STEP_LABELS: { key: string; label: string }[] = [
  { key: "APPLICATION", label: "Application" },
  { key: "APPLICATION_REVIEW", label: "Application Review" },
  { key: "REQUIRED_DOCUMENTS", label: "Required Documents" },
  { key: "ASSESSOR_TEAM", label: "Assessor Team" },
  { key: "ASSESSMENT_NOTIFICATION", label: "Assessment Notification" },
  { key: "PHYSICAL_ASSESSMENT", label: "Physical Assessment" },
  { key: "ASSESSMENT_REPORT", label: "Assessment Report" },
  { key: "NC_CORRECTIVE_ACTION", label: "NC / Corrective Action" },
  { key: "FINAL_DECISION", label: "Final Decision" },
  { key: "CERTIFICATE", label: "Accreditation Certificate" },
];

function step(key: string, status: WorkflowStepStatus, pendingAction: string | null, responsibleRole: WorkflowResponsibleRole): WorkflowStep {
  const label = STEP_LABELS.find((s) => s.key === key)!.label;
  return { key, label, status, pendingAction, responsibleRole };
}

export async function getWorkflowProgressForApplication(applicationId: string): Promise<WorkflowStep[]> {
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      decision: true,
      documents: { include: { currentVersion: true } },
    },
  });
  if (!app) return [];

  const reachedInitialReview = !["DRAFT", "SUBMITTED"].includes(app.stage);
  const reachedDocReview = !["DRAFT", "SUBMITTED", "INITIAL_REVIEW"].includes(app.stage);
  const reachedAssessment = ["ASSESSMENT", "DECISION", "ACCREDITED", "DECLINED"].includes(app.stage);
  const terminal = app.stage === "ACCREDITED" || app.stage === "DECLINED";

  const steps: WorkflowStep[] = [];

  // 1. Application
  if (app.stage === "DRAFT") {
    steps.push(step("APPLICATION", "CURRENT", "Complete and submit the application.", "ABCD"));
  } else {
    steps.push(step("APPLICATION", "COMPLETE", null, "-"));
  }

  // 2. Application Review
  if (app.stage === "DRAFT") {
    steps.push(step("APPLICATION_REVIEW", "PENDING", null, "-"));
  } else if (!reachedInitialReview) {
    steps.push(step("APPLICATION_REVIEW", "CURRENT", "Review the submitted application.", "AB"));
  } else if (app.infoRequested) {
    steps.push(step("APPLICATION_REVIEW", "BLOCKED", app.infoRequestNote ?? "Provide the requested information.", "ABCD"));
  } else {
    steps.push(step("APPLICATION_REVIEW", "COMPLETE", null, "-"));
  }

  // 3. Required Documents
  if (!reachedInitialReview) {
    steps.push(step("REQUIRED_DOCUMENTS", "PENDING", null, "-"));
  } else {
    const needsRevision = app.documents.some((d) => d.currentVersion?.reviewStatus === "NEEDS_REVISION");
    const underReview = app.documents.some((d) => d.currentVersion?.reviewStatus === "UNDER_REVIEW");
    if (needsRevision) {
      steps.push(step("REQUIRED_DOCUMENTS", "BLOCKED", "Revise and re-upload the documents that need changes.", "ABCD"));
    } else if (underReview) {
      steps.push(step("REQUIRED_DOCUMENTS", "CURRENT", "Review the submitted documents.", "AB"));
    } else if (reachedDocReview) {
      steps.push(step("REQUIRED_DOCUMENTS", "COMPLETE", null, "-"));
    } else {
      steps.push(step("REQUIRED_DOCUMENTS", "CURRENT", "Upload required documents.", "ABCD"));
    }
  }

  // 4. Assessor Team
  const proposal = await prisma.assessorTeamProposal.findFirst({ where: { applicationId }, orderBy: { createdAt: "desc" } });
  if (!reachedDocReview && !reachedAssessment) {
    steps.push(step("ASSESSOR_TEAM", "PENDING", null, "-"));
  } else if (!proposal || proposal.status === "DRAFT") {
    steps.push(step("ASSESSOR_TEAM", "CURRENT", "Propose an assessment team.", "ABCD"));
  } else if (proposal.status === "CHANGES_REQUESTED") {
    steps.push(step("ASSESSOR_TEAM", "BLOCKED", proposal.reviewNote ?? "Revise the proposed team.", "ABCD"));
  } else if (proposal.status === "SUBMITTED" || proposal.status === "UNDER_REVIEW") {
    steps.push(step("ASSESSOR_TEAM", "CURRENT", "Review the proposed assessment team.", "AB"));
  } else if (proposal.status === "REJECTED") {
    steps.push(step("ASSESSOR_TEAM", "BLOCKED", proposal.reviewNote ?? "Proposed team was rejected — propose a new team.", "ABCD"));
  } else {
    steps.push(step("ASSESSOR_TEAM", "COMPLETE", null, "-"));
  }

  // Gather all assignments/assessments/notifications for this application once.
  const assignments = await prisma.assignment.findMany({
    where: { applicationId },
    include: {
      assessment: true,
      notifications: { include: { acknowledgement: true }, orderBy: { version: "desc" } },
    },
  });
  const latestNotifications = assignments.map((a) => a.notifications[0]).filter((n): n is NonNullable<typeof n> => !!n);

  // 5. Assessment Notification
  const teamApproved = proposal?.status === "APPROVED";
  if (!teamApproved) {
    steps.push(step("ASSESSMENT_NOTIFICATION", "PENDING", null, "-"));
  } else if (latestNotifications.length === 0) {
    steps.push(step("ASSESSMENT_NOTIFICATION", "CURRENT", "Send the assessment notification.", "AB"));
  } else if (latestNotifications.some((n) => !n.acknowledgement)) {
    steps.push(step("ASSESSMENT_NOTIFICATION", "CURRENT", "Acknowledge and sign the assessment notification.", "ABCD"));
  } else {
    steps.push(step("ASSESSMENT_NOTIFICATION", "COMPLETE", null, "-"));
  }

  // 6. Physical Assessment
  if (assignments.length === 0) {
    steps.push(step("PHYSICAL_ASSESSMENT", "PENDING", null, "-"));
  } else if (assignments.every((a) => a.status === "PENDING")) {
    steps.push(step("PHYSICAL_ASSESSMENT", "CURRENT", "Awaiting assessor response.", "ASSESSOR"));
  } else if (assignments.some((a) => a.status === "IN_PROGRESS" || a.status === "ACCEPTED")) {
    steps.push(step("PHYSICAL_ASSESSMENT", "CURRENT", "Assessment in progress.", "ASSESSOR"));
  } else if (assignments.some((a) => a.status === "REPORT_SUBMITTED" || a.status === "COMPLETED")) {
    steps.push(step("PHYSICAL_ASSESSMENT", "COMPLETE", null, "-"));
  } else {
    steps.push(step("PHYSICAL_ASSESSMENT", "PENDING", null, "-"));
  }

  // 7. Assessment Report
  const assessments = assignments.map((a) => a.assessment).filter((a): a is NonNullable<typeof a> => !!a);
  if (assessments.length === 0) {
    steps.push(step("ASSESSMENT_REPORT", "PENDING", null, "-"));
  } else if (assessments.some((a) => a.reportStatus === "SUBMITTED")) {
    steps.push(step("ASSESSMENT_REPORT", "CURRENT", "Review the submitted assessment report.", "AB"));
  } else if (assessments.some((a) => a.reportStatus === "UNDER_REVIEW")) {
    steps.push(step("ASSESSMENT_REPORT", "CURRENT", "Finalize the assessment report.", "AB"));
  } else if (assessments.every((a) => a.reportStatus === "FINALIZED")) {
    steps.push(step("ASSESSMENT_REPORT", "COMPLETE", null, "-"));
  } else {
    steps.push(step("ASSESSMENT_REPORT", "CURRENT", "Assessor is preparing the report.", "ASSESSOR"));
  }

  // 8. NC / Corrective Action
  const ncs = await prisma.nonConformity.findMany({ where: { assignment: { applicationId } } });
  if (ncs.length === 0) {
    steps.push(step("NC_CORRECTIVE_ACTION", "NOT_APPLICABLE", null, "-"));
  } else if (ncs.every((n) => n.status === "CLOSED")) {
    steps.push(step("NC_CORRECTIVE_ACTION", "COMPLETE", null, "-"));
  } else if (ncs.some((n) => n.status === "OPEN" || n.status === "REJECTED")) {
    steps.push(step("NC_CORRECTIVE_ACTION", "BLOCKED", "Submit a response to the open non-conformity.", "ABCD"));
  } else if (ncs.some((n) => n.status === "RESPONSE_SUBMITTED" || n.status === "UNDER_REVIEW")) {
    steps.push(step("NC_CORRECTIVE_ACTION", "CURRENT", "Review the NC response.", "AB"));
  } else {
    steps.push(step("NC_CORRECTIVE_ACTION", "CURRENT", "Close the accepted non-conformity.", "AB"));
  }

  // 9. Final Decision
  if (!app.decision) {
    if (reachedAssessment) {
      steps.push(step("FINAL_DECISION", "CURRENT", "Record the final accreditation decision.", "AB"));
    } else {
      steps.push(step("FINAL_DECISION", "PENDING", null, "-"));
    }
  } else if (app.decision.outcome === "REQUEST_MORE_INFO") {
    steps.push(step("FINAL_DECISION", "BLOCKED", app.decision.rationale, "ABCD"));
  } else {
    steps.push(step("FINAL_DECISION", "COMPLETE", null, "-"));
  }

  // 10. Certificate
  if (app.decision?.outcome === "DECLINE") {
    steps.push(step("CERTIFICATE", "NOT_APPLICABLE", null, "-"));
  } else if (!terminal || app.stage !== "ACCREDITED") {
    steps.push(step("CERTIFICATE", "PENDING", null, "-"));
  } else {
    const record = await prisma.accreditationRecord.findUnique({
      where: { originatingApplicationId: applicationId },
      include: { certificates: { where: { status: "ISSUED" } } },
    });
    if (record && record.certificates.length > 0) {
      steps.push(step("CERTIFICATE", "COMPLETE", null, "-"));
    } else {
      steps.push(step("CERTIFICATE", "CURRENT", "Issue the accreditation certificate.", "AB"));
    }
  }

  return steps;
}
