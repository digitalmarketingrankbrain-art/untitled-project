# Phase 1 — Discovery & Requirements

Project: Accreditation Platform (working name)
Reference used for functional/structural inspiration only: https://www.uafaccreditation.org/

---

## 1. Business Objective

The platform exists to let an independent accreditation body do four things credibly, in public:

1. **Explain what it accredits, and how**, clearly enough that an unfamiliar visitor understands the value of accreditation and whether it applies to them, without legal or marketing overreach.
2. **Let anyone verify an accreditation claim in seconds**, so accreditation printed on a certificate, a website, or a piece of paperwork can be checked independently rather than taken on trust. This is the single highest-trust feature on the platform — most first-time visitors who are not applicants arrive specifically to do this.
3. **Run the accreditation lifecycle** (application → assessment → decision → accreditation → surveillance/renewal → suspension/withdrawal) as a structured, auditable digital workflow instead of email/spreadsheet coordination, for both the applicant organisation and the assessor.
4. **Operate transparently and defensibly**, so that if the organisation's own competence, impartiality, or decisions are ever questioned — by an applicant, a regulator, a competitor, or a journalist — the public record (policies, procedures, complaints/appeals process, verification data) already answers the question.

Everything else (training, resources, news) supports these four objectives; it is not the primary reason the platform exists.

`[PLACEHOLDER — REQUIRES CONFIRMATION]` — Is this platform for a real accreditation body about to operate, or a portfolio/demonstration build? This changes how much weight to put on real legal review, real policy documents, and real regulatory positioning versus representative placeholder content.

---

## 2. Target Audiences

For each audience: **Goal**, **Concerns**, **Information needed**, **Action we want them to take**.

### 2.1 New applicant (organisation seeking accreditation)
- **Goal:** Determine if this accreditation applies to them, what it costs, how long it takes, and whether this body is credible enough to be worth the investment.
- **Concerns:** Legitimacy of the accrediting body; total cost (often hidden until late in a sales process); realistic timeline; how much internal effort is required; what happens if they fail an assessment.
- **Information needed:** Scope definitions in plain language, eligibility criteria, step-by-step process, fee structure or fee guidance, required documents, assessor competence/impartiality safeguards.
- **Desired action:** Start an application, or contact the organisation with a scoping question.

### 2.2 Existing accredited organisation
- **Goal:** Manage their accreditation with minimal friction — renewals, surveillance assessments, scope changes, certificate/logo use rules, invoices.
- **Concerns:** Missing a renewal deadline and lapsing; understanding what triggers suspension; getting timely responses from assessors/admin; knowing exactly what's expected of them.
- **Information needed:** Current status, upcoming deadlines, outstanding actions, documents on file, correct use of accreditation marks.
- **Desired action:** Log into the portal and complete whatever the current lifecycle stage requires (upload a document, book a surveillance visit, pay an invoice, respond to a finding).

### 2.3 Verification user (relying party)
- **Goal:** Confirm that an accreditation claim they've been shown (on a certificate, a website, a report) is real and current, in under a minute, without creating an account.
- **Concerns:** Being misled by an expired, suspended, or fabricated claim; not knowing how to check.
- **Information needed:** A simple search by certificate/accreditation number or organisation name, and an unambiguous status.
- **Desired action:** Search, read the status, done. This audience should never be asked to sign up or contact anyone to get a basic yes/no answer.

### 2.4 Assessor (current or prospective)
- **Goal (prospective):** Understand whether they're eligible to become an assessor and how to apply.
- **Goal (current):** Efficiently manage assignments, submit findings/reports, get paid, maintain their competence records.
- **Concerns (current):** Clarity on assignment scope and expectations; access to the right reference material and prior records for a repeat visit; not having to fight the tool to do their job.
- **Information needed:** Assignment details, applicant documents relevant to the assessment, templates/checklists, deadlines.
- **Desired action:** Apply to become an assessor, or (once active) accept/complete assigned assessments through the portal.

### 2.5 Training participant
- **Goal:** Find and register for relevant training (e.g. assessor training, standard-specific training for client organisations).
- **Concerns:** Whether the training is credible/worth attending, cost, schedule, prerequisites.
- **Information needed:** Course description, audience/prerequisites, format (in-person/online), dates, cost, what they receive on completion.
- **Desired action:** Register interest or enrol.

### 2.6 Administrator (internal staff)
- **Goal:** Run application intake, assessment scheduling, decision-making, accredited-body records, and compliance/audit reporting efficiently and defensibly.
- **Concerns:** Losing track of an application or deadline; inconsistent decisions; inability to produce an audit trail if challenged; manual work that should be automated (reminders, status changes, invoicing).
- **Information needed:** Full case history per applicant, assessor availability/competence, payment status, document versions, communications log.
- **Desired action:** Process cases to decision with full traceability and minimal manual re-entry.

### 2.7 General visitor / stakeholder / partner / press
- **Goal:** Quickly understand what the organisation is, what "accredited by [org]" actually means, and whether it's a legitimate, well-governed body.
- **Concerns:** Distinguishing a real accreditation body from a low-credibility "pay-to-play" certificate mill.
- **Information needed:** Governance structure, impartiality policy, complaints/appeals process, contact information, scope of accreditation offered.
- **Desired action:** Read enough to trust the organisation or find the specific page (governance, policy, contact) they came for.

---

## 3. Core User Problems

The platform needs to solve, in priority order:

1. **"Is this real?"** — Both the organisation itself and any specific accreditation claim need to be independently verifiable in under a minute, without a login.
2. **"Does this apply to me, and what will it cost/take?"** — Applicants currently have to dig through PDFs or contact someone to get basic scoping answers that should be self-service.
3. **"Where do things stand?"** — Applicants, accredited organisations, and assessors all need a single, current source of truth for status and next required action, instead of chasing email threads.
4. **"What exactly do I need to submit/do next, and how?"** — Ambiguity in document requirements and process steps is a major source of delay and frustration in accreditation processes generally.
5. **"Can I trust this body's decisions?"** — Anyone questioning a decision, a suspension, or the organisation's own impartiality needs a visible, credible complaints/appeals mechanism and governance disclosure.
6. **"How do I report misuse?"** — Someone who spots a fraudulent or expired accreditation claim being used needs an obvious way to report it.

---

## 4. Core Trust Requirements

Before a visitor will trust an accreditation body enough to apply, pay, or rely on its verification, they typically need to see (to the extent the org can truthfully claim it):

- **Who runs it** — governance structure, decision-making body, impartiality safeguards (conflict-of-interest policy).
- **What it actually accredits** — precise scope definitions, not vague claims.
- **How decisions are made** — a described, consistent process rather than an opaque one.
- **What happens when something goes wrong** — a visible complaints and appeals process, and a way to report suspected fraud/misuse of the accreditation mark.
- **That claims are checkable** — a public verification tool, not a "trust us" badge.
- **Currency of information** — dated policies/notices, not a site that looks abandoned.
- **Professional, unembellished presentation** — overclaiming (superlatives, unverifiable "recognised worldwide" language) reduces trust for this category of institution; plain, specific, sourced statements increase it.
- **A real, reachable organisation** — physical/registered presence, named contact channels, response-time expectations — not just a contact form into a void.

Per the project's factual-accuracy rule, none of the specific claims above (recognition status, signatory status, years of operation, client counts, etc.) will be asserted in content until confirmed by the user; they will appear as `[PLACEHOLDER — REQUIRES CONFIRMATION]` in later content phases.

---

## 5. Functional Requirements

### Must Have (v1 launch)
- Public marketing/informational site: Home, About, Governance, Accreditation programs, How it works, Resources, Contact, Policies, Complaints & Appeals, Fraud reporting, Privacy/Terms/Accessibility.
- Public verification search + verification detail page with unambiguous status states.
- Authenticated Applicant portal: application creation/submission, document upload, status tracking, messaging with admin/assessor, invoices/payment status.
- Authenticated Admin portal: application intake and review, assessor assignment, decision recording, accreditation record management, verification record management, user management, audit log.
- Core accreditation lifecycle workflow (Draft → Submitted → Review → Assessment → Decision → Accredited → Renewal/Surveillance → Suspended/Withdrawn) reflected consistently across applicant, assessor, and admin views.
- Authentication with role-based access control (Applicant / Assessor / Admin, at minimum), MFA available for privileged (Admin/Assessor) roles.
- Secure private document storage with access limited to authorised parties per record.
- Basic notification system (email at minimum) for status changes and required actions.
- Audit logging of state-changing actions on applications, accreditation records, and verification records.

### Should Have (near-term post-launch)
- Assessor portal: availability management, assignment workspace, findings/report submission tied to the assessment record.
- Training section: course listing + registration/enquiry.
- News/Notices section for public announcements (e.g. accreditation withdrawals, policy updates).
- Resource library with authorised-admin content management (no hardcoded institutional documents).
- In-app notifications (not just email) and a message centre in the portal.
- Invoicing/payment processing integrated into the applicant workflow.
- FAQ section, structured by audience.

### Future (post-v1, not required for launch)
- Multi-language support.
- Public API for verification (machine-readable, e.g. for partners embedding verification widgets).
- Advanced analytics/reporting dashboards for admins.
- Self-service scope-change requests from the applicant portal.
- Assessor competence-matrix-driven auto-suggestions for assignment.

---

## 6. Public Website Functionality

- **Search** — sitewide content search (resources, policies, news) separate from accreditation verification search.
- **Accreditation programs** — overview page plus one detail page per program/scope area, each explaining what it covers, eligibility, and process entry point.
- **Verification** — public search by accreditation/certificate number, organisation name, and (should-have) scope/category filter; unambiguous status detail page (see Phase 7 rules).
- **Resource library** — policies, procedures, forms, guidance documents; admin-publishable, versioned.
- **Contact** — general contact plus role-specific routing (applicant enquiry vs. media vs. complaint vs. fraud report) so messages reach the right internal owner.
- **Training** — course listings with enough detail to decide whether to register; registration/enquiry flow.
- **FAQs** — organised by audience (applicants, accredited organisations, verification users, assessors).
- **News/Notices** — required, not optional, for an accreditation body: this is the standard channel for publishing suspensions/withdrawals and policy changes, which is itself a trust signal.

---

## 7. Portal Functionality

### Applicant
Can: create and submit applications; upload/replace documents; view reviewer/assessor comments and respond to information requests; track application status against the defined workflow; view and pay invoices; view their own accreditation record(s) and renewal/surveillance deadlines; message admin/assessor within the context of their case; manage their own profile and security settings (password, MFA).
Cannot: see any other applicant's data; see internal admin/assessor notes not intended for them; alter their own accreditation status.

### Assessor
Can: view and manage their profile, competence areas, and availability; view and accept/decline assignments; access documents/records for assignments they are authorised on; submit findings, evidence references, and reports; message admin and (where appropriate) the applicant within the assignment context.
Cannot: access applications/records they are not assigned to; see other assessors' assignments, competence records, or availability; alter accreditation decisions (assessors recommend; a defined decision-maker/committee decides — exact governance model to be confirmed in Phase 2/11).

### Admin
Can (role/permission-scoped — not every admin necessarily has every permission): manage the full application lifecycle; assign assessors; record decisions; manage accreditation and verification records (including status changes: suspend, withdraw, reinstate); manage documents; manage payments/invoices; manage notifications; publish resources/news; manage users and roles; view full audit logs; run reports.
Cannot: bypass audit logging; impersonate a user without a controlled, logged impersonation flow (Should Have, not assumed by default).

`[PLACEHOLDER — REQUIRES CONFIRMATION]` — Exact decision-making governance model (single admin decision vs. committee/panel review before accreditation is granted) affects both the workflow (Section 9) and the admin portal design (Phase 10). Default assumption for planning purposes: a named decision step exists in the workflow, performed by an authorised role, distinct from the assessor's recommendation — refine once confirmed.

---

## 8. Security Requirements

- **Authentication** — email/password at minimum, with secure password policy; session-based or token-based auth with secure, httpOnly, short-lived sessions and refresh handling.
- **MFA** — required (not just available) for Admin and Assessor roles given their access to sensitive applicant data; available/encouraged for Applicant role.
- **RBAC** — role- and record-level authorization (an Applicant role alone is not sufficient — access must also be scoped to "their own" records; same for Assessor and assigned records).
- **Secure document storage** — private object storage, no public URLs; access via short-lived signed URLs generated per authorised request.
- **Audit trails** — every state-changing action on applications, accreditation records, verification records, users/roles, and documents logged with actor, timestamp, and before/after where meaningful.
- **Session management** — idle timeout, ability to view/revoke active sessions, forced logout on password change.
- **Password recovery** — secure token-based reset, no security questions, rate-limited.
- **Bot protection** — on public forms (contact, application start, verification search) to prevent abuse/scraping without degrading legitimate use.
- **Rate limiting** — on authentication endpoints, verification search, and all public-facing APIs.
- **Security notifications** — alert users on password change, new device/login, and (for admins) on privileged actions like role changes or record status changes to their own account.

---

## 9. Business Workflows

High-level lifecycle (exact states/gates to be finalised in Phase 12 data model, but the shape is):

**Application** → **Initial/Document Review** → **Assessment** (assessor assigned, conducts assessment, submits findings/report) → **Decision** (authorised decision-maker reviews recommendation, grants/declines/requests more information) → **Accreditation** (record created/activated, becomes publicly verifiable) → **Surveillance/Renewal** (recurring, before expiry) → ongoing state changes as needed: **Suspension** (temporary, with defined cause and reinstatement path) / **Withdrawal** (permanent, with defined cause) → all of the above continuously reflected in **Verification** (the public record always shows current true status, including suspended/withdrawn — never silently removed).

Key principle: every transition in this lifecycle is admin/assessor-role-gated, logged, and (where relevant to the applicant) triggers a notification — no state should change silently.

---

## 10. Assumptions

Logged in `PROGRESS.md` → Open Questions Log as well, so they persist across sessions:

1. This may be a demonstration/portfolio build rather than an operating accreditation body — real legal, regulatory, and governance facts have not been provided and will be placeheld until confirmed.
2. Specific accreditation programs/scopes offered by the organisation are not yet defined — Phase 2/3 will use representative placeholder program categories unless real ones are provided.
3. Jurisdiction of operation and any binding regulatory constraints are unknown.
4. No existing brand name, logo, or domain has been provided — Phase 4 will propose an original direction from scratch.
5. Expected operating scale (number of accredited organisations, application volume) is unknown; directory, search, and admin designs will assume moderate scale (tens to low hundreds of accredited organisations) unless corrected — this is a reversible assumption, not a hard constraint.
6. Governance/decision-making model (individual decision-maker vs. panel/committee) is assumed to include a distinct decision step separate from the assessor recommendation, pending confirmation.
7. Payment processing is assumed to be required (accreditation bodies typically charge application/assessment/annual fees) but provider and currency are unconfirmed.

---

## Questions / Decisions Needed

Only the items that genuinely need your input before Phase 2 can be built well:

1. Is this a real organisation preparing to launch, or a demonstration/portfolio project? (Affects how much placeholder vs. real content to plan for.)
2. What accreditation scopes/programs should the platform be built around (even indicative categories are enough to proceed)?
3. Any jurisdiction or existing legal/regulatory constraints to design around?
4. Any existing name, brand, or domain already chosen — or fully greenfield for Phase 4?
5. Rough expected scale — is this closer to a boutique accreditor (dozens of clients) or a larger body (hundreds+)?

You're welcome to answer these now, or say "proceed with placeholders" and I'll carry the assumptions above into Phase 2 and flag them again wherever they materially affect a decision.

---

## Next Phase

**Phase 2 — Information Architecture & Sitemap**: full public + portal sitemap, page inventory, and major user journey maps, built on the audiences, workflows, and functional scope defined above.
