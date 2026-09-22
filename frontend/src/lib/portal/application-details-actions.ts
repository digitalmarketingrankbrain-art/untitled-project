"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { saveApplicationDetails, type ApplicationDetails } from "./application-details-data";

async function requireApplicant() {
  const session = await auth();
  if (!session?.user || session.user.role !== "APPLICANT") throw new Error("Not authorised.");
  return session.user;
}

export async function saveApplicationDetailsAction(applicationId: string, details: ApplicationDetails) {
  const user = await requireApplicant();
  const result = await saveApplicationDetails(applicationId, user.id, details);
  if (result.ok) revalidatePath(`/cab/applicant/applications/${applicationId}`);
  return result;
}
