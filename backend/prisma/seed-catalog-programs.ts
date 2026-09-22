/**
 * Seeds the Program table to match the frontend's static accreditation
 * catalog (frontend/src/lib/programs.ts) — slugs must match exactly, since
 * createDraftApplication / saveScopeExtensionDraft look up Program by slug.
 * Idempotent (upsert by slug) — safe to re-run.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CATALOG = [
  {
    slug: "management-systems",
    name: "Management Systems Certification Bodies",
    scopeDescription:
      "Accreditation for bodies certifying quality (ISO 9001), environmental (ISO 14001), occupational health & safety (ISO 45001), information security (ISO 27001), food safety (ISO 22000), and other management systems.",
    standardReference: "ISO/IEC 17021-1",
  },
  {
    slug: "inspection-bodies",
    name: "Accreditation For Inspection Bodies",
    scopeDescription:
      "Examination of a product, process, service, or installation and determination of its conformity with specific requirements.",
    standardReference: "ISO/IEC 17020",
  },
  {
    slug: "personnel-certification",
    name: "Accreditation For Personnel Certification Bodies",
    scopeDescription: "Internationally recognized accreditation program for the certification of persons as per ISO/IEC 17024.",
    standardReference: "ISO/IEC 17024",
  },
  {
    slug: "laboratories",
    name: "Accreditation For Testing Laboratories",
    scopeDescription: "SAAF Accreditation scheme for Testing laboratories, built as per ISO 17025.",
    standardReference: "ISO/IEC 17025",
  },
  {
    slug: "product-certification",
    name: "Accreditation For Product Certification Bodies",
    scopeDescription: "Accreditation for Product Certification Bodies in accordance with ISO/IEC 17065.",
    standardReference: "ISO/IEC 17065",
  },
  {
    slug: "validation-and-verification",
    name: "Accreditation For Validation And Verification Bodies",
    scopeDescription:
      "Accreditation for Validation and Verification Bodies (VVBs) conducting validation and verification activities related to environmental programs and greenhouse gas (GHG) assertions.",
    standardReference: "ISO/IEC 17029 / ISO 14065",
  },
];

async function main() {
  for (const p of CATALOG) {
    const program = await prisma.program.upsert({
      where: { slug: p.slug },
      update: { name: p.name, scopeDescription: p.scopeDescription, standardReference: p.standardReference },
      create: { ...p, feeAmount: 5000, currency: "USD" },
    });
    console.log(`OK ${program.slug} -> ${program.id}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
