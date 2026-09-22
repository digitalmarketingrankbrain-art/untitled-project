# Phase 7 — Verification Experience

Builds on Phases 1–6 (approved). This is the platform's single highest-trust feature (Phase 1, Section 1) — every design decision here is evaluated against one question: **could this be mistaken for a valid result when it isn't?** If yes, redesign it.

---

## 1. URL Structure

```
/verify                       Search page
/verify?q=[query]             Search page with results (query in URL — shareable/bookmarkable search)
/verify/[reference]           Verification detail — reference is the accreditation/certificate number, e.g. /verify/MAB-2024-00417
```

**Decision:** the reference itself is the URL slug, not an opaque internal ID — this is intentional. A certificate or QR code can point directly at `/verify/MAB-2024-00417` and the page will either resolve to a real record or clearly show Not Found; there's no intermediate lookup step required for the single-record case. Search (`/verify?q=`) remains the entry point for anyone who only has a name, not a number.

---

## 2. Search Page (`/verify`)

**Layout:** Centered, focused — this page has one job. Large search input (autofocus, per Phase 5's note that only the dedicated `/verify` page autofocuses, not the homepage), a visible toggle/tabs for search mode: **Accreditation Number** / **Organisation Name**, and an optional (Should-Have) **Scope/Category** filter shown once a name search returns multiple results rather than as an upfront filter (keeps the initial page simple).

**Search behaviour:**
- Accreditation number search: exact/near-exact match → if one match, may offer direct "View result" or auto-navigate to `/verify/[reference]`, no ambiguity to resolve.
- Organisation name search: fuzzy match → results list (see below), since names can be ambiguous (multiple scopes, similar names, historical name changes).
- Query synced to URL (`?q=`) so a search can be bookmarked/shared without needing to re-type it.

**Results list (name search, multiple matches):**
Each result row: organisation name, accreditation number (mono), program/scope, **status badge** (see Section 4 — status is visible in the list, not hidden until you click through), effective date. Click-through to `/verify/[reference]`.

**Empty state (search returns nothing):**
> "No accreditation records matched '[query]'. Check the spelling or accreditation number, or try searching by organisation name instead of number (or vice versa)."
Includes a link to Report Fraud: *"If you were shown this as a valid accreditation and it isn't listed here, you can report it."*

**Error state (search fails — service error, not "no results"):**
> "We couldn't complete this search right now. Your search wasn't lost — try again in a moment, or contact us if this keeps happening."
Deliberately distinct wording and visual treatment from the empty/no-results state — a **system failure** must never look like a **"no such record" answer**, since a user could wrongly conclude a real, valid accreditation doesn't exist because of a transient error.

**Abuse protection (ties to Phase 1 security requirements):** rate limiting on search requests; bot protection (e.g., invisible challenge, not a user-hostile CAPTCHA-on-every-search) on repeated/automated-pattern queries; no bulk/scrapable export of the full record set via this UI (a public API is Future-scope, Phase 1 Section 5, and would be designed separately with its own rate limits).

---

## 3. Verification Detail Page (`/verify/[reference]`)

### 3.1 Content fields (all states except Not Found)
- Organisation name
- Accreditation number (mono, prominent)
- Program/scope (with a link back to the program page)
- **Status** (see Section 4 — the single most visually dominant element on the page)
- Effective/issued date
- Relevant dates: expiry or next renewal date, last surveillance/assessment date where applicable
- Certificate/document link, if the org has opted to make it available `[PLACEHOLDER — confirm whether certificate PDFs are public by default or opt-in]`
- Verification reference and a **permalink + "Copy link"** action, so this exact result can be cited/shared
- "Last verified against our records: [timestamp]" — reinforces this is a live lookup, not a cached badge image

### 3.2 Status design (the core of this phase)

Every status uses **color + icon + a large text label + a one-sentence plain-language explanation** — never color alone, never a bare word.

| Status | Badge color (Phase 4 tokens) | Icon | Label | Explanation copy |
|---|---|---|---|---|
| **ACTIVE** | `success` | check-circle | "Active" | "This is a current, active accreditation record." |
| **SUSPENDED** | `warning` | pause-circle / alert | "Suspended" | "This accreditation is currently suspended. The organisation may not represent this accreditation as active during suspension. Contact us if you need details on the reason or expected duration." |
| **WITHDRAWN** | `error` | x-circle | "Withdrawn" | "This accreditation has been withdrawn and is no longer valid. Any current claim of this accreditation by this organisation should not be relied upon." |
| **EXPIRED** | `info` (neutral) | clock | "Expired" | "This accreditation has expired and was not renewed. It was valid from [date] to [date]." |
| **NOT FOUND** | neutral gray, structurally distinct (Section 3.3) | search/question | "No matching record found" | "No matching public accreditation record was found for '[reference/query]'. Check the reference number, or search by organisation name." |

**Never shown:** a bare "Verified" badge/word anywhere on the platform, per the project's verification trust rule — every positive result is labeled "Active," specifically, with its explanation.

### 3.3 Not Found — structural distinction, not just color

This is the most important design rule in this phase: **a Not Found result must be structurally incapable of being mistaken for a valid one at a glance**, including by someone skimming a screenshot or a low-attention mobile glance. Concretely:

- Not Found does **not** use the same card/panel layout as a real record (no organisation-name header, no populated date fields, no certificate link area) — it's a distinctly simpler, shorter layout: icon, heading, explanation, search-again prompt. There is no empty/dashed placeholder mimicking the real record's field layout.
- Not Found does **not** use any of the four semantic status badge shapes (success/warning/error/info) — it gets its own neutral gray treatment so it can never be confused with Expired (also neutral-toned) at a glance; label text "No matching record found" is deliberately different in structure from the other four one-word labels.
- Not Found page includes a direct link to **Report Fraud**, since a "not found" result for a claim someone was shown elsewhere is exactly the scenario that page exists for.

### 3.4 Layout (Active/Suspended/Withdrawn/Expired — shared structure)

Header band: status badge (large, top of page, above the organisation name — status is the first thing read, not buried below identity details) → organisation name → accreditation number. Body: two-column detail grid (labels left, mono values right) for program, dates, scope. Footer of card: permalink/copy-link action, "Last verified" timestamp, certificate link if applicable.

**Mobile:** Single column throughout; status badge remains the first element, full-width, before any other content — mobile users skimming a shared link must see status without scrolling.

---

## 4. Interaction & Trust Behaviours

- **No login required** anywhere in this flow (Phase 1 requirement — verification users should never hit an auth wall).
- **Printable/shareable view**: a simple "Print this page" affordance producing a clean, dated printout — useful for someone needing to keep a paper record of a verification check they performed.
- **QR-code-originated visits**: if a physical certificate carries a QR code pointing at `/verify/[reference]`, the page behaves identically to a typed-URL visit — no special "you scanned a QR code" framing needed, since the trust value is in the page being identical regardless of entry point.
- **Caching caution**: status must reflect current data on every load (no aggressive static caching of individual verification pages) — a cached "Active" page served after a same-day suspension would be actively harmful; short cache TTL or on-demand revalidation only.

---

## 5. Assumptions

1. Certificate PDF visibility (public by default vs. opt-in per accredited organisation) is unconfirmed — flagged for Phase 12 data model.
2. A public verification API is out of scope for this phase (Future, per Phase 1) but the reference-as-URL-slug pattern here is intentionally API-friendly if built later.

## 6. Questions / Decisions Needed

1. Should certificate documents be publicly viewable on the verification page by default, or only shown once the accredited organisation opts in?
2. Any preference on whether Expired records show for a limited retention window (e.g., 2 years post-expiry) versus indefinitely? Affects Phase 12 data retention design.

Neither blocks proceeding to Phase 8.

---

## Next Phase

**Phase 8 — Applicant Portal UX**: authenticated applicant dashboard and the full application workflow (Draft → Submitted → Review → Assessment → Decision → Completed), including document upload, comments, and progress tracking.
