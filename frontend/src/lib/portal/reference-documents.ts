import { rpc } from "@/lib/rpc-client";

/** Thin proxy over backend/src/data/reference-documents.ts — see applicant-data.ts's header comment for why. */

export interface ReferenceDocumentEntry {
  id: string;
  description: string;
  filename: string;
}

export interface ReferenceDocumentForDownload {
  id: string;
  description: string;
  filename: string;
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
}

const MODULE = "reference-documents";

export function getReferenceDocuments(): Promise<ReferenceDocumentEntry[]> {
  return rpc(MODULE, "getReferenceDocuments", []);
}

export function getReferenceDocumentForDownload(id: string): Promise<ReferenceDocumentForDownload | null> {
  return rpc(MODULE, "getReferenceDocumentForDownload", [id]);
}
