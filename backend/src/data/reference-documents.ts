import { prisma } from "../prisma";

export interface ReferenceDocumentEntry {
  id: string;
  description: string;
  filename: string;
}

/** AB-issued checklists/forms visible to every CB — not organisation-scoped, read-only from the CB side. */
export async function getReferenceDocuments(): Promise<ReferenceDocumentEntry[]> {
  const rows = await prisma.referenceDocument.findMany({ orderBy: { sortOrder: "asc" } });
  return rows.map((r) => ({ id: r.id, description: r.description, filename: r.filename }));
}

export async function getReferenceDocumentForDownload(id: string) {
  return prisma.referenceDocument.findUnique({ where: { id } });
}
