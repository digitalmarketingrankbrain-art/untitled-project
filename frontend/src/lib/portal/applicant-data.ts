import { rpc } from "@/lib/rpc-client";

/**
 * Thin proxy over the backend's data/applicant-data.ts — the actual Prisma
 * queries now live there (backend/src/data/applicant-data.ts, moved
 * verbatim from this file) since the frontend process no longer holds
 * DATABASE_URL. Every exported name/signature below is kept identical so
 * the ~25 consuming pages/components didn't need to change at all.
 */

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
  assessorUserId?: string;
  decisionOutcome?: "ACCREDIT" | "DECLINE" | "REQUEST_MORE_INFO";
  decisionRationale?: string;
  decidedBy?: string;
  documents: RequiredDocument[];
  stageHistory: StageHistoryEntry[];
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

const MODULE = "applicant-data";

export function getApplicationsForUser(userId: string): Promise<Application[]> {
  return rpc(MODULE, "getApplicationsForUser", [userId]);
}

export function getApplicationById(id: string, userId: string): Promise<Application | undefined> {
  return rpc(MODULE, "getApplicationById", [id, userId]);
}

export function getInvoicesForUser(userId: string): Promise<Invoice[]> {
  return rpc(MODULE, "getInvoicesForUser", [userId]);
}

export function getAllInvoices(): Promise<Invoice[]> {
  return rpc(MODULE, "getAllInvoices", []);
}

export function getInvoiceById(id: string, userId: string): Promise<Invoice | undefined> {
  return rpc(MODULE, "getInvoiceById", [id, userId]);
}

export function getMessagesForApplication(applicationId: string): Promise<Message[]> {
  return rpc(MODULE, "getMessagesForApplication", [applicationId]);
}

export function getMessagesForApplicationByReference(reference: string): Promise<Message[]> {
  return rpc(MODULE, "getMessagesForApplicationByReference", [reference]);
}

export function getApplicationIdByReference(reference: string): Promise<string | null> {
  return rpc(MODULE, "getApplicationIdByReference", [reference]);
}

export function addMessage(applicationId: string, body: string, senderUserId: string): Promise<void> {
  return rpc(MODULE, "addMessage", [applicationId, body, senderUserId]);
}

export function createDraftApplication(
  userId: string,
  programSlug: string,
  additionalScopeSlugs?: string[],
): Promise<{ id: string }> {
  return rpc(MODULE, "createDraftApplication", [userId, programSlug, additionalScopeSlugs]);
}

export interface ScopeExtensionDraftInput {
  primaryProgramSlug: string;
  additionalScopeSlugs: string[];
  draftData: Record<string, unknown>;
}

export function saveScopeExtensionDraft(
  userId: string,
  input: ScopeExtensionDraftInput,
  existingApplicationId?: string,
): Promise<{ id: string; referenceNumber: string }> {
  return rpc(MODULE, "saveScopeExtensionDraft", [userId, input, existingApplicationId]);
}

export interface ScopeExtensionDraftSummary {
  id: string;
  referenceNumber: string;
  primaryProgramSlug: string;
  additionalScopeSlugs: string[];
  draftData: Record<string, unknown>;
}

export function getDraftScopeExtensionSummary(userId: string): Promise<ScopeExtensionDraftSummary | undefined> {
  return rpc(MODULE, "getDraftScopeExtensionSummary", [userId]);
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

export function getScopeExtensionApplicationsForUser(userId: string): Promise<ScopeExtensionApplicationRow[]> {
  return rpc(MODULE, "getScopeExtensionApplicationsForUser", [userId]);
}

export function submitApplication(applicationId: string, actorUserId: string): Promise<boolean> {
  return rpc(MODULE, "submitApplication", [applicationId, actorUserId]);
}

export function getAllApplications(): Promise<Application[]> {
  return rpc(MODULE, "getAllApplications", []);
}

export function getApplicationByIdAdmin(id: string): Promise<Application | undefined> {
  return rpc(MODULE, "getApplicationByIdAdmin", [id]);
}

export function advanceApplicationStage(
  applicationId: string,
  stage: ApplicationStage,
  actorUserId: string,
  note?: string,
): Promise<boolean> {
  return rpc(MODULE, "advanceApplicationStage", [applicationId, stage, actorUserId, note]);
}

export function setInfoRequested(applicationId: string, note: string): Promise<boolean> {
  return rpc(MODULE, "setInfoRequested", [applicationId, note]);
}

export function clearInfoRequested(applicationId: string): Promise<boolean> {
  return rpc(MODULE, "clearInfoRequested", [applicationId]);
}

export function assignAssessorToApplication(
  applicationId: string,
  assessorUserId: string,
  actorUserId: string,
  dueDate?: string,
): Promise<boolean> {
  return rpc(MODULE, "assignAssessorToApplication", [applicationId, assessorUserId, actorUserId, dueDate]);
}

export function recordApplicationDecision(
  applicationId: string,
  outcome: "ACCREDIT" | "DECLINE" | "REQUEST_MORE_INFO",
  rationale: string,
  decidedByUserId: string,
): Promise<{ ok: boolean; error?: string }> {
  return rpc(MODULE, "recordApplicationDecision", [applicationId, outcome, rationale, decidedByUserId]);
}
