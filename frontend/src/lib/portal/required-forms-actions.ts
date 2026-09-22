"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  createRequiredForm,
  updateRequiredForm,
  deactivateRequiredForm,
  type RequiredFormInput,
} from "./required-forms-data";
import { logAction } from "./audit-log";
import { getClientIp } from "@/lib/request-ip";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("Not authorised.");
  const ip = await getClientIp();
  return { ...session.user, ip };
}

export async function saveRequiredForm(id: string | null, input: RequiredFormInput) {
  const admin = await requireAdmin();
  if (!input.name.trim()) return { ok: false as const, error: "A form name is required." };
  if (!input.programId) return { ok: false as const, error: "A scheme/program is required." };

  if (id) {
    const ok = await updateRequiredForm(id, input);
    if (!ok) return { ok: false as const, error: "Couldn't update this required form." };
    await logAction({ actorUserId: admin.id, actorRole: "ADMIN", ipAddress: admin.ip, action: "requiredform.updated", targetType: "RequiredDocumentType", targetId: id });
  } else {
    const created = await createRequiredForm(input);
    await logAction({ actorUserId: admin.id, actorRole: "ADMIN", ipAddress: admin.ip, action: "requiredform.created", targetType: "RequiredDocumentType", targetId: created.id });
  }
  revalidatePath("/admin/required-forms");
  return { ok: true as const };
}

export async function removeRequiredForm(id: string) {
  const admin = await requireAdmin();
  const ok = await deactivateRequiredForm(id);
  if (!ok) return { ok: false as const, error: "Couldn't deactivate this form." };
  await logAction({ actorUserId: admin.id, actorRole: "ADMIN", ipAddress: admin.ip, action: "requiredform.deactivated", targetType: "RequiredDocumentType", targetId: id });
  revalidatePath("/admin/required-forms");
  return { ok: true as const };
}
