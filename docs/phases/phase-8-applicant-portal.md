# Phase 8 — Applicant Portal UX

Builds on Phases 1–7 (approved). This is the first authenticated portal surface — visual density increases here per Phase 4's rule ("density increases appropriately inside the portal — a working tool — versus the public site — a reading experience"), but the same color/type/status system carries over unchanged.

---

## 1. Application Lifecycle (canonical states)

Reconciling Phase 1's business-workflow language with the master brief's applicant-facing stage names:

```
Draft → Submitted → Initial Review → Document Review → Assessment → Decision → Accredited
                                                                          ↘ Declined / Information Requested
```

- **Draft** — applicant-owned, not yet visible to admin/assessor, freely editable, autosaved.
- **Submitted** — locked from further free editing; timestamp recorded; triggers admin notification.
- **Initial Review** — admin confirms eligibility/completeness. Can bounce back to applicant as **Information Requested** (a sub-state, not a dead end — see Section 4).
- **Document Review** — specific document-level checks; individual documents can be marked Approved / Needs Revision.
- **Assessment** — assessor assigned and conducting evaluation (mirrors Phase 9's assessor workspace); applicant sees progress, not internal assessor notes.
- **Decision** — authorised decision-maker reviews the assessment; distinct from the assessor's recommendation (per Phase 6 Governance page — repeated here because it's the applicant's most anxious moment).
- **Accredited** — record created, becomes the linked verification record (Phase 7). Terminal-success state; from here the application record archives and a linked **Accreditation record** (Section 6) takes over for renewal/surveillance.
- **Declined** — terminal for this application cycle; applicant sees the stated reason and a link to Complaints & Appeals if they wish to dispute it, and to re-apply guidance if eligible.

**Design rule:** every stage above is a **named, visible node** in the applicant's UI — never an internal-only state the applicant can't see themselves currently sitting in. This is the single biggest UX difference from a typical opaque approval workflow, and directly answers Phase 1 problem #3 ("Where do things stand?").

---

## 2. Dashboard (`/portal/applicant/dashboard`)

**Layout:** Top: a single "what do I need to do right now" zone — if any action is required across any application/invoice, it's surfaced here first, above everything else, with a direct link to resolve it. Below: card grid of summary widgets.

**Widgets:**
- **Applications** — count by stage (e.g., "1 in Assessment, 1 Draft"), link to full list.
- **Required actions** — anything blocking progress: a document needs replacing, an information request is open, an invoice is due. Each item states what's needed and a direct "Resolve" link — never just a red dot with no explanation.
- **Upcoming deadlines** — renewal dates, surveillance dates, response-due dates, sorted soonest-first, with explicit dates (not just "soon").
- **Documents** — recently updated/requested documents.
- **Messages** — unread count, most recent snippet.
- **Payments** — outstanding invoice total, if any, link to Invoices.
- **Accreditation status** — for organisations with an active accreditation, their current status badge (same visual system as the public verification page — an applicant should recognize their own status badge as the identical thing the public sees) and next renewal/surveillance date.

**Empty state (brand-new applicant, no applications yet):** Not a blank dashboard — a clear "Start your first application" prompt with a link into the Programs list, since a genuinely empty dashboard here would look broken rather than simply new.

---

## 3. Applications List (`/portal/applicant/applications`)

**Layout:** Table (per Phase 4 table rules) — Program, Reference number (mono), Current stage (as a stage badge, not a generic "in progress" label), Last updated, Action needed (if any). Row click → detail.
**CTA:** "New application" button, top-right.
**Empty/filtered states:** standard microcopy pattern.

---

## 4. Application Detail (`/portal/applicant/applications/[id]`)

**Layout:** Header: program name, reference number, current stage badge. Below: a horizontal **ApplicationTimeline** component (the shared component named in the project's reusability list) showing all 7 canonical stages, with the current one highlighted and completed ones checked — this is the same visual language as the public "How Accreditation Works" stepper (Phase 6), deliberately, so the applicant recognizes their own journey against the process they were shown before applying.

**Tabs/sections below the timeline:**
- **Overview** — key facts, scope applied for, submission date.
- **Documents** — see Section 5.
- **Assessment** — read-only progress once assigned (assessor name/role is shown; internal assessor notes are not — Phase 1's access-control rule).
- **Messages** — case-scoped thread with admin/assessor (Section 5.4).
- **Invoices** — invoices tied to this application specifically.

**Information Requested sub-state handling:** When admin/assessor requests more information, this is shown as a **distinct, prominent banner at the top of the application detail page** (not buried in the Messages tab) — "Action needed: [specific request]," with a direct response affordance (upload a document, or reply) right there. The applicant should never have to go hunting through a message thread to figure out what's being asked of them.

**Draft saving:** autosave on every field blur + an explicit "Save draft" button for user confidence; a visible "Saved [X] ago" indicator, consistent with the project's error-message standard (if a save fails: *"We couldn't save your changes. Your existing information has not been removed. Please try again."*).

---

## 5. Documents

### 5.1 Document requirements list
Each application shows its required-document checklist (program-specific, defined by admin/program config) with per-document status: **Not uploaded / Uploaded / Under review / Approved / Needs revision**. Never a flat file list with no status context.

### 5.2 Upload
FileUploader component (shared, per reusability list): drag-and-drop + browse, file-type/size constraint shown upfront — *"PDF, DOCX or XLSX files up to 25 MB"* (exact microcopy pattern specified in the project brief), progress indicator, and clear success/failure state.

### 5.3 Replace / version history
Replacing a document keeps prior versions accessible (not silently overwritten) — a small version history list per document (v1, v2...) with upload date and uploader, relevant both for the applicant's own record-keeping and for Phase 12's document-versioning requirement.

### 5.4 Comments on documents
Reviewer/assessor comments attach to the specific document they concern (not just a general message thread) — shown inline next to that document's status, so "needs revision" always comes with the specific reason attached to the specific file.

---

## 6. Accreditation & Renewals (`/portal/applicant/accreditation`, `/renewal`)

Once Accredited, the applicant sees their live accreditation record — same status badge/date fields as the public verification page (Section 2 principle repeated). A **Renewal** flow reuses the same document-checklist and timeline components as the original application, rather than being a bespoke separate UI — reduces cognitive load for a returning user who already learned the pattern once.

**Deadline visibility:** renewal/surveillance due dates appear on the Dashboard (Section 2), on this page, and trigger notifications (Phase 1 requirement) at defined lead times `[PLACEHOLDER — REQUIRES CONFIRMATION: exact reminder cadence, e.g. 90/30/7 days before due]`.

---

## 7. Invoices (`/portal/applicant/invoices`)

**Layout:** Table — invoice number (mono), related application/accreditation, amount, status (Due / Paid / Overdue — same badge-with-label pattern as everywhere else), due date, action (Pay / View).
**Detail:** line-item breakdown, payment method, downloadable PDF.

---

## 8. Messages (`/portal/applicant/messages` + per-application threads)

Case-scoped by design (Phase 1 access rule: applicant cannot see any other applicant's data, and messages are always contextual to a specific application/accreditation, never a general free-form inbox to "admin" at large) — reduces ambiguity about who's reading what and why.

---

## 9. Profile & Security (`/portal/applicant/profile`, `/security`)

Profile: organisation details, primary contact(s). Security: password change, MFA enrollment (available/encouraged per Phase 1, not mandatory for Applicant role), active session list with revoke action, security notification preferences.

---

## 10. Assumptions

1. Renewal reminder cadence is unconfirmed — placeheld for Phase 12/notification design.
2. Multi-user organisation accounts (more than one named contact per applicant org, with possible internal role distinction) are assumed **Should-Have**, not required for v1 — v1 assumes one primary login per applicant organisation unless corrected.

## 11. Questions / Decisions Needed

1. Should an applicant organisation support multiple internal users (e.g., a compliance manager + an executive both with portal access), or is one login per organisation sufficient for v1?
2. Confirm renewal/surveillance reminder cadence.

Neither blocks proceeding to Phase 9.

---

## Next Phase

**Phase 9 — Assessor Portal**: assessor profile, competence areas, availability, assignments, and the assessment workspace (findings, evidence, reports).
