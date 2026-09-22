import { rpc } from "@/lib/rpc-client";

/** Thin proxy over backend/src/data/certificate-data.ts — see applicant-data.ts's header comment for why. */

export interface CertificateRow {
  id: string;
  certificateNumber: string;
  version: number;
  status: string;
  issueDate: string;
  validUntil: string | null;
  scopeText: string;
  standardReference: string | null;
  authorizedSignatoryName: string;
  filename: string;
}

export interface IssueCertificateInput {
  applicationId: string;
  scopeText: string;
  standardReference?: string;
  validityMonths: number;
  authorizedSignatoryName: string;
  authorizedSignatoryTitle?: string;
}

const MODULE = "certificate-data";

export function issueCertificate(input: IssueCertificateInput, issuedById: string): Promise<{ id: string; certificateNumber: string }> {
  return rpc(MODULE, "issueCertificate", [input, issuedById]);
}

export function getCertificatesForApplication(applicationId: string): Promise<CertificateRow[]> {
  return rpc(MODULE, "getCertificatesForApplication", [applicationId]);
}

export function getCertificatesForUser(userId: string): Promise<CertificateRow[]> {
  return rpc(MODULE, "getCertificatesForUser", [userId]);
}

export interface CertificateDownload {
  storageKey: string;
  filename: string;
  organisationId: string;
}

export function getCertificateForDownload(certificateId: string): Promise<CertificateDownload | undefined> {
  return rpc(MODULE, "getCertificateForDownload", [certificateId]);
}

export function revokeCertificate(certificateId: string): Promise<boolean> {
  return rpc(MODULE, "revokeCertificate", [certificateId]);
}
