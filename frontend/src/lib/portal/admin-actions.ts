"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  getApplicationByIdAdmin,
  advanceApplicationStage,
  setInfoRequested,
  clearInfoRequested,
  assignAssessorToApplication,
  recordApplicationDecision,
} from "./applicant-data";
import type { VerificationStatus } from "@/lib/verification-records";
import {
  changeAccreditationRecordStatus,
  setVerificationPublished,
  setCertificateVisible,
} from "./accreditation-record-data";
import { logAction } from "./audit-log";
import { createNotification } from "@/lib/notifications";
import { getClientIp } from "@/lib/request-ip";
import { findUserById } from "@/lib/auth/store";
import { hasAdminPermission } from "./admin-permissions-data";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Not authorised.");
  }
  const ip = await getClientIp();
  return { ...session.user, ip };
}

/**
 * The final accreditation decision (and certificate issuance) requires
 * FULL_ADMIN or DECISION_MAKER specifically — AdminPermission/
 * AdminPermissionGrant existed in the schema since Milestone 11 but were
 * never actually checked anywhere before this.
 */
export async function requireDecisionMaker() {
  const admin = await requireAdmin();
  const [isFullAdmin, isDecisionMaker] = await Promise.all([
    hasAdminPermission(admin.id, "FULL_ADMIN"),
    hasAdminPermission(admin.id, "DECISION_MAKER"),
  ]);
  if (!isFullAdmin && !isDecisionMaker) {
    throw new Error("Recording a final accreditation decision requires the FULL_ADMIN or DECISION_MAKER permission.");
  }
  return admin;
}

export async function markInitialReviewComplete(applicationId: string) {
  const admin = await requireAdmin();
  const app = await getApplicationByIdAdmin(applicationId);
  if (!app) return { ok: false as const, error: "Application not found." };
  await advanceApplicationStage(applicationId, "DOCUMENT_REVIEW", admin.id);
  await logAction({
    actorUserId: admin.id,
    actorRole: "ADMIN",
    ipAddress: admin.ip,
    action: "application.initial_review_completed",
    targetType: "Application",
    targetId: applicationId,
  });
  await createNotification({ userId: app.applicantUserId, type: "application.approved", relatedType: "Application", relatedId: applicationId, channel: "IN_APP" });
  await createNotification({ userId: app.applicantUserId, type: "application.approved", relatedType: "Application", relatedId: applicationId, channel: "EMAIL" });
  revalidatePath(`/admin/applications/${applicationId}`);
  return { ok: true as const };
}

export async function requestApplicationInfo(applicationId: string, note: string) {
  const admin = await requireAdmin();
  if (!note.trim()) return { ok: false as const, error: "A note explaining what's needed is required." };
  const app = await getApplicationByIdAdmin(applicationId);
  if (!app) return { ok: false as const, error: "Application not found." };
  await setInfoRequested(applicationId, note.trim());
  await logAction({
    actorUserId: admin.id,
    actorRole: "ADMIN",
    ipAddress: admin.ip,
    action: "application.information_requested",
    targetType: "Application",
    targetId: applicationId,
    reason: note.trim(),
  });
  await createNotification({
    userId: app.applicantUserId,
    type: "application.information_requested",
    relatedType: "Application",
    relatedId: applicationId,
    channel: "IN_APP",
  });
  await createNotification({
    userId: app.applicantUserId,
    type: "application.information_requested",
    relatedType: "Application",
    relatedId: applicationId,
    channel: "EMAIL",
  });
  revalidatePath(`/admin/applications/${applicationId}`);
  return { ok: true as const };
}

export async function clearApplicationInfoRequest(applicationId: string) {
  const admin = await requireAdmin();
  const app = await getApplicationByIdAdmin(applicationId);
  if (!app) return { ok: false as const, error: "Application not found." };
  await clearInfoRequested(applicationId);
  await logAction({
    actorUserId: admin.id,
    actorRole: "ADMIN",
    ipAddress: admin.ip,
    action: "application.information_request_cleared",
    targetType: "Application",
    targetId: applicationId,
  });
  revalidatePath(`/admin/applications/${applicationId}`);
  return { ok: true as const };
}

export async function assignAssessor(applicationId: string, assessorUserId: string) {
  const admin = await requireAdmin();
  if (!assessorUserId) return { ok: false as const, error: "Select an assessor." };
  const app = await getApplicationByIdAdmin(applicationId);
  if (!app) return { ok: false as const, error: "Application not found." };
  const assessorUser = await findUserById(assessorUserId);
  await assignAssessorToApplication(applicationId, assessorUserId, admin.id);
  await logAction({
    actorUserId: admin.id,
    actorRole: "ADMIN",
    ipAddress: admin.ip,
    action: "application.assessor_assigned",
    targetType: "Application",
    targetId: applicationId,
    after: assessorUser?.name ?? assessorUserId,
  });
  revalidatePath(`/admin/applications/${applicationId}`);
  return { ok: true as const };
}

/**
 * A distinct action from the assessor's report view (Phase 10) — requires
 * outcome + rationale + the deciding admin's identity, structurally
 * enforcing the assessor/decision-maker separation from Phase 6 Governance.
 */
export async function recordDecision(
  applicationId: string,
  outcome: "ACCREDIT" | "DECLINE" | "REQUEST_MORE_INFO",
  rationale: string,
) {
  const admin = await requireDecisionMaker();
  if (!rationale.trim()) return { ok: false as const, error: "A rationale is required to record a decision." };
  const app = await getApplicationByIdAdmin(applicationId);
  if (!app) return { ok: false as const, error: "Application not found." };
  const result = await recordApplicationDecision(applicationId, outcome, rationale.trim(), admin.id);
  if (!result.ok) return { ok: false as const, error: result.error ?? "Couldn't record this decision." };
  await logAction({
    actorUserId: admin.id,
    actorRole: "ADMIN",
    ipAddress: admin.ip,
    action: `application.decision_recorded.${outcome.toLowerCase()}`,
    targetType: "Application",
    targetId: applicationId,
    reason: rationale.trim(),
  });
  const notificationType = `application.decision_recorded.${outcome.toLowerCase()}`;
  await createNotification({
    userId: app.applicantUserId,
    type: notificationType,
    relatedType: "Application",
    relatedId: applicationId,
    channel: "IN_APP",
  });
  await createNotification({
    userId: app.applicantUserId,
    type: notificationType,
    relatedType: "Application",
    relatedId: applicationId,
    channel: "EMAIL",
  });
  revalidatePath(`/admin/applications/${applicationId}`);
  revalidatePath("/admin/applications");
  return { ok: true as const };
}

export async function changeAccreditationStatus(reference: string, newStatus: VerificationStatus, reason: string) {
  const admin = await requireAdmin();
  if (!reason.trim()) return { ok: false as const, error: "A reason is required for every status change." };
  const changed = await changeAccreditationRecordStatus(admin.id, reference, newStatus, reason.trim());
  if (!changed.ok) return { ok: false as const, error: changed.error };
  const before = changed.from;
  await logAction({
    actorUserId: admin.id,
    actorRole: "ADMIN",
    ipAddress: admin.ip,
    action: "accreditation.status_changed",
    targetType: "AccreditationRecord",
    targetId: reference,
    reason: reason.trim(),
    before,
    after: newStatus,
  });
  revalidatePath(`/admin/accreditation-records/${reference}`);
  revalidatePath(`/verify/${reference}`);
  return { ok: true as const };
}

export async function toggleVerificationPublished(reference: string, published: boolean) {
  const admin = await requireAdmin();
  const ok = await setVerificationPublished(admin.id, reference, published);
  if (!ok) return { ok: false as const, error: "Record not found." };
  await logAction({
    actorUserId: admin.id,
    actorRole: "ADMIN",
    ipAddress: admin.ip,
    action: published ? "verification.published" : "verification.unpublished",
    targetType: "VerificationRecord",
    targetId: reference,
  });
  revalidatePath(`/admin/accreditation-records/${reference}`);
  revalidatePath(`/verify/${reference}`);
  return { ok: true as const };
}

export async function toggleCertificateVisible(reference: string, visible: boolean) {
  const admin = await requireAdmin();
  const ok = await setCertificateVisible(admin.id, reference, visible);
  if (!ok) return { ok: false as const, error: "Record not found." };
  await logAction({
    actorUserId: admin.id,
    actorRole: "ADMIN",
    ipAddress: admin.ip,
    action: visible ? "verification.certificate_made_visible" : "verification.certificate_hidden",
    targetType: "VerificationRecord",
    targetId: reference,
  });
  revalidatePath(`/admin/accreditation-records/${reference}`);
  revalidatePath(`/verify/${reference}`);
  return { ok: true as const };
}
