# Phase 9 — Assessor Portal

Builds on Phases 1–8 (approved). This portal serves a working professional handling multiple simultaneous assessments — the design priority stated in the brief is explicit: **usability with large amounts of assessment information**, not visual flourish. Density and information scent take precedence over the more spacious public-site language, even more so than the Applicant portal.

---

## 1. Access Scope (repeating Phase 1's rule explicitly, since it drives this entire phase)

An assessor can see: their own profile, competence, availability, and **only the assignments they are assigned to**. They cannot see other assessors' assignments, competence records, availability, or pay/scheduling data, and cannot access any application/organisation record outside an active assignment. Every screen in this phase is scoped by that rule by default — not an afterthought applied later.

---

## 2. Assessor Dashboard (`/portal/assessor/dashboard`)

**Layout:** Same "what needs my attention now" zone pattern as the Applicant dashboard (Phase 8), adapted for an assessor's workload:
- **Pending assignment responses** — new assignments awaiting Accept/Decline, with a response-due date.
- **Active assignments** — in-progress work, sorted by nearest deadline, each showing organisation name, program, current step within the assessment (see Section 5), and days remaining.
- **Reports awaiting submission** — assessments where fieldwork/evaluation is complete but the report hasn't been submitted yet (a common bottleneck worth surfacing explicitly rather than letting it hide inside a list).
- **Messages** — unread count.
- **Competence/credential expiries** — if the assessor's own qualifying credential has an expiry date approaching, it's flagged here (an expired-credential assessor being assigned new work is a quality-control risk worth surfacing to the assessor themselves, not just admin).

---

## 3. Profile & Competence (`/portal/assessor/profile`, `/competence`)

**Profile:** contact details, biography/qualifications summary (used internally by admin for assignment matching, not public-facing).
**Competence:** a structured list, not free text — each entry: scope/program area, qualifying credential or basis, date qualified, expiry/review date if applicable, status (Current / Expiring soon / Expired). This structured model is what lets Admin's future assignment-matching (Phase 1 Future-scope: "competence-matrix-driven auto-suggestions") work at all, so the data shape is worth getting right now even though the automation itself is deferred.
**Document uploads:** supporting credential documents (certificates, CVs) attached per competence entry, using the same FileUploader component as elsewhere.

---

## 4. Availability (`/portal/assessor/availability`)

**Layout:** Calendar view (month grid) with the assessor marking unavailable periods (blackout dates) and optionally a general weekly capacity pattern. Admin reads this when proposing assignments (Phase 10) but cannot edit it.
**Interaction:** Simple click/drag to mark date ranges unavailable; list view alternative for accessibility/keyboard users who find a calendar grid harder to operate.

---

## 5. Assignments (`/portal/assessor/assignments`, `/[id]`)

### 5.1 Assignments list
Table: Organisation, program/scope, stage-within-assessment (see 5.2), due date, status (Pending Response / Accepted / In Progress / Report Submitted / Completed). Filterable/sortable — this is the page an assessor with 15 concurrent assignments lives in, so filtering by status and sorting by due date are not optional niceties.

### 5.2 Assessment workspace (`/portal/assessor/assignments/[id]`) — the core screen of this phase

**Layout:** Persistent left-hand context panel (organisation name, scope, key dates, applicant contact) + main working area with tabs:

- **Overview** — assignment brief, scope being assessed, any admin instructions.
- **Documents** — applicant-submitted documents relevant to this assessment (read access only to what's shared for this assignment, per Phase 8's document-sharing model), plus the assessor's own working documents/evidence uploads.
- **Checklist / Criteria** — the assessment is built from a **structured criteria checklist** (defined per program in Phase 10's program configuration), not a blank text box: each criterion shows the requirement, a finding status (Conforms / Non-Conformance / Not Applicable / Observation), and a notes field. This structure is what makes findings comparable across assessments and reportable, rather than relying on prose consistency between assessors.
- **Findings** — auto-compiled from any checklist item marked Non-Conformance or Observation, each with severity/category, evidence reference, and space for the applicant's corrective action once requested (round-trips with the applicant via the application's Document Review, per Phase 8).
- **Evidence** — attached files/notes supporting specific findings, linked to the specific checklist item they support (same "attach context to the specific thing," not a flat pile, principle as Phase 8's document comments).
- **Report** — compiles overview + findings + evidence into a structured report draft; assessor can preview before submission; submission is a distinct, deliberate action (not an autosave-implied submit) since it triggers the Decision stage for the applicant.

**Interaction:** Autosave on checklist/findings entry (this is exactly the kind of long-form work that must never lose data to a browser crash), explicit "Submit Report" action separate from ongoing autosave, confirmation step before submission since it's a workflow-triggering, hard-to-walk-back action.

### 5.3 Accept/decline assignment
On a pending assignment, Accept/Decline is a first-class action (not buried) — Decline requires a brief reason (visible to admin only, e.g., conflict of interest, capacity, competence mismatch) which both closes the loop for admin and creates a record supporting the impartiality/conflict-of-interest disclosure principle established in Phase 6 Governance.

---

## 6. Messages (`/portal/assessor/messages`)

Same case-scoped model as the Applicant portal (Phase 8, Section 8) — threads are tied to a specific assignment, addressed to admin and/or (where appropriate, and admin-visible) the applicant, never a general inbox.

---

## 7. Assumptions

1. Assessment criteria checklists are assumed to be admin-configured per program (Phase 10), not assessor-authored per assignment — keeps assessments comparable across assessors for the same program.
2. Assessor accounts are provisioned/invited by admin (per Phase 2's assumption), not self-registered, though `/assessors/become-an-assessor` on the public site still exists as an expression-of-interest entry point feeding into that admin-provisioning step.

## 8. Questions / Decisions Needed

1. Confirm: are assessors independent contractors assigned per-engagement, or staff with ongoing broader access? (Affects whether "Assignments" is the only unit of work, or whether a persistent broader relationship view is also needed.) Current design assumes the former (assignment-scoped access only).
2. Any specific structured criteria/checklist standard already in use for real assessments, or should Phase 12 design a generic configurable checklist model?

Neither blocks proceeding to Phase 10.

---

## Next Phase

**Phase 10 — Admin Platform**: application management, organisation/assessor management, accreditation and verification record management, documents, payments, notifications, resource publishing, users/roles, audit logs, reporting.
