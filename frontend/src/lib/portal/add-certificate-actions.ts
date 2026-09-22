"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export interface AdditionalSiteInput {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface AddCertificateInput {
  cabName: string;
  certificateId: string;
  certificateType: string;
  program: string;
  scheme: string;
  certificateStandard: string;
  scopeTechnicalArea: string;
  issueDate: string;
  expiryDate: string;
  status: string;
  descriptionOfScope: string;

  // Organisation Details
  organisationId: string;
  organisationName: string;
  tradingName: string;
  primaryContact: string;
  organisationPhone: string;
  organisationEmail: string;
  locationCertifiedAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;

  // Additional Sites
  additionalSites: AdditionalSiteInput[];
}

export async function addCertificateAction(input: AddCertificateInput) {
  const session = await auth();
  if (!session?.user || session.user.role !== "APPLICANT") {
    return { ok: false as const, error: "Not authorised." };
  }

  // Basic Validation
  if (!input.certificateId.trim()) return { ok: false as const, error: "Certificate ID is required." };
  if (!input.certificateType) return { ok: false as const, error: "Certificate Type is required." };
  if (!input.program) return { ok: false as const, error: "Program is required." };
  if (!input.scheme) return { ok: false as const, error: "Scheme is required." };
  if (!input.certificateStandard) return { ok: false as const, error: "Certificate Standard is required." };
  if (!input.issueDate) return { ok: false as const, error: "Issue Date is required." };
  if (!input.expiryDate) return { ok: false as const, error: "Expiry Date is required." };
  if (!input.descriptionOfScope.trim()) return { ok: false as const, error: "Description of Scope is required." };
  if (!input.organisationName.trim()) return { ok: false as const, error: "Organisation Name is required." };
  if (!input.organisationEmail.trim()) return { ok: false as const, error: "Organisation Email is required." };
  if (!input.locationCertifiedAddress.trim()) return { ok: false as const, error: "Location Certified Address is required." };
  if (!input.city.trim()) return { ok: false as const, error: "City is required." };
  if (!input.country) return { ok: false as const, error: "Country is required." };

  revalidatePath("/cab/applicant/profile");
  revalidatePath("/cab/applicant/accreditation");

  return { ok: true as const, certificateId: input.certificateId };
}
