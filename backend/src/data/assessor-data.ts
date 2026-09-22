import { prisma } from "../prisma";
import type { Prisma } from "@prisma/client";

/**
 * Real Postgres-backed Assessor Portal data (Milestone 18 follow-up) —
 * replaces the in-memory placeholder store used since Milestone 9. The
 * Assignment/Assessment/AssessmentFinding/AssessorCompetence/
 * AssessorAvailability tables themselves have existed since Milestone 11
 * and were already seeded for real; this file just never queried them,
 * reading a separate hand-maintained mock array instead — the exact split
 * Milestone 12's own notes flagged for Applications/Invoices/Messages, just
 * left unresolved for the assessor side until now. Public type shapes are
 * kept identical to the old in-memory versions on purpose, so the ~10
 * consuming pages/components only needed `await` added at call sites.
 */

export type AssignmentStatus =
  | "PENDING"
  | "ACCEPTED"
  | "DECLINED"
  | "IN_PROGRESS"
  | "REPORT_SUBMITTED"
  | "COMPLETED";

export const ASSIGNMENT_STATUS_LABEL: Record<AssignmentStatus, string> = {
  PENDING: "Pending response",
  ACCEPTED: "Accepted",
  DECLINED: "Declined",
  IN_PROGRESS: "In progress",
  REPORT_SUBMITTED: "Report submitted",
  COMPLETED: "Completed",
};

export type FindingStatus =
  | "CONFORMS"
  | "NON_CONFORMANCE"
  | "OBSERVATION"
  | "OPPORTUNITY_FOR_IMPROVEMENT"
  | "NOT_APPLICABLE"
  | "UNANSWERED";

export const FINDING_STATUS_LABEL: Record<FindingStatus, string> = {
  CONFORMS: "Conforms",
  NON_CONFORMANCE: "Non-conformance",
  OBSERVATION: "Observation",
  OPPORTUNITY_FOR_IMPROVEMENT: "Opportunity for improvement",
  NOT_APPLICABLE: "Not applicable",
  UNANSWERED: "Not yet assessed",
};

/** Short codes matching the AB's real checklist blueprint: C / NC / O / OFI / N/A. */
export const FINDING_STATUS_CODE: Record<FindingStatus, string> = {
  CONFORMS: "C",
  NON_CONFORMANCE: "NC",
  OBSERVATION: "O",
  OPPORTUNITY_FOR_IMPROVEMENT: "OFI",
  NOT_APPLICABLE: "N/A",
  UNANSWERED: "—",
};

export interface AssessmentCriterion {
  id: string;
  requirementText: string;
  category: string;
}

export interface Finding {
  criterionId: string;
  status: FindingStatus;
  notes: string;
  severity: "MINOR" | "MAJOR" | null;
  evidenceNote: string | null;
  evidenceDocumentId: string | null;
}

export type AssessmentReportStatus = "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "FINALIZED";

export const REPORT_STATUS_LABEL: Record<AssessmentReportStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under AB review",
  FINALIZED: "Finalized",
};

export interface Assignment {
  id: string;
  assessorUserId: string;
  applicationReference: string;
  organisationName: string;
  programSlug: string;
  programName: string;
  status: AssignmentStatus;
  assignedAt: string;
  dueDate: string;
  respondedAt: string | null;
  declineReason: string | null;
  criteria: AssessmentCriterion[];
  findings: Record<string, Finding>;
  reportSubmittedAt: string | null;
  reportSummary: string;
  reportRecommendation: string;
  reportStatus: AssessmentReportStatus;
  /** Documents shared into this assignment's context — read-only for the assessor. */
  sharedDocuments: { name: string; filename: string }[];
  /** The linked Application's referenceNumber, resolved to a real id via getApplicationIdByReference() at read time — kept as a reference (not the raw id) so this stays stable across the existing message-thread lookup path. */
  linkedApplicationId: string | null;
}

export interface CompetenceEntry {
  id: string;
  assessorUserId: string;
  programSlug: string;
  programName: string;
  qualifyingBasis: string;
  dateQualified: string;
  expiryDate: string | null;
  status: "CURRENT" | "EXPIRING_SOON" | "EXPIRED";
}

export interface AvailabilityBlackout {
  id: string;
  assessorUserId: string;
  startDate: string;
  endDate: string;
  note: string;
}

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

async function getAssessorRowForUser(userId: string) {
  return prisma.assessor.findUnique({ where: { userId } });
}

const ASSIGNMENT_INCLUDE = {
  application: { include: { organisation: true, program: true } },
  assessor: { select: { userId: true } },
  assessment: { include: { findings: true } },
} satisfies Prisma.AssignmentInclude;

type AssignmentRow = Prisma.AssignmentGetPayload<{ include: typeof ASSIGNMENT_INCLUDE }>;

async function getSharedDocumentsForApplication(applicationId: string, programId: string): Promise<{ name: string; filename: string }[]> {
  const [types, docs] = await Promise.all([
    prisma.requiredDocumentType.findMany({ where: { programId } }),
    prisma.document.findMany({ where: { ownerType: "APPLICATION", ownerId: applicationId }, include: { currentVersion: true } }),
  ]);
  const nameById = new Map(types.map((t) => [t.id, t.name]));
  return docs
    .filter((d) => d.currentVersion)
    .map((d) => ({
      name: (d.requiredDocumentTypeId && nameById.get(d.requiredDocumentTypeId)) || "Document",
      filename: d.currentVersion!.filename,
    }));
}

async function mapAssignment(row: AssignmentRow): Promise<Assignment> {
  const criteria = (await prisma.assessmentCriterion.findMany({
    where: { programId: row.application.programId },
    orderBy: { sortOrder: "asc" },
  })).map((c) => ({ id: c.id, requirementText: c.requirementText, category: c.category ?? "General" }));

  const findings: Record<string, Finding> = {};
  for (const f of row.assessment?.findings ?? []) {
    findings[f.criterionId] = {
      criterionId: f.criterionId,
      status: f.status,
      notes: f.notes ?? "",
      severity: f.severity,
      evidenceNote: null,
      evidenceDocumentId: f.evidenceDocumentId,
    };
  }

  return {
    id: row.id,
    assessorUserId: row.assessor.userId,
    applicationReference: row.application.referenceNumber,
    organisationName: row.application.organisation.displayName,
    programSlug: row.application.program.slug,
    programName: row.application.program.name,
    status: row.status,
    assignedAt: fmtDate(row.assignedAt),
    dueDate: fmtDate(row.dueDate),
    respondedAt: row.respondedAt ? fmtDate(row.respondedAt) : null,
    declineReason: row.declineReason,
    criteria,
    findings,
    reportSubmittedAt: row.assessment?.reportSubmittedAt ? fmtDate(row.assessment.reportSubmittedAt) : null,
    reportSummary: row.assessment?.reportSummary ?? "",
    reportRecommendation: row.assessment?.reportRecommendation ?? "",
    reportStatus: row.assessment?.reportStatus ?? "DRAFT",
    sharedDocuments: await getSharedDocumentsForApplication(row.applicationId, row.application.programId),
    linkedApplicationId: row.application.referenceNumber,
  };
}

// --- Accessors ---

export async function getAssignmentsForUser(userId: string): Promise<Assignment[]> {
  const assessor = await getAssessorRowForUser(userId);
  if (!assessor) return [];
  const rows = await prisma.assignment.findMany({
    where: { assessorId: assessor.id },
    include: ASSIGNMENT_INCLUDE,
    orderBy: { assignedAt: "desc" },
  });
  return Promise.all(rows.map(mapAssignment));
}

/** Admin cross-cutting view — every assignment, not scoped to one assessor. */
export async function getAllAssignments(): Promise<Assignment[]> {
  const rows = await prisma.assignment.findMany({ include: ASSIGNMENT_INCLUDE, orderBy: { assignedAt: "desc" } });
  return Promise.all(rows.map(mapAssignment));
}

export async function getAllCompetence(): Promise<CompetenceEntry[]> {
  const rows = await prisma.assessorCompetence.findMany({ include: { assessor: true, program: true } });
  return rows.map(mapCompetence);
}

export async function getAssignmentById(id: string, userId: string): Promise<Assignment | undefined> {
  const assessor = await getAssessorRowForUser(userId);
  if (!assessor) return undefined;
  const row = await prisma.assignment.findFirst({ where: { id, assessorId: assessor.id }, include: ASSIGNMENT_INCLUDE });
  return row ? mapAssignment(row) : undefined;
}

function mapCompetence(row: Prisma.AssessorCompetenceGetPayload<{ include: { assessor: true; program: true } }>): CompetenceEntry {
  return {
    id: row.id,
    assessorUserId: row.assessor.userId,
    programSlug: row.program.slug,
    programName: row.program.name,
    qualifyingBasis: row.qualifyingBasis,
    dateQualified: fmtDate(row.dateQualified),
    expiryDate: row.expiryDate ? fmtDate(row.expiryDate) : null,
    status: row.status,
  };
}

export async function getCompetenceForUser(userId: string): Promise<CompetenceEntry[]> {
  const assessor = await getAssessorRowForUser(userId);
  if (!assessor) return [];
  const rows = await prisma.assessorCompetence.findMany({
    where: { assessorId: assessor.id },
    include: { assessor: true, program: true },
  });
  return rows.map(mapCompetence);
}

export async function getBlackoutsForUser(userId: string): Promise<AvailabilityBlackout[]> {
  const assessor = await getAssessorRowForUser(userId);
  if (!assessor) return [];
  const rows = await prisma.assessorAvailability.findMany({ where: { assessorId: assessor.id }, orderBy: { startDate: "asc" } });
  return rows.map((b) => ({
    id: b.id,
    assessorUserId: userId,
    startDate: fmtDate(b.startDate),
    endDate: fmtDate(b.endDate),
    note: b.note ?? "",
  }));
}

export async function addBlackout(userId: string, startDate: string, endDate: string, note: string): Promise<void> {
  const assessor = await getAssessorRowForUser(userId);
  if (!assessor) return;
  await prisma.assessorAvailability.create({
    data: { assessorId: assessor.id, startDate: new Date(startDate), endDate: new Date(endDate), note: note || null },
  });
}

export async function removeBlackout(id: string, userId: string): Promise<void> {
  const assessor = await getAssessorRowForUser(userId);
  if (!assessor) return;
  await prisma.assessorAvailability.deleteMany({ where: { id, assessorId: assessor.id } });
}

export async function respondToAssignment(
  id: string,
  userId: string,
  decision: "ACCEPTED" | "DECLINED",
  declineReason?: string,
): Promise<boolean> {
  const assessor = await getAssessorRowForUser(userId);
  if (!assessor) return false;
  const assignment = await prisma.assignment.findFirst({ where: { id, assessorId: assessor.id } });
  if (!assignment || assignment.status !== "PENDING") return false;

  await prisma.assignment.update({
    where: { id },
    data: {
      status: decision,
      respondedAt: new Date(),
      declineReason: decision === "DECLINED" ? (declineReason ?? null) : null,
    },
  });

  if (decision === "ACCEPTED") {
    const existing = await prisma.assessment.findUnique({ where: { assignmentId: id } });
    if (!existing) {
      await prisma.assessment.create({ data: { assignmentId: id, startedAt: new Date() } });
    }
  }
  return true;
}

export async function updateFinding(
  assignmentId: string,
  userId: string,
  criterionId: string,
  update: Partial<Omit<Finding, "criterionId">>,
): Promise<boolean> {
  const assessor = await getAssessorRowForUser(userId);
  if (!assessor) return false;
  const assignment = await prisma.assignment.findFirst({ where: { id: assignmentId, assessorId: assessor.id } });
  if (!assignment) return false;

  let assessment = await prisma.assessment.findUnique({ where: { assignmentId } });
  if (!assessment) {
    assessment = await prisma.assessment.create({ data: { assignmentId, startedAt: new Date() } });
  }

  const existing = await prisma.assessmentFinding.findUnique({
    where: { assessmentId_criterionId: { assessmentId: assessment.id, criterionId } },
  });
  const resolvedStatus = update.status ?? "UNANSWERED";

  if (resolvedStatus === "UNANSWERED") {
    // The checklist lets an assessor explicitly reset a criterion back to
    // "not yet assessed" — there's no such Prisma enum value, so that means
    // removing any existing finding row rather than storing an invalid one.
    await prisma.assessmentFinding.deleteMany({ where: { assessmentId: assessment.id, criterionId } });
  } else {
    await prisma.assessmentFinding.upsert({
      where: { assessmentId_criterionId: { assessmentId: assessment.id, criterionId } },
      create: {
        assessmentId: assessment.id,
        criterionId,
        status: resolvedStatus,
        notes: update.notes ?? "",
        severity: update.severity !== undefined ? update.severity : null,
      },
      update: {
        status: resolvedStatus,
        notes: update.notes ?? existing?.notes ?? "",
        severity: update.severity !== undefined ? update.severity : (existing?.severity ?? null),
      },
    });
  }

  if (assignment.status === "ACCEPTED") {
    await prisma.assignment.update({ where: { id: assignmentId }, data: { status: "IN_PROGRESS" } });
  }
  return true;
}

/** Returns (creating if needed) the Assessment id for this assignment — used as the Document ownerId when uploading evidence. */
export async function getOrCreateAssessmentId(assignmentId: string, userId: string): Promise<string | undefined> {
  const assessor = await getAssessorRowForUser(userId);
  if (!assessor) return undefined;
  const assignment = await prisma.assignment.findFirst({ where: { id: assignmentId, assessorId: assessor.id } });
  if (!assignment) return undefined;
  let assessment = await prisma.assessment.findUnique({ where: { assignmentId } });
  if (!assessment) {
    assessment = await prisma.assessment.create({ data: { assignmentId, startedAt: new Date() } });
  }
  return assessment.id;
}

/** Attaches an already-uploaded evidence Document to a finding — the schema slot (evidenceDocumentId) existed but nothing ever set it. */
export async function attachEvidenceToFinding(
  assignmentId: string,
  userId: string,
  criterionId: string,
  documentId: string,
): Promise<boolean> {
  const assessor = await getAssessorRowForUser(userId);
  if (!assessor) return false;
  const assignment = await prisma.assignment.findFirst({ where: { id: assignmentId, assessorId: assessor.id } });
  if (!assignment) return false;
  const assessment = await prisma.assessment.findUnique({ where: { assignmentId } });
  if (!assessment) return false;

  const res = await prisma.assessmentFinding.updateMany({
    where: { assessmentId: assessment.id, criterionId },
    data: { evidenceDocumentId: documentId },
  });
  return res.count > 0;
}

export async function updateReportContent(
  assignmentId: string,
  userId: string,
  content: { summary?: string; recommendation?: string },
): Promise<boolean> {
  const assessor = await getAssessorRowForUser(userId);
  if (!assessor) return false;
  const assignment = await prisma.assignment.findFirst({ where: { id: assignmentId, assessorId: assessor.id } });
  if (!assignment) return false;

  let assessment = await prisma.assessment.findUnique({ where: { assignmentId } });
  if (!assessment) {
    assessment = await prisma.assessment.create({ data: { assignmentId, startedAt: new Date() } });
  }
  if (assessment.reportStatus === "FINALIZED") return false;

  await prisma.assessment.update({
    where: { id: assessment.id },
    data: {
      reportSummary: content.summary !== undefined ? content.summary : undefined,
      reportRecommendation: content.recommendation !== undefined ? content.recommendation : undefined,
    },
  });
  return true;
}

export async function submitAssignmentReport(assignmentId: string, userId: string): Promise<boolean> {
  const assessor = await getAssessorRowForUser(userId);
  if (!assessor) return false;
  const assignment = await prisma.assignment.findFirst({ where: { id: assignmentId, assessorId: assessor.id } });
  if (!assignment) return false;

  const assessment = await prisma.assessment.findUnique({ where: { assignmentId } });
  if (assessment) {
    await prisma.assessment.update({
      where: { id: assessment.id },
      data: { reportSubmittedAt: new Date(), reportStatus: "SUBMITTED" },
    });
  } else {
    await prisma.assessment.create({
      data: { assignmentId, startedAt: new Date(), reportSubmittedAt: new Date(), reportStatus: "SUBMITTED" },
    });
  }
  await prisma.assignment.update({ where: { id: assignmentId }, data: { status: "REPORT_SUBMITTED" } });
  return true;
}

// --- Admin (AB) report review ---

export async function markReportUnderReview(assignmentId: string): Promise<boolean> {
  const assessment = await prisma.assessment.findUnique({ where: { assignmentId } });
  if (!assessment || assessment.reportStatus !== "SUBMITTED") return false;
  await prisma.assessment.update({ where: { id: assessment.id }, data: { reportStatus: "UNDER_REVIEW" } });
  return true;
}

/** Finalizing releases the report to the CB (cb-assessments-data gates report content on this) and marks the Assignment COMPLETED. */
export async function finalizeAssessmentReport(assignmentId: string, adminUserId: string): Promise<boolean> {
  const assessment = await prisma.assessment.findUnique({ where: { assignmentId } });
  if (!assessment) return false;
  if (assessment.reportStatus !== "SUBMITTED" && assessment.reportStatus !== "UNDER_REVIEW") return false;

  await prisma.$transaction([
    prisma.assessment.update({
      where: { id: assessment.id },
      data: { reportStatus: "FINALIZED", finalizedAt: new Date(), finalizedById: adminUserId },
    }),
    prisma.assignment.update({ where: { id: assignmentId }, data: { status: "COMPLETED" } }),
  ]);
  return true;
}

/** Decision-gating: counts assignments for this application whose assessment report has been submitted but not yet finalized. */
export async function countUnfinalizedReportsForApplication(applicationId: string): Promise<number> {
  return prisma.assessment.count({
    where: {
      assignment: { applicationId },
      reportSubmittedAt: { not: null },
      reportStatus: { not: "FINALIZED" },
    },
  });
}
