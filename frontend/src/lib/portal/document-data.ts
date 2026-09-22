import { rpc } from "@/lib/rpc-client";

export type DocumentOwnerType = "APPLICATION" | "ASSESSMENT" | "COMPETENCE" | "ORGANISATION";
export type DocumentKind = "REQUIRED_SUBMISSION" | "EVIDENCE" | "CREDENTIAL" | "CERTIFICATE" | "GENERAL";

/**
 * Thin proxy over backend/src/data/document-data.ts — see applicant-data.ts's
 * header comment for why. `uploadDocumentForOwner`'s `buffer` argument is a
 * real Buffer; rpc-client.ts marks it as base64 for the trip over HTTP and
 * the backend revives it before writing the file to its own local disk
 * (backend/storage/documents), which is why documents written before this
 * migration living on the frontend's disk won't be found anymore.
 */
export interface DocumentVersionEntry {
  id: string;
  filename: string;
  sizeBytes: number;
  mimeType: string;
  uploadedAt: string;
  reviewStatus: "UNDER_REVIEW" | "APPROVED" | "NEEDS_REVISION";
}

export interface DocumentEntry {
  id: string;
  ownerType: DocumentOwnerType;
  ownerId: string;
  documentKind: DocumentKind;
  currentVersion: DocumentVersionEntry | null;
}

export interface DocumentVersionForDownload {
  id: string;
  storageKey: string;
  filename: string;
  mimeType: string;
  document: {
    ownerId: string;
    ownerType: DocumentOwnerType;
  };
}

const MODULE = "document-data";

export function uploadDocumentForOwner(input: {
  ownerType: DocumentOwnerType;
  ownerId: string;
  documentKind: DocumentKind;
  buffer: Buffer;
  filename: string;
  uploadedById: string;
  requiredDocumentTypeId?: string;
  existingDocumentId?: string;
}): Promise<{ documentId: string; versionId: string }> {
  return rpc(MODULE, "uploadDocumentForOwner", [input]);
}

export function getDocumentsForOwner(ownerType: DocumentOwnerType, ownerId: string): Promise<DocumentEntry[]> {
  return rpc(MODULE, "getDocumentsForOwner", [ownerType, ownerId]);
}

export function getDocumentVersionForDownload(versionId: string): Promise<DocumentVersionForDownload | null> {
  return rpc(MODULE, "getDocumentVersionForDownload", [versionId]);
}

export interface AdminDocumentEntry {
  id: string;
  ownerType: string;
  ownerId: string;
  documentKind: string;
  currentVersion?: {
    id: string;
    filename: string;
    sizeBytes: number;
    uploadedAt: string;
    reviewStatus: string;
  } | null;
}

export function getAllDocumentsWithVersions(): Promise<AdminDocumentEntry[]> {
  return rpc(MODULE, "getAllDocumentsWithVersions", []);
}

export function reviewDocumentVersion(
  versionId: string,
  decision: "APPROVED" | "NEEDS_REVISION",
  comment?: string,
): Promise<boolean> {
  return rpc(MODULE, "reviewDocumentVersion", [versionId, decision, comment]);
}

export interface DocumentWithVersionDetail {
  id: string;
  filename: string;
  reviewStatus: "UNDER_REVIEW" | "APPROVED" | "NEEDS_REVISION";
  reviewComment: string | null;
  uploadedBy: { name: string };
  document: { id: string; ownerType: DocumentOwnerType; ownerId: string; applicationId: string | null };
}

export function getDocumentWithVersionById(versionId: string): Promise<DocumentWithVersionDetail | null> {
  return rpc(MODULE, "getDocumentWithVersionById", [versionId]);
}
