import { rpc } from "@/lib/rpc-client";

/** Thin proxy over backend/src/data/assessor-team-data.ts — see applicant-data.ts's header comment for why. */

export type AssessorTeamProposalStatus = "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "CHANGES_REQUESTED" | "REJECTED";

export const PROPOSAL_STATUS_LABEL: Record<AssessorTeamProposalStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under AB review",
  APPROVED: "Approved",
  CHANGES_REQUESTED: "Changes requested",
  REJECTED: "Rejected",
};

export interface AssessorTeamMemberInput {
  name: string;
  role: string;
  expertise?: string;
  qualification?: string;
  experienceYears?: number;
  proposedScopeSlugs?: string[];
  availabilityNote?: string;
  linkedAssessorId?: string | null;
}

export interface AssessorTeamMemberRow extends AssessorTeamMemberInput {
  id: string;
  linkedAssessorName: string | null;
}

export interface AssessorTeamProposalSummary {
  id: string;
  applicationId: string;
  applicationReference: string;
  organisationName: string;
  status: AssessorTeamProposalStatus;
  memberCount: number;
  submittedAt: string | null;
  updatedAt: string;
}

export interface AssessorTeamProposalDetail extends AssessorTeamProposalSummary {
  submittedByName: string | null;
  reviewedAt: string | null;
  reviewedByName: string | null;
  reviewNote: string | null;
  members: AssessorTeamMemberRow[];
}

const MODULE = "assessor-team-data";

export function getOrCreateProposalForApplication(applicationId: string, userId: string): Promise<AssessorTeamProposalDetail | undefined> {
  return rpc(MODULE, "getOrCreateProposalForApplication", [applicationId, userId]);
}

export function getProposalForApplication(applicationId: string, userId: string): Promise<AssessorTeamProposalDetail | undefined> {
  return rpc(MODULE, "getProposalForApplication", [applicationId, userId]);
}

export function saveProposalMembers(proposalId: string, userId: string, members: AssessorTeamMemberInput[]): Promise<boolean> {
  return rpc(MODULE, "saveProposalMembers", [proposalId, userId, members]);
}

export function submitProposal(proposalId: string, userId: string): Promise<boolean> {
  return rpc(MODULE, "submitProposal", [proposalId, userId]);
}

export function getAllProposalsForAdmin(): Promise<AssessorTeamProposalSummary[]> {
  return rpc(MODULE, "getAllProposalsForAdmin", []);
}

export function getProposalByIdAdmin(id: string): Promise<AssessorTeamProposalDetail | undefined> {
  return rpc(MODULE, "getProposalByIdAdmin", [id]);
}

export function approveProposal(
  proposalId: string,
  adminUserId: string,
  dueDate: string,
  note?: string,
): Promise<{ ok: boolean; assignmentsCreated: number }> {
  return rpc(MODULE, "approveProposal", [proposalId, adminUserId, dueDate, note]);
}

export function requestProposalChanges(proposalId: string, adminUserId: string, note: string): Promise<boolean> {
  return rpc(MODULE, "requestProposalChanges", [proposalId, adminUserId, note]);
}

export function rejectProposal(proposalId: string, adminUserId: string, note: string): Promise<boolean> {
  return rpc(MODULE, "rejectProposal", [proposalId, adminUserId, note]);
}

export function getAllAssessorsForPicker(): Promise<{ id: string; name: string; email: string }[]> {
  return rpc(MODULE, "getAllAssessorsForPicker", []);
}

export function linkMemberToAssessor(memberId: string, linkedAssessorId: string | null): Promise<boolean> {
  return rpc(MODULE, "linkMemberToAssessor", [memberId, linkedAssessorId]);
}
