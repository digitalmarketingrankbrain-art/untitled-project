"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  getNonConformityById,
  submitNcResponse,
  getNonConformityByIdAdmin,
  addAssessorRemark,
  acceptNonConformity,
  rejectNonConformityResponse,
  closeNonConformity,
  type NcResponseType,
} from "./nc-data";
import { getPrimaryContactUserId } from "./cab-info-data";
import { logAction } from "./audit-log";
import { createNotification } from "@/lib/notifications";
import { notifyAllAdmins } from "@/lib/notify-admins";
import { getClientIp } from "@/lib/request-ip";

async function requireApplicant() {
  const session = await auth();
  if (!session?.user || session.user.role !== "APPLICANT") throw new Error("Not authorised.");
  return session.user;
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Not authorised.");
  const ip = await getClientIp();
  return { ...session.user, ip };
}

/** Resolves the CB's primary-contact user for an NC's organisation and sends the notification. */
async function notifyNcOrganisation(ncId: string, type: string) {
  const nc = await getNonConformityByIdAdmin(ncId);
  if (!nc) return;
  const userId = await getPrimaryContactUserId(nc.organisationId);
  if (!userId) return;
  await createNotification({ userId, type, relatedType: "NonConformity", relatedId: ncId, channel: "IN_APP" });
  await createNotification({ userId, type, relatedType: "NonConformity", relatedId: ncId, channel: "EMAIL" });
}

// --- CB side ---

export async function respondToNc(ncId: string, type: Exclude<NcResponseType, "ASSESSOR_REMARK">, body: string) {
  const user = await requireApplicant();
  if (!body.trim()) return { ok: false as const, error: "A response is required." };
  const nc = await getNonConformityById(ncId, user.id);
  if (!nc) return { ok: false as const, error: "Non-conformity not found." };
  if (nc.locked) return { ok: false as const, error: "This NC has already been accepted — further changes are disabled." };

  const ok = await submitNcResponse(ncId, user.id, type, body.trim());
  if (!ok) return { ok: false as const, error: "Couldn't submit this response." };

  await notifyAllAdmins({ type: "nc.response_submitted", relatedType: "NonConformity", relatedId: ncId });
  revalidatePath(`/cab/applicant/profile/nc/${ncId}`);
  return { ok: true as const };
}

// --- AB side ---

export async function addNcAssessorRemark(ncId: string, body: string) {
  const admin = await requireAdmin();
  if (!body.trim()) return { ok: false as const, error: "A remark is required." };
  const ok = await addAssessorRemark(ncId, admin.id, body.trim());
  if (!ok) return { ok: false as const, error: "Couldn't add this remark." };
  await logAction({ actorUserId: admin.id, actorRole: "ADMIN", ipAddress: admin.ip, action: "nc.assessor_remark_added", targetType: "NonConformity", targetId: ncId, reason: body.trim() });
  revalidatePath(`/admin/non-conformities/${ncId}`);
  return { ok: true as const };
}

export async function acceptNc(ncId: string, note: string) {
  const admin = await requireAdmin();
  const ok = await acceptNonConformity(ncId, admin.id, note.trim() || undefined);
  if (!ok) return { ok: false as const, error: "Couldn't accept this NC." };
  await logAction({ actorUserId: admin.id, actorRole: "ADMIN", ipAddress: admin.ip, action: "nc.accepted", targetType: "NonConformity", targetId: ncId, reason: note.trim() || undefined });
  await notifyNcOrganisation(ncId, "nc.accepted");
  revalidatePath(`/admin/non-conformities/${ncId}`);
  return { ok: true as const };
}

export async function rejectNc(ncId: string, note: string) {
  const admin = await requireAdmin();
  if (!note.trim()) return { ok: false as const, error: "A reason is required to request further action." };
  const ok = await rejectNonConformityResponse(ncId, admin.id, note.trim());
  if (!ok) return { ok: false as const, error: "Couldn't reject this response." };
  await logAction({ actorUserId: admin.id, actorRole: "ADMIN", ipAddress: admin.ip, action: "nc.rejected", targetType: "NonConformity", targetId: ncId, reason: note.trim() });
  await notifyNcOrganisation(ncId, "nc.rejected");
  revalidatePath(`/admin/non-conformities/${ncId}`);
  return { ok: true as const };
}

export async function closeNc(ncId: string, note: string) {
  const admin = await requireAdmin();
  const ok = await closeNonConformity(ncId, admin.id, note.trim() || undefined);
  if (!ok) return { ok: false as const, error: "An NC can only be closed after it's been accepted." };
  await logAction({ actorUserId: admin.id, actorRole: "ADMIN", ipAddress: admin.ip, action: "nc.closed", targetType: "NonConformity", targetId: ncId, reason: note.trim() || undefined });
  await notifyNcOrganisation(ncId, "nc.closed");
  revalidatePath(`/admin/non-conformities/${ncId}`);
  revalidatePath(`/admin/non-conformities`);
  return { ok: true as const };
}
