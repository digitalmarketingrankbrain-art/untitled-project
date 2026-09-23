"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { updateUserName } from "@/lib/auth/store";

export async function saveAssessorProfile(input: { name: string }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ASSESSOR") throw new Error("Not authorised.");
  const name = input.name.trim();
  if (name.length < 2) return { ok: false as const, error: "Enter your full name." };
  if (name.length > 120) return { ok: false as const, error: "Name must be 120 characters or fewer." };
  const updated = await updateUserName(session.user.id, name);
  if (!updated) return { ok: false as const, error: "Profile could not be found." };
  revalidatePath("/assessor/profile");
  return { ok: true as const, name: updated.name };
}
