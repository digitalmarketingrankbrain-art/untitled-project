"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { markReportUnderReview, finalizeAssessmentReport, getAllAssignments } from "./assessor-data";
import { getApplicationIdByReference, getApplicationByIdAdmin } from "./applicant-data";
import { logAction } from "./audit-log";
import { createNotification } from "@/lib/notifications";
import { getClientIp } from "@/lib/request-ip";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Not authorised.");
  const ip = await getClientIp();
  return { ...session.user, ip };
}

export async function startReportReview(assignmentId: string) {
  const admin = await requireAdmin();
  const ok = await markReportUnderReview(assignmentId);
  if (!ok) return { ok: false as const, error: "Report isn't in a submitted state." };
  await logAction({ actorUserId: admin.id, actorRole: "ADMIN", ipAddress: admin.ip, action: "assessment.report_under_review", targetType: "Assignment", targetId: assignmentId });
  revalidatePath(`/admin/assessments/${assignmentId}`);
  return { ok: true as const };
}

/** Finalizing releases the report to the CB — see cb-assessments-data.ts's gate on Assessment.reportStatus. */
export async function finalizeReport(assignmentId: string) {
  const admin = await requireAdmin();
  const assignments = await getAllAssignments();
  const assignment = assignments.find((a) => a.id === assignmentId);
  if (!assignment) return { ok: false as const, error: "Assignment not found." };

  const ok = await finalizeAssessmentReport(assignmentId, admin.id);
  if (!ok) return { ok: false as const, error: "Report must be submitted before it can be finalized." };

  await logAction({ actorUserId: admin.id, actorRole: "ADMIN", ipAddress: admin.ip, action: "assessment.report_released", targetType: "Assignment", targetId: assignmentId });

  if (assignment.linkedApplicationId) {
    const applicationId = await getApplicationIdByReference(assignment.linkedApplicationId);
    const app = applicationId ? await getApplicationByIdAdmin(applicationId) : undefined;
    if (app) {
      await createNotification({ userId: app.applicantUserId, type: "assessment.report_released", relatedType: "Assignment", relatedId: assignmentId, channel: "IN_APP" });
      await createNotification({ userId: app.applicantUserId, type: "assessment.report_released", relatedType: "Assignment", relatedId: assignmentId, channel: "EMAIL" });
    }
  }

  revalidatePath(`/admin/assessments/${assignmentId}`);
  return { ok: true as const };
}
