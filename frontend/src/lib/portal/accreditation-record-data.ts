import { rpc } from "@/lib/rpc-client";
import type { VerificationRecord, VerificationStatus } from "@/lib/verification-records";

/** Thin proxy over backend/src/data/accreditation-record-data.ts — see applicant-data.ts's header comment for why. */

export interface AccreditationRecordSummary {
  id: string;
  accreditationNumber: string;
  organisationName: string;
  programName: string;
  status: string;
  effectiveDate: string;
  expiryDate: string | null;
}

const MODULE = "accreditation-record-data";

export function getAccreditationRecordForApplication(applicationId: string): Promise<AccreditationRecordSummary | undefined> {
  return rpc(MODULE, "getAccreditationRecordForApplication", [applicationId]);
}

export function listAccreditationRecords(): Promise<VerificationRecord[]> {
  return rpc(MODULE, "listAccreditationRecords");
}

/** Admin lookup: includes unpublished records. */
export function getAccreditationRecordByReference(reference: string): Promise<VerificationRecord | null> {
  return rpc(MODULE, "getAccreditationRecordByReference", [reference]);
}

/** Public /verify lookup: unpublished records come back as null. */
export function getPublicAccreditationRecord(reference: string): Promise<VerificationRecord | null> {
  return rpc(MODULE, "getPublicAccreditationRecord", [reference]);
}

export function getAccreditationRecordsForUser(userId: string): Promise<VerificationRecord[]> {
  return rpc(MODULE, "getAccreditationRecordsForUser", [userId]);
}

export function changeAccreditationRecordStatus(
  adminUserId: string,
  reference: string,
  newStatus: VerificationStatus,
  reason: string,
): Promise<{ ok: true; from: VerificationStatus } | { ok: false; error: string }> {
  return rpc(MODULE, "changeAccreditationStatus", [adminUserId, reference, newStatus, reason]);
}

export function setVerificationPublished(adminUserId: string, reference: string, published: boolean): Promise<boolean> {
  return rpc(MODULE, "setVerificationPublished", [adminUserId, reference, published]);
}

export function setCertificateVisible(adminUserId: string, reference: string, visible: boolean): Promise<boolean> {
  return rpc(MODULE, "setCertificateVisible", [adminUserId, reference, visible]);
}
