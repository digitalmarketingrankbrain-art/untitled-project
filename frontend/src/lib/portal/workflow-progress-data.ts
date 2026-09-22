import { rpc } from "@/lib/rpc-client";

/** Thin proxy over backend/src/data/workflow-progress-data.ts — see applicant-data.ts's header comment for why. */

export type WorkflowStepStatus = "COMPLETE" | "CURRENT" | "BLOCKED" | "PENDING" | "NOT_APPLICABLE";
export type WorkflowResponsibleRole = "ABCD" | "AB" | "ASSESSOR" | "-";

export interface WorkflowStep {
  key: string;
  label: string;
  status: WorkflowStepStatus;
  pendingAction: string | null;
  responsibleRole: WorkflowResponsibleRole;
}

const MODULE = "workflow-progress-data";

export function getWorkflowProgressForApplication(applicationId: string): Promise<WorkflowStep[]> {
  return rpc(MODULE, "getWorkflowProgressForApplication", [applicationId]);
}
