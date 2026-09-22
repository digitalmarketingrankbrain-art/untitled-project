# Handover — Accreditation Platform Project

Read this file first in any new session before doing anything else on this project. It exists so work can be picked up cold — by a future session, a different agent, or a teammate — without re-deriving context.

## What this project is

A premium, original, international accreditation organisation website and digital platform (public site + public verification system + secure applicant/assessor/admin portal). Built as an **original design and content system**, using an existing accreditation body's site as **functional/structural inspiration only**:

Reference: https://www.uafaccreditation.org/

**Not to be cloned:** visual design, branding, logo, exact wording, source code, proprietary assets, exact layouts.

## Ground rules (do not violate these)

1. **Phased approval process.** The project is built in 15 sequential phases (see `PROGRESS.md` for the full list and current status). Each phase must be: analyzed → drafted → shown to the user → explained → checked for assumptions/open questions → stopped → explicitly approved before the next phase starts. Never batch phases. Never silently proceed. Accepted approval phrases: "Approved", "Approve", "Yes", "Proceed", "Approved with changes". If changes are requested, revise only the current phase.
2. **No fabricated institutional facts.** Never invent or imply: government approval/recognition, international recognition, ILAC/IAF/APAC/other signatory status, ISO certification of the org itself, legal authority, membership counts, years of operation, number of accredited clients, or similar credibility claims — unless the user has explicitly provided/confirmed them. Missing facts are marked `[PLACEHOLDER — REQUIRES CONFIRMATION]` rather than guessed.
3. **Trustworthy-institution tone, not startup/SaaS tone.** Avoid hype, generic AI-website aesthetics, template feel, or over-designed startup polish. Target feeling: serious, independent, competent, transparent, international accreditation institution.
4. **Verification trust rules.** Public verification must never show a bare "Verified". Use explicit statuses (ACTIVE / SUSPENDED / WITHDRAWN / EXPIRED / NOT FOUND) with plain-language explanations. A "not found" result must never visually resemble a valid result.
5. **Security defaults.** Least privilege, RBAC, MFA for privileged accounts, private document storage with signed temporary URLs, audit logging, rate limiting, no cross-tenant data access (applicant-to-applicant, assessor-to-unassigned-record), no admin impersonation without strong controls + audit trail.
6. **Microcopy standard.** Errors/empty states must explain what happened → what it means → what to do next. No generic "Something went wrong."
7. **Component reuse.** Design and build with a shared component system (Header, Footer, Button, Card, StatusBadge, SearchBox, DataTable, DocumentCard, ApplicationTimeline, FileUploader, FormField, Alert, Modal, Breadcrumbs, Pagination, EmptyState, ErrorState), not one-off duplicated UI.
8. **No production code before UX/architecture approval.** Coding (Phase 13) only starts after Phases 1–12 are all approved.

## Where things live

- `PROGRESS.md` — phase-by-phase status tracker, open questions log, session log. **Update this at the end of every work session.**
- `docs/phases/phase-N-*.md` — the full deliverable document for each phase, saved as it's produced (mirrors what was shown in-chat).
- (Later phases) `docs/design-system/`, `src/`, etc. will be added once Phase 4 and Phase 13 begin — not created yet.

## Current state (as of 2026-09-18) — read this section first, it supersedes stale details below

**Architecture changed since the section below was written**: the app split into `frontend/` (Next.js, deployed on Vercel, holds no `DATABASE_URL`) and `backend/` (Express + Prisma, the only process touching Postgres/the filesystem), joined by an internal RPC bridge (`backend/src/rpc.ts` / `frontend/src/lib/rpc-client.ts` — every `backend/src/data/*.ts` module is mirrored by a thin same-named proxy under `frontend/src/lib/portal/`, imported unchanged by existing pages/Server Actions). Auth is now **email one-time-code**, not password+TOTP — no MFA-setup step exists anymore. Dev ports are **frontend 4000, backend 4001** (run both together from the repo root: `npm run dev`), not port 5000 — ignore the port-5000/MFA paragraphs a few lines down, they describe the pre-split app.

**2026-09-18 session — built the full end-to-end accreditation workflow** the user's original 20-section spec asked for (ABCD/AB-ZXY terminology in that spec maps to `Role.APPLICANT`/`ADMIN` — not renamed in code). On top of the existing Application → Documents → Assignment → Decision pipeline, added:
- **Assessor Team Proposal** (`AssessorTeamProposal`/`AssessorTeamMember`): CB proposes a team, AB reviews/approves — approving links each member to a real `Assessor` and creates an `Assignment`. This also **fixed a real P0 bug**: the admin's old single-assessor "assign" action only ever set `Application.assessorUserId` and never created the `Assignment` row the whole assessor workspace depends on (only `seed.ts` ever called `assignment.create` before this).
- **Assessment Notification + Acknowledgement**: versioned notifications (`AssessmentNotification`) with an **immutable** digital-signature record (`AssessmentAcknowledgement` — DB-grant append-only like `audit_logs`, see `grants.sql`).
- **NC lifecycle**: `NcStatus` went from OPEN/CLOSED-only to a real OPEN→RESPONSE_SUBMITTED→UNDER_REVIEW→ACCEPTED→CLOSED flow (REJECTED loops back), with an append-only `NcResponseEntry` thread (Root Cause/Correction/Corrective Action/Assessor Remark) modeled directly on the user-attached UAF-F-045 NCR form, including a `locked` flag matching that form's "further changes are disabled" behavior. `raiseNonConformityFromFinding()` closes the previously-missing link between a `NON_CONFORMANCE` checklist finding and an actual NC record.
- **Assessment report content + finalize lifecycle**: `Assessment` previously had no report content field at all, just two timestamps — added summary/recommendation fields + DRAFT/SUBMITTED/UNDER_REVIEW/FINALIZED status; the CB only sees report content once FINALIZED.
- **AdminPermission actually enforced**: this enum/grant table existed since Milestone 11 but nothing ever checked it — any ADMIN could record a final decision. Now `requireDecisionMaker()` (FULL_ADMIN or new DECISION_MAKER) gates the final decision and certificate issuance; the decision itself is also blocked while any NC is open or any submitted report isn't finalized.
- **Real AccreditationRecord + AccreditationCertificate**: an ACCREDIT decision now creates a real `AccreditationRecord` (previously the model existed but **nothing ever created a row** — the public `/verify` page and admin accreditation-records list run entirely on the separate, already-documented in-memory `verification-records.ts` store, which this work does not touch/migrate). Certificates are real generated PDFs (`pdfkit`), versioned with reissue/supersede history, downloadable via a new session-authenticated route.
- **Required Forms admin CRUD**: `RequiredDocumentType` was seed-only with zero admin UI before; now has a full admin page (deadline days, applicable stage, active/inactive).
- **Document review actions**: admin could previously only view `DocumentVersion.reviewStatus`, never change it — added approve/request-changes.
- New admin pages: Assessor Teams, Assessments (send notification, review/finalize report), Non-Conformities, Required Forms, plus a permissions panel on Users.

**Verified for real**, not just typechecked: full production builds (`next build` — all 79+ routes; backend `tsc`) both clean; a standalone end-to-end script (project's established Server-Action-testing pattern) ran the entire new flow against the live dev Postgres DB — proposal→submit→approve→notify→sign→finding→raise-NC→report-submit→decision-correctly-blocked→NC-respond→accept/lock→close→finalize→decision-succeeds→AccreditationRecord-created→certificate-issued-with-real-PDF-on-disk→reissue-revokes-original — then cleaned up afterward; real HTTP OTP-login sessions for all three roles (admin/applicant/assessor) hit every new page and returned 200 with real rendered content. Not verified: actual client-side tab-switching interactivity in a real browser (no browser-automation tool in this environment, same long-standing gap this project has always flagged — confirmed via the RSC payload that the new tab content is genuinely present in the component tree, just not part of the initially-active tab's server-rendered HTML).

**Also found and left as pre-existing, out-of-scope gaps** (flagged, not fixed, since fixing them wasn't part of this session's ask): the local dev DB's connection role (`saaf_user`) is an actual Postgres superuser rather than the restricted `app_user` `grants.sql` describes, so the new append-only grant on `assessment_acknowledgements` isn't locally enforced (same pre-existing gap as `audit_logs`); the CB accreditation page's main status card still reads the legacy in-memory verification-record store, now sitting alongside a real "Issued Certificates" section that reads the new Postgres-backed data — reconciling the two remains the same larger migration this project has flagged since Milestone 12.

## Current state (as of 2026-09-10) — historical, pre-frontend/backend-split; port/auth details below are outdated, see above

**Beyond the original 15-phase plan:** the Applicant Portal (`/portal/applicant/*`) was extended into a fuller "CB Dashboard" (2026-09-10) — CAB Info (basic details, locations, searchable Applied/Approved countries, team members), Non-Conformities, an Assessments view, org-level Documents (+ AB reference documents), and a richer Certification Status dashboard section, all real-Postgres-backed. `Role.APPLICANT` and the route paths didn't change — "CB" is UI terminology on the same entity, not a new role. See `PROGRESS.md`'s Session Log (last entry) for the full schema/build/verification detail. Not yet built: the Scope Extension application wizard (schema fields exist — `Application.applicationType`/`additionalScopeSlugs`/`draftData` — no UI yet), Team Members invite flow (list is read-only), and any AB-side review of CB Info edits.

**All 15 phases are approved.** Phase 13 (Development) ran all 17 milestones — 16 approved, 1 (Milestone 15, Payments) deliberately deferred for lack of real Stripe credentials. Phase 14 (Testing) and Phase 15 (Final Polish & Launch) are both done. See `PROGRESS.md`'s Phase Tracker + Phase 13 Milestone Tracker for the full status table, `docs/phases/phase-13-development-log.md` for per-milestone build detail, and `docs/phases/phase-14-testing.md` / `phase-15-launch.md` for the final testing/launch-readiness docs.

**The user explicitly waived the phase-by-phase approval gate partway through** ("continue through all remaining phases/milestones without stopping for approval each time") — from Milestone 10 onward, work proceeded continuously with commits/pushes after each milestone rather than pausing for individual sign-off. If resuming into genuinely new feature work (not just finishing this build-out), check with the user whether that waiver still applies or whether they want the original phase-gate discipline back.

**What's real vs. what's still a placeholder — read this before assuming anything works a certain way:**
- **Real, backed by Postgres, tested end-to-end:** Users/Auth (bcrypt + TOTP MFA), Documents (real local-filesystem storage + DB rows + authenticated download route), Notifications (real in-app bell), Audit log (append-only at the DB grant level — `app_user` has no UPDATE/DELETE on `audit_logs`, verified by actually attempting both).
- **Still in-memory placeholder stores:** only Verification records now (public `/verify` curation) — resets on server restart. Applications/Invoices/Messages were migrated to Postgres earlier (Milestone 12 follow-up); Assignments/Assessments/Findings/Competence/Availability (the assessor side) were migrated 2026-09-10 alongside the CB Dashboard work. Migrating Verification records would follow the same pattern if picked back up.
- **Payments:** not built at all. No Stripe credentials were available in this environment; Phase 11 already flagged the vendor as TBD.
- **Email delivery:** not wired to a real provider. Notifications log what would have been sent instead of faking delivery.
- **Rate limiting** (`src/lib/rate-limit.ts`) and **password-reset tokens** (`src/lib/auth/store.ts`) are both in-process memory — correct for one running instance, but won't coordinate across multiple instances. Flagged explicitly in `docs/phases/phase-15-launch.md` §5 as something to replace with a shared store (Redis/Upstash) before scaling horizontally.
- **Real institutional facts, legal page body text, production domain:** all still placeholder, by design — the project's core rule against fabricating credibility claims applies throughout, not just in early phases.

**Demo login credentials** (seeded via `prisma/seed.ts` into the real database now, not in-memory): `applicant@example.com` / `assessor@example.com` / `admin@example.com`, all with password `Password123!`. Admin and Assessor are forced into MFA setup on first login (real TOTP, enforced by `src/middleware.ts`).

**Dev server runs on port 5000.** Note: on this machine, **port 3000 is bound to an unrelated Docker/WSL relay process, not this app** — don't assume port 3000 is this app just because something answers there. If a stale process is already holding port 5000 from a prior session, find it with `netstat -ano | grep ":5000"` (or on Windows, cross-reference `Get-NetTCPConnection -State Listen` with `Get-CimInstance Win32_Process` to be sure which PID actually owns it) and stop it before restarting. This session also accumulated several zombie leftover `next dev` processes from repeated stale-cache restarts across a long run — if ports start behaving unexpectedly, check for duplicate processes before assuming the code is broken.

**Recurring lessons worth re-reading before touching Server/Client Component boundaries again:**
1. Two failure modes surfaced repeatedly across Milestones 5, 8, and 10: (a) passing anything function-shaped (icons, `DataTable` column `render` callbacks) as a prop from a Server Component to a Client Component, and (b) importing a plain data constant *from* a `"use client"` file *into* server code — the latter doesn't even get caught by TypeScript. Fix for both: keep shared data in a file with no `"use client"` directive, and let the client component that needs render-functions/icons define them locally.
2. **Never pass a full database row as props into a Client Component**, even if only some fields are used — sanitize/`select` at the query level first. Caught for real once (Milestone 10, `passwordHash`/`mfaSecret` almost shipped in the client bundle for the Users page) and hardened against generally (`getAllUsersSafe()`/`getUsersByRoleSafe()` in Milestone 12).
3. `noUncheckedIndexedAccess` strict mode: `record[computedKey] && record[computedKey].prop` doesn't narrow the way `if (x) x.prop` does — use `record[computedKey]?.prop`.
4. Next.js Server Actions can't be practically curl-tested (internal action-id + React Flight body encoding). The established workaround throughout this project: write a standalone TypeScript script that calls the same underlying library function the Server Action calls, run it with `npx tsx`, then delete it. This gives equivalent business-logic coverage even without a real click-path.
5. **Next.js dev mode** has its own RSC debug instrumentation that can serialize local Server Component variables into dev-mode HTML responses even when never passed as props — looks like a leak, isn't one in production. Always verify a suspected leak by actually running `next build && next start` and checking the real production response before treating it as confirmed.
6. Prisma's `migrate reset` wipes any custom `GRANT`/`REVOKE` statements applied outside the schema (like the least-privilege `app_user` role in `prisma/grants.sql`) — always re-apply `grants.sql` after any reset.

**Known, accepted risk carried forward:** `npm audit` shows 5 advisories (1 moderate, 4 high), all inside build-tooling dependencies (Next's bundled `postcss`, Prisma CLI's `deepmerge-ts` chain) — neither reachable from the deployed app's runtime. Fixing either requires an untested breaking major-version upgrade (Next 16, or downgrading Prisma), deliberately not attempted mid-build. Documented in `PROGRESS.md`'s Open Questions Log and `docs/phases/phase-14-testing.md` §4.

Working name in use throughout the codebase: "Meridian Accreditation Board" (MAB) — still a placeholder; a name change at this point is a straightforward find-and-replace.

**Git**: connected to a real GitHub remote, `https://github.com/digitalmarketingrankbrain-art/ABCD.git`, branch `main`. Every milestone/phase from Milestone 10 onward has been committed and pushed individually with a detailed commit message — `git log` is a reliable, detailed record of what was built and why, worth reading directly rather than re-deriving from this file.

**How to resume:** read `PROGRESS.md`'s Phase Tracker and Milestone Tracker for current status (everything is Approved except deferred Milestone 15), then pick up wherever the user directs next — likely either the deferred Payments milestone (once Stripe credentials are available), migrating the remaining in-memory stores to Postgres, or genuinely new feature work outside the original 15-phase plan.

## How to resume this project in a new session

1. Read this file.
2. Read `PROGRESS.md` to see which phase is current and its status.
3. Read the latest `docs/phases/phase-N-*.md` for full context on the last delivered/approved phase.
4. Check the Open Questions Log in `PROGRESS.md` for anything still unresolved.
5. Continue from the current phase — do not restart or re-litigate approved phases without the user asking.
