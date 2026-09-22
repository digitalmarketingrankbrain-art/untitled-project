export interface PublicationItem {
  id: string;
  code: string;
  title: string;
  category: "documents" | "manuals" | "general" | "impartiality" | "stakeholder" | "notices";
  version: string;
  issueDate: string;
  fileSize: string;
  fileType: "PDF" | "DOCX";
  description: string;
  downloadUrl: string;
}

export const PUBLICATIONS_DATA: PublicationItem[] = [
  // SAAF Documents
  {
    id: "saaf-doc-01",
    code: "SAAF-DOC-101",
    title: "SAAF Accreditation Requirements & Criteria for CABs",
    category: "documents",
    version: "v4.2",
    issueDate: "2026-01-15",
    fileSize: "1.4 MB",
    fileType: "PDF",
    description: "General criteria and compliance standards for Conformity Assessment Bodies (ISO/IEC 17021-1, 17025, 17020).",
    downloadUrl: "#",
  },
  {
    id: "saaf-doc-02",
    code: "SAAF-DOC-102",
    title: "Rules for Use of SAAF Accreditation Symbol and Mark",
    category: "documents",
    version: "v3.0",
    issueDate: "2025-11-10",
    fileSize: "890 KB",
    fileType: "PDF",
    description: "Regulations governing accredited bodies' use of the SAAF emblem, logo formats, and reproduction rules.",
    downloadUrl: "#",
  },
  {
    id: "saaf-doc-03",
    code: "SAAF-DOC-103",
    title: "Fee Schedule & Financial Guidelines for Accreditation Services",
    category: "documents",
    version: "v2026.1",
    issueDate: "2026-02-01",
    fileSize: "620 KB",
    fileType: "PDF",
    description: "Comprehensive fee structure for application, initial assessment, annual surveillance, and scope extensions.",
    downloadUrl: "#",
  },

  // SAAF Manual And Procedures
  {
    id: "saaf-man-01",
    code: "SAAF-SOP-201",
    title: "SAAF Quality System & Operational Assessment Manual",
    category: "manuals",
    version: "v5.1",
    issueDate: "2025-10-01",
    fileSize: "2.8 MB",
    fileType: "PDF",
    description: "Internal quality management manual detailing SAAF assessment lifecycle, auditor competency, and oversight.",
    downloadUrl: "#",
  },
  {
    id: "saaf-man-02",
    code: "SAAF-SOP-202",
    title: "Procedure for Handling Appeals, Complaints & Disputes",
    category: "manuals",
    version: "v3.4",
    issueDate: "2026-01-20",
    fileSize: "1.1 MB",
    fileType: "PDF",
    description: "Step-by-step procedure for registering, investigating, and resolving formal complaints or decision appeals.",
    downloadUrl: "#",
  },
  {
    id: "saaf-man-03",
    code: "SAAF-SOP-203",
    title: "Remote & Hybrid Assessment Protocol",
    category: "manuals",
    version: "v2.0",
    issueDate: "2025-12-05",
    fileSize: "950 KB",
    fileType: "PDF",
    description: "Guidelines and technical requirements for conducting ICT-assisted remote audits and document reviews.",
    downloadUrl: "#",
  },

  // General Information
  {
    id: "saaf-gen-01",
    code: "SAAF-GEN-01",
    title: "General Information & SAAF Institutional Profile",
    category: "general",
    version: "v2026",
    issueDate: "2026-01-01",
    fileSize: "1.8 MB",
    fileType: "PDF",
    description: "Overview of SAAF mission, regional accreditation scope, international recognition alignments, and public policy.",
    downloadUrl: "#",
  },
  {
    id: "saaf-gen-02",
    code: "SAAF-GEN-02",
    title: "Guide to SAAF Public Verification Register & Directory",
    category: "general",
    version: "v1.5",
    issueDate: "2025-09-15",
    fileSize: "740 KB",
    fileType: "PDF",
    description: "User guide on verifying accredited organizations, scope validation, and certificate status checking.",
    downloadUrl: "#",
  },

  // Impartiality Policy
  {
    id: "saaf-imp-01",
    code: "SAAF-POL-301",
    title: "SAAF Statement of Impartiality & Independence Policy",
    category: "impartiality",
    version: "v4.0",
    issueDate: "2026-01-10",
    fileSize: "850 KB",
    fileType: "PDF",
    description: "Official declaration of impartiality, conflict of interest management rules, and independent decision committee mandate.",
    downloadUrl: "#",
  },
  {
    id: "saaf-imp-02",
    code: "SAAF-POL-302",
    title: "Threats to Impartiality Risk Assessment Framework",
    category: "impartiality",
    version: "v2.1",
    issueDate: "2025-11-20",
    fileSize: "920 KB",
    fileType: "PDF",
    description: "Risk assessment methodology for identifying and mitigating commercial, financial, and personal pressures.",
    downloadUrl: "#",
  },

  // Documents For Stakeholder's Comments
  {
    id: "saaf-stk-01",
    code: "DRAFT-SAAF-2026-01",
    title: "Draft Criteria for Artificial Intelligence & Cybersecurity Testing Labs (ISO/IEC 17025 Annex)",
    category: "stakeholder",
    version: "Draft v1.0",
    issueDate: "2026-03-01",
    fileSize: "1.2 MB",
    fileType: "PDF",
    description: "Open for public stakeholder comments until April 30, 2026. Submit feedback via official portal feedback form.",
    downloadUrl: "#",
  },
  {
    id: "saaf-stk-02",
    code: "DRAFT-SAAF-2026-02",
    title: "Proposed Revision to Assessor Competency Rules (SAAF-DOC-104)",
    category: "stakeholder",
    version: "Draft v2.0",
    issueDate: "2026-03-10",
    fileSize: "980 KB",
    fileType: "PDF",
    description: "Proposed updates to lead assessor qualification standards. Stakeholders invited to review and submit comments.",
    downloadUrl: "#",
  },

  // Notice Of Change(s)
  {
    id: "saaf-not-01",
    code: "NOC-2026-01",
    title: "Notice of Change: Transition Timeline for ISO/IEC 17043:2023 Revision",
    category: "notices",
    version: "Notice #1",
    issueDate: "2026-02-15",
    fileSize: "540 KB",
    fileType: "PDF",
    description: "Mandatory transition roadmap and deadlines for Proficiency Testing Providers upgrading to ISO/IEC 17043:2023.",
    downloadUrl: "#",
  },
  {
    id: "saaf-not-02",
    code: "NOC-2026-02",
    title: "Notice of Change: Updated Portal Security & Verification Certificate QR Standard",
    category: "notices",
    version: "Notice #2",
    issueDate: "2026-03-01",
    fileSize: "480 KB",
    fileType: "PDF",
    description: "Updated digital signature and cryptographic QR verification protocols for all newly issued SAAF accreditation certificates.",
    downloadUrl: "#",
  },
];
