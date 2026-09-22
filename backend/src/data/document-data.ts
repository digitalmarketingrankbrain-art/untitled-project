import { prisma } from "../prisma";
import { saveDocumentFile, guessMimeType } from "./storage";
import type { DocumentOwnerType, DocumentKind } from "@prisma/client";

/**
 * Real Prisma-backed Document/DocumentVersion records (Milestone 13, tied
 * into the real Application checklist in the Applications migration).
 * `ownerId` stays a plain string (not just a foreign key) since a document
 * can in principle belong to owner types other than APPLICATION (schema
 * allows ASSESSMENT/COMPETENCE/ORGANISATION too); `applicationId` is set
 * alongside it as the real FK whenever the owner is an application, which
 * is what src/lib/portal/applicant-data.ts's checklist builder queries by.
 */

export async function uploadDocumentForOwner(input: {
  ownerType: DocumentOwnerType;
  ownerId: string;
  documentKind: DocumentKind;
  buffer: Buffer;
  filename: string;
  uploadedById: string;
  /** Required-document-type checklist item this upload satisfies, if any. */
  requiredDocumentTypeId?: string;
  /** If provided, adds a new version to this existing Document instead of creating one. */
  existingDocumentId?: string;
}) {
  const { storageKey, sizeBytes } = await saveDocumentFile(input.buffer, input.filename);
  const mimeType = guessMimeType(input.filename);

  // Re-uploading for a checklist item that already has a document should add
  // a new version to it, not create a second, orphaned Document row for the
  // same required-document-type — resolve that even when the caller didn't
  // already know the existing document's id.
  const existingDocumentId =
    input.existingDocumentId ??
    (input.requiredDocumentTypeId
      ? (
          await prisma.document.findFirst({
            where: { ownerType: input.ownerType, ownerId: input.ownerId, requiredDocumentTypeId: input.requiredDocumentTypeId },
            select: { id: true },
          })
        )?.id
      : undefined);

  if (existingDocumentId) {
    const doc = await prisma.document.findUnique({ where: { id: existingDocumentId } });
    if (!doc) throw new Error("Document not found.");
    const versionCount = await prisma.documentVersion.count({ where: { documentId: doc.id } });
    const version = await prisma.documentVersion.create({
      data: {
        documentId: doc.id,
        versionNumber: versionCount + 1,
        storageKey,
        filename: input.filename,
        mimeType,
        sizeBytes,
        uploadedById: input.uploadedById,
        reviewStatus: "UNDER_REVIEW",
      },
    });
    await prisma.document.update({ where: { id: doc.id }, data: { currentVersionId: version.id } });
    return { documentId: doc.id, versionId: version.id };
  }

  const document = await prisma.document.create({
    data: {
      ownerType: input.ownerType,
      ownerId: input.ownerId,
      applicationId: input.ownerType === "APPLICATION" ? input.ownerId : undefined,
      documentKind: input.documentKind,
      requiredDocumentTypeId: input.requiredDocumentTypeId,
    },
  });
  const version = await prisma.documentVersion.create({
    data: {
      documentId: document.id,
      versionNumber: 1,
      storageKey,
      filename: input.filename,
      mimeType,
      sizeBytes,
      uploadedById: input.uploadedById,
      reviewStatus: "UNDER_REVIEW",
    },
  });
  await prisma.document.update({ where: { id: document.id }, data: { currentVersionId: version.id } });
  return { documentId: document.id, versionId: version.id };
}

export async function getDocumentsForOwner(ownerType: DocumentOwnerType, ownerId: string) {
  return prisma.document.findMany({
    where: { ownerType, ownerId },
    include: { currentVersion: true, versions: { orderBy: { versionNumber: "desc" } } },
    orderBy: { createdAt: "asc" },
  });
}

export async function getDocumentVersionForDownload(versionId: string) {
  return prisma.documentVersion.findUnique({
    where: { id: versionId },
    include: { document: true },
  });
}

/** Global admin oversight view — every document across every owner, newest first. */
export async function getAllDocumentsWithVersions() {
  return prisma.document.findMany({
    include: { currentVersion: true },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Approve/request-revision on a document's CURRENT version — previously no
 * mutator existed anywhere for this at all (confirmed by grep); the admin
 * Documents page could only display reviewStatus, never change it.
 */
export async function reviewDocumentVersion(
  versionId: string,
  decision: "APPROVED" | "NEEDS_REVISION",
  comment?: string,
): Promise<boolean> {
  const res = await prisma.documentVersion.updateMany({
    where: { id: versionId },
    data: { reviewStatus: decision, reviewComment: comment || null },
  });
  return res.count > 0;
}

export async function getDocumentWithVersionById(versionId: string) {
  return prisma.documentVersion.findUnique({ where: { id: versionId }, include: { document: true, uploadedBy: { select: { name: true } } } });
}
