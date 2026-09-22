import { rpc } from "@/lib/rpc-client";

/** Thin proxy over backend/src/data/application-requests.ts — see applicant-data.ts's header comment for why. */

const MODULE = "application-requests";

export type ApplicationRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ApplicationRequestInput {
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  address1: string;
  address2?: string;
  addressDetails?: string;
  city: string;
  state?: string;
  zipCode?: string;
  country: string;
  companyName: string;
  companyWebsite?: string;
  directors?: string;
  responsiblePerson?: string;
  isAlreadyAccredited?: boolean;
  dateOfEstablishment?: string;
  licenseNumber?: string;
  licenseFileName?: string;
  applyFor: string[];
  remarks?: string;
}

export interface ApplicationRequestSummary {
  id: string;
  referenceId: string;
  status: ApplicationRequestStatus;
  companyName: string;
  contactName: string;
  email: string;
  country: string;
  applyFor: string[];
  createdAt: string;
}

export interface ApplicationRequestDetail extends ApplicationRequestSummary {
  phone: string;
  address1: string;
  address2: string | null;
  addressDetails: string | null;
  city: string;
  state: string | null;
  zipCode: string | null;
  companyWebsite: string | null;
  directors: string | null;
  responsiblePerson: string | null;
  alreadyAccredited: boolean;
  dateOfEstablishment: string | null;
  licenseNumber: string | null;
  licenseFileName: string | null;
  remarks: string | null;
  rejectionReason: string | null;
  reviewedByName: string | null;
  reviewedAt: string | null;
}

export type ReviewResult = { ok: true; mailSent: boolean; mailError?: string } | { ok: false; error: string };

export function submitApplicationRequest(
  input: ApplicationRequestInput,
): Promise<{ ok: true; id: string; referenceId: string } | { ok: false; error: string }> {
  return rpc(MODULE, "submitApplicationRequest", [input]);
}

export function listApplicationRequests(status?: ApplicationRequestStatus): Promise<ApplicationRequestSummary[]> {
  return rpc(MODULE, "listApplicationRequests", [status]);
}

export function countPendingApplicationRequests(): Promise<number> {
  return rpc(MODULE, "countPendingApplicationRequests");
}

export function getApplicationRequest(id: string): Promise<ApplicationRequestDetail | null> {
  return rpc(MODULE, "getApplicationRequest", [id]);
}

export function approveApplicationRequest(reviewerUserId: string, id: string): Promise<ReviewResult> {
  return rpc(MODULE, "approveApplicationRequest", [reviewerUserId, id]);
}

export function rejectApplicationRequest(reviewerUserId: string, id: string, reason: string): Promise<ReviewResult> {
  return rpc(MODULE, "rejectApplicationRequest", [reviewerUserId, id, reason]);
}
