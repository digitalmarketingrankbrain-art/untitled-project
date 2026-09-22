# Phase 10 — Admin Platform

Builds on Phases 1–9 (approved). Design priority, per the brief: **clarity + efficiency + traceability over visual decoration.** This is the densest, least "designed" surface on the platform by intent — every screen should read like a well-run operations console, not a marketing-adjacent dashboard. Every state-changing action described below is audit-logged (Phase 1 security requirement) with actor, timestamp, and before/after values; that's assumed throughout rather than repeated per section.

---

## 0. Admin UI Principles

- **Tables, not cards, as the default view** for every list in this portal — cards are reserved for the public site and portal dashboards; admin list views are dense, sortable, filterable tables per Phase 4's table component rules.
- **No destructive or status-changing action without a required reason field** — suspend, withdraw, reinstate, decline, and role changes all require a short rationale, stored with the audit entry. This isn't bureaucratic friction for its own sake — it's what makes the audit log actually useful later ("why was this suspended?" always has an answer on record).
- **RBAC-scoped UI, not just RBAC-scoped API** — an admin without a given permission doesn't see a disabled button for it; the action is simply absent, keeping the interface honest about what a given admin role can actually do.
- **Every admin list view supports "view full audit history" for its record** — one click from any application, organisation, or accreditation record straight into its filtered audit log.

---

## 1. Admin Dashboard (`/portal/admin/dashboard`)

Operational queue view, not a decorative summary:
- **Applications awaiting action** — by stage, oldest-first, with days-in-stage flagged if over a configurable threshold (surfaces stalled cases).
- **Assessments overdue or nearing deadline.**
- **Decisions pending** — assessments completed, awaiting the authorised decision-maker.
- **Accreditations expiring soon** (renewal/surveillance windows approaching).
- **Payments overdue.**
- **Recent fraud reports / complaints** requiring triage.
- **System notices** — failed notification deliveries, integration errors — operational health, not user-facing content.

---

## 2. Applications (`/portal/admin/applications`, `/[id]`)

**List:** reference, organisation, program, stage, days-in-stage, assigned reviewer/assessor, action-needed flag.
**Detail:** same ApplicationTimeline component as the Applicant portal (shared component, admin sees the identical stage model — no separate internal-only workflow diverging from what the applicant sees, which would undermine Phase 1's transparency principle). Admin actions available per stage:
- **Initial Review:** mark complete / request information (opens the same "Information Requested" banner on the applicant's view, Phase 8).
- **Document Review:** approve/flag individual documents (mirrors Applicant portal's per-document status).
- **Assessment:** assign an assessor (shows assessor competence-match and availability from Phase 9, admin picks — auto-suggestion is Future-scope per Phase 1).
- **Decision:** a distinct, role-gated **"Record Decision"** action — separate UI from the assessor's report view, requiring: outcome (Accredit / Decline / Request More Information), rationale, and the deciding admin's identity — structurally enforcing the assessor/decision-maker separation stated in Phase 6 Governance, not just a policy statement.

---

## 3. Organisations (`/portal/admin/organisations`, `/[id]`)

**List:** name, type (applicant / accredited / both), current accreditation status if any, primary contact.
**Detail:** full case history across all applications and accreditation records for that organisation (an org may have applied, lapsed, and reapplied — admin needs the whole history in one place, unlike the applicant's own portal which only shows their live view), documents, payment history, communication log, notes (internal-only, never visible to the applicant, clearly marked as such in the UI to avoid a staff member accidentally exposing internal commentary).

---

## 4. Assessors (`/portal/admin/assessors`, `/[id]`)

**List:** name, competence areas, current assignment count, availability status snapshot.
**Detail:** competence records (admin can review/approve competence entries the assessor submits, Phase 9), availability calendar (read-only to admin, per Phase 9's rule that only the assessor edits their own), assignment history, decline-reason history (visible here specifically because it matters for admin's future assignment decisions and impartiality oversight).
**Provisioning:** admin invites new assessor accounts here (per Phase 2/9's assumption that assessor accounts are admin-provisioned, seeded from public-site expressions of interest at `/assessors/become-an-assessor`).

---

## 5. Assessments (`/portal/admin/assessments`, `/[id]`)

A **cross-cutting view** distinct from Applications — useful for scheduling/oversight questions that aren't naturally "per application" (e.g., "show me every assessment scheduled next month," "show me every assessment run by assessor X this year" for competence/quality review purposes). Detail view mirrors the assessor's own workspace (Section 5.2, Phase 9) in read-only form for admin oversight, plus an admin-only **quality review** note field (e.g., for periodic assessor performance review — internal, not part of the applicant-facing record).

---

## 6. Accreditation Records (`/portal/admin/accreditation-records`, `/[id]`)

**List:** organisation, program, status, effective date, next renewal/surveillance date.
**Detail:** full record, with explicit **status-change actions**: Suspend / Reinstate / Withdraw — each requiring the mandatory-reason field (Section 0) and immediately propagating to the linked Verification Record (Section 7) and triggering an applicant notification (Phase 1 requirement — no silent state changes).
**History:** every prior status and the reason for each transition, visible in one place — this record's own timeline is effectively its audit trail, surfaced directly rather than requiring a separate audit-log lookup for the common case.

---

## 7. Verification Records (`/portal/admin/verification-records`, `/[id]`)

Per Phase 2's structural decision, this is a **deliberately curated subset** of the accreditation record — admin controls exactly which fields are exposed on the public `/verify/[reference]` page (Section 3, Phase 7), rather than the public page automatically mirroring every internal field. This screen is where that curation happens: a field-level toggle/mapping view (e.g., "internal assessor notes: never public" is structurally true, not just convention) plus a **"Preview public page"** action so admin can see exactly what a member of the public would see before publishing a change — directly supports the "never let Not Found resemble a valid result" and "status must be unmistakable" rules from Phase 7 by letting admin verify the actual rendered result, not just the data.

---

## 8. Documents (`/portal/admin/documents`)

Global document oversight — search across all applications/organisations by filename, type, uploader, date; storage/retention policy visibility (not public-facing storage config, but confirmation that documents follow the private-storage-with-signed-URLs rule from Phase 1 is visible/auditable here for compliance purposes).

---

## 9. Payments (`/portal/admin/payments`)

Invoice list (all organisations), status, manual actions (mark paid for offline payments, issue credit/refund note — each logged with reason), reconciliation view against the payment provider `[PLACEHOLDER — provider TBD, see Phase 11]`.

---

## 10. Notifications (`/portal/admin/notifications`)

Two parts: **templates** (the content of system emails/in-app notifications — status changes, deadline reminders, decision outcomes — admin-editable so wording can improve without a code deploy) and **delivery log** (sent notifications, delivery status, useful when an applicant claims "I never got that email").

---

## 11. Resources & News CMS (`/portal/admin/resources`, `/portal/admin/news`)

Authoring/versioning UI for the public Resources library (Phase 6) and News/Notices — every published resource requires a version number and effective date (Section 0's principle: the field exists here because it's structurally required, matching Phase 6's trust requirement). News entries support the routine/status-change category distinction used on the homepage (Phase 5) and news index.

---

## 12. Users & Roles (`/portal/admin/users`, `/portal/admin/roles`)

**Users:** all portal users across Applicant/Assessor/Admin, search/filter, account status (active/suspended/locked), MFA enrollment status (visible for Admin/Assessor roles specifically, since MFA is required there per Phase 1).
**Roles:** permission matrix editor — role-based, not user-by-user ad hoc permissions, consistent with Phase 1's RBAC requirement. `[PLACEHOLDER — REQUIRES CONFIRMATION: exact permission granularity beyond the three primary roles — e.g., whether Admin itself splits into sub-roles like "Reviewer" vs "Finance" vs "Full Admin"]`. Default assumption for design purposes: Admin supports sub-roles/permission scoping (not all admins can do everything), per Phase 1 Section 7's "role/permission-scoped — not every admin necessarily has every permission."
**Impersonation:** Should-Have, not default — if built, requires a distinct, heavily-logged flow (explicit reason, time-boxed session, banner visible to the impersonating admin throughout, separate audit entry type) per Phase 1's explicit rule against unlogged impersonation.

---

## 13. Audit Logs (`/portal/admin/audit-logs`)

Searchable/filterable by actor, record type, record ID, action type, date range. Read-only, immutable display (the log itself is never editable through the UI, consistent with its purpose). Every entry: actor, action, target record, timestamp, before/after values where meaningful (per Phase 1). This is the platform's core traceability guarantee — worth treating as a first-class, well-built screen even though it's the least visually interesting one, since it's what the organisation reaches for when its own decisions are questioned (Phase 1's Objective #4).

---

## 14. Settings (`/portal/admin/settings`)

Program configuration (scope definitions, fee amounts, required-document lists, assessment criteria checklists referenced in Phase 9 — all admin-editable rather than hardcoded, per the project's content-management principle), notification cadence defaults (renewal reminder lead times, flagged open from Phase 8), organisation-level settings (branding assets, legal entity details once confirmed).

---

## 15. Reporting

Should-Have per Phase 1: basic operational reports (applications by stage/status over time, average time-to-decision, assessor workload distribution) rather than an advanced analytics dashboard (explicitly Future-scope). Table/export-oriented, not chart-heavy — consistent with the admin portal's clarity-over-decoration principle, and genuinely more useful to compliance/ops staff than dashboards in most audits.

---

## Assumptions

1. Admin role supports sub-role permission scoping (Reviewer / Finance / Full Admin, or similar) rather than one flat Admin role — pending confirmation of actual staffing model.
2. Payment provider is unconfirmed (carries to Phase 11).
3. Reporting stays table/export-oriented rather than chart-heavy for v1.

## Questions / Decisions Needed

1. Confirm whether Admin needs sub-role permission scoping for v1, or whether a single flat Admin role (with MFA + full audit logging as the safeguard) is sufficient at this scale.
2. Is impersonation actually needed for v1 (e.g., for support purposes), or can it be deferred entirely rather than built as Should-Have?

Neither blocks proceeding to Phase 11.

---

## Next Phase

**Phase 11 — Technical Architecture**: now that all UX has been specified, the technical architecture (frontend/backend/database/auth/storage/verification/notification/payment/audit architecture) that will actually implement everything designed in Phases 1–10.
