/**
 * Real production domain isn't assigned yet (Phase 4: working project name
 * only, final brand/domain TBD). NEXT_PUBLIC_SITE_URL must be set to the
 * real domain before launch — sitemap.xml and metadataBase both depend on
 * this being correct for canonical URLs / social previews to work.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://PLACEHOLDER-REQUIRES-PRODUCTION-DOMAIN.example";
