# Phase 6 — Internal Public Pages

Builds on Phases 1–5 (approved). Uses Phase 4 design tokens and extends Phase 3's content strategy with actual copy for pages not yet drafted. All standard page furniture (header, footer, breadcrumbs) from Phases 4–5 applies throughout and isn't repeated per page below.

---

## 1. About: Who We Are (`/about/who-we-are`)

**Layout:** Single-column reading layout (max ~720px content width) — this is a page meant to be read, not scanned as a dashboard.
**Sections:** Intro statement → what we do (accreditation scope categories, linking to Programs) → how we operate (independence from the organisations we accredit) → link out to Governance and Impartiality & Ethics.
**Copy (draft):**
> Meridian Accreditation Board accredits [testing and calibration laboratories, inspection bodies, and certification bodies — PLACEHOLDER] against defined, published criteria. We are structured to make our own accreditation decisions independently of commercial or organisational pressure — see our Governance and Impartiality & Ethics pages for how that independence is maintained.
`[PLACEHOLDER — REQUIRES CONFIRMATION: legal entity name/status, jurisdiction of registration, year established — omit rather than assert until confirmed]`
**CTA:** None forced; secondary links to Governance, Impartiality & Ethics, Contact.
**Trust elements:** Explicit statement of independence; honest placeholder markers rather than invented history.
**UX behaviour:** Static content page; in-page anchor nav if page grows long.

---

## 2. Governance (`/about/governance`)

**Layout:** Structured, not narrative — headings + short paragraphs + a simple org-structure diagram (line-art, per Phase 4 direction).
**Sections:** Decision-making structure (who grants/denies accreditation, and that this role is distinct from the assessor's recommendation — reinforces Phase 1's governance placeholder) → oversight body (if any) → conflict-of-interest policy (link to Resources/Policies) → how governance information is kept current (last-updated date, visible).
**Copy (draft):**
> Accreditation decisions are made by [an authorised decision-maker/panel — PLACEHOLDER: confirm actual governance model] independently of the assessor who conducts the assessment. This separation exists so the person recommending an outcome is never the same person deciding it.
**CTA:** Link to Conflict-of-Interest Policy (Resources), Complaints & Appeals.
**Trust elements:** The assessor/decision-maker separation is stated explicitly and concretely — this is the single most concrete impartiality signal available before real governance facts are confirmed.
**UX behaviour:** Static; "Last reviewed: [date]" visible at page top, consistent with the "currency of information" trust requirement from Phase 1.

---

## 3. Impartiality & Ethics (`/about/impartiality-and-ethics`)

**Layout:** Same reading layout as About.
**Sections:** Impartiality policy summary → conflict-of-interest handling for assessors and decision-makers → how impartiality is monitored/reviewed → link to full policy document (Resources) and to Complaints & Appeals for raising a concern.
**Copy (draft):**
> Assessors and decision-makers disclose any relationship with an applicant that could affect their judgement, and are recused from any case where such a relationship exists. If you believe a decision was affected by a conflict of interest, you can raise it through our Complaints & Appeals process.
**CTA:** "Read the full policy" (Resources) / "Raise a concern" (Complaints & Appeals).
**Trust elements:** Names a concrete mechanism (disclosure + recusal) rather than an abstract claim of impartiality, and points directly to the escalation path.

---

## 4. Accreditation Overview (`/accreditation`)

**Layout:** Expands the homepage's programs + process sections into a full page — intro, then a link into Programs, then a link into How It Works, then Fees.
**Sections:** What accreditation means here → programs (card grid, same component as homepage) → link to full process page → fee guidance summary → apply CTA.
**CTA:** Primary "View Programs," secondary "Read the full process."
**Trust elements:** Same as homepage sections 4–6, expanded with more detail per program category.

---

## 5. How Accreditation Works — full process page (`/accreditation/how-it-works`)

**Layout:** Vertical timeline (not the compressed homepage stepper) — one full section per stage with more detail than the homepage teaser.
**Sections per stage:** Apply (what's required to start) → Review (what's checked, typical duration) → Assessment (what the assessor evaluates, on-site vs. remote where relevant) → Decision (who decides, independent of the assessor — repeated from Governance for anyone landing here directly) → Accreditation (what you receive, how it becomes publicly verifiable) → Ongoing (surveillance/renewal cadence) → what happens on a negative decision (right to appeal, link to Complaints & Appeals).
**CTA:** "View programs" / "Start an application."
**Trust elements:** Explicitly covering the negative-outcome path (what happens if you don't pass) is itself a trust signal — a page that only describes the success path reads as one-sided.
**UX behaviour:** Timeline steps are anchor-linkable (`#assessment`, `#decision`, etc.) so they can be referenced directly (e.g., from FAQs or program pages).

---

## 6. Program Detail Template (`/accreditation/programs/[slug]`)

**Layout:** Header (program name + one-line scope) → tabbed or sectioned body: Overview / Eligibility / Standard or Criteria Referenced / Process & Timeline / Fees / Required Documents.
**Copy pattern (per program):**
> **[Program Name]** accreditation covers [scope]. It is assessed against [standard/criteria — PLACEHOLDER per program], and is intended for organisations that [eligibility summary].
**CTA:** Primary "Apply for this program" → routes to auth/portal application start (per Phase 2 journey 5.1). Secondary "Download program guide" (Resources).
**Trust elements:** Explicit scope boundaries — what's included and, just as importantly, what's *not* covered by this program, so applicants self-select correctly rather than applying for the wrong scope.
**UX behaviour:** Sticky in-page nav (Overview/Eligibility/Criteria/Process/Fees/Documents) on desktop; collapses to a dropdown jump-menu on mobile.

---

## 7. Resources (`/resources`, `/resources/policies`, `/resources/procedures`, `/resources/forms`, `/resources/[slug]`)

**Layout:** Index page — filter bar (type: Policy/Procedure/Form; search) + list/table view (not cards — this is reference material, table density is appropriate here per Phase 4's table-vs-card guidance).
**Columns:** Document title, type, version, effective date (mono), download/view link.
**Detail page (`[slug]`):** Title, version/date metadata prominent at top, document viewer or download, "Related resources" list at bottom.
**CTA:** Download/View.
**Trust elements:** Every document carries a version number and effective date — undated policy PDFs are a common credibility gap in this sector; this page structurally prevents that.
**UX behaviour:** Filterable/sortable table; empty state ("No resources match your filters — try clearing search") follows the microcopy standard.

---

## 8. Training (`/training`, `/training/[slug]`)

**Layout:** Index = card grid (course name, format badge, one-line description, next date). Detail = same sectioned pattern as program pages (Overview/Prerequisites/Format/Dates/Cost/What You Receive).
**Copy note:** Avoid implying a training certificate confers assessor authority it doesn't — state exactly what completion means.
**CTA:** "Register" or "Enquire" depending on format (self-service vs. contact-gated) — `[PLACEHOLDER — REQUIRES CONFIRMATION: which flow applies]`.
**Trust elements:** Explicit prerequisites and honest "what you receive" language.

---

## 9. Contact (`/contact`)

**Layout:** Split layout — left: routed contact form (dropdown: General / Applicant Enquiry / Media / Complaint → routes to Complaints & Appeals / Fraud → routes to Report Fraud), right: direct info (registered address, response-time expectation) and links to the two specialised pages.
**Copy (draft):** "General enquiries are typically answered within [X business days — PLACEHOLDER]." Never promise a response time that hasn't been confirmed as operationally real.
**CTA:** Submit.
**Trust elements:** Routing prevents complaints/fraud reports from getting lost in a general inbox; a real (not "PLACEHOLDER" but honestly *pending*) response-time expectation is more trustworthy than none at all — omit rather than guess if not confirmed.
**UX behaviour:** Selecting "Complaint" or "Fraud" in the dropdown shows an inline notice: "This is better handled on our dedicated [Complaints & Appeals / Report Fraud] page — go there instead?" rather than silently accepting a misrouted message.

---

## 10. FAQs (`/faqs`)

**Layout:** Single page, tab or segmented-control switch by audience (Applicants / Accredited Organisations / Verification Users / Assessors), accordion within each.
**CTA:** Each answer that can't fully resolve the question links to the relevant full page (e.g., a fee question links to `/accreditation/fees`) rather than duplicating content.
**UX behaviour:** Deep-linkable per question (`/faqs#applicants-timeline`) so answers can be shared/referenced directly; search/filter field at top for long lists.

---

## 11. Complaints & Appeals (`/complaints-and-appeals`)

**Layout:** Reading layout + a clear process timeline (similar visual language to How It Works) + a form or contact instruction at the bottom.
**Sections:** What can be raised (a decision, an assessor's conduct, an impartiality concern) → how to submit → what happens next (acknowledgement, review, timeline, outcome) → escalation if unsatisfied with the outcome.
**Copy (draft):** "You may appeal an accreditation decision or raise a complaint about the conduct of an assessor or staff member. We will acknowledge your submission within [X — PLACEHOLDER] and provide an outcome within [X — PLACEHOLDER]."
**CTA:** "Submit a complaint or appeal."
**Trust elements:** A described process with real (once confirmed) timeframes is one of the highest-value trust pages on the entire site per Phase 1 — this page should never feel like an afterthought.

---

## 12. Report Fraud / Impersonation (`/report-fraud`)

**Layout:** Short, direct — this page needs to be usable by someone who is worried/urgent, not browsing.
**Sections:** What counts as misuse (expired/suspended/fabricated accreditation claims, impersonation of Meridian Accreditation Board itself) → how to report (form: what was seen, where, reference number if any, optional contact info) → what happens next.
**Copy (draft):** "If you've seen an accreditation claim that looks fabricated, expired, or misused — or a website or document impersonating Meridian Accreditation Board — tell us. Reports can be submitted anonymously."
**CTA:** "Submit a report."
**Trust elements:** Explicitly allowing anonymous reports lowers the barrier for the exact people most likely to have real information (competitors, disgruntled former clients, whistleblowers).
**UX behaviour:** Confirmation on submit: "Report received. We review all reports; we may not be able to share investigation outcomes, but every report is logged and reviewed." — sets honest expectations rather than implying a personal follow-up that may not happen.

---

## 13. Legal Pages (`/legal/privacy-policy`, `/legal/terms-of-use`, `/legal/accessibility-statement`)

**Layout:** Plain reading layout, table of contents sidebar for long documents, "Last updated" date prominent.
**Content:** `[PLACEHOLDER — REQUIRES CONFIRMATION: actual legal text — this is a legal-review deliverable, not something to draft speculatively]`. Structural placeholders only at this phase: section headings (Information We Collect, How We Use It, Data Retention, Your Rights, Cookies / Contact Us for Privacy; Acceptable Use, Account Terms, Accreditation Mark Usage, Liability, Governing Law for Terms; Accessibility conformance target (e.g., WCAG 2.1 AA), known limitations, contact for accessibility issues for the Accessibility Statement).
**Trust elements (Accessibility Statement specifically):** Stating a real conformance target and *known* limitations honestly is more credible than an unqualified "fully accessible" claim.

---

## Assumptions

1. Legal page body text is explicitly out of scope for this phase (requires real legal review) — only structure/headings are defined.
2. Response-time commitments (Contact, Complaints & Appeals) are placeheld rather than invented — these are operational commitments the organisation has to actually be able to keep.
3. Training registration flow (self-service vs. enquiry-gated) is undecided — spec supports either.

## Questions / Decisions Needed

1. Real response-time commitments for general contact and for complaints/appeals acknowledgement — or proceed with visible placeholders on those two pages specifically, since (unlike the homepage trust strip) these are process pages where a placeholder marker is less damaging than an invented promise?
2. Self-service or enquiry-gated training registration?
3. Who should review/provide real legal text for Privacy/Terms/Accessibility before launch (Phase 15 checklist item, flagging now)?

None block proceeding to Phase 7.

---

## Next Phase

**Phase 7 — Verification Experience**: the public search page, filters, results, empty/error states, and the verification detail page with unambiguous status design (Active/Suspended/Withdrawn/Expired/Not Found).
