export interface TrainingCourse {
  slug: string;
  title: string;
  audience: string;
  format: "In-person" | "Online";
  nextDate: string;
  cost: string;
  description: string;
  prerequisites: string;
  whatYouReceive: string;
}

/** Placeholder courses. Milestone 11+ replaces this with admin-managed data. */
export const TRAINING_COURSES: TrainingCourse[] = [
  {
    slug: "assessor-foundation-training",
    title: "Assessor Foundation Training",
    audience: "Prospective and newly onboarded assessors",
    format: "In-person",
    nextDate: "2026-11-03",
    cost: "Contact us for pricing.",
    description:
      "Covers assessment method, evidence-gathering, and impartiality obligations required before taking on assignments.",
    prerequisites: "Relevant technical background in at least one accreditation scope.",
    whatYouReceive:
      "A certificate of completion. This confirms training attendance only — it does not itself confer assessor status; assessor status still requires the standard competence review.",
  },
  {
    slug: "management-systems-standard-training",
    title: "Management Systems Standard Training",
    audience: "Client organisation staff preparing for certification",
    format: "Online",
    nextDate: "2026-10-14",
    cost: "Contact us for pricing.",
    description:
      "Introduces the requirements of management systems certification and common gaps found during assessment.",
    prerequisites: "None.",
    whatYouReceive: "A certificate of attendance.",
  },
];
