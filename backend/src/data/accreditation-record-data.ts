import { prisma } from "../prisma";

/**
 * Real AccreditationRecord rows — previously the schema had this model
 * (Milestone 11) but NOTHING ever created one; the public /verify page and
 * admin accreditation-records list run entirely on a separate hand-curated
 * in-memory array (frontend/src/lib/verification-records.ts, explicitly
 * flagged in HANDOVER.md as not yet migrated). This module creates a real
 * record the moment an application is actually accredited, so certificate
 * issuance has a real row to attach to — reconciling that with the legacy
 * in-memory verification store is a separate, already-flagged migration,
 * out of scope here.
 */

function generateAccreditationNumber(): string {
  return `ACC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function ensureAccreditationRecordForApplication(
  applicationId: string,
  validityYears = 3,
): Promise<{ id: string; accreditationNumber: string }> {
  const existing = await prisma.accreditationRecord.findUnique({ where: { originatingApplicationId: applicationId } });
  if (existing) return { id: existing.id, accreditationNumber: existing.accreditationNumber };

  const app = await prisma.application.findUniqueOrThrow({ where: { id: applicationId } });
  const effectiveDate = new Date();
  const expiryDate = new Date(effectiveDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + validityYears);

  const record = await prisma.accreditationRecord.create({
    data: {
      accreditationNumber: generateAccreditationNumber(),
      organisationId: app.organisationId,
      programId: app.programId,
      originatingApplicationId: applicationId,
      effectiveDate,
      expiryDate,
    },
  });
  return { id: record.id, accreditationNumber: record.accreditationNumber };
}

export interface AccreditationRecordSummary {
  id: string;
  accreditationNumber: string;
  organisationName: string;
  programName: string;
  status: string;
  effectiveDate: string;
  expiryDate: string | null;
}

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function getAccreditationRecordForApplication(applicationId: string): Promise<AccreditationRecordSummary | undefined> {
  const row = await prisma.accreditationRecord.findUnique({
    where: { originatingApplicationId: applicationId },
    include: { organisation: true, program: true },
  });
  if (!row) return undefined;
  return {
    id: row.id,
    accreditationNumber: row.accreditationNumber,
    organisationName: row.organisation.displayName,
    programName: row.program.name,
    status: row.status,
    effectiveDate: fmtDate(row.effectiveDate),
    expiryDate: row.expiryDate ? fmtDate(row.expiryDate) : null,
  };
}

// ---------------------------------------------------------------------------
// Register view + admin status changes — real DB (replaces the frontend's
// in-memory placeholder store for the admin records pages and public /verify).
// ---------------------------------------------------------------------------

export type RecordStatus = "ACTIVE" | "SUSPENDED" | "WITHDRAWN" | "CANCELLED" | "EXPIRED";

export interface RegisterRecord {
  /** Accreditation number — also the public URL slug at /verify/[reference]. */
  reference: string;
  organisationName: string;
  programSlug: string;
  programName: string;
  status: RecordStatus;
  effectiveDate: string;
  expiryDate: string | null;
  lastSurveillanceDate: string | null;
  nextRenewalDate: string | null;
  certificateVisible: boolean;
  isPublished: boolean;
  statusHistory: { from: RecordStatus; to: RecordStatus; reason: string; changedBy: string; changedAt: string }[];
}

const RECORD_INCLUDE = {
  organisation: true,
  program: true,
  verificationRecord: true,
  statusHistory: { include: { changedBy: true }, orderBy: { changedAt: "asc" as const } },
} as const;

type RecordRow = NonNullable<Awaited<ReturnType<typeof prisma.accreditationRecord.findFirst<{ include: typeof RECORD_INCLUDE }>>>>;

function toRegisterRecord(r: RecordRow): RegisterRecord {
  return {
    reference: r.accreditationNumber,
    organisationName: r.organisation.displayName,
    programSlug: r.program.slug,
    programName: r.program.name,
    status: r.status,
    effectiveDate: fmtDate(r.effectiveDate),
    expiryDate: r.expiryDate ? fmtDate(r.expiryDate) : null,
    lastSurveillanceDate: r.lastSurveillanceDate ? fmtDate(r.lastSurveillanceDate) : null,
    nextRenewalDate: r.nextRenewalDate ? fmtDate(r.nextRenewalDate) : null,
    // Rows with no VerificationRecord yet follow the model defaults: published, certificate hidden.
    certificateVisible: r.verificationRecord?.certificateDocumentVisible ?? false,
    isPublished: r.verificationRecord?.isPublished ?? true,
    statusHistory: r.statusHistory.map((h) => ({
      from: h.fromStatus,
      to: h.toStatus,
      reason: h.reason,
      changedBy: h.changedBy.name,
      changedAt: fmtDate(h.changedAt),
    })),
  };
}

/** Admin: every accreditation record, published or not. */
export async function listAccreditationRecords(): Promise<RegisterRecord[]> {
  const rows = await prisma.accreditationRecord.findMany({ include: RECORD_INCLUDE, orderBy: { effectiveDate: "desc" } });
  return rows.map(toRegisterRecord);
}

/** Admin lookup by accreditation number (case-insensitive) — sees unpublished records too. */
export async function getAccreditationRecordByReference(reference: string): Promise<RegisterRecord | null> {
  const row = await prisma.accreditationRecord.findFirst({
    where: { accreditationNumber: { equals: reference.trim(), mode: "insensitive" } },
    include: RECORD_INCLUDE,
  });
  return row ? toRegisterRecord(row) : null;
}

/** Public /verify lookup — unpublished records are treated as not found. */
export async function getPublicAccreditationRecord(reference: string): Promise<RegisterRecord | null> {
  const record = await getAccreditationRecordByReference(reference);
  return record && record.isPublished ? record : null;
}

/** A CAB's own accreditation records (via their organisation membership), newest first. */
export async function getAccreditationRecordsForUser(userId: string): Promise<RegisterRecord[]> {
  const membership = await prisma.organisationMembership.findFirst({ where: { userId } });
  if (!membership) return [];
  const rows = await prisma.accreditationRecord.findMany({
    where: { organisationId: membership.organisationId },
    include: RECORD_INCLUDE,
    orderBy: { effectiveDate: "desc" },
  });
  return rows.map(toRegisterRecord);
}

/** Admin-initiated changes only: suspend, withdraw or cancel. (Active/Expired are not something an admin sets by hand.) */
const VALID_STATUSES: RecordStatus[] = ["SUSPENDED", "WITHDRAWN", "CANCELLED"];

/** Only an active ADMIN may change an accreditation's status — enforced here, not just in the UI. */
async function requireAdminUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user && user.status === "ACTIVE" && user.primaryRole === "ADMIN" ? user : null;
}

export async function changeAccreditationStatus(
  adminUserId: string,
  reference: string,
  newStatus: RecordStatus,
  reason: string,
): Promise<{ ok: true; from: RecordStatus } | { ok: false; error: string }> {
  const admin = await requireAdminUser(adminUserId);
  if (!admin) return { ok: false, error: "Only an administrator can change an accreditation's status." };
  if (!VALID_STATUSES.includes(newStatus)) return { ok: false, error: "Invalid status." };
  const cleanReason = (reason ?? "").trim();
  if (!cleanReason) return { ok: false, error: "A reason is required for every status change." };

  const record = await prisma.accreditationRecord.findFirst({
    where: { accreditationNumber: { equals: reference.trim(), mode: "insensitive" } },
  });
  if (!record) return { ok: false, error: "Record not found." };
  if (record.status === newStatus) return { ok: false, error: `This accreditation is already ${newStatus.toLowerCase()}.` };

  await prisma.$transaction([
    prisma.accreditationRecord.update({ where: { id: record.id }, data: { status: newStatus } }),
    prisma.accreditationStatusHistory.create({
      data: {
        accreditationRecordId: record.id,
        fromStatus: record.status,
        toStatus: newStatus,
        reason: cleanReason,
        changedById: admin.id,
      },
    }),
  ]);
  return { ok: true, from: record.status };
}

async function upsertVerificationRecord(reference: string, data: { isPublished?: boolean; certificateDocumentVisible?: boolean }) {
  const record = await prisma.accreditationRecord.findFirst({
    where: { accreditationNumber: { equals: reference.trim(), mode: "insensitive" } },
  });
  if (!record) return false;
  await prisma.verificationRecord.upsert({
    where: { accreditationRecordId: record.id },
    create: { accreditationRecordId: record.id, ...data },
    update: data,
  });
  return true;
}

export async function setVerificationPublished(adminUserId: string, reference: string, published: boolean): Promise<boolean> {
  if (!(await requireAdminUser(adminUserId))) return false;
  return upsertVerificationRecord(reference, { isPublished: published });
}

export async function setCertificateVisible(adminUserId: string, reference: string, visible: boolean): Promise<boolean> {
  if (!(await requireAdminUser(adminUserId))) return false;
  return upsertVerificationRecord(reference, { certificateDocumentVisible: visible });
}
