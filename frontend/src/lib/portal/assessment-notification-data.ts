import { rpc } from "@/lib/rpc-client";

/** Thin proxy over backend/src/data/assessment-notification-data.ts — see applicant-data.ts's header comment for why. */

export type AssessmentNotificationStatus = "SENT" | "ACKNOWLEDGED";
export type AssessmentType = "WITNESS_ASSESSMENT" | "OFFICE_ASSESSMENT" | "DOCUMENT_REVIEW";

export interface AssessmentNotificationRow {
  id: string;
  assignmentId: string;
  applicationReference: string;
  organisationName: string;
  version: number;
  assessmentDate: string;
  assessmentType: AssessmentType;
  location: string;
  scopeText: string;
  instructions: string | null;
  preparationNotes: string | null;
  acknowledgementDeadline: string | null;
  status: AssessmentNotificationStatus;
  sentByName: string;
  sentAt: string;
  acknowledgement: {
    acknowledgedByName: string;
    acknowledgedAt: string;
    signatureName: string;
  } | null;
}

export interface SendNotificationInput {
  assignmentId: string;
  assessmentDate: string;
  assessmentType: AssessmentType;
  location: string;
  scopeText: string;
  instructions?: string;
  preparationNotes?: string;
  acknowledgementDeadline?: string;
}

const MODULE = "assessment-notification-data";

export function sendAssessmentNotification(input: SendNotificationInput, sentById: string): Promise<{ id: string }> {
  return rpc(MODULE, "sendAssessmentNotification", [input, sentById]);
}

export function getLatestNotificationForAssignment(assignmentId: string): Promise<AssessmentNotificationRow | undefined> {
  return rpc(MODULE, "getLatestNotificationForAssignment", [assignmentId]);
}

export function getNotificationsForUserOrg(userId: string): Promise<AssessmentNotificationRow[]> {
  return rpc(MODULE, "getNotificationsForUserOrg", [userId]);
}

export function getNotificationById(id: string): Promise<AssessmentNotificationRow | undefined> {
  return rpc(MODULE, "getNotificationById", [id]);
}

export function acknowledgeNotification(
  notificationId: string,
  userId: string,
  input: { signatureName: string; ipAddress?: string; userAgent?: string },
): Promise<{ ok: boolean; error?: string }> {
  return rpc(MODULE, "acknowledgeNotification", [notificationId, userId, input]);
}
