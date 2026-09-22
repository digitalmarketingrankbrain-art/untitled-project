"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { getApplicationById, addMessage, createDraftApplication, submitApplication } from "./applicant-data";
import { uploadDocumentForOwner } from "./document-data";
import { MAX_UPLOAD_BYTES } from "@/lib/storage";
import { PROGRAMS } from "@/lib/programs";
import { notifyAllAdmins } from "@/lib/notify-admins";

async function requireApplicant() {
  const session = await auth();
  if (!session?.user || session.user.role !== "APPLICANT") {
    throw new Error("Not authorised.");
  }
  return session.user;
}

export async function sendApplicationMessage(applicationId: string, body: string) {
  const user = await requireApplicant();
  const app = await getApplicationById(applicationId, user.id);
  if (!app) return { ok: false as const, error: "Application not found." };
  if (!body.trim()) return { ok: false as const, error: "Message can't be empty." };
  await addMessage(applicationId, body.trim(), user.id);
  revalidatePath(`/cab/applicant/applications/${applicationId}`);
  return { ok: true as const };
}

/**
 * Real storage (Milestone 13) plus a real Document/DocumentVersion row tied
 * to the checklist item (`requiredDocumentTypeId`) it satisfies — the
 * checklist status shown in the UI is derived directly from this row's
 * current version review status, not a separate in-memory mirror.
 */
export async function uploadApplicationDocument(applicationId: string, requiredDocumentTypeId: string, file: File) {
  const user = await requireApplicant();
  const app = await getApplicationById(applicationId, user.id);
  if (!app) return { ok: false as const, error: "Application not found." };
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false as const, error: "That file is larger than 25 MB. Please upload a smaller file." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await uploadDocumentForOwner({
    ownerType: "APPLICATION",
    ownerId: applicationId,
    documentKind: "REQUIRED_SUBMISSION",
    requiredDocumentTypeId,
    buffer,
    filename: file.name,
    uploadedById: user.id,
  });
  await notifyAllAdmins({ type: "document.submitted", relatedType: "Application", relatedId: applicationId });

  revalidatePath(`/cab/applicant/applications/${applicationId}`);
  return { ok: true as const };
}

export async function startNewApplication(programSlug: string, additionalScopeSlugs: string[] = []) {
  const user = await requireApplicant();
  const program = PROGRAMS.find((p) => p.slug === programSlug);
  if (!program) return { ok: false as const, error: "Unknown program." };
  const app = await createDraftApplication(user.id, program.slug, additionalScopeSlugs);
  revalidatePath("/cab/applicant/applications");
  return { ok: true as const, applicationId: app.id };
}

export async function submitApplicationForReview(applicationId: string) {
  const user = await requireApplicant();
  const app = await getApplicationById(applicationId, user.id);
  if (!app) return { ok: false as const, error: "Application not found." };
  if (app.documents.some((d) => d.mandatory && d.status === "NOT_UPLOADED")) {
    return { ok: false as const, error: "All mandatory documents must be uploaded before submitting." };
  }
  await submitApplication(applicationId, user.id);
  await notifyAllAdmins({ type: "application.submitted", relatedType: "Application", relatedId: applicationId });
  revalidatePath(`/cab/applicant/applications/${applicationId}`);
  revalidatePath("/cab/applicant/applications");
  return { ok: true as const };
}
