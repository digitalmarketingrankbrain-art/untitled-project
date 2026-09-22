import { rpc } from "@/lib/rpc-client";
import type { ApplicationStage } from "./applicant-data";

/** Thin proxy over backend/src/data/required-forms-data.ts — see applicant-data.ts's header comment for why. */

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

const MODULE = "required-forms-data";

export function getAllRequiredForms(): Promise<RequiredFormRow[]> {
  return rpc(MODULE, "getAllRequiredForms", []);
}

export function createRequiredForm(input: RequiredFormInput): Promise<{ id: string }> {
  return rpc(MODULE, "createRequiredForm", [input]);
}

export function updateRequiredForm(id: string, input: RequiredFormInput): Promise<boolean> {
  return rpc(MODULE, "updateRequiredForm", [id, input]);
}

export function deactivateRequiredForm(id: string): Promise<boolean> {
  return rpc(MODULE, "deactivateRequiredForm", [id]);
}

export function getAllProgramsForPicker(): Promise<{ id: string; name: string; slug: string }[]> {
  return rpc(MODULE, "getAllProgramsForPicker", []);
}
