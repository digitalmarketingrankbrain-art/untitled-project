/**
 * Seeds the real database with data equivalent to the in-memory placeholder
 * stores used by the app since Milestone 8 (src/lib/portal/*-data.ts,
 * src/lib/verification-records.ts, src/lib/auth/store.ts) — so Milestone 12
 * (wiring the app to Prisma) has consistent starting data, and the same
 * demo narrative (Northfield Testing Laboratories, Sam Assessor, etc.)
 * carries through unchanged.
 */
import { PrismaClient } from "@prisma/client";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

// Mirrors src/lib/storage.ts's layout (storage/documents/<key>) without
// importing app code with a "@/" alias into this script — seed.ts is
// intentionally excluded from the app's tsconfig (see Milestone 11).
const STORAGE_ROOT = path.join(process.cwd(), "storage", "documents");

async function seedDemoFile(key: string, content: string): Promise<{ storageKey: string; sizeBytes: number }> {
  await mkdir(STORAGE_ROOT, { recursive: true });
  const buffer = Buffer.from(content, "utf-8");
  await writeFile(path.join(STORAGE_ROOT, key), buffer);
  return { storageKey: key, sizeBytes: buffer.byteLength };
}

async function main() {
  console.log("Seeding programs...");
  const programsData = [
    {
      slug: "testing-calibration-laboratories",
      name: "Testing & Calibration Laboratories",
      scopeDescription: "Covers physical, chemical, and dimensional testing and calibration activities.",
      standardReference: "ISO/IEC 17025",
      feeAmount: 2500,
      currency: "USD",
    },
    {
      slug: "inspection-bodies",
      name: "Inspection Bodies",
      scopeDescription: "Covers inspection of products, processes, installations, and services against defined criteria.",
      standardReference: "ISO/IEC 17020",
      feeAmount: 2200,
      currency: "USD",
    },
    {
      slug: "management-systems-certification-bodies",
      name: "Management Systems Certification Bodies",
      scopeDescription: "Covers certification of quality, environmental, and other management systems.",
      standardReference: "ISO/IEC 17021-1",
      feeAmount: 3000,
      currency: "USD",
    },
    {
      slug: "product-certification-bodies",
      name: "Product Certification Bodies",
      scopeDescription: "Covers certification that specific products meet defined technical requirements.",
      standardReference: "ISO/IEC 17065",
      feeAmount: 2800,
      currency: "USD",
    },
    {
      slug: "certification-bodies-for-persons",
      name: "Certification Bodies for Persons",
      scopeDescription: "Covers certification of individuals' competence against defined criteria.",
      standardReference: "ISO/IEC 17024",
      feeAmount: 1800,
      currency: "USD",
    },
  ];

  const programs: Record<string, { id: string }> = {};
  for (const p of programsData) {
    const program = await prisma.program.upsert({
      where: { slug: p.slug },
      update: { standardReference: p.standardReference },
      create: p,
    });
    programs[p.slug] = program;
  }

  function getProgram(slug: string) {
    const program = programs[slug];
    if (!program) throw new Error(`Seed error: program "${slug}" was not created above.`);
    return program;
  }

  console.log("Seeding required document types...");
  const requiredDocTypes: Record<string, { id: string; name: string }[]> = {};
  for (const p of programsData) {
    const existing = await prisma.requiredDocumentType.findMany({ where: { programId: getProgram(p.slug).id } });
    if (existing.length > 0) {
      requiredDocTypes[p.slug] = existing;
      continue;
    }
    const defs =
      p.slug === "testing-calibration-laboratories"
        ? [
            { name: "Application Form", isMandatory: true },
            { name: "Quality Manual", isMandatory: true },
            { name: "Scope of Accreditation Request", isMandatory: true },
            { name: "Staff Competence Records", isMandatory: false },
          ]
        : [
            { name: "Application Form", isMandatory: true },
            { name: "Scope of Accreditation Request", isMandatory: true },
          ];
    const created: { id: string; name: string }[] = [];
    for (const d of defs) {
      const row = await prisma.requiredDocumentType.create({ data: { programId: getProgram(p.slug).id, ...d } });
      created.push(row);
    }
    requiredDocTypes[p.slug] = created;
  }
  function getRequiredDocType(slug: string, name: string) {
    const rdt = requiredDocTypes[slug]?.find((r) => r.name === name);
    if (!rdt) throw new Error(`Seed error: required document type "${name}" not found for program "${slug}".`);
    return rdt;
  }

  console.log("Seeding users...");
  // Explicit, fixed IDs — matching what the still-in-memory portal stores
  // (src/lib/portal/applicant-data.ts, assessor-data.ts) hardcode as
  // applicantUserId/assessorUserId. Until those are migrated to Prisma too
  // (remaining Milestone 12 work), the real authenticated user's id has to
  // line up with those placeholder references or the whole portal breaks.
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      id: "user-admin-demo",
      email: "admin@example.com",
      name: "Jordan Admin",
      primaryRole: "ADMIN",
    },
  });

  // FULL_ADMIN — without this, nobody could ever record a final decision,
  // issue a certificate, or grant further permissions (AdminPermission is
  // now actually enforced; previously it was defined in the schema but
  // never checked, so this had no functional effect before).
  const existingFullAdminGrant = await prisma.adminPermissionGrant.findFirst({
    where: { userId: admin.id, permission: "FULL_ADMIN" },
  });
  if (!existingFullAdminGrant) {
    await prisma.adminPermissionGrant.create({
      data: { userId: admin.id, permission: "FULL_ADMIN", grantedById: admin.id },
    });
  }

  const assessorUser = await prisma.user.upsert({
    where: { email: "assessor@example.com" },
    update: {},
    create: {
      id: "user-assessor-demo",
      email: "assessor@example.com",
      name: "Sam Assessor",
      primaryRole: "ASSESSOR",
    },
  });
  const assessor = await prisma.assessor.upsert({
    where: { userId: assessorUser.id },
    update: {},
    create: { userId: assessorUser.id, bio: "10 years laboratory quality management experience." },
  });

  const applicantUser = await prisma.user.upsert({
    where: { email: "applicant@example.com" },
    update: {},
    create: {
      id: "user-applicant-demo",
      email: "applicant@example.com",
      name: "Alex Applicant",
      primaryRole: "APPLICANT",
    },
  });

  console.log("Seeding organisation...");
  let organisation = await prisma.organisation.findFirst({ where: { displayName: "Northfield Testing Laboratories" } });
  if (!organisation) {
    organisation = await prisma.organisation.create({
      data: { legalName: "Northfield Testing Laboratories", displayName: "Northfield Testing Laboratories" },
    });
  }
  // CAB Info — Basic Details (Milestone 18: CB Dashboard). Safe to re-run: always sets the same demo values.
  organisation = await prisma.organisation.update({
    where: { id: organisation.id },
    data: {
      shortCode: "NTL",
      cabNumber: "133",
      website: "https://northfieldtesting.example.com/",
      director: "R. K. Ashford",
      certificationManager: "Priya Menon",
      address: "1450 Industrial Parkway",
      addressLine2: "Suite 220",
      city: "Northfield",
      state: "Minnesota",
      postalCode: "55057",
      country: "US",
      contactFirstName: "Priya",
      contactLastName: "Menon",
      contactEmail: "info@northfieldtesting.example.com",
      contactPhone: "+1 (507) 555-0148",
    },
  });
  await prisma.organisationMembership.upsert({
    where: { organisationId_userId: { organisationId: organisation.id, userId: applicantUser.id } },
    update: { title: "Certification Manager" },
    create: { organisationId: organisation.id, userId: applicantUser.id, membershipRole: "PRIMARY_CONTACT", title: "Certification Manager" },
  });

  console.log("Seeding CAB locations + countries...");
  if ((await prisma.organisationLocation.count({ where: { organisationId: organisation.id } })) === 0) {
    await prisma.organisationLocation.createMany({
      data: [
        {
          organisationId: organisation.id,
          contactPerson: "Priya Menon",
          mobile: "+1 (507) 555-0148",
          address: "1450 Industrial Parkway, Suite 220",
          city: "Northfield",
          state: "Minnesota",
          country: "US",
          postalCode: "55057",
          locationType: "HEAD_OFFICE",
        },
        {
          organisationId: organisation.id,
          contactPerson: "David Okafor",
          mobile: "+1 (507) 555-0177",
          address: "22 Riverside Way",
          city: "Faribault",
          state: "Minnesota",
          country: "US",
          postalCode: "55021",
          locationType: "OTHER",
        },
      ],
    });
  }
  if ((await prisma.organisationCountry.count({ where: { organisationId: organisation.id } })) === 0) {
    await prisma.organisationCountry.createMany({
      data: [
        { organisationId: organisation.id, countryCode: "US", countryName: "United States", status: "APPLIED" },
        { organisationId: organisation.id, countryCode: "CA", countryName: "Canada", status: "APPLIED" },
        { organisationId: organisation.id, countryCode: "MX", countryName: "Mexico", status: "APPLIED" },
        { organisationId: organisation.id, countryCode: "US", countryName: "United States", status: "APPROVED", approvedAt: new Date("2026-01-14") },
      ],
    });
  }

  console.log("Seeding assessor competence...");
  await prisma.assessorCompetence.createMany({
    data: [
      {
        assessorId: assessor.id,
        programId: getProgram("testing-calibration-laboratories").id,
        qualifyingBasis: "10 years laboratory quality management experience; internal auditor certification.",
        dateQualified: new Date("2022-03-01"),
        expiryDate: new Date("2027-03-01"),
        status: "CURRENT",
      },
      {
        assessorId: assessor.id,
        programId: getProgram("product-certification-bodies").id,
        qualifyingBasis: "Product safety engineering background; certification body auditor training.",
        dateQualified: new Date("2021-09-15"),
        expiryDate: new Date("2026-09-15"),
        status: "EXPIRING_SOON",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seeding assessor availability...");
  if ((await prisma.assessorAvailability.count({ where: { assessorId: assessor.id } })) === 0) {
    await prisma.assessorAvailability.create({
      data: { assessorId: assessor.id, startDate: new Date("2026-10-05"), endDate: new Date("2026-10-19"), note: "Annual leave" },
    });
  }

  console.log("Seeding application...");
  let application = await prisma.application.findUnique({ where: { referenceNumber: "MAB-APP-2026-0091" } });
  if (!application) {
    application = await prisma.application.create({
      data: {
        referenceNumber: "MAB-APP-2026-0091",
        organisationId: organisation.id,
        applicantUserId: applicantUser.id,
        programId: getProgram("testing-calibration-laboratories").id,
        stage: "ASSESSMENT",
        infoRequested: true,
        infoRequestNote:
          "Your uploaded Quality Manual references an outdated calibration procedure. Please upload a revised version reflecting your current procedure.",
        assessorUserId: assessorUser.id,
        submittedAt: new Date("2026-03-02"),
      },
    });
    await prisma.applicationStageHistory.createMany({
      data: [
        { applicationId: application.id, toStage: "DRAFT", changedById: applicantUser.id, changedAt: new Date("2026-02-20") },
        { applicationId: application.id, fromStage: "DRAFT", toStage: "SUBMITTED", changedById: applicantUser.id, changedAt: new Date("2026-03-02") },
        { applicationId: application.id, fromStage: "SUBMITTED", toStage: "INITIAL_REVIEW", changedById: admin.id, changedAt: new Date("2026-03-10") },
        { applicationId: application.id, fromStage: "INITIAL_REVIEW", toStage: "DOCUMENT_REVIEW", changedById: admin.id, reason: "Revision requested on Quality Manual.", changedAt: new Date("2026-03-18") },
        { applicationId: application.id, fromStage: "DOCUMENT_REVIEW", toStage: "ASSESSMENT", changedById: admin.id, changedAt: new Date("2026-06-01") },
      ],
    });
  }

  const hasDemoDocuments = (await prisma.document.count({ where: { applicationId: application.id } })) > 0;
  if (!hasDemoDocuments) {
    console.log("Seeding demo documents for the application...");
    const slug = "testing-calibration-laboratories";
    const docsToSeed: { typeName: string; filename: string; content: string; reviewStatus: "APPROVED" | "NEEDS_REVISION"; reviewComment?: string; uploadedAt: string }[] = [
      { typeName: "Application Form", filename: "application-form.pdf", content: "Demo application form content.", reviewStatus: "APPROVED", uploadedAt: "2026-03-01" },
      { typeName: "Quality Manual", filename: "quality-manual-v1.pdf", content: "Demo quality manual content (Section 4.2 references an outdated calibration procedure).", reviewStatus: "NEEDS_REVISION", reviewComment: "References an outdated calibration procedure (Section 4.2). Please update and re-upload.", uploadedAt: "2026-03-01" },
      { typeName: "Scope of Accreditation Request", filename: "scope-request.pdf", content: "Demo scope of accreditation request content.", reviewStatus: "APPROVED", uploadedAt: "2026-03-01" },
    ];
    for (const d of docsToSeed) {
      const rdt = getRequiredDocType(slug, d.typeName);
      const { storageKey, sizeBytes } = await seedDemoFile(`seed-${application.id}-${rdt.id}`, d.content);
      const doc = await prisma.document.create({
        data: {
          ownerType: "APPLICATION",
          ownerId: application.id,
          applicationId: application.id,
          documentKind: "REQUIRED_SUBMISSION",
          requiredDocumentTypeId: rdt.id,
        },
      });
      const version = await prisma.documentVersion.create({
        data: {
          documentId: doc.id,
          versionNumber: 1,
          storageKey,
          filename: d.filename,
          mimeType: "application/pdf",
          sizeBytes,
          uploadedById: applicantUser.id,
          uploadedAt: new Date(d.uploadedAt),
          reviewStatus: d.reviewStatus,
          reviewComment: d.reviewComment,
        },
      });
      await prisma.document.update({ where: { id: doc.id }, data: { currentVersionId: version.id } });
    }
  }

  const existingThread = await prisma.messageThread.findUnique({ where: { applicationId: application.id } });
  if (!existingThread) {
    console.log("Seeding demo messages for the application...");
    const thread = await prisma.messageThread.create({
      data: { contextType: "APPLICATION", applicationId: application.id },
    });
    await prisma.message.createMany({
      data: [
        {
          threadId: thread.id,
          senderUserId: admin.id,
          body: "Your application has moved to Document Review. We'll be in touch if anything further is needed.",
          createdAt: new Date("2026-03-18"),
        },
        {
          threadId: thread.id,
          senderUserId: assessorUser.id,
          body: "I've been assigned as your assessor and will be reviewing your Quality Manual revision once uploaded.",
          createdAt: new Date("2026-06-02"),
        },
      ],
    });
  }

  console.log("Seeding a second, still-draft application...");
  const draftApplication = await prisma.application.findUnique({ where: { referenceNumber: "MAB-APP-2026-0102" } });
  if (!draftApplication) {
    const draftApp = await prisma.application.create({
      data: {
        referenceNumber: "MAB-APP-2026-0102",
        organisationId: organisation.id,
        applicantUserId: applicantUser.id,
        programId: getProgram("inspection-bodies").id,
        stage: "DRAFT",
      },
    });
    await prisma.applicationStageHistory.create({
      data: { applicationId: draftApp.id, toStage: "DRAFT", changedById: applicantUser.id, changedAt: new Date("2026-08-28") },
    });
  }

  console.log("Seeding assignment + assessment...");
  let assignment = await prisma.assignment.findFirst({ where: { applicationId: application.id, assessorId: assessor.id } });
  const isNewAssignment = !assignment;
  if (!assignment) {
    assignment = await prisma.assignment.create({
      data: {
        applicationId: application.id,
        assessorId: assessor.id,
        status: "IN_PROGRESS",
        assignedById: admin.id,
        assignedAt: new Date("2026-06-01"),
        respondedAt: new Date("2026-06-02"),
        dueDate: new Date("2026-09-30"),
        assessmentNumber: "26-133-661",
        assessmentType: "OFFICE_ASSESSMENT",
        schemeSlugs: ["inspection-bodies"],
      },
    });
  }
  // Backfills CB-facing assessment fields (Milestone 18) onto an assignment
  // created by an earlier seed run, before these columns existed — same
  // "nested inside an existing guard" idempotency gap flagged in Milestone 12.
  if (!isNewAssignment && !assignment.assessmentNumber) {
    assignment = await prisma.assignment.update({
      where: { id: assignment.id },
      data: { assessmentNumber: "26-133-661", assessmentType: "OFFICE_ASSESSMENT", schemeSlugs: ["inspection-bodies"] },
    });
  }
  if (isNewAssignment) {
    const assessment = await prisma.assessment.create({
      data: { assignmentId: assignment.id, startedAt: new Date("2026-06-02") },
    });
    const criterion1 = await prisma.assessmentCriterion.create({
      data: {
        programId: getProgram("testing-calibration-laboratories").id,
        requirementText: "Documented quality manual reflects current procedures.",
        category: "Management System",
        sortOrder: 1,
      },
    });
    const criterion2 = await prisma.assessmentCriterion.create({
      data: {
        programId: getProgram("testing-calibration-laboratories").id,
        requirementText: "Internal audits conducted at planned intervals.",
        category: "Management System",
        sortOrder: 2,
      },
    });
    await prisma.assessmentFinding.createMany({
      data: [
        {
          assessmentId: assessment.id,
          criterionId: criterion1.id,
          status: "NON_CONFORMANCE",
          severity: "MINOR",
          notes: "Quality Manual references an outdated calibration procedure (Section 4.2).",
        },
        {
          assessmentId: assessment.id,
          criterionId: criterion2.id,
          status: "CONFORMS",
          notes: "Internal audit log shows quarterly audits as scheduled.",
        },
      ],
    });
  }

  console.log("Seeding accreditation + verification record...");
  let accreditationRecord = await prisma.accreditationRecord.findUnique({ where: { accreditationNumber: "MAB-2026-00417" } });
  if (!accreditationRecord) {
    // This demo record represents an already-accredited org (not app-1, which is
    // deliberately still mid-lifecycle) — a second, separate originating application.
    const priorApp = await prisma.application.create({
      data: {
        referenceNumber: "MAB-APP-2025-0043",
        organisationId: organisation.id,
        applicantUserId: applicantUser.id,
        programId: getProgram("testing-calibration-laboratories").id,
        stage: "ACCREDITED",
        submittedAt: new Date("2025-11-01"),
      },
    });
    accreditationRecord = await prisma.accreditationRecord.create({
      data: {
        accreditationNumber: "MAB-2026-00417",
        organisationId: organisation.id,
        programId: getProgram("testing-calibration-laboratories").id,
        originatingApplicationId: priorApp.id,
        status: "ACTIVE",
        effectiveDate: new Date("2026-01-14"),
        expiryDate: new Date("2029-01-13"),
        lastSurveillanceDate: new Date("2026-07-02"),
        nextRenewalDate: new Date("2029-01-13"),
      },
    });
    await prisma.verificationRecord.create({
      data: { accreditationRecordId: accreditationRecord.id, isPublished: true, certificateDocumentVisible: true },
    });
  }

  console.log("Seeding invoices...");
  const invoice1 = await prisma.invoice.upsert({
    where: { invoiceNumber: "MAB-INV-2026-0143" },
    update: {},
    create: {
      invoiceNumber: "MAB-INV-2026-0143",
      organisationId: organisation.id,
      applicationId: application.id,
      status: "PAID",
      amount: 2500,
      currency: "USD",
      issuedAt: new Date("2026-03-02"),
      dueAt: new Date("2026-03-16"),
      paidAt: new Date("2026-03-09"),
    },
  });
  const invoice2 = await prisma.invoice.upsert({
    where: { invoiceNumber: "MAB-INV-2026-0311" },
    update: {},
    create: {
      invoiceNumber: "MAB-INV-2026-0311",
      organisationId: organisation.id,
      applicationId: application.id,
      status: "ISSUED",
      amount: 4200,
      currency: "USD",
      issuedAt: new Date("2026-08-15"),
      dueAt: new Date("2026-09-15"),
    },
  });
  // Backfills line items for invoices seeded before InvoiceLineItem existed
  // in this script, as well as creating them fresh on a first run.
  for (const [invoice, description] of [
    [invoice1, "Application fee — Testing & Calibration Laboratories"],
    [invoice2, "Assessment fee — Testing & Calibration Laboratories"],
  ] as const) {
    const hasLineItem = (await prisma.invoiceLineItem.count({ where: { invoiceId: invoice.id } })) > 0;
    if (!hasLineItem) {
      await prisma.invoiceLineItem.create({ data: { invoiceId: invoice.id, description, amount: invoice.amount } });
    }
  }

  console.log("Seeding non-conformities...");
  if ((await prisma.nonConformity.count({ where: { organisationId: organisation.id } })) === 0) {
    await prisma.nonConformity.createMany({
      data: [
        {
          ncNumber: "1/26-133-661",
          organisationId: organisation.id,
          assignmentId: assignment.id,
          category: "MINOR",
          standardReference: "ISO/IEC 17021-1:2015 clause 9.1.2.1(d)",
          status: "CLOSED",
          progressStage: "Closed",
          raisedById: assessorUser.id,
          teamLeadId: assessorUser.id,
          finding: "Internal audit schedule did not cover all management system clauses within the planned 12-month cycle.",
          correctiveAction: "Revised internal audit schedule submitted and verified covering all clauses.",
          raisedAt: new Date("2026-05-20"),
          closedAt: new Date("2026-06-10"),
        },
        {
          ncNumber: "2/26-133-661",
          organisationId: organisation.id,
          assignmentId: assignment.id,
          category: "OBSERVATION",
          standardReference: "ISO/IEC 17021-1:2015 clause 9.4.6",
          status: "OPEN",
          progressStage: "Corrective action under review",
          raisedById: assessorUser.id,
          teamLeadId: assessorUser.id,
          finding: "Records of assessor competence evaluation were not consistently dated.",
          raisedAt: new Date("2026-07-13"),
        },
      ],
    });
  }

  console.log("Seeding AB reference documents...");
  if ((await prisma.referenceDocument.count()) === 0) {
    const refDocs = [
      { description: "Other AB Report Details", filename: "Other_AB_reports_details.xlsx", content: "Demo AB report details template." },
      { description: "Checklist — ISO/IEC 17021-1:2015", filename: "MAB-F-031A_V00_Checklist_for_ISO-IEC_17021-1_2015.docx", content: "Demo checklist content." },
      { description: "Checklist — Testing & Calibration Laboratories", filename: "MAB-F-031A_V00_Checklist_Testing_Calibration_Labs.docx", content: "Demo checklist content." },
    ];
    let sortOrder = 0;
    for (const d of refDocs) {
      const { storageKey, sizeBytes } = await seedDemoFile(`seed-refdoc-${d.filename}`, d.content);
      await prisma.referenceDocument.create({
        data: {
          description: d.description,
          filename: d.filename,
          storageKey,
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          sizeBytes,
          sortOrder: sortOrder++,
        },
      });
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
