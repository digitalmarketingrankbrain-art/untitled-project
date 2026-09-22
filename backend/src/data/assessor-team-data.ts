import { prisma } from "../prisma";
import { getUserOrganisationId } from "./auth-store";
import type { AssessorTeamProposalStatus, Prisma } from "@prisma/client";

/**
 * Assessor Team Proposal — the CB proposes an assessment team (Spec §7),
 * the AB reviews/approves it. Approving a proposal creates real
 * Assignment rows for every member linked to an existing Assessor,
 * fixing the pre-existing bug where the admin's single-assessor "assign"
 * button only set Application.assessorUserId and never created an
 * Assignment row at all (see applicant-data.ts's assignAssessorToApplication).
 */

export interface AssessorTeamMemberInput {
  name: string;
  role: string;
  expertise?: string;
  qualification?: string;
  experienceYears?: number;
  proposedScopeSlugs?: string[];
  availabilityNote?: string;
  linkedAssessorId?: string | null;
}

export interface AssessorTeamMemberRow extends AssessorTeamMemberInput {
  id: string;
  linkedAssessorName: string | null;
}

export interface AssessorTeamProposalSummary {
  id: string;
  applicationId: string;
  applicationReference: string;
  organisationName: string;
  status: AssessorTeamProposalStatus;
  memberCount: number;
  submittedAt: string | null;
  updatedAt: string;
}

export interface AssessorTeamProposalDetail extends AssessorTeamProposalSummary {
  submittedByName: string | null;
  reviewedAt: string | null;
  reviewedByName: string | null;
  reviewNote: string | null;
  members: AssessorTeamMemberRow[];
}

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const PROPOSAL_INCLUDE = {
  application: { select: { referenceNumber: true, organisation: { select: { displayName: true } } } },
  submittedBy: { select: { name: true } },
  reviewedBy: { select: { name: true } },
  members: { include: { linkedAssessor: { include: { user: { select: { name: true } } } } } },
} satisfies Prisma.AssessorTeamProposalInclude;

type ProposalRow = Prisma.AssessorTeamProposalGetPayload<{ include: typeof PROPOSAL_INCLUDE }>;

function mapSummary(row: ProposalRow): AssessorTeamProposalSummary {
  return {
    id: row.id,
    applicationId: row.applicationId,
    applicationReference: row.application.referenceNumber,
    organisationName: row.application.organisation.displayName,
    status: row.status,
    memberCount: row.members.length,
    submittedAt: row.submittedAt ? fmtDate(row.submittedAt) : null,
    updatedAt: fmtDate(row.updatedAt),
  };
}

function mapDetail(row: ProposalRow): AssessorTeamProposalDetail {
  return {
    ...mapSummary(row),
    submittedByName: row.submittedBy?.name ?? null,
    reviewedAt: row.reviewedAt ? fmtDate(row.reviewedAt) : null,
    reviewedByName: row.reviewedBy?.name ?? null,
    reviewNote: row.reviewNote,
    members: row.members.map((m) => ({
      id: m.id,
      name: m.name,
      role: m.role,
      expertise: m.expertise ?? undefined,
      qualification: m.qualification ?? undefined,
      experienceYears: m.experienceYears ?? undefined,
      proposedScopeSlugs: m.proposedScopeSlugs,
      availabilityNote: m.availabilityNote ?? undefined,
      linkedAssessorId: m.linkedAssessorId,
      linkedAssessorName: m.linkedAssessor?.user.name ?? null,
    })),
  };
}

/** Returns the CB's current draft/in-review proposal for an application, creating a DRAFT if none exists yet. */
export async function getOrCreateProposalForApplication(
  applicationId: string,
  userId: string,
): Promise<AssessorTeamProposalDetail | undefined> {
  const organisationId = await getUserOrganisationId(userId);
  if (!organisationId) return undefined;
  const app = await prisma.application.findFirst({ where: { id: applicationId, organisationId } });
  if (!app) return undefined;

  let proposal = await prisma.assessorTeamProposal.findFirst({
    where: { applicationId },
    include: PROPOSAL_INCLUDE,
    orderBy: { createdAt: "desc" },
  });

  if (!proposal || proposal.status === "REJECTED") {
    const created = await prisma.assessorTeamProposal.create({ data: { applicationId } });
    proposal = await prisma.assessorTeamProposal.findUniqueOrThrow({
      where: { id: created.id },
      include: PROPOSAL_INCLUDE,
    });
  }

  return mapDetail(proposal);
}

export async function getProposalForApplication(
  applicationId: string,
  userId: string,
): Promise<AssessorTeamProposalDetail | undefined> {
  const organisationId = await getUserOrganisationId(userId);
  if (!organisationId) return undefined;
  const row = await prisma.assessorTeamProposal.findFirst({
    where: { applicationId, application: { organisationId } },
    include: PROPOSAL_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
  return row ? mapDetail(row) : undefined;
}

/** Replaces the full member list on a proposal the CB can still edit (DRAFT or CHANGES_REQUESTED). */
export async function saveProposalMembers(
  proposalId: string,
  userId: string,
  members: AssessorTeamMemberInput[],
): Promise<boolean> {
  const organisationId = await getUserOrganisationId(userId);
  if (!organisationId) return false;
  const proposal = await prisma.assessorTeamProposal.findFirst({
    where: { id: proposalId, application: { organisationId } },
  });
  if (!proposal || (proposal.status !== "DRAFT" && proposal.status !== "CHANGES_REQUESTED")) return false;

  await prisma.$transaction([
    prisma.assessorTeamMember.deleteMany({ where: { proposalId } }),
    ...members.map((m) =>
      prisma.assessorTeamMember.create({
        data: {
          proposalId,
          name: m.name,
          role: m.role,
          expertise: m.expertise || null,
          qualification: m.qualification || null,
          experienceYears: m.experienceYears ?? null,
          proposedScopeSlugs: m.proposedScopeSlugs ?? [],
          availabilityNote: m.availabilityNote || null,
          linkedAssessorId: m.linkedAssessorId || null,
        },
      }),
    ),
  ]);
  return true;
}

export async function submitProposal(proposalId: string, userId: string): Promise<boolean> {
  const organisationId = await getUserOrganisationId(userId);
  if (!organisationId) return false;
  const proposal = await prisma.assessorTeamProposal.findFirst({
    where: { id: proposalId, application: { organisationId } },
    include: { members: true },
  });
  if (!proposal) return false;
  if (proposal.status !== "DRAFT" && proposal.status !== "CHANGES_REQUESTED") return false;
  if (proposal.members.length === 0) return false;

  await prisma.assessorTeamProposal.update({
    where: { id: proposalId },
    data: { status: "SUBMITTED", submittedById: userId, submittedAt: new Date() },
  });
  return true;
}

// --- Admin (AB) accessors/mutators ---

export async function getAllProposalsForAdmin(): Promise<AssessorTeamProposalSummary[]> {
  const rows = await prisma.assessorTeamProposal.findMany({
    include: PROPOSAL_INCLUDE,
    orderBy: { updatedAt: "desc" },
  });
  return rows.map(mapSummary);
}

export async function getProposalByIdAdmin(id: string): Promise<AssessorTeamProposalDetail | undefined> {
  const row = await prisma.assessorTeamProposal.findUnique({ where: { id }, include: PROPOSAL_INCLUDE });
  return row ? mapDetail(row) : undefined;
}

/**
 * Approves a submitted proposal: creates a real Assignment for every member
 * linked to an existing Assessor (skips unlinked/external-only members —
 * those still show as proposed team info, just without a working
 * assignment), and advances the application into the assessment stage the
 * same way the legacy single-assessor assign path did.
 */
export async function approveProposal(
  proposalId: string,
  adminUserId: string,
  dueDate: string,
  note?: string,
): Promise<{ ok: boolean; assignmentsCreated: number }> {
  const proposal = await prisma.assessorTeamProposal.findUnique({
    where: { id: proposalId },
    include: { members: true, application: true },
  });
  if (!proposal || proposal.status !== "SUBMITTED") return { ok: false, assignmentsCreated: 0 };

  const linkedMembers = proposal.members.filter((m) => m.linkedAssessorId);
  let assignmentsCreated = 0;

  await prisma.$transaction(async (tx) => {
    for (const member of linkedMembers) {
      const existing = await tx.assignment.findFirst({
        where: { applicationId: proposal.applicationId, assessorId: member.linkedAssessorId! },
      });
      if (existing) continue;
      await tx.assignment.create({
        data: {
          applicationId: proposal.applicationId,
          assessorId: member.linkedAssessorId!,
          assignedById: adminUserId,
          dueDate: new Date(dueDate),
          schemeSlugs: member.proposedScopeSlugs,
        },
      });
      assignmentsCreated++;
    }

    await tx.assessorTeamProposal.update({
      where: { id: proposalId },
      data: { status: "APPROVED", reviewedById: adminUserId, reviewedAt: new Date(), reviewNote: note ?? null },
    });

    const app = proposal.application;
    const movesToAssessment = app.stage === "DOCUMENT_REVIEW" || app.stage === "INITIAL_REVIEW" || app.stage === "SUBMITTED";
    if (movesToAssessment) {
      await tx.application.update({ where: { id: app.id }, data: { stage: "ASSESSMENT" } });
      await tx.applicationStageHistory.create({
        data: { applicationId: app.id, fromStage: app.stage, toStage: "ASSESSMENT", changedById: adminUserId },
      });
    }
  });

  return { ok: true, assignmentsCreated };
}

export async function requestProposalChanges(proposalId: string, adminUserId: string, note: string): Promise<boolean> {
  const proposal = await prisma.assessorTeamProposal.findUnique({ where: { id: proposalId } });
  if (!proposal || proposal.status !== "SUBMITTED") return false;
  await prisma.assessorTeamProposal.update({
    where: { id: proposalId },
    data: { status: "CHANGES_REQUESTED", reviewedById: adminUserId, reviewedAt: new Date(), reviewNote: note },
  });
  return true;
}

export async function rejectProposal(proposalId: string, adminUserId: string, note: string): Promise<boolean> {
  const proposal = await prisma.assessorTeamProposal.findUnique({ where: { id: proposalId } });
  if (!proposal || proposal.status !== "SUBMITTED") return false;
  await prisma.assessorTeamProposal.update({
    where: { id: proposalId },
    data: { status: "REJECTED", reviewedById: adminUserId, reviewedAt: new Date(), reviewNote: note },
  });
  return true;
}

/** Admin links a proposed member to a real Assessor account before approving — required for approval to create an Assignment for that member. */
export async function linkMemberToAssessor(memberId: string, linkedAssessorId: string | null): Promise<boolean> {
  const res = await prisma.assessorTeamMember.updateMany({ where: { id: memberId }, data: { linkedAssessorId } });
  return res.count > 0;
}

/** For the admin's "link to existing assessor" picker. */
export async function getAllAssessorsForPicker(): Promise<{ id: string; name: string; email: string }[]> {
  const rows = await prisma.assessor.findMany({ include: { user: true } });
  return rows.map((r) => ({ id: r.id, name: r.user.name, email: r.user.email }));
}
