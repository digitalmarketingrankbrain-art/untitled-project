import { prisma } from "../prisma";
import { getUserOrganisationId } from "./auth-store";
import { ensureAccreditationRecordForApplication } from "./accreditation-record-data";
import type { Prisma, Role } from "@prisma/client";

export type ApplicationStage =
  | "DRAFT"
  | "SUBMITTED"
  | "INITIAL_REVIEW"
  | "DOCUMENT_REVIEW"
  | "ASSESSMENT"
  | "DECISION"
  | "ACCREDITED"
  | "DECLINED";

export const APPLICATION_STAGE_ORDER: ApplicationStage[] = [
  "DRAFT",
  "SUBMITTED",
  "INITIAL_REVIEW",
  "DOCUMENT_REVIEW",
  "ASSESSMENT",
  "DECISION",
  "ACCREDITED",
];

export const STAGE_LABEL: Record<ApplicationStage, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  INITIAL_REVIEW: "Initial Review",
  DOCUMENT_REVIEW: "Document Review",
  ASSESSMENT: "Assessment",
  DECISION: "Decision",
  ACCREDITED: "Accredited",
  DECLINED: "Declined",
};

export type DocumentStatus = "NOT_UPLOADED" | "UPLOADED" | "UNDER_REVIEW" | "APPROVED" | "NEEDS_REVISION";

export interface DocumentVersion {
  version: number;
  filename: string;
  uploadedAt: string;
  reviewComment?: string;
}

export interface RequiredDocument {
  id: string;
  name: string;
  mandatory: boolean;
  status: DocumentStatus;
  versions: DocumentVersion[];
}

export interface StageHistoryEntry {
  stage: ApplicationStage;
  changedAt: string;
  note?: string;
}

export interface Message {
  id: string;
  applicationId: string;
  senderName: string;
  senderRole: "APPLICANT" | "ADMIN" | "ASSESSOR";
  body: string;
  createdAt: string;
}

export interface Application {
  id: string;
  referenceNumber: string;
  applicantUserId: string;
  programSlug: string;
  programName: string;
  stage: ApplicationStage;
  infoRequested: boolean;
  infoRequestNote?: string;
  submittedAt: string | null;
  updatedAt: string;
  assessorName?: string;
  /** Real FK, added alongside assessorName so authorization checks (e.g. the document download route) don't have to match on a display name. */
  assessorUserId?: string;
  decisionOutcome?: "ACCREDIT" | "DECLINE" | "REQUEST_MORE_INFO";
  decisionRationale?: string;
  decidedBy?: string;
  documents: RequiredDocument[];
  stageHistory: StageHistoryEntry[];
  /** Additional schemes applied for alongside the primary program — populated on both initial applications ("Apply for" multi-select) and Scope Extension applications. */
  additionalScopeSlugs: string[];
}

export type InvoiceStatus = "DRAFT" | "ISSUED" | "PAID" | "OVERDUE" | "VOID";

export interface InvoiceLineItem {
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  applicantUserId: string;
  applicationId: string | null;
  description: string;
  lineItems: InvoiceLineItem[];
  amount: number;
  currency: string;
  status: InvoiceStatus;
  issuedAt: string;
  dueAt: string;
  paidAt: string | null;
}

/**
 * Real Postgres-backed Application/Document/Invoice/Message data (Milestone
 * 12, continued) — replaces the in-memory placeholder store used since
 * Milestone 8. Public type shapes above are kept identical to the old
 * in-memory versions on purpose, so the ~25 consuming pages/components only
 * needed `await` added at call sites rather than a rewrite.
 */

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function senderRoleFor(role: Role): Message["senderRole"] {
  if (role === "ADMIN") return "ADMIN";
  if (role === "ASSESSOR") return "ASSESSOR";
  return "APPLICANT";
}

async function buildDocumentChecklist(programId: string, applicationId: string): Promise<RequiredDocument[]> {
  const [types, docs] = await Promise.all([
    prisma.requiredDocumentType.findMany({ where: { programId }, orderBy: { name: "asc" } }),
    prisma.document.findMany({
      where: { ownerType: "APPLICATION", ownerId: applicationId },
      include: { versions: { orderBy: { versionNumber: "asc" } } },
    }),
  ]);

  return types.map((t) => {
    const doc = docs.find((d) => d.requiredDocumentTypeId === t.id);
    if (!doc || doc.versions.length === 0) {
      return { id: t.id, name: t.name, mandatory: t.isMandatory, status: "NOT_UPLOADED" as DocumentStatus, versions: [] };
    }
    const versions: DocumentVersion[] = doc.versions.map((v) => ({
      version: v.versionNumber,
      filename: v.filename,
      uploadedAt: fmtDate(v.uploadedAt),
      reviewComment: v.reviewComment ?? undefined,
    }));
    const latest = doc.versions[doc.versions.length - 1]!;
    return { id: t.id, name: t.name, mandatory: t.isMandatory, status: latest.reviewStatus, versions };
  });
}

const APPLICATION_INCLUDE = {
  program: true,
  assessor: { select: { id: true, name: true } },
  stageHistory: { orderBy: { changedAt: "asc" } },
  decision: { include: { decidedBy: { select: { name: true } } } },
} satisfies Prisma.ApplicationInclude;

type ApplicationRow = Prisma.ApplicationGetPayload<{ include: typeof APPLICATION_INCLUDE }>;

async function mapApplication(row: ApplicationRow): Promise<Application> {
  const documents = await buildDocumentChecklist(row.programId, row.id);
  return {
    id: row.id,
    referenceNumber: row.referenceNumber,
    applicantUserId: row.applicantUserId,
    programSlug: row.program.slug,
    programName: row.program.name,
    stage: row.stage,
    infoRequested: row.infoRequested,
    infoRequestNote: row.infoRequestNote ?? undefined,
    submittedAt: row.submittedAt ? fmtDate(row.submittedAt) : null,
    updatedAt: fmtDate(row.updatedAt),
    assessorName: row.assessor?.name,
    assessorUserId: row.assessor?.id,
    decisionOutcome: row.decision?.outcome,
    decisionRationale: row.decision?.rationale,
    decidedBy: row.decision?.decidedBy.name,
    documents,
    stageHistory: row.stageHistory.map((h) => ({
      stage: h.toStage,
      changedAt: fmtDate(h.changedAt),
      note: h.reason ?? undefined,
    })),
    additionalScopeSlugs: row.additionalScopeSlugs,
  };
}

// --- Accessors ---

export async function getApplicationsForUser(userId: string): Promise<Application[]> {
  const rows = await prisma.application.findMany({
    where: { applicantUserId: userId },
    include: APPLICATION_INCLUDE,
    orderBy: { updatedAt: "desc" },
  });
  return Promise.all(rows.map(mapApplication));
}

export async function getApplicationById(id: string, userId: string): Promise<Application | undefined> {
  const row = await prisma.application.findFirst({
    where: { id, applicantUserId: userId },
    include: APPLICATION_INCLUDE,
  });
  return row ? mapApplication(row) : undefined;
}

export async function getInvoicesForUser(userId: string): Promise<Invoice[]> {
  const organisationId = await getUserOrganisationId(userId);
  if (!organisationId) return [];
  const rows = await prisma.invoice.findMany({
    where: { organisationId },
    include: { lineItems: true },
    orderBy: { issuedAt: "desc" },
  });
  return rows.map((r) => mapInvoice(r, userId));
}

/** Admin cross-cutting view — every invoice, not scoped to one applicant. */
export async function getAllInvoices(): Promise<Invoice[]> {
  const rows = await prisma.invoice.findMany({
    include: { lineItems: true, organisation: { include: { memberships: { take: 1 } } } },
    orderBy: { issuedAt: "desc" },
  });
  return rows.map((r) => mapInvoice(r, r.organisation.memberships[0]?.userId ?? ""));
}

export async function getInvoiceById(id: string, userId: string): Promise<Invoice | undefined> {
  const organisationId = await getUserOrganisationId(userId);
  if (!organisationId) return undefined;
  const row = await prisma.invoice.findFirst({
    where: { id, organisationId },
    include: { lineItems: true },
  });
  return row ? mapInvoice(row, userId) : undefined;
}

function mapInvoice(row: Prisma.InvoiceGetPayload<{ include: { lineItems: true } }>, applicantUserId: string): Invoice {
  return {
    id: row.id,
    invoiceNumber: row.invoiceNumber,
    applicantUserId,
    applicationId: row.applicationId,
    description: row.lineItems[0]?.description ?? "",
    lineItems: row.lineItems.map((li) => ({ description: li.description, amount: Number(li.amount) })),
    amount: Number(row.amount),
    currency: row.currency,
    status: row.status,
    issuedAt: row.issuedAt ? fmtDate(row.issuedAt) : "",
    dueAt: row.dueAt ? fmtDate(row.dueAt) : "",
    paidAt: row.paidAt ? fmtDate(row.paidAt) : null,
  };
}

export async function getMessagesForApplication(applicationId: string): Promise<Message[]> {
  const thread = await prisma.messageThread.findUnique({
    where: { applicationId },
    include: { messages: { include: { sender: true }, orderBy: { createdAt: "asc" } } },
  });
  if (!thread) return [];
  return thread.messages.map((m) => ({
    id: m.id,
    applicationId,
    senderName: m.sender.name,
    senderRole: senderRoleFor(m.sender.primaryRole),
    body: m.body,
    createdAt: fmtDate(m.createdAt),
  }));
}

/** For the assessor side, which links to an application by reference number rather than id (see assessor-data.ts's linkedApplicationId). */
export async function getMessagesForApplicationByReference(reference: string): Promise<Message[]> {
  const id = await getApplicationIdByReference(reference);
  if (!id) return [];
  return getMessagesForApplication(id);
}

export async function getApplicationIdByReference(reference: string): Promise<string | null> {
  const row = await prisma.application.findUnique({ where: { referenceNumber: reference }, select: { id: true } });
  return row?.id ?? null;
}

export async function addMessage(applicationId: string, body: string, senderUserId: string): Promise<void> {
  let thread = await prisma.messageThread.findUnique({ where: { applicationId } });
  if (!thread) {
    thread = await prisma.messageThread.create({ data: { contextType: "APPLICATION", applicationId } });
  }
  await prisma.message.create({ data: { threadId: thread.id, senderUserId, body: body.trim() } });
}

export async function createDraftApplication(
  userId: string,
  programSlug: string,
  additionalScopeSlugs: string[] = [],
): Promise<{ id: string }> {
  const program = await prisma.program.findUnique({ where: { slug: programSlug } });
  if (!program) throw new Error(`Unknown program: ${programSlug}`);
  const organisationId = await getUserOrganisationId(userId);
  if (!organisationId) throw new Error("No organisation found for this applicant.");

  const referenceNumber = `SAAF-APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const app = await prisma.application.create({
    data: {
      referenceNumber,
      organisationId,
      applicantUserId: userId,
      programId: program.id,
      stage: "DRAFT",
      additionalScopeSlugs: additionalScopeSlugs.filter((s) => s !== programSlug),
    },
  });
  await prisma.applicationStageHistory.create({
    data: { applicationId: app.id, toStage: "DRAFT", changedById: userId },
  });
  return { id: app.id };
}

export interface ScopeExtensionDraftInput {
  primaryProgramSlug: string;
  additionalScopeSlugs: string[];
  draftData: Record<string, unknown>;
}

/** The CB Dashboard's "Apply → Scope Extension" wizard — one Application row (applicationType SCOPE_EXTENSION) can cover several schemes at once via `additionalScopeSlugs`. */
export async function saveScopeExtensionDraft(
  userId: string,
  input: ScopeExtensionDraftInput,
  existingApplicationId?: string,
): Promise<{ id: string; referenceNumber: string }> {
  const program = await prisma.program.findUnique({ where: { slug: input.primaryProgramSlug } });
  if (!program) throw new Error(`Unknown program: ${input.primaryProgramSlug}`);
  const organisationId = await getUserOrganisationId(userId);
  if (!organisationId) throw new Error("No organisation found for this applicant.");

  if (existingApplicationId) {
    const updated = await prisma.application.update({
      where: { id: existingApplicationId, applicantUserId: userId, stage: "DRAFT" },
      data: {
        programId: program.id,
        additionalScopeSlugs: input.additionalScopeSlugs,
        draftData: input.draftData as Prisma.InputJsonValue,
      },
    });
    return { id: updated.id, referenceNumber: updated.referenceNumber };
  }

  const referenceNumber = `SAAF-SE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const created = await prisma.application.create({
    data: {
      referenceNumber,
      organisationId,
      applicantUserId: userId,
      programId: program.id,
      applicationType: "SCOPE_EXTENSION",
      additionalScopeSlugs: input.additionalScopeSlugs,
      draftData: input.draftData as Prisma.InputJsonValue,
      stage: "DRAFT",
    },
  });
  await prisma.applicationStageHistory.create({
    data: { applicationId: created.id, toStage: "DRAFT", changedById: userId },
  });
  return { id: created.id, referenceNumber: created.referenceNumber };
}

export interface ScopeExtensionDraftSummary {
  id: string;
  referenceNumber: string;
  primaryProgramSlug: string;
  additionalScopeSlugs: string[];
  draftData: Record<string, unknown>;
}

/** Lean resume-lookup for the Scope Extension wizard — doesn't build the full document checklist mapApplication() does, since the wizard only needs the raw selections. */
export async function getDraftScopeExtensionSummary(userId: string): Promise<ScopeExtensionDraftSummary | undefined> {
  const row = await prisma.application.findFirst({
    where: { applicantUserId: userId, applicationType: "SCOPE_EXTENSION", stage: "DRAFT" },
    include: { program: { select: { slug: true } } },
    orderBy: { updatedAt: "desc" },
  });
  if (!row) return undefined;
  return {
    id: row.id,
    referenceNumber: row.referenceNumber,
    primaryProgramSlug: row.program.slug,
    additionalScopeSlugs: row.additionalScopeSlugs,
    draftData: (row.draftData as Record<string, unknown> | null) ?? {},
  };
}

export interface ScopeExtensionApplicationRow {
  id: string;
  referenceNumber: string;
  primaryProgramName: string;
  additionalScopeCount: number;
  stage: ApplicationStage;
  submittedAt: string | null;
  updatedAt: string;
}

/** Past (non-draft) Scope Extension applications — shown alongside the wizard so a CB isn't limited to seeing only its current draft. */
export async function getScopeExtensionApplicationsForUser(userId: string): Promise<ScopeExtensionApplicationRow[]> {
  const rows = await prisma.application.findMany({
    where: { applicantUserId: userId, applicationType: "SCOPE_EXTENSION", stage: { not: "DRAFT" } },
    include: { program: { select: { name: true } } },
    orderBy: { updatedAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    referenceNumber: r.referenceNumber,
    primaryProgramName: r.program.name,
    additionalScopeCount: r.additionalScopeSlugs.length,
    stage: r.stage,
    submittedAt: r.submittedAt ? fmtDate(r.submittedAt) : null,
    updatedAt: fmtDate(r.updatedAt),
  }));
}

export async function submitApplication(applicationId: string, actorUserId: string): Promise<boolean> {
  const app = await prisma.application.findUnique({ where: { id: applicationId } });
  if (!app || app.stage !== "DRAFT") return false;
  const now = new Date();
  await prisma.application.update({ where: { id: applicationId }, data: { stage: "SUBMITTED", submittedAt: now } });
  await prisma.applicationStageHistory.create({
    data: { applicationId, fromStage: "DRAFT", toStage: "SUBMITTED", changedById: actorUserId, changedAt: now },
  });
  return true;
}

// --- Admin accessors/mutators (see all applications, not scoped to one user) ---

export async function getAllApplications(): Promise<Application[]> {
  const rows = await prisma.application.findMany({ include: APPLICATION_INCLUDE, orderBy: { updatedAt: "desc" } });
  return Promise.all(rows.map(mapApplication));
}

export async function getApplicationByIdAdmin(id: string): Promise<Application | undefined> {
  const row = await prisma.application.findUnique({ where: { id }, include: APPLICATION_INCLUDE });
  return row ? mapApplication(row) : undefined;
}

export async function advanceApplicationStage(
  applicationId: string,
  stage: ApplicationStage,
  actorUserId: string,
  note?: string,
): Promise<boolean> {
  const app = await prisma.application.findUnique({ where: { id: applicationId } });
  if (!app) return false;
  await prisma.application.update({ where: { id: applicationId }, data: { stage } });
  await prisma.applicationStageHistory.create({
    data: { applicationId, fromStage: app.stage, toStage: stage, changedById: actorUserId, reason: note },
  });
  return true;
}

export async function setInfoRequested(applicationId: string, note: string): Promise<boolean> {
  const res = await prisma.application.updateMany({
    where: { id: applicationId },
    data: { infoRequested: true, infoRequestNote: note },
  });
  return res.count > 0;
}

export async function clearInfoRequested(applicationId: string): Promise<boolean> {
  const res = await prisma.application.updateMany({
    where: { id: applicationId },
    data: { infoRequested: false, infoRequestNote: null },
  });
  return res.count > 0;
}

/**
 * Manual single-assessor override path (kept alongside the Assessor Team
 * Proposal flow in assessor-team-data.ts for cases too simple to need a full
 * team proposal). Previously this only set Application.assessorUserId and
 * never created a real Assignment row — meaning the entire assessor
 * workspace (getAssignmentsForUser, respondToAssignment, updateFinding,
 * submitAssignmentReport) and the CB's Assessments tab never saw it. Fixed
 * to create/reuse a real Assignment so both paths converge on the same
 * table.
 */
export async function assignAssessorToApplication(
  applicationId: string,
  assessorUserId: string,
  actorUserId: string,
  dueDate?: string,
): Promise<boolean> {
  const app = await prisma.application.findUnique({ where: { id: applicationId } });
  if (!app) return false;

  const assessor = await prisma.assessor.findUnique({ where: { userId: assessorUserId } });
  if (!assessor) return false;

  const movesToAssessment =
    app.stage === "DOCUMENT_REVIEW" || app.stage === "INITIAL_REVIEW" || app.stage === "SUBMITTED";

  const existingAssignment = await prisma.assignment.findFirst({ where: { applicationId, assessorId: assessor.id } });
  if (!existingAssignment) {
    const due = dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await prisma.assignment.create({
      data: { applicationId, assessorId: assessor.id, assignedById: actorUserId, dueDate: due },
    });
  }

  await prisma.application.update({
    where: { id: applicationId },
    data: { assessorUserId, ...(movesToAssessment ? { stage: "ASSESSMENT" as const } : {}) },
  });

  if (movesToAssessment) {
    await prisma.applicationStageHistory.create({
      data: { applicationId, fromStage: app.stage, toStage: "ASSESSMENT", changedById: actorUserId },
    });
  }
  return true;
}

/**
 * Structurally distinct from the assessor's own recommendation — the
 * decider is always the authenticated admin session, which can never be
 * the same identity as the assigned assessor (Phase 6/10 governance rule),
 * and the rationale is required, not optional. Also enforces business rule
 * 9/business rule "decision must consider NC/report state" — an ACCREDIT
 * outcome is blocked while any NC on this application isn't CLOSED or any
 * submitted assessment report isn't FINALIZED yet. (Permission-level
 * authorization — is this admin actually a DECISION_MAKER/FULL_ADMIN — is
 * checked one layer up, in the frontend Server Action, since that's where
 * the session lives.)
 */
export async function recordApplicationDecision(
  applicationId: string,
  outcome: "ACCREDIT" | "DECLINE" | "REQUEST_MORE_INFO",
  rationale: string,
  decidedByUserId: string,
): Promise<{ ok: boolean; error?: string }> {
  const app = await prisma.application.findUnique({ where: { id: applicationId } });
  if (!app) return { ok: false, error: "Application not found." };

  if (outcome === "ACCREDIT") {
    const [openNcCount, unfinalizedReportCount] = await Promise.all([
      prisma.nonConformity.count({ where: { assignment: { applicationId }, status: { notIn: ["CLOSED"] } } }),
      prisma.assessment.count({
        where: { assignment: { applicationId }, reportSubmittedAt: { not: null }, reportStatus: { not: "FINALIZED" } },
      }),
    ]);
    if (openNcCount > 0) {
      return { ok: false, error: `${openNcCount} non-conformit${openNcCount === 1 ? "y is" : "ies are"} still open — all must be closed before accrediting.` };
    }
    if (unfinalizedReportCount > 0) {
      return { ok: false, error: "One or more assessment reports haven't been finalized yet — finalize them before recording a decision." };
    }
  }

  await prisma.decision.upsert({
    where: { applicationId },
    create: { applicationId, decidedById: decidedByUserId, outcome, rationale },
    update: { decidedById: decidedByUserId, outcome, rationale, decidedAt: new Date() },
  });

  if (outcome === "ACCREDIT") {
    await prisma.application.update({ where: { id: applicationId }, data: { stage: "ACCREDITED" } });
    await prisma.applicationStageHistory.create({
      data: { applicationId, fromStage: app.stage, toStage: "ACCREDITED", changedById: decidedByUserId, reason: rationale },
    });
    await ensureAccreditationRecordForApplication(applicationId);
  } else if (outcome === "DECLINE") {
    await prisma.application.update({ where: { id: applicationId }, data: { stage: "DECLINED" } });
    await prisma.applicationStageHistory.create({
      data: { applicationId, fromStage: app.stage, toStage: "DECLINED", changedById: decidedByUserId, reason: rationale },
    });
  } else {
    await prisma.application.update({
      where: { id: applicationId },
      data: { infoRequested: true, infoRequestNote: rationale },
    });
  }
  return { ok: true };
}
