import { mkdir, writeFile, readFile, stat } from "fs/promises";
import path from "path";
import crypto from "crypto";

/**
 * Private local filesystem storage — a stand-in for the S3/R2-compatible
 * object storage the Phase 11 architecture calls for, until real cloud
 * credentials exist. Deliberately shaped the same way a real object store
 * would be used (opaque storageKey, never a public path, access mediated
 * through an authenticated route handler rather than a direct static URL)
 * so swapping the implementation later doesn't change any calling code's
 * shape — only this file's internals.
 */

const STORAGE_ROOT = path.join(process.cwd(), "storage", "documents");

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100);
}

export async function saveDocumentFile(
  buffer: Buffer,
  originalFilename: string,
): Promise<{ storageKey: string; sizeBytes: number }> {
  await mkdir(STORAGE_ROOT, { recursive: true });
  const storageKey = `${crypto.randomUUID()}-${sanitizeFilename(originalFilename)}`;
  const fullPath = path.join(STORAGE_ROOT, storageKey);

  // Defense in depth against path traversal via a crafted filename, even
  // though sanitizeFilename above already strips path separators.
  if (!fullPath.startsWith(STORAGE_ROOT)) {
    throw new Error("Invalid storage path.");
  }

  await writeFile(fullPath, buffer);
  return { storageKey, sizeBytes: buffer.byteLength };
}

export async function readDocumentFile(storageKey: string): Promise<Buffer> {
  const fullPath = path.join(STORAGE_ROOT, storageKey);
  if (!fullPath.startsWith(STORAGE_ROOT)) {
    throw new Error("Invalid storage path.");
  }
  return readFile(fullPath);
}

export async function documentFileExists(storageKey: string): Promise<boolean> {
  try {
    await stat(path.join(STORAGE_ROOT, storageKey));
    return true;
  } catch {
    return false;
  }
}

const ACCEPTED_MIME_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

export function guessMimeType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return ACCEPTED_MIME_TYPES[ext] ?? "application/octet-stream";
}

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB, matches the project's file-size microcopy standard.
