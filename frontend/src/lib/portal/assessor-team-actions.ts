"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  getOrCreateProposalForApplication,
  saveProposalMembers,
  submitProposal,
  getProposalByIdAdmin,
  approveProposal,
  requestProposalChanges,
  rejectProposal,
  linkMemberToAssessor,
  getAllAssessorsForPicker,
  type AssessorTeamMemberInput,
} from "./assessor-team-data";
import { getApplicationById, getApplicationByIdAdmin } from "./applicant-data";
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

// --- CB side ---

export async function loadOrCreateTeamProposal(applicationId: string) {
  const user = await requireApplicant();
  const app = await getApplicationById(applicationId, user.id);
  if (!app) return { ok: false as const, error: "Application not found." };
  const proposal = await getOrCreateProposalForApplication(applicationId, user.id);
  if (!proposal) return { ok: false as const, error: "Couldn't load the assessor team proposal." };
  return { ok: true as const, proposal };
}

export async function saveTeamMembers(proposalId: string, members: AssessorTeamMemberInput[]) {
  const user = await requireApplicant();
  const ok = await saveProposalMembers(proposalId, user.id, members);
  if (!ok) return { ok: false as const, error: "Couldn't save the team — it may no longer be editable." };
  revalidatePath(`/cab/applicant/applications`);
  return { ok: true as const };
}

export async function submitTeamProposal(proposalId: string, applicationId: string) {
  const user = await requireApplicant();
  const ok = await submitProposal(proposalId, user.id);
  if (!ok) return { ok: false as const, error: "Add at least one team member before submitting." };
  await notifyAllAdmins({ type: "assessorteam.submitted", relatedType: "AssessorTeamProposal", relatedId: proposalId });
  revalidatePath(`/cab/applicant/applications/${applicationId}`);
  return { ok: true as const };
}

// --- AB side ---

export async function loadAssessorsForPicker() {
  await requireAdmin();
  return getAllAssessorsForPicker();
}

export async function linkTeamMemberToAssessor(memberId: string, linkedAssessorId: string | null, proposalId: string) {
  await requireAdmin();
  const ok = await linkMemberToAssessor(memberId, linkedAssessorId);
  if (!ok) return { ok: false as const, error: "Couldn't link this member." };
  revalidatePath(`/admin/assessor-teams/${proposalId}`);
  return { ok: true as const };
}

export async function approveTeamProposal(proposalId: string, dueDate: string, note: string) {
  const admin = await requireAdmin();
  if (!dueDate) return { ok: false as const, error: "An assessment due date is required to approve the team." };
  const proposal = await getProposalByIdAdmin(proposalId);
  if (!proposal) return { ok: false as const, error: "Proposal not found." };

  const result = await approveProposal(proposalId, admin.id, dueDate, note.trim() || undefined);
  if (!result.ok) return { ok: false as const, error: "Couldn't approve this proposal — it may not be submitted." };

  await logAction({
    actorUserId: admin.id,
    actorRole: "ADMIN",
    ipAddress: admin.ip,
    action: "assessorteam.approved",
    targetType: "AssessorTeamProposal",
    targetId: proposalId,
    reason: note.trim() || undefined,
  });

  const app = await getApplicationByIdAdmin(proposal.applicationId);
  if (app) {
    await createNotification({ userId: app.applicantUserId, type: "assessorteam.approved", relatedType: "AssessorTeamProposal", relatedId: proposalId, channel: "IN_APP" });
    await createNotification({ userId: app.applicantUserId, type: "assessorteam.approved", relatedType: "AssessorTeamProposal", relatedId: proposalId, channel: "EMAIL" });
  }

  revalidatePath(`/admin/applications/${proposal.applicationId}`);
  revalidatePath("/admin/assessor-teams");
  return { ok: true as const, assignmentsCreated: result.assignmentsCreated };
}

export async function requestTeamChanges(proposalId: string, note: string) {
  const admin = await requireAdmin();
  if (!note.trim()) return { ok: false as const, error: "A note explaining what needs to change is required." };
  const proposal = await getProposalByIdAdmin(proposalId);
  if (!proposal) return { ok: false as const, error: "Proposal not found." };

  const ok = await requestProposalChanges(proposalId, admin.id, note.trim());
  if (!ok) return { ok: false as const, error: "Couldn't request changes — the proposal may not be submitted." };

  await logAction({ actorUserId: admin.id, actorRole: "ADMIN", ipAddress: admin.ip, action: "assessorteam.changes_requested", targetType: "AssessorTeamProposal", targetId: proposalId, reason: note.trim() });

  const app = await getApplicationByIdAdmin(proposal.applicationId);
  if (app) {
    await createNotification({ userId: app.applicantUserId, type: "assessorteam.changes_requested", relatedType: "AssessorTeamProposal", relatedId: proposalId, channel: "IN_APP" });
    await createNotification({ userId: app.applicantUserId, type: "assessorteam.changes_requested", relatedType: "AssessorTeamProposal", relatedId: proposalId, channel: "EMAIL" });
  }

  revalidatePath(`/admin/applications/${proposal.applicationId}`);
  revalidatePath("/admin/assessor-teams");
  return { ok: true as const };
}

export async function rejectTeamProposal(proposalId: string, note: string) {
  const admin = await requireAdmin();
  if (!note.trim()) return { ok: false as const, error: "A reason is required to reject a proposal." };
  const proposal = await getProposalByIdAdmin(proposalId);
  if (!proposal) return { ok: false as const, error: "Proposal not found." };

  const ok = await rejectProposal(proposalId, admin.id, note.trim());
  if (!ok) return { ok: false as const, error: "Couldn't reject — the proposal may not be submitted." };

  await logAction({ actorUserId: admin.id, actorRole: "ADMIN", ipAddress: admin.ip, action: "assessorteam.rejected", targetType: "AssessorTeamProposal", targetId: proposalId, reason: note.trim() });

  const app = await getApplicationByIdAdmin(proposal.applicationId);
  if (app) {
    await createNotification({ userId: app.applicantUserId, type: "assessorteam.rejected", relatedType: "AssessorTeamProposal", relatedId: proposalId, channel: "IN_APP" });
    await createNotification({ userId: app.applicantUserId, type: "assessorteam.rejected", relatedType: "AssessorTeamProposal", relatedId: proposalId, channel: "EMAIL" });
  }

  revalidatePath(`/admin/applications/${proposal.applicationId}`);
  revalidatePath("/admin/assessor-teams");
  return { ok: true as const };
}
