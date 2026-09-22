import { prisma } from "../prisma";
import { logAction } from "./audit-log";
import { sendMail, escapeHtml } from "../mail";

export type ApplicationRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ApplicationRequestInput {
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  address1: string;
  address2?: string;
  addressDetails?: string;
  city: string;
  state?: string;
  zipCode?: string;
  country: string;
  companyName: string;
  companyWebsite?: string;
  directors?: string;
  responsiblePerson?: string;
  isAlreadyAccredited?: boolean;
  dateOfEstablishment?: string;
  licenseNumber?: string;
  licenseFileName?: string;
  applyFor: string[];
  remarks?: string;
}

export interface ApplicationRequestSummary {
  id: string;
  referenceId: string;
  status: ApplicationRequestStatus;
  companyName: string;
  contactName: string;
  email: string;
  country: string;
  applyFor: string[];
  createdAt: string;
}

export interface ApplicationRequestDetail extends ApplicationRequestSummary {
  phone: string;
  address1: string;
  address2: string | null;
  addressDetails: string | null;
  city: string;
  state: string | null;
  zipCode: string | null;
  companyWebsite: string | null;
  directors: string | null;
  responsiblePerson: string | null;
  alreadyAccredited: boolean;
  dateOfEstablishment: string | null;
  licenseNumber: string | null;
  licenseFileName: string | null;
  remarks: string | null;
  rejectionReason: string | null;
  reviewedByName: string | null;
  reviewedAt: string | null;
}

export type ReviewResult =
  | { ok: true; mailSent: boolean; mailError?: string }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NAME_RE = /^[\p{L}][\p{L} .'-]*$/u;
const PHONE_CHARS_RE = /^[0-9\s\-()]+$/;
const ZIP_RE = /^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/;
const LICENSE_RE = /^[A-Za-z0-9][A-Za-z0-9 /\-_.]*$/;
const APPLY_FOR_IDS = ["ms", "ib", "pcb", "tl", "vvb", "prod"];

function tooLong(value: string | undefined, max: number): boolean {
  return (value ?? "").trim().length > max;
}

/** Server-side copy of the form's rules (frontend/src/lib/application-request-validation.ts) — the client checks are only a convenience. */
function validateInput(input: ApplicationRequestInput): string | null {
  for (const [label, value] of [["First name", input.firstName], ["Last name", input.lastName]] as const) {
    const v = value.trim();
    if (v.length < 2 || v.length > 50 || !NAME_RE.test(v)) return `${label} must be 2 to 50 letters.`;
  }
  const digits = input.phoneNumber.replace(/\D/g, "");
  if (!PHONE_CHARS_RE.test(input.phoneNumber.trim()) || digits.length < 6 || digits.length > 15) {
    return "Enter a phone number with 6 to 15 digits.";
  }
  if (input.address1.trim().length < 5 || tooLong(input.address1, 200)) return "Enter a valid address.";
  if (tooLong(input.address2, 200) || tooLong(input.addressDetails, 200)) return "Address fields are too long.";
  if (input.city.trim().length < 2 || tooLong(input.city, 80)) return "Enter a valid city.";
  if (tooLong(input.state, 80)) return "Enter a valid state.";
  if (input.zipCode?.trim() && !ZIP_RE.test(input.zipCode.trim())) return "Enter a valid zip / postal code.";
  if (input.companyName.trim().length < 2 || tooLong(input.companyName, 120)) return "Enter a valid company name.";
  if (input.companyWebsite?.trim()) {
    try {
      const url = new URL(/^https?:\/\//i.test(input.companyWebsite.trim()) ? input.companyWebsite.trim() : `https://${input.companyWebsite.trim()}`);
      if (!/^https?:$/.test(url.protocol) || !url.hostname.includes(".")) throw new Error("bad website");
    } catch {
      return "Enter a valid website.";
    }
  }
  if (tooLong(input.directors, 100) || tooLong(input.responsiblePerson, 100)) return "Director / responsible person names are too long.";
  if (input.dateOfEstablishment) {
    const d = new Date(input.dateOfEstablishment);
    if (Number.isNaN(d.getTime()) || d.getFullYear() < 1800 || d.getTime() > Date.now()) {
      return "Enter a valid date of establishment (not in the future).";
    }
  }
  if (input.licenseNumber !== undefined && input.licenseNumber.trim()) {
    const l = input.licenseNumber.trim();
    if (l.length < 3 || l.length > 50 || !LICENSE_RE.test(l)) return "Enter a valid license / registration number.";
  }
  if (tooLong(input.remarks, 1000)) return "Remarks are too long (1000 characters max).";
  if (input.applyFor.some((id) => !APPLY_FOR_IDS.includes(id))) return "Invalid option selected under Apply for.";
  return null;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function referenceIdFor(id: string, createdAt: Date): string {
  return `SAAF-APP-${createdAt.getUTCFullYear()}-${id.slice(-6).toUpperCase()}`;
}

function portalUrl(): string | null {
  const explicit = process.env.FRONTEND_URL;
  if (explicit) return explicit.split(",")[0]!.trim().replace(/\/$/, "");
  const cors = (process.env.CORS_ORIGIN ?? "").split(",").map((s) => s.trim());
  const https = cors.find((o) => o.startsWith("https://"));
  return https ? https.replace(/\/$/, "") : null;
}

type Row = Awaited<ReturnType<typeof prisma.applicationRequest.findFirstOrThrow>>;

function toSummary(r: Row): ApplicationRequestSummary {
  return {
    id: r.id,
    referenceId: referenceIdFor(r.id, r.createdAt),
    status: r.status,
    companyName: r.companyName,
    contactName: `${r.firstName} ${r.lastName}`.trim(),
    email: r.email,
    country: r.country,
    applyFor: r.applyFor,
    createdAt: r.createdAt.toISOString(),
  };
}

/** Public: an organisation submits the Application Request Form. */
export async function submitApplicationRequest(
  input: ApplicationRequestInput,
): Promise<{ ok: true; id: string; referenceId: string } | { ok: false; error: string }> {
  const email = normalizeEmail(input.email ?? "");
  const required: [string, string | undefined][] = [
    ["First name", input.firstName],
    ["Last name", input.lastName],
    ["Phone number", input.phoneNumber],
    ["Address", input.address1],
    ["City", input.city],
    ["State", input.state],
    ["Zip code", input.zipCode],
    ["License / registration number", input.licenseNumber],
    ["Country", input.country],
    ["Company name", input.companyName],
  ];
  for (const [label, value] of required) {
    if (!value || !value.trim()) return { ok: false, error: `${label} is required.` };
  }
  if (!EMAIL_RE.test(email) || email.length > 254) return { ok: false, error: "Enter a valid email address." };
  if (!Array.isArray(input.applyFor) || input.applyFor.length === 0) {
    return { ok: false, error: "Select at least one thing to apply for." };
  }

  const problem = validateInput(input);
  if (problem) return { ok: false, error: problem };

  if (await prisma.user.findUnique({ where: { email } })) {
    return { ok: false, error: "An account with this email already exists. Please sign in instead." };
  }
  if (await prisma.applicationRequest.findFirst({ where: { email, status: "PENDING" } })) {
    return { ok: false, error: "A request for this email is already under review." };
  }

  const established = input.dateOfEstablishment ? new Date(input.dateOfEstablishment) : null;
  const created = await prisma.applicationRequest.create({
    data: {
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email,
      phoneCode: input.phoneCode,
      phoneNumber: input.phoneNumber.trim(),
      address1: input.address1.trim(),
      address2: input.address2?.trim() || null,
      addressDetails: input.addressDetails?.trim() || null,
      city: input.city.trim(),
      state: input.state?.trim() || null,
      zipCode: input.zipCode?.trim() || null,
      country: input.country,
      companyName: input.companyName.trim(),
      companyWebsite: input.companyWebsite?.trim() || null,
      directors: input.directors?.trim() || null,
      responsiblePerson: input.responsiblePerson?.trim() || null,
      alreadyAccredited: Boolean(input.isAlreadyAccredited),
      dateOfEstablishment: established && !Number.isNaN(established.getTime()) ? established : null,
      licenseNumber: input.licenseNumber?.trim() || null,
      licenseFileName: input.licenseFileName?.trim() || null,
      applyFor: input.applyFor,
      remarks: input.remarks?.trim() || null,
    },
  });

  await logAction({
    actorUserId: null,
    actorRole: "PUBLIC",
    action: "application_request.submitted",
    targetType: "ApplicationRequest",
    targetId: created.id,
    after: { companyName: created.companyName, email: created.email },
  });

  return { ok: true, id: created.id, referenceId: referenceIdFor(created.id, created.createdAt) };
}

export async function listApplicationRequests(status?: ApplicationRequestStatus): Promise<ApplicationRequestSummary[]> {
  const rows = await prisma.applicationRequest.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toSummary);
}

export async function countPendingApplicationRequests(): Promise<number> {
  return prisma.applicationRequest.count({ where: { status: "PENDING" } });
}

export async function getApplicationRequest(id: string): Promise<ApplicationRequestDetail | null> {
  const r = await prisma.applicationRequest.findUnique({ where: { id }, include: { reviewedBy: true } });
  if (!r) return null;
  return {
    ...toSummary(r),
    phone: `${r.phoneCode} ${r.phoneNumber}`,
    address1: r.address1,
    address2: r.address2,
    addressDetails: r.addressDetails,
    city: r.city,
    state: r.state,
    zipCode: r.zipCode,
    companyWebsite: r.companyWebsite,
    directors: r.directors,
    responsiblePerson: r.responsiblePerson,
    alreadyAccredited: r.alreadyAccredited,
    dateOfEstablishment: r.dateOfEstablishment ? r.dateOfEstablishment.toISOString() : null,
    licenseNumber: r.licenseNumber,
    licenseFileName: r.licenseFileName,
    remarks: r.remarks,
    rejectionReason: r.rejectionReason,
    reviewedByName: r.reviewedBy?.name ?? null,
    reviewedAt: r.reviewedAt ? r.reviewedAt.toISOString() : null,
  };
}

/** Only an active ADMIN may review — enforced here, not just in the UI. */
async function requireAdmin(reviewerUserId: string) {
  const reviewer = await prisma.user.findUnique({ where: { id: reviewerUserId } });
  if (!reviewer || reviewer.status !== "ACTIVE" || reviewer.primaryRole !== "ADMIN") return null;
  return reviewer;
}

export async function approveApplicationRequest(reviewerUserId: string, id: string): Promise<ReviewResult> {
  const reviewer = await requireAdmin(reviewerUserId);
  if (!reviewer) return { ok: false, error: "Only an administrator can review application requests." };

  const request = await prisma.applicationRequest.findUnique({ where: { id } });
  if (!request) return { ok: false, error: "Request not found." };
  if (request.status !== "PENDING") return { ok: false, error: `This request was already ${request.status.toLowerCase()}.` };
  if (await prisma.user.findUnique({ where: { email: request.email } })) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const displayName = `${request.firstName} ${request.lastName}`.trim();
  const { user, organisation } = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email: request.email, name: displayName, primaryRole: "APPLICANT" },
    });
    const organisation = await tx.organisation.create({
      data: {
        legalName: request.companyName,
        displayName: request.companyName,
        registrationNumber: request.licenseNumber,
        address: request.address1,
        addressLine2: request.address2,
        city: request.city,
        state: request.state,
        postalCode: request.zipCode,
        country: request.country,
        website: request.companyWebsite,
        director: request.directors,
        contactFirstName: request.firstName,
        contactLastName: request.lastName,
        contactEmail: request.email,
        contactPhone: `${request.phoneCode} ${request.phoneNumber}`,
        dateOfEstablishment: request.dateOfEstablishment,
        alreadyAccreditedElsewhere: request.alreadyAccredited,
      },
    });
    await tx.organisationMembership.create({
      data: { organisationId: organisation.id, userId: user.id, membershipRole: "PRIMARY_CONTACT" },
    });
    await tx.applicationRequest.update({
      where: { id },
      data: {
        status: "APPROVED",
        reviewedById: reviewer.id,
        reviewedAt: new Date(),
        createdUserId: user.id,
        createdOrganisationId: organisation.id,
      },
    });
    return { user, organisation };
  });

  await logAction({
    actorUserId: reviewer.id,
    actorRole: "ADMIN",
    action: "application_request.approved",
    targetType: "ApplicationRequest",
    targetId: id,
    before: { status: "PENDING" },
    after: { status: "APPROVED", organisationId: organisation.id, userId: user.id },
  });

  const loginUrl = portalUrl() ? `${portalUrl()}/login` : null;
  const mail = await sendMail({
    to: request.email,
    subject: "Your SAAF accreditation application has been approved",
    text: [
      `Dear ${displayName},`,
      "",
      `Your application on behalf of ${request.companyName} has been approved.`,
      "",
      `You can now sign in as a Certification Body using this email address (${request.email}).` +
        " Choose \"Login as Certification Body\", enter your email and we will send you a one-time code.",
      loginUrl ? `\nSign in: ${loginUrl}` : "",
      "",
      "South Asia Accreditation Foundation",
    ].join("\n"),
    html:
      `<p>Dear ${escapeHtml(displayName)},</p>` +
      `<p>Your application on behalf of <strong>${escapeHtml(request.companyName)}</strong> has been <strong>approved</strong>.</p>` +
      `<p>You can now sign in as a Certification Body using this email address (<strong>${escapeHtml(request.email)}</strong>). ` +
      `Choose &ldquo;Login as Certification Body&rdquo;, enter your email and we will send you a one-time code.</p>` +
      (loginUrl ? `<p><a href="${escapeHtml(loginUrl)}">Sign in to the portal</a></p>` : "") +
      `<p>South Asia Accreditation Foundation</p>`,
  });

  return { ok: true, mailSent: mail.sent, mailError: mail.error };
}

export async function rejectApplicationRequest(
  reviewerUserId: string,
  id: string,
  reason: string,
): Promise<ReviewResult> {
  const reviewer = await requireAdmin(reviewerUserId);
  if (!reviewer) return { ok: false, error: "Only an administrator can review application requests." };

  const cleanReason = (reason ?? "").trim();
  if (cleanReason.length < 5) return { ok: false, error: "Please give a reason for rejecting (at least 5 characters)." };

  const request = await prisma.applicationRequest.findUnique({ where: { id } });
  if (!request) return { ok: false, error: "Request not found." };
  if (request.status !== "PENDING") return { ok: false, error: `This request was already ${request.status.toLowerCase()}.` };

  await prisma.applicationRequest.update({
    where: { id },
    data: { status: "REJECTED", rejectionReason: cleanReason, reviewedById: reviewer.id, reviewedAt: new Date() },
  });

  await logAction({
    actorUserId: reviewer.id,
    actorRole: "ADMIN",
    action: "application_request.rejected",
    targetType: "ApplicationRequest",
    targetId: id,
    reason: cleanReason,
    before: { status: "PENDING" },
    after: { status: "REJECTED" },
  });

  const displayName = `${request.firstName} ${request.lastName}`.trim();
  const mail = await sendMail({
    to: request.email,
    subject: "Update on your SAAF accreditation application",
    text: [
      `Dear ${displayName},`,
      "",
      `Your application on behalf of ${request.companyName} has been rejected.`,
      "",
      `Reason: ${cleanReason}`,
      "",
      "If you have questions, please contact us.",
      "",
      "South Asia Accreditation Foundation",
    ].join("\n"),
    html:
      `<p>Dear ${escapeHtml(displayName)},</p>` +
      `<p>Your application on behalf of <strong>${escapeHtml(request.companyName)}</strong> has been <strong>rejected</strong>.</p>` +
      `<p><strong>Reason:</strong> ${escapeHtml(cleanReason).replace(/\n/g, "<br>")}</p>` +
      `<p>If you have questions, please contact us.</p><p>South Asia Accreditation Foundation</p>`,
  });

  return { ok: true, mailSent: mail.sent, mailError: mail.error };
}
