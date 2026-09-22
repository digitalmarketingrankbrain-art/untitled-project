import { prisma } from "../prisma";
import { getUserOrganisationId } from "./auth-store";

export type CbAssessmentStatus = "SCHEDULED" | "IN_PROGRESS" | "PENDING_REVIEW" | "COMPLETED" | "CANCELLED";

export interface CbAssessmentSummary {
  id: string;
  assessmentNumber: string;
  assessmentType: "WITNESS_ASSESSMENT" | "OFFICE_ASSESSMENT" | "DOCUMENT_REVIEW";
  schemeNames: string[];
  status: CbAssessmentStatus;
  dueDate: string;
  assessorName: string;
  applicationReference: string;
}

export interface CbAssessmentDetail extends CbAssessmentSummary {
  assignedAt: string;
  respondedAt: string | null;
  startedAt: string | null;
  reportSubmittedAt: string | null;
  /** Only populated once the AB has finalized the report — Assessment.reportStatus === "FINALIZED". Before that, the CB sees the assessment is in progress but not the report content itself. */
  reportFinalized: boolean;
  reportSummary: string | null;
  reportRecommendation: string | null;
  findings: { criterion: string; status: string; severity: string | null; notes: string | null }[];
}

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function deriveStatus(assignmentStatus: string): CbAssessmentStatus {
  switch (assignmentStatus) {
    case "PENDING":
    case "ACCEPTED":
      return "SCHEDULED";
    case "DECLINED":
      return "CANCELLED";
    case "IN_PROGRESS":
      return "IN_PROGRESS";
    case "REPORT_SUBMITTED":
      return "PENDING_REVIEW";
    case "COMPLETED":
      return "COMPLETED";
    default:
      return "SCHEDULED";
  }
}

const ASSIGNMENT_INCLUDE = {
  application: { select: { referenceNumber: true, programId: true } },
  assessor: { include: { user: { select: { name: true } } } },
} as const;

async function schemeNamesFor(applicationProgramId: string, schemeSlugs: string[]): Promise<string[]> {
  const primaryProgram = await prisma.program.findUnique({ where: { id: applicationProgramId } });
  const names = new Set<string>();
  if (primaryProgram) names.add(primaryProgram.name);
  if (schemeSlugs.length > 0) {
    const extra = await prisma.program.findMany({ where: { slug: { in: schemeSlugs } } });
    for (const p of extra) names.add(p.name);
  }
  return Array.from(names);
}

export async function getAssessmentsForUser(userId: string): Promise<CbAssessmentSummary[]> {
  const organisationId = await getUserOrganisationId(userId);
  if (!organisationId) return [];
  const rows = await prisma.assignment.findMany({
    where: { application: { organisationId } },
    include: ASSIGNMENT_INCLUDE,
    orderBy: { assignedAt: "desc" },
  });
  return Promise.all(
    rows.map(async (r) => ({
      id: r.id,
      assessmentNumber: r.assessmentNumber ?? r.id.slice(0, 10),
      assessmentType: r.assessmentType,
      schemeNames: await schemeNamesFor(r.application.programId, r.schemeSlugs),
      status: deriveStatus(r.status),
      dueDate: fmtDate(r.dueDate),
      assessorName: r.assessor.user.name,
      applicationReference: r.application.referenceNumber,
    })),
  );
}

export async function getAssessmentByIdForUser(id: string, userId: string): Promise<CbAssessmentDetail | undefined> {
  const organisationId = await getUserOrganisationId(userId);
  if (!organisationId) return undefined;
  const r = await prisma.assignment.findFirst({
    where: { id, application: { organisationId } },
    include: {
      ...ASSIGNMENT_INCLUDE,
      assessment: { include: { findings: { include: { criterion: true } } } },
    },
  });
  if (!r) return undefined;
  return {
    id: r.id,
    assessmentNumber: r.assessmentNumber ?? r.id.slice(0, 10),
    assessmentType: r.assessmentType,
    schemeNames: await schemeNamesFor(r.application.programId, r.schemeSlugs),
    status: deriveStatus(r.status),
    dueDate: fmtDate(r.dueDate),
    assessorName: r.assessor.user.name,
    applicationReference: r.application.referenceNumber,
    assignedAt: fmtDate(r.assignedAt),
    respondedAt: r.respondedAt ? fmtDate(r.respondedAt) : null,
    startedAt: r.assessment?.startedAt ? fmtDate(r.assessment.startedAt) : null,
    reportSubmittedAt: r.assessment?.reportSubmittedAt ? fmtDate(r.assessment.reportSubmittedAt) : null,
    reportFinalized: r.assessment?.reportStatus === "FINALIZED",
    reportSummary: r.assessment?.reportStatus === "FINALIZED" ? (r.assessment.reportSummary ?? null) : null,
    reportRecommendation: r.assessment?.reportStatus === "FINALIZED" ? (r.assessment.reportRecommendation ?? null) : null,
    findings: (r.assessment?.findings ?? []).map((f) => ({
      criterion: f.criterion.requirementText,
      status: f.status,
      severity: f.severity,
      notes: f.notes,
    })),
  };
}
