import { rpc } from "@/lib/rpc-client";

const MODULE = "application-details-data";

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

export function getApplicationDetails(applicationId: string, userId: string): Promise<ApplicationDetails> {
  return rpc(MODULE, "getApplicationDetails", [applicationId, userId]);
}

export function getApplicationDetailsAdmin(applicationId: string): Promise<ApplicationDetails> {
  return rpc(MODULE, "getApplicationDetailsAdmin", [applicationId]);
}

export function saveApplicationDetails(
  applicationId: string,
  userId: string,
  details: ApplicationDetails,
): Promise<{ ok: true } | { ok: false; error: string }> {
  return rpc(MODULE, "saveApplicationDetails", [applicationId, userId, details]);
}
