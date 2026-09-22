import { prisma } from "../prisma";
import type { Prisma } from "@prisma/client";

/**
 * Detailed applicant-body form data — aligned to the AB's real application
 * form blueprint (chief/contact details, other accreditations held,
 * auditor/staff counts, financial summary, minimum-eligibility checklist).
 * Stored as JSON on Application.detailsData rather than one column per field,
 * since most of this is optional and some sections (financials, other
 * accreditations) are naturally repeating rows.
 */
export interface ApplicationContact {
  name: string;
  designation: string;
  mobile: string;
  email: string;
}

export interface OtherAccreditationEntry {
  bodyName: string;
  scheme: string;
  scope: string;
  accreditationNo: string;
}

export interface FinancialYearEntry {
  year: string;
  income: string;
  expenditure: string;
}

export interface OtherOfficeEntry {
  type: "BRANCH" | "SUBCONTRACTOR" | "ASSOCIATE";
  name: string;
  address: string;
  activities: string;
  resources: string;
  certificatesCount: string;
}

export interface ScopeItemEntry {
  iafCode: string;
  description: string;
  class: string;
}

export interface CertificateIssuedEntry {
  iafScope: string;
  orgCount: string;
  orgNames: string;
}

export interface EnclosureItem {
  label: string;
  provided: boolean;
  annexRef: string;
}

export const ENCLOSURE_LABELS = [
  "Application fee",
  "Cross-reference matrix / gap analysis against the standard",
  "Quality manual, procedures and other documentation",
  "Sample of the certificate and schedule",
  "Sample of the certification agreement",
  "Sample of the mark/logo and proof of ownership rights",
  "Resources and competence matrix (lead auditor, auditor, technical experts)",
  "List of auditor staff with specialisation against scopes applied for",
  "List of certified organisations against each scope",
  "Description of liability insurance held",
  "Letter of authorisation to act on behalf of the CB",
  "Other supporting documents",
] as const;

export interface ApplicationDetails {
  legalEntityStatus: string;
  chief: ApplicationContact & { landline: string; website: string };
  contact1: ApplicationContact;
  contact2: ApplicationContact;
  otherOffices: OtherOfficeEntry[];
  otherAccreditations: OtherAccreditationEntry[];
  scopeItems: ScopeItemEntry[];
  auditors: { fullTime: string; contract: string; technicalExperts: string };
  certificatesIssued: CertificateIssuedEntry[];
  financials: FinancialYearEntry[];
  eligibility: {
    qms6Months: boolean;
    qms6MonthsDate: string;
    managementReview: boolean;
    managementReviewDate: string;
    internalAudit: boolean;
    internalAuditDate: string;
    impartialityMeeting: boolean;
    impartialityMeetingDate: string;
    twoCertifications: boolean;
  };
  enclosures: EnclosureItem[];
  declarationAccepted: boolean;
}

export function emptyApplicationDetails(): ApplicationDetails {
  return {
    legalEntityStatus: "",
    chief: { name: "", designation: "", landline: "", mobile: "", email: "", website: "" },
    contact1: { name: "", designation: "", mobile: "", email: "" },
    contact2: { name: "", designation: "", mobile: "", email: "" },
    otherOffices: [],
    otherAccreditations: [],
    scopeItems: [],
    auditors: { fullTime: "", contract: "", technicalExperts: "" },
    certificatesIssued: [],
    financials: [],
    eligibility: {
      qms6Months: false,
      qms6MonthsDate: "",
      managementReview: false,
      managementReviewDate: "",
      internalAudit: false,
      internalAuditDate: "",
      impartialityMeeting: false,
      impartialityMeetingDate: "",
      twoCertifications: false,
    },
    enclosures: ENCLOSURE_LABELS.map((label) => ({ label, provided: false, annexRef: "" })),
    declarationAccepted: false,
  };
}

export async function getApplicationDetails(applicationId: string, userId: string): Promise<ApplicationDetails> {
  const app = await prisma.application.findFirst({
    where: { id: applicationId, applicantUserId: userId },
    select: { detailsData: true },
  });
  if (!app?.detailsData) return emptyApplicationDetails();
  return { ...emptyApplicationDetails(), ...(app.detailsData as Partial<ApplicationDetails>) };
}

/** Admin/assessor cross-cutting read — not scoped to one applicant. */
export async function getApplicationDetailsAdmin(applicationId: string): Promise<ApplicationDetails> {
  const app = await prisma.application.findUnique({ where: { id: applicationId }, select: { detailsData: true } });
  if (!app?.detailsData) return emptyApplicationDetails();
  return { ...emptyApplicationDetails(), ...(app.detailsData as Partial<ApplicationDetails>) };
}

export async function saveApplicationDetails(
  applicationId: string,
  userId: string,
  details: ApplicationDetails,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const app = await prisma.application.findFirst({ where: { id: applicationId, applicantUserId: userId }, select: { stage: true } });
  if (!app) return { ok: false, error: "Application not found." };
  if (app.stage !== "DRAFT") return { ok: false, error: "This application has already been submitted and can no longer be edited." };

  await prisma.application.update({
    where: { id: applicationId },
    data: { detailsData: details as unknown as Prisma.InputJsonValue },
  });
  return { ok: true };
}
