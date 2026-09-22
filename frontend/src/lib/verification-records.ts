export type VerificationStatus = "ACTIVE" | "SUSPENDED" | "WITHDRAWN" | "CANCELLED" | "EXPIRED";

export interface VerificationStatusHistoryEntry {
  from: VerificationStatus;
  to: VerificationStatus;
  reason: string;
  changedBy: string;
  changedAt: string;
}

export interface VerificationRecord {
  /** Accreditation number — also the public URL slug at /verify/[reference]. */
  reference: string;
  organisationName: string;
  programSlug: string;
  programName: string;
  status: VerificationStatus;
  effectiveDate: string;
  expiryDate: string | null;
  lastSurveillanceDate: string | null;
  nextRenewalDate: string | null;
  certificateVisible: boolean;
  /**
   * Admin-controlled — unpublished renders NOT_FOUND on the public page
   * regardless of the underlying record existing (Phase 10/12).
   */
  isPublished: boolean;
  statusHistory: VerificationStatusHistoryEntry[];
}

/**
 * Plain-language explanation shown alongside every status per Phase 7 — a
 * bare status word is never shown without this. EXPIRED's copy is a
 * template filled with the record's own dates at render time.
 */
export const STATUS_EXPLANATION: Record<VerificationStatus, string> = {
  ACTIVE: "This is a current, active accreditation record.",
  SUSPENDED:
    "This accreditation is currently suspended. The organisation may not represent this accreditation as active during suspension. Contact us if you need details on the reason or expected duration.",
  WITHDRAWN:
    "This accreditation has been withdrawn and is no longer valid. Any current claim of this accreditation by this organisation should not be relied upon.",
  CANCELLED:
    "This accreditation has been cancelled and is no longer valid. Any current claim of this accreditation by this organisation should not be relied upon.",
  EXPIRED: "This accreditation has expired and was not renewed.",
};
