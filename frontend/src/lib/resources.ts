export interface Resource {
  slug: string;
  title: string;
  type: "POLICY" | "PROCEDURE" | "FORM";
  version: string;
  effectiveDate: string;
  description: string;
}

/**
 * Every resource carries a version + effective date, per Phase 6's trust
 * rule — undated policy PDFs are a common credibility gap this structurally
 * prevents. Placeholder content; Milestone 11+ replaces this with the
 * admin-published Resource table from Phase 12.
 */
export const RESOURCES: Resource[] = [
  {
    slug: "impartiality-policy",
    title: "Impartiality Policy",
    type: "POLICY",
    version: "v3.1",
    effectiveDate: "2026-08-01",
    description: "Conflict-of-interest disclosure and recusal requirements for assessors and decision-makers.",
  },
  {
    slug: "complaints-and-appeals-policy",
    title: "Complaints & Appeals Policy",
    type: "POLICY",
    version: "v2.0",
    effectiveDate: "2026-03-14",
    description: "How complaints and appeals are received, reviewed, and resolved.",
  },
  {
    slug: "assessment-procedure",
    title: "Assessment Procedure",
    type: "PROCEDURE",
    version: "v4.2",
    effectiveDate: "2026-01-10",
    description: "Step-by-step procedure assessors follow when conducting an assessment.",
  },
  {
    slug: "surveillance-and-renewal-procedure",
    title: "Surveillance & Renewal Procedure",
    type: "PROCEDURE",
    version: "v1.4",
    effectiveDate: "2025-11-22",
    description: "How ongoing surveillance and renewal assessments are scheduled and conducted.",
  },
  {
    slug: "application-form",
    title: "Application Form",
    type: "FORM",
    version: "v2.3",
    effectiveDate: "2026-02-01",
    description: "The primary application form for all accreditation programs.",
  },
  {
    slug: "scope-of-accreditation-request",
    title: "Scope of Accreditation Request Form",
    type: "FORM",
    version: "v1.1",
    effectiveDate: "2025-09-18",
    description: "Used to request a change to an existing accreditation's scope.",
  },
];
