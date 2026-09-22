export interface NewsItem {
  slug: string;
  title: string;
  excerpt: string;
  category: "ROUTINE" | "STATUS_CHANGE";
  publishedAt: string;
}

/**
 * Placeholder notices — Milestone 11+ replaces this with real admin-published
 * content. Deliberately includes a STATUS_CHANGE item alongside routine ones:
 * a body that only ever publishes good news reads as curated, not transparent
 * (Phase 3).
 */
export const NEWS_ITEMS: NewsItem[] = [
  {
    slug: "updated-impartiality-policy-published",
    title: "Updated Impartiality Policy published",
    excerpt: "Revised conflict-of-interest disclosure requirements for assessors take effect this quarter.",
    category: "ROUTINE",
    publishedAt: "2026-08-18",
  },
  {
    slug: "accreditation-withdrawn-prairie-inspection",
    title: "Accreditation withdrawn: Prairie Inspection Services (SAAF-2022-00156)",
    excerpt: "Accreditation withdrawn following a non-conformance identified during surveillance assessment.",
    category: "STATUS_CHANGE",
    publishedAt: "2026-07-30",
  },
  {
    slug: "new-training-dates-published",
    title: "New assessor training dates published",
    excerpt: "Registration is now open for the next assessor competence training cohort.",
    category: "ROUTINE",
    publishedAt: "2026-07-05",
  },
];
