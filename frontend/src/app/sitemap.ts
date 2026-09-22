import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";
import { PROGRAMS } from "@/lib/programs";
import { RESOURCES } from "@/lib/resources";
import { TRAINING_COURSES } from "@/lib/training";


const STATIC_ROUTES = [
  "/",
  "/about/who-we-are",
  "/about/accreditation",
  "/about/international-recognition",
  "/about/governance",
  "/about/impartiality-and-ethics",
  "/accreditation",
  "/accreditation/how-it-works",
  "/accreditation/programs",
  "/accreditation/fees",
  "/apply",
  "/directory/accredited-cabs",
  "/directory/certified-organizations",
  "/directory/false-claims",
  "/publications",
  "/publications/documents",
  "/publications/manual-and-procedures",
  "/publications/general-information",
  "/publications/impartiality-policy",
  "/publications/stakeholder-comments",
  "/publications/notice-of-changes",
  "/resources",
  "/resources/policies",
  "/resources/procedures",
  "/resources/forms",
  "/training",
  "/faqs",
  "/contact",
  "/complaints-and-appeals",
  "/report-fraud",
  "/legal/terms-of-use",
  "/legal/privacy-policy",
  "/legal/accessibility-statement",
];

/**
 * Excludes auth pages (login/register — not content) and /verify/[reference]
 * (dynamic per-record lookups, not a static content set to enumerate here).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
  }));

  const programEntries: MetadataRoute.Sitemap = PROGRAMS.map((p) => ({
    url: `${SITE_URL}/accreditation/programs/${p.slug}`,
  }));
  const resourceEntries: MetadataRoute.Sitemap = RESOURCES.map((r) => ({
    url: `${SITE_URL}/resources/${r.slug}`,
  }));
  const trainingEntries: MetadataRoute.Sitemap = TRAINING_COURSES.map((c) => ({
    url: `${SITE_URL}/training/${c.slug}`,
  }));

  return [...staticEntries, ...programEntries, ...resourceEntries, ...trainingEntries];
}
