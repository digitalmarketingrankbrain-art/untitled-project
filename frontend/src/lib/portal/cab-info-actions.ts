"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  updateCabBasicDetails,
  addLocation,
  setAppliedCountries,
  addTeamMember,
  type CabDetails,
  type LocationEntry,
  type AddTeamMemberInput,
} from "./cab-info-data";
import { uploadDocumentForOwner } from "./document-data";
import { getUserOrganisationId } from "@/lib/auth/store";
import { MAX_UPLOAD_BYTES } from "@/lib/storage";

async function requireApplicant() {
  const session = await auth();
  if (!session?.user || session.user.role !== "APPLICANT") {
    throw new Error("Not authorised.");
  }
  return session.user;
}

export async function saveBasicDetails(data: Partial<Omit<CabDetails, "organisationId" | "cabNumber">>) {
  const user = await requireApplicant();
  await updateCabBasicDetails(user.id, data);
  revalidatePath("/cab/applicant/profile");
  return { ok: true as const };
}

export async function saveAppliedCountries(countryCodes: string[]) {
  const user = await requireApplicant();
  await setAppliedCountries(user.id, countryCodes);
  revalidatePath("/cab/applicant/profile");
  return { ok: true as const };
}

export async function addLocationAction(data: Omit<LocationEntry, "id">) {
  const user = await requireApplicant();
  if (!data.address.trim()) return { ok: false as const, error: "Address is required." };
  await addLocation(user.id, data);
  revalidatePath("/cab/applicant/profile");
  return { ok: true as const };
}

export async function addTeamMemberAction(input: AddTeamMemberInput) {
  const user = await requireApplicant();
  if (!input.name.trim() || !input.email.trim()) {
    return { ok: false as const, error: "Name and email are required." };
  }
  const result = await addTeamMember(user.id, input);
  if (!result.ok) return { ok: false as const, error: result.error };
  revalidatePath("/cab/applicant/profile");
  return { ok: true as const };
}

export async function uploadOrganisationDocument(file: File) {
  const user = await requireApplicant();
  const organisationId = await getUserOrganisationId(user.id);
  if (!organisationId) return { ok: false as const, error: "No organisation found for this account." };
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false as const, error: "That file is larger than 25 MB. Please upload a smaller file." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  await uploadDocumentForOwner({
    ownerType: "ORGANISATION",
    ownerId: organisationId,
    documentKind: "GENERAL",
    buffer,
    filename: file.name,
    uploadedById: user.id,
  });

  revalidatePath("/cab/applicant/profile");
  return { ok: true as const };
}
