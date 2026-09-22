# Phase 2 — Information Architecture & Sitemap

Builds on Phase 1 (approved 2026-09-09, proceeding with logged placeholder assumptions — see `PROGRESS.md` Open Questions Log). Nothing here depends on those questions being resolved; where an answer would change structure, it's flagged inline.

---

## 1. Public Sitemap

```
/ (Home)

/about
  /about/who-we-are
  /about/governance
  /about/impartiality-and-ethics
  /about/history                        [optional — only if real dates exist; omitted from nav until confirmed]

/accreditation
  /accreditation                        (Overview — what accreditation is, why it matters)
  /accreditation/how-it-works           (Process: Apply → Review → Assess → Decide → Accredited → Renew)
  /accreditation/programs               (Programs index — cards linking to each scope)
  /accreditation/programs/[program-slug]  (One detail page per accreditation program/scope)
  /accreditation/fees                   (Fee structure or fee guidance)
  /apply                  (CTA landing → routes to portal application start / login)

/verify                                 (Verification search — see Phase 7)
/verify/[reference]                     (Verification detail — dynamic, see Phase 7)

/resources
  /resources                            (Library index — filterable by type)
  /resources/policies
  /resources/procedures
  /resources/forms                      (Application documents, templates, checklists)
  /resources/[resource-slug]            (Individual resource detail/download page)

/training
  /training                             (Course listing)
  /training/[course-slug]               (Course detail + register/enquire)

/news                                   (News & Notices — includes suspensions/withdrawals, policy changes)
/news/[article-slug]

/faqs                                   (Structured by audience: Applicants / Accredited Orgs / Verification Users / Assessors)

/assessors/become-an-assessor           (Prospective assessor info + apply CTA)

/contact                                (Role-routed: general / applicant enquiry / media / complaint / fraud)
/complaints-and-appeals
/report-fraud                           (Report suspected fraudulent/impersonated accreditation claims)

/legal/privacy-policy
/legal/terms-of-use
/legal/accessibility-statement

/login
/register                               (Applicant/org account creation — distinct from internal Admin/Assessor provisioning)
/forgot-password
```

**Structural decisions vs. the reference's flatter model:**
- **Verification gets top-level `/verify`**, not nested under Accreditation — it's the single highest-traffic, highest-trust page per Phase 1, and burying it under a sub-nav costs trust with a visitor who has ten seconds of patience.
- **Governance and Impartiality/Ethics are separate pages under About**, not folded into one "About Us" wall of text — Phase 1 identified governance disclosure and impartiality safeguards as distinct trust signals visitors specifically look for.
- **Fraud reporting is a first-class top-level page** (`/report-fraud`), not buried in Contact — Phase 1 problem #6 ("How do I report misuse?") needs to be findable without knowing it's a contact-form sub-option.
- **`/apply` is a routing page, not a form** — it explains what happens next and hands off to auth/portal, keeping the marketing site and the transactional portal cleanly separated.

`[PLACEHOLDER — REQUIRES CONFIRMATION]` — program slugs under `/accreditation/programs/` are placeholders (see Section 1.1) pending real scope definitions.

### 1.1 Placeholder accreditation programs

No real scopes were provided in Phase 1. To keep the sitemap and later phases concrete, these representative, industry-standard accreditation categories are used as placeholders (common across accreditation bodies generally, not copied from the reference site's specific naming):

- Testing & Calibration Laboratories
- Inspection Bodies
- Management Systems Certification Bodies
- Product Certification Bodies
- Certification Bodies for Persons

Each gets one `/accreditation/programs/[slug]` page. Swap, rename, add, or remove freely once real scopes are confirmed — this only affects content, not the URL structure or template.

---

## 2. Portal Sitemap

### 2.1 Shared
```
/portal/login          (may be same as public /login with role-based redirect)
/portal/mfa-setup
/portal/mfa-challenge
```

### 2.2 Applicant
```
/portal/applicant/dashboard
/portal/applicant/applications                     (list)
/portal/applicant/applications/[id]                 (detail: status, timeline, actions required)
/portal/applicant/applications/[id]/documents
/portal/applicant/applications/[id]/assessments      (read-only view of assigned assessment progress)
/portal/applicant/applications/[id]/messages
/portal/applicant/invoices
/portal/applicant/invoices/[id]
/portal/applicant/accreditation                      (their active accreditation record(s))
/portal/applicant/accreditation/[id]/renewal
/portal/applicant/profile
/portal/applicant/security                           (password, MFA, sessions)
```

### 2.3 Assessor
```
/portal/assessor/dashboard
/portal/assessor/profile
/portal/assessor/competence                           (competence areas/credentials on file)
/portal/assessor/availability
/portal/assessor/assignments                          (list: pending, accepted, in progress, completed)
/portal/assessor/assignments/[id]                      (assessment workspace: documents, checklist, findings, evidence)
/portal/assessor/assignments/[id]/report
/portal/assessor/messages
```

### 2.4 Admin
```
/portal/admin/dashboard
/portal/admin/applications
/portal/admin/applications/[id]
/portal/admin/organisations
/portal/admin/organisations/[id]
/portal/admin/assessors
/portal/admin/assessors/[id]
/portal/admin/assessments
/portal/admin/assessments/[id]
/portal/admin/accreditation-records
/portal/admin/accreditation-records/[id]
/portal/admin/verification-records                     (what the public sees at /verify — admin-managed source of truth)
/portal/admin/documents
/portal/admin/payments
/portal/admin/notifications                             (system notification templates/log)
/portal/admin/resources                                 (CMS for /resources)
/portal/admin/news                                       (CMS for /news)
/portal/admin/users
/portal/admin/roles
/portal/admin/audit-logs
/portal/admin/settings
```

**Structural decision:** `/portal/admin/verification-records` is modeled as a distinct entity from `/portal/admin/accreditation-records`, even though every verification record is backed by an accreditation record. This separation matters because *what's publicly displayed* (verification record) should be a deliberately-curated, admin-controlled public view — not an automatic mirror of every internal field on the accreditation record. Confirmed further in Phase 12 data model.

---

## 3. Page Inventory Summary

| Section | Page count (public) | Notes |
|---|---|---|
| Home | 1 | |
| About/Governance | 3–4 | History page conditional |
| Accreditation | 3 + N programs | N = 5 placeholder programs |
| Verification | 2 | Search + dynamic detail |
| Resources | 2 + N | Index + dynamic detail per resource |
| Training | 2 + N | Index + dynamic detail per course |
| News | 2 + N | Index + dynamic detail per article |
| FAQs | 1 | Audience-segmented on one page (tabs/accordion), not split into 4 URLs — avoids thin pages |
| Assessors (prospective) | 1 | |
| Contact/Complaints/Fraud | 3 | |
| Legal | 3 | |
| Auth | 3 | |

Portal: 12 Applicant pages, 8 Assessor pages, 18 Admin pages (counting list+detail as 2 where applicable).

This is deliberately lean — every page maps to a Phase 1 audience need or Must/Should-Have functional requirement. Nothing was added for SEO padding or "looks more complete" reasons, per the project's anti-thin-content rule.

---

## 4. Primary Navigation Structure

**Header (public):**
- Logo/Home
- Accreditation (mega menu: How It Works, Programs list, Fees)
- Verify (single link — not a dropdown, it's a single-purpose destination)
- About (dropdown: Who We Are, Governance, Impartiality & Ethics)
- Resources (dropdown: Policies, Procedures, Forms, Training)
- News
- Contact
- **Primary CTA button:** "Verify an Accreditation" or "Apply" depending on page context (see Phase 5)
- **Secondary:** "Log In" (portal)

**Footer (public):** sitemap-style link columns (Accreditation, About, Resources, Legal, Contact) + complaints/appeals + report fraud + accessibility statement + social/registered-entity info where available.

**Portal nav:** left sidebar, role-scoped (Applicant sees only Applicant items, etc.), persistent across all portal pages — no mega menus in-portal; this is a task tool, not a marketing surface.

---

## 5. Major User Journeys

### 5.1 New applicant → submitted application
`Home → Accreditation (Programs) → [Program detail] → How It Works → Apply CTA → Register/Login → Applicant Dashboard → New Application → Draft (save progress) → Upload documents → Submit`
Key UX requirement: the applicant should never need to leave the portal to find out what document they're missing — required documents are listed with status against each application.

### 5.2 Verification (relying party)
`Home (or direct link from a certificate/QR code) → /verify → Search by reference/org name → Result: status page`
No login. No dead ends. A "Not Found" result must give the user something to do next (double-check reference, contact us) — never a bare 404-style message. See Phase 7.

### 5.3 Existing accredited organisation → renewal
`Login → Applicant Dashboard (renewal flagged as required action) → Accreditation record → Renewal flow (may reuse Application flow components) → Submit → Track through Assessment → Decision`

### 5.4 Prospective assessor → application
`Home or /assessors/become-an-assessor → Apply CTA → Register/Login → Assessor application form (competence, credentials) → Submit → Admin review (outside assessor's own portal until approved)`

### 5.5 Admin processing an application
`Admin Dashboard (queue) → Application detail → Assign assessor → (Assessor completes assessment) → Review findings/report → Record decision → Accreditation record created/activated → Verification record published`
Every step logged to audit log automatically; no separate manual "log this" action for admins.

### 5.6 Fraud/impersonation report
`Any page (footer link) or /report-fraud directly → Report form (what was seen, where, reference number if any) → Submitted → Routed to admin (not a public queue)`

### 5.7 General visitor establishing trust
`Home → About/Governance or Impartiality & Ethics → (optionally) Complaints & Appeals → decides to proceed or leave`
This is the "silent" journey — most visitors doing this never contact anyone; the pages themselves have to do the convincing. Directly informs Phase 5/6 content requirements.

---

## 6. Assumptions

1. Program taxonomy (Section 1.1) is placeholder pending real scopes — swappable without structural impact.
2. FAQs are consolidated on one audience-segmented page rather than four separate URLs, to avoid thin/duplicate content; revisit if FAQ volume grows large enough to need SEO-indexed separation.
3. `/register` is for applicant/organisation self-service signup; Assessor and Admin accounts are assumed to be provisioned/invited internally rather than self-registered, consistent with Phase 1's RBAC model — flagged for confirmation.
4. Verification records are modeled as admin-curated public views distinct from full internal accreditation records (Section 2.4 note) — carries into Phase 12.

## 7. Questions / Decisions Needed

1. Should Assessor accounts be self-service "apply then get approved" (as journey 5.4 assumes) or strictly invite-only? Affects whether `/assessors/become-an-assessor` needs a real application form vs. just an expression-of-interest form.
2. Any preference on whether Training is a permanent nav item or can be deferred visually until real courses exist (it's still built as Should-Have, just a nav-placement question)?

Proceed with the assumptions above if no changes needed.

---

## Next Phase

**Phase 3 — Content Strategy & Trustworthy Copy**: page-by-page content objectives and actual draft copy (starting with Homepage), written in the institutional, non-hype tone established in Phase 1, with `[PLACEHOLDER — REQUIRES CONFIRMATION]` markers on any unverified factual claim.
