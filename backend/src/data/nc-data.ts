import { prisma } from "../prisma";
import { getUserOrganisationId } from "./auth-store";
import type { NcStatus as PrismaNcStatus, NcResponseType, Prisma } from "@prisma/client";

export type NcSeverity = "MINOR" | "MAJOR" | "OBSERVATION";
export type NcStatus = PrismaNcStatus;
export type { NcResponseType };

/**
 * "Overdue" is deliberately not a stored status — it's derived here from
 * dueDate vs. now so the UI can flag it without a background job keeping a
 * stored value in sync (and so it can never go stale).
 */
export function isOverdue(status: NcStatus, dueDate: string | null): boolean {
  if (!dueDate) return false;
  if (status === "CLOSED" || status === "ACCEPTED") return false;
  return new Date(dueDate).getTime() < Date.now();
}

export interface NcResponseEntryRow {
  id: string;
  type: NcResponseType;
  body: string;
  submittedByName: string;
  submittedAt: string;
}

export interface NonConformitySummary {
  id: string;
  ncNumber: string;
  assessmentReference: string | null;
  category: NcSeverity;
  standardReference: string;
  status: NcStatus;
  progressStage: string;
  raisedAt: string;
  dueDate: string | null;
  overdue: boolean;
  raisedByName: string | null;
  teamLeadName: string | null;
}

export interface NonConformityDetail extends NonConformitySummary {
  finding: string;
  requirementText: string | null;
  schemeText: string | null;
  cabRepresentativeName: string | null;
  correctiveAction: string | null;
  closedAt: string | null;
  locked: boolean;
  reviewNote: string | null;
  reviewedByName: string | null;
  reviewedAt: string | null;
  organisationId: string;
  responses: NcResponseEntryRow[];
}

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const NC_INCLUDE = {
  raisedBy: { select: { name: true } },
  teamLead: { select: { name: true } },
  reviewedBy: { select: { name: true } },
  assignment: { include: { application: { select: { referenceNumber: true } } } },
  responses: { include: { submittedBy: { select: { name: true } } }, orderBy: { submittedAt: "asc" } },
} satisfies Prisma.NonConformityInclude;

type NcRow = Prisma.NonConformityGetPayload<{ include: typeof NC_INCLUDE }>;

function assessmentReferenceOf(row: NcRow): string | null {
  if (!row.assignment) return null;
  return row.assignment.assessmentNumber ?? row.assignment.application.referenceNumber;
}

function mapSummary(r: NcRow): NonConformitySummary {
  const dueDate = r.dueDate ? fmtDate(r.dueDate) : null;
  return {
    id: r.id,
    ncNumber: r.ncNumber,
    assessmentReference: assessmentReferenceOf(r),
    category: r.category,
    standardReference: r.standardReference,
    status: r.status,
    progressStage: r.progressStage,
    raisedAt: fmtDate(r.raisedAt),
    dueDate,
    overdue: isOverdue(r.status, dueDate),
    raisedByName: r.raisedBy?.name ?? null,
    teamLeadName: r.teamLead?.name ?? null,
  };
}

function mapDetail(r: NcRow): NonConformityDetail {
  return {
    ...mapSummary(r),
    finding: r.finding,
    requirementText: r.requirementText,
    schemeText: r.schemeText,
    cabRepresentativeName: r.cabRepresentativeName,
    correctiveAction: r.correctiveAction,
    closedAt: r.closedAt ? fmtDate(r.closedAt) : null,
    locked: r.locked,
    reviewNote: r.reviewNote,
    reviewedByName: r.reviewedBy?.name ?? null,
    reviewedAt: r.reviewedAt ? fmtDate(r.reviewedAt) : null,
    organisationId: r.organisationId,
    responses: r.responses.map((e) => ({
      id: e.id,
      type: e.type,
      body: e.body,
      submittedByName: e.submittedBy.name,
      submittedAt: e.submittedAt.toISOString(),
    })),
  };
}

// --- CB (applicant) accessors ---

export async function getNonConformitiesForUser(userId: string): Promise<NonConformitySummary[]> {
  const organisationId = await getUserOrganisationId(userId);
  if (!organisationId) return [];
  const rows = await prisma.nonConformity.findMany({
    where: { organisationId },
    include: NC_INCLUDE,
    orderBy: { raisedAt: "desc" },
  });
  return rows.map(mapSummary);
}

export async function getNonConformityById(id: string, userId: string): Promise<NonConformityDetail | undefined> {
  const organisationId = await getUserOrganisationId(userId);
  if (!organisationId) return undefined;
  const r = await prisma.nonConformity.findFirst({ where: { id, organisationId }, include: NC_INCLUDE });
  return r ? mapDetail(r) : undefined;
}

/**
 * CB submits a response entry (Root Cause / Correction / Corrective Action).
 * Blocked once the NC is locked (AB already accepted the RCA) or closed —
 * mirrors the real form's "Assessor has already approved this RCA. Further
 * changes are disabled."
 */
export async function submitNcResponse(
  ncId: string,
  userId: string,
  type: Exclude<NcResponseType, "ASSESSOR_REMARK">,
  body: string,
): Promise<boolean> {
  const organisationId = await getUserOrganisationId(userId);
  if (!organisationId) return false;
  const nc = await prisma.nonConformity.findFirst({ where: { id: ncId, organisationId } });
  if (!nc) return false;
  if (nc.locked || nc.status === "CLOSED") return false;
  if (!body.trim()) return false;

  await prisma.$transaction([
    prisma.ncResponseEntry.create({ data: { ncId, type, body: body.trim(), submittedById: userId } }),
    prisma.nonConformity.update({
      where: { id: ncId },
      data: { status: "RESPONSE_SUBMITTED", respondedAt: new Date() },
    }),
  ]);
  return true;
}

// --- AB (admin) accessors/mutators ---

export async function getAllNonConformitiesForAdmin(): Promise<(NonConformitySummary & { organisationName: string })[]> {
  const rows = await prisma.nonConformity.findMany({
    include: { ...NC_INCLUDE, organisation: { select: { displayName: true } } },
    orderBy: { raisedAt: "desc" },
  });
  return rows.map((r) => ({ ...mapSummary(r), organisationName: r.organisation.displayName }));
}

export async function getNonConformityByIdAdmin(id: string): Promise<NonConformityDetail | undefined> {
  const r = await prisma.nonConformity.findUnique({ where: { id }, include: NC_INCLUDE });
  return r ? mapDetail(r) : undefined;
}

export interface RaiseNcInput {
  organisationId: string;
  assignmentId?: string;
  findingId?: string;
  category: NcSeverity;
  standardReference: string;
  requirementText?: string;
  schemeText?: string;
  finding: string;
  cabRepresentativeName?: string;
  dueDate?: string;
  teamLeadId?: string;
}

function generateNcNumber(): string {
  return `NC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

/** Manually raise an NC (assessor/admin workspace), optionally linked to the AssessmentFinding that prompted it. */
export async function raiseNonConformity(input: RaiseNcInput, raisedById: string): Promise<{ id: string; ncNumber: string }> {
  const ncNumber = generateNcNumber();
  const created = await prisma.nonConformity.create({
    data: {
      ncNumber,
      organisationId: input.organisationId,
      assignmentId: input.assignmentId,
      findingId: input.findingId,
      category: input.category,
      standardReference: input.standardReference,
      requirementText: input.requirementText,
      schemeText: input.schemeText,
      finding: input.finding,
      cabRepresentativeName: input.cabRepresentativeName,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      teamLeadId: input.teamLeadId,
      raisedById,
      progressStage: "Raised",
    },
  });
  return { id: created.id, ncNumber: created.ncNumber };
}

/**
 * Raises an NC directly from a NON_CONFORMANCE finding on an assessor's
 * checklist — the missing link the gap analysis flagged. Takes
 * (assignmentId, criterionId) rather than a raw findingId so the assessor
 * frontend never needs to know the internal AssessmentFinding row id.
 */
export async function raiseNonConformityFromFinding(
  assignmentId: string,
  criterionId: string,
  raisedById: string,
  extra: { standardReference: string; requirementText?: string; dueDate?: string },
): Promise<{ id: string; ncNumber: string } | undefined> {
  const assessment = await prisma.assessment.findUnique({ where: { assignmentId } });
  if (!assessment) return undefined;
  const finding = await prisma.assessmentFinding.findUnique({
    where: { assessmentId_criterionId: { assessmentId: assessment.id, criterionId } },
    include: {
      assessment: {
        include: {
          assignment: { include: { application: { select: { organisationId: true } } } },
        },
      },
    },
  });
  if (!finding || finding.status !== "NON_CONFORMANCE") return undefined;
  const existing = await prisma.nonConformity.findUnique({ where: { findingId: finding.id } });
  if (existing) return { id: existing.id, ncNumber: existing.ncNumber };

  return raiseNonConformity(
    {
      organisationId: finding.assessment.assignment.application.organisationId,
      assignmentId: finding.assessment.assignment.id,
      findingId: finding.id,
      category: finding.severity === "MAJOR" ? "MAJOR" : "MINOR",
      standardReference: extra.standardReference,
      requirementText: extra.requirementText,
      finding: finding.notes || "Non-conformance identified during assessment.",
      dueDate: extra.dueDate,
    },
    raisedById,
  );
}

export async function addAssessorRemark(ncId: string, adminUserId: string, body: string): Promise<boolean> {
  if (!body.trim()) return false;
  const nc = await prisma.nonConformity.findUnique({ where: { id: ncId } });
  if (!nc) return false;
  await prisma.$transaction([
    prisma.ncResponseEntry.create({
      data: { ncId, type: "ASSESSOR_REMARK", body: body.trim(), submittedById: adminUserId },
    }),
    prisma.nonConformity.update({ where: { id: ncId }, data: { status: "UNDER_REVIEW" } }),
  ]);
  return true;
}

/** Accepting locks the NC (no further CB edits) — matches the real form's behaviour once an RCA is approved. */
export async function acceptNonConformity(ncId: string, adminUserId: string, note?: string): Promise<boolean> {
  const nc = await prisma.nonConformity.findUnique({ where: { id: ncId } });
  if (!nc) return false;
  await prisma.nonConformity.update({
    where: { id: ncId },
    data: {
      status: "ACCEPTED",
      locked: true,
      reviewedById: adminUserId,
      reviewedAt: new Date(),
      reviewNote: note ?? null,
    },
  });
  return true;
}

export async function rejectNonConformityResponse(ncId: string, adminUserId: string, note: string): Promise<boolean> {
  const nc = await prisma.nonConformity.findUnique({ where: { id: ncId } });
  if (!nc) return false;
  await prisma.nonConformity.update({
    where: { id: ncId },
    data: { status: "REJECTED", reviewedById: adminUserId, reviewedAt: new Date(), reviewNote: note },
  });
  return true;
}

export async function closeNonConformity(ncId: string, adminUserId: string, note?: string): Promise<boolean> {
  const nc = await prisma.nonConformity.findUnique({ where: { id: ncId } });
  if (!nc) return false;
  if (nc.status !== "ACCEPTED") return false;
  await prisma.nonConformity.update({
    where: { id: ncId },
    data: {
      status: "CLOSED",
      closedAt: new Date(),
      reviewedById: adminUserId,
      reviewedAt: new Date(),
      reviewNote: note ?? nc.reviewNote,
    },
  });
  return true;
}

/** Used by the Final Decision screen to block a decision while NCs are still open. */
export async function countOpenNonConformitiesForApplication(applicationId: string): Promise<number> {
  return prisma.nonConformity.count({
    where: {
      assignment: { applicationId },
      status: { notIn: ["CLOSED"] },
    },
  });
}
