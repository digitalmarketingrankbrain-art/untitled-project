import { rpc } from "@/lib/rpc-client";

/** Thin proxy over backend/src/data/cb-assessments-data.ts — see applicant-data.ts's header comment for why. */

export type CbAssessmentStatus = "SCHEDULED" | "IN_PROGRESS" | "PENDING_REVIEW" | "COMPLETED" | "CANCELLED";

export interface CbAssessmentSummary {
  id: string;
  assessmentNumber: string;
  assessmentType: "WITNESS_ASSESSMENT" | "OFFICE_ASSESSMENT" | "DOCUMENT_REVIEW";
  schemeNames: string[];
  status: CbAssessmentStatus;
  dueDate: string;
  assessorName: string;
  applicationReference: string;
}

export interface CbAssessmentDetail extends CbAssessmentSummary {
  assignedAt: string;
  respondedAt: string | null;
  startedAt: string | null;
  reportSubmittedAt: string | null;
  reportFinalized: boolean;
  reportSummary: string | null;
  reportRecommendation: string | null;
  findings: { criterion: string; status: string; severity: string | null; notes: string | null }[];
}

const MODULE = "cb-assessments-data";

export function getAssessmentsForUser(userId: string): Promise<CbAssessmentSummary[]> {
  return rpc(MODULE, "getAssessmentsForUser", [userId]);
}

export function getAssessmentByIdForUser(id: string, userId: string): Promise<CbAssessmentDetail | undefined> {
  return rpc(MODULE, "getAssessmentByIdForUser", [id, userId]);
}
