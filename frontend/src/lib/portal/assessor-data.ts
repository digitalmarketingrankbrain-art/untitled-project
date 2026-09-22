import { rpc } from "@/lib/rpc-client";

/** Thin proxy over backend/src/data/assessor-data.ts — see applicant-data.ts's header comment for why. */

export type AssignmentStatus =
  | "PENDING"
  | "ACCEPTED"
  | "DECLINED"
  | "IN_PROGRESS"
  | "REPORT_SUBMITTED"
  | "COMPLETED";

export const ASSIGNMENT_STATUS_LABEL: Record<AssignmentStatus, string> = {
  PENDING: "Pending response",
  ACCEPTED: "Accepted",
  DECLINED: "Declined",
  IN_PROGRESS: "In progress",
  REPORT_SUBMITTED: "Report submitted",
  COMPLETED: "Completed",
};

export type FindingStatus =
  | "CONFORMS"
  | "NON_CONFORMANCE"
  | "OBSERVATION"
  | "OPPORTUNITY_FOR_IMPROVEMENT"
  | "NOT_APPLICABLE"
  | "UNANSWERED";

export const FINDING_STATUS_LABEL: Record<FindingStatus, string> = {
  CONFORMS: "Conforms",
  NON_CONFORMANCE: "Non-conformance",
  OBSERVATION: "Observation",
  OPPORTUNITY_FOR_IMPROVEMENT: "Opportunity for improvement",
  NOT_APPLICABLE: "Not applicable",
  UNANSWERED: "Not yet assessed",
};

/** Short codes matching the AB's real checklist blueprint: C / NC / O / OFI / N/A. */
export const FINDING_STATUS_CODE: Record<FindingStatus, string> = {
  CONFORMS: "C",
  NON_CONFORMANCE: "NC",
  OBSERVATION: "O",
  OPPORTUNITY_FOR_IMPROVEMENT: "OFI",
  NOT_APPLICABLE: "N/A",
  UNANSWERED: "—",
};

export interface AssessmentCriterion {
  id: string;
  requirementText: string;
  category: string;
}

export interface Finding {
  criterionId: string;
  status: FindingStatus;
  notes: string;
  severity: "MINOR" | "MAJOR" | null;
  evidenceNote: string | null;
  evidenceDocumentId: string | null;
}

export type AssessmentReportStatus = "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "FINALIZED";

export const REPORT_STATUS_LABEL: Record<AssessmentReportStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under AB review",
  FINALIZED: "Finalized",
};

export interface Assignment {
  id: string;
  assessorUserId: string;
  applicationReference: string;
  organisationName: string;
  programSlug: string;
  programName: string;
  status: AssignmentStatus;
  assignedAt: string;
  dueDate: string;
  respondedAt: string | null;
  declineReason: string | null;
  criteria: AssessmentCriterion[];
  findings: Record<string, Finding>;
  reportSubmittedAt: string | null;
  reportSummary: string;
  reportRecommendation: string;
  reportStatus: AssessmentReportStatus;
  sharedDocuments: { name: string; filename: string }[];
  linkedApplicationId: string | null;
}

export interface CompetenceEntry {
  id: string;
  assessorUserId: string;
  programSlug: string;
  programName: string;
  qualifyingBasis: string;
  dateQualified: string;
  expiryDate: string | null;
  status: "CURRENT" | "EXPIRING_SOON" | "EXPIRED";
}

export interface AvailabilityBlackout {
  id: string;
  assessorUserId: string;
  startDate: string;
  endDate: string;
  note: string;
}

const MODULE = "assessor-data";

export function getAssignmentsForUser(userId: string): Promise<Assignment[]> {
  return rpc(MODULE, "getAssignmentsForUser", [userId]);
}

export function getAllAssignments(): Promise<Assignment[]> {
  return rpc(MODULE, "getAllAssignments", []);
}

export function getAllCompetence(): Promise<CompetenceEntry[]> {
  return rpc(MODULE, "getAllCompetence", []);
}

export function getAssignmentById(id: string, userId: string): Promise<Assignment | undefined> {
  return rpc(MODULE, "getAssignmentById", [id, userId]);
}

export function getCompetenceForUser(userId: string): Promise<CompetenceEntry[]> {
  return rpc(MODULE, "getCompetenceForUser", [userId]);
}

export function getBlackoutsForUser(userId: string): Promise<AvailabilityBlackout[]> {
  return rpc(MODULE, "getBlackoutsForUser", [userId]);
}

export function addBlackout(userId: string, startDate: string, endDate: string, note: string): Promise<void> {
  return rpc(MODULE, "addBlackout", [userId, startDate, endDate, note]);
}

export function removeBlackout(id: string, userId: string): Promise<void> {
  return rpc(MODULE, "removeBlackout", [id, userId]);
}

export function respondToAssignment(
  id: string,
  userId: string,
  decision: "ACCEPTED" | "DECLINED",
  declineReason?: string,
): Promise<boolean> {
  return rpc(MODULE, "respondToAssignment", [id, userId, decision, declineReason]);
}

export function updateFinding(
  assignmentId: string,
  userId: string,
  criterionId: string,
  update: Partial<Omit<Finding, "criterionId">>,
): Promise<boolean> {
  return rpc(MODULE, "updateFinding", [assignmentId, userId, criterionId, update]);
}

export function submitAssignmentReport(assignmentId: string, userId: string): Promise<boolean> {
  return rpc(MODULE, "submitAssignmentReport", [assignmentId, userId]);
}

export function getOrCreateAssessmentId(assignmentId: string, userId: string): Promise<string | undefined> {
  return rpc(MODULE, "getOrCreateAssessmentId", [assignmentId, userId]);
}

export function attachEvidenceToFinding(
  assignmentId: string,
  userId: string,
  criterionId: string,
  documentId: string,
): Promise<boolean> {
  return rpc(MODULE, "attachEvidenceToFinding", [assignmentId, userId, criterionId, documentId]);
}

export function updateReportContent(
  assignmentId: string,
  userId: string,
  content: { summary?: string; recommendation?: string },
): Promise<boolean> {
  return rpc(MODULE, "updateReportContent", [assignmentId, userId, content]);
}

export function markReportUnderReview(assignmentId: string): Promise<boolean> {
  return rpc(MODULE, "markReportUnderReview", [assignmentId]);
}

export function finalizeAssessmentReport(assignmentId: string, adminUserId: string): Promise<boolean> {
  return rpc(MODULE, "finalizeAssessmentReport", [assignmentId, adminUserId]);
}

export function countUnfinalizedReportsForApplication(applicationId: string): Promise<number> {
  return rpc(MODULE, "countUnfinalizedReportsForApplication", [applicationId]);
}
