import { prisma } from "../prisma";
import type { ApplicationStage } from "@prisma/client";

/**
 * Admin CRUD for RequiredDocumentType — previously seed-only with zero admin
 * UI (confirmed by grep: the model was referenced only from backend/src and
 * prisma/seed.ts, never from any frontend page). This is the "Required
 * Forms/Documents" configuration system from Spec §5.
 */

export interface RequiredFormRow {
  id: string;
  programId: string;
  programName: string;
  name: string;
  description: string | null;
  isMandatory: boolean;
  deadlineDays: number | null;
  applicableStage: ApplicationStage | null;
  isActive: boolean;
  sortOrder: number;
  templateDocumentId: string | null;
  templateFilename: string | null;
}

function mapRow(row: {
  id: string; programId: string; program: { name: string }; name: string; description: string | null;
  isMandatory: boolean; deadlineDays: number | null; applicableStage: ApplicationStage | null; isActive: boolean;
  sortOrder: number; templateDocumentId: string | null; templateDocument: { filename: string } | null;
}): RequiredFormRow {
  return {
    id: row.id,
    programId: row.programId,
    programName: row.program.name,
    name: row.name,
    description: row.description,
    isMandatory: row.isMandatory,
    deadlineDays: row.deadlineDays,
    applicableStage: row.applicableStage,
    isActive: row.isActive,
    sortOrder: row.sortOrder,
    templateDocumentId: row.templateDocumentId,
    templateFilename: row.templateDocument?.filename ?? null,
  };
}

export async function getAllRequiredForms(): Promise<RequiredFormRow[]> {
  const rows = await prisma.requiredDocumentType.findMany({
    include: { program: { select: { name: true } }, templateDocument: { select: { filename: true } } },
    orderBy: [{ programId: "asc" }, { sortOrder: "asc" }],
  });
  return rows.map(mapRow);
}

export interface RequiredFormInput {
  programId: string;
  name: string;
  description?: string;
  isMandatory: boolean;
  deadlineDays?: number | null;
  applicableStage?: ApplicationStage | null;
  isActive: boolean;
  sortOrder?: number;
  templateDocumentId?: string | null;
}

export async function createRequiredForm(input: RequiredFormInput): Promise<{ id: string }> {
  const created = await prisma.requiredDocumentType.create({
    data: {
      programId: input.programId,
      name: input.name,
      description: input.description || null,
      isMandatory: input.isMandatory,
      deadlineDays: input.deadlineDays ?? null,
      applicableStage: input.applicableStage ?? null,
      isActive: input.isActive,
      sortOrder: input.sortOrder ?? 0,
      templateDocumentId: input.templateDocumentId || null,
    },
  });
  return { id: created.id };
}

export async function updateRequiredForm(id: string, input: RequiredFormInput): Promise<boolean> {
  const res = await prisma.requiredDocumentType.updateMany({
    where: { id },
    data: {
      programId: input.programId,
      name: input.name,
      description: input.description || null,
      isMandatory: input.isMandatory,
      deadlineDays: input.deadlineDays ?? null,
      applicableStage: input.applicableStage ?? null,
      isActive: input.isActive,
      sortOrder: input.sortOrder ?? 0,
      templateDocumentId: input.templateDocumentId || null,
    },
  });
  return res.count > 0;
}

/** Soft "delete" — deactivates rather than removing, since existing Document rows reference it via requiredDocumentTypeId. */
export async function deactivateRequiredForm(id: string): Promise<boolean> {
  const res = await prisma.requiredDocumentType.updateMany({ where: { id }, data: { isActive: false } });
  return res.count > 0;
}

export async function getAllProgramsForPicker(): Promise<{ id: string; name: string; slug: string }[]> {
  return prisma.program.findMany({ select: { id: true, name: true, slug: true }, orderBy: { name: "asc" } });
}
