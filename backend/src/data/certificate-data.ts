import PDFDocument from "pdfkit";
import { prisma } from "../prisma";
import { saveDocumentFile } from "./storage";
import { getUserOrganisationId } from "./auth-store";
import { ensureAccreditationRecordForApplication } from "./accreditation-record-data";

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const SAAF_NAME = "South Asia Accreditation Foundation (SAAF)";

function buildCertificatePdf(data: {
  certificateNumber: string;
  organisationName: string;
  scopeText: string;
  standardReference: string | null;
  programName: string;
  issueDate: string;
  validUntil: string | null;
  signatoryName: string;
  signatoryTitle: string | null;
  version: number;
  keyLocation: string | null;
  otherLocations: string[];
  approvedCountries: string[];
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const chunks: Buffer[] = [];
    doc.on("data", (c) => chunks.push(c as Buffer));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageWidth = doc.page.width - 80;

    // --- Page 1: Certificate ---
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(2).stroke("#1d4ed8");
    doc.rect(26, 26, doc.page.width - 52, doc.page.height - 52).lineWidth(0.5).stroke("#1d4ed8");

    doc.moveDown(2);
    doc.fontSize(18).font("Helvetica-Bold").fillColor("#1d4ed8").text("CERTIFICATE OF ACCREDITATION", 40, 70, { align: "center", width: pageWidth });
    doc.moveDown(0.3);
    doc.fontSize(12).font("Helvetica-Bold").fillColor("#0f172a").text(SAAF_NAME, { align: "center", width: pageWidth });
    doc.fontSize(9).font("Helvetica").fillColor("#475569").text("South Asia", { align: "center", width: pageWidth });

    doc.moveDown(2);
    doc.fontSize(11).font("Helvetica").fillColor("#334155").text("Has Accredited", { align: "center", width: pageWidth });
    doc.moveDown(0.5);
    doc.fontSize(20).font("Helvetica-Bold").fillColor("#0f172a").text(data.organisationName, { align: "center", width: pageWidth });
    if (data.keyLocation) {
      doc.moveDown(0.2);
      doc.fontSize(9).font("Helvetica").fillColor("#64748b").text(data.keyLocation, { align: "center", width: pageWidth });
    }

    doc.moveDown(1.2);
    doc.fontSize(11).font("Helvetica").fillColor("#334155").text(`In the field of ${data.programName}`, { align: "center", width: pageWidth });
    doc.moveDown(0.3);
    doc.fontSize(9).font("Helvetica-Oblique").fillColor("#64748b").text("Details of the Scope of Accreditation are set out in the Schedule of Accreditation issued with this Certificate.", {
      align: "center",
      width: pageWidth,
    });

    if (data.version > 1) {
      doc.moveDown(1);
      doc.fontSize(10).font("Helvetica-Bold").fillColor("#b91c1c").text(`Reissue — version ${data.version}`, { align: "center", width: pageWidth });
    }

    doc.moveDown(2.5);
    const detailsY = doc.y;
    doc.fontSize(10).font("Helvetica-Bold").fillColor("#0f172a");
    const row = (label: string, value: string, y: number) => {
      doc.text(label, 60, y, { continued: true, width: 200 }).font("Helvetica").text(`  ${value}`);
      doc.font("Helvetica-Bold");
    };
    row("Certificate Number:", data.certificateNumber, detailsY);
    row("Standard / Scheme:", data.standardReference ?? "—", detailsY + 16);
    row("Issue Date:", data.issueDate, detailsY + 32);
    row("Valid Until:", data.validUntil ?? "—", detailsY + 48);

    doc.moveDown(4);
    const sigY = detailsY + 90;
    doc.font("Helvetica").fontSize(10).text("_____________________________", 60, sigY);
    doc.font("Helvetica-Bold").text(data.signatoryName, 60, sigY + 14);
    if (data.signatoryTitle) doc.font("Helvetica").fontSize(9).fillColor("#475569").text(data.signatoryTitle, 60, sigY + 28);

    doc.font("Helvetica").fontSize(8).fillColor("#94a3b8").text(
      "This certificate remains the property of the issuing Accreditation Body and is subject to the terms of the accreditation agreement. Verify at saaf-accreditation.org/verify.",
      40,
      doc.page.height - 90,
      { align: "center", width: pageWidth },
    );

    // --- Page 2: Schedule of Accreditation ---
    doc.addPage({ size: "A4", margin: 40 });
    doc.fontSize(16).font("Helvetica-Bold").fillColor("#1d4ed8").text("Schedule of Accreditation", { align: "center", width: pageWidth });
    doc.moveDown(0.3);
    doc.fontSize(9).font("Helvetica").fillColor("#64748b").text(`Issued with Certificate ${data.certificateNumber}`, { align: "center", width: pageWidth });
    doc.moveDown(1.5);

    doc.fontSize(10).fillColor("#0f172a");
    const field = (label: string, value: string) => {
      doc.font("Helvetica-Bold").text(`${label}: `, { continued: true }).font("Helvetica").text(value);
      doc.moveDown(0.4);
    };
    field("Name of CAB", data.organisationName);
    field("Key Location", data.keyLocation ?? "—");
    if (data.otherLocations.length > 0) {
      doc.font("Helvetica-Bold").text("Other Locations:");
      for (const loc of data.otherLocations) {
        doc.font("Helvetica").fontSize(9).text(`  •  ${loc}`);
      }
      doc.fontSize(10).moveDown(0.4);
    }
    field(
      "Countries where accredited certificates can be issued",
      data.approvedCountries.length > 0 ? data.approvedCountries.join(", ") : "—",
    );

    doc.moveDown(0.8);
    doc.font("Helvetica-Bold").fontSize(11).text("Accreditation Details");
    doc.moveDown(0.3);
    const tblY = doc.y;
    doc.rect(40, tblY, pageWidth, 20).fillAndStroke("#1d4ed8", "#1d4ed8");
    doc.fillColor("#fff").font("Helvetica-Bold").fontSize(9);
    doc.text("Standard / Scheme", 46, tblY + 6, { width: 220 });
    doc.text("Accreditation Number", 270, tblY + 6, { width: 140 });
    doc.text("Valid From", 415, tblY + 6, { width: 70 });
    doc.text("Valid Until", 490, tblY + 6, { width: 70 });
    const rowY = tblY + 20;
    doc.rect(40, rowY, pageWidth, 20).stroke();
    doc.fillColor("#0f172a").font("Helvetica").fontSize(9);
    doc.text(data.standardReference ?? "—", 46, rowY + 6, { width: 220 });
    doc.text(data.certificateNumber, 270, rowY + 6, { width: 140 });
    doc.text(data.issueDate, 415, rowY + 6, { width: 70 });
    doc.text(data.validUntil ?? "—", 490, rowY + 6, { width: 70 });

    doc.x = 40;
    doc.y = rowY + 40;
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#0f172a").text("Scope of Accreditation", 40, doc.y, { width: pageWidth });
    doc.moveDown(0.3);
    doc.font("Helvetica").fontSize(9).fillColor("#334155").text(data.scopeText, 40, doc.y, { width: pageWidth });

    doc.moveDown(2);
    doc.font("Helvetica-Oblique").fontSize(8).fillColor("#94a3b8").text(
      "*Subject to the terms and conditions of the Accreditation Agreement being met, and Annual Surveillances and other obligations being satisfactorily completed.",
      40,
      doc.y,
      { width: pageWidth },
    );

    doc.end();
  });
}

export interface IssueCertificateInput {
  applicationId: string;
  scopeText: string;
  standardReference?: string;
  validityMonths: number;
  authorizedSignatoryName: string;
  authorizedSignatoryTitle?: string;
}

/**
 * Issuing when a certificate already exists for this accreditation record
 * revokes the prior one and creates a new, higher-version row chained via
 * supersedesId — full reissue history, nothing overwritten in place.
 */
export async function issueCertificate(
  input: IssueCertificateInput,
  issuedById: string,
): Promise<{ id: string; certificateNumber: string }> {
  const { id: accreditationRecordId, accreditationNumber } = await ensureAccreditationRecordForApplication(input.applicationId);
  const recordWithOrg = await prisma.accreditationRecord.findUniqueOrThrow({
    where: { id: accreditationRecordId },
    include: {
      organisation: { include: { locations: true, countries: { where: { status: "APPROVED" } } } },
      program: true,
      certificates: { orderBy: { version: "desc" }, take: 1 },
    },
  });

  const previous = recordWithOrg.certificates[0];
  const version = previous ? previous.version + 1 : 1;
  const certificateNumber = version === 1 ? accreditationNumber : `${accreditationNumber}-R${version}`;
  const issueDate = new Date();
  const validUntil = new Date(issueDate);
  validUntil.setMonth(validUntil.getMonth() + input.validityMonths);

  const locations = recordWithOrg.organisation.locations;
  const headOffice = locations.find((l) => l.locationType === "HEAD_OFFICE") ?? locations[0];
  const keyLocation = headOffice
    ? [headOffice.address, headOffice.city, headOffice.state, headOffice.country].filter(Boolean).join(", ")
    : recordWithOrg.organisation.address;
  const otherLocations = locations
    .filter((l) => l.id !== headOffice?.id)
    .map((l) => [l.address, l.city, l.state, l.country].filter(Boolean).join(", "));
  const approvedCountries = [...new Set(recordWithOrg.organisation.countries.map((c) => c.countryName))];

  const pdfBuffer = await buildCertificatePdf({
    certificateNumber,
    organisationName: recordWithOrg.organisation.displayName,
    scopeText: input.scopeText,
    standardReference: input.standardReference ?? null,
    programName: recordWithOrg.program.name,
    issueDate: fmtDate(issueDate),
    validUntil: fmtDate(validUntil),
    signatoryName: input.authorizedSignatoryName,
    signatoryTitle: input.authorizedSignatoryTitle ?? null,
    version,
    keyLocation: keyLocation ?? null,
    otherLocations,
    approvedCountries,
  });
  const filename = `${certificateNumber}.pdf`;
  const { storageKey } = await saveDocumentFile(pdfBuffer, filename);

  const created = await prisma.$transaction(async (tx) => {
    if (previous) {
      await tx.accreditationCertificate.update({ where: { id: previous.id }, data: { status: "REVOKED" } });
    }
    return tx.accreditationCertificate.create({
      data: {
        accreditationRecordId,
        certificateNumber,
        version,
        issueDate,
        validUntil,
        scopeText: input.scopeText,
        standardReference: input.standardReference,
        authorizedSignatoryName: input.authorizedSignatoryName,
        authorizedSignatoryTitle: input.authorizedSignatoryTitle,
        storageKey,
        filename,
        issuedById,
        supersedesId: previous?.id,
      },
    });
  });

  return { id: created.id, certificateNumber: created.certificateNumber };
}

export interface CertificateRow {
  id: string;
  certificateNumber: string;
  version: number;
  status: string;
  issueDate: string;
  validUntil: string | null;
  scopeText: string;
  standardReference: string | null;
  authorizedSignatoryName: string;
  filename: string;
}

function mapCertificate(c: {
  id: string; certificateNumber: string; version: number; status: string; issueDate: Date; validUntil: Date | null;
  scopeText: string; standardReference: string | null; authorizedSignatoryName: string; filename: string;
}): CertificateRow {
  return {
    id: c.id,
    certificateNumber: c.certificateNumber,
    version: c.version,
    status: c.status,
    issueDate: fmtDate(c.issueDate),
    validUntil: c.validUntil ? fmtDate(c.validUntil) : null,
    scopeText: c.scopeText,
    standardReference: c.standardReference,
    authorizedSignatoryName: c.authorizedSignatoryName,
    filename: c.filename,
  };
}

export async function getCertificatesForApplication(applicationId: string): Promise<CertificateRow[]> {
  const record = await prisma.accreditationRecord.findUnique({
    where: { originatingApplicationId: applicationId },
    include: { certificates: { orderBy: { version: "desc" } } },
  });
  return record ? record.certificates.map(mapCertificate) : [];
}

export async function getCertificatesForUser(userId: string): Promise<CertificateRow[]> {
  const organisationId = await getUserOrganisationId(userId);
  if (!organisationId) return [];
  const records = await prisma.accreditationRecord.findMany({
    where: { organisationId },
    include: { certificates: { orderBy: { version: "desc" } } },
  });
  return records.flatMap((r) => r.certificates.map(mapCertificate));
}

export interface CertificateDownload {
  storageKey: string;
  filename: string;
}

/** Access check performed by the caller (route handler) — mirrors documents/[versionId]/route.ts's pattern. */
export async function getCertificateForDownload(
  certificateId: string,
): Promise<(CertificateDownload & { organisationId: string }) | undefined> {
  const cert = await prisma.accreditationCertificate.findUnique({
    where: { id: certificateId },
    include: { accreditationRecord: { select: { organisationId: true } } },
  });
  if (!cert) return undefined;
  return { storageKey: cert.storageKey, filename: cert.filename, organisationId: cert.accreditationRecord.organisationId };
}

export async function revokeCertificate(certificateId: string): Promise<boolean> {
  const res = await prisma.accreditationCertificate.updateMany({
    where: { id: certificateId, status: "ISSUED" },
    data: { status: "REVOKED" },
  });
  return res.count > 0;
}
