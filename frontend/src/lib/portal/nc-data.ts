import { rpc } from "@/lib/rpc-client";

/** Thin proxy over backend/src/data/nc-data.ts — see applicant-data.ts's header comment for why. */

export type NcSeverity = "MINOR" | "MAJOR" | "OBSERVATION";
export type NcStatus = "OPEN" | "RESPONSE_SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED" | "CLOSED";
export type NcResponseType = "ROOT_CAUSE" | "CORRECTION" | "CORRECTIVE_ACTION" | "ASSESSOR_REMARK";

export const NC_STATUS_LABEL: Record<NcStatus, string> = {
  OPEN: "Open",
  RESPONSE_SUBMITTED: "Response submitted",
  UNDER_REVIEW: "Under AB review",
  ACCEPTED: "Accepted",
  REJECTED: "Further action required",
  CLOSED: "Closed",
};

export const NC_RESPONSE_TYPE_LABEL: Record<NcResponseType, string> = {
  ROOT_CAUSE: "Root Cause Analysis",
  CORRECTION: "Proposed Correction",
  CORRECTIVE_ACTION: "Proposed Corrective Action",
  ASSESSOR_REMARK: "Assessor Remarks",
};

export interface NcResponseEntryRow {
  id: string;
  type: NcResponseType;
  body: string;
  submittedByName: string;
  submittedAt: string;
}

export interface NonConformitySummary {
  id: string;
  ncNumber: string;
  assessmentReference: string | null;
  category: NcSeverity;
  standardReference: string;
  status: NcStatus;
  progressStage: string;
  raisedAt: string;
  dueDate: string | null;
  overdue: boolean;
  raisedByName: string | null;
  teamLeadName: string | null;
}

export interface NonConformityDetail extends NonConformitySummary {
  finding: string;
  requirementText: string | null;
  schemeText: string | null;
  cabRepresentativeName: string | null;
  correctiveAction: string | null;
  closedAt: string | null;
  locked: boolean;
  reviewNote: string | null;
  reviewedByName: string | null;
  reviewedAt: string | null;
  organisationId: string;
  responses: NcResponseEntryRow[];
}

export interface NonConformityAdminSummary extends NonConformitySummary {
  organisationName: string;
}

const MODULE = "nc-data";

export function getNonConformitiesForUser(userId: string): Promise<NonConformitySummary[]> {
  return rpc(MODULE, "getNonConformitiesForUser", [userId]);
}

export function getNonConformityById(id: string, userId: string): Promise<NonConformityDetail | undefined> {
  return rpc(MODULE, "getNonConformityById", [id, userId]);
}

export function submitNcResponse(
  ncId: string,
  userId: string,
  type: Exclude<NcResponseType, "ASSESSOR_REMARK">,
  body: string,
): Promise<boolean> {
  return rpc(MODULE, "submitNcResponse", [ncId, userId, type, body]);
}

export function getAllNonConformitiesForAdmin(): Promise<NonConformityAdminSummary[]> {
  return rpc(MODULE, "getAllNonConformitiesForAdmin", []);
}

export function getNonConformityByIdAdmin(id: string): Promise<NonConformityDetail | undefined> {
  return rpc(MODULE, "getNonConformityByIdAdmin", [id]);
}

export interface RaiseNcInput {
  organisationId: string;
  assignmentId?: string;
  findingId?: string;
  category: NcSeverity;
  standardReference: string;
  requirementText?: string;
  schemeText?: string;
  finding: string;
  cabRepresentativeName?: string;
  dueDate?: string;
  teamLeadId?: string;
}

export function raiseNonConformity(input: RaiseNcInput, raisedById: string): Promise<{ id: string; ncNumber: string }> {
  return rpc(MODULE, "raiseNonConformity", [input, raisedById]);
}

export function raiseNonConformityFromFinding(
  assignmentId: string,
  criterionId: string,
  raisedById: string,
  extra: { standardReference: string; requirementText?: string; dueDate?: string },
): Promise<{ id: string; ncNumber: string } | undefined> {
  return rpc(MODULE, "raiseNonConformityFromFinding", [assignmentId, criterionId, raisedById, extra]);
}

export function addAssessorRemark(ncId: string, adminUserId: string, body: string): Promise<boolean> {
  return rpc(MODULE, "addAssessorRemark", [ncId, adminUserId, body]);
}

export function acceptNonConformity(ncId: string, adminUserId: string, note?: string): Promise<boolean> {
  return rpc(MODULE, "acceptNonConformity", [ncId, adminUserId, note]);
}

export function rejectNonConformityResponse(ncId: string, adminUserId: string, note: string): Promise<boolean> {
  return rpc(MODULE, "rejectNonConformityResponse", [ncId, adminUserId, note]);
}

export function closeNonConformity(ncId: string, adminUserId: string, note?: string): Promise<boolean> {
  return rpc(MODULE, "closeNonConformity", [ncId, adminUserId, note]);
}

export function countOpenNonConformitiesForApplication(applicationId: string): Promise<number> {
  return rpc(MODULE, "countOpenNonConformitiesForApplication", [applicationId]);
}
