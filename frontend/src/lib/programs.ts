export interface Program {
  slug: string;
  name: string;
  scopeDescription: string;
  standardReference: string;
  details?: {
    overview: string;
    fullDescription?: string;
    subHeading?: string;
    inspectionScopes?: string[];
    subCards?: Array<{ title: string; desc: string; href: string }>;
    eligibility: string[];
    criteria: string[];
    fees: string;
  };
}

export const PROGRAMS: Program[] = [
  {
    slug: "management-systems",
    name: "Management Systems Certification Bodies",
    scopeDescription:
      "Accreditation for bodies certifying quality (ISO 9001), environmental (ISO 14001), occupational health & safety (ISO 45001), information security (ISO 27001), food safety (ISO 22000), and other management systems.",
    standardReference: "ISO/IEC 17021-1",
    details: {
      overview: "SAAF provides accreditation to Management System Certification Bodies operating under ISO/IEC 17021-1. This ensures that certification bodies carry out audits with technical competence, impartiality, and consistency across South Asia.",
      eligibility: [
        "Registered legal entity with documented operational structure",
        "Demonstrated technical competence and qualified lead auditors",
        "Established quality management system complying with ISO/IEC 17021-1",
        "Declaration of impartiality and independence",
      ],
      criteria: [
        "ISO/IEC 17021-1:2015 General Requirements for bodies providing audit and certification of management systems",
        "ISO/IEC 17021-2, 17021-3, 17021-10 scheme-specific competency standards",
        "SAAF General Accreditation Criteria (SAAF-DOC-101)",
        "IAF Mandatory Documents (IAF MD series)",
      ],
      fees: "Application Fee: USD $5,000 for initial scheme ($2,000 per additional scheme). Assessment fee: USD $1,500 per assessor man-day.",
    },
  },
  {
    slug: "inspection-bodies",
    name: "Accreditation For Inspection Bodies",
    scopeDescription:
      "According to ISO, an inspection is: An examination of a product, process, service, or installation or their design and determination of its conformity with specific requirements or, on the basis of professional judgment, with general requirements (ISO/IEC 17000 definition).",
    standardReference: "ISO/IEC 17020",
    details: {
      overview: "According to ISO, an inspection is: An examination of a product, process, service, or installation or their design and determination of its conformity with specific requirements or, on the basis of professional judgment, with general requirements (ISO/IEC 17000 definition). Inspection bodies are engaged to carry out these inspections on behalf of private clients, their parent organizations, or authorities, including regulatory authorities.",
      fullDescription: "The objective of inspection is to provide the client with information regarding the conformity of the inspected items with specifications, which may be contained in regulations, standards, inspection schemes or contracts. Inspection can be used by clients to measure the compliance of products or systems with quality, safety, and fitness for purpose requirements.\n\nAccreditation makes easier acceptance of products or services easier. Accreditation increases assurance to consumers that product or services confirms to applicable specifications.",
      subHeading: "Inspection body accreditation (ISO/IEC 17020)",
      inspectionScopes: [
        "Engineering Inspection (Pressure Systems, lifting equipment/Hoists, electrical installations, power presses, local exhaust ventilation, cargo / pre-shipment inspection, manufacture of boilers/pressure vessels, welding inspections, oil and gas metering)",
        "Building and Construction Products",
        "Food Inspection (food safety, food hygiene, manufacturing and processed practices, cargo inspection, animal welfare, labeling)",
        "Asbestos Surveys & Legionella Risk Assessments",
        "Health and Social Care & Care Home Inspection",
        "Nuclear New Build Inspection & Fire Protection Systems",
        "Crime Scene Examination & Railway Competence",
        "Plant Health & Environmental Technology Verification",
      ],
      eligibility: [
        "Meet the requirements of ISO/IEC 17020 — Conformity assessment – Requirements for the operation of various types of bodies performing an inspection",
        "Independence & Type A/B/C classification compliance",
        "Qualified inspectors with domain expertise",
      ],
      criteria: [
        "ISO/IEC 17020:2012 Requirements for bodies performing inspection",
        "ILAC P15 Policy for Accreditation of Inspection Bodies",
      ],
      fees: "Application Fee: USD $5,000. Assessment fee: USD $1,500 per assessor man-day.",
    },
  },
  {
    slug: "personnel-certification",
    name: "Accreditation For Personnel Certification Bodies",
    scopeDescription:
      "The South Asia Accreditation Foundation offers an internationally recognized accreditation program for the certification of persons as per ISO/IEC 17024.",
    standardReference: "ISO/IEC 17024",
    details: {
      overview: "The South Asia Accreditation Foundation offers an internationally recognized accreditation program for the certification of persons. Accreditation scheme for the CAB has been developed as per the requirements of ISO/IEC 17024 standard to establish an internationally accepted benchmark for organizations assessing and evaluating the competence of personnel.",
      eligibility: [
        "Legal entity operating as a certification body for persons",
        "Defined examination scheme and fair competency evaluation methodology",
        "Impartial scheme committee oversight",
      ],
      criteria: [
        "ISO/IEC 17024:2012 General requirements for bodies operating certification of persons",
        "SAAF Criteria for Personnel Certification Bodies",
      ],
      fees: "Application Fee: USD $5,000. Assessment fee: USD $1,500 per assessor man-day.",
    },
  },
  {
    slug: "laboratories",
    name: "Accreditation For Testing Laboratories",
    scopeDescription:
      "South Asia Accreditation Foundation SAAF Accreditation scheme for Testing laboratories is strictly built as per ISO 17025.",
    standardReference: "ISO/IEC 17025",
    details: {
      overview: "South Asia Accreditation Foundation SAAF Accreditation scheme for Testing laboratories is strictly built as per ISO 17025.",
      fullDescription: "ISO 17025 specifies requirements for the general requirements for the competence to carry out tests and/or calibrations, including sampling. It covers testing and calibration performed using standard methods, non-standard methods, and laboratory-developed. ISO/IEC 17025 is applicable to all laboratories regardless of the number of personnel or the extent of the scope of testing and/or calibration activities.",
      eligibility: [
        "Laboratory technical competence and qualified testing analysts",
        "Traceable equipment calibration to NIST/BIPM standards",
        "Participation in recognized Proficiency Testing (PT) / ILC schemes",
      ],
      criteria: [
        "ISO/IEC 17025:2017 General requirements for competence of testing and calibration laboratories",
        "ILAC P9 & P10 Traceability & PT Policies",
      ],
      fees: "Application Fee: USD $5,000. Assessment fee: USD $1,500 per assessor man-day.",
    },
  },
  {
    slug: "product-certification",
    name: "Accreditation For Product Certification Bodies",
    scopeDescription:
      "The South Asia Accreditation Foundation (SAAF) provides accreditation for Product Certification Bodies in accordance with ISO/IEC 17065.",
    standardReference: "ISO/IEC 17065",
    details: {
      overview: "The South Asia Accreditation Foundation (SAAF) provides accreditation for Product Certification Bodies in accordance with ISO/IEC 17065 – Conformity Assessment – Requirements for Bodies Certifying Products, Processes and Services.",
      fullDescription: "This accreditation program is intended for certification bodies that perform conformity assessment activities related to products, processes, and services against specified standards, regulatory requirements, or technical specifications.\n\nAccreditation to ISO/IEC 17065 demonstrates that certification bodies operate in a competent, consistent, and impartial manner when performing certification activities. Accredited certification bodies are evaluated to ensure they maintain appropriate procedures, technical competence, and impartiality in the certification process.\n\nSAAF accreditation supports product certification activities across a wide range of sectors, including manufacturing, consumer products, industrial goods, and regulatory certification programs.",
      eligibility: [
        "Product evaluation & factory surveillance expertise",
        "Impartial product certification scheme rules",
      ],
      criteria: [
        "ISO/IEC 17065:2012 Requirements for bodies certifying products, processes and services",
      ],
      fees: "Application Fee: USD $5,000. Assessment fee: USD $1,500 per assessor man-day.",
    },
  },
  {
    slug: "validation-and-verification",
    name: "Accreditation For Validation And Verification Bodies",
    scopeDescription:
      "Accreditation for Validation and Verification Bodies (VVBs) conducting validation and verification activities related to environmental programs and greenhouse gas (GHG) assertions.",
    standardReference: "ISO/IEC 17029 / ISO 14065",
    details: {
      overview: "The South Asia Accreditation Foundation (SAAF) provides accreditation for Validation and Verification Bodies (VVBs) conducting validation and verification activities related to environmental programs and greenhouse gas (GHG) assertions.",
      fullDescription: "This accreditation program is based on the requirements of ISO/IEC 17029 “Conformity Assessment – General Principles and Requirements for Validation and Verification Bodies” and ISO 14065 “General principles and requirements for bodies validating and verifying environmental information”, together with applicable sector-specific standards including the ISO 14064 series.\n\nAccreditation confirms that validation and verification bodies have the necessary technical competence, impartiality, and processes to perform validation and verification activities in accordance with applicable standards and program requirements.",
      subCards: [
        {
          title: "GHG Programme(s)",
          desc: "Accreditation for validation and verification bodies conducting Greenhouse Gas (GHG) validation and verification activities.",
          href: "/apply",
        },
        {
          title: "Organization Verification (ISO 14064-1)",
          desc: "Accreditation for validation and verification bodies performing organizational greenhouse gas verification in accordance with ISO 14064-1.",
          href: "/apply",
        },
        {
          title: "Project Validation and Verification (ISO 14064-2)",
          desc: "Accreditation for validation and verification bodies performing project validation and verification in accordance with ISO 14064-2.",
          href: "/apply",
        },
      ],
      eligibility: [
        "Sector competence in climate & GHG accounting",
        "Compliance with ISO/IEC 17029 and ISO 14065",
      ],
      criteria: [
        "ISO/IEC 17029:2019 Principles & requirements for VVB bodies",
        "ISO 14065:2020 Environmental information verification",
      ],
      fees: "Application Fee: USD $5,000. Assessment fee: USD $1,500 per assessor man-day.",
    },
  },
];
