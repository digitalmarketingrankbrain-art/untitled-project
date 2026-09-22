import { rpc } from "@/lib/rpc-client";

/**
 * Thin proxy over backend/src/data/storage.ts's file-reading side — the
 * actual files live on the backend's disk now (backend/storage/documents),
 * since only the backend process does any filesystem/DB access. The
 * write side (saveDocumentFile) is only ever called from within
 * document-data.ts's uploadDocumentForOwner, which itself now lives on the
 * backend, so it doesn't need a frontend proxy.
 */
export function readDocumentFile(storageKey: string): Promise<Buffer> {
  return rpc("storage", "readDocumentFile", [storageKey]);
}

export function documentFileExists(storageKey: string): Promise<boolean> {
  return rpc("storage", "documentFileExists", [storageKey]);
}

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB, matches the project's file-size microcopy standard.
