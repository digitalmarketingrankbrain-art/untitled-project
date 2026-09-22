"use server";

import { revalidatePath } from "next/cache";
import { issueCertificate, revokeCertificate, type IssueCertificateInput } from "./certificate-data";
import { getApplicationByIdAdmin } from "./applicant-data";
import { requireDecisionMaker } from "./admin-actions";
import { logAction } from "./audit-log";
import { createNotification } from "@/lib/notifications";

/** Certificate issuance requires the same FULL_ADMIN/DECISION_MAKER authority as the final decision (Spec business rule 8/9). */
export async function issueCertificateForApplication(input: IssueCertificateInput) {
  const admin = await requireDecisionMaker();
  const app = await getApplicationByIdAdmin(input.applicationId);
  if (!app) return { ok: false as const, error: "Application not found." };
  if (app.stage !== "ACCREDITED") return { ok: false as const, error: "A certificate can only be issued once the application is accredited." };
  if (!input.scopeText.trim() || !input.authorizedSignatoryName.trim()) {
    return { ok: false as const, error: "Scope and authorized signatory are required." };
  }

  const { id, certificateNumber } = await issueCertificate(input, admin.id);
  await logAction({
    actorUserId: admin.id,
    actorRole: "ADMIN",
    ipAddress: admin.ip,
    action: "certificate.issued",
    targetType: "AccreditationCertificate",
    targetId: id,
    after: certificateNumber,
  });
  await createNotification({ userId: app.applicantUserId, type: "certificate.issued", relatedType: "AccreditationCertificate", relatedId: id, channel: "IN_APP" });
  await createNotification({ userId: app.applicantUserId, type: "certificate.issued", relatedType: "AccreditationCertificate", relatedId: id, channel: "EMAIL" });

  revalidatePath(`/admin/applications/${input.applicationId}`);
  revalidatePath("/cab/applicant/accreditation");
  return { ok: true as const, certificateNumber };
}

export async function revokeIssuedCertificate(certificateId: string, applicationId: string) {
  const admin = await requireDecisionMaker();
  const ok = await revokeCertificate(certificateId);
  if (!ok) return { ok: false as const, error: "Couldn't revoke this certificate." };
  await logAction({ actorUserId: admin.id, actorRole: "ADMIN", ipAddress: admin.ip, action: "certificate.revoked", targetType: "AccreditationCertificate", targetId: certificateId });
  revalidatePath(`/admin/applications/${applicationId}`);
  return { ok: true as const };
}
