"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { saveScopeExtensionDraft, submitApplication, type ScopeExtensionDraftInput } from "./applicant-data";

async function requireApplicant() {
  const session = await auth();
  if (!session?.user || session.user.role !== "APPLICANT") {
    throw new Error("Not authorised.");
  }
  return session.user;
}

export async function saveScopeExtensionDraftAction(input: ScopeExtensionDraftInput, existingApplicationId?: string) {
  const user = await requireApplicant();
  if (!input.primaryProgramSlug) {
    return { ok: false as const, error: "Select at least one scheme before saving." };
  }
  try {
    const result = await saveScopeExtensionDraft(user.id, input, existingApplicationId);
    revalidatePath("/cab/applicant/apply/scope-extension");
    return { ok: true as const, ...result };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Couldn't save draft." };
  }
}

export async function submitScopeExtensionAction(input: ScopeExtensionDraftInput, existingApplicationId?: string) {
  const user = await requireApplicant();
  if (!input.primaryProgramSlug) {
    return { ok: false as const, error: "Select at least one scheme before submitting." };
  }
  const saved = await saveScopeExtensionDraft(user.id, input, existingApplicationId);
  const ok = await submitApplication(saved.id, user.id);
  if (!ok) return { ok: false as const, error: "Couldn't submit application." };

  revalidatePath("/cab/applicant/apply/scope-extension");
  revalidatePath("/cab/applicant/applications");
  return { ok: true as const, id: saved.id, referenceNumber: saved.referenceNumber };
}
