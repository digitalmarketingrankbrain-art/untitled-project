# Phase 14 — Testing

Builds on Phase 13 (Milestones 1-14, 16, 17 approved; Milestone 15 Payments deferred — no Stripe credentials). This phase consolidates the testing already performed incrementally throughout Phase 13 and adds the checks that only make sense once the whole app exists: SEO artifacts, a dependency security review, and a cross-cutting accessibility pass.

**What this phase is not:** a from-scratch QA pass done in isolation. Every Phase 13 milestone was functionally tested at the HTTP level as it was built (see `phase-13-development-log.md` and the Milestone Tracker in `PROGRESS.md` for the specifics — login/RBAC/MFA flows, all public routes, all three portal subtrees, document upload/download, notifications, audit logging, rate limiting). This phase's job is to fill the gaps that only show up when you look at the site as a whole.

---

## 1. Functional testing — consolidated

Already covered per-milestone (not repeated here in full):
- Public site: all 26+ public routes render, including 2 deliberate 404 cases.
- Verification (`/verify`, `/verify/[reference]`): all 4 statuses, Not Found, redirect, ambiguous-name search.
- Auth: login (correct/incorrect credentials), registration, password reset, MFA enrollment + login, logout, RBAC subtree gating, rate limiting on every credential-guessing surface.
- Applicant/Assessor/Admin portals: all routes 200 after auth, RBAC-scoped data (an assessor only ever sees their own assignments; an applicant only their own organisation).
- Document upload/download: real file → disk → DB → authenticated download route, 401 unauthenticated, 200 for owner/assigned assessor.
- Notifications: real Postgres rows drive the in-app bell; 3 real trigger points wired.
- Audit log: real Postgres `audit_logs` table, append-only guarantee re-verified via a denied UPDATE/DELETE through the restricted `app_user` connection.

**New in this phase:** confirmed the production build (`next build && next start`) serves correctly with no dev-only artifacts leaking (this was specifically re-checked after the Milestone 17 security-header changes — see Section 4).

## 2. Responsive design

Tailwind's responsive utilities are used throughout per Phase 4's breakpoint spec (mobile-first, tablet 768-1199px, desktop 1200px+); the header/footer/nav mobile collapse and portal sidebar icon-collapse were built and spot-checked during Milestones 3 and 8-10. No real device lab or browser automation is available in this environment, so full cross-device/cross-browser visual regression testing has **not** been performed — flagged as a pre-launch gap in Phase 15.

## 3. Accessibility

Structural accessibility was a first-class Phase 4 design rule, not bolted on:
- Status is never colour-only (icon + colour + text label on every status badge, verified in the design system).
- Every form field uses `FormField` with an explicit associated `<label>` (`htmlFor`/`id` pair), never placeholder-as-label.
- Focus rings are a visible 2px outline, not just a colour change (Phase 4 §Forms).
- Icon-only interactive elements checked for `aria-label` (e.g. the notification bell button) — no unlabelled icon-only buttons found in a codebase-wide grep.
- The one raster image in the app (the MFA enrollment QR code) has descriptive `alt` text; no other `<img>`/`<Image>` usage exists to audit.

**Not performed in this environment** (no browser/screen-reader tooling available): a live screen-reader pass (NVDA/VoiceOver), a full keyboard-only navigation walkthrough, and an automated Lighthouse/axe accessibility score. Flagged for Phase 15's pre-launch checklist.

## 4. Security review

- **Rate limiting** (Milestone 17): every credential-guessing surface covered — login (both the real `authorize()` gate and the client pre-check), registration, password reset, MFA code confirmation, own-password change.
- **Security headers** (Milestone 17): CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS — verified present on a live production response, and confirmed the production CSP carries no `unsafe-eval` (dev-only relaxation for Next's HMR).
- **RBAC**: re-confirmed throughout Phase 13 that each role is confined to its own portal subtree and its own data (not just its own routes).
- **Audit trail**: append-only at the database grant level (not just application discipline), re-verified this phase by attempting a real denied UPDATE/DELETE through the restricted `app_user` connection.
- **Least privilege**: the `app_user` Postgres role has no schema-alter rights and only SELECT/INSERT (no UPDATE/DELETE) on `audit_logs`.
- **Secrets**: `.env`/`.env.local` both gitignored; no secrets found in any committed file (spot-checked via `git log` diffs at each commit).
- **`npm audit`** (production dependencies): 5 known advisories (1 moderate, 4 high), all inside build-time tooling dependencies — `next`'s bundled internal `postcss` (fixed only by a Next 16 major upgrade, not yet evaluated against this project) and `prisma`'s CLI `@prisma/config`/`deepmerge-ts` chain (fixed only by downgrading Prisma). Neither is reachable from the deployed app's runtime surface — both are build/tooling-time only. First flagged in Milestone 1, re-reviewed here, and **accepted as a known risk rather than force-upgraded mid-build**: a breaking major-version bump this late needs its own dedicated regression pass, not a drive-by fix during hardening. Documented in the Open Questions Log for a deliberate follow-up.

## 5. Performance

No real device/network throttling or Lighthouse run is available in this environment. What is known from the production build output:
- First Load JS shared by all routes: **103 kB** (reasonable for a Next.js App Router site with no heavy client bundles).
- Public content pages (resources/news/training) are statically prerendered (`○`/`●` in the build output) — served from the edge/CDN with no per-request server work.
- Portal routes are necessarily dynamic (`ƒ`, session-dependent), which is correct, not a regression.
- Images: only one raster image in the entire app (a `data:` URI QR code, `unoptimized` by necessity) — no image-optimization surface to tune yet, since Phase 5/6 content uses no photography (placeholder text content only, per the project's no-fabricated-content rule).

## 6. SEO

Found and fixed real gaps this phase (the site had per-page `<title>`/`description` metadata since Milestone 5, but was missing the infrastructure around it):
- **`src/app/robots.ts`** — added; allows public content, disallows `/portal` and `/api`.
- **`src/app/sitemap.ts`** — added; lists every static public route plus the dynamic program/resource/news/training slugs pulled from their real data sources (not hand-maintained, so it can't drift out of sync). Deliberately excludes auth pages (not content) and `/verify/[reference]` (a per-record dynamic lookup, not a static content set to enumerate).
- **`metadataBase`** — added to the root layout, required for `next/og`-style absolute URL resolution and for the sitemap/robots helpers above.
- **`src/app/icon.tsx`** — added a generated favicon (navy `#13233E` background, warm `#F7F5F1` "M" monogram, matching the header's existing placeholder brand mark) — there was no favicon at all before this. This is a technical/cosmetic placeholder consistent with the project's already-placeholder brand name, not a fabricated institutional claim.
- `NEXT_PUBLIC_SITE_URL` is a new required environment variable for launch — currently defaults to an explicit `PLACEHOLDER-REQUIRES-PRODUCTION-DOMAIN` value (see `src/lib/site-url.ts`) since no real production domain has been assigned yet (Phase 4: working project name only). **Must be set before launch** or the sitemap/canonical URLs will point at the placeholder domain — flagged in Phase 15.

---

## Summary

| Area | Status |
|---|---|
| Functional | Covered per-milestone throughout Phase 13; production build re-verified this phase |
| Responsive | Built per Phase 4 spec; no device-lab/visual-regression pass available in this environment |
| Accessibility | Strong structural foundation (verified via code review); no live screen-reader/Lighthouse pass available in this environment |
| Security | Rate limiting + headers + RBAC + append-only audit trail all verified for real; one known, accepted `npm audit` finding in build tooling |
| Performance | Reasonable bundle size and static-generation coverage; no Lighthouse/device data available |
| SEO | robots.txt, sitemap.xml, metadataBase, and a favicon added this phase; `NEXT_PUBLIC_SITE_URL` needs a real value before launch |

**Carried into Phase 15 (Final Polish & Launch):** device-lab/visual regression testing, a live accessibility audit (screen reader + Lighthouse), the `npm audit` build-tooling advisories, and setting `NEXT_PUBLIC_SITE_URL` to the real production domain.
