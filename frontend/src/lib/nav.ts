export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavGroup {
  label: string;
  href?: string;
  links: NavLink[];
}

/** Header Top Bar Links (UASL Style) */
export const TOP_BAR_LINKS: NavLink[] = [
  { label: "Search", href: "/certifiedorganization" },
  { label: "Careers", href: "/careers" },
  { label: "Get in touch", href: "/get-in-touch" },
];

/** Primary header nav for UASL - United Assessment Services Limited */
export const HEADER_NAV: NavGroup[] = [
  {
    label: "About",
    href: "/about",
    links: [
      {
        label: "Information Center",
        href: "/information-center",
        description: "Official bulletins, policy announcements, and public disclosures.",
      },
      {
        label: "Use of Logo",
        href: "/use-of-logo",
        description: "Guidelines and regulations for displaying the UASL accreditation mark.",
      },
      {
        label: "Feedback",
        href: "/feedback",
        description: "Submit feedback, general inquiries, or service evaluation.",
      },
      {
        label: "Members",
        href: "/members",
        description: "Board members, technical committees, and evaluation panels.",
      },
      {
        label: "Recognitions",
        href: "/recognition",
        description: "International acceptance, equivalence, and global frameworks.",
      },
    ],
  },
  {
    label: "Accreditation",
    href: "/accreditation",
    links: [
      {
        label: "What is Accreditation",
        href: "/what-is-accreditation",
        description: "Understanding independent third-party assessment and trust.",
      },
      {
        label: "How to Become Accredited?",
        href: "/how-to-become-accreditated",
        description: "Step-by-step process for CAB accreditation application.",
      },
      {
        label: "Benefits of Accreditation",
        href: "/benefits-of-accreditation",
        description: "Why global accreditation enhances credibility and market access.",
      },
      {
        label: "Management System Certification",
        href: "/management-system-certification",
        description: "Assessment schemes for ISO 9001, 14001, 27001, 45001 & 22000.",
      },
      {
        label: "Product Certification",
        href: "/product-certification",
        description: "Conformity schemes for products, processes, and services.",
      },
      {
        label: "Personal Certification",
        href: "/personal-certification",
        description: "Competence evaluation for auditors and technical personnel.",
      },
      {
        label: "Inspection",
        href: "/inspection",
        description: "Accreditation for inspection bodies and engineering survey organizations.",
      },
      {
        label: "Rating",
        href: "/rating",
        description: "Institutional rating frameworks and performance evaluation.",
      },
      {
        label: "Fee Structure",
        href: "/fee-structure",
        description: "Transparent fee schedule for application, assessment, and surveillance.",
      },
      {
        label: "Accredited Body",
        href: "/accredited-body",
        description: "Public register of all UASL accredited Conformity Assessment Bodies.",
      },
    ],
  },
];

export const HEADER_SIMPLE_LINKS: NavLink[] = [
  { label: "Certified Organization", href: "/certifiedorganization" },
  { label: "Careers", href: "/careers" },
  { label: "Get in touch", href: "/get-in-touch" },
];

export const FOOTER_GROUPS: NavGroup[] = [
  {
    label: "About",
    links: [
      { label: "Information Center", href: "/information-center" },
      { label: "Use of Logo", href: "/use-of-logo" },
      { label: "Feedback", href: "/feedback" },
      { label: "Members", href: "/members" },
      { label: "Recognitions", href: "/recognition" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    label: "Accreditation",
    links: [
      { label: "What is Accreditation", href: "/what-is-accreditation" },
      { label: "How to become accredited", href: "/how-to-become-accreditated" },
      { label: "Benefits of accreditation", href: "/benefits-of-accreditation" },
      { label: "Management System Certification", href: "/management-system-certification" },
      { label: "Product Certification", href: "/product-certification" },
      { label: "Personal Certification", href: "/personal-certification" },
      { label: "Inspection", href: "/inspection" },
      { label: "Rating", href: "/rating" },
      { label: "Fees & Structure", href: "/fee-structure" },
      { label: "Accredited Body", href: "/accredited-body" },
    ],
  },
  {
    label: "Verification & Portals",
    links: [
      { label: "Certified Organization Search", href: "/certifiedorganization" },
      { label: "Accredited Bodies Register", href: "/accredited-body" },
      { label: "CAB Portal Login", href: "/portal" },
      { label: "Assessor Portal", href: "/assessor" },
      { label: "Admin Portal", href: "/admin" },
    ],
  },
  {
    label: "Legal & Policies",
    links: [
      { label: "Terms of Usage", href: "/legal/terms-of-use" },
      { label: "Cookie Policy", href: "/legal/cookie-policy" },
      { label: "Privacy Policy", href: "/legal/privacy-policy" },
      { label: "Disclaimer", href: "/legal/disclaimer" },
    ],
  },
];
