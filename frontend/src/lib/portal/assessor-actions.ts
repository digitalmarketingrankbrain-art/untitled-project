"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  getAssignmentById,
  respondToAssignment,
  updateFinding,
  submitAssignmentReport,
  addBlackout,
  removeBlackout,
  getOrCreateAssessmentId,
  attachEvidenceToFinding,
  updateReportContent,
  type FindingStatus,
} from "./assessor-data";
import { addMessage, getApplicationIdByReference, getApplicationByIdAdmin } from "./applicant-data";
import { uploadDocumentForOwner } from "./document-data";
import { raiseNonConformityFromFinding } from "./nc-data";
import { createNotification } from "@/lib/notifications";
import { notifyAllAdmins } from "@/lib/notify-admins";
import { MAX_UPLOAD_BYTES } from "@/lib/storage";

async function requireAssessor() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ASSESSOR") {
    throw new Error("Not authorised.");
  }
  return session.user;
}

export async function acceptAssignment(assignmentId: string) {
  const user = await requireAssessor();
  const ok = await respondToAssignment(assignmentId, user.id, "ACCEPTED");
  if (!ok) return { ok: false as const, error: "Couldn't accept this assignment." };
  revalidatePath(`/assessor/assignments/${assignmentId}`);
  revalidatePath("/assessor/assignments");
  return { ok: true as const };
}

export async function declineAssignment(assignmentId: string, reason: string) {
  const user = await requireAssessor();
  if (!reason.trim()) return { ok: false as const, error: "A reason is required to decline an assignment." };
  const ok = await respondToAssignment(assignmentId, user.id, "DECLINED", reason.trim());
  if (!ok) return { ok: false as const, error: "Couldn't decline this assignment." };
  revalidatePath(`/assessor/assignments/${assignmentId}`);
  revalidatePath("/assessor/assignments");
  return { ok: true as const };
}

export async function saveFinding(
  assignmentId: string,
  criterionId: string,
  status: FindingStatus,
  notes: string,
  severity: "MINOR" | "MAJOR" | null,
) {
  const user = await requireAssessor();
  const assignment = await getAssignmentById(assignmentId, user.id);
  if (!assignment) return { ok: false as const, error: "Assignment not found." };
  await updateFinding(assignmentId, user.id, criterionId, { status, notes, severity });
  revalidatePath(`/assessor/assignments/${assignmentId}`);
  return { ok: true as const };
}

export async function submitReport(assignmentId: string) {
  const user = await requireAssessor();
  const assignment = await getAssignmentById(assignmentId, user.id);
  if (!assignment) return { ok: false as const, error: "Assignment not found." };
  const unanswered = assignment.criteria.filter((c) => !assignment.findings[c.id] || assignment.findings[c.id]?.status === "UNANSWERED");
  if (unanswered.length > 0) {
    return { ok: false as const, error: `${unanswered.length} checklist item(s) still need a finding before you can submit.` };
  }
  await submitAssignmentReport(assignmentId, user.id);
  await notifyAllAdmins({ type: "assessment.report_submitted", relatedType: "Assignment", relatedId: assignmentId });
  revalidatePath(`/assessor/assignments/${assignmentId}`);
  revalidatePath("/assessor/assignments");
  return { ok: true as const };
}

export async function saveReportContent(assignmentId: string, summary: string, recommendation: string) {
  const user = await requireAssessor();
  const ok = await updateReportContent(assignmentId, user.id, { summary, recommendation });
  if (!ok) return { ok: false as const, error: "Couldn't save the report — it may already be finalized." };
  revalidatePath(`/assessor/assignments/${assignmentId}`);
  return { ok: true as const };
}

export async function uploadFindingEvidence(assignmentId: string, criterionId: string, file: File) {
  const user = await requireAssessor();
  const assignment = await getAssignmentById(assignmentId, user.id);
  if (!assignment) return { ok: false as const, error: "Assignment not found." };
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false as const, error: "That file is larger than 25 MB. Please upload a smaller file." };
  }
  const assessmentId = await getOrCreateAssessmentId(assignmentId, user.id);
  if (!assessmentId) return { ok: false as const, error: "Couldn't prepare this assessment for evidence upload." };

  const buffer = Buffer.from(await file.arrayBuffer());
  const { documentId } = await uploadDocumentForOwner({
    ownerType: "ASSESSMENT",
    ownerId: assessmentId,
    documentKind: "EVIDENCE",
    buffer,
    filename: file.name,
    uploadedById: user.id,
  });
  await attachEvidenceToFinding(assignmentId, user.id, criterionId, documentId);
  revalidatePath(`/assessor/assignments/${assignmentId}`);
  return { ok: true as const };
}

export async function raiseNcFromFinding(
  assignmentId: string,
  criterionId: string,
  standardReference: string,
  requirementText: string,
  dueDate: string,
) {
  const user = await requireAssessor();
  const assignment = await getAssignmentById(assignmentId, user.id);
  if (!assignment) return { ok: false as const, error: "Assignment not found." };
  if (!standardReference.trim()) return { ok: false as const, error: "A standard/clause reference is required." };

  const result = await raiseNonConformityFromFinding(assignmentId, criterionId, user.id, {
    standardReference: standardReference.trim(),
    requirementText: requirementText.trim() || undefined,
    dueDate: dueDate || undefined,
  });
  if (!result) return { ok: false as const, error: "Couldn't raise an NC — the finding must be marked Non-conformance first." };

  if (assignment.linkedApplicationId) {
    const applicationId = await getApplicationIdByReference(assignment.linkedApplicationId);
    if (applicationId) {
      const app = await getApplicationByIdAdmin(applicationId);
      if (app) {
        await createNotification({ userId: app.applicantUserId, type: "nc.raised", relatedType: "NonConformity", relatedId: result.id, channel: "IN_APP" });
        await createNotification({ userId: app.applicantUserId, type: "nc.raised", relatedType: "NonConformity", relatedId: result.id, channel: "EMAIL" });
      }
    }
  }

  revalidatePath(`/assessor/assignments/${assignmentId}`);
  return { ok: true as const, ncId: result.id, ncNumber: result.ncNumber };
}

export async function sendAssignmentMessage(assignmentId: string, body: string) {
  const user = await requireAssessor();
  const assignment = await getAssignmentById(assignmentId, user.id);
  if (!assignment) return { ok: false as const, error: "Assignment not found." };
  if (!assignment.linkedApplicationId) return { ok: false as const, error: "No conversation available for this assignment yet." };
  if (!body.trim()) return { ok: false as const, error: "Message can't be empty." };
  const applicationId = await getApplicationIdByReference(assignment.linkedApplicationId);
  if (!applicationId) return { ok: false as const, error: "No conversation available for this assignment yet." };
  await addMessage(applicationId, body.trim(), user.id);
  revalidatePath(`/assessor/assignments/${assignmentId}`);
  revalidatePath("/assessor/messages");
  return { ok: true as const };
}

export async function addAvailabilityBlackout(startDate: string, endDate: string, note: string) {
  const user = await requireAssessor();
  if (!startDate || !endDate) return { ok: false as const, error: "Start and end dates are required." };
  await addBlackout(user.id, startDate, endDate, note);
  revalidatePath("/assessor/availability");
  return { ok: true as const };
}

export async function removeAvailabilityBlackout(id: string) {
  const user = await requireAssessor();
  await removeBlackout(id, user.id);
  revalidatePath("/assessor/availability");
  return { ok: true as const };
}
