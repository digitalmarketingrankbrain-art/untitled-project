# Phase 12 — Database & Data Model

Builds on Phases 1–11 (approved). This is the last design phase before coding (Phase 13). Entities implement the architecture decided in Phase 11: PostgreSQL, enum-typed status fields, a separate curated Verification Record table, and an append-only Audit Log. No implementation yet — this is schema design only.

Notation: **PK** primary key, **FK** foreign key, `enum(...)` fixed status set, *italic* = derived/computed rather than stored where noted.

---

## 1. Identity & Access

### User
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| email | string, unique | |
| name | string | |
| primary_role | `enum(APPLICANT, ASSESSOR, ADMIN)` | A user's primary portal; see AdminPermissionGrant for admin sub-scoping |
| auth_provider_ref | string | External ID from the managed auth provider (Phase 11) — credentials/MFA live there, not in this table |
| mfa_enabled | boolean | |
| status | `enum(ACTIVE, SUSPENDED, LOCKED)` | |
| created_at, updated_at | timestamp | |

**Constraint:** a User has exactly one `primary_role`; multi-role humans (rare — e.g., an admin who is also an assessor) get two separate User records with different emails, deliberately, so RBAC scoping never has to reason about "which hat is this session wearing" ambiguity.

### AdminPermissionGrant
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| user_id | FK → User | must have `primary_role = ADMIN` |
| permission | `enum(FULL_ADMIN, REVIEWER, FINANCE, ...)` | Answers Phase 10's open sub-role question — table exists regardless of whether v1 ships more than one value |
| granted_by_user_id | FK → User | |
| granted_at | timestamp | |

### OrganisationMembership
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| organisation_id | FK → Organisation | |
| user_id | FK → User | must have `primary_role = APPLICANT` |
| membership_role | `enum(PRIMARY_CONTACT, MEMBER)` | |

**Constraint:** exactly one `PRIMARY_CONTACT` per Organisation at a time. Table supports multiple members from day one even though Phase 8 assumed single-login v1 — answers that phase's open question structurally without a later migration.

---

## 2. Organisations & Programs

### Organisation
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| legal_name | string | |
| display_name | string | |
| registration_number | string, nullable | |
| address | string | |
| created_at | timestamp | |

*Status (applicant / accredited / lapsed) is derived from linked Application and AccreditationRecord rows, not stored on Organisation — avoids two sources of truth going out of sync.*

### Program
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| slug | string, unique | Public URL segment, `/accreditation/programs/[slug]` |
| name | string | |
| scope_description | text | |
| standard_reference | string, nullable | Placeholder pending real criteria (Phase 3/6) |
| fee_amount | decimal | |
| currency | string | |
| is_active | boolean | |

### RequiredDocumentType
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| program_id | FK → Program | |
| name | string | e.g. "Quality Manual" |
| description | text | |
| is_mandatory | boolean | |

### AssessmentCriterion
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| program_id | FK → Program | |
| requirement_text | text | |
| category | string, nullable | Groups criteria in the assessor checklist UI (Phase 9) |
| sort_order | integer | |

---

## 3. Applications

### Application
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| reference_number | string, unique | Human-readable, e.g. `MAB-2026-00417` |
| organisation_id | FK → Organisation | |
| program_id | FK → Program | |
| stage | `enum(DRAFT, SUBMITTED, INITIAL_REVIEW, DOCUMENT_REVIEW, ASSESSMENT, DECISION, ACCREDITED, DECLINED)` | Phase 8's canonical lifecycle |
| info_requested | boolean | Sub-state flag (Phase 8) — can be true within INITIAL_REVIEW or DOCUMENT_REVIEW |
| info_request_note | text, nullable | Shown as the applicant-facing banner (Phase 8) |
| submitted_at | timestamp, nullable | |
| created_at, updated_at | timestamp | |

**Constraint:** `stage` transitions are enforced server-side against an explicit allowed-transition map (e.g., `DRAFT → SUBMITTED` valid, `DRAFT → ACCREDITED` invalid) — not left to application code discipline alone; invalid transitions are rejected at the data-access layer (Phase 11 Section 4).

### ApplicationStageHistory
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| application_id | FK → Application | |
| from_stage, to_stage | enum | |
| changed_by_user_id | FK → User | |
| reason | text, nullable | Required for DECLINED transitions specifically |
| changed_at | timestamp | |

*(This table is effectively a filtered view of AuditLog scoped to Application; kept as its own table for fast rendering of the ApplicationTimeline component without scanning the general audit log.)*

### Decision
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| application_id | FK → Application, unique per cycle | |
| decided_by_user_id | FK → User | Must hold decision-making permission — distinct from the assigned assessor (Phase 6/10 governance rule, enforced here: `decided_by_user_id` cannot equal the Assignment's `assessor_id`'s user) |
| outcome | `enum(ACCREDIT, DECLINE, REQUEST_MORE_INFO)` | |
| rationale | text | Required, not optional |
| decided_at | timestamp | |

---

## 4. Assessors, Assignments, Assessments

### Assessor
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| user_id | FK → User, unique | `primary_role = ASSESSOR` |
| bio | text | Internal-facing, used for assignment matching |
| status | `enum(ACTIVE, INACTIVE)` | |

### AssessorCompetence
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| assessor_id | FK → Assessor | |
| program_id | FK → Program | |
| qualifying_basis | text | |
| date_qualified | date | |
| expiry_date | date, nullable | |
| status | `enum(CURRENT, EXPIRING_SOON, EXPIRED)` | *Derived nightly from `expiry_date`, stored for query performance* |
| evidence_document_id | FK → Document, nullable | |

### AssessorAvailability
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| assessor_id | FK → Assessor | |
| start_date, end_date | date | Blackout range |
| note | string, nullable | |

### Assignment
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| application_id | FK → Application | |
| assessor_id | FK → Assessor | |
| status | `enum(PENDING, ACCEPTED, DECLINED, IN_PROGRESS, REPORT_SUBMITTED, COMPLETED)` | |
| assigned_by_user_id | FK → User | |
| assigned_at | timestamp | |
| responded_at | timestamp, nullable | |
| decline_reason | text, nullable | Required if status = DECLINED |
| due_date | date | |

**Constraint:** one *active* (non-declined) Assignment per Application at a time — reassignment sets the prior row's status to a terminal state rather than deleting it, preserving history.

### Assessment
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| assignment_id | FK → Assignment, unique | 1:1 |
| started_at | timestamp, nullable | |
| report_submitted_at | timestamp, nullable | |

### AssessmentFinding
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| assessment_id | FK → Assessment | |
| criterion_id | FK → AssessmentCriterion | |
| finding_status | `enum(CONFORMS, NON_CONFORMANCE, OBSERVATION, NOT_APPLICABLE)` | |
| notes | text | |
| severity | `enum(MINOR, MAJOR)`, nullable | Only meaningful for NON_CONFORMANCE |
| evidence_document_id | FK → Document, nullable | |

**Constraint:** one AssessmentFinding row per (`assessment_id`, `criterion_id`) pair — every checklist item gets exactly one current finding.

---

## 5. Documents

### Document
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| owner_type | `enum(APPLICATION, ASSESSMENT, COMPETENCE, ORGANISATION)` | |
| owner_id | polymorphic reference | |
| document_kind | `enum(REQUIRED_SUBMISSION, EVIDENCE, CREDENTIAL, CERTIFICATE)` | |
| required_document_type_id | FK → RequiredDocumentType, nullable | Set when this document fulfills a specific program requirement |
| current_version_id | FK → DocumentVersion | |
| created_at | timestamp | |

### DocumentVersion
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| document_id | FK → Document | |
| version_number | integer | |
| storage_key | string | S3/R2 object key — never a public URL (Phase 11) |
| filename | string | |
| mime_type | string | |
| size_bytes | integer | |
| uploaded_by_user_id | FK → User | |
| uploaded_at | timestamp | |
| review_status | `enum(UNDER_REVIEW, APPROVED, NEEDS_REVISION)` | |
| review_comment | text, nullable | Shown inline against this specific version (Phase 8) |

**Constraint:** DocumentVersion rows are immutable once created — a "replace" always inserts a new version and repoints `Document.current_version_id`; never an in-place file overwrite.

---

## 6. Accreditation & Verification

### AccreditationRecord
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| accreditation_number | string, unique | Also used as the public reference in `/verify/[reference]` |
| organisation_id | FK → Organisation | |
| program_id | FK → Program | |
| originating_application_id | FK → Application | |
| status | `enum(ACTIVE, SUSPENDED, WITHDRAWN, EXPIRED)` | Phase 7's exact status set |
| effective_date | date | |
| expiry_date | date, nullable | |
| last_surveillance_date | date, nullable | |
| next_renewal_date | date, nullable | |

### AccreditationStatusHistory
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| accreditation_record_id | FK → AccreditationRecord | |
| from_status, to_status | enum | |
| reason | text | Required (Phase 10 Section 0 rule) |
| changed_by_user_id | FK → User | |
| changed_at | timestamp | |

### VerificationRecord
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| accreditation_record_id | FK → AccreditationRecord, unique | 1:1 — the curated public view (Phase 2/10 decision) |
| is_published | boolean | Admin-controlled; unpublished ⇒ public page renders NOT_FOUND regardless of underlying record existing |
| certificate_document_visible | boolean | Answers Phase 7's open question — default `false` (opt-in) unless changed |
| last_synced_at | timestamp | Set whenever whitelisted fields are pulled from AccreditationRecord |

**Design note:** `VerificationRecord` does not duplicate storage of every field — public-facing fields (organisation name, program, status, effective/expiry dates) are read live from `AccreditationRecord` through this record's `accreditation_record_id`, filtered through an explicit whitelist in the data-access layer, not a database view that could accidentally expose a newly-added internal column. `is_published` and `certificate_document_visible` are the only genuinely separate, admin-controlled fields.

---

## 7. Payments

### Invoice
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| invoice_number | string, unique | |
| organisation_id | FK → Organisation | |
| application_id | FK → Application, nullable | |
| accreditation_record_id | FK → AccreditationRecord, nullable | |
| status | `enum(DRAFT, ISSUED, PAID, OVERDUE, VOID)` | |
| amount, currency | decimal, string | |
| issued_at, due_at, paid_at | timestamp, nullable | |
| stripe_invoice_id | string, nullable | |

### InvoiceLineItem
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| invoice_id | FK → Invoice | |
| description | string | |
| amount | decimal | |

### Payment
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| invoice_id | FK → Invoice | |
| amount | decimal | |
| method | `enum(STRIPE, MANUAL)` | |
| stripe_payment_id | string, nullable | |
| recorded_by_user_id | FK → User, nullable | Set for MANUAL only |
| reason | text, nullable | Required for MANUAL (Phase 10 rule) |
| recorded_at | timestamp | |

---

## 8. Communication

### MessageThread
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| context_type | `enum(APPLICATION, ASSIGNMENT)` | Phase 8/9's case-scoped rule enforced structurally — a thread always belongs to exactly one context |
| context_id | polymorphic reference | |
| created_at | timestamp | |

### Message
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| thread_id | FK → MessageThread | |
| sender_user_id | FK → User | |
| body | text | |
| created_at | timestamp | |
| read_at | timestamp, nullable | |

### Notification
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| user_id | FK → User | |
| type | string (template key) | |
| related_type, related_id | polymorphic reference, nullable | |
| channel | `enum(EMAIL, IN_APP)` | |
| status | `enum(PENDING, SENT, FAILED)` | |
| sent_at | timestamp, nullable | |
| read_at | timestamp, nullable | In-app only |

### NotificationTemplate
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| key | string, unique | |
| subject | string | |
| body_template | text | Admin-editable (Phase 10) |
| updated_by_user_id | FK → User | |
| updated_at | timestamp | |

---

## 9. Content (Resources, News, Training)

### Resource
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| title | string | |
| type | `enum(POLICY, PROCEDURE, FORM)` | |
| version | string | Required (Phase 6 trust rule) |
| effective_date | date | Required |
| storage_key | string | |
| is_active | boolean | |
| published_by_user_id | FK → User | |

### NewsArticle
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| title, slug | string | |
| category | `enum(ROUTINE, STATUS_CHANGE)` | Drives the badge color on the public News list (Phase 5/6) |
| body | text | |
| published_at | timestamp | |
| published_by_user_id | FK → User | |

### TrainingCourse / TrainingRegistration
Standard listing + registration pair; `[PLACEHOLDER — REQUIRES CONFIRMATION: self-service vs. enquiry-gated per Phase 6]` determines whether `TrainingRegistration.status` supports an auto-CONFIRMED path or only PENDING → admin action.

---

## 10. Trust & Safety

### ComplaintOrReport
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| type | `enum(COMPLAINT, APPEAL, FRAUD_REPORT)` | |
| related_accreditation_record_id | FK → AccreditationRecord, nullable | |
| submitted_by_user_id | FK → User, nullable | Nullable specifically to support anonymous fraud reports (Phase 6) |
| description | text | |
| status | `enum(RECEIVED, UNDER_REVIEW, RESOLVED)` | |
| assigned_to_user_id | FK → User, nullable | |
| created_at | timestamp | |

---

## 11. Audit

### AuditLog
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| actor_user_id | FK → User, nullable | Null only for system/scheduled-job actions |
| actor_role | enum, snapshot at time of action | Stored redundantly (not just joined from User) so a later role change doesn't rewrite history |
| action | string | e.g. `application.stage_changed`, `accreditation.suspended` |
| target_type, target_id | string, polymorphic reference | |
| before, after | JSON, nullable | |
| ip_address | string, nullable | |
| created_at | timestamp | |

**Constraint (Phase 11 carried through):** the database role used by the application has `INSERT` but not `UPDATE`/`DELETE` on this table. No application code path is permitted to modify or delete an audit entry, by database grant, not just convention.

---

## 12. Key Relationships Summary

```
Organisation 1—* Application *—1 Program
Application 1—1 Decision
Application 1—* ApplicationStageHistory
Application 1—* Assignment *—1 Assessor
Assignment 1—1 Assessment 1—* AssessmentFinding *—1 AssessmentCriterion *—1 Program
Application/Assessment 1—* Document 1—* DocumentVersion
Application 1—0..1 AccreditationRecord (on ACCREDIT decision)
AccreditationRecord 1—1 VerificationRecord
AccreditationRecord 1—* AccreditationStatusHistory
Organisation 1—* Invoice 1—* InvoiceLineItem
Invoice 1—* Payment
Application|Assignment 1—1 MessageThread 1—* Message
User 1—* Notification
Every mutating action —> 1 AuditLog entry
```

---

## 13. Assumptions

1. `AccreditationRecord` and `VerificationRecord` remain 1:1 (one accreditation per organisation/program pair at a time) — a renewed accreditation updates the existing record's dates rather than creating a new row, preserving one stable public reference number across renewals. Revisit if the org needs multiple concurrent accreditations under the *same* program (unusual) rather than across different programs (already supported).
2. `certificate_document_visible` defaults to `false` (opt-in), per Phase 7's still-open question — trivially flippable once confirmed.
3. Expired records are retained indefinitely by default (no automatic deletion) since Phase 7's retention-window question is unresolved — a retention job can be added later without a schema change (it would just filter/archive existing rows).

## 14. Questions / Decisions Needed

Carries forward from Phase 7/8/10 (certificate visibility default, Expired retention window, admin sub-role set, training registration flow) — all now have concrete schema defaults above and are trivially adjustable, so **none block proceeding to Phase 13.**

---

## Next Phase

**Phase 13 — Development.** Per the project's phased build order: project setup → design system → public layout → homepage → public pages → verification → authentication → applicant portal → assessor portal → admin portal → database → APIs → document system → notifications → payments → audit logging → security hardening. Built and shown one milestone at a time, each with its own review/approval gate — not generated in one pass.
