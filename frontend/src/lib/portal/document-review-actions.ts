"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { reviewDocumentVersion, getDocumentWithVersionById } from "./document-data";
import { getApplicationByIdAdmin } from "./applicant-data";
import { logAction } from "./audit-log";
import { createNotification } from "@/lib/notifications";
import { getClientIp } from "@/lib/request-ip";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Not authorised.");
  }
  const ip = await getClientIp();
  return { ...session.user, ip };
}

/**
 * Approve/request-revision on a submitted document — previously no admin
 * action existed for this at all (the Documents page was read-only).
 */
export async function reviewDocument(
  versionId: string,
  decision: "APPROVED" | "NEEDS_REVISION",
  comment: string,
  applicationId: string,
) {
  const admin = await requireAdmin();
  if (decision === "NEEDS_REVISION" && !comment.trim()) {
    return { ok: false as const, error: "A comment explaining what needs to change is required." };
  }
  const version = await getDocumentWithVersionById(versionId);
  if (!version) return { ok: false as const, error: "Document version not found." };

  await reviewDocumentVersion(versionId, decision, comment.trim() || undefined);
  await logAction({
    actorUserId: admin.id,
    actorRole: "ADMIN",
    ipAddress: admin.ip,
    action: decision === "APPROVED" ? "document.approved" : "document.changes_requested",
    targetType: "DocumentVersion",
    targetId: versionId,
    reason: comment.trim() || undefined,
  });

  const app = await getApplicationByIdAdmin(applicationId);
  if (app) {
    const type = decision === "APPROVED" ? "document.approved" : "document.changes_requested";
    await createNotification({ userId: app.applicantUserId, type, relatedType: "Application", relatedId: applicationId, channel: "IN_APP" });
    await createNotification({ userId: app.applicantUserId, type, relatedType: "Application", relatedId: applicationId, channel: "EMAIL" });
  }

  revalidatePath(`/cab/applicant/applications/${applicationId}`);
  revalidatePath(`/admin/applications/${applicationId}`);
  revalidatePath("/admin/documents");
  return { ok: true as const };
}
