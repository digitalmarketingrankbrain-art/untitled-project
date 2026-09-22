"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/auth";
import {
  sendAssessmentNotification,
  getLatestNotificationForAssignment,
  acknowledgeNotification,
  type SendNotificationInput,
} from "./assessment-notification-data";
import { getAllAssignments } from "./assessor-data";
import { getApplicationByIdAdmin } from "./applicant-data";
import { logAction } from "./audit-log";
import { createNotification } from "@/lib/notifications";
import { notifyAllAdmins } from "@/lib/notify-admins";
import { getClientIp } from "@/lib/request-ip";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Not authorised.");
  const ip = await getClientIp();
  return { ...session.user, ip };
}

async function requireApplicant() {
  const session = await auth();
  if (!session?.user || session.user.role !== "APPLICANT") throw new Error("Not authorised.");
  return session.user;
}

/** Admin sends (or re-sends, versioned) an assessment notification for a given Assignment. */
export async function sendNotification(input: SendNotificationInput) {
  const admin = await requireAdmin();
  if (!input.assessmentDate || !input.location.trim() || !input.scopeText.trim()) {
    return { ok: false as const, error: "Assessment date, location, and scope are all required." };
  }
  const assignments = await getAllAssignments();
  const assignment = assignments.find((a) => a.id === input.assignmentId);
  if (!assignment) return { ok: false as const, error: "Assignment not found." };

  const { id } = await sendAssessmentNotification(input, admin.id);
  await logAction({
    actorUserId: admin.id,
    actorRole: "ADMIN",
    ipAddress: admin.ip,
    action: "assessment.notification_sent",
    targetType: "AssessmentNotification",
    targetId: id,
  });

  if (assignment.linkedApplicationId) {
    const { getApplicationIdByReference } = await import("./applicant-data");
    const applicationId = await getApplicationIdByReference(assignment.linkedApplicationId);
    const app = applicationId ? await getApplicationByIdAdmin(applicationId) : undefined;
    if (app) {
      await createNotification({ userId: app.applicantUserId, type: "assessment.notification_sent", relatedType: "AssessmentNotification", relatedId: id, channel: "IN_APP" });
      await createNotification({ userId: app.applicantUserId, type: "assessment.notification_sent", relatedType: "AssessmentNotification", relatedId: id, channel: "EMAIL" });
    }
  }

  revalidatePath(`/admin/assessments/${input.assignmentId}`);
  return { ok: true as const, id };
}

/** CB explicitly acknowledges + digitally signs the current version of the notification. */
export async function acknowledgeAssessmentNotification(notificationId: string, signatureName: string) {
  const user = await requireApplicant();
  if (!signatureName.trim()) return { ok: false as const, error: "Type your full name to sign." };

  const hdrs = await headers();
  const forwardedFor = hdrs.get("x-forwarded-for");
  const ipAddress = forwardedFor ? forwardedFor.split(",")[0]!.trim() : undefined;
  const userAgent = hdrs.get("user-agent") ?? undefined;

  const result = await acknowledgeNotification(notificationId, user.id, { signatureName: signatureName.trim(), ipAddress, userAgent });
  if (!result.ok) return { ok: false as const, error: result.error ?? "Couldn't acknowledge this notification." };

  await notifyAllAdmins({ type: "assessment.acknowledged", relatedType: "AssessmentNotification", relatedId: notificationId });
  revalidatePath("/cab/applicant/profile/assessments");
  return { ok: true as const };
}

export async function loadLatestNotificationForAssignment(assignmentId: string) {
  return getLatestNotificationForAssignment(assignmentId);
}
